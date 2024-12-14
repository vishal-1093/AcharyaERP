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

function ServiceRequestDeptWise() {
  const [rows,setRows] = useState([]);
  const [deptName,setDeptName] = useState("");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getDept(JSON.parse(localStorage.getItem("ticketDeptId"))?.key);
  }, []);

  const getDept = async(deptId)=> {
    try {
      if(deptId){
        const res = await axios.get(`/api/getActiveDepartmentAssignmentBasedOnTag`);
        const list = res.data.data.length > 0 && res.data.data.find(ele=>ele.id == deptId);
        setDeptName(list?.dept_name);
        setCrumbs([{ name: "Service Request", link: "/ServiceRequest" },
          { name: (list?.dept_name)?.toUpperCase() }
          ]);
        getData(deptId);
      }
    } catch (error) {
      console.log(error)  
    }
  };

  const getData = async(deptId)=> {
    try {
        const res = await axios.get(`/api/Maintenance/getAllServiceDetailsByUserIdAndDeptId/${userId}/${deptId}`);
        setRows(res.data.data?.length > 0 && res.data.data)
    } catch (error) {
      console.log(error)  
    }
  };

  const getStatusCellStyle = (status) => {
    let text, color;

    switch (status.toUpperCase()) {
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
    { field: "serviceTicketId", headerName: "Ticket No", flex: 1 },

    {
      field: "createdDate",
      headerName: "Requested Date",
      flex: 1,

      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.createdDate
            ? convertToDateandTime(params.row.createdDate)
            : "--"}
        </Typography>
      ),
    },

    { field: "serviceTypeName", headerName: "Service Type", flex: 1 },
    { field: "date", headerName: "Date", flex: 1,
      hideable: deptName == "Human Resource"? true:false,
      hide: deptName == "Human Resource"? false : true,
     },
    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
      hideable: deptName == "Human Resource"? false:true,
      hide: deptName == "Human Resource"? true : false,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.from_date
            ? moment(params.row.from_date).format("DD-MM-YYYY")
            : moment(params.row.date).format("DD-MM-YYYY")}
        </Typography>
      ),
    },
    {
      field: "to_date",
      headerName: "To Date",
      flex: 1,
      hideable: deptName == "Human Resource"? false:true,
      hide: deptName == "Human Resource"? true : false,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.to_date
            ? moment(params.row.to_date).format("DD-MM-YYYY")
            : moment(params.row.date).format("DD-MM-YYYY")}
        </Typography>
      ),
    },
    {
      field: "complaintDetails",
      headerName: "Details",
      // width: 150,
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
      headerName: "Extension No",
      // width: 150,
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
      field: "complaintStatus",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: "500" }}
          style={getStatusCellStyle(params.row.complaintStatus)}
        >
          {params.row.complaintStatus
            ? getStatusCellStyle(params.row.complaintStatus).text
            : "--"}
        </Typography>
      ),
    },
    { field: "complaintAttendedByName", headerName: "Rendered By", flex: 1 },

    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "dateOfClosed",
      headerName: "Closed on",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.dateOfClosed
            ? moment(params.row.dateOfClosed).format("DD-MM-YYYY hh:mm a")
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
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <HtmlTooltip title="Edit">
          <IconButton
            onClick={() =>
              navigate(`/ServiceRequestForm`, {
                state: params.row,
              })
            }
            disabled={!!params.row.remarks}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </HtmlTooltip>,
      ],
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

  const currentDate = new Date();
  const nextDate = new Date(currentDate.getTime());
  nextDate.setHours(0, 0, 0, 0);

  return (
    <>
      <Box
        sx={{
          width: { md: "20%", lg: "15%", xs: "68%" },
          position: "absolute",
          right: 30,
          marginTop: { xs: -2, md: -5 },
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => navigate("/ServiceRequestForm")}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: { xs: 10, md: 3 } }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default ServiceRequestDeptWise;
