import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, Grid, Typography } from "@mui/material";
import useAlert from "../../../hooks/useAlert";

function DocumentsView({ id }) {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `/api/employee/getAllApplicantDetails/${id}`
      );
      const responseData = response.Job_Profile;
      const {
        Resume_Attachment: resumeAttachment,
        Higher_Education_Attachment: educationAttachment,
      } = responseData;
      const resumeAttachmentPath = resumeAttachment?.attachment_path;
      const educationAttachmentPath = educationAttachment?.he_attachment_path;
      let resumeUrl = "";
      let educationUrl = "";
      if (resumeAttachmentPath) {
        const { data: resumeResponse } = await axios.get(
          `/api/employee/jobFileviews?fileName=${resumeAttachmentPath}`,
          {
            responseType: "blob",
          }
        );
        resumeUrl = URL.createObjectURL(resumeResponse);
      }
      if (educationAttachmentPath) {
        const { data: educationResponse } = await axios.get(
          `/api/employee/higherEducationFileDownload?fileName=${educationAttachmentPath}`,
          {
            responseType: "blob",
          }
        );
        educationUrl = URL.createObjectURL(educationResponse);
      }
      setFiles({ resume: resumeUrl, education: educationUrl });
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Something went wrong !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center" }}
      >
        Loading ....
      </Typography>
    );
  }

  return (
    <Box>
      <Grid container columnSpacing={4}>
        <Grid item xs={12} md={6}>
          <iframe src={files.resume} style={{ width: "100%" }} />
          <Button size="small" onClick={() => window.open(files.resume)}>
            View Document
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <iframe src={files.education} style={{ width: "100%" }} />
          <Button size="small" onClick={() => window.open(files.education)}>
            View Document
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DocumentsView;
