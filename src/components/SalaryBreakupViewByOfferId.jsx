import { useEffect, useState } from "react";
import axios from "../services/Api";
import {
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  Paper,
  Table,
  TableBody,
  Typography,
  Box,
  Grid,
} from "@mui/material";

function SalaryBreakupViewByOfferId({ id }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `/api/employee/fetchAllOfferDetails/${id}`
      );
      const offerData = response.data[0];
      const { salary_structure_id } = offerData;
      const { data: salaryResponse } = await axios.get(
        `/api/finance/getFormulaDetails/${salary_structure_id}`
      );
      const formulaData = salaryResponse.data;
      const earningTemp = [];
      const deductionTemp = [];
      const managementTemp = [];
      const formulaDataSort = formulaData.sort(
        (a, b) => a.priority - b.priority
      );
      formulaDataSort.forEach((obj) => {
        const {
          category_name_type,
          voucher_head,
          salaryStructureHeadPrintName,
          priority,
        } = obj;
        const amount = Math.round(offerData[salaryStructureHeadPrintName]);
        const rowObj = {
          name: voucher_head,
          monthly: amount,
          yearly: amount * 12,
          priority: priority,
        };
        if (category_name_type === "Earning" && amount !== 0) {
          earningTemp.push(rowObj);
        } else if (obj.category_name_type === "Deduction" && amount !== 0) {
          deductionTemp.push(rowObj);
        } else if (obj.category_name_type === "Management" && amount !== 0) {
          managementTemp.push(rowObj);
        }
        const temp = {
          earnings: earningTemp,
          deductions: deductionTemp,
          management: managementTemp,
        };
        let grossEarningAmt = 0;
        let totDeductionAmt = 0;
        let totManagementAmt = 0;
        const { earnings, deductions, management } = temp;
        if (earnings.length > 0) {
          const tempData = [];
          earnings.forEach((obj) => {
            tempData.push(obj.monthly);
          });
          grossEarningAmt = tempData.reduce((a, b) => a + b);
        }
        if (deductions.length > 0) {
          const tempData = [];
          deductions.forEach((obj) => {
            tempData.push(obj.monthly);
          });
          totDeductionAmt = tempData.reduce((a, b) => a + b);
        }
        if (management.length > 0) {
          const tempData = [];
          management.forEach((obj) => {
            tempData.push(obj.monthly);
          });
          totManagementAmt = tempData.reduce((a, b) => a + b);
        }
        temp["grossEarning"] = grossEarningAmt;
        temp["totDeduction"] = totDeductionAmt;
        temp["totManagement"] = totManagementAmt;
        setData(temp);
      });
    } catch (err) {
      console.error(err);
      setError(
        "Failed to fetch salary breakup details. Please try again later."
      );
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

  if (!data) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        Salary Breakup is not available.
      </Typography>
    );
  }

  const tableHeading = (label) => (
    <TableRow>
      <TableCell colSpan={2}>
        <Typography variant="subtitle2">{label}</Typography>
      </TableCell>
    </TableRow>
  );

  const displayTableBody = (data) =>
    data
      .sort((a, b) => a.priority - b.priority)
      .map(
        (obj, i) =>
          Number(obj.value) !== 0 && (
            <TableRow key={i}>
              <TableCell>
                <Typography variant="subtitle2" color="textSecondary">
                  {obj.name}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" color="textSecondary">
                  {obj.monthly.toFixed()}
                </Typography>
              </TableCell>
            </TableRow>
          )
      );

  const tableFooter = (label, value) => (
    <TableRow>
      <TableCell>
        <Typography variant="subtitle2">{label}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="subtitle2">{value}</Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "headerWhite.main",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      Salary Breakup
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              {Object.values(data).length > 0 && (
                <TableBody>
                  {tableHeading("Earnings")}
                  {displayTableBody(data.earnings)}
                  {tableFooter("Gross Earning", data.grossEarning.toFixed())}
                  {tableHeading("Deductions")}
                  {displayTableBody(data.deductions)}
                  {tableFooter("Total Deductions", data.totDeduction.toFixed())}
                  {tableHeading("Management Contribution")}
                  {displayTableBody(data.management)}
                  {tableFooter(
                    "Total Management Contribution",
                    data.totManagement.toFixed()
                  )}
                  {tableFooter(
                    "Cost to Company",
                    (data.grossEarning + data.totManagement).toFixed()
                  )}
                  {tableFooter(
                    "Net Pay",
                    (data.grossEarning - data.totDeduction).toFixed()
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SalaryBreakupViewByOfferId;
