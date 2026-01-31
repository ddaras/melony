import { MelonyPlugin } from "melony";
import { z } from "zod";
import { chromium, Browser, BrowserContext, Page } from "playwright";

// Shared state to avoid "ProcessSingleton" errors in long-running processes (like Express)
// mapping userDataDir -> Context
const persistentContexts = new Map<string, BrowserContext>();
// mapping channel/options -> Browser
const sharedBrowsers = new Map<string, Browser>();

export const browserToolDefinitions = {
  browser_navigate: {
    description: "Navigate to a URL and wait for the page to load",
    inputSchema: z.object({
      url: z.string().describe("The URL to navigate to"),
      waitUntil: z.enum(["load", "domcontentloaded", "networkidle", "commit"]).default("load").describe("When to consider navigation finished"),
    }),
  },
  browser_screenshot: {
    description: "Take a screenshot of the current page and return it as a base64 image",
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
};

export interface BrowserPluginOptions {
  headless?: boolean;
  /**
   * Maximum number of characters to keep when getting page content.
   * If exceeded, the content will be truncated from the middle.
   * Default: 10000
   */
  maxContentLength?: number;
  /**
   * Path to user data directory for persistent browser sessions.
   * When provided, the browser will use launchPersistentContext which
   * preserves cookies, localStorage, and login sessions across runs.
   * 
   * First run with headless: false to manually log in, then subsequent
   * runs will automatically have your session.
   */
  userDataDir?: string;
  /**
   * Browser channel to use (e.g. 'chrome', 'chrome-beta', 'msedge').
   * Using 'chrome' can help bypass "browser not safe" errors on Google/YouTube.
   */
  channel?: string;
}

/**
 * Truncates a string by keeping the first and last N characters.
 */
function truncate(str: string | undefined | null, maxChars: number): string | undefined | null {
  if (!str || str.length <= maxChars) return str;
  const half = Math.floor(maxChars / 2);
  const truncatedCount = str.length - maxChars;
  return `${str.slice(0, half)}\n\n[... ${truncatedCount} characters truncated ...]\n\n${str.slice(-half)}`;
}

export const browserPlugin = (options: BrowserPluginOptions = {}): MelonyPlugin<any, any> => {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  const { headless = true, maxContentLength = 10000, userDataDir, channel } = options;

  async function ensurePage(): Promise<Page> {
    // If page exists but is closed, clear it
    if (page && page.isClosed()) {
      page = null;
    }

    if (userDataDir) {
      // Use persistent context for session persistence (cookies, localStorage, etc.)
      const isContextUsable = async (ctx: BrowserContext | null) => {
        if (!ctx) return false;
        try {
          await ctx.pages();
          return true;
        } catch {
          return false;
        }
      };

      if (!context || !(await isContextUsable(context))) {
        // Check if we already have a context for this directory in this process
        if (persistentContexts.has(userDataDir)) {
          context = persistentContexts.get(userDataDir)!;
        }

        // If context is still null or not usable, launch it
        if (!context || !(await isContextUsable(context))) {
          context = await chromium.launchPersistentContext(userDataDir, {
            headless,
            channel,
            viewport: { width: 1280, height: 720 },
            ignoreDefaultArgs: ["--enable-automation"],
            args: [
              "--disable-blink-features=AutomationControlled",
              "--no-sandbox",
              "--disable-infobars",
              "--window-position=0,0",
              "--ignore-certifcate-errors",
              "--ignore-certifcate-errors-spki-list",
              "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            ],
          });
          context.on("close", () => persistentContexts.delete(userDataDir));
          persistentContexts.set(userDataDir, context);
        }
        
        // Ensure we have a page
        if (!page || page.isClosed()) {
          page = context.pages()[0] || await context.newPage();
        }
      }
    } else {
      // Standard non-persistent browser
      const isBrowserUsable = (b: Browser | null) => b && b.isConnected();
      
      if (!browser || !isBrowserUsable(browser)) {
        const browserKey = `${channel || "default"}-${headless}`;
        if (sharedBrowsers.has(browserKey)) {
          browser = sharedBrowsers.get(browserKey)!;
        }
        
        if (!browser || !isBrowserUsable(browser)) {
          browser = await chromium.launch({
            headless,
            channel,
            ignoreDefaultArgs: ["--enable-automation"],
            args: ["--disable-blink-features=AutomationControlled"],
          });
          browser.on("disconnected", () => sharedBrowsers.delete(browserKey));
          sharedBrowsers.set(browserKey, browser);
        }
      }

      if (!page || page.isClosed()) {
        context = await browser.newContext({
          viewport: { width: 1280, height: 720 },
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        });
        page = await context.newPage();
      }
    }
    return page!;
  }

  return (builder) => {
    builder.on("action:browser_navigate", async function* (event) {
      const { url, waitUntil, toolCallId } = event.data;

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Navigating to: ${url}`,
          }
        },
      };

      try {
        const page = await ensurePage();
        await page.goto(url, { waitUntil });

        yield {
          type: "ui",
          data: {
            type: 'text',
            props: {
              value: `Navigated to: ${page.url()}`,
            }
          },
        };

        yield {
          type: "action:result",
          data: {
            action: "browser_navigate",
            toolCallId,
            result: { success: true, url: page.url(), title: await page.title() },
          },
        };
      } catch (error: any) {
        yield {
          type: "action:result",
          data: { action: "browser_navigate", toolCallId, result: { error: error.message } },
        };

        yield {
          type: "ui",
          data: {
            type: 'text',
            props: {
              value: `Navigation failed: ${error.message}`,
            }
          },
        };
      }
    });

    builder.on("action:browser_screenshot", async function* (event) {
      const { fullPage, toolCallId } = event.data;

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Taking screenshot`,
          }
        },
      };

      try {
        const page = await ensurePage();
        const buffer = await page.screenshot({ fullPage, type: "png" });
        const base64 = buffer.toString("base64");

        // Return both the raw result and a UI event to show the screenshot
        yield {
          type: "action:result",
          data: {
            action: "browser_screenshot",
            toolCallId,
            result: { success: true, format: "png", message: "Screenshot taken successfully" },
          },
        };

        yield {
          type: "ui",
          data: {
            type: "image",
            props: {
              src: `data:image/png;base64,${base64}`,
              alt: "Browser Screenshot",
              width: "full",
            }
          },
        };
      } catch (error: any) {
        yield {
          type: "action:result",
          data: { action: "browser_screenshot", toolCallId, result: { error: error.message } },
        };

        yield {
          type: "ui",
          data: {
            type: 'text',
            props: {
              value: `Screenshot failed: ${error.message}`,
            }
          },
        };
      }
    });

    builder.on("action:browser_click", async function* (event) {
      const { selector, toolCallId } = event.data;

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Clicking: ${selector}`,
          }
        },
      };

      try {
        const page = await ensurePage();
        await page.click(selector);
        yield {
          type: "action:result",
          data: { action: "browser_click", toolCallId, result: { success: true } },
        };

        yield {
          type: "ui",
          data: {
            type: 'text',
            props: {
              value: `Clicked: ${selector}`,
            }
          },
        };
      } catch (error: any) {
        yield {
          type: "action:result",
          data: { action: "browser_click", toolCallId, result: { error: error.message } },
        };
      }
    });

    builder.on("action:browser_type", async function* (event) {
      const { selector, text, delay, toolCallId } = event.data;

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Typing: ${selector}`,
          }
        },
      };

      try {
        const page = await ensurePage();
        await page.type(selector, text, { delay });
        yield {
          type: "action:result",
          data: { action: "browser_type", toolCallId, result: { success: true } },
        };

        yield {
          type: "ui",
          data: {
            type: 'text',
            props: {
              value: `Typed: ${selector}`,
            }
          },
        };
      } catch (error: any) {
        yield {
          type: "action:result",
          data: { action: "browser_type", toolCallId, result: { error: error.message } },
        };

        yield {
          type: "ui",
          data: {
            type: 'text',
            props: {
              value: `Typed: ${selector}`,
            }
          },
        };
      }
    });

    builder.on("action:browser_getContent", async function* (event) {
      const { format, toolCallId } = event.data;

      yield {
        type: "ui",
        data: {
          type: 'text',
          props: {
            value: `Getting content: ${format}`,
          }
        },
      };

      try {
        const page = await ensurePage();
        let content = "";
        if (format === "html") {
          content = await page.content();
        } else if (format === "text") {
          content = await page.evaluate(() => document.body.innerText);
        } else if (format === "markdown") {
          // Basic markdown conversion if needed, for now just text
          content = await page.evaluate(() => document.body.innerText);
        }
        yield {
          type: "action:result",
          data: {
            action: "browser_getContent",
            toolCallId,
            result: {
              success: true,
              content: truncate(content, maxContentLength)
            }
          },
        };

        yield {
          type: "ui",
          data: {
            type: 'text',
            props: {
              value: `Content: ${content}`,
            }
          },
        };
      } catch (error: any) {
        yield {
          type: "action:result",
          data: { action: "browser_getContent", toolCallId, result: { error: error.message } },
        };

        yield {
          type: "ui",
          data: {
            type: 'text',
            props: {
              value: `Content failed: ${error.message}`,
            }
          },
        };
      }
    });

    builder.on("action:browser_evaluate", async function* (event) {
      const { script, toolCallId } = event.data;
      try {
        const page = await ensurePage();
        const result = await page.evaluate(script);
        yield {
          type: "action:result",
          data: { action: "browser_evaluate", toolCallId, result: { success: true, result } },
        };
      } catch (error: any) {
        yield {
          type: "action:result",
          data: { action: "browser_evaluate", toolCallId, result: { error: error.message } },
        };
      }
    });
  };
};
