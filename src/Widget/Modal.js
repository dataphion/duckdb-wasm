import { memo } from "react";

const Modal = ({ setShowModel, showModel, children, width, height, dynamicHeightWidth }) => {
  return (
    <>
      {showModel && (
        <>
          <div
            className={`w-full absolute ${
              dynamicHeightWidth ? `${height ?? "h-[calc(100vh-7.6rem)]"}` : "h-screen"
            } overflow-y-auto  top-0 left-0 flex justify-center items-center bg-black  bg-opacity-25 backdrop-blur-sm z-9998`}
          >
            <div className="w-full h-full absolute top-0 left-0" role="presentation" onClick={() => setShowModel(false)} />
            <div className={`w-${width ?? "3/4"} ${!dynamicHeightWidth && "h-384"} rounded-sm absolute z-1 bg-white`}>{children}</div>
          </div>
        </>
      )}
    </>
  );
};

export default memo(Modal);
