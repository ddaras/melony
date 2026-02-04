import { MelonyPlugin } from "melony";
import { z } from "zod";
import { chromium, Browser, BrowserContext, Page } from "playwright";
import { generateText, LanguageModel, Output } from "ai";

export const browserToolDefinitions = {
  browser_act: {
    description: "Perform a browser action like clicking, typing, or navigating...",
    inputSchema: z.object({
      instruction: z.string().describe("The action to perform, e.g., 'click the login button' or 'type pizza in search'"),
    }),
  },
  browser_extract: {
    description: "Extract structured data from the page using natural language instructions",
    inputSchema: z.object({
      instruction: z.string().describe("What data to extract, e.g., 'get all product titles and prices'"),
    }),
  },
  browser_observe: {
    description: "Observe the current page and get a list of possible actions in natural language",
    inputSchema: z.object({}),
  },
  browser_state_update: {
    description: "Update the current state of the browser",
    inputSchema: z.object({}),
  },
};

export interface BrowserPluginOptions {
  headless?: boolean;
  maxContentLength?: number;
  userDataDir?: string;
  channel?: string;
  model?: LanguageModel; // Required for smart features (act, extract, observe)
}

/**
 * Manages the Playwright browser and its pages.
 */
class BrowserManager {
  private browser: Browser | undefined;
  private context: BrowserContext | undefined;
  private pages: Page[] = [];
  private headless: boolean;
  private userDataDir: string;

  constructor(private options: BrowserPluginOptions) {
    this.headless = this.options.headless ?? true;
    this.userDataDir = this.options.userDataDir ?? '';
  }

  async ensureBrowser(headlessOverride?: boolean) {
    if (headlessOverride !== undefined) {
      this.headless = headlessOverride;
    }
    if (!this.browser) {
      if (this.userDataDir) {
        this.context = await chromium.launchPersistentContext(this.userDataDir, {
          headless: this.headless,
          channel: this.options.channel,
        });
        this.browser = this.context.browser() ?? undefined;
        this.pages = this.context.pages();
      } else {
        this.browser = await chromium.launch({
          headless: this.headless,
          channel: this.options.channel,
        });
        this.context = await this.browser.newContext();
      }
    }
    return this.browser;
  }

  async ensurePage(headlessOverride?: boolean) {
    await this.ensureBrowser(headlessOverride);
    if (this.pages.length === 0) {
      const page = await this.context!.newPage();
      this.pages.push(page);
    }
    return this.pages[0];
  }

  getPages() {
    return this.pages;
  }

  async cleanup() {
    if (this.context) {
      await this.context.close();
    } else if (this.browser) {
      await this.browser.close();
    }
    this.browser = undefined;
    this.context = undefined;
    this.pages = [];
  }

  isHeadless() {
    return this.headless;
  }

  async relaunch(headlessOverride: boolean) {
    await this.cleanup();
    await this.ensureBrowser(headlessOverride);
  }
}

/**
 * Smart Browser functionality (Stagehand-style)
 */
class SmartBrowser {
  constructor(private model: LanguageModel | undefined, private manager: BrowserManager) { }

  /**
   * Captures the accessibility tree and simplifies it for the LLM.
   * Also injects IDs into the DOM and draws visual annotations for screenshots.
   */
  public async injectActionIds(page: Page, annotate: boolean = false) {
    await page.evaluate(({ annotate }) => {
      // 1. Clear existing IDs and annotations
      document.querySelectorAll('[data-melony-id]').forEach(el => el.removeAttribute('data-melony-id'));
      document.querySelectorAll('.melony-annotation').forEach(el => el.remove());

      // 2. Identify interactive elements
      const interactiveSelector = 'button, a, input, select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="menuitem"], [role="tab"], [role="treeitem"], [role="option"], [role="switch"], [role="radio"], [contenteditable="true"]';
      const interactiveElements = Array.from(document.querySelectorAll(interactiveSelector));

      let id = 0;
      interactiveElements.forEach((el) => {
        // Only assign ID if visible or likely to be reachable
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return;

        const melonyId = String(id++);
        el.setAttribute('data-melony-id', melonyId);

        // 3. Draw visual annotations if requested
        if (annotate) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const label = document.createElement('div');
            label.className = 'melony-annotation';
            label.textContent = melonyId;
            Object.assign(label.style, {
              position: 'fixed',
              top: `${rect.top}px`,
              left: `${rect.left}px`,
              background: 'red',
              color: 'white',
              fontSize: '10px',
              padding: '1px 3px',
              borderRadius: '3px',
              zIndex: '1000000',
              pointerEvents: 'none',
              fontWeight: 'bold',
              border: '1px solid white'
            });
            document.body.appendChild(label);
          }
        }
      });
    }, { annotate });
  }

  public async cleanupAnnotations(page: Page) {
    await page.evaluate(() => {
      document.querySelectorAll('.melony-annotation').forEach(el => el.remove());
    });
  }

  private async clickById(page: Page, elementId: string) {
    const locator = page.locator(`[data-melony-id="${elementId}"]`).first();
    await locator.waitFor({ state: "attached", timeout: 10000 });
    await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => { });
    await locator.click({ timeout: 10000 });
  }

  private async typeById(page: Page, elementId: string, text: string) {
    const locator = page.locator(`[data-melony-id="${elementId}"]`).first();
    await locator.waitFor({ state: "attached", timeout: 10000 });
    await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => { });
    await locator.fill(text, { timeout: 10000 });
  }

  private async scroll(page: Page, direction: 'up' | 'down') {
    const amount = direction === 'up' ? -window.innerHeight * 0.8 : window.innerHeight * 0.8;
    await page.evaluate((y) => window.scrollBy(0, y), amount);
    await page.waitForTimeout(500);
  }

  private async waitForStable(page: Page) {
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 3000 });
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => { });
      // Wait for any potential "loading" or "busy" states to clear
      await page.waitForFunction(() => {
        const isBusy = document.querySelector('[aria-busy="true"], .loading, .spinner');
        return !isBusy;
      }, { timeout: 2000 }).catch(() => { });
    } catch (e) { }
    await page.waitForTimeout(500);
  }

  async getPageMap(page: Page) {
    await this.injectActionIds(page);

    return await page.evaluate(() => {
      const vWidth = window.innerWidth;
      const vHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const totalHeight = document.body.scrollHeight;
      const MAX_NODES = 1500;
      let nodesCount = 0;

      const getSectionType = (el: Element, style: CSSStyleDeclaration) => {
        const tagName = el.tagName;
        const role = el.getAttribute('role');
        const id = (el.id || '').toLowerCase();
        const className = (typeof el.className === 'string' ? el.className : '').toLowerCase();

        if (tagName === 'HEADER' || role === 'banner') return 'header';
        if (tagName === 'FOOTER' || role === 'contentinfo') return 'footer';
        if (tagName === 'NAV' || role === 'navigation') return 'navigation';
        if (tagName === 'MAIN' || role === 'main') return 'main';
        if (tagName === 'ASIDE' || role === 'complementary' || id.includes('sidebar') || className.includes('sidebar')) return 'sidebar';
        if (role === 'dialog' || role === 'alertdialog' || className.includes('modal') || className.includes('popup')) return 'popups';

        if (style.position === 'fixed' || style.position === 'sticky') {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 50 && rect.width > vWidth * 0.8) return 'header';
          if (rect.bottom >= vHeight - 50 && rect.width > vWidth * 0.8) return 'footer';
        }
        return null;
      };

      const sections: Record<string, any[]> = {
        header: [],
        sidebar: [],
        navigation: [],
        main: [],
        footer: [],
        popups: [],
        other: []
      };

      const buildTree = (el: Element, depth = 0, currentSection?: string): any => {
        if (nodesCount > MAX_NODES || depth > 15) return null;
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'IFRAME'].includes(el.tagName)) return null;

        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || el.getAttribute('aria-hidden') === 'true') return null;

        const rect = el.getBoundingClientRect();
        const inViewport = rect.bottom > 0 && rect.right > 0 && rect.top < vHeight && rect.left < vWidth;

        // Pruning: if it's very far from viewport and not a main section, skip it
        if (!inViewport && rect.top > vHeight * 3) return null;

        const melonyId = el.getAttribute('data-melony-id');
        const isInteractive = !!melonyId;
        const role = el.getAttribute('role');
        const isHeading = /^H[1-6]$/.test(el.tagName);

        const directText = Array.from(el.childNodes)
          .filter(node => node.nodeType === 3 && node.textContent?.trim())
          .map(node => node.textContent?.trim())
          .join(' ');

        const sectionType = depth < 6 ? getSectionType(el, style) : null;
        const activeSection = sectionType || currentSection || 'other';

        const children = Array.from(el.children)
          .map(c => buildTree(c, depth + 1, activeSection))
          .filter(Boolean);

        const interestingRoles = ['heading', 'img', 'alert', 'dialog', 'status', 'gridcell', 'list'];
        const isInteresting = isInteractive || isHeading || directText || children.length > 0 || interestingRoles.includes(role || '');

        if (!isInteresting && !el.getAttribute('aria-label') && !el.getAttribute('title')) return null;

        // Flatten container-only nodes
        if (!isInteractive && !directText && children.length === 1 && !sectionType && !isHeading && !role) {
          return children[0];
        }

        nodesCount++;
        const node: any = {
          tag: el.tagName,
          id: melonyId || undefined,
          text: (isInteractive || isHeading) ? (el as HTMLElement).innerText?.trim().slice(0, 100) : (directText || undefined),
          role: role || undefined,
          label: el.getAttribute('aria-label') || el.getAttribute('title') || undefined,
          inViewport
        };

        if (el.tagName === 'INPUT') {
          node.type = (el as HTMLInputElement).type;
          node.value = (el as HTMLInputElement).value;
        }

        if (children.length > 0) node.children = children;

        if (sectionType && depth < 6) {
          sections[sectionType].push(node);
          return null; // Don't return to parent tree if it's a root section
        }

        return node;
      };

      const otherNodes = buildTree(document.body);
      if (otherNodes) sections.other.push(otherNodes);

      return {
        url: window.location.href,
        title: document.title,
        scroll: {
          y: scrollY,
          percentage: Math.round((scrollY / (totalHeight - vHeight || 1)) * 100),
          totalHeight
        },
        sections: Object.fromEntries(Object.entries(sections).filter(([_, v]) => v.length > 0))
      };
    });
  }

  async act(page: Page, instruction: string) {
    if (!this.model) throw new Error("LanguageModel required for 'act'");

    const actionSchema = z.object({
      action: z.enum(['click', 'type', 'press', 'wait', 'navigate', 'scroll', 'done']),
      elementId: z.string().nullable().describe("ID from the DOM tree"),
      text: z.string().nullable().describe("Text for 'type'"),
      key: z.string().nullable().describe("Key for 'press'"),
      url: z.string().nullable().describe("URL for 'navigate'"),
      direction: z.enum(['up', 'down']).nullable(),
      reasoning: z.string().describe("Brief explanation of choice")
    });

    const runLoop = async (retry = 0, lastError?: string): Promise<any> => {
      await this.waitForStable(page);

      // 1. Annotate for screenshot
      await this.injectActionIds(page, true);
      const screenshot = await page.screenshot({ type: "jpeg", quality: 60 }).catch(() => null);
      await this.cleanupAnnotations(page); // Clean up immediately after screenshot

      const state = await this.getPageMap(page);

      const { output } = await generateText({
        model: this.model!,
        output: Output.object({ schema: actionSchema }),
        messages: [
          {
            role: 'system',
            content: `You are an expert browser agent. Your task: "${instruction}"
Current State:
- URL: ${state.url}
- Title: ${state.title}
- Scroll: ${state.scroll.percentage}% of page

Page Structure:
The page is grouped into semantic sections (header, main, sidebar, etc.).
Elements have IDs which correspond to RED labels in the screenshot.
Use 'inViewport: false' elements to trigger automatic scrolling.

Guidelines:
1. Prefer clicking elements in 'main' or 'navigation'.
2. If the goal is not visible, use 'scroll' or look for 'inViewport: false' elements.
3. If a popup/modal appears, handle it first.
4. When the task is complete, use action 'done'.`
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: `DOM Tree Snapshot:\n${JSON.stringify(state.sections, null, 2)}` },
              ...(screenshot ? [{ type: 'image', image: screenshot } as any] : []),
              ...(lastError ? [{ type: 'text', text: `Previous error: ${lastError}` }] : [])
            ]
          }
        ]
      });

      console.log('Browser Action:', output.action, output.reasoning);

      if (output.action === 'done') return { success: true, message: output.reasoning };

      try {
        switch (output.action) {
          case 'click': await this.clickById(page, output.elementId!); break;
          case 'type': await this.typeById(page, output.elementId!, output.text!); break;
          case 'press': await page.keyboard.press(output.key!); break;
          case 'scroll': await this.scroll(page, output.direction || 'down'); break;
          case 'navigate': await page.goto(output.url!); break;
          case 'wait': await page.waitForTimeout(2000); break;
        }
        // After one action, we return the result.
        return { action: output.action, reasoning: output.reasoning };
      } catch (e: any) {
        if (retry < 1) return runLoop(retry + 1, e.message);
        throw e;
      }
    };

    return runLoop();
  }

  async observe(page: Page) {
    if (!this.model) throw new Error("LanguageModel required for 'observe'");
    await this.waitForStable(page);

    await this.injectActionIds(page, true);
    const screenshot = await page.screenshot({ type: "jpeg", quality: 60 }).catch(() => null);
    await this.cleanupAnnotations(page);

    const state = await this.getPageMap(page);

    const { output } = await generateText({
      model: this.model!,
      output: Output.object({
        schema: z.object({
          observations: z.array(z.string().describe("Natural language instruction for 'act'"))
        })
      }),
      prompt: `Analyze this page state and suggest 5 logical next steps for a user.
Current URL: ${state.url}
Scroll: ${state.scroll.percentage}%
DOM: ${JSON.stringify(state.sections, null, 2)}`
    });

    return output;
  }

  async extract(page: Page, instruction: string) {
    if (!this.model) throw new Error("LanguageModel required for 'extract'");
    await this.waitForStable(page);
    const content = await page.evaluate(() => document.body.innerText);

    const { output } = await generateText({
      model: this.model,
      output: Output.object({
        schema: z.object({ data: z.string(), confidence: z.number() })
      }),
      prompt: `Extract "${instruction}" from:\n${content.slice(0, 15000)}`
    });

    try { return { ...output, data: JSON.parse(output.data) }; }
    catch { return output; }
  }
}

export const browserPlugin = (options: BrowserPluginOptions = {}): MelonyPlugin<any, any> => {
  const manager = new BrowserManager(options);
  const smartBrowser = new SmartBrowser(options.model, manager);

  return (builder) => {
    async function* yieldState(page: Page, options: { screenshot?: boolean, annotate?: boolean } = { screenshot: true, annotate: false }) {
      try {
        const url = page.url();
        const title = await page.title();
        const pages = manager.getPages();

        if (options.annotate) {
          await smartBrowser.injectActionIds(page, true);
          const screenshot = await page.screenshot({ type: "jpeg", quality: 60 }).catch(() => null);
          yield {
            type: "ui",
            data: {
              type: "image",
              props: { src: `data:image/jpeg;base64,${screenshot?.toString("base64") ?? ""}`, alt: "Screenshot", width: "full" },
            },
          };
        }



        let base64: string | undefined;
        if (options.screenshot) {
          const screenshot = await page.screenshot({ type: "jpeg", quality: 60 });
          base64 = screenshot.toString("base64");
        }

        if (options.annotate) {
          await smartBrowser.cleanupAnnotations(page);
        }

        const children: any[] = [];
        if (base64) {
          children.push({
            type: "image",
            props: { src: `data:image/jpeg;base64,${base64}`, alt: "Screenshot", width: "full" },
          });
        }

        children.push({
          type: "row",
          props: { justify: "between", padding: "sm" },
          children: [
            {
              type: "text",
              props: { value: `Tabs: ${pages.length}`, size: "xs", color: "muted" },
            },
            {
              type: "row",
              props: { gap: "xs" },
              children: [
                {
                  type: "button",
                  props: {
                    label: options.annotate ? "Hide IDs" : "Show IDs",
                    size: "xs",
                    variant: options.annotate ? "default" : "outline",
                    onClickAction: { type: "action:browser_state_update", annotate: !options.annotate },
                  },
                },
                {
                  type: "button",
                  props: {
                    label: "Open Visible",
                    size: "xs",
                    variant: "outline",
                    onClickAction: { type: "action:browser_show" },
                  },
                },
                {
                  type: "button",
                  props: {
                    label: "Cleanup",
                    size: "xs",
                    variant: "outline",
                    onClickAction: { type: "action:browser_cleanup" },
                  },
                },
              ],
            },
          ],
        });

        yield {
          type: "ui",
          data: {
            type: "card",
            props: { title: title || "Browser View", subtitle: url, padding: "none" },
            children,
          },
        };
      } catch (e) {
        console.error("Browser state update failed", e);
      }
    }

    const buildResult = (action: string, toolCallId: string, result: Record<string, unknown>) => ({
      type: "action:result",
      data: { action, toolCallId, result },
    });

    builder.on("action:browser_act" as any, async function* (event) {
      const { toolCallId, instruction } = event.data;

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Performing action: ${instruction}`,
          }
        },
      };

      try {
        const page = await manager.ensurePage();
        const result = await smartBrowser.act(page, instruction);
        yield* yieldState(page, { annotate: true });
        yield buildResult("browser_act", toolCallId, { success: true, ...result });
      } catch (error: any) {
        yield buildResult("browser_act", toolCallId, { error: error.message });
      }
    });

    builder.on("action:browser_extract" as any, async function* (event) {
      const { toolCallId, instruction } = event.data;

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Extracting data: ${instruction}`,
          }
        },
      };

      try {
        const page = await manager.ensurePage();
        const result = await smartBrowser.extract(page, instruction);

        yield {
          type: "ui",
          data: {
            type: 'text',
            props: {
              value: `Extracted data: ${JSON.stringify(result, null, 2)}`,
            }
          },
        };

        yield* yieldState(page);
        yield buildResult("browser_extract", toolCallId, { success: true, ...result });
      } catch (error: any) {
        yield buildResult("browser_extract", toolCallId, { error: error.message });
      }
    });

    builder.on("action:browser_observe" as any, async function* (event) {
      const { toolCallId } = event.data;

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Observing page`,
          }
        },
      };

      try {
        const page = await manager.ensurePage();
        const result = await smartBrowser.observe(page);

        yield {
          type: "ui",
          data: {
            type: 'text',
            props: {
              value: (result as any).observations
                ? `Possible actions:\n${(result as any).observations.map((o: string) => `• ${o}`).join('\n')}`
                : `Observations: ${JSON.stringify(result, null, 2)}`,
            }
          },
        };

        yield* yieldState(page);
        yield buildResult("browser_observe", toolCallId, { success: true, ...result });
      } catch (error: any) {
        yield buildResult("browser_observe", toolCallId, { error: error.message });
      }
    });

    builder.on("action:browser_cleanup" as any, async function* (event) {
      const { toolCallId } = event.data;
      try {
        await manager.cleanup();
        yield buildResult("browser_cleanup", toolCallId, { success: true, message: "Browser closed" });
      } catch (error: any) {
        yield buildResult("browser_cleanup", toolCallId, { error: error.message });
      }
    });

    builder.on("action:browser_show" as any, async function* (event) {
      const { toolCallId } = event.data;

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Showing browser`,
          }
        },
      };

      try {
        const page = await manager.ensurePage();
        let activePage = page;
        let result = { message: "Browser is active", url: page.url() };
        if (manager.isHeadless()) {
          const url = page.url();
          await manager.relaunch(false);
          const newPage = await manager.ensurePage(false);
          activePage = newPage;
          if (url) {
            await newPage.goto(url);
          }
          result = { message: "Browser opened (headed)", url: newPage.url() };
        }
        yield* yieldState(activePage);
        yield buildResult("browser_show", toolCallId, { success: true, ...result });
      } catch (error: any) {
        yield buildResult("browser_show", toolCallId, { error: error.message });
      }
    });

    builder.on("action:browser_state_update" as any, async function* (event) {
      const { toolCallId, annotate } = event.data;

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Updating browser state`,
          }
        },
      };

      try {
        const page = await manager.ensurePage();
        yield* yieldState(page, { screenshot: true, annotate: !!annotate });
        yield buildResult("browser_state_update", toolCallId, { success: true });
      } catch (error: any) {
        yield buildResult("browser_state_update", toolCallId, { error: error.message });
      }
    });
  };
};
