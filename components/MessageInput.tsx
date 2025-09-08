import React from 'react';

export interface MessageInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export function MessageInput({ value, onChange, onSubmit, placeholder }: MessageInputProps) {
  return (
    <form
      data-ai-message-input=""
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button type="submit">Send</button>
    </form>
  );
}
