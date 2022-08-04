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

// name: string
// value: string
// handleChange: () => void
// errors?: string[]
// checks?: boolean[]
// setFormValid?: () => void
// ...props? is additional props for MUI TextField component

function CustomTextField({
  name,
  value,
  handleChange,
  errors = [],
  checks = [],
  setFormValid = () => {},
  ...props
}) {
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);

  const classes = useStyles();

  return (
    <>
      <TextField
        error={!!errors[index] && showError}
        name={name}
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
        size="small"
        {...props}
      />
      {errors[index] && showError && (
        <p className={classes.errorText}>{errors[index]}</p>
      )}
    </>
  );
}

export default CustomTextField;
