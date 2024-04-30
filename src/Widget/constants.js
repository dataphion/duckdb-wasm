const Api_url = "http://localhost:1337/api";
const proxy_url = "http://localhost:3001";


const constants = {

  route: {
    // Pages
    Sqleditor: "/sql_edtior",
    EcsTable: "/ecs"

  },

  url: {
    Sqleditor: `/sql_edtior`,
    EcsTable: `/ecs`,
    populate: `${proxy_url}/populate`,
    execute: `${proxy_url}/execute`,
    Getdata: `${Api_url}/catalog/getData`,
    Gettable: `${Api_url}/catalogs`

  },


};

export default constants;