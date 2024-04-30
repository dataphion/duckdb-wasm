import { EditorView } from "@codemirror/view";

const theme = EditorView.theme(
  {
    "&": {
      fontSize: "9pt",
      border: "1px solid #c0c0c0",
    },
    ".cm-content": {
      fontFamily: "Menlo, Monaco, Lucida Console, monospace",
      minHeight: "10px",
    },
    ".cm-gutters": {
      minHeight: "10px",
    },
    ".cm-scroller": {
      overflow: "auto",
    },
  },
  { dark: false }
);

const codeMirrorTheme = [theme];

export default codeMirrorTheme;
