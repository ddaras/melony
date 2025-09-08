import React from "react";
import { UIBlock } from "../core/messages";

type ToolResponseProps = {
  blocks: UIBlock[];
  className?: string;
};

export const ToolResponse: React.FC<ToolResponseProps> = ({ blocks, className }) => {
  const defaultContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem', // gap-3
  };

  return (
    <div 
      className={className}
      style={className ? undefined : defaultContainerStyle}
    >
      {blocks.map((b, i) => {
        switch (b.type) {
          case "text":
            return (
              <p 
                key={i} 
                style={{
                  fontSize: '0.875rem', // text-sm
                  color: '#111827', // text-gray-900
                }}
              >
                {b.value}
              </p>
            );
          case "table":
            return (
              <div 
                key={i} 
                style={{
                  overflowX: 'auto', // overflow-x-auto
                }}
              >
                <table 
                  style={{
                    minWidth: '100%', // min-w-full
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                    overflow: 'hidden', // overflow-hidden
                    borderRadius: '0.375rem', // rounded-md
                    border: '1px solid #e5e7eb', // border border-gray-200
                  }}
                >
                  <thead 
                    style={{
                      backgroundColor: '#f9fafb', // bg-gray-50
                    }}
                  >
                    <tr>
                      {b.columns.map((c) => (
                        <th 
                          key={c} 
                          style={{
                            paddingLeft: '0.75rem', // px-3
                            paddingRight: '0.75rem',
                            paddingTop: '0.5rem', // py-2
                            paddingBottom: '0.5rem',
                            textAlign: 'left', // text-left
                            fontSize: '0.75rem', // text-xs
                            fontWeight: '500', // font-medium
                            textTransform: 'uppercase', // uppercase
                            letterSpacing: '0.05em', // tracking-wider
                            color: '#4b5563', // text-gray-600
                          }}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody 
                    style={{
                      backgroundColor: '#ffffff', // bg-white
                    }}
                  >
                    {b.rows.map((row, ri) => (
                      <tr 
                        key={ri}
                        style={{
                          borderTop: ri > 0 ? '1px solid #e5e7eb' : undefined, // divide-y divide-gray-200
                        }}
                      >
                        {row.map((cell, ci) => (
                          <td 
                            key={ci} 
                            style={{
                              paddingLeft: '0.75rem', // px-3
                              paddingRight: '0.75rem',
                              paddingTop: '0.5rem', // py-2
                              paddingBottom: '0.5rem',
                              fontSize: '0.875rem', // text-sm
                              color: '#111827', // text-gray-900
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "form":
            return (
              <form 
                key={i} 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem', // gap-2
                }}
              >
                {b.fields.map((f) => (
                  <input
                    key={f.name}
                    placeholder={f.label}
                    style={{
                      borderRadius: '0.375rem', // rounded-md
                      border: '1px solid #d1d5db', // border border-gray-300
                      backgroundColor: '#ffffff', // bg-white
                      paddingLeft: '0.75rem', // px-3
                      paddingRight: '0.75rem',
                      paddingTop: '0.5rem', // py-2
                      paddingBottom: '0.5rem',
                      fontSize: '0.875rem', // text-sm
                      color: '#111827', // text-gray-900
                      outline: 'none', // focus:outline-none
                    }}
                  />
                ))}
              </form>
            );
          case "detail":
            return (
              <pre
                key={i}
                style={{
                  overflowX: 'auto', // overflow-x-auto
                  borderRadius: '0.375rem', // rounded-md
                  border: '1px solid #e5e7eb', // border border-gray-200
                  backgroundColor: '#f9fafb', // bg-gray-50
                  padding: '0.75rem', // p-3
                  fontSize: '0.75rem', // text-xs
                  color: '#111827', // text-gray-900
                }}
              >
                {JSON.stringify(b.data, null, 2)}
              </pre>
            );
          case "chart":
            return (
              <div
                key={i}
                style={{
                  borderRadius: '0.375rem', // rounded-md
                  border: '1px dashed #d1d5db', // border border-dashed border-gray-300
                  padding: '1rem', // p-4
                  textAlign: 'center', // text-center
                  fontSize: '0.875rem', // text-sm
                  color: '#6b7280', // text-gray-500
                }}
              >
                [Chart: {b.kind}]
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
