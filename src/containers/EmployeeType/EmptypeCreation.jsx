import { useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import useAlert from "../../hooks/useAlert";
import ApiUrl from "../../services/Api";
import FormWrapper from "../../components/FormWrapper";
import { useNavigate } from "react-router-dom";

const initialValues = {
  empType: "",
  empTypeShortName: "",
};

function EmptypeCreation() {
  const [data, setData] = useState(initialValues);
  const [formValid, setFormValid] = useState({
    empType: false,
    empTypeShortName: false,
  });

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    if (e.target.name == "empTypeShortName") {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        active: true,
      }));
    }
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
      const temp = {};
      temp.active = true;
      temp.empType = data.empType;
      temp.empTypeShortName = data.empTypeShortName;
      await axios
        .post(`${ApiUrl}/employee/EmployeeType`, temp)
        .then((res) => {
          setLoading(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/InstituteMaster", { replace: true });
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
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="empType"
                  label="Employment type"
                  value={data.empType}
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
                  value={data.empTypeShortName}
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
                    data.empTypeShortName !== "",
                    /^[A-Za-z ]{3}$/.test(data.empTypeShortName),
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
export default EmptypeCreation;
