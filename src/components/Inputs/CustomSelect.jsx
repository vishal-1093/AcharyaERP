import { useState } from "react";
import {
  Select,
  FormControl,
  MenuItem,
  Box,
  InputLabel,
  FormHelperText,
} from "@mui/material";

// name: string
// label: string
// value: any
// items: { value: any, label: string }[]
// handleChange: () => void
// setFormValid?: () => void
// required?: boolean
// disabled?: boolean

// For string values, initialise your state to empty string "".
// For any other kind of values like numbers or objects, initialise your state to null.

function CustomSelect({
  name,
  label,
  value,
  items,
  handleChange,
  setFormValid = () => {},
  required = false,
  disabled = false,
}) {
  const [showError, setShowError] = useState(false);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
        size="small"
        required={required}
        error={required && showError}
        fullWidth
        disabled={disabled}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          size="small"
          name={name}
          value={value}
          label={label}
          onChange={(e) => {
            handleChange(e);
            setFormValid((prev) => ({ ...prev, [name]: true }));
            setShowError(false);
          }}
          onBlur={() => (value ? setShowError(false) : setShowError(true))}
        >
          {items.map((obj, index) => (
            <MenuItem key={index} value={obj.value}>
              {obj.label}
            </MenuItem>
          ))}
        </Select>
        {required && showError && (
          <FormHelperText error>This field is required</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
}

export default CustomSelect;
