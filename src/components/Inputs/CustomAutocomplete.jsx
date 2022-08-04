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
        options={options ? [...options.map((obj) => obj.label), ""] : [""]}
        filterOptions={(ops) => ops.filter((op) => op !== "")}
        value={value}
        onChange={(e, val) => {
          handleChangeAdvance(name, val);
          setFormValid((prev) => ({ ...prev, [name]: true }));
          setShowError(false);
        }}
        onBlur={() => (value ? setShowError(false) : setShowError(true))}
        getOptionDisabled={(op) => op === ""}
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
