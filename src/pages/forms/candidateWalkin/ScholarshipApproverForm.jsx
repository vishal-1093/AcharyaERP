import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import StudentDetails from "../../../components/StudentDetails";
import { useNavigate, useLocation, useParams } from "react-router-dom";

function ScholarshipApproverForm() {
  const { studentId, scholarshipId } = useParams();

  return (
    <>
      <Box component="form" p={1}>
        <FormPaperWrapper>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12}>
              <StudentDetails id={studentId} />
            </Grid>
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default ScholarshipApproverForm;
