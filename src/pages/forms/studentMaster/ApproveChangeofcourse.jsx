import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import axios from "../../../services/Api";
import { Button, Grid, Box, Typography, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import StudentDetails from "../../../components/StudentDetails";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import { validateDateTime } from "@mui/x-date-pickers/internals/hooks/validation/useDateTimeValidation";
import ModalWrapper from "../../../components/ModalWrapper";
import FeeTemplateView from "../../../components/FeeTemplateView";
import Visibility from "@mui/icons-material/Visibility";

const initialValues = {
  acYearId: "",
  schoolId: null,
  programId: "",
  specializationId: "",
  categoryId: "",
  subcategoryId: "",
  nationality: "",
  remarks: "",
  fileName: null,
  isNri: false,
  feetemplateId: "",
};

const styles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 40,
    maxWidth: "100%",
    margin: "40px 0",
  },
  tableBody: {
    height: 10,
  },
  bg: {
    backgroundColor: theme.palette.auzColor,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
  table: {
    "& .MuiTableCell-root": {
      minWidth: 100,
      border: "1px solid rgba(192,192,192,1)",
      fontSize: "15px",
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: "50px",
    },
  },
}));

const requiredFields = [];

function ApproveChangeofcourse() {
  const location = useLocation();

  const [values, setValues] = useState(initialValues);

  const [data, setData] = useState([]);
  const [dataOne, setDataOne] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState([]);
  const [programData, setProgramData] = useState([]);

  const [programId, setProgramId] = useState(null);
  const [programAssigmentId, setProgramAssignmentId] = useState(null);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [admCategoryOptions, setAdmCategoryOptions] = useState([]);
  const [nationality, setNationality] = useState([]);
  const [reportingData, setReportingData] = useState([]);
  const [feetemplateOptions, setFeeTemplateOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  const classes = styles();
  const { studentId, oldSpecializationId, oldStudentId } = useParams();
  const rowData = location.state?.row;
  const [templateWrapperOpen, setTemplateWrapperOpen] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getStudentDetails();
    getStudentDetailsOne();

    setCrumbs([
      { name: "Approve Change Of Course", link: "/ChangeOfCourseIndex" },
    ]);
  }, []);

  useEffect(() => {
    getAdmissionSubCategory();
    getFeeTemplates();
  }, [
    values.categoryId,
    values.subcategoryId,
    values.specializationId,
    values.categoryId,
  ]);

  useEffect(() => {
    getSchool();
    getAcademicYearData();
    getFeeAdmissionCategory();
    getNationality();
    getProgramData();
    getProgramSpeData();
    getReportingData();
  }, [values.schoolId]);

  const checks = {};

  const errorMessages = {};

  const getStudentDetails = async () => {
    await axios
      .get(`/api/student/studentDetailsForChangeOfCourse/${oldStudentId}`)
      .then((res) => {
        setDataOne(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getStudentDetailsOne = async () => {
    await axios
      .get(`/api/student/studentDetailsByStudentIds/${studentId}`)
      .then((res) => {
        setData(res.data.data);
        setValues((prev) => ({
          ...prev,
          acYearId: res.data.data[0].ac_year_id,
          schoolId: res.data.data[0].school_id,
          programId: res.data.data[0].program_id,
          program_assignment_id: res.data.data[0].program_assignment_id,
          specializationId: res.data.data[0].program_specialization_id,
          nationality: Number(res.data.data[0].nationality),
          categoryId: res.data.data[0].fee_admission_category_id,
        }));
        setProgramId(res.data.data[0].program_id);
      })
      .catch((err) => console.error(err));
  };

  const getAcademicYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramSpeData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const temp = res.data.data.filter(
            (obj) =>
              obj.program_specialization_id !== Number(oldSpecializationId)
          );

          setProgramSpeOptions(
            temp.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getFeeAdmissionCategory = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        setAdmCategoryOptions(
          res.data.data.map((obj) => ({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getAdmissionSubCategory = async () => {
    if (values.categoryId) {
      await axios
        .get(`/api/student/FetchFeeAdmissionSubCategory/${values.categoryId}`)
        .then((res) => {
          setSubCategoryOptions(
            res.data.data.map((obj) => ({
              value: obj.fee_admission_sub_category_id,
              label: obj.fee_admission_sub_category_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getSchool = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolData(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getReportingData = async () => {
    await axios
      .get(`/api/student/reportingStudentByStudentId/${studentId}`)
      .then((res) => {
        setReportingData(res.data.data);
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

  const getProgramData = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/academic/fetchAllProgramsWithProgramType/${values.schoolId}`)
        .then((res) => {
          setProgramData(
            res.data.data.map((obj) => ({
              value: obj.program_assignment_id,
              label: obj.program_name,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const getFeeTemplates = async () => {
    if (values.subcategoryId && values.categoryId && values.specializationId) {
      await axios
        .get(
          `/api/finance/FetchAllFeeTemplateDetails/${values.acYearId}/${values.schoolId}/${programId}/${values.specializationId}/${values.categoryId}/${values.subcategoryId}/${values.isNri}`
        )
        .then((res) => {
          setFeeTemplateOptions(
            res.data.data.map((obj) => ({
              value: obj.fee_template_id,
              label: obj.fee_template_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "specializationId") {
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === newValue) {
              setProgramAssignmentId(obj.program_assignment_id);
              setProgramId(obj.program_id);
            }
          });
        })
        .catch((err) => console.error(err));
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.newStudentId = Number(studentId);
      temp.oldStudentId = Number(oldStudentId);
      temp.acYearId = values.acYearId;
      temp.schoolId = values.schoolId;
      temp.programAssignmentId = values.program_assignment_id;
      temp.programId = values.programId;
      temp.programSpecializationId = values.specializationId;
      temp.feeAdmissionCategoryId = values.categoryId;
      // temp.subcategoryId = values?.subcategoryId;
      temp.feeTempalateId = values?.feetemplateId;
      temp.nationalityId = values?.nationality;
      // const ap = [{}];
      // const pgapp = {};
      // const rs = {};
      // const see = {};
      // const srsh = {};
      // const streq = {};
      // const sts = {};

      // const result = data.map(
      //   ({
      //     program_id,
      //     program_assignment_id,
      //     program_specialization_id,
      //     fee_admission_category_id,
      //     auid,

      //     fee_template_id,

      //     ...rest
      //   }) => ({
      //     ...rest,
      //   })
      // );

      // const obj = result[0];
      // const obj1 = {
      //   ...obj,
      //   course_approver_status: null,
      //   program_id: programId ? programId : data[0].program_id,
      //   program_assignment_id: programAssigmentId
      //     ? programAssigmentId
      //     : data[0].program_assignment_id,
      //   program_specialization_id: values.specializationId,
      //   fee_admission_category_id: values.categoryId,
      //   fee_template_id: values.feetemplateId,
      // };

      // temp.ap = ap;
      // temp.pgapp = pgapp;
      // temp.rs = rs;
      // temp.sd = obj1;
      // temp.see = see;
      // temp.srsh = srsh;
      // temp.streq = streq;
      // temp.sts = sts;

      await axios
        .put(`/api/student/approveChangeOfCourseProgramRequest`, temp)
        .then(async (res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Change of course is Approved",
          });
          setAlertOpen(true);
          navigate(`/ChangeOfCourseIndex`);
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
  const nationalityName = nationality.find(
    (f) => f.value === values.nationality
  );
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <Box>
        <Grid container rowSpacing={1}>
          <Grid item xs={12}>
            <ModalWrapper
              open={templateWrapperOpen}
              setOpen={setTemplateWrapperOpen}
              maxWidth={1200}
            >
              <Grid item xs={12} mt={3}>
                <FeeTemplateView
                  feeTemplateId={values.feetemplateId}
                  type={2}
                />
              </Grid>
            </ModalWrapper>
          </Grid>
          <>
            <Grid item xs={12}>
              <StudentDetails id={oldStudentId} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" className={classes.bg}>
                Change Course
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3}>
                <Grid
                  container
                  alignItems="center"
                  rowSpacing={1}
                  pl={2}
                  pr={2}
                  pb={1}
                  pt={1}
                >
                  {/* 1st  row  */}
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">Student Name</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {dataOne[0]?.studentName}
                    </Typography>
                  </Grid>
                  {/* 2nd row */}
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">School</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {dataOne[0]?.schoolNameShort}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">Ac Year</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {dataOne[0]?.acYear}
                    </Typography>
                  </Grid>
                  {/* 7th */}
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">
                      Program Specialization
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {dataOne[0]?.programSpecializationShortName +
                        "-" +
                        dataOne[0]?.programShortName}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </>
        </Grid>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
          marginTop={2}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="acYearId"
              value={values.acYearId}
              label="Ac Year"
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              value={values.schoolId}
              label="School"
              options={schoolData}
              handleChangeAdvance={handleChangeAdvance}
              disabled
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="specializationId"
              value={values.specializationId}
              label="Specialization"
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="nationality"
              value={values.nationality}
              label="Nationality"
              options={nationality}
              handleChangeAdvance={handleChangeAdvance}
              disabled
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="categoryId"
              value={values.categoryId}
              label="Admission Category"
              options={admCategoryOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="subcategoryId"
              value={values.subcategoryId}
              label="Admission Subcategory"
              options={subCategoryOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          {values.subcategoryId && nationalityName?.label === "Indian" ? (
            <Grid item xs={12} md={3}>
              <CustomRadioButtons
                name="isNri"
                label="Is NRI"
                value={values.isNri}
                items={[
                  {
                    value: true,
                    label: "Yes",
                  },
                  {
                    value: false,
                    label: "No",
                  },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>
          ) : (
            <></>
          )}
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="feetemplateId"
              value={values.feetemplateId}
              label="Fee Template"
              options={feetemplateOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          {values.feetemplateId ? (
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => setTemplateWrapperOpen(true)}
                >
                  View Fee Template
                </Button>
              </Typography>
            </Grid>
          ) : (
            <></>
          )}
          {/* Fee Template Wrapper  */}
          <Grid item xs={12} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={() => handleCreate()}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Approve"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
export default ApproveChangeofcourse;
