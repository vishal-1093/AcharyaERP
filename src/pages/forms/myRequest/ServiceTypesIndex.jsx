import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";

function ServiceTypeIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/ServiceType?page=${0}&page_size=${10000}&sort=created_date`)
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/ServiceType/${id}?active=false`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          });
      } else {
        await axios.delete(`/api/ServiceType/${id}?active=true`).then((res) => {
          if (res.status === 200) {
            getData();
            setModalOpen(false);
          }
        });
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        });
  };
  const columns = [
    { field: "serviceTypeName", headerName: "Service Type", flex: 1 },
    { field: "serviceTypeShortName", headerName: "Short Name", flex: 1 },
    {
      field: "showInEvent",
      headerName: "Show in event",
      valueGetter: (value, row) => (row?.showInEvent ? "Yes" : "No"),
    },
    {
      field: "hostelStatus",
      headerName: "Hostel Status",
      valueGetter: (value, row) => (row?.hostelStatus ? "Yes" : "No"),
    },
    {
      field: "is_attachment",
      headerName: "Is Attachment",
      valueGetter: (value, row) => (row?.is_attachment ? "Yes" : "No"),
    },
    { field: "createdUsername", headerName: "Created By", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,

      valueGetter: (value, row) =>
        moment(row?.createdDate).format("DD-MM-YYYY"),
    },
    {
      field: "assign",
      type: "actions",
      headerName: "Assign Department",
      width: 150,
      renderCell: (params) =>
        params.row?.dept_name ? (
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{ paddingLeft: 0, cursor: "pointer", textAlign: "center" }}
            onClick={() =>
              navigate(`/ServiceMaster/ServiceAssignment/New`, {
                state: { row: params.row },
              })
            }
          >
            {params.row?.dept_name.trim()}
          </Typography>
        ) : (
          <IconButton
            onClick={() =>
              navigate(`/ServiceMaster/ServiceAssignment/New`, {
                state: { row: params.row },
              })
            }
          >
            <AddIcon />
          </IconButton>
        ),
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/ServiceMaster/ServiceTypes/Update/${params.row.id}`)
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Button
        onClick={() => navigate("/ServiceMaster/ServiceTypes/new")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default ServiceTypeIndex;
