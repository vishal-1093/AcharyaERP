import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Paper,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "../services/Api";
import useAlert from "../hooks/useAlert";

const Id = sessionStorage.getItem("empId");

const StudentDocumentUpload = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [selectedSubCategories, setSelectedSubCategories] = useState({});
  const [mappedFiles, setMappedFiles] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  const fileInputRef = useRef({});
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedSubCategories({});
    setMappedFiles({});
    axios
      .get("/api/getAllAttachmentCategory")
      .then((res) => {
        const categories = res.data.data;
        setMainCategories(categories);
        if (categories.length > 0) {
          handleMainCategorySelect(categories[0]);
        }
      })
      .catch(() => {
        setAlertMessage({ severity: "error", message: "Failed to load categories" });
        setAlertOpen(true);
      });
  }, []);

  useEffect(() => {
    setSelectedSubCategories({});
    setMappedFiles({});
  }, [Id]);

  const fetchSubCategories = async (mainId) => {
    try {
      const res = await axios.get(`/api/getAttachCategoryDetails?attachments_category_id=${mainId}`);
      setSubCategoriesMap((prev) => ({ ...prev, [mainId]: res.data.data }));
    } catch {
      setAlertMessage({ severity: "error", message: "Failed to load subcategories" });
      setAlertOpen(true);
    }
  };

  const handleMainCategorySelect = (cat) => {
    const id = cat.attachments_category_id;
    setSelectedMainCategory(cat);
    setSelectedSubCategories({});
    setMappedFiles({});
    fetchSubCategories(id);
  };

  const handleSubCategoryToggle = (name) => {
    setSelectedSubCategories((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));

    if (selectedSubCategories[name]) {
      const updated = { ...mappedFiles };
      const removed = updated[name];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      delete updated[name];
      setMappedFiles(updated);
    }
  };

  const handleFilesForSubcategory = (subcatName, files) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const validFile = Array.from(files).find((f) => validTypes.includes(f.type));

    if (!validFile) {
      setAlertMessage({ severity: "error", message: "Only PDF, JPEG, and PNG files allowed" });
      setAlertOpen(true);
      return;
    }

    const previewUrl = validFile.type.startsWith("image/") ? URL.createObjectURL(validFile) : null;

    setMappedFiles((prev) => ({
      ...prev,
      [subcatName]: { file: validFile, preview: previewUrl },
    }));
  };

  const deleteFile = (e, sub) => {
    e.preventDefault();
    e.stopPropagation();

    const removed = mappedFiles[sub];
    if (removed?.preview) {
      URL.revokeObjectURL(removed.preview);
    }

    const newMap = { ...mappedFiles };
    delete newMap[sub];
    setMappedFiles(newMap);

    const newSubs = { ...selectedSubCategories };
    delete newSubs[sub];
    setSelectedSubCategories(newSubs);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!selectedMainCategory || Object.keys(mappedFiles).length === 0) {
      setAlertMessage({ severity: "error", message: "Category & files required" });
      setAlertOpen(true);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("attachments_category_id", selectedMainCategory.attachments_category_id);
    formData.append("student_id", Id);

    const subcats = subCategoriesMap[selectedMainCategory.attachments_category_id] || [];
    subcats.forEach((sub) => {
      const name = sub.attachments_subcategory_name;
      const short = sub.attachments_subcategory_name_short;
      if (mappedFiles[name]?.file) {
        formData.append(short, mappedFiles[name].file);
      }
    });

    try {
      await axios.post("/api/student/uploadStudentAttachment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAlertMessage({ severity: "success", message: "Upload successful" });
      setAlertOpen(true);
      setSelectedSubCategories({});
      setMappedFiles({});
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Upload failed",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Documents Upload
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography fontWeight={600} mb={1}>
              Main Categories
            </Typography>
            {mainCategories.map((cat) => (
              <Chip
                key={cat.attachments_category_id}
                label={cat.attachments_category_name}
                onClick={() => handleMainCategorySelect(cat)}
                color={
                  selectedMainCategory?.attachments_category_id === cat.attachments_category_id
                    ? "primary"
                    : "default"
                }
                sx={{ mb: 1, mr: 1 }}
                clickable
              />
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper elevation={2} sx={{ p: 3 }}>
            {selectedMainCategory ? (
              <>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Select Subcategories
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                  {(subCategoriesMap[selectedMainCategory.attachments_category_id] || []).map((sub) => (
                    <Chip
                      key={sub.id}
                      label={sub.attachments_subcategory_name}
                      onClick={() => handleSubCategoryToggle(sub.attachments_subcategory_name)}
                      variant={
                        selectedSubCategories[sub.attachments_subcategory_name] ? "filled" : "outlined"
                      }
                      color="secondary"
                      clickable
                    />
                  ))}
                </Box>

                <Grid container spacing={2}>
                  {Object.entries(selectedSubCategories)
                    .filter(([_, checked]) => checked)
                    .map(([subcatName]) => (
                      <Grid item xs={12} sm={6} md={4} key={subcatName}>
                        <Box
                          onClick={() => fileInputRef.current[subcatName]?.click()}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(subcatName);
                          }}
                          onDragLeave={() => setIsDragging(null)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(null);
                            handleFilesForSubcategory(subcatName, e.dataTransfer.files);
                          }}
                          sx={{
                            border: "2px dashed #90caf9",
                            borderRadius: "12px",
                            p: 3,
                            height: "230px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: isDragging === subcatName ? "#e3f2fd" : "#fff",
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "#f9f9f9",
                              boxShadow: "0px 0px 4px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          <input
                            ref={(el) => {
                              if (!fileInputRef.current) fileInputRef.current = {};
                              fileInputRef.current[subcatName] = el;
                            }}
                            type="file"
                            accept="application/pdf,image/jpeg,image/png"
                            hidden
                            onChange={(e) => {
                              handleFilesForSubcategory(subcatName, e.target.files);
                              e.target.value = null;
                            }}
                          />
                          <Typography fontWeight="bold" mb={1} sx={{ textTransform: "uppercase" }}>
                            {subcatName}
                          </Typography>
                          <CloudUploadIcon fontSize="large" sx={{ color: "#3f51b5" }} />
                          <Typography variant="body2" mt={1}>
                            Click or Drag JPEG, PNG, OR PDF
                          </Typography>

                          {mappedFiles[subcatName] && (
                            <Box mt={2} display="flex" alignItems="center" gap={1}>
                              {mappedFiles[subcatName].file.type === "application/pdf" ? (
                                <PictureAsPdfIcon color="error" fontSize="medium" />
                              ) : (
                                <Box
                                  component="img"
                                  src={mappedFiles[subcatName].preview}
                                  alt="preview"
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "6px",
                                    objectFit: "cover",
                                    border: "1px solid #ccc",
                                    cursor: "pointer",
                                    transition: "transform 0.2s ease-in-out",
                                    "&:hover": {
                                      transform: "scale(2)",
                                      zIndex: 10,
                                      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                    },
                                  }}
                                />
                              )}
                              <Box display="flex" alignItems="center" gap={0.5} maxWidth={130}>
                                <Tooltip title={mappedFiles[subcatName].file.name}>
                                  <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{ maxWidth: "100%" }}
                                  >
                                    {mappedFiles[subcatName].file.name}
                                  </Typography>
                                </Tooltip>
                                <IconButton size="small" onClick={(e) => deleteFile(e, subcatName)}>
                                  <HighlightOffIcon fontSize="small" color="error" />
                                </IconButton>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    ))}
                </Grid>
              </>
            ) : (
              <Typography>Select a main category to begin.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box mt={4} textAlign="right">
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            !selectedMainCategory ||
            Object.keys(mappedFiles).length === 0 ||
            Object.entries(selectedSubCategories).filter(([_, checked]) => checked).length !==
            Object.keys(mappedFiles).length
          }
        >
          {loading ? <CircularProgress size={25} color="primary" /> : "Upload Files"}
        </Button>
      </Box>
    </Paper>
  );
};

export default StudentDocumentUpload;
