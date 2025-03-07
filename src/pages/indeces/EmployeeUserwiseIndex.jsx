import { useEffect, useState } from "react";
import axios from "../../services/Api";
import {
  Box,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  redRow: {
    backgroundColor: "#FFD6D7 !important",
  },
});

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

function EmployeeUserwiseIndex({ tab }) {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllEmployeeDetailsBasedOnUserId?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        const filterData = res.data.data.Paginated_data.content?.filter(
          (obj) => {
            if (tab === "Consultant") {
              return obj.empTypeShortName === "CON";
            } else {
              return obj.empTypeShortName !== "CON";
            }
          }
        );

        setRows(filterData);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hideable: false },
    {
      field: "employee_name",
      headerName: "Employee",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {params.row.employee_name?.toLowerCase()}
            </Typography>
          }
        >
          <Typography
            variant="subtitle2"
            color="primary"
            onClick={() =>
              navigate(
                `/EmployeeDetailsView/${params.row.id}/${params.row.offer_id}/user`
              )
            }
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {params.row?.phd_status === "holder"
              ? "Dr. " + params.row.employee_name?.toLowerCase()
              : params.row.employee_name?.toLowerCase()}
          </Typography>
        </HtmlTooltip>
      ),
    },
    {
      field: "empTypeShortName",
      headerName: "Onboard",
      flex: 1,
      hideable: false,
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      hideable: false,
    },
    {
      field: "dept_name_short",
      headerName: "Department",
      flex: 1,
      hideable: false,
    },
    {
      field: "designation_short_name",
      headerName: "Designation",
      flex: 1,
      hideable: false,
    },
    {
      field: "job_type",
      headerName: "Job Type",
      flex: 1,
      hideable: false,
    },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      flex: 1,
      hideable: false,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      hideable: false,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      hideable: false,
      valueGetter: (params) =>
        params.value === "M" ? "Male" : params.value === "F" ? "Female" : "",
    },
    {
      field: "leaveApproverName1",
      headerName: "Leave Approver 1",
      flex: 1,
      hideable: false,
    },
    {
      field: "leaveApproverName2",
      headerName: "Leave Approver 2",
      flex: 1,
      hideable: false,
    },
    {
      field: "storeIndentApproverName",
      headerName: "Store Indent Approver 1",
      flex: 1,
      hide: true,
    },
  ];

  const getRowClassName = (params) => {
    return params.row?.new_join_status === 1 ? "" : classes.redRow;
  };

  return (
    <Box mt={3}>
      <GridIndex
        rows={rows}
        columns={columns}
        getRowClassName={getRowClassName}
      />
    </Box>
  );
}

export default EmployeeUserwiseIndex;
