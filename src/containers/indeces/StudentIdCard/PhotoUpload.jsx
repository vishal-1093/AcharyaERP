import { useEffect, useState } from "react";
import { Grid, Button, CircularProgress, Typography } from "@mui/material";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import useAlert from "../../../hooks/useAlert";
import axios from "../../../services/Api";

const initialState = {
  photo: null,
  studentImageUrl: null,
  error: "",
  dimension: { width: 0, height: 0 },
  loading: false,
  imageLoading: false,
};

function PhotoUpload({
  studentId,
  studentImagePath,
  handleAddPhotoModal,
  getData,
}) {
  const [state, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getStudentImage();
  }, [studentImagePath]);

  const getStudentImage = async () => {
    try {
      setImageLoading(true);
      if (!!studentImagePath) {
        const studentImageResponse = await axios.get(
          `/api/student/studentImageDownload?student_image_attachment_path=${studentImagePath}`,
          { responseType: "blob" }
        );
        if (!!studentImageResponse) {
          setState((prevState) => ({
            ...prevState,
            studentImageUrl: URL.createObjectURL(studentImageResponse.data),
          }));
        }
      }
      setImageLoading(false);
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error",
      });
      setAlertOpen(true);
      setImageLoading(false);
    }
  };

  const checks = {
    photo: [
      state.photo &&
        (state.photo.name.endsWith(".jpeg") ||
          state.photo.name.endsWith(".jpg") ||
          state.photo.name.endsWith(".png")),
      state.photo && state.photo.size < 2000000,
    ],
  };

  const errorMessages = {
    photo: [
      "This field is required",
      "Please upload a JPG or JPEG or PNG",
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
    if (
      newFile?.name.endsWith(".jpeg") ||
      newFile?.name.endsWith(".jpg") ||
      newFile?.name.endsWith(".png")
    ) {
      validatePhoto(newFile);
      if (!state.error) {
        setState((prev) => ({
          ...prev,
          [name]: newFile,
        }));
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        error: "Please upload file in jpg or jpeg or png format",
      }));
    }
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      photo: null,
      error: "",
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const setImageLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      imageLoading: val,
    }));
  };

  const handleUploadPhoto = async () => {
    setLoading(true);
    const studentPhoto = new FormData();
    studentPhoto.append("image_file", state.photo);
    studentPhoto.append("student_id", studentId);
    return await axios
      .post(`/api/student/studentImageUploadFile`, studentPhoto)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          handleAddPhotoModal();
          setAlertMessage({
            severity: "success",
            message: !!studentImagePath
              ? "Photo updated successfully"
              : "Photo uploaded successfully",
          });
        }
        setAlertOpen(true);
        setLoading(false);
        getData();
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message:
            "Some thing went wrong !! unable to  uploaded the Staff Attachment",
        });
        setAlertOpen(true);
      });
  };

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            {!!state.imageLoading && (
              <CircularProgress
                size={25}
                color="inherit"
                style={{ margin: "2px 13px" }}
              />
            )}
            {!!state.studentImageUrl && !state.imageLoading && (
              <img
                src={state.studentImageUrl}
                alt="studentImageUrl"
                style={{ maxWidth: "100%", maxHeight: "130px" }}
              />
            )}
          </div>
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
            onClick={handleUploadPhoto}
          >
            {!!state.loading ? (
              <CircularProgress
                size={25}
                color="inherit"
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
