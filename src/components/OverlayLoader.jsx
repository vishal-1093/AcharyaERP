import React from "react";
import loader from "../assets/loader.jpg";
import { Box } from "@mui/material";

export default function OverlayLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 100px)",
      }}
    >
      <img src={loader} alt="loading" />
    </Box>
  );
}
