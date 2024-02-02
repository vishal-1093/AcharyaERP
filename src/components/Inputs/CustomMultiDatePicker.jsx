import React from "react";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { convertUTCtoTimeZone } from "../../utils/DateTimeUtils";
import { convertDateYYYYMMDD } from "../../utils/Utils";

const CustomMultiDatePicker = ({
  multiple = false,
  handleChangeDate,
  format,
  title="",
  name,
  value,
  placeholder="",
}) => {

console.log('handleChangeDate', value,format,multiple,name,title,placeholder)

   const handleChange = (name, newValue) => {
    console.log('handleChangenewValue', name,newValue)
    const localDate = convertUTCtoTimeZone(newValue);
    handleChangeDate(name, [...value,localDate]);
   };

  return (
    <DatePicker
      multiple={multiple}
      className="blue"
      inputClass="custom-input"
      format={format}
      name={name}
      title={title}
      placeholder={placeholder}
      value={value}
      onChange={(newValue) => handleChange(name, newValue)}
      required
      plugins={[
        <DatePanel />
      ]}
    
    />
  );
};

export default CustomMultiDatePicker;
