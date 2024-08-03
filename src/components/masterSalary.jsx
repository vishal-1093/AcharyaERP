import { useEffect, useState } from "react";
import axios from "../services/Api";
import { Box, Button, Grid, IconButton } from "@mui/material";
import FormPaperWrapper from "./FormPaperWrapper";
import GridIndex from "./GridIndex";
import DownloadIcon from "@mui/icons-material/Download";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import CustomDatePicker from "./Inputs/CustomDatePicker";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { convertUTCtoTimeZone } from "../utils/DateTimeUtils";
import { GeneratePaySlip } from "../pages/forms/employeeMaster/GeneratePaySlip";
import numberToWords from "number-to-words";
import useAlert from "../hooks/useAlert";

const today = new Date();

const initialValues = {
  month: convertUTCtoTimeZone(
    new Date(today.getFullYear(), today.getMonth() - 1)
  ),
  deptId: null,
  schoolId: null,
};

function MasterSalary() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [salaryHeads, setSalaryHeads] = useState([]);
  const [paySlipLoading, setPaySlipLoading] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      flex: 1,
      hideable: false,
      renderCell: (params) => params.api.getRowIndex(params.id) + 1,
    },
    { field: "empcode", headerName: "Emp Code", flex: 1, hideable: false },
    {
      field: "employee_name",
      headerName: "Employee Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "schoolShortName",
      headerName: "School",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "dept_name",
      headerName: "Department",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "designation_name",
      headerName: "Designation",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "job_type",
      headerName: "Job Type",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "employee_type",
      headerName: "Employee Type",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "salary_structure",
      headerName: "Salary Structure",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "pay_days",
      headerName: "Pay Days",
      flex: 1,
      hideable: false,
    },
    {
      field: "master_salary",
      headerName: "Master Pay",
      flex: 1,
      hideable: true,
    },
  ];

  const handleSaveClick = async (rowdata) => {
    // navigate("/payreportPdf", { state: { rowdata, values } });
    setPaySlipLoading(true);

    const paySlipData = await axios
      .get(`/api/employee/getPaySlipDetails?emp_pay_history_id=${rowdata.id}`)
      .then((res) => {
        const temp = { ...res.data.data };
        const netPay = temp.total_earning - temp.total_deduction;
        temp.netPayDisplay = netPay;
        temp.netPayInWords = numberToWords.toWords(netPay);
        return temp;
      })
      .catch((err) => console.error(err));
    console.log("paySlipData", paySlipData);

    const blobFile = await GeneratePaySlip(paySlipData);

    if (!blobFile) {
      setAlertMessage({
        severity: "error",
        message: "Something went wrong !!",
      });
      setAlertOpen(true);
    }

    window.open(URL.createObjectURL(blobFile));
    setPaySlipLoading(false);
  };

  useEffect(() => {
    getSchoolDetails();
    handleSubmit();
    getSalaryHeads();
  }, []);

  useEffect(() => {
    if (isSubmit === true) {
      GridData();
    }
  }, [isSubmit]);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "schoolId" &&
        (newValue === "" || newValue === null) && { deptId: "" }),
    }));
  };

  const getDepartmentOptions = async () => {
    if (values?.schoolId) {
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.dept_id,
              label: obj.dept_name,
            });
          });
          setDepartmentOptions(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleSubmit = async () => {
    const getMonthYear = values.month.substr(0, 7).split("-");
    const temp = {};
    temp.page = 0;
    temp.page_size = 100000;
    temp.school_id = values?.schoolId;
    temp.dept_id = values?.deptId;
    temp.month = parseInt(getMonthYear[1]);
    temp.year = parseInt(getMonthYear[0]);
    console.log(temp, "temp");
    await axios
      .get(`/api/employee/getEmployeeMasterSalary`, { params: temp })

      .then((res) => {
        setEmployeeList(res.data.data.content);
      })
      .catch((err) => console.error(err));

    setIsSubmit(true);
  };

  const getSalaryHeads = async () => {
    await axios
      .get(`/api/finance/SalaryStructureHead1`)
      .then((res) => {
        const earning = res.data.data.filter(
          (obj) => obj.category_name_type === "Earning"
        );

        const temp = [];

        earning
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .forEach((obj) => {
            temp.push({
              field: obj.print_name,
              headerName: obj.voucher_head_short_name,
              flex: 1,
              hideable: false,
            });
          });

        temp.push({
          field: "er",
          headerName: "ER",
          flex: 1,
          hideable: false,
        });

        temp.push({
          field: "total_earning",
          headerName: "Gross",
          flex: 1,
          hideable: false,
        });

        const deduction = res.data.data.filter(
          (obj) => obj.category_name_type === "Deduction"
        );

        console.log("res.data.data", res.data.data);
        console.log("deduction", deduction);

        deduction
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .forEach((obj) => {
            temp.push({
              field: obj.print_name,
              headerName: obj.voucher_head_short_name,
              flex: 1,
              hideable: false,
            });
          });

        temp.push({
          field: "advance",
          headerName: "Advance",
          flex: 1,
          hideable: false,
        });

        temp.push({
          field: "tds",
          headerName: "TDS",
          flex: 1,
          hideable: false,
        });

        temp.push({
          field: "total_deduction",
          headerName: "Total Deduction",
          flex: 1,
          hideable: false,
        });

        temp.push({
          field: "netpay",
          headerName: "Net Pay",
          flex: 1,
          hideable: false,
        });

        temp.push({
          field: "id",
          headerName: "Print",
          flex: 1,
          // hide: true,
          renderCell: (params) => (
            <IconButton
              onClick={() => handleSaveClick(params.row)}
              color="primary"
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          ),
        });

        setSalaryHeads(temp);
      })
      .catch((err) => console.error(err));
  };

  const GridData = () => <GridIndex rows={employeeList} columns={columns} />;

  if (salaryHeads.length > 0) {
    salaryHeads.forEach((obj) => {
      columns.push(obj);
    });
  }
  return (
    <Box m={3}>
      <Grid container rowSpacing={4}>
        {isSubmit ? (
          <>
            <Grid item xs={12} align="right">
              <IconButton
                onClick={() => setIsSubmit(false)}
                sx={{ padding: 0 }}
              >
                <FilterListIcon
                  fontSize="large"
                  sx={{ color: "auzColor.main" }}
                />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              {GridData()}
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <FormPaperWrapper>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={4}>
                  <CustomDatePicker
                    name="month"
                    label="Month"
                    value={values.month}
                    handleChangeAdvance={handleChangeAdvance}
                    views={["month", "year"]}
                    openTo="month"
                    inputFormat="MM/YYYY"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="schoolId"
                    label="School"
                    value={values.schoolId}
                    options={schoolOptions}
                    handleChangeAdvance={handleChangeAdvance}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="deptId"
                    label="Department"
                    value={values.deptId}
                    options={departmentOptions}
                    handleChangeAdvance={handleChangeAdvance}
                  />
                </Grid>

                <Grid item xs={12} md={12} align="right">
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                      values.month === null ||
                      values.month === "Invalid Date" ||
                      (values.schoolId && !values.deptId) ||
                      (values.deptId && !values.schoolId)
                    }
                  >
                    GO
                  </Button>
                </Grid>
              </Grid>
            </FormPaperWrapper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default MasterSalary;
