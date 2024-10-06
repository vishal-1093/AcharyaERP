import { useEffect, useState } from "react";
import axiosNoToken from "../../../services/ApiWithoutToken";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { useParams } from "react-router-dom";
import { GenerateOfferPdf } from "./GenerateOfferPdf";
import OverlayLoader from "../../../components/OverlayLoader";
import useAlert from "../../../hooks/useAlert";

function CandidateAcceptanceForm() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    handleAcceptOffer();
  }, []);

  const handleAcceptOffer = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const responseData = await response.json();

      const postData = {
        active: true,
        candidate_id: id,
        ip_address: responseData.ip,
      };
      const { data: acceptResponse } = await axiosNoToken.post(
        "/api/student/studentOfferAcceptance",
        postData
      );

      if (acceptResponse.success) {
        const [{ data: candidateRes }, { data: feeTemplateResponse }] =
          await Promise.all([
            axiosNoToken.get(`/api/student/findAllDetailsPreAdmission/${id}`),
            axiosNoToken.get("/api/student/getFeeDetails", {
              params: { candidateId: id },
            }),
          ]);

        const candidateResponseData = candidateRes.data[0];
        const feeTemplateData = feeTemplateResponse.data;
        const {
          program_type: programType,
          number_of_years: noOfYears,
          number_of_semester: noOfSem,
        } = candidateResponseData;

        const feeTemp = { program_type_name: "Semester" };
        const totalYearsOrSemesters =
          programType === "Yearly" ? noOfYears * 2 : noOfSem;
        const yearSemesters = [];
        for (let i = 1; i <= totalYearsOrSemesters; i++) {
          if (
            feeTemp.program_type_name === "Semester" ||
            (feeTemp.program_type_name === "Yearly" && i % 2 !== 0)
          ) {
            yearSemesters.push({ key: i, value: `Sem ${i}` });
          }
        }
        const getContent = await GenerateOfferPdf(
          candidateResponseData,
          feeTemplateData,
          yearSemesters
        );
        const { data: mailStatus } = await axiosNoToken.post(
          "/api/student/emailToCandidateRegardingOfferLetter",
          createFormData(getContent)
        );
        if (mailStatus.success) {
          setLoading(false);
        }
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to accept offer letter !!",
      });
      setAlertOpen(true);
    }
  };

  const createFormData = (file) => {
    const formData = new FormData();
    formData.append("file", file, "offer-letter.pdf");
    formData.append("candidate_id", id);
    return formData;
  };

  if (loading) return <OverlayLoader />;

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={2}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={10}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={4} lg={3}>
        <Box
          sx={{
            backgroundColor: "success.main",
            color: "headerWhite.main",
            padding: 2,
            marginTop: 12,
            textAlign: "center",
          }}
        >
          <Box>
            <CheckCircleOutlineRoundedIcon
              sx={{ fontSize: { xs: "4rem", md: "5rem" } }}
            />
          </Box>
          <Typography variant="h6">Acceptance Confirmed</Typography>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6">Payment Pending</Typography>
          </Box>
        </Box>
        <Paper elevation={2} sx={{ padding: 2 }}>
          <Grid container rowSpacing={1}>
            <DisplayContent label="Name" value="Testing" />
            <DisplayContent label="Mobile No." value="8545447854" />
            <DisplayContent label="Email" value="testing@testing.com" />
          </Grid>
          <Grid item xs={12} mt={2} align="center">
            <Button variant="contained" color="success">
              Pay Now
            </Button>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default CandidateAcceptanceForm;
