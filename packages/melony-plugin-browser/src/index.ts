import { MelonyPlugin, Event } from "melony";
import { z } from "zod";
import { chromium, Browser, BrowserContext, Page } from "playwright";

export const browserToolDefinitions = {
  browser_navigate: {
    description: "Navigate to a URL and wait for the page to load",
    inputSchema: z.object({
      url: z.string().describe("The URL to navigate to"),
      waitUntil: z.enum(["load", "domcontentloaded", "networkidle", "commit"]).default("load").describe("When to consider navigation finished"),
    }),
  },
  browser_screenshot: {
    description: "Take a screenshot of the current page",
    inputSchema: z.object({
      fullPage: z.boolean().default(false).describe("Whether to take a screenshot of the full scrollable page"),
    }),
  },
  browser_click: {
    description: "Click an element on the page",
    inputSchema: z.object({
      selector: z.string().describe("CSS selector or XPath of the element to click"),
    }),
  },
  browser_type: {
    description: "Type text into an input field",
    inputSchema: z.object({
      selector: z.string().describe("CSS selector or XPath of the element to type into"),
      text: z.string().describe("The text to type"),
      delay: z.number().optional().describe("Delay between keystrokes in milliseconds"),
    }),
  },
  browser_getContent: {
    description: "Get the content of the current page",
    inputSchema: z.object({
      format: z.enum(["text", "html", "markdown"]).default("text").describe("The format to return the content in"),
    }),
  },
  browser_evaluate: {
    description: "Execute JavaScript code in the context of the page",
    inputSchema: z.object({
      script: z.string().describe("The JavaScript code to execute"),
    }),
  },
  browser_openVisible: {
    description: "Open the browser in a visible window (non-headless) for manual interaction",
    inputSchema: z.object({
      url: z.string().optional().describe("An optional URL to open immediately"),
    }),
  },
  browser_listTabs: {
    description: "List all open browser tabs",
    inputSchema: z.object({}),
  },
  browser_closeTab: {
    description: "Close a browser tab by its index",
    inputSchema: z.object({
      index: z.number().describe("The index of the tab to close"),
    }),
  },
};

export interface BrowserPluginOptions {
  headless?: boolean;
  maxContentLength?: number;
  userDataDir?: string;
  channel?: string;
}

/**
 * Manages the Playwright browser lifecycle and provides high-level helpers
 */
class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private defaultHeadless: boolean;
  private activeHeadless: boolean | null = null;

  constructor(private options: BrowserPluginOptions) {
    this.defaultHeadless = options.headless !== false;
  }

  async ensurePage(forceHeadless?: boolean): Promise<Page> {
    const targetHeadless = forceHeadless !== undefined ? forceHeadless : (this.options.headless ?? this.defaultHeadless);

    const isHealthy = async () => {
      try {
        if (!this.page || this.page.isClosed()) return false;
        if (!this.context) return false;
        await this.page.url();
        return true;
      } catch {
        return false;
      }
    };

    let currentUrl: string | undefined;

    // If current browser exists but is in the wrong mode, close it to switch
    if ((this.browser || this.context) && this.activeHeadless !== targetHeadless) {
      if (this.page && !this.page.isClosed()) {
        try {
          currentUrl = this.page.url();
        } catch (e) {
          // ignore
        }
      }
      await this.close();
    }

    if (await isHealthy()) return this.page!;

    // Cleanup before launch if unhealthy
    if (this.page || this.context || this.browser) {
      await this.close();
    }

    const { userDataDir, channel } = this.options;
    this.activeHeadless = targetHeadless;

    if (userDataDir) {
      this.context = await chromium.launchPersistentContext(userDataDir, {
        headless: targetHeadless,
        channel,
        viewport: { width: 1280, height: 720 },
        ignoreDefaultArgs: ["--enable-automation"],
        args: [
          "--disable-blink-features=AutomationControlled",
          "--no-sandbox",
          "--disable-infobars",
          "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        ],
      });
      this.context.on("close", () => (this.context = null));
      this.page = this.context.pages()[0] || (await this.context.newPage());
    } else {
      if (!this.browser || !this.browser.isConnected()) {
        this.browser = await chromium.launch({
          headless: targetHeadless,
          channel,
          ignoreDefaultArgs: ["--enable-automation"],
          args: ["--disable-blink-features=AutomationControlled"],
        });
        this.browser.on("disconnected", () => (this.browser = null));
      }

      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      });
      this.context.on("close", () => (this.context = null));
      this.page = await this.context.newPage();
    }

    this.page.on("close", () => (this.page = null));

    if (currentUrl && currentUrl !== "about:blank") {
      await this.page.goto(currentUrl).catch(() => {});
    }

    return this.page!;
  }

  async close() {
    try {
      if (this.context) await this.context.close().catch(() => {});
      if (this.browser) await this.browser.close().catch(() => {});
    } finally {
      this.context = null;
      this.browser = null;
      this.page = null;
      this.activeHeadless = null;
    }
  }

  async getPages() {
    if (!this.context) return this.page ? [this.page] : [];
    return await this.context.pages();
  }

  getActiveHeadless() {
    return this.activeHeadless;
  }

  setHeadless(headless: boolean) {
    this.options.headless = headless;
  }

  setPage(page: Page | null) {
    this.page = page;
  }
}

export const browserPlugin = (options: BrowserPluginOptions = {}): MelonyPlugin<any, any> => {
  const manager = new BrowserManager(options);
  const maxContentLength = options.maxContentLength || 10000;

  return (builder) => {
    async function* yieldState(page: Page, options: { screenshot?: boolean } = { screenshot: true }) {
      try {
        const url = page.url();
        const title = await page.title();
        const pages = await manager.getPages();
        const tabs = await Promise.all(
          pages.map(async (p, i) => ({
            index: i,
            title: (await p.title().catch(() => "Untitled")) || "Untitled",
            url: p.url(),
            isActive: p === page,
          }))
        );

        let base64: string | undefined;
        if (options.screenshot) {
          const screenshot = await page.screenshot({ type: "jpeg", quality: 60 });
          base64 = screenshot.toString("base64");
        }

        yield {
          type: "browser:state-update",
          data: { url, title, screenshot: base64, tabCount: pages.length, tabs },
        };

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
                    label: "Open Visible",
                    size: "xs",
                    variant: "outline",
                    onClickAction: { type: "browser:show" },
                  },
                },
                {
                  type: "button",
                  props: {
                    label: "Cleanup",
                    size: "xs",
                    variant: "outline",
                    onClickAction: { type: "browser:cleanup" },
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

    builder.on("browser:show", async function* () {
      yield* yieldState(await manager.ensurePage(false), { screenshot: false });
    });

    builder.on("browser:cleanup", async function* () {
      const page = await manager.ensurePage();
      const pages = await manager.getPages();
      for (const p of pages) {
        if (p !== page && !p.isClosed()) await p.close().catch(() => {});
      }
      yield* yieldState(page, { screenshot: false });
    });

    const handleAction = (
      name: string,
      handler: (page: Page, data: any) => Promise<any>,
      options: { screenshot?: boolean } = { screenshot: true }
    ) => {
      builder.on(`action:${name}` as any, async function* (event) {
        const { toolCallId, ...data } = event.data;
        try {
          const page = await manager.ensurePage();
          const result = await handler(page, data);
          yield* yieldState(page, options);
          yield {
            type: "action:result",
            data: { action: name, toolCallId, result: { success: true, ...result } },
          };
        } catch (error: any) {
          yield {
            type: "action:result",
            data: { action: name, toolCallId, result: { error: error.message } },
          };
        }
      });
    };

    handleAction("browser_navigate", async (page, { url, waitUntil }) => {
      await page.goto(url, { waitUntil });
      return { url: page.url(), title: await page.title() };
    });

    handleAction("browser_screenshot", async (page, { fullPage }) => {
      await page.screenshot({ fullPage, type: "png" });
      return { message: "Screenshot taken" };
    });

    handleAction("browser_click", async (page, { selector }) => {
      await page.click(selector);
      return {};
    });

    handleAction("browser_type", async (page, { selector, text, delay }) => {
      await page.type(selector, text, { delay });
      return {};
    });

    handleAction("browser_getContent", async (page, { format }) => {
      let content = "";
      if (format === "html") content = await page.content();
      else content = await page.evaluate(() => document.body.innerText);

      if (content.length > maxContentLength) {
        const half = Math.floor(maxContentLength / 2);
        content = `${content.slice(0, half)}\n\n[... Truncated ...]\n\n${content.slice(-half)}`;
      }
      return { content };
    }, { screenshot: false });

    handleAction("browser_evaluate", async (page, { script }) => {
      const result = await page.evaluate(script);
      return { result };
    });

    handleAction("browser_listTabs", async (page) => {
      const pages = await manager.getPages();
      const tabs = await Promise.all(
        pages.map(async (p, i) => ({
          index: i,
          title: (await p.title().catch(() => "Untitled")) || "Untitled",
          url: p.url(),
          isActive: p === page,
        }))
      );
      return { tabs };
    }, { screenshot: false });

    handleAction("browser_closeTab", async (page, { index }) => {
      const pages = await manager.getPages();
      if (index >= 0 && index < pages.length) {
        const tab = pages[index];
        if (tab === page) manager.setPage(null);
        await tab.close();
      }
      return {};
    }, { screenshot: false });

    handleAction("browser_openVisible", async (_page, { url }) => {
      const p = await manager.ensurePage(false);
      if (url) await p.goto(url);
      return { message: "Browser is now visible" };
    }, { screenshot: false });

    builder.on("browser:poll_state", async function* () {
      yield* yieldState(await manager.ensurePage(manager.getActiveHeadless() ?? undefined));
    });
  };
};
