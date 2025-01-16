import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Box, Tooltip, Typography } from "@mui/material";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { convertToDateandTime } from "../../../utils/Utils";

function AttendServiceTransportHistoryIndex() {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
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
        `/api/fetchAllTransportMaintenanceHistory?page=0&page_size=${1000000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "type_of_vehicle", headerName: "Type Of Vehicle", flex: 1 },
    { field: "reporting_place", headerName: "Reporting Place", flex: 1 },
    {
      field: "requesting_from_datetime",
      headerName: "PickUp Date&Time",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={convertToDateandTime(params.row.requesting_from_datetime)} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >{convertToDateandTime(params.row.requesting_from_datetime)}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "requesting_to_datetime",
      headerName: "Droping Date&Time",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={convertToDateandTime(params.row.requesting_to_datetime)} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >{convertToDateandTime(params.row.requesting_to_datetime)}
          </Typography>
        </Tooltip>
      ),
    },
    { field: "duration", headerName: "Duration", flex: 1 },
    { field: "report_to_person", headerName: "Reporting Person", flex: 1 },
    { field: "place_of_visit", headerName: "Place Of Visit", flex: 1 },
    {
      field: "purpose",
      headerName: "Purpose",
      flex: 1
    },
    {
      field: "request_status",
      headerName: "Request Status",
      flex: 1
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default AttendServiceTransportHistoryIndex;
