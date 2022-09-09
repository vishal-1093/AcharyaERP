import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { useNavigate, useParams } from "react-router-dom";
import ApiUrl from "../../services/Api";
import axios from "axios";
import useAlert from "../../hooks/useAlert";
function OrganizationUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({
    orgName: "",
    orgShortName: "",
  });
  const [formValid, setFormValid] = useState({
    orgName: false,
    orgShortName: false,
  });
  const [orgId, setOrgId] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const getData = async () => {
    axios.get(`${ApiUrl}/institute/org/${id}`).then((res) => {
      setData({
        orgName: res.data.data.org_name,
        orgShortName: res.data.data.org_type,
      });
      setOrgId(res.data.data.org_id);
    });
  };
  useEffect(() => {
    getData();
  }, []);
  const handleChange = (e) => {
    if (e.target.name === "orgShortName") {
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
      const temp = {};
      temp.active = true;
      temp.org_id = orgId;
      temp.org_name = data.orgName;
      temp.org_type = data.orgShortName;

      await axios
        .put(`${ApiUrl}/institute/org/${id}`, temp)
        .then((response) => {
          setLoading(true);
          if (response.status === 200 || response.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
            navigate("/InstituteMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: response.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
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
                  name="orgName"
                  label="Organization"
                  handleChange={handleChange}
                  value={data.orgName ?? ""}
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
                  disabled
                  value={data.orgShortName ?? ""}
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
