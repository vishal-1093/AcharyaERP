import React from "react";
import { Paper } from "@mui/material";

export default function FormLayout({ children }) {
  const paperStyles = {
    width: "90vw",
    margin: "0 auto 30px auto",
    padding: "20px",
    backgroundColor: "#f6f6ff",
    borderRadius: 3,
  };
  return (
    <>
      <Paper elevation={4} sx={paperStyles}>
        {children}
      </Paper>
    </>
  );
}
