import { useState } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";

const initialState = {
  photo: null,
  error: "",
  dimension: { width: 0, height: 0 },
  loading: false,
};

function PhotoUpload() {
  const [state, setState] = useState(initialState);

  const checks = {
    photo: [
      state.photo,
      state.photo &&
        (state.photo.name.endsWith(".jpeg") ||
          state.photo.name.endsWith(".jpg") ||
          state.photo.name.endsWith(".png")
        ),
      state.photo && state.photo.size < 2000000,
    ],
  };

  const errorMessages = {
    photo: [
      "This field is required",
      "Please upload a JPG or JPEG",
      "Maximum size 2 MB",
    ],
  };

  const validatePhoto = (newFile) => {
    if (!!newFile) {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          const width = img.width;
          const height = img.height;

          const mmToPx = (mm) => (mm / 25.4) * 96;
          const targetWidthPx = mmToPx(45);
          const targetHeightPx = mmToPx(35);

          setState((prevState) => ({
            ...prevState,
            dimension: { width, height },
          }));
          if (
            width !== parseInt(targetWidthPx) ||
            height !== parseInt(targetHeightPx)
          ) {
            setState((prevState) => ({
              ...prevState,
              error: "Please upload an image with dimensions of 45mm x 35mm",
              photo: null,
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              error: "",
              photo: newFile,
            }));
          }
        };
      };
      reader.readAsDataURL(newFile);
    }
  };

  const handleFileDrop = (name, newFile) => {
    validatePhoto(newFile);
    if (!state.error) {
      setState((prev) => ({
        ...prev,
        [name]: newFile,
      }));
    }
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      photo: null,
    }));
  };

  const uploadPhoto = () => {

  }

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        rowSpacing={4}
        columnSpacing={{ xs: 2, md: 4 }}
      >
        <Grid item xs={12} md={8}>
          <Typography variant="h6">Profile Photo Update For Id Card</Typography>
          <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            <ul>
              <li>
                Close up of the head and top of the shoulders such that the face
                takes up 80-85% of the photograph.
              </li>
              <li>
                The photograph should be in color and in the size of 45mm x
                35mm.
              </li>
              <li>
                Background of the photograph should be a bright uniform colour.
              </li>
              <li>The photographs must:</li>
            </ul>
          </div>
          <div style={{ marginLeft: "50px" }}>
            <ul style={{ listStyleType: "circle" }}>
              <li>Show the applicant looking directly at the camera.</li>
              <li>Show the skin tones naturally.</li>
              <li>
                Have appropriate brightness and contrast - Show the applicants
                eyes open & clearly visible, - Should not have hair across the
                eyes.
              </li>
              <li>
                Be taken with uniform lighting and not show shadows or flash
                reflections on the face and no red eye.
              </li>
            </ul>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomFileInput
            name="photo"
            label="photo"
            helperText="smaller than 2 MB"
            file={state.photo}
            handleFileDrop={handleFileDrop}
            handleFileRemove={handleFileRemove}
            checks={checks.photo}
            errors={errorMessages.photo}
            required
          />
          {!!state.error && (
            <p style={{ color: "red", fontSize: "13px", textAlign: "center" }}>
              {state.error}
            </p>
          )}
        </Grid>
        <Grid item xs={12} align="right">
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            color="primary"
            disabled={!state.photo}
            // onClick={uploadPhoto}
          >
            {!!state.loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong>Upload</strong>
            )}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default PhotoUpload;
