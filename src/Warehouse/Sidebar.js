import React, { useState } from "react";
import Input from "../Widget/Input";
import constants from "../Widget/constants";
import { useLocation, useNavigate } from "react-router-dom";


const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [activeMenu, setActiveMenu] = useState({});

    console.log("location",location)

    const Menus = [
        {
            id: 1,
            title: "Dashboard",
            icon: "fa-solid fa-table-cells",
            url: "/dashboard",
        },
        {
            id: 2,
            title: "ECS",
            icon: "fa-solid fa-warehouse",
            url: constants.route.EcsTable,
        },
        {
            id: 5,
            title: "SQL Editor",
            icon: "fa-solid fa-laptop-code",
            url: constants.route.Sqleditor,
        },
        {
            id: 10,
            title: "Settings",
            icon: "fa fa-cog",
            url: "/settings",
        },
    ];



    return (
        <div className="flex flex-col shadow-lg bg-white w-160 min-w-160 h-screen justify-between relative p-2">
            <div className="w-full bg-gray-900 border rounded-md h-full">
                <div className="text-white text-center py-4 font-medium text-[1.5rem]">
                    Data Warehouse
                </div>
              <div

                >
                    <ul className="flex flex-col justify-between mt-12 space-y-6">
                        {Menus.filter((item) => {
                            return !search
                                ? item
                                : item?.title?.toLowerCase()?.includes(search?.toLowerCase()) ||
                                (item?.actions && item?.actions?.some((action) => action?.label?.toLowerCase()?.includes(search?.toLowerCase())));
                        }).map((Menu, index) => {
                            if (Menu.id !== undefined) {
                                return (
                                    <React.Fragment key={index}>
                                        <li
                                            to={Menu.url}
                                            className={`${(Menu?.url != constants.route.dashboard ? activeMenu?.active?.includes(Menu.url) : activeMenu?.active == Menu.url)
                                                    ? "bg-white rounded-sm"
                                                    : "text-black"
                                                } flex group items-center justify-between m-auto py-3 px-12 cursor-pointer text-sm w-11/12`}
                                            role="presentation"
                                            onClick={() => {
                                                setActiveMenu({
                                                    active: Menu.url,
                                                    ...(Menu.collapsable && {
                                                        [Menu?.id]: !activeMenu?.[Menu?.id],
                                                    }),
                                                });
                                                if (!Menu.collapsable) {
                                                    navigate(Menu.url);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <i
                                                    className={`${Menu?.icon} flex items-center justify-center text-xs leading-4 h-16 w-16 rounded-sm  mr-5 ${(Menu?.url != constants.route.dashboard ? activeMenu?.active?.includes(Menu.url) : activeMenu?.active == Menu.url)
                                                            ? "text-black"
                                                            : "text-white group-hover:text-white"
                                                        }`}
                                                />
                                                <div
                                                    className={`whitespace-nowrap leading-4 text-xs font-medium ${(Menu?.url != constants.route.dashboard ? activeMenu?.active?.includes(Menu.url) : activeMenu?.active == Menu.url)
                                                            ? "text-black"
                                                            : "text-white"
                                                        }`}
                                                >
                                                    {Menu.title}
                                                </div>
                                            </div>
                                            {Menu.actions && (
                                                <i
                                                    className={`fa-solid fa-chevron-right ${activeMenu[Menu.id] && "transform -rotate-90"} ${(Menu?.url != constants.route.dashboard ? activeMenu?.active?.includes(Menu.url) : activeMenu?.active == Menu.url)
                                                            ? "text-white"
                                                            : "text-black"
                                                        } text-[10px] duration-500 transition-transform`}
                                                />
                                            )}
                                        </li>
                                        <ul
                                            className={`my-4 space-y-2 transition-all ease-in-out duration-500 transform origin-top overflow-hidden ${(Menu?.url != constants.route.dashboard ? activeMenu?.active?.includes(Menu.url) : activeMenu?.active == Menu.url) &&
                                                    activeMenu?.[Menu?.id]
                                                    ? "h-full max-h-96 scale-in"
                                                    : "h-0 max-h-0 scale-out"
                                                }`}
                                        >
                                            {Menu?.actions?.map((action, i) => (
                                                <li
                                                    key={i}
                                                    role="presentation"
                                                    onClick={() => {
                                                        setActiveMenu({
                                                            active: Menu.url,
                                                            [Menu?.id]: true,
                                                        });
                                                        navigate(action.link);
                                                    }}
                                                    className={`flex group items-center m-auto py-2 px-5 cursor-pointer font-medium text-xs w-9/12 ${(location.search !== "" ? location.search : location.pathname).includes(action.link)
                                                            ? "rounded-sm text-inputOrange"
                                                            : "text-gray-600 hover:text-black"
                                                        }`}
                                                >
                                                    <i className="fa-solid fa-circle text-[4px] ml-6" />
                                                    <span className="whitespace-nowrap ml-8 leading-4 truncate text-[13px]">{action.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </React.Fragment>
                                );
                            }
                        })}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;
