import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

// name: string
// value: dayjs Object | null
// handleChangeAdvance: () => void
// errors?: string[]
// checks?: boolean[]
// setFormValid?: () => void
// required?: boolean
// ...props? any additional props to MUI MobileDatePicker

function CustomDatePicker({
  name,
  value,
  handleChangeAdvance,
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
    for (let i = 0; i < checks.length; i++) {
      if (!checks[i]) {
        setFormValid((prev) => ({ ...prev, [name]: false }));
        flag = true;
        setError(true);
        setIndex(i);
        break;
      }
    }
    if (!flag) {
      setFormValid((prev) => ({ ...prev, [name]: true }));
      setError(false);
      setShowError(false);
    }
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        value={value}
        inputFormat="DD/MM/YYYY"
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
              showError && !!errors[index] ? errors[index] : "dd/mm/yyyy"
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
