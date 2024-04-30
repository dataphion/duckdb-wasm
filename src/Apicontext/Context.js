import React from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import constants from "../Widget/constants";

export const Context = React.createContext({});

export const Provider = ({ children }, props) => {
  const [getCustomNamespace, setGetCustomNamespace] = React.useState();
  const [getCatalogs, setGetCatalogs] = React.useState();
  const [loading,setLoading]=React.useState(false);

  const getCatalogDetails = async (catalogName) => {
    try {
      const request_data = {
        method: "GET",
        url: `${constants.url.Gettable}?filters[name][$eq]=dbt_poc`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios(request_data);
      if ([200, 201].includes(response.status) && response.data) {
        return response.data.data;
      }
    } catch (error) {
    }
  }

  const getAllCatalogs = async (props) => {
    setLoading(true);
    try {
      const request_data = {
        method: 'POST',
        url: `${constants.url.populate}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          endpoint: props.server_value,
          access_key: props.accessKey,
          secret_key: props.secretKey,
          region: props.region_value,
          name: props.name,
          bucket_name: props.bucket_value,
          folder_path:props.path_value
        }),
      };

      const response = await axios(request_data);
      if ([200, 201].includes(response.status) && response.data) {
        setGetCatalogs(response.data.data);
        console.log(response.data.data)
        setLoading(false);
        customNamespace()
        return response.data.data;
      } else {
        setLoading(false); // Make sure to set loading to false in case of an error
        return null;
      }
    } catch (error) {
      setLoading(false); // Set loading to false in case of an exception
      return null;
    }
  };

  const customNamespace = async (props) => {
    try {
      const request_data = {
        method: "GET",
        url: `${constants.url.Getdata}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios(request_data);
      if ([200, 201].includes(response.status) && response.data) {
        setGetCustomNamespace(response?.data?.data);
        return response?.data?.data;
      }
    } catch (error) {
    }
  };

  return (
    <Context.Provider
      value={{
        getAllCatalogs,
        getCatalogs,
        customNamespace,
        getCustomNamespace,
        getCatalogDetails,
      }}
    >
      {loading && <LoaderComponent />} 
      {children}
      <ToastContainer autoClose={1000} />
    </Context.Provider>
  );
};

const LoaderComponent = () => {
  // You can customize the loader component according to your UI needs
  return (
    <>
  <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0 bg-white bg-opacity-5 backdrop-blur-sm z-9999">
  <div className="animate-spin rounded-full h-28 w-28 border-t-4 border-r-4 border-loaderColor" />
</div>

    </>
  )
};

export default Context;
