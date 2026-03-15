import { useMemo } from "react";

function toBase64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getSnippetClass(language?: string): string {
  return language ? `hljs language-${language}` : "hljs";
}

export function decodeSnippetCode(encodedCode: string): string | null {
  try {
    const binary = atob(encodedCode);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function renderCodeSnippetHtml({
  id,
  label,
  code,
  highlightedCode,
  language,
}: {
  id: string;
  label: string;
  code: string;
  highlightedCode: string;
  language?: string;
}): string {
  const encodedCode = toBase64Utf8(code);
  const snippetClass = getSnippetClass(language);

  return `<article class="code-card code-snippet" data-snippet-id="${escapeHtml(id)}"><div class="code-card-head"><p>${escapeHtml(label)}</p><button class="copy-button code-snippet-copy" type="button" aria-label="Copy ${escapeHtml(label)} snippet" data-copy-code="${encodedCode}" data-copy-default-label="Copy" data-copy-success-label="Copied">Copy</button></div><pre><code class="${snippetClass}">${highlightedCode}</code></pre></article>`;
}

export function CodeSnippet({
  id,
  label,
  code,
  language,
  highlight,
}: {
  id: string;
  label: string;
  code: string;
  language?: string;
  highlight: (code: string, language?: string) => string;
}) {
  const highlightedCode = useMemo(() => highlight(code, language), [code, language, highlight]);
  const encodedCode = useMemo(() => toBase64Utf8(code), [code]);
  const snippetClass = getSnippetClass(language);

  return (
    <article className="code-card code-snippet" data-snippet-id={id}>
      <div className="code-card-head">
        <p>{label}</p>
        <button
          className="copy-button code-snippet-copy"
          data-copy-code={encodedCode}
          data-copy-default-label="Copy"
          data-copy-success-label="Copied"
          type="button"
          aria-label={`Copy ${label} snippet`}
        >
          Copy
        </button>
      </div>
      <pre>
        <code className={snippetClass} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </article>
  );
}
