import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initValues = {
  intervalType: "",
  shortName: "",
  remarks: "",
  showBatch: "No",
  outsideCampus: "No",
  showAttendence: "No",
  allowMultipleStaff: "No",
};

const requiredFields = ["intervalType", "shortName"];

function TimeIntervalTypesForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [intervalTypeId, setintervalTypeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/sectionmaster/intervaltype/new") {
      setIsNew(true);
      setCrumbs([
        { name: "SectionMaster", link: "/SectionMaster/IntervalTypes" },
        { name: "IntervalTypes " },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getTimeItervalData();
    }
  }, [pathname]);

  const checks = {
    intervalType: [values.intervalType !== ""],
    shortName: [values.shortName !== ""],
  };

  const errorMessages = {
    intervalType: ["This field required"],
    shortName: ["This field is required"],
  };

  const getTimeItervalData = async () => {
    await axios
      .get(`/api/academic/TimeIntervalTypes/${id}`)
      .then((res) => {
        setValues({
          intervalType: res.data.data.intervalTypeName,
          shortName: res.data.data.intervalTypeShort,
          remarks: res.data.data.remarks,
          showBatch: res.data.data.showBatch,
          outsideCampus: res.data.data.outside,
          showAttendence: res.data.data.showAttendance,
          allowMultipleStaff: res.data.data.allowMultipleStaff,
        });
        setintervalTypeId(res.data.data.intervalTypeId);
        setCrumbs([
          { name: "SectionMaster", link: "/SectionMaster/IntervalTypes" },
          { name: "IntervalTypes" },
          { name: "Update" },
          { name: res.data.data.intervalTypeName },
        ]);
      })
      .catch((error) => console.error(error));
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
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.intervalTypeName = values.intervalType;
      temp.intervalTypeShort = values.shortName;
      temp.remarks = values.remarks;
      temp.showBatch = values.showBatch;
      temp.outside = values.outsideCampus;
      temp.showSubject = values.showSubject;
      temp.showAttendance = values.showAttendence;
      temp.allowMultipleStaff = values.allowMultipleStaff;

      await axios
        .post(`/api/academic/TimeIntervalTypes`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/SectionMaster/IntervalTypes", { replace: true });
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
          console.error(err);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.intervalTypeId = intervalTypeId;
      temp.intervalTypeName = values.intervalType;
      temp.intervalTypeShort = values.shortName;
      temp.remarks = values.remarks;
      temp.showBatch = values.showBatch;
      temp.outside = values.outsideCampus;
      temp.showSubject = values.showSubject;
      temp.showAttendance = values.showAttendence;
      temp.allowMultipleStaff = values.allowMultipleStaff;

      await axios
        .put(`/api/academic/TimeIntervalTypes/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/SectionMaster/IntervalTypes", { replace: true });
          } else {
            setLoading(false);
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
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="intervalType"
              label="Interval Type Name"
              value={values.intervalType}
              handleChange={handleChange}
              checks={checks.intervalType}
              errors={errorMessages.intervalType}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              inputProps={{ style: { textTransForm: "uppercase" } }}
              handleChange={handleChange}
              checks={checks.shortName}
              errors={errorMessages.shortName}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={2}
              value={values.remarks}
              label="Remarks"
              name="remarks"
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="showBatch"
              label="Show Batch"
              value={values.showBatch}
              items={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="outsideCampus"
              label=" Outside Campus"
              value={values.outsideCampus}
              items={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="showAttendence"
              label="Show Attendence"
              value={values.showAttendence}
              items={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="allowMultipleStaff"
              label="Allow Multiple Staff"
              value={values.allowMultipleStaff}
              items={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6} textAlign="right">
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

export default TimeIntervalTypesForm;
