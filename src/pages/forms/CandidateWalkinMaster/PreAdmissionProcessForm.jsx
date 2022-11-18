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
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import ModalWrapper from "../../../components/ModalWrapper";
import FeeTemplateView from "./FeeTemplateView";
import useAlert from "../../../hooks/useAlert";

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
};
const PreAdmissionProcessForm = () => {
  const [values, setValues] = useState(initialValues);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [admissionCategoryOptions, setAdmissionCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [feeTemplateOptions, setFeeTemplateOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);
  const [excemptionTypeOptions, setExcemptionTypeOptions] = useState([]);
  const [feeTemplateData, setFeeTemplateData] = useState({});
  const [feeTemplateSubAmount, setFeeTemplateSubAmount] = useState([]);
  const [noOfYears, setNoOfYears] = useState();
  const [scholarshipValues, setScholarshipValues] = useState();
  const [candidateData, setCandidateData] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    studentName: [values.studentName !== ""],
  };

  const errorMessages = {
    studentName: ["This field required"],
  };

  useEffect(() => {
    setCrumbs([
      { name: "CandidateWalkin Master", link: "/CandidateWalkinMaster" },
      { name: "Offer Creation" },
    ]);
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
      .get(`${ApiUrl}/student/Candidate_Walkin/${id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          studentName: res.data.data.candidate_name,
        }));
        setCandidateData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getAcyear = async () => {
    await axios
      .get(`${ApiUrl}/academic/academic_year`)
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
      .get(`${ApiUrl}/institute/school`)
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
        .get(`${ApiUrl}/academic/fetchProgram1/${values.schoolId}`)
        .then((res) => {
          setProgramOptions(
            res.data.data.map((obj) => ({
              value: obj.program_id,
              label: obj.program_name,
            }))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getProgramSpecialization = async () => {
    if (values.programId) {
      await axios
        .get(
          `${ApiUrl}/academic/FetchProgramSpecialization/${values.schoolId}/${values.programId}`
        )
        .then((res) => {
          setSpecializationOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.program_specialization_name,
            }))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getAdmissionCategory = async () => {
    await axios
      .get(`${ApiUrl}/student/FeeAdmissionCategory`)
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
          `${ApiUrl}/student/FetchFeeAdmissionSubCategory/${values.admissionCategory}`
        )
        .then((res) => {
          setSubCategoryOptions(
            res.data.data.map((obj) => ({
              value: obj.fee_admission_category_id,
              label: obj.fee_admission_sub_category_name,
            }))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getFeeTemplates = async () => {
    if (values.admissionSubCategory) {
      await axios
        .get(
          `${ApiUrl}/finance/FetchAllFeeTemplateDetails/${values.acyearId}/${values.schoolId}/${values.programId}/${values.specializationId}/${values.admissionCategory}/${values.admissionSubCategory}`
        )
        .then((res) => {
          setFeeTemplateOptions(
            res.data.data.map((obj) => ({
              value: obj.fee_template_id,
              label: obj.fee_template_name,
            }))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getFeeexcemptions = async () => {
    await axios
      .get(`${ApiUrl}/academic/activeReasonFeeExcemption`)
      .then((res) => {
        setReasonOptions(
          res.data.data
            .filter((fil) => fil.exemption_status === "reason")
            .map((obj) => ({
              value: obj.fee_exemption_id,
              label: obj.reasion_for_fee_exemption,
            }))
        );
        setExcemptionTypeOptions(
          res.data.data
            .filter((fil) => fil.exemption_status === "exemption")
            .map((obj) => ({
              value: obj.fee_exemption_id,
              label: obj.reasion_for_fee_exemption,
            }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getFeeTemplateData = async () => {
    if (values.feetemplateId) {
      const templateDetails = await axios
        .get(
          `${ApiUrl}/finance/FetchAllFeeTemplateDetail/${values.feetemplateId}`
        )
        .then((res) => {
          setFeeTemplateData(res.data.data[0]);
          return res.data.data[0];
        })
        .catch((err) => {
          console.log(err);
        });

      const subAmountDetails = await axios
        .get(
          `${ApiUrl}/finance/FetchFeeTemplateSubAmountDetail/${values.feetemplateId}`
        )
        .then((res) => {
          setFeeTemplateSubAmount(res.data.data);
          return res.data.data[0];
        })
        .catch((err) => {
          console.log(err);
        });

      await axios
        .get(
          `${ApiUrl}/academic/FetchAcademicProgram/${values.acyearId}/${values.programId}/${values.schoolId}`
        )
        .then((res) => {
          const yearSem = [];
          for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
            if (templateDetails.program_type_name.toLowerCase() === "yearly") {
              yearSem.push({ key: i, value: "Year " + i });
              // setValues((prev) => ({
              //   ...prev,
              //   ["year" + i]: 0,
              //   ["total" + i]: subAmountDetails["fee_year" + i + "_amt"],
              //   ["grandTotal" + i]: subAmountDetails["fee_year" + i + "_amt"],
              // }));
              setScholarshipValues((prev) => ({
                ...prev,
                ["year" + i]: 0,
                ["total" + i]: subAmountDetails["fee_year" + i + "_amt"],
                ["grandTotal" + i]: subAmountDetails["fee_year" + i + "_amt"],
              }));
            } else {
              yearSem.push({ key: i, value: "Sem " + i });
              // setValues((prev) => ({
              //   ...prev,
              //   ["sem" + i]: 0,
              //   ["total" + i]: subAmountDetails["fee_year" + i + "_amt"],
              //   ["grandTotal" + i]: subAmountDetails["fee_year" + i + "_amt"],
              // }));
              setScholarshipValues((prev) => ({
                ...prev,
                ["sem" + i]: 0,
                ["total" + i]: subAmountDetails["fee_year" + i + "_amt"],
                ["grandTotal" + i]: subAmountDetails["fee_year" + i + "_amt"],
              }));
            }
          }

          setNoOfYears(yearSem);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleChange = (e) => {
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

  const handleFeeTemplate = async () => {
    console.log(scholarshipValues);
    setModalOpen(true);
  };

  const handleChangee = (e) => {
    if (e.target.value > scholarshipValues["total" + e.target.name]) {
      setScholarshipValues((prev) => ({
        ...prev,
        ["year" + e.target.name]: scholarshipValues["total" + e.target.name],
        ["grandTotal" + e.target.name]:
          scholarshipValues["total" + e.target.name],
      }));
    } else {
      setScholarshipValues((prev) => ({
        ...prev,
        ["year" + e.target.name]: e.target.value,
        ["grandTotal" + e.target.name]:
          scholarshipValues["total" + e.target.name] - e.target.value,
      }));
    }
  };
  const handleSave = (e) => {
    noOfYears.forEach((val) => {
      setValues((prev) => ({
        ...prev,
        ["year" + val.key]: scholarshipValues["year" + val.key],
      }));
    });

    setAlertMessage({
      severity: "success",
      message: "Scholarship data saved successfully",
    });
    setAlertOpen(true);
    setModalOpen(false);
  };

  const handleCreate = async (e) => {
    const temp = {};

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

    const scholaship = {};
    scholaship.active = true;
    scholaship.award = values.scholarship;
    scholaship.award_details = values.scholarshipYes;
    scholaship.exemption_received = values.past;
    scholaship.exemption_type = excemptionTypeOptions
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
        values["year" + val.key]
      );
      requested.push(parseInt(values["year" + val.key]));
    });

    scholaship.requested_scholarship = requested.reduce((a, b) => a + b);
    candidateData.npf_status = 1;
    candidateData.ac_year_id = 1;
    candidateData.school_id = 1;
    candidateData.program_id = 1;
    candidateData.program_specilaization_id = 1;

    temp.pap = preAdmisssion;
    temp.s = scholaship;
    temp.sas = scholashipApprover;

    // console.log(temp);
    // return false;
    // await axios
    //   .post(`${ApiUrl}/student/PreAdmissionProcess1`, preAdmisssion)
    //   .then((res) => {
    //     // setLoading(false);
    //     // if (res.status === 200 || res.status === 201) {
    //     //   navigate("/CandidateWalkinMaster", { replace: true });
    //     //   setAlertMessage({
    //     //     severity: "success",
    //     //     message: "Created",
    //     //   });
    //     // } else {
    //     //   setAlertMessage({
    //     //     severity: "error",
    //     //     message: res.data.message,
    //     //   });
    //     // }
    //     // setAlertOpen(true);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     setAlertMessage({
    //       severity: "error",
    //       message: error.response ? error.response.data.message : "Error",
    //     });
    //     setAlertOpen(true);
    //   });

    await axios
      .post(`${ApiUrl}/student/PreAdmissionProcess`, temp)
      .then((res) => {
        // setLoading(false);
        // if (res.status === 200 || res.status === 201) {
        //   navigate("/CandidateWalkinMaster", { replace: true });
        //   setAlertMessage({
        //     severity: "success",
        //     message: "Created",
        //   });
        // } else {
        //   setAlertMessage({
        //     severity: "error",
        //     message: res.data.message,
        //   });
        // }
        // setAlertOpen(true);
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      });

    await axios
      .put(`${ApiUrl}/student/Candidate_Walkin/${id}`, candidateData)
      .then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          navigate("/CandidateWalkinMaster", { replace: true });
          setAlertMessage({
            severity: "success",
            message: "Created",
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

    console.log(candidateData);
    console.log(temp);
  };
  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
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
                  ""
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

                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="exemptionType"
                    label="Kind Of Fee Exemption Availing"
                    value={values.exemptionType}
                    options={excemptionTypeOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.exemptionType}
                    errors={errorMessages.exemptionType}
                    required
                  />
                </Grid>
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
              </>
            ) : (
              ""
            )}
            {values.feetemplateId ? (
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleFeeTemplate}
                >
                  {values.isScholarship === "true"
                    ? "Pre Scholarship"
                    : "Fee Template"}
                </Button>
              </Grid>
            ) : (
              ""
            )}
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                sx={{ textAlign: { md: "right", xs: "center" } }}
                // textAlign="right"
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
          <FeeTemplateView
            feeTemplateData={feeTemplateData}
            subAmountData={feeTemplateSubAmount}
            totalYearSem={noOfYears}
            scholarshipStatus={values.isScholarship}
            handleChangee={handleChangee}
            values={values}
            scholarshipValues={scholarshipValues}
            handleSave={handleSave}
          />
        </ModalWrapper>
      </Box>
    </>
  );
};

export default PreAdmissionProcessForm;
