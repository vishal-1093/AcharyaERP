import {
  Checkbox,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import { memo } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
  },
}));

const TranscriptDetailsForm = memo(
  ({ transcriptValues, setTranscriptValues }) => {
    const handleChangeTranscript = (e) => {
      const { name, checked } = e.target;
      const [field, index] = name.split("-");

      setTranscriptValues((prev) =>
        prev.map((obj, i) => {
          if (obj.transcriptId === Number(index)) {
            const temp = { ...obj };
            if (field === "submittedStatus") {
              temp.lastDate = null;
              temp.notRequied = false;
              temp.submittedStatus = checked;
              temp.notRequiedDisabled = checked;
              temp.lastDateDisabled = checked;
            } else if (field === "notRequied") {
              temp.lastDate = null;
              temp.notRequied = checked;
              temp.submittedStatus = false;
              temp.submittedStatusDisabled = checked;
              temp.lastDateDisabled = checked;
            }
            return temp;
          }

          return obj;
        })
      );
    };

    const handleChangeLastDate = (name, newValue) => {
      const [field, index] = name.split("-");
      setTranscriptValues((prev) =>
        prev.map((obj, i) => {
          if (obj.transcriptId === Number(index))
            return {
              ...obj,
              [field]: newValue,
            };
          return obj;
        })
      );
    };

    return (
      <Grid container rowSpacing={2} columnSpacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={3}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Transcript</StyledTableCell>
                  <StyledTableCell>Is Submitted</StyledTableCell>
                  <StyledTableCell>Date of Submision</StyledTableCell>
                  <StyledTableCell>Not Applicable</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transcriptValues &&
                  transcriptValues.map((obj, i) => (
                    <TableRow key={i}>
                      <TableCell>{obj.transcript}</TableCell>
                      <TableCell>
                        <Checkbox
                          name={"submittedStatus-" + obj.transcriptId}
                          onChange={handleChangeTranscript}
                          disabled={obj.submittedStatusDisabled}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomDatePicker
                          name={"lastDate-" + obj.transcriptId}
                          value={obj.lastDate}
                          handleChangeAdvance={handleChangeLastDate}
                          disabled={obj.lastDateDisabled}
                          disablePast
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          name={"notRequied-" + obj.transcriptId}
                          onChange={handleChangeTranscript}
                          sx={{
                            padding: 0,
                          }}
                          disabled={obj.notRequiedDisabled}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  }
);

export default TranscriptDetailsForm;
