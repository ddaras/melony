import React from 'react';

export interface AgentSidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export function AgentSidebar({ children, className }: AgentSidebarProps) {
  const defaultStyle: React.CSSProperties = {
    width: '16rem', // w-64
    flexShrink: 0, // shrink-0
    borderRight: '1px solid #e5e7eb', // border-r border-gray-200
    backgroundColor: '#ffffff', // bg-white
    padding: '1rem', // p-4
  };

  return (
    <aside
      data-ai-agent-sidebar=""
      className={className}
      style={className ? undefined : defaultStyle}
    >
      {children}
    </aside>
  );
}
