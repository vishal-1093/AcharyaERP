import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { useNavigate, useParams } from "react-router-dom";
import ApiUrl from "../../services/Api";
import axios from "axios";
import CustomAlert from "../../components/CustomAlert";
function OrganizationUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({
    org_name: "",
    org_type: "",
  });
  const [formValid, setFormValid] = useState({
    org_name: false,
    org_type: false,
  });

  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });
  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    axios.get(`${ApiUrl}/institute/org/${id}`).then((response) => {
      setData(response.data.data);
    });
  };
  useEffect(() => {
    getData();
  }, []);
  const handleChange = (e) => {
    if (e.target.name == "org_type") {
      setData({
        ...data,
        [e.target.name]: e.target.value.toUpperCase(),
        active: true,
      });
    } else {
      setData({ ...data, [e.target.name]: e.target.value, active: true });
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
      await axios
        .put(`${ApiUrl}/institute/org/${id}`, data)
        .then((response) => {
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/InstituteMaster/OrganizationIndex", { replace: true });
        });
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <CustomAlert
          open={alertOpen}
          setOpen={setAlertOpen}
          severity={alertMessage.severity}
          message={alertMessage.message}
        />
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
                  name="org_name"
                  label="Organization"
                  handleChange={handleChange}
                  value={data.org_name ?? ""}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    data.org_name !== "",
                    /^[A-Za-z ]+$/.test(data.org_name),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="org_type"
                  label="Short Name"
                  disabled
                  value={data.org_type ?? ""}
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
                    data.org_type !== "",
                    /^[A-Za-z ]{3,3}$/.test(data.org_type),
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
                        <strong>Update</strong>
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
export default OrganizationUpdate;
