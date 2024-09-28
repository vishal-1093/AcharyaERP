import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../services/Api";
import { GenerateOfferPdf } from "./GenerateOfferPdf";
import OverlayLoader from "../../../components/OverlayLoader";

function CandidateAcceptanceForm() {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    handleAcceptOffer();
  }, []);

  const handleAcceptOffer = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/student/Candidate_Walkin/${id}`
      );
      const candidateResponseData = response.data;
      candidateResponseData.npf_status = 3;
      const getContent = await GenerateOfferPdf(candidateResponseData);
      const [{ data: candidateRes }, { data: documentResponse }] =
        await Promise.all([
          axios.put(
            `/api/student/Candidate_Walkin/${id}`,
            candidateResponseData
          ),
          axios.post(
            "/api/student/emailToCandidateRegardingOfferLetter",
            createFormData(getContent)
          ),
        ]);
      if (documentResponse.success) {
        setLoading(false);
      }
    } catch (err) {}
  };

  const createFormData = (file) => {
    const formData = new FormData();
    formData.append("file", file, "offer-letter.pdf");
    formData.append("candidate_id", id);
    return formData;
  };

  if (loading) return <OverlayLoader />;

  return (
    <Box sx={{ margin: { xs: "20px 0px 0px 0px", md: "100px 30px 0px 30px" } }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Grid container justifyContent="center" rowSpacing={4}>
                <Grid
                  item
                  xs={12}
                  component={Paper}
                  align="center"
                  sx={{
                    backgroundColor: "success.main",
                    color: "headerWhite.main",
                  }}
                >
                  <IconButton>
                    <CheckCircleOutlineRoundedIcon
                      sx={{
                        fontSize: "8rem",
                        color: "headerWhite.main",
                      }}
                    />
                  </IconButton>
                </Grid>
                <Grid item xs={12} align="center">
                  <Typography variant="h6">Congratulations !!!</Typography>
                  <Typography variant="subtitle2" color="secondary">
                    You have confirmed the acceptance of the offer letter .
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CandidateAcceptanceForm;
