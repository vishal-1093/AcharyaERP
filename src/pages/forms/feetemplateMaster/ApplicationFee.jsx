import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() => import("../../../components/Inputs/CustomTextField"));
const CustomAutocomplete = lazy(() => import("../../../components/Inputs/CustomAutocomplete"));

const initialValues = {
  acYearId: "",
  programId: "",
  applicationFee: "",
  repeat: "",
};

const requiredFields = ["acYearId", "programId", "applicationFee"];

function ApplicationFee() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [programFeeAssignmentId, setProgramFeeAssignmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    applicationFee: [/^[0-9]{1,10}$/.test(values.applicationFee)],
    repeat: [/^[0-9]{1,10}$/.test(values.repeat)],
  };
  const errorMessages = {
    applicationFee: ["Enter only numbers"],
    repeat: ["Enter only numbers"],
  };

  useEffect(() => {
    getAcademicYearData();
    getProgramData();
    if (pathname.toLowerCase() === "/applicationfee") {
      setIsNew(true);
      setCrumbs([{ name: "ApplicationFee", link: "/ApplicationFeeIndex" }]);
    } else {
      setIsNew(false);
      getData();
    }
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/academic/programFeeAsssignment/${id}`)
      .then((res) => {
        setValues({
          acYearId: res.data.data.ac_year_id,
          programId: res.data.data.program_id,
          applicationFee: res.data.data.application_fee_1st_attempt,
          repeat: res.data.data.application_fee_2nd_attempt,
        });

        setProgramFeeAssignmentId(res.data.data.programFeeAsssignment_id);
        setCrumbs([{ name: "ApplicationFee", link: "/ApplicationFeeIndex" }]);
      })
      .catch((err) => console.error(err));
  };

  const getAcademicYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const data = [];
          res.data.data.forEach((obj) => {
            data.push({
            value: obj.ac_year_id,
            label: obj.ac_year,
            })
          })
        setAcademicYearOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getProgramData = async () => {
    await axios
      .get(`/api/academic/Program`)
      .then((res) => {
        const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.program_id,
              label: obj.program_name,
            })
          })
        setProgramOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.ac_year_id = values.acYearId;
      temp.program_id = values.programId;
      temp.application_fee_1st_attempt = values.applicationFee;
      temp.application_fee_2nd_attempt = values.repeat;
      await axios
        .post(`/api/academic/programFeeAsssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Created Successfully",
            });
            navigate("/ApplicationFeeIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
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

  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.programFeeAsssignment_id = programFeeAssignmentId;
      temp.ac_year_id = values.acYearId;
      temp.program_id = values.programId;
      temp.application_fee_1st_attempt = values.applicationFee;
      temp.application_fee_2nd_attempt = values.repeat;

      axios
        .put(`/api/academic/programFeeAsssignment/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Updated Successfully",
            });
            navigate("/ApplicationFeeIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
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
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acYearId"
              label="Ac Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
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
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="applicationFee"
              label="Application Fee in USD"
              value={values.applicationFee}
              handleChange={handleChange}
              checks={checks.applicationFee}
              errors={errorMessages.applicationFee}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="repeat"
              label="Repeat Fee in USD"
              value={values.repeat}
              handleChange={handleChange}
              checks={checks.repeat}
              errors={errorMessages.repeat}
              fullWidth
              required
            />
          </Grid>

          <Grid item textAlign="right">
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

export default ApplicationFee;
