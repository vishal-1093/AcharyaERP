const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// takes Date object and converts it to DD/MM/YYYY format
export const convertDateToString = (date) => {
  if (date)
    return `${("0" + date.getDate()).slice(-2)}/${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}/${date.getFullYear()}`;
};

// takes Date object and converts it to HH:mm:ss format
export const convertTimeToString = (time) => {
  if (time)
    return `${("0" + time.getHours()).slice(-2)}:${(
      "0" + time.getMinutes()
    ).slice(-2)}:${("0" + time.getSeconds()).slice(-2)}`;
};

// String Date to convert DD-MM-YYYY format
export const convertToDMY = (date) => {
  if (date) return `${date.split("-").reverse().join("-")}`;
};

// takes Date object and converts to DD mon YYYY format
export const convertToLongDateFormat = (date) => {
  if (date)
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
