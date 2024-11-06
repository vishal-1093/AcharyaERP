import { memo } from "react";
import {
  Box,
  Button,
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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
  },
}));

const TranscriptDetailsForm = memo(
  ({ transcriptValues, setTranscriptValues, noStatuData }) => {
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

    const handleChangeStatus = (name, newValue) => {
      const [field, index] = name.split("-");
      setTranscriptValues((prev) =>
        prev.map((obj, i) => {
          if (i === Number(index))
            return {
              ...obj,
              [field]: newValue,
              submittedStatusDisabled: false,
              notRequiedDisabled: false,
              lastDateDisabled: false,
            };
          return obj;
        })
      );
    };

    const add = () => {
      const transciptIds = [];
      transcriptValues.forEach((obj) => {
        transciptIds.push(obj.transcriptId);
      });
      const transcriptOptionData = [];
      noStatuData?.forEach((obj) => {
        if (!transciptIds.includes(obj.transcript_id)) {
          transcriptOptionData.push({
            value: obj.transcript_id,
            label: obj.transcript,
          });
        }
      });

      setTranscriptValues((prev) => [
        ...prev,
        {
          transcriptId: null,
          transcript: null,
          lastDate: null,
          submittedStatus: false,
          notRequied: false,
          submittedStatusDisabled: !prev.transcriptId,
          notRequiedDisabled: !prev.transcriptId,
          lastDateDisabled: !prev.transcriptId,
          showStatus: false,
          transcriptOptions: transcriptOptionData,
        },
      ]);
    };

    const remove = () => {
      const temp = [...transcriptValues];
      temp.pop();
      setTranscriptValues(temp);
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
                      <TableCell>
                        {obj.showStatus ? (
                          obj.transcript
                        ) : (
                          <CustomAutocomplete
                            name={`transcriptId-${i}`}
                            value={obj.transcriptId}
                            options={obj.transcriptOptions}
                            handleChangeAdvance={handleChangeStatus}
                            required
                          />
                        )}
                      </TableCell>
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
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={add}
            >
              <AddIcon />
            </Button>

            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={remove}
            >
              <RemoveIcon />
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  }
);

export default TranscriptDetailsForm;
