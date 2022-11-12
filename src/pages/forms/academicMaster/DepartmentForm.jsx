import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const initialValues = {
  deptName: "",
  deptShortName: "",
  webStatus: "",
  commonService: "",
};
const requiredFields = [
  "deptName",
  "deptShortName",
  "webStatus",
  "commonService",
];

function DepartmentForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [deptId, setDeptId] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const checks = {
    deptName: [values.deptName !== "", /^[A-Za-z ]+$/.test(values.deptName)],
    deptShortName: [
      values.deptShortName !== "",
      /^[A-Za-z ]{3}$/.test(values.deptShortName),
    ],
    webStatus: [values.webStatus !== ""],
    commonService: [values.commonService !== ""],
  };

  const errorMessages = {
    deptName: ["This field required", "Enter Only Characters"],
    deptShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
    webStatus: ["This field is required"],
    commonService: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/academicmaster/department/new") {
      setIsNew(true);

      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster" },
        { name: "Department" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getDepartmentData();
    }
  }, [pathname]);

  const getDepartmentData = async () => {
    await axios.get(`${ApiUrl}/dept/${id}`).then((res) => {
      setValues({
        deptName: res.data.data.dept_name,
        deptShortName: res.data.data.dept_name_short,
        webStatus: res.data.data.web_status,
        commonService: res.data.data.common_service,
      });
      setDeptId(res.data.data.dept_id);
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster" },
        { name: "Department" },
        { name: "Update" },
        { name: res.data.data.dept_name },
      ]);
    });
  };

  const handleChange = (e) => {
    if (e.target.name == "deptShortName") {
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
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.dept_name = values.deptName;
      temp.dept_name_short = values.deptShortName;
      temp.web_status = values.webStatus;
      temp.common_service = values.commonService;
      await axios
        .post(`${ApiUrl}/dept`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AcademicMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Department Created",
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
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.dept_id = deptId;
      temp.dept_name = values.deptName;
      temp.dept_name_short = values.deptShortName;
      temp.web_status = values.webStatus;
      temp.common_service = values.commonService;
      await axios
        .put(`${ApiUrl}/dept/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Department Updated",
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
                  name="deptName"
                  label="Department"
                  value={values.deptName}
                  handleChange={handleChange}
                  fullWidth
                  errors={errorMessages.deptName}
                  checks={checks.deptName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="deptShortName"
                  label="Short Name"
                  value={values.deptShortName}
                  handleChange={handleChange}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                    minLength: 3,
                    maxLength: 3,
                  }}
                  fullWidth
                  errors={errorMessages.deptShortName}
                  checks={checks.deptShortName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomRadioButtons
                  name="webStatus"
                  label="Web Status "
                  value={values.webStatus}
                  items={[
                    {
                      value: "Yes",
                      label: "Yes",
                    },
                    {
                      value: "No",
                      label: "No",
                    },
                  ]}
                  handleChange={handleChange}
                  errors={errorMessages.webStatus}
                  checks={checks.webStatus}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomRadioButtons
                  name="commonService"
                  label="Common Service"
                  value={values.commonService}
                  items={[
                    {
                      value: true,
                      label: "Yes",
                    },
                    {
                      value: false,
                      label: "No",
                    },
                  ]}
                  handleChange={handleChange}
                  errors={errorMessages.commonService}
                  checks={checks.commonService}
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
export default DepartmentForm;
