import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { decryptEncryptedData } from "../utils/decryptData";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

function SalaryBreakupView({ empId, id }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const offerData = await axios
      //.get(`/api/employee/fetchAllOfferDetailsByEmployeeId/${empId}`)
      .get(`/api/employee/encryptedFetchAllOfferDetailsByEmployeeId/${empId}`)
      .then((res) => {
       const {encryptedEmployeeDetails} = res.data.data
       const decryptData = decryptEncryptedData(encryptedEmployeeDetails)
       // return res.data.data[0];
       return decryptData
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/finance/getFormulaDetails/${offerData.salary_structure_id}`)
      .then((res) => {
        const earningTemp = [];
        const deductionTemp = [];
        const managementTemp = [];

        res.data.data
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .forEach((obj) => {
            if (obj.category_name_type === "Earning") {
              earningTemp.push({
                name: obj.voucher_head,
                monthly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName]
                ),
                yearly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName] * 12
                ),
                priority: obj.priority,
              });
            } else if (obj.category_name_type === "Deduction") {
              deductionTemp.push({
                name: obj.voucher_head,
                monthly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName]
                ),
                yearly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName] * 12
                ),
                priority: obj.priority,
              });
            } else if (obj.category_name_type === "Management") {
              managementTemp.push({
                name: obj.voucher_head,
                monthly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName]
                ),
                yearly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName] * 12
                ),
                priority: obj.priority,
              });
            }
          });

        const temp = {};
        temp["earnings"] = earningTemp;
        temp["deductions"] = deductionTemp;
        temp["management"] = managementTemp;
        let grossEarningAmt = 0;
        let totDeductionAmt = 0;
        let totManagementAmt = 0;

        if (temp.earnings.length > 0) {
          const tempData = [];
          temp.earnings.forEach((te) => {
            tempData.push(te.monthly);
          });
          grossEarningAmt = tempData.reduce((a, b) => a + b);
        }

        if (temp.deductions.length > 0) {
          const tempData = [];
          temp.deductions.forEach((te) => {
            tempData.push(te.monthly);
          });
          totDeductionAmt = tempData.reduce((a, b) => a + b);
        }

        if (temp.management.length > 0) {
          const tempData = [];
          temp.management.forEach((te) => {
            tempData.push(te.monthly);
          });
          totManagementAmt = tempData.reduce((a, b) => a + b);
        }

        temp["grossEarning"] = grossEarningAmt;
        temp["totDeduction"] = totDeductionAmt;
        temp["totManagement"] = totManagementAmt;

        setData(temp);
      })
      .catch((err) => console.error(err));
  };

  const classes = useStyles();

  return (
    <>
      <Box>
        <Grid container rowSpacing={1}>
          <Grid item xs={12} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="center"
                      className={classes.bg}
                      sx={{ color: "white" }}
                    >
                      Salary Breakup
                    </TableCell>
                  </TableRow>
                </TableHead>
                {Object.values(data).length > 0 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={2} align="left">
                        <Typography variant="subtitle2">Earnings</Typography>
                      </TableCell>
                    </TableRow>
                    {data.earnings
                      .filter((obj) => obj.monthly !== 0)
                      .sort((a, b) => {
                        return a.priority - b.priority;
                      })
                      .map((obj, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>{obj.name}</TableCell>
                            <TableCell align="right">
                              {obj.monthly.toFixed()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">
                          Gross Earning
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {data.grossEarning.toFixed()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} align="left">
                        <Typography variant="subtitle2">Deductions</Typography>
                      </TableCell>
                    </TableRow>
                    {data.deductions
                      .filter((obj) => obj.monthly !== 0)
                      .sort((a, b) => {
                        return a.priority - b.priority;
                      })
                      .map((val, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>{val.name}</TableCell>
                            <TableCell align="right">
                              {val.monthly.toFixed()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">
                          Total Deductions
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {data.totDeduction.toFixed()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} align="left">
                        <Typography variant="subtitle2">
                          Management Contribution
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {data.management
                      .filter((obj) => obj.monthly !== 0)
                      .sort((a, b) => {
                        return a.priority - b.priority;
                      })
                      .map((val, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>{val.name}</TableCell>
                            <TableCell align="right">
                              {val.monthly.toFixed()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">
                          Total Management Contribution
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {data.totManagement.toFixed()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">
                          Cost to Company
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {(data.grossEarning + data.totManagement).toFixed()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">Net Pay</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">
                          {(data.grossEarning - data.totDeduction).toFixed()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <></>
                )}
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default SalaryBreakupView;
