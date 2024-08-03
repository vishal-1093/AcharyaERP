import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ReplayIcon from "@mui/icons-material/Replay";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";

const initialValues = {
  document: "",
};

const requiredFields = ["document"];

function ResignationUpload({
  attachmentPath,
  setAlertMessage,
  setAlertOpen,
  rowData,
  setDocumentModalOpen,
  getData,
}) {
  const [values, setValues] = useState(initialValues);
  const [isNew, setIsNew] = useState(false);
  const [document, setDocument] = useState();
  const [progress, setProgress] = useState(false);
  const [reUploadStatus, setReuploadStatus] = useState(false);
  const [loading, setLoading] = useState(false);

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
    getDocument();
  }, []);

  const getDocument = async () => {
    if (attachmentPath) {
      setProgress(true);
      await axios
        .get(`/api/employee/resignationFileviews?fileName=${attachmentPath}`, {
          responseType: "blob",
        })
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          setDocument(url);
          setProgress(false);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
          setDocumentModalOpen(false);
        });
    } else {
      setIsNew(true);
    }
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
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

  const handleDelete = async () => {
    return await axios
      .delete(`/api/employee/resignationAttachment/${rowData.id}`)
      .then((res) => res.data.success)
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
        setDocumentModalOpen(false);
      });
  };

  const handleCreateDocument = async () => {
    const dataArray = new FormData();
    dataArray.append("rad[" + 0 + "].file", values.document);
    dataArray.append("resignation_id", rowData.id);
    dataArray.append("active", true);
    dataArray.append("emp_id", rowData.emp_id);

    axios
      .post("/api/employee/uploadFileResignationAttachment", dataArray)
      .then((res) => {
        if (res.data.success === true) {
          setAlertMessage({
            severity: "success",
            message: "Document uploaded successfully !!",
          });
          setAlertOpen(true);
          setLoading(false);
          setDocumentModalOpen(false);
          getData();
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const handleCreate = async () => {
    setLoading(true);
    if (isNew) {
      handleCreateDocument();
    } else {
      handleDelete().then((status) => {
        if (status) handleCreateDocument();
      });
    }
  };

  return (
    <Box mt={2} p={2}>
      <Grid container rowSpacing={2}>
        {progress ? (
          <Grid item xs={12} align="center">
            <LinearProgress />
            <Typography variant="subtitle2" color="primary">
              Please wait ....
            </Typography>
          </Grid>
        ) : (
          <>
            {!isNew ? (
              <>
                <Grid item xs={12}>
                  <iframe
                    src={document}
                    style={{ width: "100%", height: "80%" }}
                  />
                  <Button size="small" onClick={() => window.open(document)}>
                    View Document
                  </Button>
                </Grid>

                <Grid item xs={12} align="right">
                  {!reUploadStatus ? (
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<ReplayIcon />}
                      onClick={() => setReuploadStatus(true)}
                    >
                      Re - Upload
                    </Button>
                  ) : (
                    <></>
                  )}
                </Grid>
              </>
            ) : (
              <></>
            )}

            {isNew || reUploadStatus ? (
              <>
                <Grid item xs={12}>
                  <CustomFileInput
                    name="document"
                    label="Document"
                    helperText="PDF - smaller than 2 MB"
                    file={values.document}
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                    checks={checks.document}
                    errors={errorMessages.document}
                    required
                  />
                </Grid>

                <Grid item xs={12} align="right" mt={2}>
                  <Stack justifyContent="right" direction="row" spacing={2}>
                    {!isNew ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setReuploadStatus(false)}
                      >
                        Cancel Upload
                      </Button>
                    ) : (
                      <></>
                    )}

                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleCreate}
                      disabled={loading || !requiredFieldsValid()}
                      endIcon={<CloudUploadIcon />}
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
                  </Stack>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
}

export default ResignationUpload;
