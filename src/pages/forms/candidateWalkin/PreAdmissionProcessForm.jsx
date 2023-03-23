import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  Paper,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import occupationList from "../../../utils/OccupationList";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import ModalWrapper from "../../../components/ModalWrapper";
import FeeTemplateView from "../../../components/FeeTemplateView";
import { makeStyles } from "@mui/styles";
import CustomModal from "../../../components/CustomModal";

const initialValues = {
  studentName: "",
  acyearId: "",
  schoolId: "",
  programId: "",
  specializationId: "",
  admissionCategory: "",
  admissionSubCategory: "",
  feetemplateId: "",
  isScholarship: "false",
  isHostel: "false",
  residency: "",
  reason: "",
  past: "",
  scholarship: "",
  scholarshipYes: "",
  exemptionType: "",
  income: "",
  occupation: "",
  document: "",
  scholarshipData: {},
};

const requiredFields = [
  "studentName",
  "acyearId",
  "schoolId",
  "programId",
  "specializationId",
  "admissionCategory",
  "admissionSubCategory",
  "feetemplateId",
  "isScholarship",
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function PreAdmissionProcessForm() {
  const [values, setValues] = useState(initialValues);
  const [candidateData, setCandidateData] = useState();
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [admissionCategoryOptions, setAdmissionCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [feeTemplateOptions, setFeeTemplateOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [feeTemplateData, setFeeTemplateData] = useState({});
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [noOfYears, setNoOfYears] = useState();
  const [yearwiseSubAmount, setYearwiseSubAmount] = useState([]);
  const [scholarshipTotal, setScholarshipTotal] = useState();
  const [loading, setLoading] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    studentName: [values.studentName !== ""],
    acyearId: [values.acyearId !== ""],
    schoolId: [values.schoolId !== ""],
    programId: [values.programId !== ""],
    specializationId: [values.specializationId !== ""],
    admissionCategory: [values.admissionCategory !== ""],
    admissionSubCategory: [values.admissionSubCategory !== ""],
    feetemplateId: [values.feetemplateId !== ""],
    isScholarship: [values.isScholarship !== ""],
    scholarshipYes: [values.scholarshipYes !== ""],
    income: [values.income !== "", /^[0-9.]*$/.test(values.income)],
    occupation: [values.occupation !== ""],
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    studentName: ["This field required"],
    acyearId: ["This field required"],
    schoolId: ["This field required"],
    programId: ["This field required"],
    specializationId: ["This field required"],
    admissionCategory: ["This field required"],
    admissionSubCategory: ["This field required"],
    feetemplateId: ["This field required"],
    isScholarship: ["This field required"],
    scholarshipYes: ["This field required"],
    income: ["This field required", "Enter valid income"],
    occupation: ["This field required"],
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getCandidateData();
    getAcyear();
    getSchoolOptions();
    getAdmissionCategory();
    getFeeexcemptions();
  }, [pathname]);

  useEffect(() => {
    getPrograms();
    getProgramSpecialization();
    getAdmissionSubCategory();
    getFeeTemplates();
    getFeeTemplateData();
  }, [
    values.acyearId,
    values.schoolId,
    values.programId,
    values.specializationId,
    values.feetemplateId,
    values.admissionCategory,
    values.admissionSubCategory,
  ]);

  useEffect(() => {
    if (Object.values(values.scholarshipData).length > 0) {
      setScholarshipTotal(
        Object.values(values.scholarshipData).reduce((a, b) => {
          const x = Number(a) > 0 ? Number(a) : 0;
          const y = Number(b) > 0 ? Number(b) : 0;
          return x + y;
        })
      );
    }
  }, [values.scholarshipData]);

  const getCandidateData = async () => {
    await axios
      .get(`/api/student/Candidate_Walkin/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Candidate Walkin", link: "/CandidateWalkinIndex" },
          {
            name: res.data.data.candidate_name,
          },
          {
            name: "Offer Creation",
          },
        ]);

        setValues((prev) => ({
          ...prev,
          studentName: res.data.data.candidate_name,
          acyearId: res.data.data.ac_year_id,
          schoolId: res.data.data.school_id,
          programId: res.data.data.program_id,
          specializationId: res.data.data.program_specilaization_id,
        }));
        setCandidateData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getAcyear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcyearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
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

  const getAdmissionSubCategory = async () => {
    if (values.admissionCategory) {
      await axios
        .get(
          `/api/student/FetchFeeAdmissionSubCategory/${values.admissionCategory}`
        )
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

  const getFeeexcemptions = async () => {
    await axios
      .get(`/api/categoryTypeDetails`)
      .then((res) => {
        setReasonOptions(
          res.data.data.map((obj) => ({
            value: obj.category_type_id,
            label: obj.category_detail,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getPrograms = async () => {
    if (values.schoolId) {
      await axios
        .get(
          `/api/academic/fetchProgram1/${values.acyearId}/${values.schoolId}`
        )
        .then((res) => {
          setProgramOptions(
            res.data.data.map((obj) => ({
              value: obj.program_id,
              label: obj.program_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getProgramSpecialization = async () => {
    if (values.programId) {
      await axios
        .get(
          `/api/academic/FetchProgramSpecialization/${values.schoolId}/${values.programId}`
        )
        .then((res) => {
          setSpecializationOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.program_specialization_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getFeeTemplates = async () => {
    if (values.admissionSubCategory) {
      await axios
        .get(
          `/api/finance/FetchAllFeeTemplateDetails/${values.acyearId}/${values.schoolId}/${values.programId}/${values.specializationId}/${values.admissionCategory}/${values.admissionSubCategory}`
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

  const getFeeTemplateData = async () => {
    if (values.feetemplateId) {
      // fetching feeTemplateSubAmount
      const feeTemplateSubAmount = await axios
        .get(
          `/api/finance/FetchFeeTemplateSubAmountDetail/${values.feetemplateId}`
        )
        .then((res) => {
          setFeeTemplateSubAmountData(res.data.data);
          return res.data.data;
        })
        .catch((err) => console.error(err));

      // fetching feeTemplateData
      const feetemplateData = await axios
        .get(`/api/finance/FetchAllFeeTemplateDetail/${values.feetemplateId}`)
        .then((res) => {
          setFeeTemplateData(res.data.data[0]);
          return res.data.data[0];
        })
        .catch((err) => console.error(err));

      // for fetching program is yearly or semester

      const programDetails = await axios
        .get(
          `/api/academic/FetchAcademicProgram/${feetemplateData.ac_year_id}/${feetemplateData.program_id}/${feetemplateData.school_id}`
        )
        .then((res) => {
          return res.data.data[0];
        })
        .catch((err) => console.error(err));

      const yearSem = []; //in this array pushing the no of year or sem of the particular program
      const yearValue = {}; // creating an object for  maintaining the state of year or semwise values scholarship Data
      const tempSubAmount = {};

      if (feetemplateData.program_type_name.toLowerCase() === "yearly") {
        for (let i = 1; i <= programDetails.number_of_years; i++) {
          yearSem.push({ key: i.toString(), value: "Year " + i });
          yearValue["year" + i] = "";
          tempSubAmount["year" + i] =
            feeTemplateSubAmount[0]["fee_year" + i + "_amt"];
        }
      } else if (
        feetemplateData.program_type_name.toLowerCase() === "semester"
      ) {
        for (let i = 1; i <= programDetails.number_of_semester; i++) {
          yearSem.push({ key: i.toString(), value: "Sem " + i });
          yearValue["year" + i] = "";
          tempSubAmount["year" + i] =
            feeTemplateSubAmount[0]["fee_year" + i + "_amt"];
        }
      }

      setYearwiseSubAmount(tempSubAmount);
      setNoOfYears(yearSem);
      setValues((prev) => ({
        ...prev,
        scholarshipData: yearValue,
      }));
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "isScholarship" && e.target.value === "true") {
      [
        "residency",
        "scholarship",
        "reason",
        "past",
        "income",
        "occupation",
        "document",
      ].forEach((obj) => {
        if (requiredFields.includes(obj) === false) {
          requiredFields.push(obj);
          checks[obj] = [values.obj !== ""];
          errorMessages[obj] = ["This field is required"];
        }
      });
    }

    if (e.target.name === "isScholarship" && e.target.value === "false") {
      [
        "residency",
        "scholarship",
        "reason",
        "past",
        "income",
        "occupation",
        "document",
      ].forEach((obj) => {
        if (requiredFields.includes(obj) === true) {
          requiredFields.splice(requiredFields.indexOf(obj), 1);
        }
      });
    }

    if (e.target.name === "scholarship" && e.target.value === "true") {
      requiredFields.push("scholarshipYes");
      checks["scholarshipYes"] = ["scholarshipYes" !== ""];
      errorMessages["scholarshipYes"] = ["This field is required"];
    }

    if (e.target.name === "past" && e.target.value === "true") {
      requiredFields.push("exemptionType");
      checks["exemptionType"] = ["exemptionType" !== ""];
      errorMessages["exemptionType"] = ["This field is required"];
    }

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

  const handleChangeSholarship = (e) => {
    setValues((prev) => ({
      ...prev,
      scholarshipData: {
        ...prev.scholarshipData,
        [e.target.name]:
          Number(e.target.value) > yearwiseSubAmount[e.target.name]
            ? yearwiseSubAmount[e.target.name]
            : e.target.value,
      },
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

  const handleCreate = (e) => {
    const submit = async () => {
      if (!requiredFieldsValid()) {
        setAlertMessage({
          severity: "error",
          message: "Please fill all fields",
        });
        setAlertOpen(true);
      } else {
        const temp = {};

        // Minimum data to be inserted into pre admission table
        const preAdmisssion = {};
        preAdmisssion.active = true;
        preAdmisssion.ac_year_id = values.acyearId;
        preAdmisssion.candidate_id = id;
        preAdmisssion.fee_admission_category_id = values.admissionCategory;
        preAdmisssion.fee_admission_sub_category_id =
          values.admissionSubCategory;
        preAdmisssion.fee_template_id = values.feetemplateId;
        preAdmisssion.is_scholarship = values.isScholarship;
        preAdmisssion.program_id = values.programId;
        preAdmisssion.program_specialization_id = values.specializationId;
        preAdmisssion.school_id = values.schoolId;
        preAdmisssion.student_name = values.studentName;
        preAdmisssion.candidate_id = id;

        // Data to be updated to candidate walkin table
        candidateData.npf_status = 1;
        candidateData.ac_year_id = values.acyearId;
        candidateData.school_id = values.schoolId;
        candidateData.program_id = values.programId;
        candidateData.program_specilaization_id = values.specializationId;

        if (values.isScholarship === "true") {
          const scholaship = {};
          scholaship.active = true;
          scholaship.award = values.scholarship;
          if (values.scholarship === "true") {
            scholaship.award_details = values.scholarshipYes;
          }
          scholaship.exemption_received = values.past;
          if (values.past === "true") {
            scholaship.exemption_type = reasonOptions
              .filter((f) => f.value === values.exemptionType)
              .map((val) => val.label)
              .toString();
          }

          scholaship.occupation = values.occupation;
          scholaship.parent_income = values.income;
          scholaship.reason = reasonOptions
            .filter((f) => f.value === values.reason)
            .map((val) => val.label)
            .toString();
          scholaship.residence = values.residency;
          scholaship.student_id = id;

          const scholashipApprover = {};
          scholashipApprover.active = true;

          noOfYears.forEach((val) => {
            scholashipApprover["year" + val.key + "_amount"] = Number(
              values.scholarshipData["year" + val.key]
            );
          });

          scholaship.requested_scholarship = scholarshipTotal;

          temp.pap = preAdmisssion;
          temp.s = scholaship;
          temp.sas = scholashipApprover;

          const documentData = new FormData();
          documentData.append("file", values.document);
          documentData.append("candidate_id", id);

          setLoading(true);
          // Scholarship document upload
          await axios
            .post(`/api/uploadFile`, documentData)
            .then((res) => {})
            .catch((err) => console.error(err));

          await axios
            .post(`/api/student/PreAdmissionProcess`, temp)
            .then((res) => {})
            .catch((error) => {
              setAlertMessage({
                severity: "error",
                message: error.response ? error.response.data.message : "Error",
              });
              setAlertOpen(true);
            });
        } else {
          await axios
            .post(`/api/student/PreAdmissionProcess1`, preAdmisssion)
            .then((res) => {})
            .catch((error) => {
              setAlertMessage({
                severity: "error",
                message: error.response ? error.response.data.message : "Error",
              });
              setAlertOpen(true);
            });
        }

        // Update Candidate Data
        await axios
          .put(`/api/student/Candidate_Walkin/${id}`, candidateData)
          .then((res) => {
            setLoading(false);
            if (res.status === 200 || res.status === 201) {
              navigate("/CandidateWalkinIndex", { replace: true });
              setAlertMessage({
                severity: "success",
                message: "Offer created successfully !!",
              });
            } else {
              setAlertMessage({
                severity: "error",
                message: res.data.message,
              });
            }
            setAlertOpen(true);
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

    setConfirmModalContent({
      title: "",
      message: "Do you want to submit ?",
      buttons: [
        { name: "Yes", color: "primary", func: submit },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmModalOpen(true);
  };

  return (
    <>
      <CustomModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        title={confirmModalContent.title}
        message={confirmModalContent.message}
        buttons={confirmModalContent.buttons}
      />

      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <Grid container>
          <Grid item xs={12} mt={3}>
            <FeeTemplateView feeTemplateId={values.feetemplateId} type={2} />
          </Grid>
        </Grid>
      </ModalWrapper>

      <Box component="form" p={1}>
        <FormPaperWrapper>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="studentName"
                label="Student Name"
                value={values.studentName}
                handleChange={handleChange}
                checks={checks.studentName}
                errors={errorMessages.studentName}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="acyearId"
                label="Ac Year"
                value={values.acyearId}
                options={acyearOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.acyearId}
                errors={errorMessages.acyearId}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.schoolId}
                errors={errorMessages.schoolId}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="programId"
                label="Program"
                value={values.programId}
                options={programOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.programId}
                errors={errorMessages.programId}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="specializationId"
                label="Specialization"
                value={values.specializationId}
                options={specializationOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.specializationId}
                errors={errorMessages.specializationId}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="admissionCategory"
                label="Admission Category"
                value={values.admissionCategory}
                options={admissionCategoryOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.admissionCategory}
                errors={errorMessages.admissionCategory}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="admissionSubCategory"
                label="Admission Sub Category"
                value={values.admissionSubCategory}
                options={subCategoryOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.admissionSubCategory}
                errors={errorMessages.admissionSubCategory}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="feetemplateId"
                label="Fee Template"
                value={values.feetemplateId}
                options={feeTemplateOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.feetemplateId}
                errors={errorMessages.feetemplateId}
                required
              />
            </Grid>

            {values.feetemplateId ? (
              <Grid item xs={12} md={2}>
                <CustomRadioButtons
                  name="isScholarship"
                  label="Is Scholarship"
                  value={values.isScholarship}
                  items={[
                    {
                      value: "true",
                      label: "Yes",
                    },
                    {
                      value: "false",
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

            <Grid item xs={12} md={2}>
              <CustomRadioButtons
                name="isHostel"
                label="Is Hostel"
                value={values.isHostel}
                items={[
                  {
                    value: "true",
                    label: "Yes",
                  },
                  {
                    value: "false",
                    label: "No",
                  },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>

            {values.feetemplateId && values.isScholarship === "false" ? (
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setModalOpen(true)}
                >
                  Fee Template
                </Button>
              </Grid>
            ) : (
              <></>
            )}

            {/* Scholarship section  */}
            {values.isScholarship === "true" ? (
              <>
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="subtitle2" align="center">
                      For Office Use Only
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomRadioButtons
                    name="residency"
                    label="Residence"
                    value={values.residency}
                    items={[
                      {
                        value: "own",
                        label: "Own",
                      },
                      {
                        value: "rented",
                        label: "Rented",
                      },
                    ]}
                    handleChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomRadioButtons
                    name="scholarship"
                    label="Scholarship Awarded From An OutSide Body"
                    value={values.scholarship}
                    items={[
                      {
                        value: "true",
                        label: "Yes",
                      },
                      {
                        value: "false",
                        label: "No",
                      },
                    ]}
                    handleChange={handleChange}
                    required
                  />
                </Grid>

                {values.scholarship === "true" ? (
                  <Grid item xs={12} md={4}>
                    <CustomTextField
                      name="scholarshipYes"
                      label="If Yes, Please Specify"
                      value={values.scholarshipYes}
                      handleChange={handleChange}
                      checks={checks.scholarshipYes}
                      errors={errorMessages.scholarshipYes}
                      required
                    />
                  </Grid>
                ) : (
                  <></>
                )}

                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="reason"
                    label="Reason For Fee Exemption"
                    value={values.reason}
                    options={reasonOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.reason}
                    errors={errorMessages.reason}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomRadioButtons
                    name="past"
                    label="Fee Exemption Received In Past From Acharya Institutes"
                    value={values.past}
                    items={[
                      {
                        value: "true",
                        label: "Yes",
                      },
                      {
                        value: "false",
                        label: "No",
                      },
                    ]}
                    handleChange={handleChange}
                    required
                  />
                </Grid>

                {values.past === "true" ? (
                  <Grid item xs={12} md={4}>
                    <CustomAutocomplete
                      name="exemptionType"
                      label="Kind Of Fee Exemption Availing"
                      value={values.exemptionType}
                      options={reasonOptions}
                      handleChangeAdvance={handleChangeAdvance}
                      checks={checks.exemptionType}
                      errors={errorMessages.exemptionType}
                      required
                    />
                  </Grid>
                ) : (
                  <></>
                )}

                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="income"
                    label="Parent Income (pa)"
                    value={values.income}
                    handleChange={handleChange}
                    checks={checks.income}
                    errors={errorMessages.income}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="occupation"
                    label="Occupation"
                    value={values.occupation}
                    options={occupationList}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.occupation}
                    errors={errorMessages.occupation}
                    required
                  />
                </Grid>

                {/* <Grid item xs={12}> */}
                {/* <Accordion>
                    <AccordionSummary
                      expandIcon={<ArrowDropDownIcon />}
                      className={classes.bg}
                    >
                      <Typography>Pre Scholarship</Typography>
                    </AccordionSummary>
                    <AccordionDetails>as</AccordionDetails>
                  </Accordion> */}
                {/* <Box className={classes.bg}>
                    <Typography variant="subtitle2">
                      Pre Scholarship
                      <IconButton size="small">
                        <ArrowDropDownIcon />
                      </IconButton>
                    </Typography>
                  </Box> */}

                {/* <Grid container>
                    <Grid item xs={12} md={6} className={classes.bg}>
                      <Typography variant="subtitle2" display="inline">
                        Pre Scholarship
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className={classes.bg}
                      align="right"
                    >
                      <IconButton size="small">
                        <ArrowDropDownIcon sx={{ color: "white" }} />
                      </IconButton>
                    </Grid>
                  </Grid> */}
                {/* </Grid> */}
                <Grid item xs={12}>
                  <TableContainer component={Paper} elevation={3}>
                    <Table
                      size="small"
                      stickyHeader
                      sx={{ width: noOfYears.length > 5 ? "120%" : "100%" }}
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Particulars</StyledTableCell>
                          {noOfYears.map((obj, i) => {
                            return (
                              <StyledTableCell key={i} align="right">
                                {obj.value}
                              </StyledTableCell>
                            );
                          })}
                          <StyledTableCell align="right">Total</StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {feeTemplateSubAmountData.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{obj.voucher_head}</TableCell>
                              {noOfYears.map((obj1, j) => {
                                return (
                                  <TableCell key={j} align="right">
                                    <Typography variant="body2" mb={1}>
                                      {obj["year" + obj1.key + "_amt"]}
                                    </Typography>
                                  </TableCell>
                                );
                              })}
                              <TableCell align="right">
                                <Typography variant="subtitle2" mb={1}>
                                  {obj.total_amt}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">Total</Typography>
                          </TableCell>
                          {noOfYears.map((obj, i) => {
                            return (
                              <TableCell key={i} align="right">
                                <Typography variant="subtitle2">
                                  {feeTemplateSubAmountData.length > 0 ? (
                                    feeTemplateSubAmountData[0][
                                      "fee_year" + obj.key + "_amt"
                                    ]
                                  ) : (
                                    <></>
                                  )}
                                </Typography>
                              </TableCell>
                            );
                          })}
                          <TableCell align="right">
                            <Typography variant="subtitle2" mb={1}>
                              {feeTemplateData.fee_year_total_amount}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {/* Pre Scholarhip  */}
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">
                              Pre Scholarship
                            </Typography>
                          </TableCell>
                          {noOfYears.map((obj, i) => {
                            return (
                              <TableCell key={i} align="right">
                                <CustomTextField
                                  name={"year" + obj.key}
                                  value={
                                    values.scholarshipData["year" + obj.key]
                                  }
                                  handleChange={handleChangeSholarship}
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      "& input": {
                                        textAlign: "right",
                                      },
                                    },
                                  }}
                                />
                              </TableCell>
                            );
                          })}
                          <TableCell align="right">
                            <Typography variant="subtitle2" mb={1}>
                              {scholarshipTotal}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {/* Grand Total */}
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">
                              Grand Total
                            </Typography>
                          </TableCell>
                          {noOfYears.map((obj, i) => {
                            return (
                              <TableCell key={i} align="right">
                                {yearwiseSubAmount["year" + obj.key] -
                                  values.scholarshipData["year" + obj.key]}
                              </TableCell>
                            );
                          })}
                          <TableCell align="right">
                            <Typography variant="subtitle2" mb={1}>
                              {feeTemplateData.fee_year_total_amount -
                                scholarshipTotal}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomFileInput
                    name="document"
                    label="Document"
                    helperText="PDF - smaller than 2 MB"
                    file={values.document}
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                    checks={checks.document}
                    errors={errorMessages.document}
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}

            <Grid item xs={12}>
              <Grid
                container
                justifyContent="flex-end"
                sx={{ textAlign: { md: "right", xs: "center" } }}
              >
                <Grid item xs={2}>
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    disabled={
                      loading ||
                      !requiredFieldsValid() ||
                      (values.isScholarship === "true" && scholarshipTotal <= 0
                        ? true
                        : false)
                    }
                    onClick={handleCreate}
                  >
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      <Typography variant="subtitle2">Submit</Typography>
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default PreAdmissionProcessForm;
