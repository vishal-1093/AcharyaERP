import { useState } from "react";
import { Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

// name: string,
// label: string,
// value: string,
// handleChange: () => void,
// setFormValid?: () => void,
// required?: boolean,

const useStyles = makeStyles((theme) => ({
  label: {
    fontSize: "1.1rem",
    color: "#666",
  },
  error: {
    color: theme.palette.error.main,
  },
  colorInput: {
    height: 41,
    width: 41,
    border: "2px solid black",
    borderRadius: 13,
    overflow: "hidden",
  },
  errorInput: {
    border: `2px solid ${theme.palette.error.main}`,
  },
  helper: {
    color: theme.palette.error.main,
    padding: "7px",
    fontSize: "0.85rem",
  },
}));

function CustomColorInput({
  name,
  label,
  value,
  handleChange,
  setFormValid = () => {},
  required = false,
}) {
  const [showError, setShowError] = useState(false);

  const classes = useStyles();

  return (
    <Grid
      container
      textAlign="center"
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Grid item xs={7}>
        <Typography
          component="span"
          variant="span"
          className={
            required && showError
              ? `${classes.label} ${classes.error}`
              : classes.label
          }
        >
          {required ? `${label} *` : label}
        </Typography>
        {required && showError && (
          // <Grid item xs={12}>
          <Typography component="p" variant="p" className={classes.helper}>
            This field is required
          </Typography>
          // </Grid>
        )}
      </Grid>
      <Grid item xs={2}>
        <input
          type="color"
          className={
            required && showError
              ? `${classes.colorInput} ${classes.errorInput}`
              : classes.colorInput
          }
          name={name}
          value={value}
          onChange={(e) => {
            handleChange(e);
            setFormValid((prev) => ({ ...prev, [name]: true }));
            setShowError(false);
          }}
          onBlur={() => (value ? setShowError(false) : setShowError(true))}
        />
      </Grid>
    </Grid>
  );
}

export default CustomColorInput;
