import React from "react";
import { MuiMarkdown, getOverrides } from "mui-markdown";
import { CodeRenderer } from "./CodeRenderer";

interface MarkdownRendererProps {
  text: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  return (
    <MuiMarkdown
      overrides={{
        ...getOverrides(),
        pre: {
          component: CodeRenderer,
        },
      }}
    >
      {text}
    </MuiMarkdown>
  );
};
