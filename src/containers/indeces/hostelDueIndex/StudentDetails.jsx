import React, { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    textAlign: "center",
    padding: 2,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    textAlign: "center",
    padding: 3,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StudentDetails = ({ templateId }) => {
  const [rows, setRows] = useState([]); // Initialize with an empty array
  const [isLoading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/finance/countOfStudentBasedOnHostelFeeTemplateId/${templateId?.row?.id}`
      );
      const studentData = res?.data?.data?.students || []; // Fallback to empty array if undefined
      setRows(studentData);
    } catch (err) {
      console.error(err);
      setRows([]); // Ensure rows is set to an empty array in case of an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [templateId]);

  const tableData = () => (
    <TableContainer component={Paper} elevation={3}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={6}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              Student Details
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Sl No</StyledTableCell>
            <StyledTableCell>AUID</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>USN</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows?.length > 0 ? (
            rows?.map((obj, i) => (
              <TableRow key={obj.student_id}>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {i + 1}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {obj.auid}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {obj.student_name}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {obj.acharya_email}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {obj.usn}
                  </Typography>
                </StyledTableCellBody>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell sx={{ textAlign: "center" }} colSpan={6}>
                <Typography variant="subtitle2">No Records</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Grid item xs={12}>
      {tableData()}
    </Grid>
  );
};

export default StudentDetails;
