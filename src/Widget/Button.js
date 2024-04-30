import { memo } from "react";

const Button = ({ children, variant, startIcon, endIcon, color, className, submit, showLoading, disable, borderColor, size, ...rest }) => {
  return (
    <button
      type={submit ? "submit" : "button"}
      disabled={disable}
      {...rest}
      className={`flex truncate w-fit justify-center items-center ${
        size === "small" ? "px-10 h-16 text-2xs" : "px-16 h-20 text-sm"
      } rounded-sm ${className} ${
        variant === "contained"
          ? `${disable ? "bg-greyScale_200" : `bg-inputOrange hover:bg-inputOrange  text-white font-semibold`} ${disable && "cursor-not-allowed"}`
          : variant === "outline"
          ? `border-0.8 text-inputOrange border-inputOrange bg-white font-semibold`
          : `${
              disable ? "bg-grey-300 text-gray-600 cursor-not-allowed" : "text-inputOrange bg-inputOrange bg-opacity-10 hover:bg-opacity-20"
            } font-semibold text-${color}`
      } 
     
    
    `}
    >
      {disable && showLoading ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-r-1 border-loaderColor mr-4" /> : startIcon}
      <span className="uppercase">{children}</span>
      {endIcon}
    </button>
  );
};

export default memo(Button);
