import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useAlert from "../../../hooks/useAlert";

const initialValues = { document: "" };

const requiredFields = ["document"];

function UploadMedicalDocument({
  empId,
  documentViewAccess,
  setBackDropLoading,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [medicalDocuments, setMedicalDocuments] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    downloadMedicalDocuments();
  }, []);

  const downloadMedicalDocuments = async () => {
    if (!empId) return;
    try {
      const response = await axios.get(
        `/api/employee/EmployeeDetails/${empId}`
      );
      console.log("response :>> ", response);
      setMedicalDocuments(response.data.data[0].emp_attachment_file_name2);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to download the personal documents !!",
      });
      setAlertOpen(true);
    }
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile) setValues((prev) => ({ ...prev, [name]: newFile }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({ ...prev, [name]: null }));
  };

  const handleViewMedicalDocuments = async () => {
    if (!medicalDocuments) return;
    try {
      setBackDropLoading(true);
      const response = await axios.get(
        `/api/employee/employeeDetailsFileview?fileName=${medicalDocuments}`,
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      window.open(url);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Unable to open the file",
      });
      setAlertOpen(true);
    } finally {
      setBackDropLoading(false);
    }
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

  const uploadMedicalDocs = async () => {
    const { document } = values;
    try {
      setLoading(true);
      const dataArray = new FormData();
      dataArray.append("file2", document);
      dataArray.append("empId", empId);
      const response = await axios.post(
        "/api/employee/employeeDetailsUploadFile2",
        dataArray
      );

      if (response.status === 200) {
        setAlertMessage({
          severity: "success",
          message: "Document has been uploaded succesfully !!",
        });
        setAlertOpen(true);
        setValues(initialValues);
        downloadMedicalDocuments();
      }
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: "Something went wrong while uploading the document !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const CustomCardHeader = ({ title }) => (
    <CardHeader
      title={title}
      titleTypographyProps={{ variant: "subtitle2" }}
      sx={{
        backgroundColor: "tableBg.main",
        color: "tableBg.text",
        padding: 1,
      }}
    />
  );

  return (
    <FormPaperWrapper>
      <Grid container columnSpacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CustomCardHeader title="Upload Medical Documents" />
            <CardContent sx={{ padding: 4 }}>
              <Grid container rowSpacing={4}>
                <Grid item xs={12} align="center">
                  <CustomFileInput
                    name="document"
                    label="File For Medical Examination Report"
                    helperText="PDF"
                    file={values.document}
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                    checks={checks.document}
                    errors={errorMessages.document}
                  />
                </Grid>

                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    onClick={uploadMedicalDocs}
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CustomCardHeader title="Uploaded Documents" />
            <CardContent>
              {medicalDocuments && documentViewAccess() ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    justifyItems: "start",
                  }}
                >
                  {
                    <IconButton onClick={handleViewMedicalDocuments}>
                      <VisibilityIcon color="primary" />
                      <Typography variant="subtitle2" sx={{ marginLeft: 1 }}>
                        Medical document
                      </Typography>
                    </IconButton>
                  }
                </Box>
              ) : (
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ textAlign: "center" }}
                >
                  No document uploaded yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </FormPaperWrapper>
  );
}

export default UploadMedicalDocument;
