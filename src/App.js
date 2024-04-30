import { BrowserRouter } from "react-router-dom";
import Sidebar from "./Warehouse/Sidebar";
import Router from "./Route";
import 'antd/dist/antd.css';
import { Provider } from "./Apicontext/Context";



const App = () => {
  return (
    <BrowserRouter>
    <Provider>
     <Sidebar/>
     {/* <Body/> */}
     <Router/>
     </Provider>
    </BrowserRouter>
  );
};

export default App;
