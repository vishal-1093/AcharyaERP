import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Box, Tooltip, Typography } from "@mui/material";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { convertToDateandTime } from "../../../utils/Utils";

function AttendServiceHistory() {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const userId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;
  const [deptId, setDeptId] = useState([]);

  useEffect(() => {
    if (userId) {
      getDeptId(userId)
    }
  }, []);

  useEffect(() => {
    if (deptId?.dept_id) {
      getData(deptId?.dept_id);
    }
    setCrumbs([{ name: "Service Render", link: "/ServiceRender" },
    { name: "History" }
    ]);
  }, [deptId]);


  const getDeptId = async (userId) => {
    await axios
      .get(`/api/getDeptIdBasedOnUserId/${userId}`)
      .then((res) => {
        setDeptId(res.data.data[0])
      })
      .catch((error) => console.error(error));
  };

  const getData = async (deptId) => {
    await axios
      .get(
        `/api/Maintenance/fetchAllServiceTypeHistory?page=0&page_size=${10000}&sort=created_date&dept_id=${deptId}`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "serviceTicketId", headerName: "Ticket No", flex: 1 },
    { field: "serviceTypeName", headerName: "Service Type", flex: 1 },
    {
      field: "complaintDetails",
      headerName: "Details",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row.complaintDetails} arrow>
          <Typography
            variant="body2"

            sx={{

              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 150,
            }}
          >
            {params.row.complaintDetails.length > 15
              ? `${params.row.complaintDetails.slice(0, 18)}...`
              : params.row.complaintDetails}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "floorAndExtension",
      headerName: "Location",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row.floorAndExtension} arrow>
          <Typography
            variant="body2"

            sx={{

              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 150,
            }}
          >
            {params.row.floorAndExtension.length > 15
              ? `${params.row.floorAndExtension.slice(0, 18)}...`
              : params.row.floorAndExtension}
          </Typography>
        </Tooltip>
      ),
    },
    { field: "dept_name", headerName: "Dept", flex: 1 },
    { field: "created_username", headerName: "Indents By", flex: 1 },
    {
      field: "createdDate", headerName: "Indents Date", flex: 1,
      renderCell: (params) =>
      (

     <Typography variant="body2">
    {params.row.createdDate ? convertToDateandTime(params.row.createdDate) : "--"}
   </Typography>
     
     )
 },
   
    { field: "complaintAttendedByName", headerName: "Rendered By", flex: 1 },
    {
      field: "dateOfClosed", headerName: "Closed on", flex: 1,
      renderCell: (params) =>
      (
        <Typography variant="body2">
          {params.row.dateOfClosed ? convertToDateandTime(params.row.dateOfClosed) : "--"}
        </Typography>
      )
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 1,

      remarks: (params) => (
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{ cursor: "pointer", paddingLeft: 0 }}
        >

          {params.row?.remarks ? params.row?.remarks : "--"}
        </Typography>
      )
    },

  ];

  return (
    <Box sx={{ position: "relative", mt: 3 }}>

      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default AttendServiceHistory;
