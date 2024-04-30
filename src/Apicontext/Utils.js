import _ from "lodash";
import moment from "moment";
export const copyDict = (dict) => {
  return JSON.parse(JSON.stringify(dict));
};

export const dateFormat = (date) => {
  return date ? moment(date).fromNow() : "-";
};

export const isJSONString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const capitalizeFirstLetter = (string) => {
  const words = string?.split(/[\s_]+/)?.join(" ");
  const str = words?.toLowerCase();
  if (typeof str !== "string" || str?.length === 0) {
    return str;
  }
  if (/^[a-z]/.test(str[0])) {
    return str[0]?.toUpperCase() + str?.slice(1);
  } else {
    return str;
  }
};

export const capitalizeFirstLetterOfEachWord = (text) => {
  const words = text.split(/[\s_]+/);
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1);
    return `${firstLetter}${restOfWord}`;
  });
  return capitalizedWords.join(" ");
};

export const filterDataBySearch = (data, search) => {
  return _.filter(data, (item) =>
    Object.values(item).some((value) => (!search ? true : value?.toString()?.toLowerCase()?.includes(search?.toLowerCase())))
  );
};

export const maskValue = (value) => {
  if (value) {
    const length = value?.length;
    const start = length > 8 ? value?.substring(0, 4) : value?.substring(0, 3);
    const end = length > 8 ? value?.substring(length - 4) : value?.substring(length - 3);
    const maskedMiddle = "*".repeat(Math.max(0, length - 6));
    return `${start}${maskedMiddle}${end}`;
  } else {
    return "";
  }
};

export function transformString(inputString) {
  const words = inputString?.split("_");
  const capitalizedWords = words?.map((word) => {
    return word.charAt(0).toUpperCase() + word?.slice(1);
  });
  return capitalizedWords?.join(" ");
}

export function filterArrayByKeys(dataArray, cardData) {
  return dataArray?.map((k) => ({ k, value: cardData[k] }))?.filter((item) => item?.value);
}

export function generateQueryString(parameters) {
  if (!parameters) return "";
  const queryString = Object.entries(parameters)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return queryString ? `?${queryString}` : "";
}

export function convertToSnakeCase(inputString) {
  return inputString.toLowerCase().replace(/ /g, "_");
}

export const getCookie = (name) => {
  const nameLenPlus = name.length + 1;
  return (
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .filter((cookie) => {
        return cookie.substring(0, nameLenPlus) === `${name}=`;
      })
      .map((cookie) => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || null
  );
};

/*
const headers = new Headers({
  "Cache-Control": "no-cache, no-store, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
  "Authorization": getJupyterToken(),
});
*/
export const getNextExecutionCount = (cells) => {
  let highestExecutionCount = null;

  for (const count of cells) {
    if (count.cell_type === "code" && count.execution_count !== null) {
      const executionCount = count.execution_count;
      if (highestExecutionCount === null || executionCount > highestExecutionCount) {
        highestExecutionCount = executionCount;
      }
    }
  }

  return highestExecutionCount ? highestExecutionCount + 1 : 1;
};

export const getFileType = (view) => {
  let type = "";
  switch (true) {
    case view?.includes(".ipynb"):
      type = "editor";
      break;
    case view?.includes(".json"):
      type = "json_viewer";
      break;
    case view?.includes(".py"):
      type = "py";
      break;
    default:
      type = "txt";
      break;
  }
  return type;
};

export const generateRandomNumber = (length) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getExecutionTime = (startDateTime, endDateTime) => {
  const startTime = moment(startDateTime);
  const endTime = moment(endDateTime);
  const executionTime = moment.duration(endTime.diff(startTime));

  let formattedExecutionTime = "";

  const minutes = executionTime.minutes();
  const seconds = executionTime.seconds();

  if (minutes > 0) {
    formattedExecutionTime += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  if (seconds > 0) {
    if (formattedExecutionTime !== "") {
      formattedExecutionTime += " and ";
    }
    formattedExecutionTime += `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return formattedExecutionTime;
};

export const convertDataToDesiredFormat = (data) => {
  if (data) {
    const keysOrder = data?.key;
    const transformedData = data?.value?.map((item) => {
      return keysOrder.reduce((obj, key, index) => {
        obj[key] = item[index];
        return obj;
      }, {});
    });
    return transformedData;
  } else {
    return [];
  }
};

export const truncateString = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.substring(0, maxLength) + "...";
  }
};

export const extractValues = (q) => {
  const regex = /{{(.*?)}}/g;
  const found = [];
  let match;
  /* eslint-disable no-cond-assign */
  while ((match = regex.exec(q)) !== null) {
    found.push(match[1]);
  }

  return found;
};

export const checkArrayValuesInObject = (array, object) => {
  const allValuesPresent = array.every((value) => Object.prototype.hasOwnProperty.call(object, value));

  return allValuesPresent;
};

export const isPercentage = (val) => typeof val === "string" && val.indexOf("%") > -1;

export const percentToPx = (value, comparativeValue) => {
  if (value?.indexOf("px") > -1 || value === "auto" || !comparativeValue) return value;
  /* eslint-disable radix */
  const percent = parseInt(value);
  return (percent / 100) * comparativeValue + "px";
};
export const pxToPercent = (value, comparativeValue) => {
  const val = (Math.abs(value) / comparativeValue) * 100;
  if (value < 0) return -1 * val;
  else return Math.round(val);
};
export const getElementDimensions = (element) => {
  const computedStyle = getComputedStyle(element);

  let height = element.clientHeight,
    width = element.clientWidth; // width with padding

  height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
  width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

  return {
    width,
    height,
  };
};

export const weightDescription = (weight) => (weight === 400 ? "Regular" : weight === 500 ? "Medium" : "Bold");
