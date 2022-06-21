import { useState } from "react";
import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  errorText: {
    fontSize: 12,
    margin: "2px 10px",
    color: theme.palette.error.main,
  },
}));

function CustomTextField({
  name,
  value,
  handleChange,
  error,
  required,
  regex,
  ...props
}) {
  const [showError, setShowError] = useState(false);

  const classes = useStyles();

  const checkField = () => {
    if ((required && !value) || (regex && !regex.test(value)))
      setShowError(true);
  };

  return (
    <>
      <TextField
        error={!!error}
        name={name}
        value={value}
        onChange={() => {
          handleChange();
          setShowError(false);
        }}
        onBlur={checkField}
        size="small"
        required={required}
        {...props}
      />
      {error && showError && <p className={classes.errorText}>{error}</p>}
    </>
  );
}

export default CustomTextField;
