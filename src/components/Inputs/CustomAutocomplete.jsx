import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

// name: string
// label: string
// value: any
// options: { value: any, label: string }[]
// handleChangeAdvance: () => void
// disabled?: boolean
// required?: boolean

// For string values, initialise your state to empty string "".
// For any other kind of values like numbers or objects, initialise your state to null.

function CustomAutocomplete({
  name,
  label,
  value,
  options,
  handleChangeAdvance,
  disabled = false,
  required = false,
}) {
  const [showError, setShowError] = useState(false);

  return (
    <Autocomplete
      size="small"
      disableClearable={required}
      options={options}
      getOptionLabel={(op) => op.label}
      value={
        options.filter((op) => op.value === value)[0]
          ? options.filter((op) => op.value === value)[0]
          : null
      }
      onChange={(e, val) => {
        if (val === null) handleChangeAdvance(name, null);
        else handleChangeAdvance(name, val.value);
        setShowError(false);
      }}
      onBlur={() =>
        value === null || value === ""
          ? setShowError(true)
          : setShowError(false)
      }
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          error={required && showError}
          required={required}
          label={label}
          helperText={required && showError && "This field is required"}
          disabled={disabled}
        />
      )}
    />
  );
}

export default CustomAutocomplete;
