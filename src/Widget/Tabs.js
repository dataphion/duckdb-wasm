import { useEffect } from "react";

const Tabs = ({ type, tabs, activeTab, setActiveTab, onDelete, dataLength, className }) => {
  useEffect(() => {
    setActiveTab(tabs?.[0]?.value);
  }, []);

  return (
    <div className={`flex bg-transparent  ${className}`}>
      {tabs?.map((menuItem, index) => (
        <div key={index} className="w-fit flex flex-col items-center mx-3">
          <div
            role="presentation"
            onClick={() => {
              setActiveTab(menuItem?.value);
            }}
            className={`h-19 px-10 flex items-center justify-center ${type === "basic" ? "text-xs" : "text-2xs"} text-${menuItem?.color}-600 ${
              activeTab === menuItem?.value
                ? `${type === "basic" ? "font-medium " : "bg-eceef2 rounded-sm"} cursor-default`
                : `cursor-pointer ${type !== "basic" && "hover:bg-eceef2"}`
            }`}
          >
            {menuItem.title}
            {dataLength && <div className="flex justify-center ml-2 min-w-18 bg-grey-100 rounded-2 text-grey-600 font-semibold">{dataLength}</div>}
            {onDelete && (
              <i
                role="presentation"
                className={`fa-solid fa-trash-can ml-5 text-${menuItem?.color}-600 font-normal cursor-pointer hover:text-red-600`}
                onClick={onDelete}
              />
            )}
          </div>
          {type === "basic" ? (
            <div className={`h-1 w-full ${activeTab === menuItem?.value && `bg-${menuItem?.color ? menuItem?.color : "grey"}-600`}`} />
          ) : (
            <div className={`h-1 w-full ${activeTab === menuItem?.value && `bg-grey-600`}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
