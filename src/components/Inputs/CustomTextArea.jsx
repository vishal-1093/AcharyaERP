import { useState } from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  textArea: {
    width: "100%",
    height: 100,
    padding: "9px 11px",
    borderRadius: 10,
    border: "1px solid #bbb",
    outline: "none",

    "&:hover": {
      border: "1px solid black",
    },

    "&:focus": {
      border: `2px solid ${theme.palette.primary.main}`,
    },
  },
  error: {
    border: `1px solid ${theme.palette.error.main}`,

    "&::placeholder": {
      color: theme.palette.error.main,
      opacity: 1,
    },
  },
  errorText: {
    color: theme.palette.error.main,
    margin: "5px 10px",
    fontSize: "0.85rem",
  },
}));

function CustomTextArea({
  name,
  placeholder,
  value,
  handleChange,
  errors = [],
  checks = [],
  setFormValid = () => {},
  required = false,
}) {
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);

  const classes = useStyles();

  return (
    <>
      <textarea
        name={name}
        placeholder={required ? `${placeholder}*` : placeholder}
        value={value}
        className={
          !!errors[index] && showError
            ? `${classes.textArea} ${classes.error}`
            : classes.textArea
        }
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
      />
      {showError && !!errors[index] && (
        <p className={classes.errorText}>{errors[index]}</p>
      )}
    </>
  );
}

export default CustomTextArea;
