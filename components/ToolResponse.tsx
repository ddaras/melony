import React from "react";
import { UIBlock } from "../core/messages";

type ToolResponseProps = {
  blocks: UIBlock[];
  className?: string;
};

export const ToolResponse: React.FC<ToolResponseProps> = ({ blocks, className }) => {
  return (
    <div className={className ?? "flex flex-col gap-3"}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "text":
            return <p key={i} className="text-sm text-gray-900 dark:text-gray-100">{b.value}</p>;
          case "table":
            return (
              <div key={i} className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-md border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      {b.columns.map((c) => (
                        <th key={c} className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
                    {b.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "form":
            return (
              <form key={i} className="flex flex-col gap-2">
                {b.fields.map((f) => (
                  <input
                    key={f.name}
                    placeholder={f.label}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                ))}
              </form>
            );
          case "detail":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
              >
                {JSON.stringify(b.data, null, 2)}
              </pre>
            );
          case "chart":
            return (
              <div
                key={i}
                className="rounded-md border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
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
