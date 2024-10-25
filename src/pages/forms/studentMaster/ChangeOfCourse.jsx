import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StudentDetails from "../../../components/StudentDetails";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import DOCView from "../../../components/DOCView";
import Visibility from "@mui/icons-material/Visibility";
import ModalWrapper from "../../../components/ModalWrapper";

const initialValues = {
  acYearId: "",
  changeOfCourseUploadFile: "",
  schoolId: "",
  programSpeId: "",
  admissionCategory: "",
  // nationality: "",
  remarks: "",
};

const requiredFields = [
  "acYearId",
  "schoolId",
  "programSpeId",
  "admissionCategory",
  // "nationality",
  "changeOfCourseUploadFile",
  "remarks",
];
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function ChangeOfCourse() {
  const navigate = useNavigate();
  const location = useLocation();
  const [templateWrapperOpen, setTemplateWrapperOpen] = useState(false);
  const { cocPaidData, cocDetails } = location?.state;
  const [values, setValues] = useState(initialValues);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [studentData, setStudentData] = useState({});
  
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [admissionCategoryOptions, setAdmissionCategoryOptions] = useState([]);
  const [nationality, setNationality] = useState([]);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentWrapperOpen, setDocumentWrapperOpen] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [attachmentPath, setAttachmentPath] = useState("");

  const setCrumbs = useBreadcrumbs();
  const { studentId } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const checks = {
    cocPaper: [
      values.changeOfCourseUploadFile,
      values.changeOfCourseUploadFile &&
        values.changeOfCourseUploadFile.name.endsWith(".pdf"),
      values.changeOfCourseUploadFile &&
        values.changeOfCourseUploadFile.size < 2000000,
    ],
  };
  const cocMessages = {
    cocPaper: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };
  useEffect(() => {
    // Setting the breadcrumbs
    setCrumbs([
      { name: "Student Master", link: "/student-master" },
      { name: "Change of course" },
    ]);

    // Checking if cocDetails is available before setting values
    if (cocDetails) {
      setValues((prev) => ({
        ...prev,
        acYearId: cocDetails.acYearId,
        schoolId: cocDetails.schoolId,
        programSpeId: cocDetails.programSpecializationId,
        admissionCategory: cocDetails.feeAdmissionCategory_id,
        // nationality: cocDetails.nationalityId,
        remarks: cocDetails?.remarks,
      }));
    }

    // Fetch required data
    getStudentData();
    getSchoolDetails();
    getAdmissionCategory();
    getNationality();
  }, [cocDetails]);

  useEffect(() => {
    getProgramSpeData();
  }, [values.schoolId]);

  const getStudentData = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const optionData = [];
      response.data.data.forEach((obj) => {
        optionData.push({
          value: obj.ac_year_id,
          label: obj.ac_year,
        });
      });
      setAcyearOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "An error occurred while fetching the academic years.",
      });
      setAlertOpen(true);
    }
  };
  const getSchoolDetails = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      const optionData = res.data.data.map((obj) => ({
        value: obj.school_id,
        label: obj.school_name,
        school_name_short: obj.school_name_short,
      }));
      setSchoolOptions(optionData);
    } catch (err) {
      console.error(err);
    }
  };
  const getProgramSpeData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
              program_assignment_id: obj?.program_assignment_id,
              program_id: obj?.program_id,
            }))
          );
        })
        .catch((err) => console.error(err));
  };
  const getAdmissionCategory = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        setAdmissionCategoryOptions(
          res.data.data.map((obj) => ({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getNationality = async () => {
    await axios(`/api/nationality`)
      .then((res) => {
        setNationality(
          res.data.map((obj) => ({
            value: obj.nationality_id,
            label: obj.nationality,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = async (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
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

  // const handleCreate = async () => {
  //   if (values.changeOfCourseUploadFile !== "") {
  //     const documentData = new FormData();
  //     documentData.append("file", values.changeOfCourseUploadFile);
  //     documentData.append("newStudentId", studentId);
  //     setDocumentLoading(true);
  //     await axios
  //       .post(`/api/student/uploadFileForCandidateAttachment`, documentData)
  //       .then((res) => {
  //         setAlertMessage({
  //           severity: "success",
  //           message: "Document uploded successfully !!",
  //         });
  //         setAlertOpen(true);
  //       })
  //       .catch((err) => console.error(err));
  //   }
  // };
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
  const handleCreateConfrences = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const programData = programSpeOptions?.find(
        (obj) => obj?.value == values.programSpeId
      );
      const temp = {};
      temp.oldStudentId = Number(studentId);
      temp.acYearId = values.acYearId;
      temp.schoolId = values.schoolId;
      temp.programId = programData.program_id;
      temp.programAssignmentId = programData.program_assignment_id;
      temp.programSpecializationId = values.programSpeId;
      temp.feeAdmissionCategoryId = values.admissionCategory;
      temp.nationalityId = Number(studentData?.nationality);
      setLoading(true);
      await axios
        .post(`/api/student/changeOfCourseProgram`, temp)
        .then(async (res) => {
          if (res.status === 200 || res.status === 201) {
            const documentData = new FormData();
            documentData.append("file", values?.changeOfCourseUploadFile);
            documentData.append("newStudentId", res?.data?.data?.student_id);
            documentData.append("remarks", values?.remarks);
            documentData.append("amount", cocPaidData?.cocPaidAmount ?? 0);
            setDocumentLoading(true);
            await axios
              .post(
                `/api/student/changeOfCourseProgramUploadFile`,
                documentData
              )
              .then((res) => {
                setLoading(false);
                setAlertMessage({
                  severity: "success",
                  message: "Change of course is Initiated",
                });
                setAlertOpen(true);
                navigate("/student-master", { replace: true });
              })
              .catch((err) => {
                setLoading(false);
                setAlertMessage({
                  severity: "error",
                  message: err.response ? err.response.data.message : "Error",
                });
                setAlertOpen(true);
              });
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };
  return (
    <>
      <ModalWrapper
        open={templateWrapperOpen}
        setOpen={setTemplateWrapperOpen}
        maxWidth={1200}
      >
        <>
          <DOCView
            attachmentPath={`/api/student/changeOfCourseProgramFileDownload?changeOfCourseProgramAttachmentPath=${cocDetails?.changeOfCourseProgramAttachmentPath}`}
          />
        </>
      </ModalWrapper>
      <Box
        sx={{
          margin: { md: "20px 60px", xs: "10px" },
          padding: { xs: "10px", md: "20px" },
        }}
      >
        <Grid container spacing={4}>
          {/* Student Details */}
          <Grid item xs={12}>
            <StudentDetails
              id={studentId}
              isStudentdataAvailable={(data) => {
                setStudentData(data);
                setValues((prev) => ({
                  ...prev,
                  acYearId: data?.ac_year_id || prev.acYearId,
                  schoolId: data?.school_id || prev.schoolId,
                }));
              }}
            />
          </Grid>

          {/* Academic Year */}
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="acYearId"
              value={values.acYearId}
              label="Ac Year"
              options={acyearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
              disabled={roleShortName !== "SAA" || cocDetails}
            />
          </Grid>

          {/* School */}
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
              disabled={roleShortName !== "SAA" || cocDetails}
            />
          </Grid>

          {/* Program Major */}
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
              disabled={cocDetails}
            />
          </Grid>

          {/* Admission Category */}
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="admissionCategory"
              label="Admission Category"
              value={values.admissionCategory}
              options={admissionCategoryOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
              disabled={cocDetails}
            />
          </Grid>

          {/* Nationality */}
          {/* <Grid item xs={12} md={4}>
            <CustomAutocomplete
              label="Nationality"
              name="nationality"
              value={values.nationality}
              options={nationality}
              handleChangeAdvance={handleChangeAdvance}
              required
              disabled={cocDetails}
            />
          </Grid> */}

          {/* Remarks */}
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              multiline
              rows={2}
              required
              disabled={cocDetails}
            />
          </Grid>

          {/* File Upload */}
          {!cocDetails && (
            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="changeOfCourseUploadFile"
                label="Change Of Course Upload File"
                helperText="PDF - smaller than 2 MB"
                file={values.changeOfCourseUploadFile}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.cocPaper}
                errors={cocMessages.cocPaper}
                required
                disabled={cocDetails}
              />
            </Grid>
          )}
          {cocDetails ? (
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => setTemplateWrapperOpen(true)}
                >
                  View Attachment
                </Button>
              </Typography>
            </Grid>
          ) : (
            <></>
          )}
          {/* Submit Button */}
          <Grid item xs={12} textAlign="right" sx={{ marginTop: 3 }}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleCreateConfrences}
              disabled={cocDetails}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Create"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ChangeOfCourse;
