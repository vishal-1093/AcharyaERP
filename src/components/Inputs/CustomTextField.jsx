import React from "react";
import { TextField, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  errorText: {
    fontSize: 12,
    margin: "2px 10px",
    color: theme.palette.error.main,
  },
}));

function CustomTextField({ name, value, handleChange, error, ...props }) {
  const classes = useStyles();

  return (
    <>
      <TextField
        error={!!error}
        name={name}
        value={value}
        onChange={handleChange}
        size="small"
        {...props}
      />
      {error && <p className={classes.errorText}>{error}</p>}
    </>
  );
}

export default CustomTextField;
