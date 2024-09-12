import { useState, lazy, useEffect } from "react";
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import FormWrapper from "../../../components/FormWrapper.jsx";
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);

const initialState = {
  fcYear: "",
  fcList: [],
  schoolList: [],
  schoolId: "",
  deptList: [],
  deptId: "",
  loading: false,
};

const FinancialyearBudget = () => {
  const [
    { fcYear, fcList, schoolList, schoolId, deptList, deptId, loading },
    setState,
  ] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Financial year Budget" ,link:"FinancialYearBudgetIndex"},{ name: "Filter"}]);
    getFcYearData();
  }, []);

  const getFcYearData = async () => {
    try {
      const res = await axios.get("/api/FinancialYear");
      if ((res.status = 200 || res.status == 201)) {
        const list = res.data.data?.map((ele) => ({
          value: ele.financial_year_id,
          label: ele.financial_year,
        }));
        setState((prevState) => ({
          ...prevState,
          fcList: list,
        }));
        getSchoolData();
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const getSchoolData = async () => {
    try {
      const res = await axios.get("/api/institute/school");
      if ((res.status = 200 || res.status == 201)) {
        const list = res.data.data?.map((ele) => ({
          value: ele.school_id,
          label: ele.school_name,
        }));
        setState((prevState) => ({
          ...prevState,
          schoolList: list,
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const getDeptData = async (schoolId) => {
    try {
      if (!!schoolId) {
        const res = await axios.get(
          `/api/finance/getDeptDetailsBasedOnSchoolId/${schoolId}`
        );
        if ((res.status = 200 || res.status == 201)) {
          const list = res.data.data?.map((ele) => ({
            value: ele.dept_id,
            label: ele.dept_name_short,
          }));
          setState((prevState) => ({
            ...prevState,
            deptList: list,
          }));
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "schoolId") getDeptData(newValue);
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      actionAfterResponse();
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const actionAfterResponse = () => {
    setLoading(false);
    navigate("/FinancialyearBudgetForm", {
      replace: true,
      state: {
        financial_year_id: fcYear,
        school_id: schoolId,
        dept_id: deptId,
      },
    });
    setAlertMessage({
      severity: "success",
      message: `Budget created successfully !!`,
    });
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="fcYear"
              label="Financial Year"
              value={fcYear || ""}
              options={fcList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={schoolId || ""}
              options={schoolList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="deptId"
              label="Department"
              value={deptId || ""}
              options={deptList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !fcYear || !schoolId || !deptId}
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default FinancialyearBudget;
