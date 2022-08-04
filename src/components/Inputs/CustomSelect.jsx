import { useState } from "react";
import {
  Select,
  FormControl,
  MenuItem,
  Box,
  InputLabel,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  errorText: {
    fontSize: 12,
    margin: "2px 10px",
    color: theme.palette.error.main,
  },
}));

// name: string
// label: string
// value: any
// items: { value: any, label: string }[]
// handleChange: () => void
// setFormValid?: () => void
// required?: boolean

function CustomSelect({
  name,
  label,
  value,
  items,
  handleChange,
  setFormValid = () => {},
  required = false,
}) {
  const [showError, setShowError] = useState(false);

  const classes = useStyles();

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
        size="small"
        required={required}
        error={required && showError}
        fullWidth
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
      </FormControl>
      {required && showError && (
        <p className={classes.errorText}>This field is required</p>
      )}
    </Box>
  );
}

export default CustomSelect;
