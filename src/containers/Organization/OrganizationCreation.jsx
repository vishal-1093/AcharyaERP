import { useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { gridFilterActiveItemsLookupSelector } from "@mui/x-data-grid";
import useAlert from "../../hooks/useAlert";

const initialValues = {
  orgName: "",
  orgShortName: "",
};

function OrganizationCreation() {
  const [data, setData] = useState(initialValues);
  const [formValid, setFormValid] = useState({
    orgName: false,
    orgShortName: false,
  });
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "orgShortName") {
      setData({
        ...data,
        [e.target.name]: e.target.value.toUpperCase(),
        active: true,
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        active: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      const temp = {};

      temp.org_name = data.orgName;
      temp.org_type = data.orgShortName;
      temp.active = true;
      await axios
        .post(`${ApiUrl}/institute/org`, temp)
        .then((response) => {
          setLoading(gridFilterActiveItemsLookupSelector);
          console.log(response);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/InstituteMaster", { replace: true });
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
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="orgName"
                  label="Organization"
                  value={data.orgName}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    data.orgName !== "",
                    /^[A-Za-z ]+$/.test(data.orgName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="orgShortName"
                  label="Short Name"
                  value={data.orgShortName}
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
                    data.orgShortName !== "",
                    /^[A-Za-z ]{3,3}$/.test(data.orgShortName),
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
                      onClick={handleSubmit}
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        <strong>Submit</strong>
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
export default OrganizationCreation;
