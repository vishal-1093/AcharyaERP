import React, { useEffect } from "react";
import { useState } from "react";
import {
  Grid,
  Paper,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Alert,
  styled,
} from "@mui/material";
import CustomSelect from "./Inputs/CustomSelect";
import axios from "../services/Api";
import CustomFileInput from "./Inputs/CustomFileInput";
import { useParams } from "react-router-dom";
import useAlert from "../hooks/useAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { checkFullAccess } from "../utils/DateTimeUtils";

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "column",
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  fontSize: "14px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
    color: "orange",
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
  [theme.breakpoints.up("xs")]: {
    fontSize: "11px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "14px",
  },
}));

const EmployeeDetailsViewDocuments = () => {
  const [values, setValues] = useState({
    showPersonal: true,
    showEmployment: false,
    showBreakup: false,
    personalDocuments: "",
    photo: "",
    fileName: "",
    educationalFileName: "",
    contractFileName: "",
    experienceDocument: "",
    experienceDocumentType: "PROFESSIONAL_EXPERIENCE",
    uploadMedicalFile: "",
    contractDocuments: "",
    graduationId: null,
  });
  const [docSubTab, setDocSubTab] = useState("personalProof");
  const handleDocSubTabChange = (event, newValue) => {
    setDocSubTab(newValue);
  };
  const [photo, setPhoto] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [graduationOptions, setGraduationOptions] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [allEducationalDocuments, setAllEducationalDocuments] = useState([]);
  const [allContractDocuments, setAllContractDocuments] = useState([]);
  const [allExperienceDocuments, setAllExperienceDocuments] = useState([]);
  const [medicalAttachmentPath, setMedicalAttachmentPath] = useState("");

  const { userId } = useParams();
  const empId = userId || sessionStorage.getItem("empId");
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getGraduationData();
    handleDownloadAllDocuments();
    getEducationalDocument();
    handleDownloadContractDocuments();
    handleDownloadExperienceDocuments();
    getEmployeeData();
    getPhoto();
  }, []);

  const checks = {
    photo: [
      values.photo,
      values.photo &&
        (values.photo.name.endsWith(".jpeg") ||
          values.photo.name.endsWith(".jpg")),
      values.photo && values.photo.size < 2000000,
    ],
    educationalFileName: [
      values.educationalFileName,
      values.educationalFileName &&
        values.educationalFileName.name.endsWith(".pdf"),
      values.educationalFileName && values.educationalFileName.size < 2000000,
    ],
    medicalFile: [
      values.medicalFile !== "",
      values.medicalFile && values.medicalFile.name.endsWith(".pdf"),
      values.medicalFile && values.medicalFile.size < 2000000,
    ],
    experienceDocument: [
      values.experienceDocument !== "",
      values.experienceDocument &&
        values.experienceDocument.name.endsWith(".pdf"),
      values.experienceDocument && values.experienceDocument.size < 2000000,
    ],
    contractFileName: [
      values.contractFileName !== "",
      values.contractFileName && values.contractFileName.size < 2000000,
    ],
  };

  const errorMessages = {
    photo: [
      "This field is required",
      "Please upload a JPG or JPEG",
      "Maximum size 2 MB",
    ],
    educationalFileName: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
    medicalFile: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
    experienceDocument: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],

    contractFileName: ["This field is required", "Maximum size 2 MB"],
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

  const getPhoto = async () => {
    setModalOpen(true);
    await axios
      .get(`/api/employee/EmployeeDetails/${empId}`)
      .then(async (res) => {
        setImagePath(res.data.data[0].emp_image_attachment_path);
        if (res.data.data[0].emp_image_attachment_path)
          await axios
            .get(
              `/api/employee/employeeDetailsFileDownload?fileName=${res.data.data[0].emp_image_attachment_path}`,
              {
                responseType: "blob",
              }
            )
            .then((res) => {
              setPhoto(URL.createObjectURL(res.data));
            })
            .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const getEmployeeData = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails/${empId}`)
      .then((res) => {
        setMedicalAttachmentPath(res.data.data[0].emp_attachment_file_name2);
      })
      .catch((err) => console.error(err));
  };

  const getEducationalDocument = async () => {
    await axios
      .get(`/api/employee/getEducationDocsAttachmentById/${empId}`)
      .then((res) => {
        setAllEducationalDocuments(res.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownloadAllDocuments = async () => {
    await axios
      .get(`/api/employee/getEmployeeIDsAttachmentById/${empId}`)
      .then((res) => {
        setAllDocuments(res.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownloadContractDocuments = async () => {
    await axios
      .get(`/api/employee/getEmployeeContractssAttachmentById/${empId}`)
      .then((res) => {
        const temp = [];
        res.data.filter((obj) => {
          if (obj.documentType !== values.experienceDocumentType) {
            temp.push(obj);
          }
        });
        setAllContractDocuments(temp);
      })
      .catch((err) => console.error(err));
  };

  const handleDownloadExperienceDocuments = async () => {
    await axios
      .get(`/api/employee/getEmployeeWorkExperienceFileById/${empId}`)
      .then((res) => {
        setAllExperienceDocuments(res.data);
      })
      .catch((err) => console.error(err));
  };

  const downloadPersonalDocuments = async (obj) => {
    if (
      obj.filePath.endsWith(".jpg") ||
      obj.filePath.endsWith(".PNG") ||
      obj.filePath.endsWith(".png") ||
      obj.filePath.endsWith(".JPG")
    ) {
      await axios
        .get(
          `/api/employee/employeeDetailsFileDownload?fileName=${obj.filePath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.jpg");
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/employee/employeeDetailsFileDownload?fileName=${obj.filePath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          window.open(url);
        })
        .catch((err) => console.error(err));
    }
  };

  const downloadEducationalDocuments = async (obj) => {
    if (obj.attachment_path.endsWith(".jpg")) {
      await axios
        .get(
          `/api/employee/fileDownloadOfEducationDetailsAttachment?attachment_path=${obj.attachment_path}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.jpg");
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/employee/fileDownloadOfEducationDetailsAttachment?attachment_path=${obj.attachment_path}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          window.open(url);
        })
        .catch((err) => console.error(err));
    }
  };

  const downloadContractDocuments = async (obj) => {
    if (
      obj.filePath.endsWith(".jpg") ||
      obj.filePath.endsWith(".JPG") ||
      obj.filePath.endsWith(".png") ||
      obj.filePath.endsWith(".PNG")
    ) {
      await axios
        .get(
          `/api/employee/employeeDetailsFileDownload?fileName=${obj.filePath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.jpg");
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/employee/employeeDetailsFileDownload?fileName=${obj.filePath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          window.open(url);
        })
        .catch((err) => console.error(err));
    }
  };

  const getMedicalDocument = async () => {
    if (medicalAttachmentPath.endsWith(".jpg")) {
      await axios
        .get(
          `/api/employee/employeeDetailsFileview?fileName=${medicalAttachmentPath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const file = new Blob([res.data], { type: "application/pdf" });
          const url = URL.createObjectURL(file);
          window.open(url);
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/employee/employeeDetailsFileview?fileName=${medicalAttachmentPath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const file = new Blob([res.data], { type: "application/pdf" });
          const url = URL.createObjectURL(file);
          window.open(url);
        })
        .catch((err) => console.error(err));
    }
  };

  const downloadExperienceDocuments = async (obj) => {
    if (obj.filePath.endsWith(".jpg")) {
      await axios
        .get(
          `/api/employee/employeeDetailsFileDownload?fileName=${obj.filePath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.jpg");
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/employee/employeeDetailsFileDownload?fileName=${obj.filePath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          window.open(url);
        })
        .catch((err) => console.error(err));
    }
  };

  const getGraduationData = async () => {
    await axios
      .get(`/api/employee/graduation`)
      .then((res) => {
        setGraduationOptions(
          res.data.data.map((obj) => ({
            value: obj.graduation_id,
            label: obj.graduation_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const uploadPhoto = async (id) => {
    const dataArray = new FormData();

    dataArray.append("empId", empId);
    dataArray.append("image_file1", values.photo);
    setLoading(true);
    return await axios
      .post(`/api/employee/uploadImageFile`, dataArray)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Photo Uploaded" });
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
        }
        setAlertOpen(true);
        setLoading(false);
        setValues([]);
        getPhoto();
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: "Some thing went wrong !! unable to  uploaded the documents",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const handleUploadDocuments = async (id) => {
    const dataArray = new FormData();

    dataArray.append("document", values.fileName);
    dataArray.append("documentType", values.personalDocuments);
    dataArray.append("empId", empId);

    setLoading(true);
    return await axios
      .post(`/api/employee/uploadEmployeeIDsAttachment`, dataArray)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Documents Uploaded",
          });
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
        }
        setAlertOpen(true);
        setLoading(false);
        setValues([]);
        handleDownloadAllDocuments();
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: "Some thing went wrong !! unable to  uploaded the documents",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const handleUploadEducationalDocument = async (id) => {
    const dataArray = new FormData();

    dataArray.append("document", values.educationalFileName);
    dataArray.append("graduationId", values.graduationId);
    dataArray.append("empId", empId);

    setLoading(true);
    return await axios
      .post(`/api/employee/uploadEducationDetailsAttachment`, dataArray)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Educational Document Uploaded",
          });
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
        }
        setAlertOpen(true);
        setLoading(false);
        setValues([]);
        getEducationalDocument();
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: "Some thing went wrong !! unable to  uploaded the documents",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const handleContractDocuments = async (id) => {
    const dataArray = new FormData();

    dataArray.append("document", values.contractFileName);
    dataArray.append("documentType", values.contractDocuments);
    dataArray.append("empId", empId);

    setLoading(true);
    return await axios
      .post(`/api/employee/uploadEmployeeContractsAttachment`, dataArray)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Contract Documents Uploaded",
          });
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
        }
        setAlertOpen(true);
        setLoading(false);
        setValues([]);
        handleDownloadContractDocuments();
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: "Some thing went wrong !! unable to  uploaded the documents",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const uploadMedicalFile = async (id) => {
    const dataArray = new FormData();
    dataArray.append("file2", values.medicalFile);
    dataArray.append("emp_id", empId);

    setLoading(true);
    return await axios
      .post(`/api/employee/employeeDetailsUploadFile2`, dataArray)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Medical Documents Uploaded",
          });
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
        }
        setAlertOpen(true);
        setLoading(false);
        setValues([]);
        getEmployeeData();
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: "Some thing went wrong !! unable to  uploaded the documents",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const handleUploadExperienceDocument = async (id) => {
    const dataArray = new FormData();

    dataArray.append("document", values.experienceDocument);
    dataArray.append("documentType", values.experienceDocumentType);
    dataArray.append("empId", empId);

    setLoading(true);
    return await axios
      .post(`/api/employee/uploadEmployeeContractsAttachment`, dataArray)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Experience Document Uploaded",
          });
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
        }
        setAlertOpen(true);
        setLoading(false);
        setValues([]);
        handleDownloadExperienceDocuments();
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: "Some thing went wrong !! unable to  uploaded the documents",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  return (
    <>
      <Grid container spacing={2} columnSpacing={4} sx={{ marginTop: "1px" }}>
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={docSubTab}
            onChange={handleDocSubTabChange}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="personalProof" label="Personal Proof" />
            <CustomTab value="educational" label="Educational Documents" />
            <CustomTab value="experience" label="Experience Documents" />
            <CustomTab value="contracts" label="Contract Documents" />
            <CustomTab value="medicaldocument" label="Medical Document" />
            <CustomTab value="photoupload" label="photo" />
            <CustomTab value="medicaldetails" label="Medical Details" />
          </CustomTabs>
        </Grid>
        <Grid item xs={8} md={10}>
          {docSubTab === "personalProof" && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    p: 1,
                  }}
                >
                  Personal Documents
                </Typography>
              </Grid>

              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                rowSpacing={2}
                columnSpacing={2}
              >
                <Grid item xs={12} sx={{ mt: 4 }}>
                  <CustomSelect
                    name="personalDocuments"
                    label="Id Proof"
                    value={values.personalDocuments}
                    items={[
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

                      { value: "RESUME", label: "RESUME" },
                      {
                        value: "OTHERS",
                        label: "OTHERS",
                      },
                    ]}
                    handleChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 4 }}>
                  <CustomFileInput
                    name="fileName"
                    label="File"
                    helperText="PDF / JPG / PNG"
                    file={values.fileName}
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                    checks={checks.fileName}
                    errors={errorMessages.fileName}
                  />
                </Grid>
                <Grid item xs={12} mt={1}>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 2, marginLeft: 20 }}
                    onClick={handleUploadDocuments}
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

                <Grid item xs={12} elevation={3} p={2} marginTop={1}>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Uploaded Documents
                    </Typography>
                  </Grid>
                  <Grid container component={Paper}>
                    {allDocuments.length > 0 ? (
                      allDocuments.map((obj, i) => {
                        return (
                          <Grid item xs={12} md={4} mt={1} key={i}>
                            <IconButton
                              onClick={() => downloadPersonalDocuments(obj)}
                            >
                              <VisibilityIcon />
                              <Typography sx={{ marginLeft: 1 }}>
                                {obj.documentType}
                              </Typography>
                            </IconButton>
                          </Grid>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}

          {docSubTab === "experience" && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    p: 1,
                  }}
                >
                  Experience Documents
                </Typography>
              </Grid>

              <Grid
                container
                justifyContent="center"
                alignItems="center"
                rowSpacing={2}
                columnSpacing={2}
              >
                <Grid item xs={12} md={4} sx={{ mt: 4 }}>
                  <CustomFileInput
                    name="experienceDocument"
                    label="File"
                    helperText="PDF - smaller than 2 MB"
                    file={values.experienceDocument}
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                    checks={checks.experienceDocument}
                    errors={errorMessages.experienceDocument}
                  />
                </Grid>
                <Grid item xs={12} mt={1}>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 2, marginLeft: 62 }}
                    onClick={handleUploadExperienceDocument}
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

                <Grid item xs={12} elevation={3} p={2} marginTop={1}>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Uploaded Documents
                    </Typography>
                  </Grid>
                  <Grid container component={Paper}>
                    {allExperienceDocuments.length > 0 ? (
                      allExperienceDocuments.map((obj, i) => {
                        return (
                          <Grid item xs={12} md={4} mt={1} key={i}>
                            <IconButton
                              onClick={() => downloadExperienceDocuments(obj)}
                            >
                              <VisibilityIcon />
                              <Typography sx={{ marginLeft: 1 }}>
                                {obj.documentType}
                              </Typography>
                            </IconButton>
                          </Grid>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            {docSubTab === "educational" && (
              <>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      backgroundColor: "rgba(74, 87, 169, 0.1)",
                      color: "#46464E",
                      p: 1,
                    }}
                  >
                    Educational Documents
                  </Typography>
                </Grid>

                <Grid
                  container
                  justifyContent="flex-start"
                  alignItems="center"
                  rowSpacing={2}
                  columnSpacing={2}
                >
                  <Grid item xs={12} md={4} sx={{ mt: 4 }}>
                    <CustomSelect
                      name="graduationId"
                      label="Graduation"
                      value={values.graduationId}
                      items={graduationOptions}
                      handleChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={4} sx={{ mt: 4 }}>
                    <CustomFileInput
                      name="educationalFileName"
                      label="File"
                      helperText="PDF - smaller than 2 MB"
                      file={values.educationalFileName}
                      handleFileDrop={handleFileDrop}
                      handleFileRemove={handleFileRemove}
                      checks={checks.educationalFileName}
                      errors={errorMessages.educationalFileName}
                    />
                  </Grid>
                  <Grid item xs={12} mt={1}>
                    <Button
                      variant="contained"
                      sx={{ borderRadius: 2, marginLeft: 64 }}
                      onClick={handleUploadEducationalDocument}
                      disabled={
                        !values?.educationalFileName?.name?.endsWith(".pdf") ||
                        values?.educationalFileName?.size > 2000000
                      }
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
                  <Grid item xs={12} elevation={3} p={2} marginTop={1}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          backgroundColor: "rgba(74, 87, 169, 0.1)",
                          color: "#46464E",
                          p: 1,
                        }}
                      >
                        Uploaded Documents
                      </Typography>
                    </Grid>
                    <Grid container component={Paper}>
                      {allEducationalDocuments.length > 0 ? (
                        allEducationalDocuments.map((obj, i) => {
                          return (
                            <Grid item xs={12} md={4} mt={1} key={i}>
                              <IconButton
                                onClick={() =>
                                  downloadEducationalDocuments(obj)
                                }
                              >
                                <VisibilityIcon />
                                <Typography sx={{ marginLeft: 1 }}>
                                  {obj.graduationName}
                                </Typography>
                              </IconButton>
                            </Grid>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>

          <Grid item xs={12}>
            {docSubTab === "medicaldocument" && (
              <>
                <Grid item xs={12} elevation={3} p={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Medical Documents
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <CustomFileInput
                      name="medicalFile"
                      label="File For Medical Examination Report"
                      helperText="PDF - smaller than 2 MB"
                      file={values.medicalFile}
                      handleFileDrop={handleFileDrop}
                      handleFileRemove={handleFileRemove}
                      checks={checks.medicalFile}
                      errors={errorMessages.medicalFile}
                    />
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <Button
                      variant="contained"
                      sx={{ borderRadius: 2, marginLeft: 60 }}
                      onClick={uploadMedicalFile}
                      disabled={
                        !values?.medicalFile?.name?.endsWith(".pdf") ||
                        values?.medicalFile?.size > 2000000
                      }
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

                <Grid item xs={12} elevation={3} p={2} marginTop={1}>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Uploaded Document
                    </Typography>
                  </Grid>
                  <Grid container height={50} component={Paper}>
                    <Grid item xs={12} md={4} mt={1}>
                      {medicalAttachmentPath !== null ? (
                        <IconButton onClick={getMedicalDocument}>
                          <VisibilityIcon />
                          <Typography sx={{ marginLeft: 1 }}>
                            Medical document
                          </Typography>
                        </IconButton>
                      ) : (
                        <></>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            <Grid item xs={10}>
              {docSubTab === "photoupload" && (
                <>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Photo Upload
                    </Typography>
                  </Grid>

                  <Card sx={{ display: "flex" }}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <CardContent sx={{ flex: "1 0 auto" }}>
                        <Grid
                          container
                          justifyContent="flex-start"
                          alignItems="center"
                          rowSpacing={2}
                          columnSpacing={2}
                        >
                          <Grid item xs={12} md={12} sx={{ mt: 4 }}>
                            <CustomFileInput
                              name="photo"
                              label="Photo"
                              helperText="JPG - smaller than 2 MB"
                              file={values.photo}
                              handleFileDrop={handleFileDrop}
                              handleFileRemove={handleFileRemove}
                              checks={checks.photo}
                              errors={errorMessages.photo}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          pl: 1,
                          pb: 1,
                        }}
                      >
                        <Grid item xs={12} md={12} mt={1}>
                          <Button
                            variant="contained"
                            sx={{ borderRadius: 2, marginLeft: 20 }}
                            onClick={uploadPhoto}
                            disabled={
                              values?.photo?.name?.endsWith(".pdf") ||
                              values?.photo?.size > 2000000
                            }
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
                      </Box>
                    </Box>

                    <Grid item xs={6} align="right" mt={2}>
                      {imagePath !== null ? (
                        <CardMedia
                          component="img"
                          sx={{ width: 200, marginRight: 10 }}
                          image={photo}
                          alt=""
                        />
                      ) : (
                        <></>
                      )}
                    </Grid>
                  </Card>
                </>
              )}
            </Grid>

            {docSubTab === "contracts" && (
              <>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      backgroundColor: "rgba(74, 87, 169, 0.1)",
                      color: "#46464E",
                      p: 1,
                    }}
                  >
                    Contract Documents
                  </Typography>
                </Grid>

                <Grid
                  container
                  justifyContent="flex-start"
                  alignItems="center"
                  rowSpacing={2}
                  columnSpacing={2}
                >
                  <Grid item xs={12} md={4} sx={{ mt: 4 }}>
                    <CustomSelect
                      name="contractDocuments"
                      label="Contract Documents"
                      value={values.contractDocuments}
                      items={[
                        {
                          value: "EMPLOYMENT_CONTRACT",
                          label: "EMPLOYMENT CONTRACT",
                        },
                        {
                          value: "EMPLOYMENT_OFFER",
                          label: "EMPLOYMENT OFFER",
                        },
                        {
                          value: "NDA_NCA",
                          label: "NDA NCA",
                        },
                        {
                          value: "DECLARATION",
                          label: "DECLARATION",
                        },
                        {
                          value: "OTHERS",
                          label: "OTHERS",
                        },
                      ]}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ mt: 4 }}>
                    <CustomFileInput
                      name="contractFileName"
                      label="File"
                      helperText="PDF / JPG / PNG - smaller than 2 MB"
                      file={values.contractFileName}
                      handleFileDrop={handleFileDrop}
                      handleFileRemove={handleFileRemove}
                      checks={checks.contractFileName}
                      errors={errorMessages.contractFileName}
                    />
                  </Grid>
                  <Grid item xs={12} mt={1}>
                    <Button
                      variant="contained"
                      sx={{ borderRadius: 2, marginLeft: 60 }}
                      onClick={handleContractDocuments}
                      disabled={values?.contractFileName?.size > 2000000}
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

                  <Grid item xs={12} elevation={3} p={2} marginTop={1}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          backgroundColor: "rgba(74, 87, 169, 0.1)",
                          color: "#46464E",
                          p: 1,
                        }}
                      >
                        Uploaded Documents
                      </Typography>
                    </Grid>
                    <Grid container component={Paper}>
                      {allContractDocuments.length > 0 &&
                        checkFullAccess(empId) &&
                        allContractDocuments.map((obj, i) => {
                          return (
                            <Grid item xs={12} md={4} mt={1} key={i}>
                              <IconButton
                                onClick={() => downloadContractDocuments(obj)}
                              >
                                <VisibilityIcon />
                                <Typography sx={{ marginLeft: 1 }}>
                                  {obj.documentType}
                                </Typography>
                              </IconButton>
                            </Grid>
                          );
                        })}
                      {!checkFullAccess(empId) && (
                        <Grid item xs={12} md={12}>
                          <Alert severity="error">
                            You do not have permission!
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeDetailsViewDocuments;
