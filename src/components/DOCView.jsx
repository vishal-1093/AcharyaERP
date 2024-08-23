import React, { useEffect, useState } from 'react';
import axios from "../services/Api";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";
import { Box, Button, Grid, LinearProgress, Typography } from '@mui/material';

// Load pdf worker

const DOCView = ({ attachmentPath }) => {
  const [documentUrl, setDocumentUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [progress, setProgress] = useState(true);

  useEffect(() => {
    getDocument();
  }, []);

  const getDocument = async () => {
    if (attachmentPath) {
      setLoading(true);
      try {
        const res = await axios.get(attachmentPath, {
          responseType: 'blob',
        });
        const url = URL.createObjectURL(res.data);
        setDocumentUrl(url);
        setProgress(false);
      } catch (err) {
        setAlertMessage({
          severity: 'error',
          message: err.response ? err.response.data.message : 'An error occurred',
        });
      } finally {
        setLoading(false);
      }
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
            <iframe
              src={documentUrl}
              title="PDF Preview"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
            <Button size="small" onClick={() => window.open(documentUrl)}>
              View Document
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DOCView;
