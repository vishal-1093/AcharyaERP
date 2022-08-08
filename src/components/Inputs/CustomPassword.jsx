import { useState } from "react";
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
// setFormValid: () => void
// helperText?: string
// ...props? is additional props for MUI FormControl component

function CustomPassword({
  name,
  label,
  value,
  handleChange,
  errors,
  checks,
  setFormValid,
  helperText = "",
  ...props
}) {
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl
      error={!!errors[index] && showError}
      size="small"
      required
      label={label}
      variant="outlined"
      {...props}
    >
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        name={name}
        label={label}
        size="small"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => {
          handleChange(e);
          setShowError(false);

          let flag = false;
          checks.reverse().forEach((check) => {
            if (!check) {
              setFormValid((prev) => ({ ...prev, [name]: false }));
              flag = true;
            }
          });
          if (!flag) setFormValid((prev) => ({ ...prev, [name]: true }));
        }}
        onBlur={() => {
          let flag = false;
          checks.reverse().forEach((check, i) => {
            if (!check) {
              setShowError(true);
              setFormValid((prev) => ({ ...prev, [name]: false }));
              setIndex(checks.length - i - 1);
              flag = true;
            }
          });
          if (!flag) {
            setShowError(false);
            setFormValid((prev) => ({ ...prev, [name]: true }));
          }
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
