import { useState, useEffect, useMemo } from "react";
import axios from "../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import useAlert from "../hooks/useAlert";
import CustomSelect from "../components/Inputs/CustomSelect";

const requiredFields = ["jobTypeId"];

const initialState = {
  jobTypeId: null,
  loading: false,
  jobShortName: "",
};

export function JobTypeChange({
  jobTypeId,
  jobShortName,
  jobTypeLists,
  empId,
  handleJobTypeModal,
  getData,
}) {
  const [state, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();

  useMemo(() => {
    setState((prevState) => ({
      ...prevState,
      jobTypeId: jobTypeId,
      jobShortName: jobShortName,
    }));
  }, [jobTypeId]);

  const checks = {
    jobTypeId: [state.jobTypeId !== null],
  };

  const errorMessages = {
    jobTypeId: ["This field required"],
  };

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      jobShortName: jobTypeLists.find((el) => el.job_type_id == e.target.value)
        .job_short_name,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!state[field]) return false;
    }
    return true;
  };

  const isLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleUpdate = async () => {
    isLoading(true);
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      let payload = {
        emp_id: empId,
        job_type_id: state.jobTypeId,
        job_short_name: !!state.jobShortName ? `<font color='blue'>${state.jobShortName || ""}</font>` : jobShortName,
      };
      await axios
        .put(`/api/employee/updateJobTypeOfEmployee/${empId}`, payload)
        .then((res) => {
          isLoading(false);
          if (res.status === 200 || res.status === 201) {
            handleJobTypeModal();
            setAlertMessage({
              severity: "success",
              message: "Job type updated successfully !!",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
          getData();
        })
        .catch((err) => {
          isLoading(false);
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
    <>
      <Box component="form" overflow="auto" p={1}>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={12}>
            <CustomSelect
              name="jobTypeId"
              label="Job Type"
              items={jobTypeLists}
              value={state.jobTypeId}
              handleChange={handleChange}
              checks={checks.jobTypeId}
              errors={errorMessages.jobTypeId}
              required
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={state.jobTypeId == null || state.loading}
              onClick={handleUpdate}
            >
              {!!state.loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Update</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
