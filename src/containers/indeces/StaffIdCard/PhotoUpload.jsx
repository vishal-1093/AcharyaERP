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
  loading: false,
};

function PhotoUpload() {
  const [state, setState] = useState(initialState);

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        rowSpacing={4}
        columnSpacing={{ xs: 2, md: 4 }}
        mb={1}
        mt={1}
      >
        <Grid item xs={12} md={4}>
          <CustomFileInput
            name="Image Upload"
            label="Image Upload"
            helperText="smaller than 2 MB"
            // file={values.researchAttachment}
            // handleFileDrop={handleFileDrop}
            // handleFileRemove={handleFileRemove}
            // checks={checks.researchAttachment}
            // errors={errorMessages.researchAttachment}
            required
          />
        </Grid>
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
        <Grid item xs={12} align="right">
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            color="primary"
            //   disabled={state.jobTypeId == null}
            //     onClick={handleUpdate}
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
