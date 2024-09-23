import { useState, useEffect, lazy } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { convertDateFormat } from "../../../utils/Utils";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
const GridIndex = lazy(() => import("../../../components/GridIndex"));


function BudgetIncrementIndex() {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const empId = localStorage.getItem("empId");


  useEffect(() => {
    getData();
    setCrumbs([{ name: "Budget Index" }]);
  }, []);


  const getData = async () => {
    await axios
      .get(
        `/api/incrementCreation/getIncrementCreationList`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };


  const columns = [
    {
      field: "empCode", headerName: "Staff Code", flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ paddingLeft: 0 }}
        >
          {params.row?.empCode ? params.row?.empCode : params.row?.empCode}
        </Typography>
      ),
    },

    {
      field: "employeeName",
      headerName: "Employee Name",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.employeeName} arrow>
          <Typography
            variant="body2"

            sx={{

              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 130,
            }}
          >
            {params.row.employeeName?.length > 20
              ? `${params.row.employeeName?.slice(0, 22)}...`
              : params.row.employeeName}
          </Typography>
        </Tooltip>
      ),
    },

    {
      field: "previousDesignation", headerName: "Current Designation", flex: 1, hide: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ paddingLeft: 0 }}
        >
          {params.row?.previousDesignation ? params.row?.previousDesignation : "-"}
        </Typography>
      ),
    },

    {
      field: "dateofJoining",
      headerName: "DOJ",
      flex: 1,
      type: "date",
      hide: true,
      valueGetter: (params) => params.row.dateofJoining ? convertDateFormat(params.row.dateofJoining) : "--",
    },
    {
      field: "previousDepartment",
      headerName: "Department",
      flex: 1,
      type: "date",
      valueGetter: (params) => params.row.previousDepartment ? params.row.previousDepartment : "--",
    },


    {
      field: "previousSalaryStructure", headerName: "Current Salary Structure", flex: 1, hide: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ paddingLeft: 0 }}
        >
          {params.row?.previousSalaryStructure ? params.row?.previousSalaryStructure : "--"}
        </Typography>
      ),
    },

    {
      field: "experience", headerName: "Experience", flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ paddingLeft: 0 }}
        >
          {params.row?.experience ? params.row?.experience : "-"}
        </Typography>
      ),
    },

    { field: "previousBasic", headerName: "Current Basic", flex: 1, hide: true },

    {
      field: "previousSplPay",
      headerName: "Current SplPay",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ paddingLeft: 0 }}
        >
          {params.row?.previousSplPay ? params.row?.previousSplPay : "-"}
        </Typography>
      ),
    },

    {
      field: "previousGrosspay",
      headerName: "Current Gross",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ paddingLeft: 0 }}
        >
          {params.row?.previousGrosspay ? params.row?.previousGrosspay : "-"}
        </Typography>
      ),
    },

    {
      field: "previousMedicalReimburesment",
      headerName: "Medical Reimburesment",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ paddingLeft: 0 }}
        >
          {params.row?.previousMedicalReimburesment ? params.row?.previousMedicalReimburesment : "-"}
        </Typography>
      ),
    },

    {
      field: "previousCtc",
      headerName: "Current CTC",
      flex: 1,
      type: "date",
      hide: true,
      valueGetter: (params) => params.row.previousCtc ? params.row.previousCtc : "",
    },
    { field: "proposedDesignation", headerName: "Designation Name", flex: 1, hide: true },
    { field: "proposedSalaryStructure", headerName: "Salary Structure", flex: 1 },
    {
      field: "Month",
      headerName: "From Month",
      flex: 1,
      type: "date",
      valueGetter: (params) => params.row.month ? (`${params.row.month}/${params.row.year}`) : "--",
    },
    { field: "proposedBasic", headerName: "Proposed Basic", flex: 1, hide: true, },
    { field: "proposedSplPay", headerName: "Proposed SplPay", flex: 1, hide: true, },
    { field: "proposedGrosspay", headerName: "Proposed Gross", flex: 1 },
    { field: "proposedCtc", headerName: "Proposed CTC", flex: 1, hide: true, },

    { field: "grossDifference", headerName: "Gross Difference ", flex: 1 },
    { field: "ctcDifference", headerName: " CTC Difference", flex: 1 },

  ];


  return (
    <>

      <Box sx={{ position: "relative", mt: 3 }}>
        <GridIndex rows={rows} columns={columns}
          getRowId={(row) => row.empId}
          checkboxSelection={true}
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = rows.filter((row) => selectedIDs.has(row.id));

            setSelectedRows(selectedRows);
          }} />
      </Box>
    </>
  );
}

export default BudgetIncrementIndex;