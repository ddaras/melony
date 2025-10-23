import React, { memo, isValidElement } from "react";
import type { DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes } from "react";
import type { ExtraProps } from "react-markdown";
import { useTheme } from "./theme";

// Types for markdown nodes and components
type MarkdownPoint = { line?: number; column?: number };
type MarkdownPosition = { start?: MarkdownPoint; end?: MarkdownPoint };
type MarkdownNode = {
  position?: MarkdownPosition;
  properties?: { className?: string };
};

type WithNode<T> = T & {
  node?: MarkdownNode;
  children?: React.ReactNode;
  className?: string;
};

// Utility function to check if nodes are the same
function sameNodePosition(prev?: MarkdownNode, next?: MarkdownNode): boolean {
  if (!(prev?.position || next?.position)) {
    return true;
  }
  if (!(prev?.position && next?.position)) {
    return false;
  }

  const prevStart = prev.position.start;
  const nextStart = next.position.start;
  const prevEnd = prev.position.end;
  const nextEnd = next.position.end;

  return (
    prevStart?.line === nextStart?.line &&
    prevStart?.column === nextStart?.column &&
    prevEnd?.line === nextEnd?.line &&
    prevEnd?.column === nextEnd?.column
  );
}

// Shared comparators
function sameClassAndNode(
  prev: { className?: string; node?: MarkdownNode },
  next: { className?: string; node?: MarkdownNode }
) {
  return (
    prev.className === next.className && sameNodePosition(prev.node, next.node)
  );
}

// Helper to get theme values with fallbacks
const getThemeValue = (theme: any, path: string, fallback: string) => {
  const keys = path.split('.');
  let value = theme;
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return fallback;
  }
  return value;
};

// HEADING COMPONENTS
type HeadingProps<TTag extends keyof JSX.IntrinsicElements> = WithNode<
  JSX.IntrinsicElements[TTag]
>;

const MemoH1 = memo<HeadingProps<"h1">>(
  ({ children, className, node, ...props }) => {
    const theme = useTheme();
    return (
      <h1
        style={{
          marginTop: getThemeValue(theme, 'spacing.md', '12px'),
          marginBottom: getThemeValue(theme, 'spacing.xs', '4px'),
          fontWeight: getThemeValue(theme, 'typography.fontWeight.semibold', '600'),
          fontSize: getThemeValue(theme, 'typography.fontSize.xxl', '20px'),
          color: getThemeValue(theme, 'colors.foreground', '#0f172a'),
          lineHeight: '1.2',
        }}
        data-melony="heading-1"
        {...props}
      >
        {children}
      </h1>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoH1.displayName = "MelonyH1";

const MemoH2 = memo<HeadingProps<"h2">>(
  ({ children, className, node, ...props }) => {
    const theme = useTheme();
    return (
      <h2
        style={{
          marginTop: getThemeValue(theme, 'spacing.md', '12px'),
          marginBottom: getThemeValue(theme, 'spacing.xs', '4px'),
          fontWeight: getThemeValue(theme, 'typography.fontWeight.semibold', '600'),
          fontSize: getThemeValue(theme, 'typography.fontSize.xl', '18px'),
          color: getThemeValue(theme, 'colors.foreground', '#0f172a'),
          lineHeight: '1.3',
        }}
        data-melony="heading-2"
        {...props}
      >
        {children}
      </h2>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoH2.displayName = "MelonyH2";

const MemoH3 = memo<HeadingProps<"h3">>(
  ({ children, className, node, ...props }) => {
    const theme = useTheme();
    return (
      <h3
        style={{
          marginTop: getThemeValue(theme, 'spacing.md', '12px'),
          marginBottom: getThemeValue(theme, 'spacing.xs', '4px'),
          fontWeight: getThemeValue(theme, 'typography.fontWeight.semibold', '600'),
          fontSize: getThemeValue(theme, 'typography.fontSize.lg', '16px'),
          color: getThemeValue(theme, 'colors.foreground', '#0f172a'),
          lineHeight: '1.4',
        }}
        data-melony="heading-3"
        {...props}
      >
        {children}
      </h3>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoH3.displayName = "MelonyH3";

const MemoH4 = memo<HeadingProps<"h4">>(
  ({ children, className, node, ...props }) => {
    const theme = useTheme();
    return (
      <h4
        style={{
          marginTop: getThemeValue(theme, 'spacing.sm', '8px'),
          marginBottom: getThemeValue(theme, 'spacing.xs', '4px'),
          fontWeight: getThemeValue(theme, 'typography.fontWeight.semibold', '600'),
          fontSize: getThemeValue(theme, 'typography.fontSize.md', '14px'),
          color: getThemeValue(theme, 'colors.foreground', '#0f172a'),
          lineHeight: '1.4',
        }}
        data-melony="heading-4"
        {...props}
      >
        {children}
      </h4>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoH4.displayName = "MelonyH4";

const MemoH5 = memo<HeadingProps<"h5">>(
  ({ children, className, node, ...props }) => {
    const theme = useTheme();
    return (
      <h5
        style={{
          marginTop: getThemeValue(theme, 'spacing.sm', '8px'),
          marginBottom: getThemeValue(theme, 'spacing.xs', '4px'),
          fontWeight: getThemeValue(theme, 'typography.fontWeight.semibold', '600'),
          fontSize: getThemeValue(theme, 'typography.fontSize.sm', '13px'),
          color: getThemeValue(theme, 'colors.foreground', '#0f172a'),
          lineHeight: '1.4',
        }}
        data-melony="heading-5"
        {...props}
      >
        {children}
      </h5>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoH5.displayName = "MelonyH5";

const MemoH6 = memo<HeadingProps<"h6">>(
  ({ children, className, node, ...props }) => {
    const theme = useTheme();
    return (
      <h6
        style={{
          marginTop: getThemeValue(theme, 'spacing.sm', '8px'),
          marginBottom: getThemeValue(theme, 'spacing.xs', '4px'),
          fontWeight: getThemeValue(theme, 'typography.fontWeight.semibold', '600'),
          fontSize: getThemeValue(theme, 'typography.fontSize.xs', '11px'),
          color: getThemeValue(theme, 'colors.foreground', '#0f172a'),
          lineHeight: '1.4',
        }}
        data-melony="heading-6"
        {...props}
      >
        {children}
      </h6>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoH6.displayName = "MelonyH6";

// TEXT COMPONENTS
type StrongProps = WithNode<JSX.IntrinsicElements["span"]>;
const MemoStrong = memo<StrongProps>(
  ({ children, className, node, ...props }: StrongProps) => {
    const theme = useTheme();
    return (
      <span
        style={{
          fontWeight: getThemeValue(theme, 'typography.fontWeight.semibold', '600'),
        }}
        data-melony="strong"
        {...props}
      >
        {children}
      </span>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoStrong.displayName = "MelonyStrong";

type AProps = WithNode<JSX.IntrinsicElements["a"]> & { href?: string };
const MemoA = memo<AProps>(
  ({ children, className, href, node, ...props }: AProps) => {
    const theme = useTheme();
    const isIncomplete = href === "melony:incomplete-link";

    return (
      <a
        style={{
          color: getThemeValue(theme, 'colors.primary', '#6366f1'),
          textDecoration: 'underline',
          fontWeight: getThemeValue(theme, 'typography.fontWeight.medium', '500'),
          wordBreak: 'break-word',
        }}
        data-incomplete={isIncomplete}
        data-melony="link"
        href={href}
        rel="noreferrer"
        target="_blank"
        {...props}
      >
        {children}
      </a>
    );
  },
  (p, n) => sameClassAndNode(p, n) && p.href === n.href
);
MemoA.displayName = "MelonyA";

// CODE COMPONENTS
const MemoCode = memo<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & ExtraProps
>(
  ({ node, className, children, ...props }) => {
    const theme = useTheme();
    const inline = node?.position?.start.line === node?.position?.end.line;

    if (inline) {
      return (
        <code
          style={{
            backgroundColor: getThemeValue(theme, 'colors.muted', '#f8fafc'),
            padding: '1px 4px',
            borderRadius: getThemeValue(theme, 'radius.sm', '8px'),
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: getThemeValue(theme, 'typography.fontSize.sm', '13px'),
            color: getThemeValue(theme, 'colors.foreground', '#0f172a'),
          }}
          data-melony="inline-code"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <pre
        style={{
          backgroundColor: getThemeValue(theme, 'colors.muted', '#f8fafc'),
          padding: getThemeValue(theme, 'spacing.sm', '8px'),
          borderRadius: getThemeValue(theme, 'radius.md', '12px'),
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: getThemeValue(theme, 'typography.fontSize.sm', '13px'),
          color: getThemeValue(theme, 'colors.foreground', '#0f172a'),
          overflow: 'auto',
          margin: `${getThemeValue(theme, 'spacing.sm', '8px')} 0`,
          border: `1px solid ${getThemeValue(theme, 'colors.border', '#e2e8f0')}`,
        }}
        data-melony="code-block"
        {...props}
      >
        <code>{children}</code>
      </pre>
    );
  },
  (p, n) => p.className === n.className && sameNodePosition(p.node, n.node)
);
MemoCode.displayName = "MelonyCode";

// LIST COMPONENTS
type UlProps = WithNode<JSX.IntrinsicElements["ul"]>;
const MemoUl = memo<UlProps>(
  ({ children, className, node, ...props }: UlProps) => {
    const theme = useTheme();
    return (
      <ul
        style={{
          marginLeft: getThemeValue(theme, 'spacing.md', '12px'),
          listStyleType: 'disc',
          listStylePosition: 'outside',
          whiteSpace: 'normal',
          paddingLeft: 0,
        }}
        data-melony="unordered-list"
        {...props}
      >
        {children}
      </ul>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoUl.displayName = "MelonyUl";

type OlProps = WithNode<JSX.IntrinsicElements["ol"]>;
const MemoOl = memo<OlProps>(
  ({ children, className, node, ...props }: OlProps) => {
    const theme = useTheme();
    return (
      <ol
        style={{
          marginLeft: getThemeValue(theme, 'spacing.md', '12px'),
          listStyleType: 'decimal',
          listStylePosition: 'outside',
          whiteSpace: 'normal',
          paddingLeft: 0,
        }}
        data-melony="ordered-list"
        {...props}
      >
        {children}
      </ol>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoOl.displayName = "MelonyOl";

type LiProps = WithNode<JSX.IntrinsicElements["li"]>;
const MemoLi = memo<LiProps>(
  ({ children, className, node, ...props }: LiProps) => {
    const theme = useTheme();
    return (
      <li
        style={{
          paddingTop: '1px',
          paddingBottom: '1px',
        }}
        data-melony="list-item"
        {...props}
      >
        {children}
      </li>
    );
  },
  (p, n) => p.className === n.className && sameNodePosition(p.node, n.node)
);
MemoLi.displayName = "MelonyLi";

// TABLE COMPONENTS
type TableProps = WithNode<JSX.IntrinsicElements["table"]>;
const MemoTable = memo<TableProps>(
  ({ children, className, node, ...props }: TableProps) => {
    const theme = useTheme();
    return (
      <div
        style={{
          margin: `${getThemeValue(theme, 'spacing.sm', '8px')} 0`,
          overflow: 'auto',
        }}
        data-melony="table-wrapper"
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: `1px solid ${getThemeValue(theme, 'colors.border', '#e2e8f0')}`,
          }}
          data-melony="table"
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoTable.displayName = "MelonyTable";

type TheadProps = WithNode<JSX.IntrinsicElements["thead"]>;
const MemoThead = memo<TheadProps>(
  ({ children, className, node, ...props }: TheadProps) => {
    const theme = useTheme();
    return (
      <thead
        style={{
          backgroundColor: getThemeValue(theme, 'colors.muted', '#f8fafc'),
        }}
        data-melony="table-header"
        {...props}
      >
        {children}
      </thead>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoThead.displayName = "MelonyThead";

type TbodyProps = WithNode<JSX.IntrinsicElements["tbody"]>;
const MemoTbody = memo<TbodyProps>(
  ({ children, className, node, ...props }: TbodyProps) => {
    const theme = useTheme();
    return (
      <tbody
        style={{
          backgroundColor: getThemeValue(theme, 'colors.muted', '#f8fafc'),
        }}
        data-melony="table-body"
        {...props}
      >
        {children}
      </tbody>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoTbody.displayName = "MelonyTbody";

type TrProps = WithNode<JSX.IntrinsicElements["tr"]>;
const MemoTr = memo<TrProps>(
  ({ children, className, node, ...props }: TrProps) => {
    const theme = useTheme();
    return (
      <tr
        style={{
          borderBottom: `1px solid ${getThemeValue(theme, 'colors.border', '#e2e8f0')}`,
        }}
        data-melony="table-row"
        {...props}
      >
        {children}
      </tr>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoTr.displayName = "MelonyTr";

type ThProps = WithNode<JSX.IntrinsicElements["th"]>;
const MemoTh = memo<ThProps>(
  ({ children, className, node, ...props }: ThProps) => {
    const theme = useTheme();
    return (
      <th
        style={{
          padding: `${getThemeValue(theme, 'spacing.xs', '4px')} ${getThemeValue(theme, 'spacing.sm', '8px')}`,
          textAlign: 'left',
          fontWeight: getThemeValue(theme, 'typography.fontWeight.semibold', '600'),
          fontSize: getThemeValue(theme, 'typography.fontSize.sm', '13px'),
          whiteSpace: 'nowrap',
        }}
        data-melony="table-header-cell"
        {...props}
      >
        {children}
      </th>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoTh.displayName = "MelonyTh";

type TdProps = WithNode<JSX.IntrinsicElements["td"]>;
const MemoTd = memo<TdProps>(
  ({ children, className, node, ...props }: TdProps) => {
    const theme = useTheme();
    return (
      <td
        style={{
          padding: `${getThemeValue(theme, 'spacing.xs', '4px')} ${getThemeValue(theme, 'spacing.sm', '8px')}`,
          fontSize: getThemeValue(theme, 'typography.fontSize.sm', '13px'),
        }}
        data-melony="table-cell"
        {...props}
      >
        {children}
      </td>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoTd.displayName = "MelonyTd";

// BLOCK COMPONENTS
type BlockquoteProps = WithNode<JSX.IntrinsicElements["blockquote"]>;
const MemoBlockquote = memo<BlockquoteProps>(
  ({ children, className, node, ...props }: BlockquoteProps) => {
    const theme = useTheme();
    return (
      <blockquote
        style={{
          margin: `${getThemeValue(theme, 'spacing.sm', '8px')} 0`,
          paddingLeft: getThemeValue(theme, 'spacing.sm', '8px'),
          borderLeft: `4px solid ${getThemeValue(theme, 'colors.mutedForeground', '#64748b')}`,
          color: getThemeValue(theme, 'colors.mutedForeground', '#64748b'),
          fontStyle: 'italic',
        }}
        data-melony="blockquote"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoBlockquote.displayName = "MelonyBlockquote";

type HrProps = WithNode<JSX.IntrinsicElements["hr"]>;
const MemoHr = memo<HrProps>(
  ({ className, node, ...props }: HrProps) => {
    const theme = useTheme();
    return (
      <hr
        style={{
          margin: `${getThemeValue(theme, 'spacing.md', '12px')} 0`,
          border: 'none',
          borderTop: `1px solid ${getThemeValue(theme, 'colors.border', '#e2e8f0')}`,
        }}
        data-melony="horizontal-rule"
        {...props}
      />
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoHr.displayName = "MelonyHr";

type ParagraphProps = WithNode<JSX.IntrinsicElements["p"]>;
const MemoParagraph = memo<ParagraphProps>(
  ({ children, className, node, ...props }: ParagraphProps) => {
    const theme = useTheme();
    
    // Check if the paragraph contains only an image element
    const childArray = Array.isArray(children) ? children : [children];
    const validChildren = childArray.filter(
      (child) => child !== null && child !== undefined && child !== ""
    );

    // Check if there's exactly one child and it's an img element
    if (
      validChildren.length === 1 &&
      isValidElement(validChildren[0]) &&
      (validChildren[0].props as { node?: MarkdownNode }).node?.tagName === "img"
    ) {
      return <>{children}</>;
    }

    return (
      <p
        style={{
          margin: `${getThemeValue(theme, 'spacing.sm', '8px')} 0`,
          lineHeight: '1.6',
          color: getThemeValue(theme, 'colors.foreground', '#0f172a'),
        }}
        data-melony="paragraph"
        {...props}
      >
        {children}
      </p>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoParagraph.displayName = "MelonyParagraph";

// SUBSCRIPT AND SUPERSCRIPT
type SupProps = WithNode<JSX.IntrinsicElements["sup"]>;
const MemoSup = memo<SupProps>(
  ({ children, className, node, ...props }: SupProps) => {
    const theme = useTheme();
    return (
      <sup
        style={{
          fontSize: getThemeValue(theme, 'typography.fontSize.xs', '11px'),
        }}
        data-melony="superscript"
        {...props}
      >
        {children}
      </sup>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoSup.displayName = "MelonySup";

type SubProps = WithNode<JSX.IntrinsicElements["sub"]>;
const MemoSub = memo<SubProps>(
  ({ children, className, node, ...props }: SubProps) => {
    const theme = useTheme();
    return (
      <sub
        style={{
          fontSize: getThemeValue(theme, 'typography.fontSize.xs', '11px'),
        }}
        data-melony="subscript"
        {...props}
      >
        {children}
      </sub>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoSub.displayName = "MelonySub";

// SECTION COMPONENT
type SectionProps = WithNode<JSX.IntrinsicElements["section"]>;
const MemoSection = memo<SectionProps>(
  ({ children, className, node, ...props }: SectionProps) => {
    // Check if this is a footnotes section
    const isFootnotesSection = "data-footnotes" in props;

    if (isFootnotesSection) {
      // Filter out empty footnote list items (those with only the backref link)
      const isEmptyFootnote = (listItem: React.ReactNode): boolean => {
        if (!isValidElement(listItem)) return false;

        const itemChildren = Array.isArray(listItem.props.children)
          ? listItem.props.children
          : [listItem.props.children];

        let hasContent = false;
        let hasBackref = false;

        for (const itemChild of itemChildren) {
          if (!itemChild) continue;

          if (typeof itemChild === "string") {
            if (itemChild.trim() !== "") {
              hasContent = true;
            }
          } else if (isValidElement(itemChild)) {
            if (itemChild.props?.["data-footnote-backref"] !== undefined) {
              hasBackref = true;
            } else {
              const grandChildren = Array.isArray(itemChild.props.children)
                ? itemChild.props.children
                : [itemChild.props.children];

              for (const grandChild of grandChildren) {
                if (
                  typeof grandChild === "string" &&
                  grandChild.trim() !== ""
                ) {
                  hasContent = true;
                  break;
                }
                if (isValidElement(grandChild)) {
                  if (
                    grandChild.props?.["data-footnote-backref"] === undefined
                  ) {
                    hasContent = true;
                    break;
                  }
                }
              }
            }
          }
        }

        return hasBackref && !hasContent;
      };

      const processedChildren = Array.isArray(children)
        ? children.map((child) => {
            if (!isValidElement(child)) return child;

            if (child.type === MemoOl) {
              const listChildren = Array.isArray(child.props.children)
                ? child.props.children
                : [child.props.children];

              const filteredListChildren = listChildren.filter(
                (listItem: React.ReactNode) => !isEmptyFootnote(listItem)
              );

              if (filteredListChildren.length === 0) {
                return null;
              }

              return {
                ...child,
                props: {
                  ...child.props,
                  children: filteredListChildren,
                },
              };
            }

            return child;
          })
        : children;

      const hasAnyContent = Array.isArray(processedChildren)
        ? processedChildren.some((child) => child !== null)
        : processedChildren !== null;

      if (!hasAnyContent) {
        return null;
      }

      return (
        <section
          className={className}
          data-melony="section"
          {...props}
        >
          {processedChildren}
        </section>
      );
    }

    return (
      <section
        className={className}
        data-melony="section"
        {...props}
      >
        {children}
      </section>
    );
  },
  (p, n) => sameClassAndNode(p, n)
);
MemoSection.displayName = "MelonySection";

// PRE COMPONENT
type PreProps = DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement> & ExtraProps;
const MemoPre = memo<PreProps>(
  ({ children, className, node, ...props }: PreProps) => {
    return (
      <pre
        className={className}
        data-melony="pre"
        {...props}
      >
        {children}
      </pre>
    );
  },
  (p, n) => p.className === n.className && sameNodePosition(p.node, n.node)
);
MemoPre.displayName = "MelonyPre";

// IMAGE COMPONENT
const MemoImg = memo<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> &
    ExtraProps
>(
  ({ src, alt, className, node, ...props }) => {
    const theme = useTheme();
    return (
      <div
        style={{
          margin: `${getThemeValue(theme, 'spacing.sm', '8px')} 0`,
          textAlign: 'center',
        }}
        data-melony="image-wrapper"
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: getThemeValue(theme, 'radius.md', '12px'),
            boxShadow: getThemeValue(theme, 'shadows.sm', '0 1px 2px 0 rgba(0, 0, 0, 0.03)'),
          }}
          data-melony="image"
          {...props}
        />
      </div>
    );
  },
  (p, n) => p.className === n.className && sameNodePosition(p.node, n.node)
);
MemoImg.displayName = "MelonyImg";

// Export all components
export const markdownComponents = {
  // Headings
  h1: MemoH1,
  h2: MemoH2,
  h3: MemoH3,
  h4: MemoH4,
  h5: MemoH5,
  h6: MemoH6,
  
  // Text
  strong: MemoStrong,
  a: MemoA,
  code: MemoCode,
  
  // Lists
  ul: MemoUl,
  ol: MemoOl,
  li: MemoLi,
  
  // Tables
  table: MemoTable,
  thead: MemoThead,
  tbody: MemoTbody,
  tr: MemoTr,
  th: MemoTh,
  td: MemoTd,
  
  // Blocks
  blockquote: MemoBlockquote,
  hr: MemoHr,
  p: MemoParagraph,
  section: MemoSection,
  
  // Other
  sup: MemoSup,
  sub: MemoSub,
  img: MemoImg,
  pre: MemoPre,
};
