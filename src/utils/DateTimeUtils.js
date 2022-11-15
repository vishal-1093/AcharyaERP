// takes Date object and converts it to DD/MM/YYYY format
export const convertDateToString = (date) => {
  if (date)
    return `${("0" + date.getDate()).slice(-2)}/${
      ("0" + date.getMonth()).slice(-2) + 1
    }/${("0" + date.getFullYear()).slice(-2)}`;
};

// takes Date object and converts it to HH:mm:ss format
export const convertTimeToString = (time) => {
  if (time)
    return `${("0" + time.getHours()).slice(-2)}:${(
      "0" + time.getMinutes()
    ).slice(-2)}:${("0" + time.getSeconds()).slice(-2)}`;
};

//String Date to convert DD-MM-YYYY format
export const convertToDMY = (date) => {
  if (date) return `${date.split("-").reverse().join("-")}`;
};
