import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import StudentMarksIndex from "../studentMaster/StudentMarksIndex";
import ProctorStudentMarks from "./ProctorStudentMarks";

function BasicChips() {
  const [rowGroup, setRowGroup] = useState("marks");

  const handleRowGroup = (groupName) => {
    setRowGroup(groupName);
    console.log(groupName);
  };

  const handleRender = () => {
    if (rowGroup === "marks") {
      return (
        <>
          <ProctorStudentMarks />
        </>
      );
    } else if (rowGroup === "programme") {
      return <StudentMarksIndex />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      rowGap={4}
      pt={3}
    >
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "flex-start" }}
      >
        <Grid item xs={12} md={12} lg={10}>
          <Stack direction="row" spacing={1}>
            <Chip
              label="Student Marks"
              variant="outlined"
              onClick={() => handleRowGroup("marks")}
              color={rowGroup === "marks" ? "primary" : undefined}
            />
            <Chip
              label="Attendence Report"
              variant="outlined"
              onClick={() => handleRowGroup("attendence")}
              color={rowGroup === "attendence" ? "primary" : undefined}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} md={12}>
          {handleRender()}
        </Grid>
      </Grid>
    </Box>
  );
}
export default BasicChips;
