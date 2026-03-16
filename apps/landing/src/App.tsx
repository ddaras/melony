import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { marked, type Tokens } from "marked";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import { trackPageView } from "./analytics";
import { CodeSnippet, decodeSnippetCode, renderCodeSnippetHtml } from "./components/CodeSnippet";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  sh: "bash",
  shell: "bash",
  ts: "typescript",
  tsx: "typescript",
  yml: "yaml",
};

function getNormalizedLanguage(language?: string) {
  if (!language) {
    return undefined;
  }

  const normalized = language.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }

  return LANGUAGE_ALIASES[normalized] ?? normalized;
}

function renderHighlightedCode(code: string, language?: string) {
  const normalizedLanguage = getNormalizedLanguage(language);
  if (normalizedLanguage && hljs.getLanguage(normalizedLanguage)) {
    return hljs.highlight(code, { language: normalizedLanguage, ignoreIllegals: true }).value;
  }

  return hljs.highlightAuto(code).value;
}

let docsSnippetCounter = 0;

async function renderMarkdown(markdownText: string) {
  docsSnippetCounter = 0;
  const renderer = new marked.Renderer();

  renderer.code = ({ text, lang }: Tokens.Code) => {
    const normalizedLanguage = getNormalizedLanguage(lang);
    const highlighted = renderHighlightedCode(text, normalizedLanguage);
    docsSnippetCounter += 1;
    return renderCodeSnippetHtml({
      id: `docs-snippet-${docsSnippetCounter}`,
      label: normalizedLanguage ? normalizedLanguage.toUpperCase() : "Snippet",
      code: text,
      highlightedCode: highlighted,
      language: normalizedLanguage,
    });
  };

  const html = await marked.parse(markdownText, { renderer });

  return html;
}

const DOCS_NAV = [
  {
    category: "Get started",
    items: [
      { id: "introduction", label: "Introduction", path: "/docs/README" },
      { id: "getting-started", label: "Quick start", path: "/docs/getting-started" },
    ],
  },
  {
    category: "Concepts",
    items: [
      { id: "melony-runtime", label: "Melony Runtime", path: "/docs/concepts/runtime" },
      { id: "melony-harness", label: "Melony Harness", path: "/docs/concepts/harness" },
    ],
  },
  {
    category: "Core Plugins",
    items: [
      { id: "agents", label: "Agents", path: "/docs/packages/melony-agents" },
      { id: "llm", label: "LLM", path: "/docs/packages/melony-llm" },
      { id: "actions", label: "Actions", path: "/docs/packages/melony-actions" },
      { id: "planning", label: "Planning", path: "/docs/packages/melony-planning" },
      { id: "workflows", label: "Workflows", path: "/docs/packages/melony-workflows" },
      { id: "memory", label: "Memory", path: "/docs/packages/melony-memory" },
    ],
  },
  {
    category: "UI & Integrations",
    items: [
      { id: "react", label: "React", path: "/docs/packages/melony-react" },
    ],
  },
  {
    category: "LLM Providers",
    items: [
      { id: "gemini", label: "Gemini", path: "/docs/packages/melony-gemini" },
      { id: "openai", label: "OpenAI", path: "/docs/packages/melony-openai" },
    ],
  },
];

const DEFAULT_DOCS_PATH = "/docs/README";

const featureCards = [
  {
    title: "Agent building blocks",
    description: "Compose agents, tools, planning, workflows, memory, and UI from one system.",
  },
  {
    title: "Observable execution",
    description: "Keep execution explicit enough to inspect, debug, and productize.",
  },
  {
    title: "Runtime underneath",
    description: "Melony Harness sits on a small event-native runtime instead of opaque framework magic.",
  },
];

const homeSnippet = `import { agent } from "@melony/agents";
import { llm } from "@melony/llm";
import { createOpenAIProvider } from "@melony/openai";
import { actions, defineAction } from "@melony/actions";

const refundOrder = defineAction({...});

const assistant = agent("Support")
  .use(llm({
    provider: createOpenAIProvider({ model: "gpt-4o-mini" }),
  }))
  .use(actions({
    actions: [refundOrder],
  }));

for await (const event of assistant.run("Refund order #4821")) {
  console.log(event.type, event.data);
}`;

function getDocsPathFromRoute(pathname: string): string {
  if (pathname === "/docs" || pathname === "/docs/") {
    return DEFAULT_DOCS_PATH;
  }
  return pathname;
}

function MarkdownContent({ path }: { path: string }) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMarkdown = async () => {
      setLoading(true);
      setError(false);
      try {
        const filePath = path.replace("/docs/", "/docs/") + ".md";
        const res = await fetch(filePath);
        if (!res.ok) throw new Error("Not found");
        const text = await res.text();
        setContent(await renderMarkdown(text));
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [path]);

  if (loading) return <div className="loading">Loading doc...</div>;
  if (error)
    return (
      <div className="error">
        <h1>404</h1>
        <p>Documentation page not found.</p>
        <a href="/docs" className="button primary">
          Back to docs
        </a>
      </div>
    );

  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: content }} />;
}

function HomePage() {
  return (
    <main>
      <section className="hero section" id="top">
        <div className="split">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p className="eyebrow">AI Agent Harness</p>
            <h1>Build reliable AI agents in TypeScript.</h1>
            <p className="lead">
              <strong>Melony Harness</strong> gives you agents, tools, planning, workflows, memory, and React integration,
              powered by the <strong>Melony</strong> runtime underneath.
            </p>
            <div className="cta-row">
              <a className="button primary" href="/docs">
                Read docs
              </a>
              <a className="button secondary" href="https://github.com/ddaras/melony" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
          <div>
            <CodeSnippet
              id="home-code"
              label="Agent harness"
              code={homeSnippet}
              language="typescript"
              highlight={renderHighlightedCode}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid three">
          {featureCards.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="split">
          <div>
            <p className="eyebrow">Two Layers, One Model</p>
            <h2>Start at the harness layer. Drop lower only when you need to.</h2>
            <p>
              The homepage should sell the outcome first. Melony Harness is the developer-facing entry point, while the
              runtime explains why the system stays explicit and composable underneath.
            </p>
          </div>
          <div>
            <ul className="bullet-list">
              <li><strong>Melony Harness</strong> gives you agents, LLM providers, actions, planning, workflows, memory, and React integration.</li>
              <li><strong>Melony Runtime</strong> provides the event-native execution model that keeps everything explicit underneath.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="split">
          <div>
            <p className="eyebrow">Why Teams Choose It</p>
            <h2>Less magic. More leverage.</h2>
          </div>
          <ul className="bullet-list">
            <li>Keep control over execution flow instead of delegating core behavior to opaque framework internals.</li>
            <li>Make intermediate reasoning and side effects observable enough for debugging, review, and product UX.</li>
            <li>Adopt only the packages you need, without committing to a monolithic agent architecture on day one.</li>
          </ul>
        </div>
      </section>

      <section className="section final-cta">
        <div className="cta-content">
          <h2>Ready to build?</h2>
          <p>Start with the quick start, then add the harness packages that match your system.</p>
          <div className="cta-row">
            <a className="button primary" href="/docs">
              Read docs
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function DocsPage({ currentPath }: { currentPath: string }) {
  const docsPath = getDocsPathFromRoute(currentPath);

  return (
    <main className="docs-layout">
      <aside className="docs-sidebar">
        {DOCS_NAV.map((cat) => (
          <div key={cat.category} className="sidebar-group">
            <p className="sidebar-cat">{cat.category}</p>
            <nav>
              {cat.items.map((item) => (
                <a
                  key={item.id}
                  href={item.path}
                  className={docsPath === item.path ? "active" : ""}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </aside>

      <div className="docs-content">
        <MarkdownContent path={docsPath} />
      </div>
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    trackPageView(route);
  }, [route]);

  useEffect(() => {
    if (route.startsWith("/docs")) {
      const currentDoc = DOCS_NAV.flatMap((cat) => cat.items).find((item) => item.path === route);
      document.title = currentDoc
        ? `${currentDoc.label} - Melony Docs`
        : "Melony Docs - Event-native AI Agent Harness";
      return;
    }

    document.title = "Melony - Event-native runtime and harness for AI systems";
  }, [route]);

  useEffect(() => {
    const resetCopyLabel = (button: HTMLButtonElement) => {
      const defaultLabel = button.dataset.copyDefaultLabel ?? "Copy";
      button.textContent = defaultLabel;
    };

    const onSnippetCopy = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest("button.code-snippet-copy");
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const encodedCode = button.dataset.copyCode;
      if (!encodedCode) {
        return;
      }

      const decodedCode = decodeSnippetCode(encodedCode);
      if (decodedCode === null) {
        resetCopyLabel(button);
        return;
      }

      void navigator.clipboard
        .writeText(decodedCode)
        .then(() => {
          const successLabel = button.dataset.copySuccessLabel ?? "Copied";
          button.textContent = successLabel;
          window.setTimeout(() => {
            if (button.isConnected) {
              resetCopyLabel(button);
            }
          }, 1400);
        })
        .catch(() => {
          resetCopyLabel(button);
        });
    };

    window.addEventListener("click", onSnippetCopy);
    return () => window.removeEventListener("click", onSnippetCopy);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a");
      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (!href || isModifiedClick || link.getAttribute("target") === "_blank") {
        return;
      }

      if (href === "/" || href.startsWith("/docs")) {
        event.preventDefault();
        const nextUrl = new URL(href, window.location.origin);
        window.history.pushState({}, "", nextUrl.pathname + nextUrl.hash);
        setRoute(window.location.pathname);

        if (nextUrl.hash) {
          window.requestAnimationFrame(() => {
            const targetEl = document.querySelector(nextUrl.hash);
            if (targetEl instanceof HTMLElement) {
              targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
          return;
        }

        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="page">
      <Analytics />
      <header className="nav">
        <a className="brand" href="/">
          Melony
        </a>
        <div className="nav-links">
          <a href="/docs" className={route.startsWith("/docs") ? "active" : ""}>
            Docs
          </a>
          <a href="https://github.com/ddaras/melony" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://discord.gg/j2uF5n8vJK" target="_blank" rel="noreferrer">
            Discord
          </a>
        </div>
      </header>
      {route.startsWith("/docs") ? (
        <DocsPage currentPath={route} />
      ) : (
        <HomePage />
      )}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>
            Event-native runtime for explicit execution, observable systems, and composable AI building blocks.
          </p>
          <div className="site-footer-links">
            <a href="/docs">Docs</a>
            <a href="https://github.com/ddaras/melony" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://discord.gg/j2uF5n8vJK" target="_blank" rel="noreferrer">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
