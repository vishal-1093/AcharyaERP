import { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

// name: string
// label: string
// value: any[]
// options: { value: any, label: string }[]
// handleChangeAdvance: () => void
// handleSelectAll: () => void
// handleSelectNone: () => void
// helperText?: string
// errors?: string[]
// checks?: boolean[]
// setFormValid?: () => void
// required?: boolean
// disabled?: boolean

// Initialise your state to empty array []

function CheckboxAutocomplete({
  name,
  label,
  value,
  options,
  handleChangeAdvance,
  handleSelectAll,
  handleSelectNone,
  helperText = "",
  errors = [],
  checks = [],
  setFormValid = () => {},
  required = false,
  disabled = false,
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
    <Box display="flex" alignItems="flex-start" justifyContent="center">
      <Autocomplete
        fullWidth
        multiple
        disableCloseOnSelect
        options={options}
        disabled={disabled}
        getOptionLabel={(option) => option.label}
        filterSelectedOptions
        value={
          options.filter((op) => value.includes(op.value))
            ? options.filter((op) => value.includes(op.value))
            : null
        }
        onChange={(e, val) => {
          handleChangeAdvance(
            name,
            val.map((obj) => obj.value)
          );
        }}
        onBlur={() => {
          if (error) setShowError(true);
          else setShowError(false);
        }}
        renderInput={(params) => (
          <TextField
            label={label}
            required={required}
            helperText={
              showError && !!errors[index] ? errors[index] : helperText
            }
            error={!!errors[index] && showError}
            {...params}
          />
        )}
      />
      {options.length - value.length < options.length / 2 ? (
        <Tooltip title="Select none">
          <IconButton onClick={() => handleSelectNone(name)}>
            <IndeterminateCheckBoxIcon sx={{ fontSize: 31 }} color="primary" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Select all">
          <IconButton onClick={() => handleSelectAll(name, options)}>
            <CheckBoxIcon sx={{ fontSize: 31 }} color="primary" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

export default CheckboxAutocomplete;
