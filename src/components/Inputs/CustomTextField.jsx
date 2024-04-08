import { useState, useEffect, useRef } from "react";
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
  highlightError = false,
  ...props
}) {
  const [error, setError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);
  const firstRender = useRef(true)

  useEffect(() => {
    console.log("First render",firstRender.current, name);
    if(firstRender.current){
      firstRender.current = false
      return
    }
    console.log("second render", firstRender.current, name);
    handleError()
  }, [value]);
  
  useEffect(() => {
    // setError(true)
    // console.log("Triggered", highlightError);
    if(highlightError) handleError()
  }, [highlightError]);

  const handleError = () => {
    let flag = false;
    for (let i = 0; i < checks.length; i++) {
      if (!checks[i]) {
        flag = true;
        setError(true);
        setShowError(true)
        setIndex(i);
        break;
      }
    }
    if (!flag) {
      setError(false);
      setShowError(false);
    }
  }

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
