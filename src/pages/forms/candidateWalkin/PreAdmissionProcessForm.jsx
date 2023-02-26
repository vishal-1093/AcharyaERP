import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";
import PreScholarshipForm from "./PreScholarshipForm";
import FeeTemplateView from "../../../components/FeeTemplateView";

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

function PreAdmissionProcessForm() {
  const [values, setValues] = useState(initialValues);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [admissionCategoryOptions, setAdmissionCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [feeTemplateOptions, setFeeTemplateOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);
  const [feeTemplateData, setFeeTemplateData] = useState({});
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [noOfYears, setNoOfYears] = useState();
  const [scholarshipValues, setScholarshipValues] = useState();
  const [candidateData, setCandidateData] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(0);
  const [scholarshipTotal, setScholarshipTotal] = useState(0);
  const [programType, setProgramType] = useState();

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

  const getCandidateData = async () => {
    await axios
      .get(`/api/student/Candidate_Walkin/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Candidate Walkin", link: "/CandidateWalkinIndex" },
          {
            name: "Offer Creation",
          },
          {
            name: res.data.data.candidate_name,
          },
          {
            name: id,
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
              value: obj.fee_admission_category_id,
              label: obj.fee_admission_sub_category_name,
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

  const getFeeTemplateData = async () => {
    if (values.feetemplateId) {
      await axios
        .get(
          `/api/finance/FetchFeeTemplateSubAmountDetail/${values.feetemplateId}`
        )
        .then((res) => {
          setFeeTemplateSubAmountData(res.data.data);
        })
        .catch((err) => console.error(err));
      const feetemplateData = await axios
        .get(`/api/finance/FetchAllFeeTemplateDetail/${values.feetemplateId}`)
        .then((res) => {
          setFeeTemplateData(res.data.data[0]);
          return res.data.data[0];
        })
        .catch((err) => console.error(err));

      const programDetails = await axios
        .get(
          `/api/academic/FetchAcademicProgram/${feetemplateData.ac_year_id}/${feetemplateData.program_id}/${feetemplateData.school_id}`
        )
        .then((res) => {
          return res.data.data[0];
        })
        .catch((err) => console.error(err));

      const scholarshipId = await axios
        .get(`/api/student/fetchscholarship/${id}`)
        .then((res) => {
          const scholarshipData = res.data.data[0];
          return scholarshipData;
        })
        .catch((err) => console.error(err));

      const scholarshipData = [];

      if (scholarshipId) {
        await axios
          .get(`/api/student/fetchScholarship2/${scholarshipId.scholarship_id}`)
          .then((res) => {
            scholarshipData.push(res.data.data[0]);
          })
          .catch((err) => console.error(err));
      }

      const yearSem = [];

      if (feetemplateData.program_type_name.toLowerCase() === "yearly") {
        for (let i = 1; i <= programDetails.number_of_years; i++) {
          yearSem.push({ key: i.toString(), value: "Year " + i });
          setScholarshipValues((prev) => ({
            ...prev,
            ["year" + i]:
              scholarshipData.length > 0
                ? scholarshipData["year" + i + "_amount"]
                : 0,
          }));
        }
        setProgramType("year");
      } else if (
        feetemplateData.program_type_name.toLowerCase() === "semester"
      ) {
        for (let i = 1; i <= programDetails.number_of_semester; i++) {
          yearSem.push({ key: i.toString(), value: "Sem " + i });
          setScholarshipValues((prev) => ({
            ...prev,
            ["sem" + i]:
              scholarshipData.length > 0
                ? scholarshipData["year" + i + "_amount"]
                : 0,
          }));
        }
        setProgramType("sem");
      }

      setNoOfYears(yearSem);
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

  const handleChangeSholarship = (e) => {
    if (pathname.toLowerCase() === "/preadmissionprocessform/" + id) {
      if (
        parseInt(e.target.value) >
        parseInt(
          feeTemplateSubAmountData[0]["fee_year" + e.target.name + "_amt"]
        )
      ) {
        setScholarshipValues((prev) => ({
          ...prev,
          [programType + e.target.name]:
            feeTemplateSubAmountData[0]["fee_year" + e.target.name + "_amt"],
        }));
      } else {
        setScholarshipValues((prev) => ({
          ...prev,
          [programType + e.target.name]: e.target.value,
        }));
      }
    }
  };

  useEffect(() => {
    if (scholarshipValues) {
      const temp = [];
      if (noOfYears) {
        noOfYears.forEach((val) => {
          temp.push(parseInt(scholarshipValues[programType + val.key]));
        });
        setScholarshipTotal(temp.reduce((a, b) => a + b));
      }
    }
  }, [scholarshipValues]);

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFeeTemplate = async () => {
    values.isScholarship === "true" ? setType(3) : setType(2);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    noOfYears.forEach((val) => {
      setValues((prev) => ({
        ...prev,
        [programType + val.key]: scholarshipValues[programType + val.key],
      }));
    });

    setAlertMessage({
      severity: "success",
      message: "Scholarship data saved successfully",
    });
    setAlertOpen(true);
    setModalOpen(false);
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      if (
        values.isScholarship === "true" &&
        Object.values(scholarshipValues).reduce(
          (a, b) => parseInt(a) + parseInt(b)
        ) <= 0
      ) {
        setAlertMessage({
          severity: "error",
          message: "Please enter scholarship amount !!",
        });
        setAlertOpen(true);
        return false;
      }

      const temp = {};

      // Minimum data to be inserted into pre admission table
      const preAdmisssion = {};
      preAdmisssion.active = true;
      preAdmisssion.ac_year_id = values.acyearId;
      preAdmisssion.candidate_id = id;
      preAdmisssion.fee_admission_category_id = values.admissionCategory;
      preAdmisssion.fee_admission_sub_category_id = values.admissionSubCategory;
      preAdmisssion.fee_template_id = values.feetemplateId;
      preAdmisssion.is_scholarship = values.isScholarship;
      preAdmisssion.program_id = values.programId;
      preAdmisssion.program_specialization_id = values.specializationId;
      preAdmisssion.school_id = values.schoolId;
      preAdmisssion.student_name = values.studentName;
      preAdmisssion.candidate_id = id;

      // Data to be updated to candidate walkin table
      candidateData.npf_status = 1;
      candidateData.ac_year_id = 1;
      candidateData.school_id = 1;
      candidateData.program_id = 1;
      candidateData.program_specilaization_id = 1;

      if (values.isScholarship === "true") {
        const scholaship = {};
        scholaship.active = true;
        scholaship.award = values.scholarship;
        scholaship.award_details = values.scholarshipYes;
        scholaship.exemption_received = values.past;
        scholaship.exemption_type = reasonOptions
          .filter((f) => f.value === values.exemptionType)
          .map((val) => val.label)
          .toString();
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
        const requested = [];

        noOfYears.forEach((val) => {
          scholashipApprover["year" + val.key + "_amount"] = parseInt(
            values[programType + val.key]
          );
          requested.push(parseInt(values[programType + val.key]));
        });

        scholaship.requested_scholarship = requested.reduce((a, b) => a + b);

        temp.pap = preAdmisssion;
        temp.s = scholaship;
        temp.sas = scholashipApprover;
      } else {
        temp.pap = preAdmisssion;
        temp.s = {};
        temp.sas = {};
      }

      // api for uploading document
      const documentData = new FormData();
      documentData.append("file", values.document);
      documentData.append("candidate_id", id);

      await axios
        .post(`/api/uploadFile`, documentData)
        .then((res) => {})
        .catch((err) => console.error(err));

      await axios
        .post(`/api/student/PreAdmissionProcess`, temp)
        .then((res) => {})
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });

      await axios
        .put(`/api/student/Candidate_Walkin/${id}`, candidateData)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CandidateWalkinIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form submitted successfully !!",
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

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
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
                  <CustomTextField
                    name="occupation"
                    label="Occupation"
                    value={values.occupation}
                    handleChange={handleChange}
                    checks={checks.occupation}
                    errors={errorMessages.occupation}
                    required
                  />
                </Grid>

                {values.residency &&
                values.reason &&
                values.past &&
                values.scholarship &&
                values.income &&
                values.occupation ? (
                  <>
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleFeeTemplate}
                      >
                        Enter Scholarship
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}

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

            {values.feetemplateId && values.isScholarship === "false" ? (
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleFeeTemplate}
                >
                  Fee Template
                </Button>
              </Grid>
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
                    disabled={loading}
                    onClick={handleCreate}
                  >
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      <strong>Submit</strong>
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FormWrapper>
        <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
          <Grid container rowSpacing={2}>
            {values.isScholarship === "true" ? (
              <>
                <Grid item xs={12} mt={3}>
                  <PreScholarshipForm
                    scholarshipValues={scholarshipValues}
                    noOfYears={noOfYears}
                    feeTemplateData={feeTemplateData}
                    handleChangeSholarship={handleChangeSholarship}
                    scholarshipTotal={scholarshipTotal}
                    feeTemplateSubAmountData={feeTemplateSubAmountData}
                    programType={programType}
                  />
                </Grid>
                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item xs={12} mt={3}>
                <FeeTemplateView
                  feeTemplateId={values.feetemplateId}
                  type={type}
                />
              </Grid>
            )}
          </Grid>
        </ModalWrapper>
      </Box>
    </>
  );
}

export default PreAdmissionProcessForm;
