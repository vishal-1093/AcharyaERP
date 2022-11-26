import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const init = {
  acYear: "",
  acYearCode: "",
  currentYear: "",
};

const requiredFields = ["acYear"];

function AcademicyearForm() {
  const [values, setValues] = useState(init);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();

  const errorMessages = { acYear: ["This field is required"] };
  const checks = { acYear: [values.acYear !== ""] };

  useEffect(() => {
    if (pathname.toLowerCase() === "/academiccalendars/academicyear/new") {
      setCrumbs([
        { name: "AcademicCalendars", link: "/AcademicCalendars" },
        { name: "AcademicYear" },
        { name: "Create" },
      ]);
    }
  }, [pathname]);

  const handleChange = (e) => {
    const Firstyearone = e.target.value;
    const Secondyearone = (parseInt(e.target.value) + 1).toString();
    const concat = Firstyearone + "-" + Secondyearone;
    setValues({
      acYear: Firstyearone,
      acYearCode: Secondyearone,
      currentYear: concat,
    });
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
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.ac_year = values.currentYear;
      temp.ac_year_code = parseInt(values.acYearCode);
      temp.current_year = values.acYear;
      await axios
        .post(`/api/academic/academic_year`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AcademicCalendars", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Academic year Created",
            });
          } else {
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
            message: error.response ? error.response.data.message : "Error",
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
          justifyContent="flex-start"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="acYear"
              value={values.acYear}
              label="Academic Year"
              handleChange={handleChange}
              checks={checks.acYear}
              errors={errorMessages.acYear}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              value={values.acYearCode}
              handleChange={handleChange}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomTextField
              value={values.acYear}
              label="Current Year"
              disabled
            />
          </Grid>
          <Grid item>
            <Button
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
                <>Create</>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default AcademicyearForm;
