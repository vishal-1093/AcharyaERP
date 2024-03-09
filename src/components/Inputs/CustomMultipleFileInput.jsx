import { useState, useEffect, useRef } from "react";
import { Grid, IconButton } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";

const useStyles = makeStyles((theme) => ({
  dropFileInput: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7ff",
    height: 180,
    maxWidth: 260,
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
    fontSize: "0.90rem",
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

function CustomMultipleFileInput({
  name,
  label,
  helperText,
  file = {},
  handleFileDrop,
  handleFileRemove,
  errors = [],
  checks = [],
}) {
  const [error, setError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);

  const wrapperRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    let flag = false;
    for (let i = 0; i < checks.length; i++) {
      if (!checks[i]) {
        flag = true;
        setError(true);
        setIndex(i);
        break;
      }
    }
    if (!flag) {
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
      fSize /= 1024;
      i++;
    }

    return Math.round(fSize * 100) / 100 + " " + ext[i];
  };

  function SelectedFiles({ files, index }) {
    return (
      <>
        <Grid container className={classes.infoContainer} rowSpacing={1}>
          <Grid item xs={1}>
            <InsertDriveFileOutlinedIcon style={{ color: "#333" }} />
          </Grid>
          <Grid item xs={10} pl={1} pr={1}>
            <p className={classes.fileName}>{files.name}</p>
            <p className={classes.fileSize}>{calcFileSize(files)}</p>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              size="small"
              onClick={() => handleFileRemove(name, index)}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </>
    );
  }

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
          multiple
          className={classes.input}
          onChange={(e) => handleFileDrop(name, e.target.files)}
          onBlur={() => {
            if (error) setShowError(true);
            else setShowError(false);
          }}
        />
        <FolderCopyIcon sx={{ color: "primary.main", fontSize: 50 }} />
        <p className={classes.helperText}>{helperText}</p>
        <p className={classes.labelText}>
          Drop your
          <span style={{ fontWeight: 500, fontSize: "0.90rem" }}>
            {"  " + label + "  "}
          </span>
          here or
          <span style={{ color: "primary.main", fontWeight: 500 }}>
            {" "}
            browse
          </span>
        </p>
      </div>

      {/* show preview */}
      {Object.keys(file).length > 0 &&
        Object.keys(file).map((obj, i) => (
          <SelectedFiles files={file[obj]} index={obj} key={i} />
        ))}

      {/* error */}
      {showError && errors[index] && (
        <p className={classes.error}>{errors[index]}</p>
      )}
    </>
  );
}

export default CustomMultipleFileInput;
