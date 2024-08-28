import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Box, Grid } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import useAlert from "../../../hooks/useAlert";
import { useParams } from "react-router-dom";

const StudentDetails = lazy(() => import("../../../components/StudentDetails"));
const ScholarshipApproveForm = lazy(() => import("./ScholarshipApproveForm"));

const breadCrumbsList = [
  { name: "Apporve Scholarship", link: "/approve-scholarship" },
  { name: "Approve" },
];

function ScholarshipApproverForm() {
  const [studentData, setStudentData] = useState(null);

  const { auid, scholarshipId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        `/api/student/studentDetailsByAuid/${auid}`
      );
      setStudentData(response.data.data[0]);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to fetch the student details!",
      });
      setAlertOpen(true);
    }
  };

  return (
    <Box sx={{ margin: { xs: "20px 0px 0px 0px", md: "15px 15px 0px 15px" } }}>
      <FormPaperWrapper>
        <Grid container columnSpacing={2} rowSpacing={4}>
          {studentData && (
            <>
              <Grid item xs={12}>
                <StudentDetails id={studentData.student_id} />
              </Grid>
              <Grid item xs={12}>
                <ScholarshipApproveForm
                  data={studentData}
                  scholarshipId={scholarshipId}
                />
              </Grid>
            </>
          )}
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default ScholarshipApproverForm;
