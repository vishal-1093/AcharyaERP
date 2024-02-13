import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  programName: "",
  programShortName: "",
  displayName: "",
  programCode: "",
};

const requiredFields = ["programName", "programShortName", "programCode"];

function ProgramForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [programId, setProgramId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    programName: [
      values.programName !== "",
      /^[A-Za-z `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]+$/.test(values.programName),
    ],
    programShortName: [values.programShortName !== ""],
    programCode: [
      values.shortName !== "",
      /^[A-Za-z ]{1,2}$/.test(values.programCode),
    ],
  };
  const errorMessages = {
    programName: ["This field is required", "Enter only characters"],
    programShortName: ["This field required"],
    programCode: [
      "This field required",
      "Enter characters and its length should be 2",
    ],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/academicmaster/program/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Academic Master", link: "/AcademicMaster/Program" },
        { name: "Program" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramData();
    }
  }, []);

  const getProgramData = async () => {
    await axios
      .get(`/api/academic/Program/${id}`)
      .then((res) => {
        setValues({
          programName: res.data.data.program_name,
          programShortName: res.data.data.program_short_name,
          displayName: res.data.data.display_name,
          programCode: res.data.data.program_code,
        });
        setProgramId(res.data.data.program_id);
        setCrumbs([
          { name: "Academic Master", link: "/AcademicMaster/Program" },
          { name: "Program" },
          { name: "Update" },
          { name: res.data.data.program_name },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "programShortName") {
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
      temp.program_name = values.programName;
      temp.program_short_name = values.programShortName.toUpperCase();
      temp.display_name = values.displayName;
      temp.program_code = values.programCode;

      await axios
        .post(`/api/academic/Program`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Program created successfully !!",
            });
            navigate("/AcademicMaster/Program", { replace: true });
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
      temp.program_id = programId;
      temp.program_name = values.programName;
      temp.program_short_name = values.programShortName.toUpperCase();
      temp.display_name = values.displayName;
      temp.program_code = values.programCode;

      await axios
        .put(`/api/academic/Program/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Program updated successfully !!",
            });
            navigate("/AcademicMaster/Program", { replace: true });
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
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="programName"
              label="Program"
              value={values.programName}
              handleChange={handleChange}
              errors={errorMessages.programName}
              checks={checks.programName}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="programShortName"
              label="Short Name"
              value={values.programShortName}
              handleChange={handleChange}
              errors={errorMessages.programShortName}
              checks={checks.programShortName}
              inputProps={{
                minLength: 1,
                maxLength: 5,
              }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="displayName"
              label="Display Name"
              value={values.displayName}
              handleChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="programCode"
              label="Program Code"
              value={values.programCode}
              handleChange={handleChange}
              errors={errorMessages.programCode}
              checks={checks.programCode}
              disabled={!isNew}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} align="right">
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

export default ProgramForm;
