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
// setFormValid?: () => void
// required?: boolean
// ...props? any additional props to MUI MobileTimePicker

function CustomTimePicker({
  name,
  value,
  handleChangeAdvance,
  seconds = false,
  errors = [],
  checks = [],
  setFormValid = () => {},
  required = false,
  ...props
}) {
  const [error, setError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let flag = false;
    checks.reverse().forEach((check, i) => {
      if (!check) {
        setFormValid((prev) => ({ ...prev, [name]: false }));
        flag = true;
        setError(true);
        setIndex(checks.length - i - 1);
      }
    });
    if (!flag) {
      setFormValid((prev) => ({ ...prev, [name]: true }));
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
        mask={seconds ? "__:__:__ _M" : "__:__ _M"}
        openTo="hours"
        onChange={(val) => {
          handleChangeAdvance(name, val);
        }}
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
        {...props}
      />
    </LocalizationProvider>
  );
}

export default CustomTimePicker;
