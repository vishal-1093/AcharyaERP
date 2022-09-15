import React from "react";
import { Paper } from "@mui/material";

export default function FormWrapper({ children }) {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: "#f6f6ff",
        borderRadius: 3,
      }}
    >
      {children}
    </Paper>
  );
}
