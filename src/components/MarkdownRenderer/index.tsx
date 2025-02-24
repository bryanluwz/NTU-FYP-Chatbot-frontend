import React from "react";
import { MuiMarkdown, getOverrides } from "mui-markdown";
import { CodeRenderer } from "./CodeRenderer";

interface MarkdownRendererProps {
  text: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  const normalizeMarkdown = (text: string) => {
    return text.replace(/\n\s*```/g, "\n\n```"); // Ensure a newline before code blocks
  };

  return (
    <MuiMarkdown
      overrides={{
        ...getOverrides(),
        // pre is block, code is inline
        pre: {
          component: CodeRenderer,
        },
      }}
    >
      {normalizeMarkdown(text)}
    </MuiMarkdown>
  );
};
