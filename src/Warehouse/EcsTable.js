import React, { useState, useEffect } from 'react';
import axios from 'axios';
import constants from '../Widget/constants';
import { dateFormat } from '../Apicontext/Utils';
import Tableresgister from "../Widget/Tableresgiter"

const Sidebar = () => {
    const [loading, setLoading] = useState(false);
    const [catalogs, setCatalogs] = useState([]);

    const lakehouseHead = [
        { id: 1, label: "Name", position: "left" },
        { id: 2, label: "Accesskey", position: "left" },
        { id: 3, label: "Sceretkey", position: "left" },
        { id: 4, label: "Region", position: "left" },
        { id: 5, label: "Register", position: "left" },
    ];

    const TableCatalogs = async (props) => {
        setLoading(true);
        try {
            const request_data = {
                method: 'GET',
                url: `${constants.url.Gettable}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios(request_data);
            if ([200, 201].includes(response.status) && response.data) {
                setCatalogs(response.data.data);
                setLoading(false);
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

    useEffect(() => {
        TableCatalogs();
    }, []);

    console.log(catalogs);

    function maskSensitiveInformation(value) {
        if (value && value.length > 4) {
            return '*'.repeat(value.length - 4) + value.slice(-4);
        } else {
            return value;
        }
    }

    return (
        <>
            <div className="w-full h-screen overflow-auto">
                <div className="flex items-center" style={{ padding: '1.4rem' }}>
                    <span className="py-2 text-2xl font-light">Register ECS</span>
                </div>
                <div className="px-10 py-4 " >
                    <Tableresgister tableHeader={lakehouseHead} >
                        {catalogs.map((item, index) => {
                            const attributes = item.attributes; // Access the 'attributes' property
                            return (
                                <tr key={index} className="border-b w-full hover:bg-tableHoverColor last:border-0">
                                    <td
                                        className={`px-16 py-5 cursor-pointer text-center text-xs `}
                                    >
                                        {attributes.name}
                                    </td>
                                    <td className="px-16 py-5 cursor-pointer text-center text-xs">{maskSensitiveInformation(attributes.access_key)}</td>
                                    <td className="px-16 py-5 items-center cursor-pointer text-center text-xs">
                                        {maskSensitiveInformation(attributes.secret_key)}
                                    </td>
                                    <td className="px-16 py-5 cursor-pointer text-center text-xs">{attributes.region}</td>

                                    <td className="px-16 py-5 cursor-pointer text-center text-xs">
                                        {dateFormat(attributes.createdAt)}
                                    </td>
                                </tr>
                            );
                        })}
                    </Tableresgister>
                </div>
            </div>
        </>
    );
};

export default Sidebar;