import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
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
// options: { value: any, label: string }[]
// value: any
// handleChangeAdvance: () => void
// disabled?: boolean
// setFormValid?: () => void
// required?: boolean

// For string values, initialise your state to empty string "".
// For any other kind of values like numbers or objects, initialise your state to null.

function CustomAutocomplete({
  name,
  label,
  options,
  value,
  handleChangeAdvance,
  disabled = false,
  setFormValid = () => {},
  required = false,
}) {
  const [showError, setShowError] = useState(false);

  const classes = useStyles();

  return (
    <>
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
          setFormValid((prev) => ({ ...prev, [name]: true }));
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
          />
        )}
      />
      {required && showError && (
        <p className={classes.errorText}>This field is required</p>
      )}
    </>
  );
}

export default CustomAutocomplete;
