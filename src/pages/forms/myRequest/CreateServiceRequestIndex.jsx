import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import Tooltip from "@mui/material/Tooltip";
import { convertToDateandTime } from "../../../utils/Utils";

function ServiceRequestIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    serviceTypeId: "",
    fromDate: "",
    toDate: "",
    title: "",
    status: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Service Request" }, { name: "Index" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/Maintenance/getAllServiceDetailsByUserId/${userId}`)
      .then((res) => {
        const sortedData = res.data.data.sort((a, b) => {
          return new Date(b.createdDate) - new Date(a.createdDate);
        });
        setRows(sortedData);
      })
      .catch((err) => console.error(err));
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
    { field: "dept_name", headerName: "Department", flex: 1 },
    { field: "complaintAttendedByName", headerName: "Rendered By", flex: 1 },

    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "dateOfClosed",
      headerName: "Closed on",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.dateOfClosed
            ? convertToDateandTime(params.row.dateOfClosed)
            : ""}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <Grid container columnSpacing={2} rowSpacing={2} mb={8}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />

        <Button
          onClick={() => navigate("/ServiceRequestDept")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 20, top: 8, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
      </Grid>

      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default ServiceRequestIndex;
