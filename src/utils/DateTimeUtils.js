import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
import timezone from "dayjs/plugin/timezone"; // Import the timezone plugin
dayjs.extend(utc);
dayjs.extend(timezone);

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

// No of days in a week based on given date
export const getWeekDays = (date) => {
  const weekDays = [];

  date.setDate(date.getDate() - date.getDay());

  for (var i = 0; i < 7; i++) {
    weekDays.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return weekDays;
};

// takes Date object and converts it to YYYY-MM-DD format
export const convertDateToStringFormat = (date) => {
  if (date)
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
      "0" + date.getDate()
    ).slice(-2)}`;
};

//Take date object and convert to system time zone
export const convertUTCtoTimeZone = (val) => {
  const localDate = dayjs(val).tz(dayjs.tz.guess());
  return localDate.format();
};

export const checkFullAccess = (id) => {
  //1-admin, 5-super admin, headHr-13, director-14, cprdsa-10, HR-4, accounts - 3
  // const roles = [1, 5, 13, 14, 10, 4, 3];
  const roles = [1, 5];
  const empID = sessionStorage.getItem("empId");
  const { roleId } = JSON.parse(sessionStorage.getItem("AcharyaErpUser"));
  if (roles?.includes(roleId) || empID == id) {
    return true;
  } else {
    return false;
  }
};

export const checkAdminAccess = () => {
  //1-admin, 5-super admin, headHr-13, director-14, cprdsa-10, HR-4, accounts - 3
  const roles = [1, 5];
  const { roleId } = JSON.parse(sessionStorage.getItem("AcharyaErpUser"));
  if (roles?.includes(roleId)) {
    return true;
  } else {
    return false;
  }
};

export const convertToMonthFormat = (date) => {
  if (date) return `${dayjs(date).format("MM")}`;
};

export const convertToYearFormat = (date) => {
  if (date) return `${dayjs(date).format("YYYY")}`;
};

export const convertStringToDate = (dateString) => {
  const parts = dateString.split("-");
  const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
  return formattedDate;
};
