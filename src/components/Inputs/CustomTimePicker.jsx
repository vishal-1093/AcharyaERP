import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";

// name: string
// value: dayjs Object | null
// handleChangeAdvance: () => void
// seconds?: boolean
// errors?: string[]
// checks?: boolean[]
// required?: boolean
// ...props? any additional props to MUI MobileTimePicker

function CustomTimePicker({
  name,
  value,
  handleChangeAdvance,
  seconds = false,
  errors = [],
  checks = [],
  required = false,
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileTimePicker
        value={value}
        views={seconds ? ["hours", "minutes", "seconds"] : ["hours", "minutes"]}
        inputFormat={seconds ? "hh:mm:ss A" : "hh:mm A"}
        closeOnSelect
        openTo="hours"
        onChange={(val) => {
          handleChangeAdvance(name, val);
        }}
        ampmInClock
        renderInput={(params) => (
          <TextField
            required={required}
            size="small"
            fullWidth
            error={showError}
            helperText={
              showError && !!errors[index]
                ? errors[index]
                : seconds
                ? "hh:mm:ss"
                : "hh:mm"
            }
            onBlur={() => {
              if (error) setShowError(true);
              else setShowError(false);
            }}
            {...params}
          />
        )}
        showToolbar={false}
        {...props}
      />
    </LocalizationProvider>
  );
}

export default CustomTimePicker;
