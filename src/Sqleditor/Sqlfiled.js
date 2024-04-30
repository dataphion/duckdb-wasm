import { EditorView } from "@codemirror/view";

const theme = EditorView.theme(
  {
    "&": {
      fontSize: "11pt",
      border: "1px solid #c0c0c0",
    },
    ".cm-content": {
      // fontFamily: "Menlo, Monaco, Lucida Console, monospace",
      fontFamily: "Manrope",
    },
    ".cm-gutters": {
      minHeight: "10px",
    },
    ".cm-scroller": {
      overflow: "auto",
    },
    ".cm-foldGutter": {
      display: "none !important",
    },
  },
  { dark: false }
);

const sqlMirrorTheme = [theme];

export default sqlMirrorTheme;
