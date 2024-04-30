import { useState, useEffect } from "react";

function Pagination({ rowsPerPage, totalPost, page, setPage, className }) {
  const [currentButton, setCurrentButton] = useState(1);
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState([]);

  const numberOfPages = [];
  for (let i = 1; i <= Math.ceil(totalPost / rowsPerPage); i += 1) {
    numberOfPages.push(i);
  }
  useEffect(() => {
    if (page) {
      if (page != currentButton) {
        setCurrentButton(page);
      }
    }
  }, [page]);

  useEffect(() => {
    let tempNumberOfPages = [...arrOfCurrButtons];
    const dotsInitial = "...";
    const dotsLeft = "... ";
    const dotsRight = " ...";

    if (numberOfPages.length < 6) {
      tempNumberOfPages = numberOfPages;
    } else if (currentButton >= 1 && currentButton <= 3) {
      tempNumberOfPages = [1, 2, 3, 4, dotsInitial, numberOfPages.length];
    } else if (currentButton === 4) {
      const sliced = numberOfPages.slice(0, 5);
      tempNumberOfPages = [...sliced, dotsInitial, numberOfPages.length];
    } else if (currentButton > 4 && currentButton < numberOfPages.length - 2) {
      const sliced1 = numberOfPages.slice(currentButton - 2, currentButton);
      const sliced2 = numberOfPages.slice(currentButton, currentButton + 1);
      tempNumberOfPages = [1, dotsLeft, ...sliced1, ...sliced2, dotsRight, numberOfPages.length];
    } else if (currentButton > numberOfPages.length - 3) {
      const sliced = numberOfPages.slice(numberOfPages.length - 4);
      tempNumberOfPages = [1, dotsLeft, ...sliced];
    } else if (currentButton === dotsInitial) {
      setCurrentButton(arrOfCurrButtons[arrOfCurrButtons.length - 3] + 1);
    } else if (currentButton === dotsRight) {
      setCurrentButton(arrOfCurrButtons[3] + 2);
    } else if (currentButton === dotsLeft) {
      setCurrentButton(arrOfCurrButtons[3] - 2);
    }
    setArrOfCurrButtons(tempNumberOfPages);
    setPage(currentButton);
  }, [currentButton, totalPost]);

  if (totalPost > 0) {
    return (
      <div className={`flex flex-col items-center w-full justify-center mt-19 mb-8 px-16 ${className}`}>
        <div className="flex items-center w-full justify-center">
          <div
            className={`h-20 w-19 flex items-center justify-center mr-2.5 rounded-sm ${
              currentButton === 1 ? "font-medium" : "cursor-pointer hover:bg-f0f0f0 bg-white"
            }`}
            role="presentation"
            onClick={() => setCurrentButton((prev) => (prev <= 1 ? prev : prev - 1))}
          >
            <i className="fa-solid fa-angles-left text-xxs" />
          </div>

          {arrOfCurrButtons.map((item, index) => {
            return (
              <div
                key={index}
                className={`h-20 w-19 mx-2.5 flex items-center justify-center cursor-pointer ${
                  currentButton == item ? "bg-inputOrange rounded-sm text-white text-sm" : "bg-white"
                } ${currentButton !== item ? "hover:bg-f0f0f0 rounded-sm" : ""}`}
                role="presentation"
                onClick={() => setCurrentButton(item)}
              >
                {item}
              </div>
            );
          })}

          <div
            role="presentation"
            className={`h-20 w-19 flex items-center justify-center rounded-sm ml-2.5 ${
              currentButton === numberOfPages.length ? "font-medium" : "cursor-pointer hover:bg-f0f0f0 bg-white"
            }`}
            onClick={() => setCurrentButton((prev) => (prev >= numberOfPages.length ? prev : prev + 1))}
          >
            <i className="fa-solid fa-angles-right text-xxs" />
          </div>
        </div>
        <div className="text-666666 text-xs font-medium mt-8">
          {currentButton * rowsPerPage - rowsPerPage + 1}-{currentButton * rowsPerPage >= totalPost ? totalPost : currentButton * rowsPerPage} of{" "}
          {totalPost}
        </div>
      </div>
    );
  }
}

export default Pagination;
