import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import {
  Box,
  Button,
  CircularProgress,
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
  Typography,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const initialValues = { remarks: "" };

function ScholarshipVerifyForm({ data }) {
  const [values, setValues] = useState(initialValues);
  const [feeTemplateData, setFeeTemplateData] = useState(null);
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [yearwiseSubAmount, setYearwiseSubAmount] = useState([]);
  const [scholarshipTotal, setScholarshipTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const maxLength = 100;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const [feeTemplateResponse, subAmountResponse] = await Promise.all([
        axios.get(
          `/api/finance/FetchAllFeeTemplateDetail/${data.fee_template_id}`
        ),
        axios.get(
          `/api/finance/FetchFeeTemplateSubAmountDetail/${data.fee_template_id}`
        ),
      ]);

      const feeTemplateData = feeTemplateResponse.data.data[0];
      const feeTemplateSubAmtData = subAmountResponse.data.data;

      const yearSemesters = [];
      const subAmountMapping = {};
      const scholarshipData = {};
      const totalYearsOrSemesters =
        data.program_type_name === "Yearly"
          ? data.number_of_years * 2
          : data.number_of_semester;

      for (let i = 1; i <= totalYearsOrSemesters; i++) {
        yearSemesters.push({ key: i, value: `Sem ${i}` });
        scholarshipData[`year${i}`] = "";
        subAmountMapping[`year${i}`] =
          feeTemplateSubAmtData[0][`fee_year${i}_amt`];
      }

      setFeeTemplateData(feeTemplateData);
      setFeeTemplateSubAmountData(feeTemplateSubAmtData);
      setNoOfYears(yearSemesters);
      setYearwiseSubAmount(subAmountMapping);
      setValues((prev) => ({
        ...prev,
        scholarshipData,
      }));
    } catch (err) {
      console.log("err :>> ", err);
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load fee template details!",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeScholarship = (e) => {
    const { name, value } = e.target;
    if (/^[A-Za-z]+$/.test(value)) return;
    const { scholarshipData } = values;

    const newValue = Math.min(Number(value), yearwiseSubAmount[name]);

    setValues((prev) => ({
      ...prev,
      scholarshipData: {
        ...scholarshipData,
        [name]: newValue,
      },
    }));
  };

  const handleChange = (e) => {
    if (e.target.value.length > maxLength) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const renderHeaderCells = (label, key, align) => (
    <StyledTableCell key={key} align={align}>
      <Typography variant="subtitle2">{label}</Typography>
    </StyledTableCell>
  );

  const renderBodyCells = (label, key, align) => (
    <TableCell key={key} align={align}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    </TableCell>
  );

  const renderTextInput = () => {
    return noOfYears.map((obj, i) => {
      return (
        <TableCell key={i} align="right">
          <CustomTextField
            name={"year" + obj.key}
            value={values.scholarshipData["year" + obj.key]}
            handleChange={handleChangeScholarship}
            disabled={
              obj.key % 2 === 0 &&
              feeTemplateData.program_type_name === "Yearly"
            }
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

  if (!feeTemplateData) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No Fee Template data available.
      </Typography>
    );
  }

  return (
    <Box>
      <Grid container rowSpacing={4} columnSpacing={4}>
        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {renderHeaderCells("Particulars")}
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(obj.value, i, "right")
                  )}
                  {renderHeaderCells("Total", 0, "right")}
                </TableRow>
              </TableHead>

              <TableBody>
                {feeTemplateSubAmountData.map((obj, i) => (
                  <TableRow key={i}>
                    {renderBodyCells(obj.voucher_head)}
                    {noOfYears.map((cell, j) =>
                      renderBodyCells(obj[`year${cell.key}_amt`], j, "right")
                    )}
                    {renderHeaderCells(obj.total_amt, 0, "right")}
                  </TableRow>
                ))}
                {/* Total */}
                <TableRow>
                  {renderHeaderCells("Total")}
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(
                      feeTemplateSubAmountData[0][`fee_year${obj.key}_amt`],
                      i,
                      "right"
                    )
                  )}
                  {renderHeaderCells(
                    feeTemplateData.fee_year_total_amount,
                    0,
                    "right"
                  )}
                </TableRow>
                {/* Scholarship  */}
                <TableRow>
                  {renderHeaderCells("Requested")}
                  {renderTextInput()}
                  {renderHeaderCells(scholarshipTotal, 0, "right")}
                </TableRow>
                {/* Grand Total  */}
                <TableRow>
                  {renderHeaderCells("Grand Total")}
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(
                      yearwiseSubAmount[`year${obj.key}`] -
                        values.scholarshipData[`year${obj.key}`],
                      i,
                      "right"
                    )
                  )}
                  {renderHeaderCells(
                    feeTemplateData.fee_year_total_amount - scholarshipTotal,
                    0,
                    "right"
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            name="remarks"
            label="Remarks"
            value={values.remarks}
            handleChange={handleChange}
            // checks={checks.remarks}
            // errors={errorMessages.remarks}
            helperText={`Remaining characters : ${getRemainingCharacters(
              "remarks"
            )}`}
            multiline
          />
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            // disabled={isLoading || !requiredFieldsValid()}
            // onClick={handleCreate}
          >
            {isLoading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Verify"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ScholarshipVerifyForm;
