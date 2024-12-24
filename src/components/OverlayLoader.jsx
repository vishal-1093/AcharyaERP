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
        "& img": {
          animation: "fade 2.0s ease-in-out infinite",
        },
        "@keyframes fade": {
          "0%": {
            opacity: 0,
          },
          "50%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
      }}
    >
      <img src={loader} alt="loading" />
    </Box>
  );
}
