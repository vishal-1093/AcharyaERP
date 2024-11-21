import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import StudentFeeDetails from "../../../components/StudentFeeDetails";
import useAlert from "../../../hooks/useAlert";

const StudentDetails = lazy(() => import("../../../components/StudentDetails"));
const StudentTranscriptDetails = lazy(() =>
  import("../../../components/StudentTranscriptDetails")
);

const breadCrumbs = [
  { name: "Student Master", link: "/student-master" },
  { name: "Cancel Admission" },
];

const initialValues = { remarks: "", document: "" };

const requiredFields = ["remarks", "document"];

function CancelAdmissionForm() {
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { studentId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const maxLength = 100;

  const checks = {
    remarks: [values.remarks !== ""],
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    remarks: ["This field is required"],
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    setCrumbs(breadCrumbs);
    getStudentData();
  }, []);

  const getStudentData = async () => {
    try {
      const response = await axios.get(
        `/api/student/Student_DetailsAuid/${studentId}`
      );
      setStudentData(response.data.data[0]);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the student data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    if (e.target.value.length > maxLength) {
      return;
    }
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

  const getRemainingCharacters = (field) => maxLength - values[field].length;

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

  const handleCreate = async () => {
    try {
      setIsLoading(true);
      const postData = {
        auid: studentData.auid,
        student_name: studentData.student_name,
        remarks: values.remarks,
        hostel_remarks: values.remarks,
        active: true,
        school_id: studentData.school_id,
      };
      const response = await axios.post("/api/cancelAdmissions", postData);
      if (response.status === 200 || response.status === 201) {
        handleUploadDocument(response.data.data.cancel_id);
      } else {
        setAlertMessage({
          severity: "error",
          message: "Failed to initiate the cancellation of the admission !!",
        });
        setAlertOpen(true);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";
      setAlertMessage({
        severity: "error",
        message: errorMessage,
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocument = async (cancelId) => {
    const formData = new FormData();
    formData.append("multipartFile", values.document);
    formData.append("cancel_id", cancelId);
    const response = await axios.post(
      "/api/cancelAdmissionsUploadFile",
      formData
    );

    if (response.data.success) {
      setAlertMessage({
        severity: "success",
        message: "Admission cancellation initiated successfully !!",
      });
      setAlertOpen(true);
      navigate("/student-master");
    }
  };

  return (
    <Box
      sx={{
        margin: {
          xs: "20px 0px 0px 0px",
          md: "15px 15px 0px 15px",
          lg: "20px 80px 0px 80px",
        },
      }}
    >
      <FormPaperWrapper>
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item xs={12}>
            <StudentDetails id={studentId} />
          </Grid>

          <Grid item xs={12}>
            <StudentTranscriptDetails id={studentId} />
          </Grid>

          <Grid item xs={12}>
            <StudentFeeDetails id={studentId} />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
              helperText={`Remaining characters : ${getRemainingCharacters(
                "remarks"
              )}`}
              multiline
            />
          </Grid>

          <Grid item xs={12} md={6} align="center">
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

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={isLoading || !requiredFieldsValid()}
            >
              {isLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Initiate"
              )}
            </Button>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default CancelAdmissionForm;
