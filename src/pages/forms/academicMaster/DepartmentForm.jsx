import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import IconSelector from "../../../components/Inputs/IconSelector";

const initialValues = {
  deptName: "",
  deptShortName: "",
  webStatus: "No",
  commonService: "no",
  noDue: "no",
  iconName: "",
  comments: "",
};

const requiredFields = [
  "deptName",
  "deptShortName",
  "webStatus",
  "commonService",
  "noDue",
];

function DepartmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [deptId, setDeptId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    deptName: [values.deptName !== "", /^[A-Za-z ]+$/.test(values.deptName)],
    deptShortName: [values.deptShortName !== ""],
    webStatus: [values.webStatus !== ""],
    commonService: [values.commonService !== ""],
    noDue: [values.noDue !== ""],
  };

  const errorMessages = {
    deptName: ["This field required", "Enter Only Characters"],
    deptShortName: ["This field required"],
    webStatus: ["This field is required"],
    commonService: ["This field is required"],
    noDue: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/academicmaster/department/new") {
      setIsNew(true);

      setCrumbs([
        { name: "Academic Master", link: "/AcademicMaster/Department" },
        { name: "Department" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getDepartmentData();
    }
  }, [pathname]);

  const getDepartmentData = async () => {
    await axios
      .get(`/api/dept/${id}`)
      .then((res) => {
        setValues({
          deptName: res.data.data.dept_name,
          deptShortName: res.data.data.dept_name_short,
          webStatus: res.data.data.web_status,
          commonService:
            res.data.data.common_service === true
              ? "yes"
              : res.data.data.common_service === false
              ? "no"
              : "",
          noDue:
            res.data.data.no_dues_status === true
              ? "yes"
              : res.data.data.no_dues_status === false
              ? "no"
              : "",
          iconName: res.data.data.dept_icon,
        });
        setDeptId(res.data.data.dept_id);
        setCrumbs([
          { name: "Academic Master", link: "/AcademicMaster/Department" },
          { name: "Department" },
          { name: "Update" },
          { name: res.data.data.dept_name },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "deptShortName") {
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

  const handleSelectIcon = (icon) => {
    setValues((prev) => ({
      ...prev,
      iconName: icon,
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.dept_name = values.deptName;
      temp.dept_name_short = values.deptShortName;
      temp.web_status = values.webStatus;
      temp.common_service =
        values.commonService === "yes"
          ? true
          : values.commonService === "no"
          ? false
          : "";
      temp.no_dues_status =
        values.noDue === "yes" ? true : values.noDue === "no" ? false : "";
      temp.dept_icon = values.iconName;
      temp.comments = values.comments;

      await axios
        .post(`/api/dept`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AcademicMaster/Department", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Department created successfully !!",
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
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.dept_id = deptId;
      temp.dept_name = values.deptName;
      temp.dept_name_short = values.deptShortName;
      temp.web_status = values.webStatus;
      temp.common_service =
        values.commonService === "yes"
          ? true
          : values.commonService === "no"
          ? false
          : "";
      temp.no_dues_status =
        values.noDue === "yes" ? true : values.noDue === "no" ? false : "";
      temp.dept_icon = values.iconName;
      temp.comments = values.comments;

      await axios
        .put(`/api/dept/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Department updated successfully !!",
            });
            navigate("/AcademicMaster/Department", { replace: true });
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
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
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

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="deptShortName"
              label="Short Name"
              value={values.deptShortName}
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              fullWidth
              errors={errorMessages.deptShortName}
              checks={checks.deptShortName}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
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

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="commonService"
              label="Common Service"
              value={values.commonService}
              items={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              errors={errorMessages.commonService}
              checks={checks.commonService}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="noDue"
              label="No Dues"
              value={values.noDue}
              items={[
                {
                  value: "yes",
                  label: "Yes",
                },
                {
                  value: "no",
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              errors={errorMessages.noDue}
              checks={checks.noDue}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              rows={2}
              multiline
              name="comments"
              label="Comments"
              value={values.comments}
              handleChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {values.commonService === "yes" ? (
            <Grid item xs={12}>
              <IconSelector
                value={values.iconName}
                onSelectIcon={handleSelectIcon}
              />
            </Grid>
          ) : (
            <></>
          )}

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

export default DepartmentForm;
