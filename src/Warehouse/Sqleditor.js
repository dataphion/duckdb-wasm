import React, { useState, useRef, useEffect } from "react";
import { Alert } from "@mui/material";
import { Dropdown, Modal, Tree, Switch, Space } from "antd";
import Ansi from "ansi-to-react";
import CodeMirrorEditor from "../../src/codemirror/CodemirrorEditor";
import Button from "../Widget/Button";
import Table from "../Widget/Table";
import CustomTooltip from "../Widget/Tooltip";
import Tabs from "../Widget/Tabs";
import Input from "../Widget/Input"
import "../Css/Sqleditor.css"
import { Context } from "../Apicontext/Context"
import axios from "axios";
import constants from "../Widget/constants";
import * as duckdb from '@duckdb/duckdb-wasm';
import Tableduckdb from "../../src/Widget/Tableduckdb"
import { DownOutlined } from '@ant-design/icons';
import { set } from "lodash";


const Sidebar = (props) => {
  const contextValues = React.useContext(Context);
  const divRef = useRef();
  const [activeTab, setActiveTab] = useState();
  const [sqlQuery, setSqlQuery] = useState('');
  const [limit, setLimit] = useState(100);
  const [error, setError] = useState();
  const [tableData, setTableData] = useState();
  const [time, setTime] = useState({ minutes: 0, seconds: 0, milliseconds: 0 });
  const [loading, setLoading] = useState(false);
  const [lakehouseLoading, setLakehouseLoading] = useState();
  const [expand, setExpand] = useState(false);
  const [height, setHeight] = useState(300);
  const [test, setTest] = useState();
  const [open, setOpen] = useState(false);
  const [server_value, setServer_value] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [region_value, setRegion_value] = useState('');
  const [name, setName] = useState('');
  const [bucket_value, setBucket_value] = useState('');
  const [path_value, setPath_value] = useState('');
  const [activeLineText, setActiveLineText] = useState("");
  const [selectedText, setSelectedText] = useState();
  const [showTableHeaders, setShowTableHeaders] = useState(false);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [rows, setRows] = useState([]);
  const [connection, setConnection] = useState();
  const [executionMode, setExecutionMode] = useState("");

  const items: MenuProps['items'] = [
    {
      label: "In Browser Mode",
      key: 'local',
    },
    {
      label: "Remote ADBC",
      key: 'remote',
    },
    {
      type: 'divider',
    },
  ];

  const fielData = [
    { field: 'server', label: 'Endpoint', value: server_value },
    { field: 'accessKey', label: 'Access Key', value: accessKey },
    { field: 'secretKey', label: 'Secret Key', value: secretKey },
    { field: 'region', label: 'Region', value: region_value },
    { field: 'name', label: 'Name', value: name },
    { field: 'bucket', label: 'Bucket', value: bucket_value },
    { field: 'path', label: 'Path', value: path_value },

  ]


  const handleResize = () => {
    setHeight(divRef?.current?.clientHeight);
  };

  const addQueries = () => {
    setTest(true)
    setOpen(true)
  };

  const handleCancel = () => {
    setOpen(false)
  }

  const handleInputChange = (field, value) => {
    const stateUpdater = { server: setServer_value, accessKey: setAccessKey, secretKey: setSecretKey, region: setRegion_value, name: setName, bucket: setBucket_value, path: setPath_value };
    stateUpdater[field]?.(value);
  };



  const limitItems = [
    {
      label: (
        <div className="flex items-center space-x-4" role="presentation" onClick={() => setLimit(10)}>
          <span>10</span>
        </div>
      ),
      key: "10",
    },
    {
      label: (
        <div className="flex items-center space-x-4" role="presentation" onClick={() => setLimit(100)}>
          <span>100</span>
        </div>
      ),
      key: "100",
    },
    {
      label: (
        <div className="flex items-center space-x-4" role="presentation" onClick={() => setLimit(1000)}>
          <span>1000</span>
        </div>
      ),
      key: "1000",
    },
    {
      label: (
        <div className="flex items-center space-x-4" role="presentation" onClick={() => setLimit(10000)}>
          <span>10000</span>
        </div>
      ),
      key: "10000",
    },
    {
      label: (
        <div className="flex items-center space-x-4" role="presentation" onClick={() => setLimit(0)}>
          <span>No Limit</span>
        </div>
      ),
      key: "no_limit",
    },
  ];

  const tabData = [{ title: "RESULT", value: "result" }];

  const treeData = (contextValues.getCustomNamespace);

  // Function to handle form submission
  const handleSubmit = () => {
    if (server_value && accessKey && secretKey && region_value && name && bucket_value) {
      setOpen(false);
      contextValues.getAllCatalogs({
        server_value,
        accessKey,
        secretKey,
        region_value,
        name,
        bucket_value,
        path_value,
      });
      setRegion_value("");
      setServer_value("");
      setBucket_value("");
      setAccessKey("");
      setName("");
      setSecretKey("");
      setPath_value("");
    }
  };
  const handleActiveLineClick = () => {
    const activeLine = document.querySelector(".cm-activeLine");
    if (activeLine) {
      const text = activeLine.textContent;
      setActiveLineText(text);
    }
  };

  const handleArrowKeyPress = (event) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
        handleActiveLineClick();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleArrowKeyPress);

    return () => {
      window.removeEventListener("keydown", handleArrowKeyPress);
    };
  }, []);





  useEffect(() => {
    let timer;
    const startTimer = () => {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newMilliseconds = prevTime.milliseconds + 100;
          const newSeconds = prevTime.seconds + Math.floor(newMilliseconds / 1000);
          const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);

          return {
            minutes: newMinutes,
            seconds: newSeconds % 60,
            milliseconds: newMilliseconds % 1000,
          };
        });
      }, 100);
    };

    const stopTimer = () => {
      clearInterval(timer);
    };

    if (loading) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [loading]);


  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setSelectedText(selection.toString());
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const successMessage = () => {
    const queryText = selectedText ? selectedText: activeLineText;
    if (queryText?.toLowerCase()?.includes("select")) {
      return "Query succeed but table data not found.";
    } else {
      return "Query succeed";
    }
  };

  const queryRun = async () => {

    const query = selectedText ? selectedText: activeLineText;
    console.log("query", query);
    console.log("selectedText", selectedText);
    console.log("activeLineText", activeLineText);
    console.log("--------------------");
    if (executionMode === 'local') {
      // setLoading(true);
      // extract string of patter string.string.string from query
      const regex = /([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/g;
      const matches = query.match(regex);
      console.log("matches", matches);
      if (matches) {
        const db_details = matches[0].split(".");
        console.log("db_details", db_details);
        const catalog = db_details[0];
        const schema = db_details[1];
        const table = db_details[2];
        // Fetch S3 details for matching catalog
        const catalogDetails = await contextValues.getCatalogDetails(catalog);
        console.log("catalogDetails", catalogDetails);
        if(catalogDetails.length === 0){
          alert("Catalog not found");
          setLoading(false);
          return;
        }
        const s3Details = {
          bucket: catalogDetails[0].attributes.bucket,
          access_key: catalogDetails[0].attributes.access_key,
          secret_key: catalogDetails[0].attributes.secret_key,
          region: catalogDetails[0].attributes.region,
          endpoint: catalogDetails[0].attributes.server.replace("https://", ""),
          path: catalogDetails[0].attributes.folder_path
        }
        // await connection.query("INSTALL aws")
        // await connection.query("LOAD aws")
        // await connection.query("INSTALL httpfs")
        // await connection.query("LOAD httpfs")
        await connection.query("SET autoload_known_extensions=1")
        await connection.query("SET autoinstall_known_extensions=1")
        // Start setting S3 bucket configuration in DuckDB
        // connection.query(`SET s3_region='${s3Details.region}'`);
        // connection.query(`SET s3_access_key_id='${s3Details.access_key}'`);
        // connection.query(`SET s3_secret_access_key='${s3Details.secret_key}'`);
        // connection.query(`SET s3_endpoint='${s3Details.endpoint}'`);
        // connection.query(`SET s3_endpoint='${s3Details.endpoint}'`);
        let q = "";

        if (s3Details.path) {
          // q = query.replace(matches[0], `read_parquet('s3://${s3Details.bucket}/${s3Details.path}/${schema}/${table}/data/*.parquet')`)
          q = query.replace(matches[0], `read_parquet('s3://${s3Details.bucket}/${schema}/${table}/data/part.parquet')`)
        }else{
          q = query.replace(matches[0], `read_parquet('s3://${s3Details.bucket}/${schema}/${table}/data/part.parquet')`)
        }
        // q = "select * from 'https://shell.duckdb.org/data/tpch/0_01/parquet/lineitem.parquet'"
        q = "select * from read_parquet('s3://gk-foit-storage/lineitem.parquet')"
        console.log("q", q);        
        const stmt = await connection.prepare(`${q}`);

        // Log the result
        const newRows = [];
        let columns = [];
        let cols = [];
        for await (const row of await stmt.send()) {
          console.log(row);
          const schema = row.schema
          if (columns.length === 0) {
            columns = schema.fields.map((field) => field.name);
            cols = columns.map((item, index) => ({ id: index + 1, label: item, position: "left" }))
          }
          console.log("columns", columns);
          const data = row.data;
          // Get the data in row format

          for (const record of data.children) {
            const newRow = {};
            for (let i = 0; i < columns.length; i++) {
              newRow[columns[i]] = record.values[i];
            }
            newRows.push(newRow);
          }
        }
        console.log("row count", newRows.length);
        setTableHeaders(cols);
        setRows(newRows);
        setShowTableHeaders(true);
        setDataLoaded(true);
        setLoading(false);
        setLoading(false);
        return;
      }

      // console.log("Executing Local Mode");
      // if (connection) {
      //   console.log("query", query);
      //   // if(!query){
      //   //   return;
      //   // }
      //   const stmt = await connection.prepare(`${query}`);

      //   // Log the result
      //   const newRows = [];
      //   let columns = [];
      //   let cols = [];
      //   for await (const row of await stmt.send()) {
      //     console.log(row);
      //     const schema = row.schema
      //     if (columns.length === 0) {
      //       columns = schema.fields.map((field) => field.name);
      //       cols = columns.map((item, index) => ({ id: index + 1, label: item, position: "left" }))
      //     }
      //     console.log("columns", columns);
      //     const data = row.data;
      //     // Get the data in row format

      //     for (const record of data.children) {
      //       const newRow = {};
      //       for (let i = 0; i < columns.length; i++) {
      //         newRow[columns[i]] = record.values[i];
      //       }
      //       newRows.push(newRow);
      //     }
      //   }
      //   console.log("row count", newRows.length);
      //   setTableHeaders(cols);
      //   setRows(newRows);
      //   setShowTableHeaders(true);
      //   setDataLoaded(true);
      //   setLoading(false);
      // } else {
      //   alert("Failed to initialize local DB engine, please refresh or try again")
      // }
    } else if (executionMode === 'remote') {
      setLoading(true);
      console.log("Executing Remote mode");
      try {
        const execute = await axios.post(
          `${constants.url.execute}`,
          {
            query: query,

          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        setTableData(execute?.data);
        setError('');
        setLoading(false);
      } catch (e) {
        setTableData([]);
        setError(e?.response?.data?.detail);
        setLoading(false);

      }
    } else {
      alert("Please select execution mode")
    }


  };



  // eslint-disable-next-line no-unused-vars
  let DUCKDB_CONFIG = {};
  useEffect(() => {
    contextValues.customNamespace();
    let loadDuckDB = async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      DUCKDB_CONFIG = await duckdb.selectBundle({
        mvp: {
          mainModule: './duckdb-mvp.wasm',
          mainWorker: './duckdb-browser-mvp.worker.js',
        },
        eh: {
          mainModule: './duckdb-eh.wasm',
          mainWorker: './duckdb-browser-eh.worker.js',
        },
        coi: {
          mainModule: './duckdb-coi.wasm',
          mainWorker: './duckdb-browser-coi.worker.js',
          pthreadWorker: './duckdb-browser-coi.pthread.worker.js',
        },
      }
      );
      console.log("DUCKDB_CONFIG", DUCKDB_CONFIG);
      const logger = new duckdb.ConsoleLogger();
      const worker = new Worker(DUCKDB_CONFIG?.mainWorker);
      const db = new duckdb.AsyncDuckDB(logger, worker);
      console.log("db", db);
      // Initialize db 
      await db.instantiate(DUCKDB_CONFIG.mainModule, DUCKDB_CONFIG.pthreadWorker);
      const conn = await db.connect();
      // const resp = await conn.query(`select * from 'https://shell.duckdb.org/data/tpch/0_01/parquet/lineitem.parquet'`);
      setConnection(conn);

    }
    if (!connection) {
      loadDuckDB();
    }
    // if (runClicked) {
    //   loadDuckDB();
    // }
  }, []);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    console.log(`Click on item ${key}`);
    setExecutionMode(key);
  };

  console.log("Re-rendering")

  return (
    <>
      <div className="w-full h-full">
        <div className="h-[calc(100vh-0.4rem)] w-full px-10 py-4">
          <>
            <div className="bg-white h-full flex w-full rounded-[4px]">
              <div className="w-136 border-r overflow-auto">
                <div className="w-full flex justify-between items-center h-28 px-8 border-b">
                  <span className="text-md font-normal">Catalogs</span>
                  <CustomTooltip direction="top" title="Add">
                    <i
                      className="fa-solid fa-plus cursor-pointer hover:text-InputOrange"
                      role="presentation"
                      onClick={() => addQueries()}
                    />
                  </CustomTooltip>
                </div>
                {test && (
                  <Modal open={open} centered footer={null} onCancel={handleCancel} className="custom_modal">
                    <div className="grid grid-cols-2 gap-5 mt-16">
                      {fielData.map((item) => (
                        <div key={item.field} className="mb-8 items-center">
                          <label htmlFor={item.field} className="block ttext-[0.8rem] font-medium text-gray-600 pr-4 font-sans">
                            {item.label}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            id={item.field}
                            className="mt-15 p-1 rounded-md w-[20rem]"
                            placeholder=""
                            value={item.value}
                            onChange={(e) => handleInputChange(item.field, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button type="primary" onClick={handleSubmit} >
                        Save
                      </Button>
                    </div>
                  </Modal>
                )}
                <div className="pl-6 pt-6 flex items-center text-sm font-light">Active Catalogs</div>
                <div className="p-6 catalog-tree">
                  <Tree
                    showIcon
                    treeData={treeData}
                  />
                </div>
              </div>
              <div className="w-[calc(100vw-31.6rem)] overflow-hidden">
                <>
                  {!expand && (
                    <div
                      className="w-full rounded-xs overflow-hidden p-6 border-b relative sqllab-editor resize-y"
                      role="presentation"
                      ref={divRef}
                      style={{ height: `${height}px`, maxHeight: "calc(100vh - 18rem)", minHeight: "200px", resize: "vertical" }}
                      onMouseDown={() => {
                        window.addEventListener("mousemove", handleResize);
                        window.addEventListener("mouseup", () => {
                          window.removeEventListener("mousemove", handleResize);
                        });
                      }}
                    >
                      <CodeMirrorEditor
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        height={`${height - 58}px`}
                        cellType="sql"
                        className="w-full"
                        sqlTheme
                        basicSetup={{
                          foldGutter: false,
                        }}
                        sqlAutoCompletionOptions={{ schemas: ['db1', 'db2', 'db3'], activateOnTyping: true }}
                        autoCompletionOptions={(e) => {
                          console.log(e);
                        }}
                        value={sqlQuery}
                        onChange={(e, editor) => {
                          setSqlQuery(e);
                        }}
                        onClick={handleActiveLineClick}
                      />
                      <div className="flex justify-between items-center w-full border-x border-b border-gray-400">
                        <div className="w-full flex items-center space-x-6 p-4">
                          <Button
                            color="primaryColor"
                            size="small"
                            startIcon={<i className="fa-solid fa-play mr-6" />}
                            disable={loading || lakehouseLoading}
                            showLoading
                            variant="contained"

                            onClick={async () => {
                              setTime({ minutes: 0, seconds: 0, milliseconds: 0 });
                              await queryRun(); // Wait for queryRun to finish
                              // setRunClicked(true); // Set runClicked to true after queryRun is successful
                            }}
                          >
                            RUN
                          </Button>
                          {loading || lakehouseLoading ? (
                            <Button size="small" className="cursor-not-allowed flex items-center text-xs" disable variant="contained">
                              LIMIT: {limit}
                              <i className="fa-solid fa-chevron-down text-2xs ml-8 font-bold" />
                            </Button>
                          ) : (
                            <Dropdown menu={{ items: limitItems }}>
                              <Button size="small" className="cursor-pointer flex items-center text-xs">
                                LIMIT: {limit == 0 ? "no limit" : limit}
                                <i className="fa-solid fa-chevron-down text-2xs ml-8 font-bold" />
                              </Button>
                            </Dropdown>
                          )}
                          <Button className="w-fit" size="small" startIcon={<i className="fa-solid fa-floppy-disk mr-6" />} >
                            SAVE
                          </Button>
                        </div>
                        <div className="w-full flex items-center space-x-10 p-4 justify-end">
                          <div style={{ cursor: 'pointer' }}>
                            <Dropdown menu={{ items, onClick }} trigger={['click']}>
                              <Space>
                                {executionMode === '' ? 'Select Mode' : executionMode === "local" ? "In Browser Mode" : "Remote ADBC"}
                                <DownOutlined />
                              </Space>
                            </Dropdown>
                          </div>
                          <div className="w-fit rounded-full font-medium text-xxs text-white bg-green-500 px-6 h-12 leading-6 flex items-center justify-center">
                            {`00:${time?.minutes?.length >= 10 ? time?.minutes : time?.minutes?.toString()?.padStart(2, "0")}:${time?.seconds?.length >= 10 ? time?.seconds : time?.seconds?.toString()?.padStart(2, "0")?.substring(0, 2)
                              }:${time?.milliseconds?.toString()?.substring(0, 2)}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="w-full flex justify-between items-center border-b my-8">
                    <Tabs type="basic" tabs={tabData} setActiveTab={setActiveTab} activeTab={activeTab} className="w-full" />
                    <CustomTooltip direction="top" title={expand ? "Compress" : "Expand"}>
                      <i
                        className={`fa-solid ${expand ? "fa-compress" : "fa-expand"} cursor-pointer mr-8`}
                        role="presentation"
                        onClick={() => setExpand(!expand)}
                      />
                    </CustomTooltip>
                  </div>
                  {activeTab == "result" && (
                    <>
                      {dataLoaded && showTableHeaders && (
                        <div style={{ maxHeight: expand ? '550px' : '250px', overflow: 'auto' }}>
                          <Tableduckdb tableHeader={tableHeaders}>
                            {rows.map((row, index) => (
                              <tr key={index} className="border-b last:border-0 w-full hover:bg-tableHoverColor">
                                {tableHeaders.map((header) => (
                                  <td key={header.id} className="px-16 py-5 cursor-pointer text-2xs max-w-160 truncate text-center">
                                    {row[header.label]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </Tableduckdb>
                        </div>
                      )}

                      {loading ? (
                        <div
                          style={{ height: !expand ? `calc(100vh - ${height + 190}px)` : "calc(100vh - 12rem)" }}
                          className="flex justify-center items-center flex-col"
                        >
                          <div className="animate-spin rounded-full h-28 w-28 border-t-4 border-r-4 border-loaderColor" />
                          <div className="text-gray-600 mt-4">Loading</div>
                        </div>
                      ) : error ? (
                        <pre
                          style={{ height: !expand ? `calc(100vh - ${height + 190}px)` : "calc(100vh - 12rem)" }}
                          className="w-full bg-red-50 px-8 py-4 rounded-sm"
                        >
                          <Ansi className="bg-red-50 text-red-500 whitespace-pre-wrap break-words">{error}</Ansi>
                        </pre>
                      ) : tableData ? (
                        tableData?.value?.length != 0 ? (
                          <Table
                            tableHeader={tableData?.key?.map((item, index) => ({ id: index + 1, label: item, position: "left" }))}
                          >
                            {tableData?.value?.map((row, index) => (
                              <tr key={index} className="border-b last:border-0 w-full hover:bg-tableHoverColor">
                                {row?.map((cell, cellIndex) =>
                                  cell ? (
                                    <td key={cellIndex} className="px-16 py-5 cursor-pointer text-2xs max-w-160 truncate">
                                      {cell}
                                    </td>
                                  ) : (
                                    <td key={cellIndex} className="px-16 py-5 cursor-pointer text-2xs max-w-160 truncate">
                                      -
                                    </td>
                                  )
                                )}
                              </tr>
                            ))}
                          </Table>
                        ) : (
                          <div className="w-full px-8 py-4">
                            <Alert severity="success" sx={{ borderRadius: 0 }}>
                              {successMessage}
                            </Alert>
                          </div>
                        )
                      ) : error ? (
                        <pre
                          style={{ height: !expand ? `calc(100vh - ${height + 190}px)` : "calc(100vh - 12rem)" }}
                          className="w-full bg-red-50 px-8 py-4 rounded-sm"
                        >
                          <Ansi className="bg-red-50 text-red-500 whitespace-pre-wrap break-words">{error}</Ansi>
                        </pre>
                      ) : null}
                    </>
                  )}
                </>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
