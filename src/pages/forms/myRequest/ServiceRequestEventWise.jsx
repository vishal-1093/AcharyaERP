import { useState, useEffect, lazy } from "react";
import {
  Box, Grid, Button, Typography, IconButton, Tooltip,
  styled,
  tooltipClasses,
} from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { convertToDateandTime } from "../../../utils/Utils";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
const GridIndex = lazy(() => import("../../../components/GridIndex"));
const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

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

function ServiceRequestEventWise() {
  const [rows, setRows] = useState([]);
  const [deptName, setDeptName] = useState("");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    setCrumbs([
      { name: "EventMaster", link: "/EventMaster" },
    ]);
    getData()
  }, []);


  const getData = async () => {
    try {
      const res = await axios.get(`/api/Maintenance/fetchServiceThroughEventCreation?page=0&page_size=10000&sort=created_date&userId=${userId}`);
      console.log(res.data.data.content,"llll");
      
      setRows(res.data.data.content)
    } catch (error) {
      console.log(error)
    }
  };

  const getStatusCellStyle = (status) => {
    let text, color;

    switch (status?.toUpperCase()) {
      case "PENDING":
        text = "Pending";
        color = "red";
        break;
      case "UNDERPROCESS":
        text = "Under Process";
        color = "red";
        break;
      case "COMPLETED":
        text = "Completed";
        color = "green";
        break;
      default:
        text = status;
        color = "black"; // Default color
        break;
    }

    return { color, text };
  };


  const columns = [
    { field: "id", headerName: "Ticket No", flex: 1 },

    {
      field: "created_date",
      headerName: "Requested Date",
      flex: 1,

      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.created_date
            ? convertToDateandTime(params.row.created_date)
            : "--"}
        </Typography>
      ),
    },

    { field: "concateName", headerName: "Service Type", flex: 1 },
    // {
    //   field: "date", headerName: "Date", flex: 1,
    //   hideable: deptName == "Human Resource" ? true : false,
    //   hide: deptName == "Human Resource" ? false : true,
    // },
    // {
    //   field: "from_date",
    //   headerName: "From Date",
    //   flex: 1,
    //   hideable: deptName == "Human Resource" ? false : true,
    //   hide: deptName == "Human Resource" ? true : false,
    //   renderCell: (params) => (
    //     <Typography variant="body2">
    //       {params.row.from_date
    //         ? moment(params.row.from_date).format("DD-MM-YYYY")
    //         : params.row.date ? moment(params.row.date).format("DD-MM-YYYY") : ""}
    //     </Typography>
    //   ),
    // },
    // {
    //   field: "to_date",
    //   headerName: "To Date",
    //   flex: 1,
    //   hideable: deptName == "Human Resource" ? false : true,
    //   hide: deptName == "Human Resource" ? true : false,
    //   renderCell: (params) => (
    //     <Typography variant="body2">
    //       {params.row.to_date
    //         ? moment(params.row.to_date).format("DD-MM-YYYY")
    //         : params.row.date ? moment(params.row.date).format("DD-MM-YYYY") : ""}
    //     </Typography>
    //   ),
    // },
    {
      field: "complaint_details",
      headerName: "Details",
      // width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row.complaint_details} arrow>
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
            {params.row.complaint_details?.length > 15
              ? `${params.row.complaint_details.slice(0, 18)}...`
              : params.row.complaint_details}
          </Typography>
        </Tooltip>
      ),
    },
    // {
    //   field: "block_name",
    //   headerName: "Block Name",
    //   hide: true,
    //   hideable: deptName?.toLowerCase().includes("system department") || deptName?.toLowerCase().includes("house keeping") ? true : false,
    //   renderCell: (params) => (
    //     <Tooltip title={params.row.block_name} arrow>
    //       <Typography
    //         variant="body2"
    //         sx={{
    //           textTransform: "capitalize",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //           whiteSpace: "nowrap",
    //           maxWidth: 150,
    //         }}
    //       >
    //         {params.row.block_name
    //           ? params.row.block_name
    //           : "N/A"}
    //       </Typography>
    //     </Tooltip>
    //   ),
    // },
    {
      field: "floor_and_extension",
      headerName: "Extension No",
      // width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row.floor_and_extension} arrow>
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
            {params.row.floor_and_extension?.length > 15
              ? `${params.row.floor_and_extension.slice(0, 18)}...`
              : params.row.floor_and_extension}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "complaint_status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: "500" }}
          style={getStatusCellStyle(params?.row?.complaint_status)}
        >
          {params.row.complaint_status
            ? getStatusCellStyle(params?.row?.complaint_status).text
            : "--"}
        </Typography>
      ),
    },
    { field: "complaintAttendedByName", headerName: "Rendered By", flex: 1 },

    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "date_of_closed",
      headerName: "Closed on",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.date_of_closed
            ? moment(params.row.date_of_closed).format("DD-MM-YYYY hh:mm a")
            : ""}
        </Typography>
      ),
    },
    {
      field: "view",
      headerName: "View",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params.row.attachment_path ? (
          <IconButton onClick={() => handleDownload(params)}>
            <VisibilityIcon fontSize="small" color="primary" />
          </IconButton>
        ) : (
          <></>
        ),
      ],
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   type: "actions",
    //   flex: 1,
    //   getActions: (params) => [
    //     <HtmlTooltip title="Edit">
    //       <IconButton
    //         onClick={() =>
    //           navigate(`/ServiceRequestForm`, {
    //             state: params.row,
    //           })
    //         }
    //         disabled={!!params.row.remarks}
    //       >
    //         <EditIcon fontSize="small" />
    //       </IconButton>
    //     </HtmlTooltip>,
    //   ],
    // },
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

  const currentDate = new Date();
  const nextDate = new Date(currentDate.getTime());
  nextDate.setHours(0, 0, 0, 0);

  return (
    <>
      <Box sx={{ marginTop: { xs: 10, md: 3 } }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default ServiceRequestEventWise;
