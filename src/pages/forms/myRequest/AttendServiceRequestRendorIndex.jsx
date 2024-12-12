import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/NoteAlt";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { convertToDateandTime } from "../../../utils/Utils";
import moment from "moment";

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
      field: "createdDate",
      headerName: "Indent Date",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={convertToDateandTime(params.row.createdDate)} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params?.row?.createdDate?.length > 15
              ? `${convertToDateandTime(params.row.createdDate)}`
              : convertToDateandTime(params.row.createdDate)}
          </Typography>
        </Tooltip>
      ),
    },
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
      headerName: "Extension",
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
    { field: "date", headerName: "Date", flex: 1, hide: true },
    {
      field: "from_date",
      headerName: "From Date",
      hide: true,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.from_date
            ? moment(params.row.from_date).format("DD-MM-YYYY")
            : ""}
        </Typography>
      ),
    },
    {
      field: "to_date",
      headerName: "To Date",
      hide: true,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.to_date
            ? moment(params.row.to_date).format("DD-MM-YYYY")
            : ""}
        </Typography>
      ),
    },
    {
      field: "created_username",
      headerName: "Indent By",
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
      field: "view",
      headerName: "View",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params.row.attachment_path !== null ? (
          <IconButton onClick={() => handleDownload(params)}>
            <VisibilityIcon fontSize="small" color="primary" />
          </IconButton>
        ) : (
          <></>
        ),
      ],
    },
    {
      field: "empDesignationShortName",
      headerName: "Designation",
      width: 150,
      hide: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            textTransform: "capitalize",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {params?.row?.empDesignationShortName?.length > 15
            ? `${params.row.empDesignationShortName}`
            : params.row.empDesignationShortName}
        </Typography>
      ),
    },
    {
      field: "job_type",
      headerName: "Job Type",
      width: 150,
      hide: true,
      renderCell: (params) => (
        <Tooltip arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params?.row?.job_type}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "empType",
      headerName: "Emp Type",
      width: 150,
      hide: true,
      renderCell: (params) => (
        <Tooltip title={params.row.empType} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.empType}
          </Typography>
        </Tooltip>
      ),
    },
    { field: "empDeptNameShort", headerName: "Dept", flex: 1 },
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

  const handleDownload = async (params) => {
    await axios
      .get(
        `/api/Maintenance/maintenanceFileviews?fileName=${params.row.attachment_path}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default AttendServiceRendorIndex;
