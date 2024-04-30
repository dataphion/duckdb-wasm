import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sqleditor from "./Warehouse/Sqleditor";
import constants from "./Widget/constants";
import EscTable from "./Warehouse/EcsTable"

const authed = true; // Define your authentication logic here

const Router = () => {
  return (
    <Routes>
      <Route
        path={constants.route.Sqleditor}
        element={<RequireAuth><Sqleditor /></RequireAuth>}
      />

      <Route
        path={constants.route.EcsTable}
        element={<RequireAuth><EscTable/></RequireAuth>}
      />
    </Routes>
  );
};


function RequireAuth({ children }) {
  // const contextValues = React.useContext(Context);
  // const authed = contextValues.checkAdminLoginStatus();
  const location = useLocation();
  if (!authed) {
    return <Navigate to={constants.route.login} state={{ from: location }} replace />;
  }

  return children;
}

export default Router;
