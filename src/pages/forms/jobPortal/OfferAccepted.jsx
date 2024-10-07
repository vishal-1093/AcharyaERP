import { useState, useEffect } from "react";
import axiosNoToken from "../../../services/ApiWithoutToken";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";

function OfferAccepted() {
  const [success, setSuccess] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    getOfferDetails();
  }, []);

  const getOfferDetails = async () => {
    const getIpAddress = await fetch("https://api.ipify.org?format=json")
      .then((data) => data.json())
      .then((res) => res.ip)
      .catch((err) => console.error(err));

    await axiosNoToken
      .put(
        `/api/employee/updateOfferAfterAccepting?offer_id=${id}&offerstatus=${true}&ip_address=${getIpAddress}`
      )
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
        } else {
          setSuccess(false);
        }
      })
      .catch((err) => console.error(err));
  };
  return (
    <Box p={10}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4}>
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                backgroundColor:
                  success === true
                    ? "success.main"
                    : success === false
                    ? "error.main"
                    : "",
                color: "headerWhite.main",
                padding: 1,
              }}
              align="center"
            >
              {success === true ? (
                <CheckCircleOutlineRoundedIcon
                  sx={{
                    fontSize: "4rem",
                  }}
                />
              ) : success === false ? (
                <CancelSharpIcon sx={{ fontSize: "4rem" }} />
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={12} align="center" component={Paper} p={2}>
              {success === true ? (
                <>
                  <Typography variant="h6">Congratulations !!!</Typography>
                  <Typography variant="body2">
                    You have confirmed the acceptance of the offer letter .
                  </Typography>
                </>
              ) : success === false ? (
                <Typography variant="h6">Something went wrong !!!</Typography>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OfferAccepted;
