import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initValues = {
  graduationName: "",
  shortName: "",
};

const requiredFields = ["graduationName", "shortName"];

function GraduationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [graduationId, setGraduationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    graduationName: [values.graduationName !== ""],
    shortName: [
      values.shortName !== "",
      /^[A-Za-z ]{1,2}$/.test(values.shortName),
    ],
  };

  const errorMessages = {
    graduationName: ["This field required"],
    shortName: [
      "This field required",
      "Enter characters and its length should be 2",
    ],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/institutemaster/graduation/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Institute Master", link: "/InstituteMaster/Graduation" },
        { name: "Graduation" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getGraduationData();
    }
  }, [pathname]);

  const getGraduationData = async () => {
    await axios
      .get(`/api/employee/graduation/${id}`)
      .then((res) => {
        setValues({
          graduationName: res.data.data.graduation_name,
          shortName: res.data.data.graduation_name_short,
        });
        setGraduationId(res.data.data.graduation_id);
        setCrumbs([
          { name: "Institute Master", link: "/InstituteMaster/graduation" },
          { name: "Graduation" },
          { name: "Update" },
          { name: res.data.data.graduation_name },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
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
      temp.graduation_name = values.graduationName;
      temp.graduation_name_short = values.shortName.toUpperCase();

      await axios
        .post(`/api/employee/graduation`, temp)
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
          navigate("/InstituteMaster/Graduation", { replace: true });
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
      temp.graduation_id = graduationId;
      temp.graduation_name = values.graduationName;
      temp.graduation_name_short = values.shortName.toUpperCase();

      await axios
        .put(`/api/employee/graduation/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/InstituteMaster/Graduation", { replace: true });
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
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="graduationName"
              label="Graduation Name"
              value={values.graduationName}
              handleChange={handleChange}
              checks={checks.graduationName}
              errors={errorMessages.graduationName}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              value={values.shortName}
              checks={checks.shortName}
              errors={errorMessages.shortName}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              textAlign="right"
            >
              <Grid item xs={4} md={2}>
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
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default GraduationForm;
