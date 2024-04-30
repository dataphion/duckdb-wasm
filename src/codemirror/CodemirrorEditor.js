import React, { useEffect } from "react";
import { basicSetup } from "codemirror";
import ReactCodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { sql } from "@codemirror/lang-sql";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import codeMirrorTheme from "./Codemirrortheme";
import sqlMirrorTheme from "../Css/Sqlfiled";
import Context from "../Apicontext/Context";

const CodeMirrorEditor = ({
  children,
  value,
  cellType,
  bindShiftEnter = false,
  sqlTheme,
  onChange,
  sqlAutoCompletionOptions,
  autoCompletionOptions = [], // [{label: "magic", type: "text", apply: '""%%sql', detail: "macro"}]
  autoFocus = false,
  onShiftEnter = () => { },
  onClick = () => { },
  ...rest
}) => {
  const contextValues = React.useContext(Context);
  const [hardcoreData, setHardcoreData] = React.useState(null);
  const [dataFetched, setDataFetched] = React.useState(false);

  useEffect(() => {
    if (!dataFetched) {
      const fetchData = async () => {
        const customNamespaceData = await contextValues.customNamespace();
        setHardcoreData(customNamespaceData);
        setDataFetched(true);
      };

      fetchData();
    }
  }, [contextValues, dataFetched]);

  const keyBinding = [
    {
      key: "Shift-Enter",
      run: onShiftEnter,
      preventDefault: true,
    },
  ];

  const autocomplete = (context) => {
    console.log("context", context);
    const word = context.matchBefore(/\w*/);
    if (word?.from == word?.to && !context.explicit) return null;
    return {
      from: word?.from,
      options: autoCompletionOptions,
    };
  };

  const myCompletions = (context) => {
    const word = context.matchBefore(/\w*/);
    let doc_str = context.state.doc.toString().toLowerCase();

    if (doc_str.endsWith("from ") || doc_str.endsWith(",") || doc_str.endsWith(", ")) {
      const options = Array.isArray(hardcoreData)
        ? hardcoreData.map(item => ({ label: item.name }))
        : [];

      return {
        from: word?.from,
        options: options,
      };
    }
    if (word.text === "" && doc_str.endsWith(".")) {
      // Get the last string after space in doc_str
      let last_word = doc_str.split(" ").pop();
      console.log("last_word", last_word);
      let db_data = last_word.split(".");

      let options;

      if (db_data.length === 2) {
        const schemaTblOptions = hardcoreData.map(item => ({ label: item.children[0].title }));
        options = schemaTblOptions;
      } else {
        const mysqlDatabaseOptions = hardcoreData.map(item => ({ label: item.children[0].children[0].title }));
        options = mysqlDatabaseOptions;
      }

      return {
        from: word.from,
        options: options
      };
    }

    // Default return all SQL keywords
    if (!doc_str.endsWith("=") || !doc_str.endsWith("<") || !doc_str.endsWith(">") || !doc_str.endsWith("<=") || !doc_str.endsWith(">=") || !doc_str.endsWith("!="))
      return {
        from: word.from,
        options: [
          { label: 'SELECT' },
          { label: 'FROM' },
          { label: 'WHERE' },
          { label: 'GROUP BY' },
          { label: 'ORDER BY' },
          { label: 'LIMIT' },
          { label: 'OFFSET' },
          { label: 'HAVING' },
          { label: 'UNION' },
          { label: 'UNION ALL' },
          { label: 'EXCEPT' },
          { label: 'INTERSECT' },
          { label: 'JOIN' },
          { label: 'INNER JOIN' },
          { label: 'LEFT JOIN' },
          { label: 'RIGHT JOIN' },
          { label: 'FULL JOIN' },
          { label: 'CROSS JOIN' },
          { label: 'ON' },
          { label: 'AND' },
          { label: 'OR' },
          { label: 'NOT' },
          { label: 'IS' },
          { label: 'NULL' },
          { label: 'TRUE' },
          { label: 'FALSE' },
          { label: 'CASE' },
          { label: 'WHEN' },
          { label: 'THEN' },
          { label: 'ELSE' },
          { label: 'END' },
          { label: 'AS' },
          { label: 'DISTINCT' },
          { label: 'COUNT' },
          { label: 'SUM' },
          { label: 'AVG' },
          { label: 'MIN' },
          { label: 'MAX' },
          { label: 'OVER' },
          { label: 'PARTITION BY' },
          { label: 'ORDER BY' },
          { label: 'ASC' },
          { label: 'DESC' },
          { label: 'LIKE' },
          { label: 'IN' },
          { label: 'BETWEEN' },
          { label: 'EXISTS' },
          { label: 'CAST' },
          { label: 'DATE' },
          { label: 'DATE_ADD' },
          { label: 'DATE_SUB' },
          { label: 'DATE_DIFF' },
          { label: 'DATE_TRUNC' },
          { label: 'DATE_PART' },
          { label: 'CURRENT_DATE' },
          { label: 'CURRENT_TIME' },
          { label: 'CURRENT_TIMESTAMP}' }
        ]
      };

    // if (!word || (word.from === word.to && !context.explicit)) {
    //     return null;
    // }


  }

  return (
    // Enable activateOnTyping to enable autocomplete on typing
    <ReactCodeMirror
      value={value}
      onClick={onClick}
      onChange={onChange}
      autoFocus={autoFocus}

      extensions={[
        basicSetup,
        EditorView.lineWrapping,
        ...(sqlTheme ? sqlMirrorTheme : codeMirrorTheme),
        sql(sqlAutoCompletionOptions),
        autocompletion({
          override: [myCompletions],
          activateOnTyping: true
        }),

        // ...(cellType === "sql" ? [sql(sqlAutoCompletionOptions)] : []),
      ]}
      {...rest}
    >
      {children}
    </ReactCodeMirror>
  );
};

export default CodeMirrorEditor;
