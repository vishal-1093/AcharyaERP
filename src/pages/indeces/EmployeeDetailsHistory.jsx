import { useState, useEffect } from "react";
import axios from "../../services/Api";
import {
  Box,
  Grid,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import GridIndex from "../../components/GridIndex";
import DOMPurify from "dompurify";
import moment from "moment";

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
  const [values, setValues] = useState({ empId: null });
  const [rows, setRows] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([{ name: "Employee History" }]);
    getEmployeeData();
  }, []);

  useEffect(() => {
    getData();
  }, [values.empId]);

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

  const getData = async () => {
    if (values.empId)
      await axios
        .get(`/api/employee/employeeDetailsHistoryOnEmpId/${values.empId}`)
        .then((res) => {
          let empHistoryList = res.data.data.reverse();
          const rowId = empHistoryList.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
          setRows(rowId);
        })
        .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const createMarkUp = (string) => {
    const sanitizedHTML = DOMPurify.sanitize(string);
    const text = sanitizedHTML.replace(/<[^>]*>/g, "");
    return (
      <HtmlTooltip
        title={
          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
            {text}
          </Typography>
        }
      >
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textTransform: "capitalize",
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      </HtmlTooltip>
    );
  };

  const columns = [
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      hideable: false,
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
      flex: 1,
      hideable: false,
      renderCell: (params) => createMarkUp(params.row.created_username),
    },
    {
      field: "employee_name",
      headerName: "Employee Name",
      flex: 1,
      hideable: false,
      renderCell: (params) => createMarkUp(params.row.employee_name),
    },
    {
      field: "shift_name",
      headerName: "Shift",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.shift_name),
    },
    {
      field: "chief_proctor_id",
      headerName: "Proctor Head",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.chief_proctor_id),
    },
    {
      field: "report_id",
      headerName: "Reported To",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.report_id),
    },
    {
      field: "leave_approver1_emp_id",
      headerName: "Leave Approver 1",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.leave_approver1_emp_id),
    },
    {
      field: "leave_approver2_emp_id",
      headerName: "Leave Approver 2",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.leave_approver2_emp_id),
    },
    {
      field: "store_indent_approver1",
      headerName: "Store Indent Approver 1",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.store_indent_approver1),
    },
    {
      field: "store_indent_approver2",
      headerName: "Store Indent Approver 2",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.store_indent_approver2),
    },
    {
      field: "phd_status",
      headerName: "PhD Status",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.phd_status),
    },
    {
      field: "preferred_name_for_email",
      headerName: "Preffered Name For E-Mail",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.preferred_name_for_email),
    },
    {
      field: "current_location",
      headerName: "Current Address",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.current_location),
    },
    {
      field: "hometown",
      headerName: "Permanent Address",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.hometown),
    },
    {
      field: "mobile",
      headerName: "Mobile No.",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.mobile),
    },
    {
      field: "alt_mobile_no",
      headerName: "Alternative Mobile No.",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.alt_mobile_no),
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.gender),
    },
    {
      field: "martial_status",
      headerName: "Maritial Status",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.martial_status),
    },
    {
      field: "dateofbirth",
      headerName: "DOB",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.dateofbirth),
    },
    {
      field: "blood_group",
      headerName: "Blood Group",
      flex: 1,
      renderCell: (params) => createMarkUp(params.row.blood_group),
    },
    {
      field: "religion",
      headerName: "Religion",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.religion),
    },
    {
      field: "caste_category",
      headerName: "Caste Category",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.caste_category),
    },
    {
      field: "bank_id",
      headerName: "Bank",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.bank_id),
    },
    {
      field: "bank_account_no",
      headerName: "Account No.",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.bank_account_no),
    },
    {
      field: "bank_account_holder_name",
      headerName: "Account Holder Name",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.bank_account_holder_name),
    },
    {
      field: "bank_branch",
      headerName: "Bank Branch",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.bank_branch),
    },
    {
      field: "bank_ifsccode",
      headerName: "IFSC Code",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.bank_ifsccode),
    },
    {
      field: "aadhar",
      headerName: "Aadhar No.",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.aadhar),
    },
    {
      field: "pan_no",
      headerName: "PAN No.",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.pan_no),
    },
    {
      field: "uan_no",
      headerName: "UAN No.",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.uan_no),
    },
    {
      field: "punched_card_status",
      headerName: "Biometric Status",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.punched_card_status),
    },
    {
      field: "pf_no",
      headerName: "PF No.",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.pf_no),
    },
    {
      field: "dlno",
      headerName: "DL No.",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.dlno),
    },
    {
      field: "dlexpno",
      headerName: "DL Expirydate",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.dlexpno),
    },
    {
      field: "passportno",
      headerName: "Passport No.",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.passportno),
    },
    {
      field: "passportexpno",
      headerName: "Passport Expirydate",
      flex: 1,
      hide: true,
      renderCell: (params) => createMarkUp(params.row.passportexpno),
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <Grid container rowSpacing={4}>
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
