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
    </Box>
  );
};

export default FeedbackWindowAccessDenied