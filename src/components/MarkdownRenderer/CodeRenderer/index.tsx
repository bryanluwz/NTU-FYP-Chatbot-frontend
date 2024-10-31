import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { ContentCopy } from "@mui/icons-material";

interface CodeRendererProps {
  children: React.ReactElement;
}

export const CodeRenderer: React.FC<CodeRendererProps> = ({ children }) => {
  const [childrenString, setChildrenString] = React.useState<
    | {
        children: string;
        className: string;
      }
    | undefined
  >(undefined);
  const [codeLanguage, setCodeLanguage] = React.useState("");
  const [text, setText] = React.useState("");

  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    if (children) {
      setChildrenString(children.props);
    }
  }, [children]);

  React.useEffect(() => {
    if (childrenString) {
      const codeLanguage = childrenString.className.replace("lang-", "");
      const text = childrenString.children;

      setCodeLanguage(codeLanguage);
      setText(text);
    }
  }, [childrenString]);

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } else {
      console.error(
        "Clipboard API not supported or running in insecure context."
      );
    }
  };

  return (
    <Box>
      <Stack
        direction={"column"}
        sx={{
          background: "var(--secondary-dark-background-color)",
          borderRadius: "0.5rem",
          margin: "0.5rem 0rem",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{
            color: "white",
            padding: "0rem 1rem",
          }}
        >
          <pre>{codeLanguage}</pre>
          <IconButton onClick={handleCopy}>
            <Tooltip title={isCopied ? "Copied!" : "Copy"}>
              <ContentCopy sx={{ color: "white" }} />
            </Tooltip>
          </IconButton>
        </Stack>
        <SyntaxHighlighter
          customStyle={{
            background: "var(--primary-dark-background-color)",
            boxShadow: "none",
            border: "none",
            textShadow: "none",
            margin: 0,
          }}
          codeTagProps={{
            style: {
              textShadow: "none",
            },
          }}
          language={codeLanguage}
          style={dark}
        >
          {text}
        </SyntaxHighlighter>
      </Stack>
    </Box>
  );
};
