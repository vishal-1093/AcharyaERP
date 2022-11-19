import { useState, useEffect } from "react";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ApiUrl from "../../../services/Api";
import axios from "axios";

const OfferAccepted = () => {
  const { id } = useParams();

  useEffect(() => {
    getOfferDetails();
  }, []);

  const getOfferDetails = async () => {
    const data = await axios
      .get(`${ApiUrl}/employee/Offer/${id}`)
      .then((res) => {
        const data = res.data.data;
        data.offerstatus = true;
        return res.data.data;
      })
      .catch((err) => console.error(err));

    await axios
      .put(`${ApiUrl}/employee/Offer/${id}`, data)
      .then((res) => {})
      .catch((err) => console.error(err));
  };
  return (
    <>
      <Box sx={{ textAlign: "center", padding: 10 }}>
        <CheckCircleOutlineRoundedIcon
          color="success"
          sx={{ fontSize: "10rem" }}
        />
        <Typography variant="h6">Congratulations !!!</Typography>
        <Typography variant="body2">
          You have confirmed the acceptance of offer letter .
        </Typography>
      </Box>
    </>
  );
};

export default OfferAccepted;
