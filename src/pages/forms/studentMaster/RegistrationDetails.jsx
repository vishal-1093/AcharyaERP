import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Divider, Grid, Paper } from "@mui/material";
import OverlayLoader from "../../../components/OverlayLoader";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";

const StudentProfileDetails = lazy(() => import("./StudentProfileDetails"));
const RegistrationView = lazy(() => import("./RegistrationView"));

const auid = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;
const displayPhoto = sessionStorage.getItem("photo");

function RegistrationDetails() {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photoPath, setPhotoPath] = useState(null);
  const [registrationData, setRegistrationData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const [response, photoResponse] = await Promise.all([
        axios.get(
          `/api/student/getStudentDetailsBasedOnAuidAndStrudentId?auid=${auid}`
        ),
        axios.get(
          `/api/student/studentImageDownload?student_image_attachment_path=${displayPhoto}`,
          {
            responseType: "blob",
          }
        ),
      ]);
      const responseData = response.data.data?.[0];
      const { id } = responseData;
      if (id) {
        const registrationResponse = await axios.get(
          `/api/student/getAllStudentDetailsData/${id}`
        );
        const registrationResponseData =
          registrationResponse.data.data.Student_details;
        console.log("registrationResponseData", registrationResponseData);
        setRegistrationData(registrationResponseData);
      }
      setStudentData(response.data.data[0]);
      setPhotoPath(photoResponse.data);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "An error occured",
      });
      setAlertOpen(true);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <OverlayLoader />;

  return (
    <Box
      m={{ xs: 1, md: 2, lg: 4 }}
      //   sx={{ backgroundColor: "rgb(221, 216, 208)" }}
      sx={{
        backgroundColor: "#f6f6ff",
        padding: 4,
        borderRadius: 8,
      }}
    >
      <Grid container rowSpacing={4} columnSpacing={4}>
        <Grid item xs={12} md={3}>
          <StudentProfileDetails
            studentData={studentData}
            photoPath={photoPath}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          <RegistrationView
            studentData={studentData}
            registrationData={registrationData}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default RegistrationDetails;
