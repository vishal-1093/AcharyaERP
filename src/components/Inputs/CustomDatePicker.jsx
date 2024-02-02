import { useState, useEffect } from "react";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { convertUTCtoTimeZone } from "../../utils/DateTimeUtils";

// name: string
// value: dayjs Object | null
// handleChangeAdvance: () => void
// errors?: string[]
// checks?: boolean[]
// required?: boolean
// helperText?: string
// ...props? any additional props to MUI MobileDatePicker

function CustomDatePicker({
  name,
  value,
  handleChangeAdvance,
  errors = [],
  checks = [],
  required = false,
  helperText = "dd/mm/yyyy",
  ...props
}) {
  const [error, setError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let flag = false;
    for (let i = 0; i < checks.length; i++) {
      if (!checks[i]) {
        flag = true;
        setError(true);
        setIndex(i);
        break;
      }
    }
    if (!flag) {
      setError(false);
      setShowError(false);
    }
  }, [value]);

  const handleChange = (name, val) => {
    const localDate = convertUTCtoTimeZone(val);
    handleChangeAdvance(name, localDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        value={value}
        inputFormat="DD/MM/YYYY"
        closeOnSelect
        onChange={(val) => {
          handleChange(name, val);
        }}
        renderInput={(params) => (
          <TextField
            required={required}
            size="small"
            fullWidth
            error={showError}
            helperText={
              showError && !!errors[index] ? errors[index] : [helperText]
            }
            onBlur={() => {
              if (error) setShowError(true);
              else setShowError(false);
            }}
            {...params}
          />
        )}
        {...props}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
