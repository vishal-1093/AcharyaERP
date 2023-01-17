import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  mentorId: null,
  remarks: "",
};

const requiredFields = ["mentorId", "remarks"];

function ProctorheadForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [mentorOptions, setMentorOptions] = useState([]);
  const [proctorId, setProctorId] = useState([]);
  const checks = {
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    remarks: ["This field required"],
  };

  useEffect(() => {
    getEmailOptions();
    if (pathname.toLowerCase() === "/mentormaster/mentor/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Mentor Master", link: "/MentorMaster/Mentor" },
        { name: "Mentor Head" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProctorData();
    }
  }, [pathname]);

  const getEmailOptions = async () => {
    await axios
      .get(`/api/employee/activeEmployeeDetailsForProctor`)
      .then((res) => {
        setMentorOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.employee_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProctorData = async () => {
    await axios
      .get(`/api/proctor/ProctorHead/${id}`)
      .then((res) => {
        console.log(res);
        setValues({
          mentorId: res.data.data.emp_id,
          remarks: res.data.data.remarks,
        });
        setProctorId(res.data.data.chief_proctor_id);
        setCrumbs([
          { name: "Mentor Master", link: "/MentorMaster/Mentor" },
          { name: "Mentor Head" },
          { name: "Update" },
        ]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChangeAdvance = (name, newValue) => {
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
      temp.emp_id = values.mentorId;
      temp.remarks = values.remarks;
      await axios
        .post(`/api/proctor/ProctorHead`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/MentorMaster/Mentor", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Proctor Head created",
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
      temp.chief_proctor_id = proctorId;
      temp.emp_id = values.mentorId;
      temp.remarks = values.remarks;
      await axios
        .put(`/api/proctor/ProctorHead/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/MentorMaster/Mentor", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Proctor Head updated",
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
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="mentorId"
              label="Mentor Head"
              value={values.mentorId}
              options={mentorOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
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

export default ProctorheadForm;
