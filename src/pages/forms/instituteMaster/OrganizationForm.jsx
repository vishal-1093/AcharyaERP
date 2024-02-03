import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  orgName: "",
  orgShortName: "",
  localAddress: "",
};

const requiredFields = ["orgName", "orgShortName", "localAddress"];

function OrganizationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permanantStates, setPermanantStates] = useState([]);
  const [permanantCities, setPermanantCities] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    orgName: [values.orgName !== "", /^[A-Za-z ]+$/.test(values.orgName)],
    orgShortName: [
      values.orgShortName !== "",
      /^[A-Za-z ]{3,3}$/.test(values.orgShortName),
    ],
    localAddress: [values.localAddress !== ""],
  };

  const errorMessages = {
    orgName: ["This field required", "Enter Only Characters"],
    orgShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
    localAddress: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/institutemaster/organization/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Institute Master", link: "/InstituteMaster/Organization" },
        { name: "Organization" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getOrganizationData();
    }
  }, [pathname]);

  // const getCity = async () => {
  //   if (values.permanentCountry && values.permanantState) {
  //     await axios(
  //       `/api/City1/${values.permanantState}/${values.permanentCountry}`
  //     )
  //       .then((res) => {
  //         setPermanantCities(
  //           res.data.map((obj) => ({
  //             value: obj.id,
  //             label: obj.name,
  //           }))
  //         );
  //       })
  //       .catch((err) => console.error(err));
  //   }
  // };

  const getOrganizationData = async () => {
    await axios
      .get(`/api/institute/org/${id}`)
      .then((res) => {
        setValues({
          orgName: res.data.data.org_name,
          orgShortName: res.data.data.org_type,
          localAddress: res.data.data.address,
        });
        setOrgId(res.data.data.org_id);
        setCrumbs([
          { name: "Institute Master", link: "/InstituteMaster/Organization" },
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
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
      temp.address = values.localAddress;

      await axios
        .post(`/api/institute/org`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InstituteMaster/Organization", { replace: true });
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
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
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
      temp.address = values.localAddress;

      await axios
        .put(`/api/institute/org/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InstituteMaster/Organization", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Organization Updated",
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
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="orgName"
              label="Organization"
              value={values.orgName}
              handleChange={handleChange}
              checks={checks.orgName}
              errors={errorMessages.orgName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="orgShortName"
              label="Short Name"
              value={values.orgShortName}
              handleChange={handleChange}
              inputProps={{
                minLength: 3,
                maxLength: 3,
              }}
              checks={checks.orgShortName}
              errors={errorMessages.orgShortName}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="localAddress"
              label="Address"
              value={values.localAddress}
              handleChange={handleChange}
              checks={checks.localAddress}
              errors={errorMessages.localAddress}
              multiline
              rows={3}
              required
            />
          </Grid>
          {/* <Grid item xs={12} md={3}>
            <CustomTextField
              name="localAddress1"
              label="Address 2"
              value={values.localAddress1}
              handleChange={handleChange}
              checks={checks.localAddress1}
              errors={errorMessages.localAddress1}
              required
            />
          </Grid> */}
          {/* <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="permanantCity"
              label="City"
              value={values.permanantCity}
              options={permanantCities}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.permanantCity}
              errors={errorMessages.permanantCity}
              required
            />
          </Grid> */}
          {/* <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="permanantState"
              label="State"
              value={values.permanantState}
              options={permanantStates}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.permanantState}
              errors={errorMessages.permanantState}
              required
            />
          </Grid> */}
          {/* <Grid item xs={12} md={3}>
            <CustomTextField
              name="permanantPincode"
              label="Pincode"
              value={values.permanantPincode}
              handleChange={handleChange}
              checks={checks.permanantPincode}
              errors={errorMessages.permanantPincode}
              required
            />
          </Grid> */}

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

export default OrganizationForm;
