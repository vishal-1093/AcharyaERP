import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  IconButton,
  Typography,
  Grid,
  List,
  ListItem,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import FloorDetails from "../../../pages/indeces/FloorDetails";

function HostelBlockIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [floorOpen, setFloorOpen] = useState(false);
  const [blockId, setBlockId] = useState();
  const navigate = useNavigate();

  const handleChangeFloor = (params) => {
    setBlockId(params);
    setFloorOpen(true);
  };


  const columns = [
    {
      field: "blockName",
      headerName: "Block",
      flex: 1,
      hideable: false,
    },
    {
      field: "blockShortName",
      headerName: "Block Short",
      flex: 1,
      hideable: false,
    },
    // { field: "wardensId", headerName: "wardensId", flex: 1, hideable: false },
    {
      field: "hostelType",
      headerName: "Type",
      flex: 1,
      hideable: false,
    },
    {
      field: "totalFloors",
      headerName: "Total Floors",
      flex: 1,
      hideable: false,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => handleChangeFloor(params)}
        >
          {params?.row?.totalFloors ?? 0}
        </Typography>
      ),
    },
    
    // { field: "created_username", headerName: "Created By", flex: 1 },
    { field: "address", headerName: "Address", flex: 1, hide: true },
    { field: "doctorsName", headerName: "Doctor", flex: 1 },
    { field: "createdUsername", headerName: "Created By", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (value, row) =>
        row.createdDate
          ? moment(row.createdDate).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "created_by",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/HostelCreationMaster/HostelBlock/${params.row.id}`)
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
        `/api/hostel/fetchAllHostelBlocksDetails?page=${0}&page_size=${1000000}&sort=createdDate`
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
          .delete(`/api/hostel/HostelBlocks/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/hostel/activateHostelBlocks/${id}`)
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
          { name: "No", color: "primary", func: () => { } },
        ],
      })
      : setModalContent({
        title: "Activate",
        message: "Do you want to make it Active?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
        ],
      });
    setModalOpen(true);
  };
  const onClosePopUp = () => {
    setFloorOpen(false);
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
          onClick={() => navigate("/HostelCreationMaster/HostelBlock/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>


      {/* <ModalWrapper
        title="Floor Name"
        maxWidth={400}
        open={floorOpen}
        setOpen={onClosePopUp}
      >
        <List>
          {Object.values(floorDetails)
            .flat()
            .map((floor) => (
              <ListItem
                key={floor.hostel_floor_id}
                sx={{ justifyContent: "center" }}
              >
                <Typography variant="body1">{floor.floor_name}</Typography>
              </ListItem>
            ))}
        </List>
      </ModalWrapper> */}
      {floorOpen && (
        <ModalWrapper
          title="Floor Details"
          maxWidth={1000}
          open={floorOpen}
          setOpen={onClosePopUp}
        >
          <FloorDetails blockId={blockId} />
        </ModalWrapper>
      )}
    </>
  );
}

export default HostelBlockIndex;
