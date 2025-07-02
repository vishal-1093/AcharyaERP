import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Grid,
} from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";

const initialValues = { document: "" };

const requiredFields = ["document"];

const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;

function UploadPhoto({ empId, documentViewAccess, setBackDropLoading }) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [photoPath, setPhotoPath] = useState("");
  const [viewPhoto, setViewPhoto] = useState("");

  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    document: [
      values.document !== "",
      values.document &&
        (values.document.name.endsWith(".jpeg") ||
          values.document.name.endsWith(".jpg") ||
          values.document.name.endsWith(".png")),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a JPG or JPEG or PNG",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getPhoto();
  }, []);

  const getPhoto = async () => {
    if (!empId) return;
    try {
      setBackDropLoading(true);
      const response = await axios.get(
        `/api/employee/EmployeeDetails/${empId}`
      );
      const path = response.data.data[0].emp_image_attachment_path;
      if (path) {
        const photoRes = await axios.get(
          `/api/employee/employeeDetailsFileDownload?fileName=${path}`,
          {
            responseType: "blob",
          }
        );
        setViewPhoto(URL.createObjectURL(photoRes.data));
      }
      setPhotoPath(path);
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: "Failed to download the Photo !!",
      });
      setAlertOpen(true);
    } finally {
      setBackDropLoading(false);
    }
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile) setValues((prev) => ({ ...prev, [name]: newFile }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({ ...prev, [name]: null }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const uploadPhoto = async () => {
    const { document } = values;
    try {
      setLoading(true);
      const dataArray = new FormData();
      dataArray.append("image_file1", document);
      dataArray.append("empId", empId);
      const response = await axios.post(
        "/api/employee/uploadImageFile",
        dataArray
      );

      if (response.status === 200) {
        setAlertMessage({
          severity: "success",
          message: "Document has been uploaded succesfully !!",
        });
        setAlertOpen(true);
        setValues(initialValues);
        getPhoto();
      }
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: "Something went wrong! Unable to find the Image !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Upload Photo"
        titleTypographyProps={{ variant: "subtitle2" }}
        sx={{
          backgroundColor: "tableBg.main",
          color: "tableBg.text",
          padding: 1,
        }}
      />
      <CardContent sx={{ padding: 5 }}>
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item xs={12} md={8}>
            <Grid container>
              <Grid item xs={12} ml={2}>
                <ul>
                  <li>
                    Close up of the head and top of the shoulders such that the
                    face takes up 80-85% of the photograph.
                  </li>
                  <li>
                    The photograph should be in color and in the size of 45mm x
                    35mm.
                  </li>
                  <li>
                    Background of the photograph should be a bright uniform
                    colour.
                  </li>
                  <li>The photographs must:</li>
                </ul>
              </Grid>
              <Grid item xs={12} ml={4}>
                <ul style={{ listStyleType: "circle" }}>
                  <li>Show the applicant looking directly at the camera.</li>
                  <li>Show the skin tones naturally.</li>
                  <li>
                    Have appropriate brightness and contrast - Show the
                    applicants eyes open & clearly visible, - Should not have
                    hair across the eyes.
                  </li>
                  <li>
                    Be taken with uniform lighting and not show shadows or flash
                    reflections on the face and no red eye.
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} align="center">
            {viewPhoto && (
              <CardMedia
                component="img"
                sx={{ width: 200 }}
                image={viewPhoto}
              />
            )}
          </Grid>
          {(roleId == 1 || roleId == 5 || roleId === 6) && (
            <Grid item xs={12} md={12}>
              <CustomFileInput
                name="document"
                label="File"
                helperText="PDF"
                file={values.document}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.document}
                errors={errorMessages.document}
              />
            </Grid>
          )}
          {(roleId == 1 || roleId == 5 || roleId === 6) && (
            <Grid item xs={12} md={3} align="right">
              <Button
                variant="contained"
                onClick={uploadPhoto}
                disabled={loading || !requiredFieldsValid()}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Upload"
                )}
              </Button>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default UploadPhoto;
