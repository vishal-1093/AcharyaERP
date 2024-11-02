import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";

const StudentDetails = lazy(() => import("../../../components/StudentDetails"));
const StudentFeeDetails = lazy(() =>
  import("../../../components/StudentFeeDetails")
);

const initialValues = {
  auid: "",
};

function StudentLedger() {
  const [values, setValues] = useState(initialValues);
  const [id, setId] = useState();
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

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
      } else {
        setId(responseData[0].student_id);
      }
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

  return (
    <Box sx={{ margin: { xs: 1, md: 2, lg: 4 } }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={12} lg={9}>
          <Card elevation={4}>
            <CardHeader
              title="Student Ledger"
              titleTypographyProps={{
                variant: "subtitle2",
              }}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
                padding: 1,
              }}
            />
            <CardContent sx={{ p: { xs: 2, md: 5 } }}>
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
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <StudentDetails id={id} />
                      <StudentFeeDetails id={id} />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentLedger;
