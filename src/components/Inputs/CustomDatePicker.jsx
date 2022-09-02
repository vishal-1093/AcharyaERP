import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// name: string
// value: Date | null
// handleChangeAdvance: () => void
// errors?: string[]
// checks?: boolean[]
// setFormValid?: () => void
// required?: boolean
// ...props? any additional props to MUI DatePicker

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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value}
        inputFormat="dd/MM/yyyy"
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
