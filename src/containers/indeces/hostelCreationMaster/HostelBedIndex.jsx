import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import { Button, Box, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import { occupancy } from "../hostelBedViewIndex/ChangeBed";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomModal from "../../../components/CustomModal";

function HostelBedIndex() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const columns = [
    {
      field: "roomName",
      headerName: "Room",
      flex: 1,
      hideable: false,
    },
    // { field: "wardensId", headerName: "wardensId", flex: 1, hideable: false },
    {
      field: "roomTypeId",
      headerName: "Occupancy Type",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {occupancy.find(
              (occupancy) => occupancy.value === params.row?.roomTypeId
            )?.label || ""}
          </>
        );
      },
    },
    {
      field: "floorName",
      headerName: "Floor",
      flex: 1,
      hideable: false,
    },
    {
      field: "bedName",
      headerName: "Bed",
      flex: 1,
      hideable: false,
    },
    // {
    //   field: "blockName",
    //   headerName: "Block Name",
    //   flex: 1,
    //   hideable: false,
    // },
    // { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.createdDate
          ? moment(params.row.createdDate).format("DD-MM-YYYY")
          : "",
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
    // { field: "createdUsername", headerName: "Created By", flex: 1 },

  ];

  useEffect(() => {
    getData();
  }, []);



  const getData = async () => {
    await axios
      .get(
        `/api/hostel/fetchAllHostelBedsDetails?page=${0}&page_size=${10000}&sort=createdDate`
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
          .delete(`/api/hostel/HostelBeds/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/hostel/activateHostelBeds/${id}`)
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
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default HostelBedIndex;
