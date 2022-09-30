import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import ApiUrl from "../../services/Api";
import axios from "axios";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";

const initialValues = {
  roleName: "",
  roleShortName: "",
  roleDesc: "",
  access: "",
  backDate: "",
};

const requiredFields = [
  "roleName",
  "roleShortName",
  "roleDesc",
  "access",
  "backDate",
];

function RoleForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [roleId, setRoleId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/navigationmaster/role/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
    } else {
      setIsNew(false);
      getData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getData = async () => {
    await axios
      .get(`${ApiUrl}/Roles/${id}`)
      .then((res) => {
        const data = res.data.data;

        setValues({
          roleName: data.role_name,
          roleShortName: data.role_short_name,
          roleDesc: data.role_desc,
          id: data.role_id,
          access: data.access,
          backDate: data.back_date,
        });
        setRoleId(data.role_id);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "roleShortName") {
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

  const handleCreate = async (e) => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.role_name = values.roleName;
      temp.role_short_name = values.roleShortName;
      temp.role_desc = values.roleDesc;
      temp.access = values.access;
      temp.back_date = values.backDate;
      await axios
        .post(`${ApiUrl}/Roles`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Role created",
            });
            navigate("/NavigationMaster/Role/New", { replace: true });
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
            message: err.res ? err.res.data.message : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async (e) => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.role_name = values.roleName;
      temp.role_short_name = values.roleShortName;
      temp.role_desc = values.roleDesc;
      temp.role_id = values.id;
      temp.access = values.access;
      temp.back_date = values.backDate;
      await axios
        .put(`${ApiUrl}/Roles/${roleId}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Role updated",
            });
            navigate("/RoleIndex", { replace: true });
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
            message: err.res ? err.res.data.message : "An error occured",
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
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="roleName"
              label="Role Name"
              value={values.roleName}
              handleChange={handleChange}
              errors={["This field required"]}
              checks={[values.roleName !== ""]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="roleShortName"
              label="Short Name"
              value={values.roleShortName}
              handleChange={handleChange}
              errors={[
                "This field required",
                "Enter characters and its length should be three",
              ]}
              checks={[
                values.roleShortName !== "",
                /^[A-Za-z ]{3,3}$/.test(values.moduleShortName),
              ]}
              setFormValid={setFormValid}
              required
              inputProps={{
                minLength: 3,
                maxLength: 3,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={2}
              name="roleDesc"
              label="Description"
              value={values.roleDesc}
              handleChange={handleChange}
              errors={["This field required"]}
              checks={[values.roleName !== ""]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="access"
              label="HR Access"
              value={values.access}
              items={[
                {
                  value: "true",
                  label: "Yes",
                },
                {
                  value: "false",
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="backDate"
              label="Leave Initiation"
              value={values.backDate}
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
              setFormValid={setFormValid}
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

export default RoleForm;
