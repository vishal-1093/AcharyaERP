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
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useAlert from "../../../hooks/useAlert";
import DeleteIcon from "@mui/icons-material/Delete";

const initialValues = { graduationId: "", document: "" };

const requiredFields = ["graduationId", "document"];

function UploadEducationalDocument({
  empId,
  viewAccess,
  hrviewAccess,
  setBackDropLoading,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [educationalDocuments, setEducationalDocuments] = useState([]);
  const [graduationOptions, setGraduationOptions] = useState([]);

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
    downloadEducationalDocuments();
    getGraduationData();
  }, []);

  const getGraduationData = async () => {
    try {
      const response = await axios.get("/api/employee/graduation");
      const optionData = [];
      response.data.data.map((obj) => {
        optionData.push({
          value: obj.graduation_id,
          label: obj.graduation_name,
        });
      });
      setGraduationOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to load Graduations !!",
      });
      setAlertOpen(true);
    }
  };

  const downloadEducationalDocuments = async () => {
    if (!empId) return;
    try {
      const response = await axios.get(
        `/api/employee/getEducationDocsAttachmentById/${empId}`
      );
      setEducationalDocuments(response.data);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to download the Educational Documents !!",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile) setValues((prev) => ({ ...prev, [name]: newFile }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({ ...prev, [name]: null }));
  };

  const handleViewEducationalDocuments = async (filePath) => {
    if (!filePath) return;
    try {
      setBackDropLoading(true);
      const response = await axios.get(
        `/api/employee/fileDownloadOfEducationDetailsAttachment?attachment_path=${filePath}`,
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

  const uploadEducationalDocs = async () => {
    const { document, graduationId } = values;
    try {
      setLoading(true);
      const dataArray = new FormData();
      dataArray.append("document", document);
      dataArray.append("graduationId", graduationId);
      dataArray.append("empId", empId);
      const response = await axios.post(
        "/api/employee/uploadEducationDetailsAttachment",
        dataArray
      );
      if (response.status === 200) {
        setAlertMessage({
          severity: "success",
          message: "Document has been uploaded succesfully !!",
        });
        setAlertOpen(true);
        setValues(initialValues);
        downloadEducationalDocuments();
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

  const handleDeleteDocument = async (id) => {
    if (!id) return;
    try {
      setBackDropLoading(true);
      const response = await axios.delete(
        `/api/employee/educationDocsAttachmentDeactivate/${id}`
      );
      if (response.status === 200) {
        setAlertMessage({
          severity: "success",
          message: "Document has been deleted succesfully !!",
        });
        setAlertOpen(true);
        downloadEducationalDocuments();
      }
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
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <Card>
            <CustomCardHeader title="Educational Documents" />
            <CardContent sx={{ padding: 4 }}>
              <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                  <CustomSelect
                    name="graduationId"
                    label="Graduation"
                    value={values.graduationId}
                    items={graduationOptions}
                    handleChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} align="center">
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

                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    onClick={uploadEducationalDocs}
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
        {(viewAccess() || hrviewAccess()) && (
          <Grid item xs={12}>
            <Card>
              <CustomCardHeader title="Uploaded Documents" />
              <CardContent>
                {educationalDocuments.length > 0 ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "auto auto auto",
                      justifyItems: "start",
                      gap: "10px",
                    }}
                  >
                    {educationalDocuments.map((obj, i) => (
                      <Box key={i}>
                        <IconButton
                          onClick={() =>
                            handleViewEducationalDocuments(obj.attachment_path)
                          }
                        >
                          <VisibilityIcon color="primary" />
                          <Typography
                            variant="subtitle2"
                            sx={{ marginLeft: 1 }}
                          >
                            {obj.graduationName}
                          </Typography>
                        </IconButton>
                        {hrviewAccess() && (
                          <IconButton
                            onClick={() =>
                              handleDeleteDocument(
                                obj.education_details_attachment_id
                              )
                            }
                          >
                            <DeleteIcon color="error" sx={{ marginLeft: 1 }} />
                          </IconButton>
                        )}
                      </Box>
                    ))}
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
        )}
      </Grid>
    </FormPaperWrapper>
  );
}

export default UploadEducationalDocument;
