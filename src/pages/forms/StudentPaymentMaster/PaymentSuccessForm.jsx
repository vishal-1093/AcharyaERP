import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccessForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const status = location?.state?.status;
  const pathname = location?.state?.pathname;

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
          backgroundColor: status == "success" ? "#e8f5e9" : "#fbe9e7",
          borderRadius: 4,
          boxShadow: 3,
          padding: 2,
          transition: "all 0.5s ease",
        }}
      >
        <>
          {status === "success" ? (
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
            {status === "success"
              ? " Congratulations , Your Payment Has Been Completed Successfully!"
              : " Sorry,Your Payment Has Been Failed!"}
          </Typography>

          <Button
            align="center"
            variant="contained"
            onClick={() => navigate(pathname)}
          >
            GO BACK
          </Button>
        </>
      </Box>
    </div>
  );
}

export default PaymentSuccessForm;
