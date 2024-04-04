import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import {Button, CircularProgress, Divider, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DocumentList = () => {
  const params = useParams();
  const setCrumbs = useBreadcrumbs();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    setCrumbs([
      { name: "Upload", link: "/documentsrepo" },
      { name: "Documents" },
    ]);
    getDocuments();
  }, []);

  const getDocuments = async () => {
    const { id } = params;
    try {
      setLoading(true);
      const res = await axios.get(`/api/institute/getdocumentsById/${id}`);

      const data = res.data.data;
      if (data !== null && data && Object.keys(data).length > 0) {
        if (!data.document_attachment_path) return;
        const files = data.document_attachment_path.split(",");

        for (const path of files) {
          const blob = await getFileBlob(path);
          if (blob !== "")
            setDocuments((prev) => [...prev, URL.createObjectURL(blob)]);
        }
        setLoading(false);
      } else setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Failed to fetch data");
    }
  };

  const getFileBlob = (path) => {
    return new Promise(async (resolve) => {
      try {
        const res = await axios.get(
          `/api/institute/studentStaffFileviews?fileName=${path}`,
          { responseType: "blob" }
        );
        resolve(res.data);
      } catch (error) {
        resolve("");
      }
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { id } = params;
    setLoading(true);
    await uploadAttachment(id, file);
    getDocuments();
  };

  const uploadAttachment = (documentId, attachment) => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", attachment);
        formData.append("documents_id", documentId);
        await axios.post("/api/institute/studentStaffUploadFile", formData);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <>
      {loading && (
        <CircularProgress
          sx={{ position: "absolute", width: "100%", top: "45%", left: "50%" }}
        />
      )}
      <Grid container justifyContent="flex-end" sx={{ gap: "20px" }}>
        <Button
          component="label"
          size="large"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={loading}
        >
          Upload file{" "}
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileUpload}
            accept="application/pdf"
          />
        </Button>
      </Grid>
      <br></br>
      <Divider />

      {documents.length > 0 && (
        <Grid container mt={3} spacing={3}>
          {documents.map((file, key) => {
            return (
              <Grid key={key} item xs={12} sm={12} md={3} lg={3} xl={3}>
                <object
                  data={file}
                  type="application/pdf"
                  width={300}
                  height={300}
                  aria-label="document"
                ></object>
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
};

export default DocumentList;
