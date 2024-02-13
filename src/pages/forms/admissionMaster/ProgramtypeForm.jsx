import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";

const initialValues = {
  programTypeName: "",
  programTypeShortName: "",
};

const requiredFields = ["programTypeName", "programTypeShortName"];

function ProgramtypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [programTypeId, setProgramTypeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    programTypeName: [
      values.programTypeName !== "",
      /^[A-Za-z ]+$/.test(values.programTypeName),
    ],
    programTypeShortName: [
      values.programTypeShortName !== "",
      /^[A-Za-z ]{3}$/.test(values.programTypeShortName),
    ],
  };
  const errorMessages = {
    programTypeName: ["This field is required", "Enter only characters"],
    programTypeShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/admissionmaster/programtype/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AdmissionMaster", link: "/AdmissionMaster/Course" },
        { name: "Program Type" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramTypeData();
    }
  }, []);

  const getProgramTypeData = async () => {
    await axios
      .get(`/api/academic/ProgramType/${id}`)
      .then((res) => {
        setValues({
          programTypeName: res.data.data.program_type_name,
          programTypeShortName: res.data.data.program_type_code,
        });
        setProgramTypeId(res.data.data.program_type_id);
        setCrumbs([
          { name: "AdmissionMaster", link: "/AdmissionMaster/Course" },
          { name: "Program Type" },
          { name: "Update" },
          { name: res.data.data.program_type_name },
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
      temp.program_type_name = values.programTypeName;
      temp.program_type_code = values.programTypeShortName.toUpperCase();
      await axios
        .post(`/api/academic/ProgramType`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AdmissionMaster/Course", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Programtype Created",
            });
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
      temp.program_type_id = programTypeId;
      temp.program_type_name = values.programTypeName;
      temp.program_type_code = values.programTypeShortName.toUpperCase();

      await axios
        .put(`/api/academic/ProgramType/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AdmissionMaster/Course", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Currencytype Created",
            });
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
            rowSpacing={{ xs: 2, md: 4 }}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="programTypeName"
                  label="Term Type"
                  value={values.programTypeName}
                  handleChange={handleChange}
                  errors={errorMessages.programTypeName}
                  checks={checks.programTypeName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="programTypeShortName"
                  label="Short Name"
                  value={values.programTypeShortName}
                  handleChange={handleChange}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                    minLength: 3,
                    maxLength: 3,
                  }}
                  errors={errorMessages.programTypeShortName}
                  checks={checks.programTypeShortName}
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
export default ProgramtypeForm;
