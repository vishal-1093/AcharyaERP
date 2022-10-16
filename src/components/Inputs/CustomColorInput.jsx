import { useState } from "react";
import { Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

// name: string,
// label: string,
// value: string,
// handleChange: () => void,
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
    width: 73,
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
      <Grid item xs={6}>
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
          <Typography component="p" variant="p" className={classes.helper}>
            This field is required
          </Typography>
        )}
      </Grid>
      <Grid item xs={3}>
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
            setShowError(false);
          }}
          onBlur={() => (value ? setShowError(false) : setShowError(true))}
        />
      </Grid>
    </Grid>
  );
}

export default CustomColorInput;
