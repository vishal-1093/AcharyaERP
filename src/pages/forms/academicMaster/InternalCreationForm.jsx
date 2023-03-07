import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  internalName: "",
  shortName: "",
};

const requiredFields = ["internalName", "shortName"];

function InternalCreationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [internalId, setInternalId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    internalName: [
      values.internalName !== "",
      /^[A-Za-z ]+$/.test(values.internalName),
    ],
    shortName: [values.shortName !== "", /^[A-Za-z ]+$/.test(values.shortName)],
  };

  const errorMessages = {
    internalName: ["This field is required", "Enter only characters"],
    shortName: ["This field required", "Enter only characters"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/academicmaster/internal/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster/Internal" },
        { name: "Internal Type" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramData();
    }
  }, []);

  const getProgramData = async () => {
    await axios
      .get(`/api/academic/InternalTypes/${id}`)
      .then((res) => {
        setValues({
          internalName: res.data.data.internal_name,
          shortName: res.data.data.internal_short_name,
        });
        setInternalId(res.data.data.internal_master_id);
        setCrumbs([
          { name: "AcademicMaster", link: "/AcademicMaster/Internal" },
          { name: "Internal Type" },
          { name: "Update" },
          { name: res.data.data.internal_name },
        ]);
      })
      .catch((err) => console.error(err));
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
      temp.internal_name = values.internalName;
      temp.internal_short_name = values.shortName;
      await axios
        .post(`/api/academic/InternalTypes`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Internal Type Created",
            });
            navigate("/AcademicMaster/Internal", { replace: true });
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
      temp.internal_master_id = internalId;
      temp.internal_name = values.internalName;
      temp.internal_short_name = values.shortName;
      await axios
        .put(`/api/academic/InternalTypes/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Internal Type Updated",
            });
            navigate("/AcademicMaster/Internal", { replace: true });
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
          justifyContent="flex-end"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="internalName"
              label="Internal Type"
              value={values.internalName}
              handleChange={handleChange}
              errors={errorMessages.internalName}
              checks={checks.internalName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              errors={errorMessages.shortName}
              checks={checks.shortName}
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

export default InternalCreationForm;
