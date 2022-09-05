import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import CustomAlert from "../../components/CustomAlert";
import ApiUrl from "../../services/Api";
import FormWrapper from "../../components/FormWrapper";
import { useNavigate, useParams } from "react-router-dom";

function EmptypeUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({ empType: "", empTypeShortName: "" });
  const [formValid, setFormValid] = useState({
    empType: true,
    empTypeShortName: true,
  });
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name == "empTypeShortName") {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
        active: true,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        active: true,
      }));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get(`${ApiUrl}/employee/EmployeeType/${id}`).then((res) => {
      setData({
        empType: res.data.data.empType,
        empTypeShortName: res.data.data.empTypeShortName,
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      await axios
        .put(`${ApiUrl}/employee/EmployeeType/${id}`, data)
        .then((response) => {
          console.log(response);
          setAlertMessage({
            severity: "success",
            message: response.data.data,
          });
          navigate("/InstituteMaster/EmptypeIndex", { replace: true });
        })
        .catch((error) => {
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
                  name="empType"
                  label="Employment type"
                  value={data.empType ?? ""}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    data.empType !== "",
                    /^[A-Za-z ]+$/.test(data.empType),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="empTypeShortName"
                  label=" Short Name"
                  value={data.empTypeShortName ?? ""}
                  handleChange={handleChange}
                  fullWidth
                  inputProps={{
                    style: { textTransform: "uppercase" },
                    minLength: 3,
                    maxLength: 3,
                  }}
                  errors={[
                    "This field required",
                    "Enter characters and its length should be three",
                  ]}
                  checks={[
                    data.empTypeShortName !== "",
                    /^[A-Za-z ]{3,3}$/.test(data.empTypeShortName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={12}>
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
export default EmptypeUpdate;
