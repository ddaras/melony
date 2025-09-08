import React from 'react';

export interface AgentSidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export function AgentSidebar({ children, className }: AgentSidebarProps) {
  return (
    <aside
      data-ai-agent-sidebar=""
      className={className ?? 'w-64 shrink-0 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900'}
    >
      {children}
    </aside>
  );
}
