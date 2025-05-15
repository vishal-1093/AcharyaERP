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
  Typography,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import StudentDetailsByAuid from "../../../components/StudentDetailsByAuid";
const StudentDetails = lazy(() => import("../../../components/StudentDetails"));
const StudentRefundDetails = lazy(() =>
  import("../../../components/StudentRefundDetails")
);

const initialValues = {
  auid: "",
};

function StudentRefund() {
  const [values, setValues] = useState(initialValues);
  const [id, setId] = useState();
  const [loading, setLoading] = useState(false);
  const [allExpand, setAllExpand] = useState({});
  const [isPrintClick, setIsPrintClick] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [open, setOpen] = useState(false);

  const { auid } = useParams();
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

  //   useEffect(() => {
  //     handleSubmit();
  //   }, [values.auid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (Object.values(checks).flat().includes(false)) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/student/studentDetailsByAuidInactiveData/${values.auid}`
      );

      if (response.data.data.length > 0) {
        setOpen(true);
        setStudentData(response.data.data[0]);
      } else {
        setOpen(false);
      }
    } catch (err) {
      console.error(err);

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
    <Box sx={{ margin: { xs: 1, md: 2, lg: 2, xl: 4 } }}>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Card elevation={4}>
            <CardHeader
              title="Student Refund"
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
                    disabled={
                      loading ||
                      values.auid === "" ||
                      Object.values(checks).flat().includes(false)
                    }
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

                {open && (
                  <Grid item xs={12} id="ledger">
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <StudentDetailsByAuid studentData={studentData} />
                      <StudentRefundDetails
                        id={studentData?.student_id}
                        studentDataResponse={studentData}
                      />
                    </Box>
                  </Grid>
                )}

                {/* {id && (
                  <Grid item xs={12} id="ledger">
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <StudentDetailsByAuid
                        id={values.auid}
                        // header={
                        //   isPrintClick ? "Student Ledger" : "Student Details"
                        // }
                        isPrintClick={isPrintClick}
                      />
                      <StudentRefundDetails
                        id={id}
                        isPrintClick={isPrintClick}
                        studentDataResponse={studentData}
                      />
                    </Box>
                  </Grid>
                )} */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentRefund;
