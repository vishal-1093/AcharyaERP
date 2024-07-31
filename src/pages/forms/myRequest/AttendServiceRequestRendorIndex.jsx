import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/NoteAlt";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { convertToDateandTime } from "../../../utils/Utils";

function AttendServiceRendorIndex() {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const [deptId, setDeptId] = useState([]);
  const navigate = useNavigate();
  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

  useEffect(() => {
    if (userId) {
      getDeptId(userId);
    }
  }, []);

  useEffect(() => {
    if (deptId?.dept_id) {
      getData(deptId?.dept_id);
    }
    setCrumbs([
      { name: "Service Render", link: "/ServiceRender" },
      { name: "Attend Request" },
    ]);
  }, [deptId]);

  const getData = async (deptId) => {
    await axios
      .get(
        `/api/Maintenance/fetchAllServiceTypeDetails?page=0&page_size=${10000}&sort=created_date&dept_id=${deptId}`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const getDeptId = async (userId) => {
    await axios
      .get(`/api/getDeptIdBasedOnUserId/${userId}`)
      .then((res) => {
        setDeptId(res.data.data[0]);
      })
      .catch((error) => console.error(error));
  };

  const columns = [
    {
      field: "complaintStatus",
      headerName: "Particulars",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{ cursor: "pointer", paddingLeft: 0 }}
        >
          {params.row?.complaintStatus === "PENDING" && (
            <IconButton
              color="primary"
              onClick={() =>
                navigate("/ServiceRender/attend", {
                  state: { row: params?.row },
                })
              }
            >
              <AddIcon />
            </IconButton>
          )}
          {params.row?.complaintStatus === "UNDERPROCESS" && (
            <IconButton
              color="primary"
              onClick={() =>
                navigate("/ServiceRender/attend", {
                  state: { row: params?.row },
                })
              }
            >
              <EditIcon />
            </IconButton>
          )}
        </Typography>
      ),
    },

    { field: "serviceTicketId", headerName: "Ticket No", flex: 1 },
    { field: "serviceTypeName", headerName: "Service", flex: 1 },

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
    {
      field: "created_username",
      headerName: "Indents By",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={`Mobile: ${params.row.mobile}`} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.created_username.length > 15
              ? `${params.row.created_username}`
              : params.row.created_username}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "designation",
      headerName: "Designation",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={`Mobile: ${params.row.mobile}`} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.created_username.length > 15
              ? `${params.row.created_username}`
              : params.row.created_username}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "job_type",
      headerName: "Job Type",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={`Mobile: ${params.row.mobile}`} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.created_username.length > 15
              ? `${params.row.created_username}`
              : params.row.created_username}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "emp_type",
      headerName: "Emp Type",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={`Mobile: ${params.row.mobile}`} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.created_username.length > 15
              ? `${params.row.created_username}`
              : params.row.created_username}
          </Typography>
        </Tooltip>
      ),
    },
    { field: "dept_name", headerName: "Dept", flex: 1 },
    {
      field: "createdDate",
      headerName: "Indents Date",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.createdDate
            ? convertToDateandTime(params.row.createdDate)
            : "--"}
        </Typography>
      ),
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
      ),
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default AttendServiceRendorIndex;
