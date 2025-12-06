import React from "react";
import { ContentBlock } from "@melony/client";

export interface RendererProps {
  blocks: ContentBlock[];
  components: Record<string, React.FC<any>>;
}

const DefaultUnknown: React.FC<any> = ({ componentName, children }) => (
  <div className="text-red-500 border border-red-200 p-2 my-2 rounded text-sm">
    Unknown component: {componentName}
    {children && (
      <div className="mt-1 pl-2 border-l-2 border-red-100">{children}</div>
    )}
  </div>
);

export function Renderer({ blocks, components }: RendererProps) {
  return <>{blocks.map((block, i) => renderBlock(block, i, components))}</>;
}

function renderBlock(
  block: ContentBlock,
  key: number,
  componentMap: Record<string, React.FC<any>>
): React.ReactNode {
  if (typeof block === "string") {
    return (
      <span key={key} style={{ whiteSpace: "pre-line" }}>
        {block}
      </span>
    );
  }

  const Component =
    componentMap[block.name] || componentMap.unknown || DefaultUnknown;

  const children = block.children.map((child, i) =>
    renderBlock(child, i, componentMap)
  );

  if (Component === componentMap.unknown || Component === DefaultUnknown) {
    return (
      <Component key={key} componentName={block.name}>
        {children}
      </Component>
    );
  }

  return (
    <Component key={key} {...block.props}>
      {children}
    </Component>
  );
}
