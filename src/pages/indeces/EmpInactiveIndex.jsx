import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { Tooltip, Typography, styled, tooltipClasses } from "@mui/material";
import { checkFullAccess, convertToDMY } from "../../utils/DateTimeUtils";
import { CustomDataExport } from "../../components/CustomDataExport";
import moment from "moment";
const GridIndex = lazy(() => import("../../components/GridIndex"));

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

const EmpInactiveIndex = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllInActiveEmployeeDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hideable: false },
    {
      field: "employee_name",
      headerName: "Name",
      hideable: false,
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {params.row.employee_name.toLowerCase()}
            </Typography>
          }
        >
          <Typography
            variant="subtitle2"
            color="primary"
            onClick={() =>
              navigate(
                `/EmployeeDetailsView/${params.row.id}/${params.row.offer_id}`
              )
            }
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
            }}
          >
            {params.row.phd_status === "holder"
              ? "Dr. " + params.row.employee_name.toLowerCase()
              : params.row.employee_name.toLowerCase()}
          </Typography>
        </HtmlTooltip>
      ),
    },

    {
      field: "empTypeShortName",
      headerName: "Type",
      flex: 1,
      hideable: false,
    },
    { field: "email", headerName: "Email", flex: 1, hideable: false },
    { field: "mobile", headerName: "Mobile", flex: 1, hideable: false },

    {
      field: "relieving_date",
      headerName: "Relieving date",
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        moment(params.row.relieving_date).format("DD-MM-YYYY"),
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      hide: true,
    },
    {
      field: "job_short_name",
      headerName: "Job Type",
      flex: 1,
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
      field: "date_of_joining",
      headerName: "DOJ",
      flex: 1,
      hideable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.date_of_joining
              ? `${convertToDMY(params.row.date_of_joining.slice(0, 10))}`
              : ""}
          </>
        );
      },
    },
    {
      field: "ctc",
      headerName: "CTC",
      flex: 1,
      hideable: false,
      hide: true,
      renderCell: (params) => {
        return (
          <>
            {checkFullAccess(params.row.id) && (
              <>
                {params.row.empTypeShortName === "CON"
                  ? params.row.consolidated_amount
                  : params.row.ctc}
              </>
            )}
          </>
        );
      },
    },
  ];
  return (
    <>
      {rows.length > 0 && (
        <CustomDataExport dataSet={rows} titleText="Employee Inactive" />
      )}
      <GridIndex rows={rows} columns={columns} />
    </>
  );
};

export default EmpInactiveIndex;
