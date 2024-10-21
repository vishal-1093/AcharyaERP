import { useEffect, useState } from "react";
import axiosNoToken from "../../../services/ApiWithoutToken";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { GenerateOfferPdf } from "./GenerateOfferPdf";
import useAlert from "../../../hooks/useAlert";
import logo from "../../../assets/acharyaLogo.png";

function CandidateAcceptanceForm() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    handleAcceptOffer();
  }, []);

  const handleAcceptOffer = async () => {
    try {
      const { data: candidateRes } = await axiosNoToken.get(
        `/api/student/findAllDetailsPreAdmission/${id}`
      );
      const candidateResponseData = candidateRes.data[0];
      const {
        program_type: programType,
        number_of_years: noOfYears,
        number_of_semester: noOfSem,
        feeTemplate_program_type_name: feeTemp,
        npf_status: npfStatus,
      } = candidateResponseData;

      if (npfStatus >= 3) {
        navigate(`/registration-payment/${id}`);
        return;
      }

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
        const [{ data: updatedRes }, { data: feeTemplateResponse }] =
          await Promise.all([
            axiosNoToken.get(`/api/student/findAllDetailsPreAdmission/${id}`),
            axiosNoToken.get("/api/student/getFeeDetails", {
              params: { candidateId: id },
            }),
          ]);
        const updatedResponseData = updatedRes.data[0];
        const feeTemplateData = feeTemplateResponse.data;

        const totalYearsOrSemesters =
          programType === "Yearly" ? noOfYears * 2 : noOfSem;
        const yearSemesters = [];
        for (let i = 1; i <= totalYearsOrSemesters; i++) {
          if (feeTemp === "Semester" || (feeTemp === "Yearly" && i % 2 !== 0)) {
            yearSemesters.push({ key: i, value: `Sem ${i}` });
          }
        }
        setData(updatedResponseData);
        const getContent = await GenerateOfferPdf(
          updatedResponseData,
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

  if (loading)
    return (
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "primary.main",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  return (
    <Box sx={{ margin: { xs: 2 } }}>
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
              <img src={logo} width="120px" />
            </Box>
            <Typography variant="h6">Acceptance Confirmed</Typography>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography variant="h6">Payment Pending</Typography>
            </Box>
          </Box>
          <Paper elevation={2} sx={{ padding: 4 }}>
            <Grid container rowSpacing={1} columnSpacing={2}>
              <DisplayContent
                label="Application No."
                value={data.application_no_npf}
              />
              <DisplayContent label="Name" value={data.candidateName} />
              <DisplayContent label="Mobile No." value={data.mobileNumber} />
              <DisplayContent label="Email" value={data.candidateEmail} />
            </Grid>
            <Grid item xs={12} mt={2} align="center">
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/registration-payment/${id}`)}
              >
                Pay Now
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CandidateAcceptanceForm;
