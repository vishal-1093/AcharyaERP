import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress, Typography } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import useAlert from "../../hooks/useAlert.js";
import axios from "../../services/Api.js";
import moment from "moment";
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker")
);
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));

const salaryReportTypeList = [
  {value:"bank",label:"Bank"},
  {value:"lic",label:"LIC"},
  {value:"advance",label:"Advance"},
  {value:"tds",label:"TDS"},
  {value:"pt",label:"PT"},
  {value:"esi",label:"ESI"},
  {value:"epf",label:"EPF"},
];

const bankList = [
  {value:"yesbank",label:"Yes Bank"},
  {value:"other",label:"Others"},
];

const initialState = {
  schoolId: null,
  deptId:null,
  bank:null,
  loading:false,
  schoolList:[],
  deptList:[],
  salaryReportType: salaryReportTypeList[0].value,
  date:new Date(),
  rows:[]
};

const SalaryMisIndex = () => {
  const [{deptList,schoolId,deptId,loading,schoolList,bank,salaryReportType,date,rows},setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    contract_empcode:false,
    date_of_joining:false,
    departmentShortName:false,
    designationShortName:false
  });

  useEffect(()=>{
    setCrumbs([{name:`${salaryReportType?.toUpperCase()}`}]);
  },[salaryReportType]);

  useEffect(() => {
    getSchoolData();
  }, []);

  useEffect(()=>{
    getData(salaryReportType)
  },[schoolId,date]);

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

  const getDeptData = async (schoolId) => {
    try {
      if(schoolId){
        const res = await axios.get(`/api/fetchdept1/${schoolId}`);
        if (res.status == 200 || res.status == 201) {
          setState((prevState) => ({
            ...prevState,
            deptList: res.data.data.map((ele) => ({ value: ele.dept_id, label: ele.dept_name_short }))
          }))
        }
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
      if(date){
        setLoading(true);
        const apiUrl = `api/employee/employeePayHistoryReport`;
        const res = await axios.get((schoolId && !deptId && !date) ? `${apiUrl}?schoolId=${schoolId}`: (deptId && !schoolId && !date) ?  `${apiUrl}?deptId=${deptId}` :
          (schoolId && deptId && !date)? `${apiUrl}?schoolId=${schoolId}&deptId=${deptId}`: (!schoolId && !deptId && date) ? `${apiUrl}?month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}`:
          (schoolId && deptId && date)? `${apiUrl}?schoolId=${schoolId}&deptId=${deptId}&month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}`:
          (schoolId && !deptId && date)?  `${apiUrl}?schoolId=${schoolId}&month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}` : "");
        if (res.status == 200 || res.status == 201) {
          setState((prevState) => ({
            ...prevState,
            rows: type == "bank" ? res.data.data?.filter((ele)=>ele.netpay !==0) :
            type == "lic" ? res.data.data?.filter((ele)=>ele.lic !==0) :
             type == "esi" ? res.data.data?.filter((ele)=>ele.esi !==0) :
              res.data.data,
            loading:false
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
  
  const handleChangeAdvance = (name,newValue) => {
    name == "salaryReportType" &&  getData(newValue);
    setState((prevState)=>({
      ...prevState,
      [name]: newValue
    }))
  };
  
  const bankReportColumns = [
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
    { field: "empcode", headerName: "Emp Code", flex: 1},
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1},
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
      type:"number"
    },
  ];
  const licColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1},
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1},
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
    { field: "lic_number", headerName: "LIC Policy No.",type:"number", flex: 1},
    {
      field: "lic",
      headerName: "LIC Amount",
      type:"number",
      flex: 1,
    },
  ];
  const esiColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1},
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1},
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
    { field: "gross_pay", headerName: "ESI Earning",type:"number", flex: 1 },
    { field: "esi", headerName: "ESIE",type:"number", flex: 1 },
    { field: "esi_contribution_employee", headerName: "ESIM",type:"number", flex: 1 },
  ];
  const epfColumns = [
    { field: "uan_no", headerName: "UAN", flex: 1},
    { field: "empcode", headerName: "Emp Code", flex: 1},
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1},
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
    { field: "empcode", headerName: "Emp Code", flex: 1},
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1},
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
    { field: "total_earning", headerName: "Gross Amount",type:"number", flex: 1 },
    { field: "pt", headerName: "Deduction Amount",type:"number", flex: 1 },
  ];

  const advanceColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1},
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1},
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
    { field: "advance", headerName: "Advance Amount",type:"number", flex: 1 }
  ];

  const tdsColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1},
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1},
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
    { field: "gross_pay", headerName: "Gross Earning",type:"number", flex: 1 },
    { field: "tds", headerName: "TDS",type:"number", flex: 1 }
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
        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            name="schoolId"
            value={schoolId}
            label="School"
            handleChangeAdvance={handleChangeAdvance}
            options={schoolList || []}
          />
        </Grid>
        {/* <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="deptId"
            value={deptId}
            label="Department"
            disabled={!schoolId}
            options={deptList || []}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid> */}
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
      <Box mt={1} sx={{ position: "absolute", width: "100%" }}>
        <GridIndex rows={rows}
         columns={salaryReportType == "bank" ? bankReportColumns: salaryReportType == "lic" ? licColumns : salaryReportType == "esi" ? esiColumns : 
          salaryReportType == "epf" ? epfColumns : salaryReportType == "pt" ? ptColumns : salaryReportType == "advance" ? advanceColumns :
           salaryReportType == "tds" ? tdsColumns : []} 
         columnVisibilityModel={columnVisibilityModel}
         setColumnVisibilityModel={setColumnVisibilityModel} 
         loading={loading}/>
      </Box>
    </Box>
  );
};

export default SalaryMisIndex;
