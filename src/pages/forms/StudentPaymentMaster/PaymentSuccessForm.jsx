import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useLocation } from "react-router-dom";

function PaymentSuccessForm() {
  const location = useLocation();
  const state = location?.state;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: state == "success" ? "#e8f5e9" : "#fbe9e7",
          borderRadius: 4,
          boxShadow: 3,
          padding: 2,
          transition: "all 0.5s ease",
        }}
      >
        <>
          {state === "success" ? (
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "#4caf50", marginBottom: 2 }}
            />
          ) : (
            <CancelIcon sx={{ fontSize: 80, color: "red", marginBottom: 2 }} />
          )}

          <Typography
            variant="h5"
            color="primary"
            sx={{ fontWeight: "bold", marginBottom: 2 }}
          >
            {state === "success"
              ? " Congratulations , Your Payment Has Been Completed Successfully!"
              : " Sorry,Your Payment Has Been Failed!"}
          </Typography>
        </>
      </Box>
    </div>
  );
}

export default PaymentSuccessForm;
