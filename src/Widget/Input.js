import { memo, useEffect, useRef, useState } from "react";
import { Popconfirm, message } from "antd";

const Input = ({
  search,
  connection,
  value,
  onChange,
  onSearch,
  className,
  select,
  options,
  setSearch,
  placeholder,
  clickNewConnection,
  selectname,
  currentValue,
  error,
  icon,
  disabled,
  ref,
  type,
  handleFieldEdit,
  copyText,
  size,
  variant,
  ...field
}) => {
  const tagsInput = useRef();
  const [open, setOpen] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [selectValue, SetSelectValue] = useState();
  const [focus, setFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onFocus = () => {
    if (select !== undefined || "") {
      setOpen(true);
    }
    setFocus(true);
  };

  const onBlur = () => {
    if (select !== undefined || "") {
      tagsInput.current.classList.remove("border-inputOrange", "ring-1", "ring-blue-900");
    }
    setFocus(false);
  };

  useEffect(() => {
    if (value !== "" || undefined || null) {
      setEmpty(false);
    }
    if (selectname) {
      setEmpty(false);
    }
  }, [value]);

  return (
    <>
      {open ? <div className="w-full h-full absolute top-0 bottom-0 left-0" role="presentation" onClick={() => setOpen(false)} /> : null}
      <div className={`relative flex-col w-full ${className}`}>
        <div
          ref={tagsInput}
          className={`flex items-center ${size == "small" ? "py-0 px-3" : "py-3.3 px-6"} ${
            variant === "standard" ? "border-b" : "border bg-white shadow-sm rounded-sm"
          } w-full ${
            disabled
              ? "cursor-not-allowed border-grey-300 bg-grey-100"
              : value !== "" || empty || search || !error
              ? focus
                ? error == "lowercase" && (/[A-Z]/.test(value) || value?.includes(" ") || value?.includes("_") || value?.includes("-"))
                  ? "border-red-500"
                  : error == "Minute" && !/^[0-5]?[0-9]$/.test(value) && value !== ""
                  ? "border-red-500"
                  : error == "Second" && !/^[0-5]?[0-9]$/.test(value) && value !== ""
                  ? "border-red-500"
                  : error == "Hour" && !/^(0?[0-9]|1[0-9]|2[0-3])$/.test(value) && value !== ""
                  ? "border-red-500"
                  : error == "number" && !/^-?\d+(\.\d+)?$/.test(value) && value !== ""
                  ? "border-red-500"
                  : error == "email" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) && value !== ""
                  ? "border-red-500"
                  : error == "phone" && !/^\d{8,12}$/.test(value) && value !== ""
                  ? "border-red-500"
                  : error == "url" && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value) && value !== ""
                  ? "border-red-500"
                  : error == "file" && (/^\s+/.test(value) || /\s+/.test(value)) && value !== ""
                  ? "border-red-500"
                  : `${variant === "standard" ? "border-b" : "border"} border-inputOrange`
                : "border-d9d9d9"
              : error == "Second" || error == "Hour" || error == "Minute"
              ? "border-d9d9d9"
              : "border-red-500"
          } text-xs placeholder-slate-400`}
        >
          {icon && <i className={`${icon} flex items-center mx-4`} />}
          {search && <i className="fa-solid fa-magnifying-glass text-cardShadowColor text-xs mr-2" role="presentation" onClick={onSearch} />}
          <input
            className={`w-full text-xs px-2 bg-transparent outline-0 ${disabled && "text-gray-600 border-inputOrange cursor-not-allowed"}`}
            placeholder={placeholder}
            {...field}
            ref={ref}
            onFocus={onFocus}
            onBlur={onBlur}
            value={value || ""}
            onChange={onChange}
            readOnly={select}
            autoComplete="off"
            disabled={disabled}
            type={showPassword ? "text" : type}
          />
          {handleFieldEdit || copyText || (search && value) ? (
            <div className="flex items-center">
              {copyText && (
                <Popconfirm
                  open={false}
                  onOpenChange={() => {
                    if (value) {
                      message.success("copied!");
                    }
                  }}
                >
                  <i
                    className="fa-solid fa-copy text-00000073 hover:text-363e63 text-xs ml-2 p-1 cursor-pointer"
                    role="presentation"
                    onClick={() => navigator.clipboard.writeText(copyText)}
                  />
                </Popconfirm>
              )}
              {handleFieldEdit && (
                <i
                  className={`fa-solid ${
                    disabled ? "fa-pen-to-square font-normal" : "fa-check"
                  } text-00000073 hover:text-363e63 text-xs p-1 ml-6 cursor-pointer`}
                  role="presentation"
                  onClick={handleFieldEdit}
                />
              )}
              {search && value && (
                <div className="h-8 w-8 flex items-center justify-center bg-grey-400 rounded-full cursor-pointer">
                  <i className="fa-solid fa-xmark text-xxs text-white leading-normal" role="presentation" onClick={() => setSearch("")} />
                </div>
              )}
            </div>
          ) : (
            <div className="w-8" />
          )}

          {type === "password" && (
            <div className="h-fit w-fit flex items-center justify-center" role="presentation" onClick={() => setShowPassword(!showPassword)}>
              {!showPassword ? (
                <i className="fa-solid fa-eye-slash text-xs text-gray-800 cursor-pointer" />
              ) : (
                <i className="fa-solid fa-eye text-xs text-gray-800 cursor-pointer" />
              )}
            </div>
          )}
          {select ||
            (connection && (
              <button type="submit" onClick={() => (open ? setOpen(false) : setOpen(true))}>
                <i
                  className={`text-xs text-gray-600
              ${open ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}
              `}
                />
              </button>
            ))}
        </div>
        {/* <div className="text-red-800 text-xs mt-4 ml-4">
        {value !== "" || empty
            ? error == "email"
              ? !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
                ? !empty
                  ? "Please enter a valid registered email."
                  : null
                : null
              : null
            : error == "option"
            ? open == true
              ? null
              : "Please select an option"
            : error == "field"
            ? "Please fill out the field"
            : error == "email"
            ? value == ""
              ? "Please enter email."
              : null
            : null}
        </div> */}
        {!search && error && (
          <div className="text-red-800 text-xs mt-4 ml-4">
            {error == "lowercase"
              ? value !== ""
                ? /[A-Z]/.test(value) || value.includes(" ") || value.includes("_") || value.includes("-")
                  ? "Only lowercase letters without spaces, underscores, or hyphens are allowed."
                  : null
                : value !== "" || empty
                ? null
                : "Please fill out the field"
              : error == "Second" && !/^[0-5]?[0-9]$/.test(value) && value !== ""
              ? `Select ${error} between 0 and 59.`
              : error == "Minute" && !/^[0-5]?[0-9]$/.test(value) && value !== ""
              ? `Select ${error} between 0 and 59.`
              : error == "Hour" && !/^(0?[0-9]|1[0-9]|2[0-3])$/.test(value) && value !== ""
              ? "Select Hour between 0 and 23."
              : error == "number" && !/^-?\d+(\.\d+)?$/.test(value) && value !== ""
              ? "Select Number"
              : error == "email" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) && value !== ""
              ? "Enter a valid email address"
              : error == "phone" && !/^\d{8,12}$/.test(value) && value !== ""
              ? "Enter a valid phone number"
              : error == "url" && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value) && value !== ""
              ? "Enter a valid url"
              : error == "file" && (/^\s+/.test(value) || /\s+/.test(value)) && value !== ""
              ? null
              : null}
          </div>
        )}
        {/* <div className="text-red-800 text-xs mt-4 ml-4">{value !== "" || empty ?  "1" : error == "lowercase" ? "error" : "2" }</div> */}
        {select && open ? (
          <ul className="absolute w-full shadow-md rounded-md z-999 mt-1">
            <div className="bg-white h-28">
              <input
                className="outline-0 border-b-4 border-inputOrange h-full p-6 w-full"
                placeholder="Search..."
                onChange={(e) => SetSelectValue(e.target.value)}
              />
            </div>
            {options
              ?.filter((val) => {
                return !selectValue ? val : val.name.toLowerCase().includes(selectValue.toLowerCase());
              })
              ?.map((option) => (
                <li
                  key={option?.id}
                  role="presentation"
                  className="py-6 px-8 bg-white odd:bg-gray-50 cursor-pointer hover:bg-gray-100 last:rounded-b-md"
                  onClick={() => {
                    setSearch({ ...currentValue, [selectname]: option?.name });
                    SetSelectValue("");
                    setOpen(false);
                  }}
                >
                  {option?.name}
                </li>
              ))}
          </ul>
        ) : (
          ""
        )}
        {connection && (
          <ul className="absolute w-full shadow-md rounded-md z-999 mt-1">
            {open ? (
              <li
                role="presentation"
                onClick={clickNewConnection}
                className="py-6 px-8 bg-white odd:bg-gray-50 cursor-pointer border-b-2 hover:bg-gray-100 last:rounded-b-md flex items-center"
              >
                <i className="fa-solid fa-plus" />
                <div className="ml-8">New Connection</div>
              </li>
            ) : (
              ""
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default memo(Input);
