import React from "react";
import { UIBlock } from "../core/messages";

export const ToolResponse: React.FC<{ blocks: UIBlock[] }> = ({ blocks }) => {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "text":
            return <p key={i}>{b.value}</p>;
          case "table":
            return (
              <table key={i}>
                <thead>
                  <tr>
                    {b.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case "form":
            return (
              <form key={i}>
                {b.fields.map((f) => (
                  <input key={f.name} placeholder={f.label} />
                ))}
              </form>
            );
          case "detail":
            return <pre key={i}>{JSON.stringify(b.data, null, 2)}</pre>;
          case "chart":
            return <div key={i}>[Chart: {b.kind}]</div>;
          default:
            return null;
        }
      })}
    </>
  );
};
