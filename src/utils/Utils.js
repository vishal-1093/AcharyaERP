

export function convertDateFormat(dateString) {
    const date = new Date(dateString);
    const formattedDate = `${addZero(date.getDate())}-${addZero(date.getMonth() + 1)}-${String(date.getFullYear())}`;
    return formattedDate;
  }
  
  export function convertDateYYYYMMDD(dateString) {
    const date = new Date(dateString);
    const formattedDate = `${String(date.getFullYear())}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`;
    return formattedDate;
  }

  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }


  export function formatTime(timeString) {
    if (!timeString) {
      return "--";
    }
  
    const date = new Date(`1970-01-01T${timeString}`);
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return formattedTime;
  }

  export function convertToDateandTime(dateString) {
    const date = new Date(dateString);

    const hours = date.getHours() % 12 || 12; // Get hours in 12-hour format
    const minutes = addZero(date.getMinutes());
    const amPm = date.getHours() < 12 ? 'AM' : 'PM';

    const formattedDate = `${addZero(date.getDate())}-${addZero(date.getMonth() + 1)}-${date.getFullYear()} ${hours}:${minutes} ${amPm}`;
    
    return formattedDate;
}


export const toCamelCase = (text) => {
  return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, ''); // Remove spaces if any
};
