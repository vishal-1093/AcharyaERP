import { useState, useEffect } from "react";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "../../../services/Api";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";

function OfferAccepted() {
  const [success, setSuccess] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    getOfferDetails();
  }, []);

  const getOfferDetails = async () => {
    const getIpAddress = await fetch("https://geolocation-db.com/json/")
      .then((data) => data.json())
      .then((res) => res.IPv4)
      .catch((err) => console.error(err));

    await axios
      .get(`/api/employee/Offer/${id}`)
      .then((res) => {
        const data = res.data.data;
        data.offerstatus = true;
        data.ip_address = getIpAddress;
        axios
          .put(`/api/employee/updateOfferAfterAccepting/${id}`, data)
          .then((res) => {
            if (res.status === 200) {
              setSuccess(true);
            } else {
              setSuccess(false);
            }
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <Box sx={{ textAlign: "center", padding: 10 }}>
        {success ? (
          <>
            <CheckCircleOutlineRoundedIcon
              color="success"
              sx={{ fontSize: "10rem" }}
            />
            <Typography variant="h6">Congratulations !!!</Typography>
            <Typography variant="body2">
              You have confirmed the acceptance of offer letter .
            </Typography>
          </>
        ) : success === false ? (
          <>
            <CancelSharpIcon color="error" sx={{ fontSize: "10rem" }} />
            <Typography variant="h6">Something went wrong !!!</Typography>
          </>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

export default OfferAccepted;
