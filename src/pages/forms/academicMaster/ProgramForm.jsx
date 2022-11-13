import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  programName: "",
  programShortName: "",
};
const requiredFields = ["programName", "programShortName"];
function ProgramForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const [values, setValues] = useState(initialValues);
  const [isNew, setIsNew] = useState(true);

  const [programId, setProgramId] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const checks = {
    programName: [
      values.programName !== "",
      /^[A-Za-z ]+$/.test(values.programName),
    ],
    programShortName: [
      values.programShortName !== "",
      /^[A-Za-z ]{3}$/.test(values.programShortName),
    ],
  };
  const errorMessages = {
    programName: ["This field is required", "Enter only characters"],
    programShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
  };
  useEffect(() => {
    if (pathname.toLowerCase() === "/academicmaster/program/new") {
      setIsNew(true);

      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster" },
        { name: "Program" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramData();
    }
  }, []);

  const getProgramData = async () => {
    await axios.get(`${ApiUrl}/academic/Program/${id}`).then((res) => {
      setValues({
        programName: res.data.data.program_name,
        programShortName: res.data.data.program_short_name,
      });
      setProgramId(res.data.data.program_id);
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster" },
        { name: "Program" },
        { name: "Update" },
        { name: res.data.data.program_name },
      ]);
    });
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
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.program_name = values.programName;
      temp.program_short_name = values.programShortName;
      await axios
        .post(`${ApiUrl}/academic/Program`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Program Created",
            });
            navigate("/AcademicMaster", { replace: true });
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
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.program_id = programId;
      temp.program_name = values.programName;
      temp.program_short_name = values.programShortName;
      await axios
        .put(`${ApiUrl}/academic/Program/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Program Updated",
            });
            navigate("/AcademicMaster", { replace: true });
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
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="programShortName"
                  label="Short Name"
                  value={values.programShortName}
                  handleChange={handleChange}
                  inputProps={{
                    minLength: 3,
                    maxLength: 3,
                  }}
                  errors={errorMessages.programShortName}
                  checks={checks.programShortName}
                  fullWidth
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
                  <Grid item xs={2}>
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
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default ProgramForm;
