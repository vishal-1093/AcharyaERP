import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress, Typography } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import ModalWrapper from "../../../components/ModalWrapper";
import Feetemplatesubamountview from "../../../pages/forms/feetemplateMaster/ViewFeetemplateSubAmount";
import CustomModal from "../../../components/CustomModal";
import { Visibility } from "@mui/icons-material";

const PreScholarshipForm = lazy(() => import("./PreScholarshipForm"));

const initialValues = {
  studentName: "",
  acyearId: null,
  schoolId: null,
  programId: null,
  admissionCategory: null,
  admissionSubCategory: null,
  feetemplateId: null,
  isScholarship: "false",
  isHostel: "false",
  residency: "rented",
  scholarship: "false",
  scholarshipYes: "",
  reason: null,
  income: "",
  occupation: "",
  document: "",
  scholarshipData: {},
  isNri: false,
  remarks: "",
};

const requiredFields = new Set([
  "studentName",
  "acyearId",
  "schoolId",
  "programId",
  "admissionCategory",
  "admissionSubCategory",
  "feetemplateId",
  "isScholarship",
]);

function PreAdmissionProcessForm() {
  const [values, setValues] = useState(initialValues);
  const [candidateData, setCandidateData] = useState();
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [admissionCategoryOptions, setAdmissionCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [feeTemplateOptions, setFeeTemplateOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [noOfYears, setNoOfYears] = useState([]);
  const [yearwiseSubAmount, setYearwiseSubAmount] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [programData, setProgramData] = useState();
  const [scholarshipTotal, setScholarshipTotal] = useState(0);

  const maxLength = 150;

  const { id, type } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    studentName: [values.studentName !== ""],
    acyearId: [values.acyearId !== null],
    schoolId: [values.schoolId !== null],
    programId: [values.programId !== null],
    admissionCategory: [values.admissionCategory !== null],
    admissionSubCategory: [values.admissionSubCategory !== null],
    feetemplateId: [values.feetemplateId !== null],
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
    fetchData();
  }, []);

  useEffect(() => {
    getPrograms();
  }, [values.schoolId]);

  useEffect(() => {
    getFeeTemplates();
  }, [
    values.schoolId,
    values.programId,
    values.admissionCategory,
    values.admissionSubCategory,
    values.isNri,
  ]);

  useEffect(() => {
    getAdmissionSubCategory();
  }, [values.admissionCategory]);

  useEffect(() => {
    getFeeTemplateData();
    handleRequiredFields();
  }, [values.isScholarship]);

  useEffect(() => {
    if (values.scholarship === "true") {
      addMultipleElements(["scholarshipYes"]);
    } else {
      removeMultipleElements(["scholarshipYes"]);
    }
  }, [values.scholarship]);

  useEffect(() => {
    const { scholarshipData } = values;
    if (scholarshipData && Object.keys(scholarshipData).length > 0) {
      const total = Object.values(scholarshipData).reduce((acc, val) => {
        const num = Number(val) || 0;
        return acc + (num > 0 ? num : 0);
      }, 0);
      setScholarshipTotal(total);
    } else {
      setScholarshipTotal(0);
    }
  }, [values.scholarshipData]);

  const fetchData = async () => {
    try {
      const [
        { data: candidateResponse },
        { data: acyearResponse },
        { data: schoolResponse },
        { data: feeCategoryResponse },
      ] = await Promise.all([
        axios.get(`/api/student/Candidate_Walkin/${id}`),
        axios.get("/api/academic/academic_year"),
        axios.get("/api/institute/school"),
        axios.get("/api/student/FeeAdmissionCategory"),
      ]);
      const candidateResponseData = candidateResponse.data;

      const acyearOptionData = [];
      acyearResponse?.data?.forEach((obj) => {
        acyearOptionData.push({
          value: obj.ac_year_id,
          label: obj.ac_year,
        });
      });

      const schoolOptionData = [];
      schoolResponse?.data?.forEach((obj) => {
        schoolOptionData.push({
          value: obj.school_id,
          label: obj.school_name,
        });
      });

      const feeCategoryOptionData = [];
      feeCategoryResponse?.data?.forEach((obj) => {
        feeCategoryOptionData.push({
          value: obj.fee_admission_category_id,
          label: obj.fee_admission_category_type,
        });
      });

      handleBreadcrumbs(candidateResponseData.candidate_name);
      setCandidateData(candidateResponseData);
      setAcyearOptions(acyearOptionData);
      setSchoolOptions(schoolOptionData);
      setAdmissionCategoryOptions(feeCategoryOptionData);
      setValues((prev) => ({
        ...prev,
        studentName: candidateResponseData.candidate_name,
        acyearId: candidateResponseData.ac_year_id,
        schoolId: candidateResponseData.school_id,
        programId: candidateResponseData.program_specilaization_id,
        isNri: candidateResponseData.is_nri ?? false,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleBreadcrumbs = (candidateName) => {
    setCrumbs([
      {
        name: "Candidate Walkin",
        link:
          type === "admin"
            ? "/CandidateWalkin"
            : type === "intl"
            ? "/CandidateWalkin-intl"
            : "/CandidateWalkin-userwise",
      },
      {
        name: candidateName,
      },
      {
        name: "Offer Creation",
      },
    ]);
  };

  const getAdmissionSubCategory = async () => {
    const { admissionCategory } = values;
    if (!admissionCategory) return null;
    try {
      const { data: response } = await axios.get(
        `/api/student/FetchFeeAdmissionSubCategory/${values.admissionCategory}`
      );
      const optionData = [];
      response?.data?.forEach((obj) => {
        optionData.push({
          value: obj.fee_admission_sub_category_id,
          label: obj.fee_admission_sub_category_name,
        });
      });
      setSubCategoryOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to load fee admission categories",
      });
      setAlertOpen(true);
    }
  };

  const getPrograms = async () => {
    const { schoolId } = values;
    if (!schoolId) return null;

    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
      );
      const optionData = [];
      const responseData = response.data;
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
        });
      });
      const programObject = responseData.reduce((acc, next) => {
        acc[next.program_specialization_id] = next;
        return acc;
      }, {});

      setProgramOptions(optionData);
      setProgramData(programObject);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the programs data",
      });
      setAlertOpen(true);
    }
  };

  const getFeeTemplates = async () => {
    const {
      acyearId,
      schoolId,
      programId,
      admissionCategory,
      admissionSubCategory,
      isNri,
    } = values;

    if (
      !(
        acyearId &&
        schoolId &&
        programId &&
        admissionCategory &&
        admissionSubCategory
      )
    )
      return null;
    try {
      const { data: response } = await axios.get(
        `/api/finance/FetchAllFeeTemplateDetails/${acyearId}/${schoolId}/${
          programData[values.programId].program_id
        }/${programId}/${admissionCategory}/${admissionSubCategory}/${isNri}`
      );
      const optionData = [];
      response?.data?.forEach((obj) => {
        optionData.push({
          value: obj.fee_template_id,
          label: obj.fee_template_name,
        });
      });
      setFeeTemplateOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the fee template data",
      });
      setAlertOpen(true);
    }
  };

  const getFeeTemplateData = async () => {
    const { feetemplateId, acyearId, programId, schoolId, isScholarship } =
      values;

    if (!feetemplateId || isScholarship === "false") return null;
    try {
      const selectedProgramId = programData[programId].program_id;
      const [
        { data: subAmountResponse },
        { data: feeTemplateResponse },
        { data: reasonResponse },
        { data: programResponse },
      ] = await Promise.all([
        axios.get(
          `/api/finance/FetchFeeTemplateSubAmountDetail/${feetemplateId}`
        ),
        axios.get(`/api/finance/FetchAllFeeTemplateDetail/${feetemplateId}`),
        axios.get("/api/categoryTypeDetailsForReasonFeeExcemption"),
        axios.get(
          `/api/academic/FetchAcademicProgram/${acyearId}/${selectedProgramId}/${schoolId}`
        ),
      ]);

      const feeTemplateData = feeTemplateResponse.data[0];
      const feeTemplateSubAmtData = subAmountResponse.data[0];
      const programResponseData = programResponse.data[0];

      const optionData = [];
      reasonResponse?.data?.forEach((obj) => {
        optionData.push({
          value: obj.category_details_id,
          label: obj.category_detail,
        });
      });

      const programType = programResponseData.program_type.toLowerCase();
      const totalYearsOrSemesters =
        programType === "yearly"
          ? programResponseData.number_of_years * 2
          : programResponseData.number_of_semester;

      const yearSemesters = [];
      const scholarshipDataMapping = {};
      const subAmountMapping = {};
      let sum = 0;

      const feeTemplateProgramType =
        feeTemplateData.program_type_name.toLowerCase();

      for (let i = 1; i <= totalYearsOrSemesters; i++) {
        if (
          feeTemplateProgramType === "semester" ||
          (feeTemplateProgramType === "yearly" && i % 2 !== 0)
        ) {
          const templateAmount = feeTemplateSubAmtData[`fee_year${i}_amt`];
          yearSemesters.push({ key: i, value: `Sem ${i}` });
          scholarshipDataMapping[`year${i}`] = "";
          subAmountMapping[`year${i}`] = templateAmount;
          sum += templateAmount;
        }
      }

      setValues((prev) => ({
        ...prev,
        scholarshipData: scholarshipDataMapping,
        rowTotal: sum,
      }));
      setNoOfYears(yearSemesters);
      setYearwiseSubAmount(subAmountMapping);
      setReasonOptions(optionData);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the fee template data",
      });
      setAlertOpen(true);
    }
  };

  const addMultipleElements = (elements) => {
    elements.forEach((element) => requiredFields.add(element));
  };

  const removeMultipleElements = (elements) => {
    elements.forEach((element) => requiredFields.delete(element));
  };

  const handleRequiredFields = () => {
    const { isScholarship } = values;

    const scholrashipRequired = [
      "residency",
      "scholarship",
      "reason",
      "income",
      "occupation",
      "document",
      "remarks",
    ];

    if (isScholarship === "true") {
      addMultipleElements(scholrashipRequired);
    } else {
      removeMultipleElements(scholrashipRequired);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > maxLength) return;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
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
    const extractRequiredFields = [...requiredFields];
    for (let i = 0; i < extractRequiredFields.length; i++) {
      const field = extractRequiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const {
        acyearId,
        admissionCategory,
        admissionSubCategory,
        feetemplateId,
        isScholarship,
        programId,
        schoolId,
        studentName,
        scholarship,
        scholarshipYes,
        income,
        residency,
        document,
        reason,
        occupation,
        remarks,
        isHostel,
      } = values;

      const preAdmisssionData = {
        active: true,
        ac_year_id: acyearId,
        candidate_id: id,
        fee_admission_category_id: admissionCategory,
        fee_admission_sub_category_id: admissionSubCategory,
        fee_template_id: feetemplateId,
        is_scholarship: isScholarship,
        program_assignment_id: programData[programId].program_assignment_id,
        program_id: programData[programId].program_id,
        program_specialization_id: programId,
        school_id: schoolId,
        student_name: studentName,
        is_hostel: isHostel,
      };

      candidateData.npf_status = 1;
      candidateData.ac_year_id = acyearId;
      candidateData.school_id = schoolId;
      candidateData.program_assignment_id =
        programData[programId].program_assignment_id;
      candidateData.program_id = programData[programId].program_id;
      candidateData.program_specilaization_id = programId;

      let scholarshipData, scholarshipApprover, postData;

      if (isScholarship === "true") {
        const getReason = reasonOptions.find(
          (obj) => obj.value === reason
        )?.label;

        scholarshipData = {
          active: true,
          award: scholarship,
          occupation,
          parent_income: income,
          reason: getReason,
          residence: residency,
          award_details: scholarshipYes ?? "",
          requested_scholarship: scholarshipTotal,
        };

        scholarshipApprover = {
          active: true,
          candidate_id: id,
          pre_approval_status: true,
          prev_approved_amount: scholarshipTotal,
          requestedByRemarks: remarks,
        };

        noOfYears.forEach((obj) => {
          scholarshipApprover[`year${obj.key}_amount`] = Number(
            values.scholarshipData[`year${obj.key}`]
          );
        });

        postData = {
          pap: preAdmisssionData,
          s: scholarshipData,
          sas: scholarshipApprover,
        };
      } else {
        postData = preAdmisssionData;
      }

      const [
        preAdmissionResponse,
        documentResponse,
        schHistory,
        { data: candidateRes },
      ] = await Promise.all([
        isScholarship !== "true"
          ? axios.post("/api/student/PreAdmissionProcess1", postData)
          : null,
        document
          ? axios.post("/api/uploadFile", createFormData(document, id))
          : null,
        isScholarship === "true"
          ? (async () => {
              const { data } = await axios.post(
                "/api/student/PreAdmissionProcess",
                postData
              );
              const schResponse = data.data;
              return axios.post(
                "api/student/scholarshipApprovalStatusHistory",
                {
                  ...schResponse,
                  editedBy: "requested",
                }
              );
            })()
          : null,
        axios.put(`/api/student/Candidate_Walkin/${id}`, candidateData),
      ]);

      if (candidateRes.success) {
        setAlertMessage({
          severity: "success",
          message: "Offer has been created successfully !!",
        });
        setAlertOpen(true);
        navigate(
          type == "admin"
            ? "/CandidateWalkin"
            : type == "intl"
            ? "/CandidateWalkin-intl"
            : "/CandidateWalkin-userwise",
          { replace: true }
        );
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Unable to create the offer",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const createFormData = (file, candidateId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("candidate_id", candidateId);
    return formData;
  };

  const handleSubmit = () => {
    if (values.isScholarship === "true" && scholarshipTotal === 0) {
      setAlertMessage({
        severity: "error",
        message: "Please enter the scholarship amount",
      });
      setAlertOpen(true);
      return;
    }

    setConfirmModalContent({
      title: "",
      message: "Would you like to confirm?",
      buttons: [
        { name: "Yes", color: "primary", func: handleCreate },
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

      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1500}>
        <Feetemplatesubamountview id={values.feetemplateId} />
      </ModalWrapper>

      <Box
        sx={{ margin: { xs: "20px 0px 0px 0px", md: "15px 15px 0px 15px" } }}
      >
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
                disabled
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
                disabled
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
                disabled
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

            {values.admissionSubCategory && (
              <Grid item xs={12} md={4} lg={1.5}>
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
            )}

            <Grid item xs={12} md={4} lg={2.5}>
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
              <Grid item xs={12} md={4} lg={1.5}>
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
            {/* 
            <Grid item xs={12} md={4} lg={1.5}>
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
            </Grid> */}

            {values.feetemplateId && (
              <Grid
                item
                xs={12}
                md={4}
                mt={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setModalOpen(true)}
                  endIcon={<Visibility />}
                >
                  Template
                </Button>
              </Grid>
            )}

            {values.isScholarship === "true" && (
              <Grid item xs={12}>
                <PreScholarshipForm
                  values={values}
                  setValues={setValues}
                  handleChange={handleChange}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks}
                  errorMessages={errorMessages}
                  reasonOptions={reasonOptions}
                  noOfYears={noOfYears}
                  yearwiseSubAmount={yearwiseSubAmount}
                  maxLength={maxLength}
                  scholarshipTotal={scholarshipTotal}
                />
              </Grid>
            )}

            <Grid item xs={12} align="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={loading || !requiredFieldsValid()}
                onClick={handleSubmit}
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
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default PreAdmissionProcessForm;
