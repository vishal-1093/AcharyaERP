import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { GenerateStdNoduePdf } from "./GenerateStdNoduePdf";

const StudentDetails = lazy(() => import("../../../components/StudentDetails"));
const StudentFeeDetails = lazy(() =>
  import("../../../components/StudentFeeDetails")
);

const initialValues = {
  auid: "",
};

function StudentNodueForm() {
  const [values, setValues] = useState(initialValues);
  const [id, setId] = useState();
  const [programType, setProgamType] = useState();
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [dueYear, setDueYear] = useState(null);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    auid: [
      values.auid !== "",
      /^[a-zA-Z0-9]*$/.test(values.auid),
      /^[A-Za-z]{3}\d{2}[A-Za-z]{4}\d{3}$/.test(values.auid),
    ],
  };

  const errorMessages = {
    auid: [
      "This field is required",
      "Special characters and space is not allowed",
      "Invalid AUID",
    ],
  };

  useEffect(() => {
    setCrumbs([{ name: "Student Ledger" }]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `/api/student/studentDetailsByAuid/${values.auid}`
      );
      const responseData = response.data;
      if (responseData.length === 0) {
        setAlertMessage({
          severity: "error",
          message: "AUID is not present !!",
        });
        setAlertOpen(true);
        return;
      }
      const studentId = responseData[0].student_id;
      const program =
        responseData[0].program_type_name === "Semester" ? "Sem" : "Year";
      const { data: dueResponse } = await axios.get(
        `/api/finance/checkDuesOnSemForGeneratingNoDues/${studentId}`
      );
      setId(studentId);
      setProgamType(program);
      setDueYear(dueResponse.data);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to fetch the student data.",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueNodue = async () => {
    try {
      setPdfLoading(true);

      const response = await axios.get(
        `/api/student/getStudentDetailsBasedOnAuidAndStrudentId?student_id=${id}`
      );
      const studentData = response.data.data[0];
      const blob = await GenerateStdNoduePdf(studentData, programType, dueYear);
      if (blob) {
        window.open(URL.createObjectURL(blob));
      } else {
        setAlertMessage({
          severity: "error",
          message: "Failed to issue Nodues.",
        });
        setAlertOpen(true);
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to issue Nodues.",
      });
      setAlertOpen(true);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <Box sx={{ margin: { xs: "20px 0px 0px 0px", md: "15px 15px 0px 15px" } }}>
      <FormPaperWrapper>
        <Grid container columnSpacing={2} rowSpacing={4}>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="auid"
              label="AUID"
              value={values.auid}
              handleChange={handleChange}
              checks={checks.auid}
              errors={errorMessages.auid}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={2}
            sx={{ textAlign: { xs: "right", md: "left" } }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || values.auid === ""}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Submit"
              )}
            </Button>
          </Grid>

          {id && (
            <Grid item xs={12}>
              <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                  <StudentDetails id={id} />
                </Grid>
                <Grid item xs={12} align="right">
                  {dueYear === 0 ? (
                    <Button
                      variant="contained"
                      endIcon={<LocalPrintshopIcon />}
                      onClick={handleIssueNodue}
                    >
                      Issue No Due
                    </Button>
                  ) : (
                    <Typography
                      variant="subtitle2"
                      color="error"
                      sx={{ fontSize: 14 }}
                    >
                      A No-Due certificate cannot be issued as there are
                      outstanding dues.
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <StudentFeeDetails id={id} />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default StudentNodueForm;
