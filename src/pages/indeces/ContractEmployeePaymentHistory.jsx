import React, { useState, useEffect } from "react";
import axios from "../../services/Api";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ExportButtonContract from "../../components/ExportButtonContract";
import SearchIcon from "@mui/icons-material/Search";
import ModalWrapper from "../../components/ModalWrapper";
import moment from "moment";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import useAlert from "../../hooks/useAlert";

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
    "&:nth-of-type(3)": {
      textAlign: "left",
    },
    "&:nth-of-type(4)": {
      width: "7%",
    },
    "&:nth-of-type(5)": {
      textAlign: "left",
    },
    "&:nth-of-type(6)": {
      textAlign: "left",
    },
  },
}));

function formatMonthYear(month, year) {
  const formattedMonth = month?.toString()?.padStart(2, "0");
  const formattedYear = year?.toString()?.slice(-2);
  return `${formattedMonth}-${formattedYear}`;
}
const extendInitialValues = { endDate: null, };

const ContractEmployeePaymentHistory = ({ paymentEmpId }) => {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  // const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    searchItem: "",
  });
  const [employeeList, setEmployeeList] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  const [extendValues, setExtendValues] = useState(extendInitialValues);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [extendLoading, setExtendLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const requiredFields = [];

  const checks = {
    endDate: [extendValues.endDate !== null],
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!extendValues[field]) return false;
    }
    return true;
  };

  const getData = async () => {
    setLoading(true);
    await axios
      .get(`/api/consoliation/getConsoliationListByEmpId?empId=${paymentEmpId?.row?.id}`)
      .then((res) => {
        setRows(res?.data?.data);
        setEmployeeList(res?.data?.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const getDataMonthly = async (id) => {
    setLoading(true);
    await axios
      .get(`/api/consoliation/getMonthWisePaymentHistory/${id}`)
      .then((res) => {
        setData(res?.data?.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setCrumbs([{ name: "Payment History" }]);
  }, []);

  const onClosePopUp = () => {
    setPaymentOpen(false);
  };
  const onOpenPopUp = (row) => {
    setPaymentOpen(true);
    setRowData(row)
    getDataMonthly(row?.consoliatedAmountId)
  };

  const handleChangeSearch = (e) => {
    const filteredRows = employeeList.filter((obj) => {
      const chk = [];
      Object.values(obj).forEach((item) => {
        if (item !== null) {
          chk.push(
            item.toString().toLowerCase().includes(e.target.value.toLowerCase())
          );
        } else {
          chk.push("");
        }
      });

      if (chk.includes(true) === true) {
        return obj;
      }
    });

    setRows(filteredRows);
  };

  const handleChangeAdvanceExtend = (name, newValue) => {
    setExtendValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeExtend = (obj) => {
    setExtendValues((prev) => ({
      ...prev,
      endDate: "",
    }));
    setExtendModalOpen(true)
    setRowData(obj)
  };

  const tableData = () => (
    <TableContainer component={Paper} elevation={3}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={50}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              {`Payment History for ${paymentEmpId?.row?.employee_name.toLowerCase()}`}
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Sl No</StyledTableCell>
            {/* <StyledTableCell>Code</StyledTableCell> */}
            <StyledTableCell>Subject</StyledTableCell>
            {/* <StyledTableCell>Inst</StyledTableCell> */}
            <StyledTableCell>Period</StyledTableCell>
            {/* <StyledTableCell>Pay D</StyledTableCell> */}
            {/* <StyledTableCell>Pay Month</StyledTableCell> */}
            <StyledTableCell>Amount</StyledTableCell>
            <StyledTableCell>Paid</StyledTableCell>
            <StyledTableCell>Remaining</StyledTableCell>
            <StyledTableCell>Extend Date</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((obj, i) => {
              return (
                <TableRow key={i}>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {i + 1}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.subject}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {moment(obj.fromDate).format("DD/MM/YYYY")} to {moment(obj.toDate).format("DD/MM/YYYY")}
                    </Typography>
                  </StyledTableCellBody>

                  {/* <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary" textAlign = "center">
                      {formatMonthYear(obj?.month, obj?.year)}
                    </Typography>
                  </StyledTableCellBody> */}
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary" textAlign="right">
                      {obj.consoliatedAmount || 0}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      textAlign="right"
                      onClick={() => onOpenPopUp(obj)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {obj.payingAmount || 0}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary" textAlign="right">
                      {obj.remainingAmount || 0}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <IconButton onClick={() => handleChangeExtend(obj)}>
                      <AddBoxIcon color="primary" />
                    </IconButton>
                  </StyledTableCellBody>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2">No Records</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
  const tableDataMonthly = () => (
    <TableContainer component={Paper} elevation={3}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={50}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              {`Payment History for ${paymentEmpId?.row?.employee_name.toLowerCase()}`}
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Sl No</StyledTableCell>
            {/* <StyledTableCell>Code</StyledTableCell> */}
            {/* <StyledTableCell>Inst</StyledTableCell> */}
            {/* <StyledTableCell>Period</StyledTableCell> */}
            {/* <StyledTableCell>Pay D</StyledTableCell> */}
            <StyledTableCell>Pay Month</StyledTableCell>
            <StyledTableCell>Amount</StyledTableCell>
            <StyledTableCell>Paid</StyledTableCell>
            <StyledTableCell>Remaining</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length > 0 ? (
            data.map((obj, i) => {
              return (
                <TableRow key={i}>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {i + 1}
                    </Typography>
                  </StyledTableCellBody>

                  {/* <StyledTableCellBody>
                      <Typography variant="subtitle2" color="textSecondary">
                        {obj.fromDate} to {obj.toDate}
                      </Typography>
                    </StyledTableCellBody> */}

                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary" textAlign="center">
                      {formatMonthYear(obj.month, obj.year)}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary" textAlign="right">
                      {rowData.consoliatedAmount}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary" textAlign="right">
                      {obj.payingAmount}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary" textAlign="right">
                      {obj.remainingAmount}
                    </Typography>
                  </StyledTableCellBody>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2">No Records</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleSubmit = async () => {
    const toDate = moment(extendValues.endDate).format("YYYY/MM/DD")
    await axios
      .patch(`/api/consoliatedAmount/updateConsoliatedAmount/${rowData?.consoliatedAmountId}?toDate=${toDate}`)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Employee amount updated successfully !!",
          });
          setExtendModalOpen(false)
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "An error occured",
          });
        }
        setAlertOpen(true);
        getData();
      })
      .catch((err) => {
        isLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      });
  };

  return (
    <>
      <Grid
        container
        alignItems="baseline"
        columnSpacing={4}
        justifyContent="flex-end"
        marginBottom={5}
      >
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Grid
              item
              md={1}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              {/* {rows.length > 0 && (
                <ExportButtonContract
                  rows={rows}
                  name={`Contract Employee Payment History`}
                />
              )} */}
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                name="searchItem"
                values={values.searchItem}
                onChange={handleChangeSearch}
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {tableData()}
      </Grid>
      <ModalWrapper
        title={`Monthly Payment History - ${rowData?.subject}`}
        maxWidth={1000}
        open={paymentOpen}
        setOpen={onClosePopUp}
      >
        <Grid item xs={12}>
          {tableDataMonthly()}
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        open={extendModalOpen}
        setOpen={setExtendModalOpen}
        maxWidth={550}
        title={"Extend End Date"}
      >
        <Box mt={2}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <>
              <Grid item xs={12}>
                <CustomDatePicker
                  name="endDate"
                  label="End Date"
                  value={extendValues.endDate}
                  handleChangeAdvance={handleChangeAdvanceExtend}
                />
              </Grid>
            </>
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              disabled={!extendValues.endDate}
            >
              {extendLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Submit"
              )}
            </Button>
          </Grid>
        </Box>
      </ModalWrapper >

    </>
  );
};

export default ContractEmployeePaymentHistory;
