import React from 'react';

export interface ConversationProps {
  children?: React.ReactNode;
}

export function Conversation(props: ConversationProps) {
  return <div data-ai-conversation="" style={{ display: 'contents' }}>{props.children}</div>;
}
