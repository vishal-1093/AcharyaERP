import { useState, useEffect } from "react";
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// name: string
// label: string
// value: string
// handleChange: () => void
// errors: string[]
// checks: boolean[]
// helperText?: string
// ...props? is additional props for MUI FormControl component

// errors and checks are not optional for password field

function CustomPassword({
  name,
  label,
  value,
  handleChange,
  errors,
  checks,
  helperText = "",
  ...props
}) {
  const [error, setError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

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
    <FormControl
      size="small"
      fullWidth
      label={label}
      error={!!errors && showError}
      variant="outlined"
      {...props}
    >
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        fullWidth
        name={name}
        label={label}
        size="small"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={handleChange}
        onBlur={() => {
          if (error) setShowError(true);
          else setShowError(false);
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText>
        {showError && errors[index] ? errors[index] : helperText}
      </FormHelperText>
    </FormControl>
  );
}

export default CustomPassword;
