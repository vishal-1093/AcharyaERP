import { useState } from "react";
import {
  Box,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  styled,
} from "@mui/material";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function AuidDocumentDetailsForm({ values, setValues, transcriptData }) {
  const handleChangeAdvance = (name, newValue) => {
    const splitName = name.split("-");
    setValues((prev) => ({
      ...prev,
      transcript: prev.transcript.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: newValue,
            transcriptId: splitName[2],
          };
        return obj;
      }),
    }));
  };

  const handleSelect = (e) => {
    const splitName = e.target.name.split("-");
    if (e.target.checked === true) {
      setValues((prev) => ({
        ...prev,
        transcript: prev.transcript.map((obj, i) => {
          if (i === parseInt(splitName[1]))
            return {
              ...obj,
              [splitName[0]]: splitName[2],
              lastDate: null,
              submittedStatus: true,
            };
          return obj;
        }),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        transcript: prev.transcript.map((obj, i) => {
          if (i === parseInt(splitName[1]))
            return { ...obj, [splitName[0]]: "", submittedStatus: false };
          return obj;
        }),
      }));
    }
  };

  return (
    <>
      <Box>
        <Grid container>
          <Grid item xs={12} align="center">
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{ width: "80%" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Transcript</StyledTableCell>
                    <StyledTableCell>Is Submitted</StyledTableCell>
                    <StyledTableCell>Last Date</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transcriptData.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{obj.transcript}</TableCell>
                        <TableCell>
                          <Checkbox
                            name={
                              "transcriptId" + "-" + i + "-" + obj.transcript_id
                            }
                            checked={
                              values.transcript[i].submittedStatus === true
                            }
                            onChange={handleSelect}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomDatePicker
                            name={
                              "lastDate" + "-" + i + "-" + obj.transcript_id
                            }
                            label=""
                            value={values.transcript[i].lastDate}
                            handleChangeAdvance={handleChangeAdvance}
                            disabled={
                              values.transcript[i].submittedStatus === true
                            }
                            disablePast
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AuidDocumentDetailsForm;
