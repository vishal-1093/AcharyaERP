import { useState, useEffect } from "react";
import { TextField } from "@mui/material";

// name: string
// value: string
// handleChange: () => void
// helperText?: string
// errors?: string[]
// checks?: boolean[]
// ...props? is additional props for MUI TextField component

function CustomTextField({
  name,
  value,
  handleChange,
  helperText = "",
  errors = [],
  checks = [],
  disabled = false,
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
    <TextField
      size="small"
      fullWidth
      name={name}
      value={value}
      helperText={showError && !!errors[index] ? errors[index] : helperText}
      error={!!errors[index] && showError}
      onChange={handleChange}
      onBlur={() => {
        if (error) setShowError(true);
        else setShowError(false);
      }}
      disabled={disabled}
      style={{
        color: disabled ? 'grey' : 'inherit',
      }}
      {...props}
    />
  );
}

export default CustomTextField;
