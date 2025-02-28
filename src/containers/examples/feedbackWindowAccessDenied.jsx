import React from "react";
import { Typography, Box, Button } from "@mui/material";

const FeedbackWindowAccessDenied = () => {
  return (
    <Box
      sx={{
        mx: "auto",
        mt: 4,
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="black">
        Feedback Window is Not Open.
      </Typography>
      <Typography variant="Subtitle2" sx={{fontSize: '14px'}} color="text.secondary">
        Please contact the <strong>HR Admin</strong> for further assistance.
      </Typography>
    </Box>
  );
};

export default FeedbackWindowAccessDenied