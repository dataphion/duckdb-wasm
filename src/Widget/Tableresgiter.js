import NoData from "./Nodata";
import Pagination from "./Pagination";
import Button from "./Button";

const Table = ({
  tableHeader,
  children,
  title,
  removeSidePadding,
  rowsPerPage,
  page,
  setPage,
  className,
  totalPost,
  onBackButton,
  createButtonText,
  onButtonClick,
  showBackIcon,
  startIcon,
  onBack,
  headerChild,
  validation = false,
  dropDownButton,
  ...rest
}) => {
  return (
    <div className={`${className} w-full`} {...rest}>
      <div className="w-full rounded-sm overflow-x-auto">
        <div className={` bg-white overflow-x-auto p-10 rounded-20`}>
          {(dropDownButton || title || showBackIcon || createButtonText) && (
            <div className="flex justify-between items-center pb-12 px-14">
              <div className="flex w-full items-center">
                {showBackIcon && (
                  <i
                    className="fa-solid fa-angle-left font-semibold flex-row mr-5 cursor-pointer hover:text-blue-600 h-20 w-20 flex items-center justify-center hover:bg-d4eef4 rounded-full"
                    role="presentation"
                    onClick={onBack}
                  />
                )}
                <div className={`${title && "mr-8"} text-lightBlack text-[20px] font-700 w-full`}>{title}</div>
                {headerChild}
              </div>
              <div className="flex items-center">
                {dropDownButton && dropDownButton}
                {createButtonText && (
                  <Button
                    variant="outline"
                    startIcon={startIcon ?? <i className="fa-solid fa-plus mr-6" />}
                    onClick={onButtonClick}
                    disable={validation}
                  >
                    {createButtonText}
                  </Button>
                )}
              </div>
            </div>
          )}
          <table className="w-full">
            <thead className="w-full h-36 text-headingColor bg-headingBg text-xs rounded">
              <tr className="rounded">
                {tableHeader?.map((headerItem, index) => (
                  <th
                    className={`px-32 py-8 text-${headerItem?.position} headingColor ${index == 0 && "rounded-l-lg"} ${
                      tableHeader.length - 1 == index && "rounded-r-lg"
                    } text-center`}
                    key={index}
                  >
                    {headerItem?.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {children?.length === 0 || children == undefined ? (
                <tr>
                  <td colSpan={tableHeader?.length} className="text-center py-4">
                    <NoData />
                  </td>
                </tr>
              ) : (
                children
              )}
            </tbody>
          </table>
        </div>
      </div>
      {rowsPerPage && <Pagination className="px-12" rowsPerPage={rowsPerPage} totalPost={totalPost} setPage={setPage} page={page} />}
    </div>
  );
};

export default Table;
