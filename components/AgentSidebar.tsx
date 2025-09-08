import React from 'react';

export interface AgentSidebarProps {
  children?: React.ReactNode;
}

export function AgentSidebar({ children }: AgentSidebarProps) {
  return <aside data-ai-agent-sidebar="">{children}</aside>;
}
