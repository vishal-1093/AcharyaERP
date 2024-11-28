import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Box, Grid } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import useAlert from "../../../hooks/useAlert";
import { useParams } from "react-router-dom";

const StudentDetails = lazy(() => import("../../../components/StudentDetails"));
const ScholarshipVerifyForm = lazy(() => import("./ScholarshipVerifyForm"));

const breadCrumbsList = [
  { name: "Verify Scholarship", link: "/scholarship" },
  { name: "Verify" },
];

function PreScholarshipVerifierForm() {
  const [studentData, setStudentData] = useState(null);
  const [isStudent, setIsStudent] = useState(true);

  const { auid, scholarshipId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    setCrumbs(breadCrumbsList);
    try {
      const containsAlphabetic = /[a-zA-Z]/.test(auid);
      const url = containsAlphabetic
        ? "studentDetailsByAuid"
        : "findAllDetailsPreAdmission";
      const response = await axios.get(`/api/student/${url}/${auid}`);
      const responseData = response.data.data[0];
      setStudentData(responseData);
      setIsStudent(containsAlphabetic);

      if (!containsAlphabetic) {
        setCrumbs([
          { name: "Verify Scholarship", link: "/scholarship" },
          { name: "Verify" },
          { name: responseData.candidate_name },
          { name: responseData.application_no_npf },
        ]);
      }
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
              {isStudent && (
                <Grid item xs={12}>
                  <StudentDetails id={studentData.student_id} />
                </Grid>
              )}
              <Grid item xs={12}>
                <ScholarshipVerifyForm
                  data={studentData}
                  scholarshipId={scholarshipId}
                  isStudent={isStudent}
                />
              </Grid>
            </>
          )}
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default PreScholarshipVerifierForm;
