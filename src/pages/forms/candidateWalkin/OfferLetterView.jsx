import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import moment from "moment";

const address = "Rallapalli, Village, kambadur,Mandal Anathapur";
const city = "Anantapur";
const state = "Andhra Pradesh";
const pincode = "515765";

function OfferLetterView() {
  const [candidateData, setCandidateData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
        setCandidateData(res.data.data[0]);
        console.log("res.data.data", res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box m={{ md: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card elevation={4}>
            <CardHeader
              title={candidateData.school_name}
              titleTypographyProps={{ variant: "subtitle2", fontSize: 14 }}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
                padding: 1,
              }}
            />
            <CardContent>
              <Box>
                <Grid container rowSpacing={1}>
                  <Grid item xs={12} md={6}>
                    Ref.No:&nbsp;{candidateData.application_no_npf}
                  </Grid>

                  <Grid item xs={12} md={6} align={{ md: "right" }}>
                    Date:&nbsp;{moment().format("DD-MM-YYYY")}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      {candidateData.candidate_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography>{address.slice(0, 30)}</Typography>
                    <Typography>{address.slice(30, address.length)}</Typography>
                    <Typography>
                      {city + "," + state + " " + pincode}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sx={{ textIndent: { md: "50px" } }}>
                    Subject: Formal Admission Offer for BBA-Analytics - Business
                    Analytics Program at ACHARYA INSTITUTE OF GRADUATE STUDIES.
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      Dear {candidateData.candidate_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sx={{ textIndent: { md: "50px" } }}>
                    I trust this letter finds you well. It is with great
                    pleasure that I extend my congratulations on your successful
                    application to the BBA-Analytics - Business Analytics
                    program at ACHARYA INSTITUTE OF GRADUATE STUDIES. We are
                    delighted to inform you that you have been accepted for the
                    2024-2025 Academic Session.
                  </Grid>

                  <Grid item xs={12} sx={{ textIndent: { md: "50px" } }}>
                    Please be advised that this formal offer is contingent upon
                    your fulfilment of the academic requirements as stipulated
                    by the Constituent body/University. To secure your place in
                    the program, we kindly request you to digitally accept this
                    offer by clicking on the 'Accept Now' button in the
                    Acceptance Letter attached herewith.
                  </Grid>

                  <Grid item xs={12} sx={{ textIndent: { md: "50px" } }}>
                    Upon accepting this offer, you are committing to the payment
                    of the prescribed fees outlined below. It is imperative that
                    you carefully review and accept the terms, conditions, and
                    regulations of Acharya Institutes to ensure a smooth
                    academic journey.
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OfferLetterView;
