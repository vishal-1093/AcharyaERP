import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  styled,
  TableCell,
  tableCellClasses,
} from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import GridIndex from "../../../components/GridIndex";
import CustomModal from "../../../components/CustomModal";
import Collapse from "@mui/material/Collapse";
import axios from "../../../services/Api";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useDownloadExcel } from "react-export-table-to-excel";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function HostelGridIndex() {
  const [rows, setRows] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const [floorDetails, setFloorDetails] = useState([]);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [bedsOpen, setBedsOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const [blockName, setBlockName] = useState("");
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [allDetails, setAllDetails] = useState([]);
  const [roomTypeCount, setRoomTypeCount] = useState([]);

  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    fileName: "Student List",
    sheet: "Student List",
  });

  const columns = [
    { field: "block_name", headerName: "Block Name", flex: 1 },
    { field: "countOfFloors", headerName: "Total Floors", flex: 1 },
    {
      field: "countOfRooms",
      headerName: "Total Rooms",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => handleRooms(params)}
            >
              {params.row.countOfRooms}
            </Typography>
          </>
        );
      },
    },
    {
      field: "countOfBeds",
      headerName: "Total Beds",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => handleBeds(params)}
            >
              {params.row.countOfBeds}
            </Typography>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    getData();
  }, []);

  const handleRooms = async (params) => {
    setRowData(params.row);
    setRoomsOpen(true);
    await axios
      .get(`/api/hostel/getDetailsOfFloorsAndRoomsForGridView/${params.row.id}`)
      .then((res) => {
        setRoomDetails(res.data.data);
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/hostel/fetchFloorDetailsByBlockid/${params.row.id}`)
      .then((res) => {
        const temp = {};
        res.data.data.forEach((obj) => {
          temp[obj.hostelFloorId] = false;
        });
        setRoomsOpen(temp);
        setFloorDetails(res.data.data);
      })
      .catch((err) => console.error(err));

    const hostelFloorTemp = [];
    const hostelTemp1 = [];

    const hostelFloors = await axios
      .get(`/api/hostel/fetchFloorDetailsByBlockid/1`)
      .then((res) => res.data.data)
      .catch((err) => console.err(err));

    const hostelData = await axios
      .get(`/api/hostel/getDetailsOfFloorsAndRoomsForGridView/1`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    hostelFloors.forEach((obj) => {
      hostelFloorTemp.push({
        hostelsFloorId: obj.hostelFloorId,
        floorName: obj.floorName,
      });
    });

    hostelFloorTemp.map((obj2) => {
      hostelData[obj2.hostelsFloorId].map((obj3) => {
        hostelTemp1.push({
          hostelFloorId: obj2.hostelsFloorId,
          floorName: obj2.floorName,
          roomtype: obj3.room_type,
        });
      });
    });
    const counter = [];

    hostelTemp1.forEach(function (obj) {
      var key = JSON.stringify(obj);
      counter[key] = (counter[key] || 0) + 1;
    });

    setRoomTypeCount(counter);
  };

  const handleBeds = async (params) => {
    setRowData(params.row);
    setBlockName(params.row.block_name);
    setBedsOpen(true);
    const temp = [];
    const floorsTemp = [];
    const temp1 = [];

    const floors = await axios
      .get(`/api/hostel/fetchFloorDetailsByBlockid/${params.row.id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const rooms = await axios
      .get(`/api/hostel/HostelRooms`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const data = await axios
      .get(`/api/hostel/getAllBedsDetails/${params.row.id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    floors.forEach((obj) => {
      floorsTemp.push({
        floorId: obj.hostelFloorId,
        floorName: obj.floorName,
      });
    });

    floorsTemp.map((obj) => {
      const roomByFloor = rooms.filter(
        (obj1) => obj1.hostelsFloorId === obj.floorId
      );

      roomByFloor.map((obj2) => {
        data[obj.floorId][obj2.hostelRoomId].map((obj3) => {
          temp1.push({
            floorName: obj.floorName,
            roomName: obj2.roomName,
            beds: obj3.bedName,
          });
        });
      });
    });
    setAllDetails(temp1);
  };
  const handleRoomDetails = (id) => {
    setRoomsOpen((prev) => ({
      ...prev,
      [id]: roomsOpen[id] === true ? false : true,
    }));
  };

  const getData = async () => {
    await axios
      .get(`/api/hostel/getCountOfFloorsRoomsBedsForGridView`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />

        <GridIndex rows={rows} columns={columns} />
        <ModalWrapper maxWidth={600} open={roomsOpen} setOpen={setRoomsOpen}>
          <Grid item xs={12} md={8} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      FLOORWISE ROOM DETAILS
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {floorDetails.map((obj) => {
                    return (
                      <>
                        <TableRow>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                              onClick={() =>
                                handleRoomDetails(obj.hostelFloorId)
                              }
                            >
                              {roomsOpen[obj.hostelFloorId] ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </IconButton>
                            {obj.floorName}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Collapse
                              in={roomsOpen[obj.hostelFloorId]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box sx={{ margin: 1 }}>
                                <TableContainer component={Paper}>
                                  <Table size="small">
                                    {roomDetails[obj.hostelFloorId] ? (
                                      <>
                                        <TableHead>
                                          <TableRow>
                                            <StyledTableCell>
                                              Room Name
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              Room Type
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              No Of Beds
                                            </StyledTableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {roomDetails[obj.hostelFloorId].map(
                                            (obj1) => {
                                              return (
                                                <TableRow>
                                                  <TableCell>
                                                    {obj1.room_name}
                                                  </TableCell>
                                                  <TableCell>
                                                    {obj1.room_type}
                                                  </TableCell>
                                                  <TableCell>
                                                    {obj1.number_of_beds}
                                                  </TableCell>
                                                </TableRow>
                                              );
                                            }
                                          )}
                                        </TableBody>
                                      </>
                                    ) : (
                                      <>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell
                                              sx={{
                                                color: "red",
                                                textAlign: "center",
                                              }}
                                            >
                                              There are no Rooms under this
                                              Floor
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                      </>
                                    )}
                                  </Table>
                                </TableContainer>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </ModalWrapper>

        <ModalWrapper maxWidth={600} open={bedsOpen} setOpen={setBedsOpen}>
          <Grid item xs={12} md={2} mt={2} sx={{ textAlign: "right" }}>
            <Button onClick={onDownload}>
              <SaveAltIcon /> Export
            </Button>
          </Grid>
          <Grid item xs={12} md={8} mt={1}>
            <TableContainer component={Paper}>
              <Table size="small" ref={tableRef}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      sx={{ textAlign: "center", fontSize: "18px" }}
                    >
                      {blockName}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Bed</TableCell>
                        <TableCell>Room</TableCell>
                        <TableCell>Floor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allDetails.map((obj, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>
                              {obj.beds.split(",").length > 0
                                ? obj.beds.split(",").map((obj1) => {
                                    return <Typography>{obj1}</Typography>;
                                  })
                                : obj.beds}
                            </TableCell>
                            <TableCell>{obj.roomName}</TableCell>
                            <TableCell>{obj.floorName}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Table>
            </TableContainer>
          </Grid>
        </ModalWrapper>
      </Box>
    </>
  );
}
export default HostelGridIndex;
