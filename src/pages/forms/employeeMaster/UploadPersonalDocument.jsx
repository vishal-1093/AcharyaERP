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

const personalDocumentList = [
  {
    value: "DRIVING_LICENCE",
    label: "DRIVING LICENCE",
  },
  {
    value: "PASSPORT",
    label: "PASSPORT",
  },
  {
    value: "AADHAR_CARD",
    label: "AADHAR CARD",
  },
  {
    value: "PAN_CARD",
    label: "PAN CARD",
  },
  {
    value: "VOTER_ID",
    label: "VOTER ID",
  },
  {
    value: "OTHERS",
    label: "OTHERS",
  },
];

const initialValues = { personalList: "", document: "" };

const requiredFields = ["personalList", "document"];

function UploadPersonalDocument({
  empId,
  documentViewAccess,
  setBackDropLoading,
  jobId,
}) {
  const [values, setValues] = useState(initialValues);
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [personalDocuments, setPersonalDocuments] = useState([]);

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
    downloadPersonalDocuments();
    getResume();
  }, []);

  const downloadPersonalDocuments = async () => {
    if (!empId) return;
    try {
      const response = await axios.get(
        `/api/employee/getEmployeeIDsAttachmentById/${empId}`
      );
      setPersonalDocuments(response.data);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to download the Personal Documents !!",
      });
      setAlertOpen(true);
    }
  };

  const getResume = async () => {
    if (!jobId) return;
    try {
      const { data: response } = await axios.get(
        `/api/employee/getAllApplicantDetails/${jobId}`
      );
      const responseData = response.Job_Profile;
      const { Resume_Attachment: resumeAttachment } = responseData;
      const resumeAttachmentPath = resumeAttachment?.attachment_path;
      if (resumeAttachmentPath) {
        const { data: resumeResponse } = await axios.get(
          `/api/employee/jobFileviews?fileName=${resumeAttachmentPath}`,
          {
            responseType: "blob",
          }
        );
        const url = URL.createObjectURL(resumeResponse);
        setResume(url);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Unable to download the Resume",
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

  const handleViewPersonalDocuments = async (filePath) => {
    if (!filePath) return;
    try {
      setBackDropLoading(true);
      const response = await axios.get(
        `/api/employee/employeeDetailsFileDownload?fileName=${filePath}`,
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

  const uploadPersonalDocs = async () => {
    const { document, personalList } = values;
    try {
      setLoading(true);
      const dataArray = new FormData();
      dataArray.append("document", document);
      dataArray.append("documentType", personalList);
      dataArray.append("empId", empId);
      const response = await axios.post(
        "/api/employee/uploadEmployeeIDsAttachment",
        dataArray
      );

      if (response.status === 200) {
        setAlertMessage({
          severity: "success",
          message: "Document has been uploaded succesfully !!",
        });
        setAlertOpen(true);
        setValues(initialValues);
        downloadPersonalDocuments();
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
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <Card>
            <CustomCardHeader title="Personal Documents" />
            <CardContent sx={{ padding: 4 }}>
              <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                  <CustomSelect
                    name="personalList"
                    label="Id Proof"
                    value={values.personalList}
                    items={personalDocumentList}
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
                    onClick={uploadPersonalDocs}
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

        {documentViewAccess() && (
          <Grid item xs={12}>
            <Card>
              <CustomCardHeader title="Uploaded Documents" />
              <CardContent>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto auto auto",
                    justifyItems: "start",
                  }}
                >
                  {resume && (
                    <IconButton onClick={() => window.open(resume)}>
                      <VisibilityIcon color="primary" />
                      <Typography variant="subtitle2" sx={{ marginLeft: 1 }}>
                        RESUME
                      </Typography>
                    </IconButton>
                  )}
                </Box>
                {personalDocuments.length > 0 ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "auto auto auto",
                      justifyItems: "start",
                      gap: "10px",
                    }}
                  >
                    {personalDocuments.map((obj, i) => (
                      <IconButton
                        key={i}
                        onClick={() =>
                          handleViewPersonalDocuments(obj.filePath)
                        }
                      >
                        <VisibilityIcon color="primary" />
                        <Typography variant="subtitle2" sx={{ marginLeft: 1 }}>
                          {obj.documentType}
                        </Typography>
                      </IconButton>
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

export default UploadPersonalDocument;
