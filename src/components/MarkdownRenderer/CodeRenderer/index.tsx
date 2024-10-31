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
    } else {
      console.error(
        "Clipboard API not supported or running in insecure context."
      );
    }
  };

  return (
    <Box>
      <Stack direction={"column"}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {/* <Typography variant="body1">{codeLanguage}</Typography> */}
          <pre>{codeLanguage}</pre>
          <IconButton onClick={handleCopy}>
            <Tooltip title={"Copy"}>
              <ContentCopy />
            </Tooltip>
          </IconButton>
        </Stack>
        <SyntaxHighlighter language={codeLanguage} style={dark}>
          {text}
        </SyntaxHighlighter>
      </Stack>
    </Box>
  );
};
