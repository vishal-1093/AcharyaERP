import React, { useState, useEffect } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip, Typography } from "@mui/material";
import { checkFullAccess, convertToDMY } from "../../utils/DateTimeUtils";
import moment from "moment";
import { CustomDataExport } from "../../components/CustomDataExport";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const EmployeeContract = () => {
  const [rows, setRows] = useState([]);
  console.log(rows,"rows");
  const navigate = useNavigate();
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const getData = async () => {
    await axios
        .get(
          `/api/employee/fetchAllEmployeeDetails?page=${0}&page_size=${10000}&sort=created_date`
        )
        .then((res) => {
          const ConsultantData = res.data.data.Paginated_data.content?.filter(
            (o) => o?.empTypeShortName === "CON"
          );
          setRows(ConsultantData);
        })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    setCrumbs([{ name: "Payment History" }]);
  }, []);
 

  const columns = [
    { field: "empcode", headerName: "Staff Code", flex: 1, hideable: false },
    {
      field: "employee_name",
      headerName: "Staff Name",
      width: 220,
      hideable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ cursor: "pointer", textTransform: "capitalize" }}
              onClick={() =>
                navigate(
                  `/EmployeeDetailsView/${params.row.id}/${params.row.offer_id}`
                )
              }
            >
              {params.row.phd_status === "holder"
                ? "Dr. " + params.row.employee_name
                : params.row.employee_name
                ? params.row.employee_name
                : ""}
            </Typography>
          </>
        );
      },
    },

    {
      field: "empTypeShortName",
      headerName: "Type",
      flex: 1,
      hideable: false,
    },
    // { field: "email", headerName: "Email", flex: 1, hideable: false },
    { field: "mobile", headerName: "Mobile", flex: 1, hideable: false },

    // {
    //   field: "relieving_date",
    //   headerName: "Relieving date",
    //   flex: 1,
    //   hideable: false,
    //   renderCell: (params) =>
    //     moment(params.row.relieving_date).format("DD-MM-YYYY"),
    // },
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
    // {
    //   field: "designation_short_name",
    //   headerName: "Designation",
    //   width: 200,
    //   flex: 1,
    //   hideable: false,
    // },
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
    {
      field: "payDays",
      headerName: "Pay Days",
      flex: 1,
      hideable: false,
      hide: false,
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
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      hideable: false,
      hide: false,
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
    {
      field: "balance",
      headerName: "Balance",
      flex: 1,
      hideable: false,
      hide: false,
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
    {
      field: "paymentmonth",
      headerName: "Payment Month",
      flex: 1,
      hideable: false,
      hide: false,
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
      {/* {rows.length > 0 && (
        <CustomDataExport dataSet={rows} titleText="Employee Inactive" />
      )} */}
      <GridIndex rows={rows} columns={columns} />
    </>
  );
};

export default EmployeeContract;
