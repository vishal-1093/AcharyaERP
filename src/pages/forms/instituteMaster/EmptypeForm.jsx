import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import FormWrapper from "../../../components/FormWrapper";
import axios from "axios";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import ApiUrl from "../../../services/Api";

const initialValues = {
  empType: "",
  empTypeShortName: "",
};

const requiredFields = ["empType", "empTypeShortName"];

function EmptypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const [loading, setLoading] = useState(false);
  const [empId, setEmpId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    if (pathname.toLowerCase() === "/institutemaster/emptype/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "Institute Master", link: "/InstituteMaster" },
        { name: "Emptype" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getEmptypeData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getEmptypeData = async () => {
    await axios(`${ApiUrl}/employee/EmployeeType/${id}`)
      .then((res) => {
        setValues({
          empType: res.data.data.empType,
          empTypeShortName: res.data.data.empTypeShortName,
        });
        setEmpId(res.data.data.empTypeId);
        setCrumbs([
          { name: "Institute Master", link: "/InstituteMaster" },
          { name: "Emptype" },
          { name: "Update" },
          { name: res.data.data.empType },
        ]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (e) => {
    if (e.target.name === "empTypeShortName") {
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

  const handleCreate = async () => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.empType = values.empType;
      temp.empTypeShortName = values.empTypeShortName;
      await axios
        .post(`${ApiUrl}/employee/EmployeeType`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InstituteMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Emptype created",
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
              ? err.response.value.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.empTypeId = empId;
      temp.empType = values.empType;
      temp.empTypeShortName = values.empTypeShortName;
      await axios
        .put(`${ApiUrl}/employee/EmployeeType/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InstituteMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Emptype updated",
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
              ? err.response.value.message
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
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="empType"
              label="Employment type"
              value={values.empType}
              handleChange={handleChange}
              fullWidth
              errors={["This field required", "Enter Only Characters"]}
              checks={[
                values.empType !== "",
                /^[A-Za-z ]+$/.test(values.empType),
              ]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="empTypeShortName"
              label=" Short Name"
              value={values.empTypeShortName}
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
                minLength: 3,
                maxLength: 3,
              }}
              fullWidth
              errors={[
                "This field required",
                "Enter characters and its length should be three",
              ]}
              checks={[
                values.empTypeShortName !== "",
                /^[A-Za-z ]{3}$/.test(values.empTypeShortName),
              ]}
              setFormValid={setFormValid}
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
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default EmptypeForm;
