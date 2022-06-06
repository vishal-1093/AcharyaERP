import { useRef } from "react";
import { Grid, IconButton } from "@mui/material";
import { useStyles } from "./styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseIcon from "@mui/icons-material/Close";

const Dropfileinput = ({ index, files, setFiles, error }) => {
  const wrapperRef = useRef(null);
  const classes = useStyles();

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const handleFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFiles((prev) =>
        prev.map((o, i) => {
          if (i === index) return newFile;
          return o;
        })
      );
    }
  };
  const handleFileRemove = () => {
    setFiles((prev) =>
      prev.map((o, i) => {
        if (i === index) return null;
        return o;
      })
    );
  };

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
          onChange={handleFileDrop}
        />
        <CloudUploadIcon sx={{ color: "#3346bd", fontSize: 75 }} />
        <p className={classes.smallText}>pdf - smaller than 2 MB</p>
        <p className={classes.bottomText}>
          Drop your
          {index === 0 && <span style={{ fontWeight: 500 }}> resume </span>}
          {index === 1 && <span style={{ fontWeight: 500 }}> degree </span>}
          here or
          <span style={{ color: "#4A57A9", fontWeight: 500 }}> browse</span>
        </p>
      </div>

      {/* show preview */}
      {files[index] && (
        <Grid container className={classes.previewContainer}>
          <Grid item xs={1}>
            <InsertDriveFileOutlinedIcon style={{ color: "#333" }} />
          </Grid>
          <Grid item xs={10} pl={1} pr={1}>
            <p className={classes.fileName}>{files[index].name}</p>
            <p className={classes.fileSize}>{calcFileSize(files[index])}</p>
          </Grid>
          <Grid item xs={1}>
            <IconButton size="small" onClick={handleFileRemove}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}

      {/* error */}
      {error && <p className={classes.error}>{error}</p>}
    </>
  );
};

export default Dropfileinput;
