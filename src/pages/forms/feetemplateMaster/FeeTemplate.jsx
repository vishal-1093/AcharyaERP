import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
const CustomMultipleAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomMultipleAutocomplete")
);
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initialValues = {
  acYearId: null,
  admcategoryId: null,
  admSubCategoryId: null,
  programTypeId: null,
  currencyTypeId: null,
  remarks: "",
  schoolId: null,
  programId: null,
  programSpeId: [],
  nri: null,
  isSaarc: false,

  feeTemplateName: "",
  feeYearOne: "",
  feeYearTwo: "",
  feeYearThree: "",
  feeYearFour: "",
  feeYearFive: "",
  feeYearSix: "",
  feeYearSeven: "",
  feeYearEight: "",
  feeYearNine: "",
  feeYearTen: "",
  feeYearEleven: "",
  feeYearTwelve: "",
  feeYearTotal: "",
  paidAtBoard: false,
  approvedBy: "",
  approvedStatus: "",
  approvedDate: null,
};

const requiredFields = [
  "acYearId",
  "admcategoryId",
  "admSubCategoryId",
  "programTypeId",
  "currencyTypeId",
  "schoolId",
  "programId",
  "programSpeId",
  "remarks",
];

function FeeTemplate() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [admCategoryOptions, setAdmCategoryOptions] = useState([]);
  const [admSubCategoryOptions, setAdmSubCategoryOptions] = useState([]);
  const [programTypeOptions, setProgramTypeOptions] = useState([]);
  const [currencyTypeOptions, setCurrencyTypeOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [feetempId, setFeetempId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    remarks: ["This field required"],
  };

  useEffect(() => {
    getAcademicYearData();
    getAdmissionCategoryData();
    getProgramTypeData();
    getCurrencyTypeData();
    getSchoolData();
    if (pathname.toLowerCase() === "/feetemplatemaster/feetemplate/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Fee Template Master", link: "FeetemplateMaster" },
        { name: "Fee Template" },
      ]);
    } else {
      setIsNew(false);
      getFeetemplateData();
      getProgramSpe();
    }
  }, [pathname, values.programId, values.schoolId]);

  useEffect(() => {
    getProgramData();
    getAdmissionSubCategoryData();
    getAllFeetemplateDetails();
  }, [
    values.acYearId,
    values.admcategoryId,
    values.admSubCategoryId,
    values.programTypeId,
    values.currencyTypeId,
    values.schoolId,
    values.programId,
  ]);

  const getAcademicYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.ac_year_id,
            label: obj.ac_year,
          });
        });
        setAcademicYearOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getAdmissionCategoryData = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_type,
          });
        });
        setAdmCategoryOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getAdmissionSubCategoryData = async () => {
    if (values.admcategoryId)
      await axios
        .get(
          `/api/student/FetchFeeAdmissionSubCategory/${values.admcategoryId}`
        )
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.fee_admission_sub_category_id,
              label: obj.fee_admission_sub_category_name,
            });
          });
          setAdmSubCategoryOptions(data);
        })
        .catch((err) => console.error(err));
  };

  const getProgramTypeData = async () => {
    await axios
      .get(`/api/academic/ProgramType`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.program_type_id,
            label: obj.program_type_name,
          });
        });
        setProgramTypeOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getCurrencyTypeData = async () => {
    await axios
      .get(`/api/finance/CurrencyType`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.currency_type_id,
            label: obj.currency_type_name,
          });
        });
        setCurrencyTypeOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getProgramData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchProgram1/${values.acYearId}/${values.schoolId}`
        )
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.program_id,
              label: obj.program_short_name,
            });
          });
          setProgramOptions(data);
        })
        .catch((err) => console.error(err));
  };

  const getProgramSpe = async () => {
    if (values.schoolId && values.programId)
      await axios
        .get(
          `/api/academic/FetchProgramSpecialization/${values.schoolId}/${values.programId}`
        )
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.program_specialization_id,
              label: obj.program_specialization_short_name,
            });
          });
          setProgramSpeOptions(data);
        })
        .catch((err) => console.error(err));
  };

  const getAllFeetemplateDetails = async () => {
    if (
      values.acYearId &&
      values.admcategoryId &&
      values.admSubCategoryId &&
      values.programTypeId &&
      values.currencyTypeId &&
      values.schoolId &&
      values.programId
    )
      await axios
        .get(
          `/api/finance/allFeeTemplateDetail/${values.acYearId}/${values.admcategoryId}/${values.admSubCategoryId}/${values.programTypeId}/${values.currencyTypeId}/${values.schoolId}/${values.programId}`
        )
        .then((resOne) => {
          const a = resOne.data.data.map(
            (obj) => obj.program_specialization_id
          );

          if (isNew)
            axios
              .get(
                `/api/academic/FetchProgramSpecialization/${values.schoolId}/${values.programId}`
              )
              .then((res) => {
                setProgramSpeOptions(
                  res.data.data
                    .filter((obj) =>
                      resOne.data.data.length > 0
                        ? resOne.data.data[0].program_specialization_id
                            .split(",")
                            .includes(
                              obj.program_specialization_id.toString()
                            ) === false
                        : a.includes(
                            obj.program_specialization_id.toString()
                          ) === false
                    )
                    .map((obj) => ({
                      value: obj.program_specialization_id,
                      label: obj.program_specialization_short_name,
                    }))
                );
              })
              .catch((err) => console.error(err));
        });
  };

  const getFeetemplateData = async () => {
    await axios(`/api/finance/FeeTemplate/${id}`)
      .then((res) => {
        setValues({
          acYearId: res.data.data.ac_year_id,
          admcategoryId: res.data.data.fee_admission_category_id,
          admSubCategoryId: res.data.data.fee_admission_sub_category_id,
          nri: res.data.data.is_nri,

          isSaarc: res.data.data.is_saarc,
          paidAtBoard: res.data.data.is_paid_at_board,
          programTypeId: res.data.data.program_type_id,
          currencyTypeId: res.data.data.currency_type_id,
          schoolId: res.data.data.school_id,
          programId: res.data.data.program_id,
          programSpeId: res.data.data.program_specialization_id,
          remarks: res.data.data.remarks,
          feeTemplateName: res.data.data.fee_template_name,
          programSpecialization: res.data.data.program_specialization,
          approvedStatus: res.data.data.approved_status,
          approvedDate: res.data.data.approved_date,
          approvedBy: res.data.data.approved_by,
          feeYearOne: res.data.data.fee_year1_amt,
          feeYearTwo: res.data.data.fee_year2_amt,
          feeYearThree: res.data.data.fee_year3_amt,
          feeYearFour: res.data.data.fee_year4_amt,
          feeYearFive: res.data.data.fee_year5_amt,
          feeYearSix: res.data.data.fee_year6_amt,
          feeYearSeven: res.data.data.fee_year7_amt,
          feeYearEight: res.data.data.fee_year8_amt,
          feeYearNine: res.data.data.fee_year9_amt,
          feeYearTen: res.data.data.fee_year10_amt,
          feeYearEleven: res.data.data.fee_year11_amt,
          feeYearTwelve: res.data.data.fee_year12_amt,
          feeYearTotal: res.data.data.fee_year_total_amount,
        });

        setFeetempId(res.data.data.fee_template_id);
        setCrumbs([
          { name: "Fee Template Master", link: "/FeetemplateMaster" },
          { name: "Fee Template" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.ac_year_id = values.acYearId;
      temp.fee_admission_category_id = values.admcategoryId;
      temp.fee_admission_sub_category_id = values.admSubCategoryId;

      temp.is_nri = values.nri;
      temp.program_type_id = values.programTypeId;
      temp.currency_type_id = values.currencyTypeId;
      temp.remarks = values.remarks;
      temp.school_id = values.schoolId;
      temp.program_id = values.programId;
      temp.program_specialization_id = values.programSpeId.toString();
      temp.is_paid_at_board = values.paidAtBoard;
      temp.is_saarc = values.isSaarc;
      temp.program_sht = programOptions
        .filter((val) => val.value === values.programId)
        .map((obj) => obj.label)
        .toString();
      temp.fee_admission_category = admCategoryOptions
        .filter((val) => val.value === values.admcategoryId)
        .map((obj) => obj.label)
        .toString();
      temp.currency_short = currencyTypeOptions
        .filter((val) => val.value === values.currencyTypeId)
        .map((obj) => obj.label)
        .toString();

      await axios
        .post(`/api/finance/FeeTemplate`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate(
              `/FeetemplateSubamount/${res.data.data[0].fee_template_id}`,
              {
                replace: true,
              }
            );
            setAlertMessage({
              severity: "success",
              message: "Form created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};

      temp.active = true;
      temp.fee_template_id = feetempId;
      temp.fee_template_name = values.feeTemplateName;
      temp.ac_year_id = values.acYearId;
      temp.fee_admission_category_id = values.admcategoryId;
      temp.fee_admission_sub_category_id = values.admSubCategoryId;

      temp.is_nri = values.nri;
      temp.is_paid_at_board = values.paidAtBoard;
      temp.is_saarc = values.isSaarc;
      temp.program_type_id = values.programTypeId;
      temp.currency_type_id = values.currencyTypeId;
      temp.remarks = values.remarks;
      temp.school_id = values.schoolId;
      temp.program_id = values.programId;
      temp.program_specialization_id = values.programSpeId.toString();
      temp.program_specialization = values.programSpecialization;
      temp.fee_year1_amt = values.feeYearOne;
      temp.fee_year2_amt = values.feeYearTwo;
      temp.fee_year3_amt = values.feeYearThree;
      temp.fee_year4_amt = values.feeYearFour;
      temp.fee_year5_amt = values.feeYearFive;
      temp.fee_year6_amt = values.feeYearSix;
      temp.fee_year7_amt = values.feeYearSeven;
      temp.fee_year8_amt = values.feeYearEight;
      temp.fee_year9_amt = values.feeYearNine;
      temp.fee_year10_amt = values.feeYearTen;
      temp.fee_year11_amt = values.feeYearEleven;
      temp.fee_year12_amt = values.feeYearTwelve;
      temp.fee_year_total_amount = values.feeYearTotal;
      temp.approved_status = values.approvedStatus;
      temp.approved_date = values.approvedDate;
      temp.approved_by = values.approvedBy;

      await axios
        .put(`/api/finance/FeeTemplate/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/FeetemplateMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Fee Template Updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="admcategoryId"
              label="Admission Category"
              value={values.admcategoryId}
              options={admCategoryOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="admSubCategoryId"
              label="Admission Subcategory"
              value={values.admSubCategoryId}
              options={admSubCategoryOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programTypeId"
              label="Fee Scheme"
              value={values.programTypeId}
              options={programTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="currencyTypeId"
              label="Currency Type"
              value={values.currencyTypeId}
              options={currencyTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programId"
              label="Program"
              value={values.programId}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomMultipleAutocomplete
              name="programSpeId"
              label="Program Specialization"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              multiline
              rows={2}
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
              required
            />
          </Grid>
          <Grid item xs={12} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={isNew ? handleCreate : handleUpdate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{isNew ? "Create" : "Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default FeeTemplate;
