import { useState, useEffect, lazy } from "react";
import {
  Box, Grid, Button, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses, styled,
  CircularProgress
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import useAlert from "../../hooks/useAlert.js";
import { makeStyles } from "@mui/styles";
import axios from "../../services/Api.js";
import moment from "moment";
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker")
);
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));

const useStyles = makeStyles((theme) => ({
  header: {
    color: "white", textAlign: "center", fontSize: "14px"
  },
  flexCenter: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  flexAlignCenter: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  box: {
    marginTop: "8px",
    boxShadow:
      "0px 8px 8px 0px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center"
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
}));

const StyledOddTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const salaryReportTypeList = [
  { value: "bank", label: "Bank" },
  { value: "lic", label: "LIC" },
  { value: "advance", label: "Advance" },
  { value: "tds", label: "TDS" },
  { value: "pt", label: "PT" },
  { value: "esi", label: "ESI" },
  { value: "epf", label: "EPF" },
  { value: "summary", label: "Summary" },
  { value: "school", label: "School" },
];

const bankList = [
  { value: "yesbank", label: "Yes Bank" },
  { value: "others", label: "Others" },
];

const initialState = {
  schoolId: null,
  deptId: null,
  bank: null,
  loading: false,
  schoolList: [],
  deptList: [],
  salaryReportType: salaryReportTypeList[0].value,
  date: new Date(),
  rows: [],
  attendanceRows: [],
  earningRows: [],
  deductionRows: [],
  schoolRows: []
};

const SalaryMisIndex = () => {
  const [{ schoolId, loading, schoolList, bank, salaryReportType, date, rows, attendanceRows, earningRows, deductionRows, schoolRows }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    contract_empcode: false,
    date_of_joining: false,
    departmentShortName: false,
    designationShortName: false
  });
  const classes = useStyles();

  useEffect(() => {
    setCrumbs([{ name: `${salaryReportType?.toUpperCase()}` }]);
  }, [salaryReportType]);

  useEffect(() => {
    getSchoolData();
  }, []);

  useEffect(() => {
    getData(salaryReportType)
  }, [schoolId, bank, date]);

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res.data.data.map((ele) => ({ value: ele.school_id, label: ele.school_name }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getData = async (type = "bank") => {
    try {
      if (date && (type !== "summary" && type !== "school")) {
        setLoading(true);
        const apiUrl = `api/employee/employeePayHistoryReport`;
        const res = await axios.get((!schoolId && !bank && date) ? `${apiUrl}?month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}` :
          (schoolId && bank && date) ? `${apiUrl}?schoolId=${schoolId}&bank_id=${bank}&month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}` :
            (schoolId && !bank && date) ? `${apiUrl}?schoolId=${schoolId}&month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}` :
              (!schoolId && bank && date) ? `${apiUrl}?bank_id=${bank}&month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}` : "");
        if (res.status == 200 || res.status == 201) {
          setState((prevState) => ({
            ...prevState,
            rows: type == "bank" ? res.data.data?.filter((ele) => ele.netpay !== 0) :
              type == "lic" ? res.data.data?.filter((ele) => ele.lic !== 0) :
                type == "esi" ? res.data.data?.filter((ele) => ele.esi !== 0) :
                  type == "advance" ? res.data.data?.filter((ele) => ele.advance !== 0) :
                    type == "tds" ? res.data.data?.filter((ele) => ele.tds !== null && ele.tds !== 0) :
                      type == "pt" ? res.data.data?.filter((ele) => ele.pt !== 0) :
                        res.data.data,
            loading: false
          }));
        }
      } else if (date && (type !== "school" && type == "summary")) {
        setLoading(true);
        const apiUrl = `/api/employee/employeesCountFromAttendanceAndPaySheet`;
        const res = await axios.get(`${apiUrl}?month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}`);
        if (res.status == 200 || res.status == 201) {
          const slipApiUrl = `api/employee/totalSalarySlipByMonthAndYear`;
          const slipRes = await axios.get(`${slipApiUrl}?month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}`);
          if (slipRes.status == 200 || slipRes.status == 201) {
            const attendanceList = [
              { id: 1, name: "Total Head Count", value: res.data.data[0]?.attendanceCount || 0 },
              { id: 2, name: "Paid Head Count", value: res.data.data[0]?.paidAttendanceCount || 0 },
              { id: 3, name: "Maternity Absentees", value: res.data.data[0]?.maternity || 0 },
              { id: 4, name: "Long Absentees", value: res.data.data[0]['Absentees/Inactive'] || 0 },
            ];
            const earningList = [
              { id: 1, name: "Total Earned Salary", value: slipRes.data.data?.totalEarning || 0 },
              { id: 2, name: "Exam Remuneration", value: slipRes.data.data?.totalExtraRemuneration.find((ele) => ele.type == "Exam Remuneration")?.totalExtraRemuneration || 0 },
              { id: 3, name: "Incentive/Arrears/Maternity", value: slipRes.data.data?.totalExtraRemuneration.filter((ele) => ele.type !== "Exam Remuneration").reduce((sum, acc) => sum + acc['totalExtraRemuneration'], 0) || 0 },
              { id: 4, name: "Total Gross Salary", value: slipRes.data.data?.grossPay || 0 },
            ];
            const deductionList = [
              { id: 1, name: "EPF", value: slipRes.data.data?.pf || 0 },
              { id: 2, name: "ESI", value: slipRes.data.data?.esi || 0 },
              { id: 3, name: "PT", value: slipRes.data.data?.pt || 0 },
              { id: 4, name: "LIC", value: slipRes.data.data?.lic || 0 },
              { id: 1, name: "ADVANCE", value: slipRes.data.data?.advance || 0 },
              { id: 2, name: "TDS", value: slipRes.data.data?.tds || 0 },
              { id: 3, name: "Total Deduction", value: slipRes.data.data?.totalDeduction || 0 },
              { id: 4, name: "Net Salary Payable", value: slipRes.data.data?.netPay || 0 },
            ];
            setState((prevState) => ({
              ...prevState,
              attendanceRows: attendanceList,
              earningRows: earningList,
              deductionRows: deductionList,
              loading: false
            }));
          }
        }
      } else {
        setLoading(true);
        const apiUrl = `/api/employee/payReportOfEmployeeBySchoolAndBank`;
        const res = await axios.get(`${apiUrl}?month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}`);
        if (res.status == 200 || res.status == 201) {
          setState((prevState) => ({
            ...prevState,
            schoolRows: res.data.data.map((ele, index) => ({ id: index + 1, ...ele })),
            loading: false
          }));
        }
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    if(name == "salaryReportType"){
      clearRow(newValue);
    }
    setState((prevState) => ({
      ...prevState,
      [name]: newValue
    }))
  };

  const clearRow = (newValue) => {
    setState((prevState) => ({
      ...prevState,
      rows:[],
      earningRows:[],
      deductionRows:[],
      attendanceRows:[],
      schoolRows:[]
    }));
    getData(newValue);
  };

  const bankReportColumns = [
    {
      field: "bank_id",
      headerName: "Bank",
      flex: 1
    },
    {
      field: "bank_ifsccode",
      headerName: "IFSC No",
      flex: 1
    },
    {
      field: "bank_account_no",
      headerName: "Bank Account",
      flex: 1
    },
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1 },
    { field: "employee_name", headerName: "Name", flex: 2 },
    { field: "date_of_joining", headerName: "DOJ", flex: 1 },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1
    },
    {
      field: "designationShortName",
      headerName: "Designation",
      flex: 1
    },
    {
      field: "netpay",
      headerName: "Net Amount",
      flex: 1,
      type: "number"
    },
  ];
  const licColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1 },
    { field: "employee_name", headerName: "Name", flex: 2 },
    { field: "date_of_joining", headerName: "DOJ", flex: 1 },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1
    },
    {
      field: "designationShortName",
      headerName: "Designation",
      flex: 1
    },
    { field: "lic_number", headerName: "LIC Policy No.", type: "number", flex: 1 },
    {
      field: "lic",
      headerName: "LIC Amount",
      type: "number",
      flex: 1,
    },
  ];
  const esiColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1 },
    { field: "employee_name", headerName: "Name", flex: 2 },
    { field: "date_of_joining", headerName: "DOJ", flex: 1 },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1
    },
    {
      field: "designationShortName",
      headerName: "Designation",
      flex: 1
    },
    { field: "pay_days", headerName: "Pay Days", flex: 1 },
    { field: "gross_pay", headerName: "ESI Earning", type: "number", flex: 1 },
    { field: "esi", headerName: "ESIE", type: "number", flex: 1 },
    { field: "esi_contribution_employee", headerName: "ESIM", type: "number", flex: 1 },
  ];
  const epfColumns = [
    { field: "uan_no", headerName: "UAN", flex: 1 },
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1 },
    { field: "employee_name", headerName: "Name", flex: 2 },
    { field: "date_of_joining", headerName: "DOJ", flex: 1 },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1
    },
    {
      field: "designationShortName",
      headerName: "Designation",
      flex: 1
    },
    { field: "gross", headerName: "Gross Wages", flex: 1 },
    { field: "EPF_wages", headerName: "EPF Wages", flex: 1 },
    { field: "EPS_wages", headerName: "EPS Wages", flex: 1 },
    { field: "EDLI", headerName: "EDLI Wages", flex: 1 },
    { field: "EPF", headerName: "EPF Contri remitted", flex: 1 },
    { field: "EPS", headerName: "EPS Contri remitted", flex: 1 },
    { field: "EPF_EPS", headerName: "EPF EPS Diff remitted", flex: 1 },
    { field: "NCP", headerName: "NCP Days", flex: 1 },
    { field: "Refund", headerName: "Refund Of Advances", flex: 1 }
  ];
  const ptColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1 },
    { field: "employee_name", headerName: "Name", flex: 2 },
    { field: "date_of_joining", headerName: "DOJ", flex: 1 },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1
    },
    {
      field: "designationShortName",
      headerName: "Designation",
      flex: 1
    },
    { field: "total_earning", headerName: "Gross Amount", type: "number", flex: 1 },
    { field: "pt", headerName: "Deduction Amount", type: "number", flex: 1 },
  ];

  const advanceColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1 },
    { field: "employee_name", headerName: "Name", flex: 2 },
    { field: "date_of_joining", headerName: "DOJ", flex: 1 },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1
    },
    {
      field: "designationShortName",
      headerName: "Designation",
      flex: 1
    },
    { field: "advance", headerName: "Advance Amount", type: "number", flex: 1 }
  ];

  const tdsColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1 },
    { field: "employee_name", headerName: "Name", flex: 2 },
    { field: "date_of_joining", headerName: "DOJ", flex: 1 },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1
    },
    {
      field: "designationShortName",
      headerName: "Designation",
      flex: 1
    },
    { field: "gross_pay", headerName: "Gross Earning", type: "number", flex: 1 },
    { field: "tds", headerName: "TDS", type: "number", flex: 1 }
  ];

  return (
    <Box
      sx={{
        position: "relative"
      }}
    >
      <Grid container rowSpacing={{ xs: 1, md: 0 }} columnSpacing={{ xs: 3 }} sx={{ marginTop: { xs: 2, md: -5 }, justifyContent: "flex-end" }}>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="salaryReportType"
            value={salaryReportType}
            label="Salary Report Type"
            handleChangeAdvance={handleChangeAdvance}
            options={salaryReportTypeList}
          />
        </Grid>
        {salaryReportType == "bank" && <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="bank"
            value={bank}
            label="Bank"
            handleChangeAdvance={handleChangeAdvance}
            options={bankList}
          />
        </Grid>}
        {salaryReportType !== "summary" && salaryReportType !== "school" && <Grid item xs={12} md={3}>
          <CustomAutocomplete
            name="schoolId"
            value={schoolId}
            label="School"
            handleChangeAdvance={handleChangeAdvance}
            options={schoolList || []}
          />
        </Grid>}
        <Grid item xs={12} md={2}>
          <CustomDatePicker
            views={["month", "year"]}
            openTo="month"
            name="date"
            label="Select Month"
            inputFormat="MM/YYYY"
            helperText="mm/yyyy"
            value={date}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            variant="contained"
            disableElevation
          // disabled={!(schoolId && deptId) || loading}
          >
            {/* {loading ? (
              <CircularProgress
                size={20}
                style={{ margin: "2px 13px" }}
              />
            ) : ( */}
            Print
            {/* )} */}
          </Button>
        </Grid>
      </Grid>
      {!(salaryReportType == "summary" || salaryReportType == "school") ? <Box mt={1} sx={{ position: "absolute", width: "100%" }}>
        <GridIndex rows={rows}
          columns={salaryReportType == "bank" ? bankReportColumns : salaryReportType == "lic" ? licColumns : salaryReportType == "esi" ? esiColumns :
            salaryReportType == "epf" ? epfColumns : salaryReportType == "pt" ? ptColumns : salaryReportType == "advance" ? advanceColumns :
              salaryReportType == "tds" ? tdsColumns : []}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
          loading={loading} />
      </Box> :
        <>
          {salaryReportType == "summary" && <Box mt={1} className={classes.flexCenter}>
            <Box className={classes.box} sx={{ width: { xs: "100%", md: "50%" } }}>
              <TableContainer sx={{ width: "100%" }}>
                <Table size="small">
                  <TableHead className={classes.bg}>
                    <StyledTableRow>
                      <StyledTableCell sx={{ color: "white" }}>
                        Attendance Summary
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white", textAlign: "right" }}>
                        Count
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  {!loading && <TableBody>
                    {attendanceRows?.map((obj, i) => {
                      return (
                        <StyledOddTableRow key={i}>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.name}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {new Intl.NumberFormat().format(obj.value)}
                          </StyledTableCell>
                        </StyledOddTableRow>
                      );
                    })}
                  </TableBody>}
                </Table>
              </TableContainer>
              {loading && <Box mt={2} className={classes.flexAlignCenter}>
                <CircularProgress
                  size={30}
                  color="primary"
                  style={{ margin: "2px 13px" }}
                />
              </Box>}
            </Box>
          </Box>}

          {salaryReportType == "summary" && <Box mt={1} mb={2} className={classes.flexCenter}>
            <Box className={classes.box} sx={{ width: { xs: "100%", md: "50%" } }}>
              <TableContainer sx={{ width: "100%" }}>
                <Table size="small">
                  <TableHead className={classes.bg}>
                    <StyledTableRow>
                      <StyledTableCell sx={{ color: "white" }}>
                        Particulars
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white", textAlign: "right" }}>
                        Amount
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  {!loading && <TableBody>
                    {earningRows?.map((obj, i) => {
                      return (
                        <StyledTableRow key={i}>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.name == "Total Gross Salary" ? <b>{obj.name}</b> : obj.name}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {obj.name == "Total Gross Salary" ? <b>{new Intl.NumberFormat().format(obj.value)}</b> : new Intl.NumberFormat().format(obj.value)}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                    {deductionRows?.map((obj, i) => {
                      return (
                        <StyledTableRow key={i}>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.name == "Net Salary Payable" ? <b>{obj.name}</b> : obj.name}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {obj.name == "Net Salary Payable" ? <b>{new Intl.NumberFormat().format(obj.value)}</b> : new Intl.NumberFormat().format(obj.value)}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                  </TableBody>}
                </Table>
              </TableContainer>
              {loading && <Box mt={2} className={classes.flexAlignCenter}>
                <CircularProgress
                  size={30}
                  color="primary"
                  style={{ margin: "2px 13px" }}
                />
              </Box>}
            </Box>
          </Box>}

          {/* {salaryReportType == "summary" && <Box mt={1} mb={2} className={classes.flexCenter}>
            <Box className={classes.box} sx={{ width: { xs: "100%", md: "50%" } }}>
              <TableContainer sx={{ width: "100%" }}>
                <Table size="small">
                  {!loading && <TableBody>
                    {deductionRows?.map((obj, i) => {
                      return (
                        <StyledTableRow key={i}>
                          <StyledTableCell sx={{textAlign:"justify" }}>
                            {obj.name}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {new Intl.NumberFormat().format(obj.value)}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                  </TableBody>}
                </Table>
              </TableContainer>
              {loading && <Box mt={2} className={classes.flexAlignCenter}>
                <CircularProgress
                  size={30}
                  color="primary"
                  style={{ margin: "2px 13px" }}
                />
              </Box>}
            </Box>
          </Box>} */}

          {salaryReportType == "school" && <Box mt={1} mb={2} className={classes.flexCenter}>
            <Box className={classes.box} sx={{ width: { xs: "100%", md: "50%" } }}>
              <TableContainer sx={{ width: "100%" }}>
                <Table size="small">
                  <TableHead className={classes.bg}>
                    <StyledTableRow>
                      <StyledTableCell sx={{ color: "white" }}>
                        Bank
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white" }}>
                        Institute
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white", textAlign: "right" }}>
                        Amount
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  {!loading && <TableBody>
                    {schoolRows?.map((obj, i) => {
                      return (
                        <StyledOddTableRow key={i}>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.bankId}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.schoolNameShort}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {new Intl.NumberFormat().format(obj.totalNetPay)}
                          </StyledTableCell>
                        </StyledOddTableRow>
                      );
                    })}
                  </TableBody>}
                  {schoolRows?.length > 0 && <StyledTableRow>
                    <StyledTableCell>
                    </StyledTableCell>
                    <StyledTableCell>
                      <b>TOTAL</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "right" }}>
                      <b>{new Intl.NumberFormat().format(schoolRows.reduce((sum, acc) => sum + acc[`totalNetPay`], 0))}</b>
                    </StyledTableCell>
                  </StyledTableRow>}
                </Table>
              </TableContainer>
              {loading && <Box mt={2} className={classes.flexAlignCenter}>
                <CircularProgress
                  size={30}
                  color="primary"
                  style={{ margin: "2px 13px" }}
                />
              </Box>}
            </Box>
          </Box>}
        </>}
    </Box>
  );
};

export default SalaryMisIndex;
