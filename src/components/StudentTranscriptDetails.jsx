import { useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

function StudentTranscriptDetails({ id }) {
  const [transcriptData, setTranscriptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/student/getDataForTestimonials/${id}`
      );

      setTranscriptData(response.data.data.Student_Transcript_Details);
    } catch (err) {
      setError("Failed to fetch transcipt details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        Please wait ....
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  if (!transcriptData || transcriptData?.length === 0) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No transcript data available.
      </Typography>
    );
  }

  const displayText = (value) => (
    <Typography variant="subtitle2" color="textSecondary">
      {value}
    </Typography>
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Transcript</StyledTableCell>
                <StyledTableCell>Submitted Date</StyledTableCell>
                <StyledTableCell>Last Date</StyledTableCell>
                <StyledTableCell>Collected By</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {transcriptData?.map((obj, i) => (
                <TableRow key={i}>
                  <StyledTableCellBody>
                    {displayText(obj.transcript)}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {displayText(
                      obj.submitted_date
                        ? moment(obj.submitted_date).format("DD-MM-YYYY")
                        : ""
                    )}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {displayText(
                      obj.will_submit_by
                        ? moment(obj.will_submit_by).format("DD-MM-YYYY")
                        : ""
                    )}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {displayText(obj.created_username)}
                  </StyledTableCellBody>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default StudentTranscriptDetails;
