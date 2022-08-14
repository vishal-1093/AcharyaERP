// takes Date object and converts it to dd/mm/yyyy format
export const convertDateToString = (date) => {
  if (date)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
