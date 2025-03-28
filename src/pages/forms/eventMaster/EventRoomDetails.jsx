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
import moment from "moment";

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

const EventRoomDetails = ({ row }) => {
  const [eventDetails, setEventDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/institute/getEventReportDetails?room_id=${row?.room_id}&Date=${moment(row?.event_start_time).format("YYYY-MM-DD")}`
      );
      setEventDetails(res?.data?.data || []); // Expecting an array in the response
    } catch (err) {
      console.error(err);
      setEventDetails([]); // Handle error case by setting an empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [row]);

  const tableData = () => (
    <TableContainer component={Paper} elevation={3}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={11}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              Event Room Details
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Sl No</StyledTableCell>
            <StyledTableCell>Employee Name</StyledTableCell>
            <StyledTableCell>Mobile</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Department</StyledTableCell>
            <StyledTableCell>Event Name</StyledTableCell>
            <StyledTableCell>Event Description</StyledTableCell>
            <StyledTableCell>Event Start Time</StyledTableCell>
            <StyledTableCell>Event End Time</StyledTableCell>
            <StyledTableCell>Created Date</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {eventDetails.length > 0 ? (
            eventDetails.map((detail, index) => (
              <TableRow key={detail.userId}>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {index + 1}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {detail.employee_name}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {detail.mobile}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {detail.email}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {detail.dept_name}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {detail.event_description}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {detail.event_name}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {moment(detail.event_start_time).format('DD-MM-YYYY HH:mm')}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {moment(detail.event_end_time).format('DD-MM-YYYY HH:mm')}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {moment(detail.created_date).format('DD-MM-YYYY HH:mm')}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {detail.approved_status}
                  </Typography>
                </StyledTableCellBody>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell sx={{ textAlign: "center" }} colSpan={7}>
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

export default EventRoomDetails;
