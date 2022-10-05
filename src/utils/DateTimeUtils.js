// takes Date object and converts it to DD/MM/YYYY format
export const convertDateToString = (date) => {
  if (date)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// takes Date object and converts it to HH:mm:ss format
export const convertTimeToString = (time) => {
  if (time)
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
};
