import { useState, useEffect, useRef } from "react";
import { Grid, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  dropFileInput: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7ff",
    height: 200,
    maxWidth: 350,
    margin: "auto",
    border: `3px dashed ${theme.palette.primary.main}`,
    borderRadius: 20,

    "&:hover, &.dragover": {
      opacity: 0.7,
    },
  },
  input: {
    opacity: 0,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
  helperText: {
    color: "#555",
    fontSize: "0.85rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.75rem",
    },
  },
  labelText: {
    textAlign: "center",
    fontSize: "1rem",
    margin: "20px 10px 0 10px",
    "&:hover": {
      backgroundColor: "red",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "0.9rem",
      margin: "10px 5px 0 5px",
    },
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 350,
    margin: "auto !important",
    backgroundColor: "#e4e4ff",
    borderRadius: 10,
    borderLeft: `10px solid ${theme.palette.success.main}`,
    marginTop: "17px !important",
    padding: "0 10px",
  },
  fileName: {
    fontSize: "0.9rem",
    margin: "5px 0",
    overflow: "hidden",
  },
  fileSize: {
    fontSize: "0.8rem",
    margin: "5px 0",
  },
  error: {
    color: theme.palette.error.main,
    fontSize: "1rem",
    maxWidth: 350,
    margin: "10px auto",
    paddingLeft: 10,
  },
}));

const CustomFileInput = ({
  name,
  label,
  helperText,
  file,
  handleFileDrop,
  handleFileRemove,
  errors = [],
  checks = [],
  setFormValid = () => {},
}) => {
  const [error, setError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);

  const wrapperRef = useRef(null);
  const classes = useStyles();

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
  }, [file]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const calcFileSize = (file) => {
    const ext = new Array("Bytes", "KB", "MB", "GB");
    let fSize = file.size;

    let i = 0;
    while (fSize > 900) {
      fSize /= 1000;
      i++;
    }

    return Math.round(fSize * 100) / 100 + " " + ext[i];
  };

  return (
    <>
      {/* file input area */}
      <div
        className={classes.dropFileInput}
        ref={wrapperRef}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          className={classes.input}
          onChange={(e) => handleFileDrop(name, e.target.files[0])}
          onBlur={() => {
            if (error) setShowError(true);
            else setShowError(false);
          }}
        />
        <CloudUploadIcon sx={{ color: "#3346bd", fontSize: 75 }} />
        <p className={classes.helperText}>{helperText}</p>
        <p className={classes.labelText}>
          Drop your
          <span style={{ fontWeight: 500, fontSize: "1.1rem" }}> {label} </span>
          here or
          <span style={{ color: "#4A57A9", fontWeight: 500 }}> browse</span>
        </p>
      </div>

      {/* show preview */}
      {file && (
        <Grid container className={classes.infoContainer}>
          <Grid item xs={1}>
            <InsertDriveFileOutlinedIcon style={{ color: "#333" }} />
          </Grid>
          <Grid item xs={10} pl={1} pr={1}>
            <p className={classes.fileName}>{file.name}</p>
            <p className={classes.fileSize}>{calcFileSize(file)}</p>
          </Grid>
          <Grid item xs={1}>
            <IconButton size="small" onClick={() => handleFileRemove(name)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}

      {/* error */}
      {showError && errors[index] && (
        <p className={classes.error}>{errors[index]}</p>
      )}
    </>
  );
};

export default CustomFileInput;
