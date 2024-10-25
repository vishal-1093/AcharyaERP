import { useEffect, useState } from "react";
import {
  TableCell,
  Box,
  Divider,
  Grid,
  styled,
  tableCellClasses,
  Typography,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import occupationList from "../../../utils/OccupationList";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function PreScholarshipForm({
  values,
  setValues,
  handleChange,
  handleChangeAdvance,
  checks,
  errorMessages,
  reasonOptions,
  noOfYears,
  yearwiseSubAmount,
  maxLength,
  scholarshipTotal,
}) {
  const handleChangeScholarship = (e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;
    const { scholarshipData } = values;

    const newValue = Math.min(Number(value), Number(yearwiseSubAmount[name]));

    setValues((prev) => ({
      ...prev,
      scholarshipData: {
        ...scholarshipData,
        [name]: newValue,
      },
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const renderHeaderCells = (label, key, align) => (
    <StyledTableCell key={key} align={align}>
      <Typography variant="subtitle2">{label}</Typography>
    </StyledTableCell>
  );

  const renderTextInput = () => {
    return noOfYears.map((obj, i) => {
      return (
        <TableCell key={i} align="right">
          <CustomTextField
            name={`year${obj.key}`}
            value={values.scholarshipData[`year${obj.key}`]}
            handleChange={handleChangeScholarship}
            sx={{
              "& .MuiInputBase-root": {
                "& input": {
                  textAlign: "right",
                },
              },
            }}
          />
        </TableCell>
      );
    });
  };

  return (
    <Box>
      <Grid container rowSpacing={4} columnSpacing={4}>
        <Grid item xs={12}>
          <Divider>
            <Typography variant="subtitle2" align="center">
              Pre Scholarship
            </Typography>
          </Divider>
        </Grid>

        <Grid item xs={12} md={4} lg={1.5}>
          <CustomRadioButtons
            name="residency"
            label="Residence"
            value={values.residency}
            items={[
              {
                value: "own",
                label: "Own",
              },
              {
                value: "rented",
                label: "Rented",
              },
            ]}
            handleChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={4} lg={2.5}>
          <CustomRadioButtons
            name="scholarship"
            label="Scholarship Awarded From An OutSide Body"
            value={values.scholarship}
            items={[
              {
                value: "true",
                label: "Yes",
              },
              {
                value: "false",
                label: "No",
              },
            ]}
            handleChange={handleChange}
            required
          />
        </Grid>

        {values.scholarship === "true" ? (
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="scholarshipYes"
              label="If Yes, Please Specify"
              value={values.scholarshipYes}
              handleChange={handleChange}
              required
            />
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="reason"
            label="Reason For Fee Exemption"
            value={values.reason}
            options={reasonOptions}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            name="income"
            label="Parent Income (pa)"
            value={values.income}
            handleChange={handleChange}
            checks={checks.income}
            errors={errorMessages.income}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="occupation"
            label="Occupation"
            value={values.occupation}
            options={occupationList}
            handleChangeAdvance={handleChangeAdvance}
            checks={checks.occupation}
            errors={errorMessages.occupation}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell />
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(obj.value, i, "right")
                  )}
                  {renderHeaderCells("Total", 0, "right")}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {renderHeaderCells("Fixed Fee")}
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(
                      yearwiseSubAmount[`year${obj.key}`],
                      i,
                      "right"
                    )
                  )}
                  {renderHeaderCells(values.rowTotal, 0, "right")}
                </TableRow>

                <TableRow>
                  {renderHeaderCells("Scholarship")}
                  {renderTextInput()}
                  {renderHeaderCells(scholarshipTotal, 0, "right")}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={4} align="center">
          <CustomFileInput
            name="document"
            label="Document"
            helperText="PDF - smaller than 2 MB"
            file={values.document}
            handleFileDrop={handleFileDrop}
            handleFileRemove={handleFileRemove}
            checks={checks.document}
            errors={errorMessages.document}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            name="remarks"
            label="Remarks"
            value={values.remarks}
            handleChange={handleChange}
            helperText={`Remaining characters : ${getRemainingCharacters(
              "remarks"
            )}`}
            multiline
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PreScholarshipForm;
