import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import {
  Box,
  Grid,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import moment from "moment";
const GridIndex = lazy(() => import("../../components/GridIndex"));
const EmployeeDetailsView = lazy(() =>
  import("../../components/EmployeeDetailsView")
);

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

function EmployeeDetailsHistory() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState({ empId: null });
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Employee History" }]);
    getEmployeeData();
  }, []);

  const getEmployeeData = async () => {
    await axios
      .get(`/api/employee/getAllActiveEmployeeDetails`)
      .then((res) => {
        const employeeData = [];
        res.data.data.forEach((obj) => {
          employeeData.push({
            label:
              obj.employee_name + "-" + obj.empcode + "-" + obj.dept_name_short,
            value: obj.emp_id,
          });
        });
        setEmployeeOptions(employeeData);
      })
      .catch((err) => console.error(err));
  };

  const getData = async (empId) => {
    await axios
      .get(`/api/employee/employeeDetailsHistoryOnEmpId/${empId}`)
      .then((res) => {
        let empHistoryList = res.data.data.reverse();
        const rowId = empHistoryList.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        setRows(rowId);
      })
      .catch((err) => console.error(err));
  };


  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
    getData(newValue);
  };

  const createMarkUp = (stringData) => {
    const html = stringData?.toString();
    const docu = html?.replace(/<[^>]*>/g, "");

    return (
      <>
        {docu?.length > 14 && typeof html !== "number" ? (
          <>
            <HtmlTooltip
              title={
                <Typography
                  variant="body2"
                  sx={{ textTransform: "capitalize" }}
                >
                  {docu}
                </Typography>
              }
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: docu.substring(0, 13) + "...",
                }}
              ></div>
            </HtmlTooltip>
          </>
        ) : (
          <>
            <HtmlTooltip
              title={
                <Typography
                  variant="body2"
                  sx={{ textTransform: "capitalize" }}
                >
                  {docu}
                </Typography>
              }
            >
              <div dangerouslySetInnerHTML={{ __html: stringData }}></div>
            </HtmlTooltip>
          </>
        )}
      </>
    );
  };

  const columns = [
    {
      field: "created_date",
      headerName: "Created Date",
      width: 100,
      renderCell: (params) =>
        createMarkUp(
          moment(params.row.created_date).format("DD-MM-YYYY") +
            "  " +
            moment(params.row.created_date).format("hh:mm A")
        ),
    },
    {
      field: "created_username",
      headerName: "Created By",
      width: 100,
      hideable: false,
    },
    {
      field: "aadhar",
      headerName: "Aadhar",
      width: 100,
      renderCell: (params) => createMarkUp(params.row.aadhar),
    },
    {
      field: "jobShortName",
      headerName: "Job Type",
      width: 100,
       renderCell: (params) =>params.row.jobShortName ? createMarkUp(params.row.jobShortName):params.row.job_short_name
    },

    {
      field: "empcode",
      headerName: "Emp Code",
      width: 100,
      hideable: false,
      renderCell: (params) => createMarkUp(params.row.empcode),
    },

    {
      field: "employee_name",
      headerName: "Name",
      width: 100,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {params.row.employee_name}
            </Typography>
          }
        >
          {createMarkUp(
            params.row.phd_status === "holder"
              ? "Dr. " + params.row.employee_name
              : params.row.employee_name
          )}
        </HtmlTooltip>
      ),
    },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      width: 100,
      hideable: false,
      renderCell: (params) => createMarkUp(params.row.date_of_joining),
    },
    {
      field: "to_date",
      headerName: "TO Date",
      width: 100,
      hideable: false,
      renderCell: (params) => createMarkUp(params.row.to_date),
    },
    {
      field: "empTypeShortName",
      headerName: "Employee Type",
      width: 100,
      hideable: false,
      renderCell: (params) => createMarkUp(params.row.empTypeShortName),
    },
    {
      field: "schoolNameShort",
      headerName: "School",
      flex: 1,
      hideable: false,
       renderCell: (params) =>!!params.row.schoolNameShort ? createMarkUp(params.row.schoolNameShort):params.row.school_name_short,
    },
    {
      field: "deptNameShort",
      headerName: "Department",
      width: 150,
      renderCell: (params) => !!params.row.deptNameShort ? createMarkUp(params.row.deptNameShort):params.row.dept_name_short,
    },
    {
      field: "designation_short_name",
      headerName: "Designation",
      width: 100,
      renderCell: (params) => createMarkUp(params.row.designation_short_name),
      hide: true,
    },
    {
      field: "ctc",
      headerName: "CTC",
      width: 100,
      hideable: false,
      renderCell: (params) =>
        createMarkUp(
          params.row.empTypeShortName === "CON"
            ? params.row.consolidated_amount
            : params.row.ctc
        ),
    },

    {
      field: "bank_account_no",
      headerName: "Account No",
      width: 150,
      renderCell: (params) => createMarkUp(params.row.bank_account_no),
    },

    {
      field: "bank_account_holder_name",
      headerName: "Account Holder Name",
      width: 120,
      renderCell: (params) => createMarkUp(params.row.bank_account_holder_name),
    },
    {
      field: "bank_branch",
      headerName: "Branch",
      width: 100,
      renderCell: (params) => createMarkUp(params.row.bank_branch),
    },
    {
      field: "bank_ifsccode",
      headerName: "IFSC Code",
      width: 100,
      renderCell: (params) => createMarkUp(params.row.bank_ifsccode),
    },
    {
      field: "bank_name",
      headerName: "Bank Name",
      width: 150,
      renderCell: (params) => createMarkUp(params.row.bank_name),
    },

    {
      field: "blood_group",
      headerName: "Blood Group",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.blood_group),
    },

    {
      field: "salary_structure",
      headerName: "Salary Structure",
      width: 150,
      renderCell: (params) => createMarkUp(params.row.salary_structure),
    },

    {
      field: "caste_category",
      headerName: "Caste Category",
      width: 150,
      renderCell: (params) => createMarkUp(params.row.caste_category),
    },
    {
      field: "pan_no",
      headerName: "PAN No",
      width: 120,
      renderCell: (params) => createMarkUp(params.row.pan_no),
    },

    {
      field: "dlno",
      headerName: "DL No",
      width: 150,
      renderCell: (params) => createMarkUp(params.row.dlno),
    },

    {
      field: "dlexpno",
      headerName: "DL Expiry Date",
      width: 150,
      renderCell: (params) =>
        createMarkUp(moment(params.row.dlexpno).format("DD-MM-YYYY")),
    },

    {
      field: "passportno",
      headerName: "Passport No",
      width: 150,
      renderCell: (params) => createMarkUp(params.row.passportno),
    },

    {
      field: "passportexpnow",
      headerName: "Passport Expiry Date",
      width: 150,
      renderCell: (params) =>
        createMarkUp(moment(params.row.passportexpnow).format("DD-MM-YYYY")),
    },

    {
      field: "UpdateShiftName",
      headerName: "Shift",
      width: 150,
      renderCell: (params) =>createMarkUp(params.row.UpdateShiftName)
    },
    {
      field: "religion",
      headerName: "Religion",
      width: 100,
      renderCell: (params) => createMarkUp(params.row.religion),
    },

    {
      field: "leave_approver1_name",
      headerName: "Leave Approver 1",
      width: 100,
      renderCell: (params) => createMarkUp(params.row.leave_approver1_name),
    },

    {
      field: "leave_approver2_name",
      headerName: "Leave Approver 2",
      width: 100,
      height: 120,
      renderCell: (params) => createMarkUp(params.row.leave_approver2_name),
    },

    {
      field: "uan_no",
      headerName: "UAN No",
      width: 100,
      renderCell: (params) => createMarkUp(params.row.uan_no),
    },
    {
      field: "active",
      headerName: "Active",
      width: 100,
      renderCell: (params) => createMarkUp(params.row.active ? "Yes" : "No"),
    },
    {
      field: "biometric_status",
      headerName: "Biometric Status",
      width: 100,
      renderCell: (params) => createMarkUp(params.row.punched_card_status),
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <Grid
        container
        justifycontents="flex-start"
        alignItems="center"
        rowSpacing={2}
      >
        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="empId"
            value={values.empId}
            label="Employee"
            handleChangeAdvance={handleChangeAdvance}
            options={employeeOptions}
          />
        </Grid>
        {values.empId ? (
          <Grid item xs={12}>
            <GridIndex rows={rows} columns={columns} />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </Box>
  );
}

export default EmployeeDetailsHistory;
