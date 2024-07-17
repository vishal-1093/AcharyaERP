import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import { Button, Box, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BedIcon from "@mui/icons-material/Hotel"; 
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import BedDetails from "../../../pages/indeces/BedDetails";
import ModalWrapper from "../../../components/ModalWrapper";

function HostelRoomIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenBed, setModalOpenBed] = useState(false);
  const [hostelRoomId, setHostelRoomId] = useState();

  const navigate = useNavigate();

  const columns = [
    {
      field: "roomName",
      headerName: "Room",
      flex: 1,
      hideable: false,
    },
    // { field: "wardensId", headerName: "wardensId", flex: 1, hideable: false },
    {
      field: "floorName",
      headerName: "Floor",
      flex: 1,
      hideable: false,
    },
    {
      field: "blockName",
      headerName: "Block",
      flex: 1,
      hideable: false,
    },
    { field: "hrstandardAccessories", headerName: "Standard Accessories", flex: 1, hideable: false },
    // { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "BedDetails",
      headerName: "Bed Details",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          color="primary"
          onClick={() => handleChangeBed(params)}
        >
          <BedIcon />
        </IconButton>,
      ],
    },
    {
      field: "created_by",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/HostelCreationMaster/HostelRoom/${params.row.id}`)
          }
          sx={{ padding: 0 }}
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
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "green" }}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "red" }}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
   
  ];

  useEffect(() => {
    getData();
  }, []);



  const getData = async () => {
    await axios
      .get(
       `/api/hostel/fetchAllHostelRoomsDetails?page=${0}&page_size=${10000}&sort=createdDate`
      )
      .then((Response) => {
        setRows(Response?.data?.data?.Paginated_data?.content);
      })
      .catch((err) => console.error(err));
  };

 
  
  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/hostel/HostelRooms/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/hostel/activateHostelRooms/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };
  const onClosePopUp = () => {
    setModalOpenBed(false);
  };
  const handleChangeBed = (params) => {
    setModalOpenBed(true);
    setHostelRoomId(params);
  };
  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/HostelCreationMaster/HostelRoom/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
      {modalOpenBed && (
        <ModalWrapper
          title="Bed Details"
          maxWidth={800}
          open={modalOpenBed}
          setOpen={onClosePopUp}
        >
          <BedDetails hostelRoomId={hostelRoomId} />
        </ModalWrapper>
      )}
    </>
  );
}

export default HostelRoomIndex;
