import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, Grid, LinearProgress, Typography } from "@mui/material";

function ResignationDocumentView({
  attachmentPath,
  setDocumentModalOpen,
  setAlertMessage,
  setAlertOpen,
}) {
  const [document, setDocument] = useState();
  const [progress, setProgress] = useState(true);

  useEffect(() => {
    getDocument();
  }, []);

  const getDocument = async () => {
    if (attachmentPath) {
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
          <Grid item xs={12}>
            <iframe src={document} style={{ width: "100%", height: "80%" }} />
            <Button size="small" onClick={() => window.open(document)}>
              View Document
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default ResignationDocumentView;
