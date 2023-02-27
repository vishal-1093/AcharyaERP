import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { useNavigate, useLocation } from "react-router-dom";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import axios from "../../services/Api";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";

const initialValues = {
  userName: "",
  email: "",
  userType: "",
  roleId: "",
};

const requiredFields = ["userName", "userType", "roleId"];

function UserForm() {
  const [values, setValues] = useState(initialValues);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();

  const checks = {
    userName: [values.userName !== ""],
    userType: [values.userType !== ""],
    roleId: [values.roleId !== ""],
  };

  const errorMessages = {
    userName: ["This field required"],
    userType: ["This field required"],
    roleId: ["This field required"],
  };

  useEffect(() => {
    setCrumbs([{ name: "Users", link: "/UserIndex" }, { name: "Create" }]);
    getRoleOptions();
  }, [pathname]);

  const getRoleOptions = async () => {
    await axios
      .get(`/api/Roles`)
      .then((res) => {
        setRoleOptions(
          res.data.data.map((obj) => ({
            value: obj.role_id,
            label: obj.role_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "userName") {
      const email = e.target.value
        ? e.target.value.replace(/ +/g, "") + "@acharya.ac.in"
        : e.target.value.replace(/ +/g, "");
      setValues((prev) => ({
        ...prev,
        userName: e.target.value.replace(/ +/g, ""),
        email: email,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
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
      const temp = {};
      temp.active = true;
      temp.username = values.userName;
      temp.email = values.email;
      temp.usertype = values.userType;
      temp.role_id = [values.roleId];
      setLoading(true);
      await axios
        .post(`/api/UserAuthentication`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
            navigate("/UserIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
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
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={3.5}>
            <CustomTextField
              name="userName"
              label="Username"
              value={values.userName}
              handleChange={handleChange}
              checks={checks.userName}
              errors={errorMessages.userName}
              required
            />
          </Grid>
          <Grid item xs={12} md={3.5}>
            <CustomTextField name="email" label="Email" value={values.email} />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="userType"
              label="User Type"
              value={values.userType}
              items={[
                {
                  value: "staff",
                  label: "Staff",
                },
                {
                  value: "student",
                  label: "Student",
                },
              ]}
              handleChange={handleChange}
              checks={checks.userType}
              errors={errorMessages.userType}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="roleId"
              label="Role"
              value={values.roleId}
              options={roleOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.roleId}
              errors={errorMessages.roleId}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Create</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default UserForm;
