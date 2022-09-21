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

const requiredFields = ["roleName", "roleShortName", "roleDesc"];

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
    if (pathname.toLowerCase() === "/roleform/new") {
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
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
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
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/RoleIndex", { replace: true });
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.res ? error.res.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async (e) => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Error",
      });
      setAlertOpen(true);
    } else {
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
          setLoading(true);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/RoleIndex", { replace: true });
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
            message: error.res ? error.res.data.message : "Error",
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
                errors={["This field required"]}
                checks={[values.roleName !== ""]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="roleDesc"
                label="Description"
                value={values.roleDesc}
                handleChange={handleChange}
                errors={["This field required"]}
                multiline
                rows={2}
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
    </>
  );
}
export default RoleForm;
