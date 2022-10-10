import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  orgName: "",
  orgShortName: "",
};

const requiredFields = ["orgName", "orgShortName"];

function OrganizationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    if (pathname.toLowerCase() === "/institutemaster/organization/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "Institute Master", link: "/InstituteMaster" },
        { name: "Organization" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getOrganizationData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getOrganizationData = async () => {
    await axios(`${ApiUrl}/institute/org/${id}`)
      .then((res) => {
        setValues({
          orgName: res.data.data.org_name,
          orgShortName: res.data.data.org_type,
        });
        setOrgId(res.data.data.org_id);
        setCrumbs([
          { name: "Institute Master", link: "/InstituteMaster" },
          { name: "Organization" },
          { name: "Update" },
          { name: res.data.data.org_name },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "orgShortName") {
      setValues({
        ...values,
        [e.target.name]: e.target.value.toUpperCase(),
      });
    } else {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
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
      temp.org_name = values.orgName;
      temp.org_type = values.orgShortName;
      await axios
        .post(`${ApiUrl}/institute/org`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InstituteMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Organization created",
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
      temp.org_id = orgId;
      temp.org_name = values.orgName;
      temp.org_type = values.orgShortName;
      await axios
        .put(`${ApiUrl}/institute/org/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InstituteMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Organization created",
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
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="orgName"
              label="Organization"
              value={values.orgName}
              handleChange={handleChange}
              fullWidth
              errors={["This field required", "Enter Only Characters"]}
              checks={[
                values.orgName !== "",
                /^[A-Za-z ]+$/.test(values.orgName),
              ]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="orgShortName"
              label="Short Name"
              value={values.orgShortName}
              handleChange={handleChange}
              inputProps={{
                minLength: 3,
                maxLength: 3,
              }}
              fullWidth
              errors={[
                "This field required",
                "Enter characters and its length should be three",
              ]}
              checks={[
                values.orgShortName !== "",
                /^[A-Za-z ]{3,3}$/.test(values.orgShortName),
              ]}
              setFormValid={setFormValid}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={3} textAlign="right">
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

export default OrganizationForm;
