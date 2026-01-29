import { MelonyPlugin } from "melony";
import { z } from "zod";
import { chromium, Browser, Page } from "playwright";

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
}

export const browserPlugin = (options: BrowserPluginOptions = {}): MelonyPlugin<any, any> => {
  let browser: Browser | null = null;
  let page: Page | null = null;

  const { headless = true } = options;

  async function ensurePage(): Promise<Page> {
    if (!browser) {
      browser = await chromium.launch({ headless });
    }
    if (!page) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
      });
      page = await context.newPage();
    }
    return page;
  }

  return (builder) => {
    builder.on("action:browser_navigate", async function* (event) {
      const { url, waitUntil, toolCallId } = event.data;
      try {
        const page = await ensurePage();
        await page.goto(url, { waitUntil });
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
      }
    });

    builder.on("action:browser_screenshot", async function* (event) {
      const { fullPage, toolCallId } = event.data;
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
            result: { success: true, format: "png", base64: `data:image/png;base64,${base64}` },
          },
        };

        yield {
          type: "ui",
          data: {
            type: "card",
            props: { title: "Page Screenshot" },
            children: [
              {
                type: "image",
                props: {
                  src: `data:image/png;base64,${base64}`,
                  alt: "Browser Screenshot",
                  width: "full",
                },
              },
            ],
          },
        };
      } catch (error: any) {
        yield {
          type: "action:result",
          data: { action: "browser_screenshot", toolCallId, result: { error: error.message } },
        };
      }
    });

    builder.on("action:browser_click", async function* (event) {
      const { selector, toolCallId } = event.data;
      try {
        const page = await ensurePage();
        await page.click(selector);
        yield {
          type: "action:result",
          data: { action: "browser_click", toolCallId, result: { success: true } },
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
      try {
        const page = await ensurePage();
        await page.type(selector, text, { delay });
        yield {
          type: "action:result",
          data: { action: "browser_type", toolCallId, result: { success: true } },
        };
      } catch (error: any) {
        yield {
          type: "action:result",
          data: { action: "browser_type", toolCallId, result: { error: error.message } },
        };
      }
    });

    builder.on("action:browser_getContent", async function* (event) {
      const { format, toolCallId } = event.data;
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
          data: { action: "browser_getContent", toolCallId, result: { success: true, content } },
        };
      } catch (error: any) {
        yield {
          type: "action:result",
          data: { action: "browser_getContent", toolCallId, result: { error: error.message } },
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
