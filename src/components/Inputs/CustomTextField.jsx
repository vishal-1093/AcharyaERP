import { useState } from "react";
import { TextField } from "@mui/material";

// name: string
// value: string
// handleChange: () => void
// helperText?: string
// errors?: string[]
// checks?: boolean[]
// setFormValid?: () => void
// ...props? is additional props for MUI TextField component

function CustomTextField({
  name,
  value,
  handleChange,
  helperText = "",
  errors = [],
  checks = [],
  setFormValid = () => {},
  ...props
}) {
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <TextField
        size="small"
        error={!!errors[index] && showError}
        name={name}
        value={value}
        helperText={showError && errors[index] ? errors[index] : helperText}
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
        {...props}
      />
    </>
  );
}

export default CustomTextField;
