import React from 'react';
import type { Message } from '../core/messages';

export interface MessageListProps {
  messages: Message[];
  renderMessage?: (m: Message) => React.ReactNode;
}

export function MessageList({ messages, renderMessage }: MessageListProps) {
  return (
    <div data-ai-message-list="">
      {messages.map((m) => (
        <div key={m.id} data-role={m.role} data-type={(m as any).type}>
          {renderMessage ? renderMessage(m) : null}
        </div>
      ))}
    </div>
  );
}
