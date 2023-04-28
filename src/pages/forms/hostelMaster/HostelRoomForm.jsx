import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  roomTypeId: null,
  blockId: "",
  accessoriesId: null,
  floorId: "",
  room: "",
  newRoomType: "",
};

const requiredFields = [
  "roomTypeId",
  "blockId",
  "accessoriesId",
  "floorId",
  "room",
];

function HostelRoomForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [HostelRoomId, setHostelRoomId] = useState(null);
  const [roomsType, setRoomType] = useState([]);
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [hostelFloors, setHostelFloors] = useState([]);
  const [getaccessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    roomTypeId: [values.roomTypeId !== null],
    blockId: [values.blockId !== null],
    accessoriesId: [values.accessoriesId !== null],
    floorId: [values.floorId !== null],
    room: [values.room !== "", /^[0-9]*$/.test(values.room)],
  };

  const errorMessages = {
    roomTypeId: ["This field required"],
    blockId: ["This field is required"],
    accessoriesId: ["This field is required"],
    floorId: ["This field is required"],
    room: ["This field required", "Allow only Number"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/hostelmaster/hostelrooms/new") {
      setIsNew(true);
      setCrumbs([
        { name: "HostelMaster", link: "/HostelMaster/HostelRooms" },
        { name: "Room" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getFloorByBlockId();
      getData();
    }
  }, [pathname]);

  const getData = async () => {
    await axios
      .get(`/api/hostel/HostelRooms/${id}`)
      .then((res) => {
        setValues({
          room: res.data.data.roomName,
          roomTypeId: res.data.data.roomTypeId,
          blockId: res.data.data.hostelsBlockId,
          accessoriesId: res.data.data.standardAccessoriesId,
          floorId: res.data.data.hostelsFloorId,
        });
        axios
          .get(
            `/api/hostel/fetchFloorDetailsByBlockid/${res.data.data.hostelsBlockId}`
          )
          .then((res) => {
            setHostelFloors(
              res.data.data.map((object) => ({
                value: object.hostelFloorId,
                label: object.floorName,
              }))
            );
          })
          .catch((err) => console.error(err));
        setHostelRoomId(res.data.data.hostelRoomId);
        setCrumbs([
          { name: "HostelMaster", link: "/HostelMaster/HostelRooms" },
          { name: "Room" },
          { name: "Update" },
          { name: res.data.data.roomName },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const getFloorByBlockId = async () => {
    await axios
      .get(`/api/hostel/fetchFloorDetailsByBlockid/${values.blockId}`)
      .then((res) => {
        setHostelFloors(
          res.data.data.map((object) => ({
            value: object.hostelFloorId,
            label: object.floorName,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.room_creation_number = values.room;
      temp.roomTypeId = values.roomTypeId;
      temp.hostelsBlockId = values.blockId;
      temp.hostelsFloorId = values.floorId;
      temp.standardAccessoriesId = values.accessoriesId;

      await axios
        .post(`/api/hostel/HostelRooms`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HostelMaster/HostelRooms", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };
  useEffect(() => {
    getRoomType();
    getHostelBlocks();
    getStandardAccessories();
    getFloorDetailsByBlockId();
  }, [values.blockId, values.floorId, values.newRoomType]);
  const getStandardAccessories = async () => {
    await axios
      .get(`/api/hostel/StdHostelStandardAccessories`)
      .then((res) => {
        setAccessories(
          res.data.data.map((object) => ({
            value: object.standardAccessoriesId,
            label: object.standardAccessories,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getRoomType = async () => {
    await axios
      .get(`/api/hostel/HostelRoomType`)
      .then((res) => {
        setRoomType(
          res.data.data.map((object) => ({
            value: object.roomTypeId,
            label: object.roomType,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getHostelBlocks = async () => {
    await axios
      .get(`/api/hostel/HostelBlocks`)
      .then((res) => {
        setHostelBlocks(
          res.data.data.map((object) => ({
            value: object.hostelBlockId,
            label: object.blockName,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getFloorDetailsByBlockId = async () => {
    if (values.blockId) {
      await axios
        .get(`/api/hostel/fetchFloorDetailsByBlockid/${values.blockId}`)
        .then((res) => {
          setHostelFloors(
            res.data.data.map((object) => ({
              value: object.hostelFloorId,
              label: object.floorName,
            }))
          );
        })
        .catch((err) => console.error(err));
      await axios
        .get(
          `/api/hostel/allHOstelsRoomsONBlockAndFloor/${values.blockId}/${values.floorId}`
        )
        .then((res) => {
          setTableData(res.data.data);
        })

        .catch((err) => console.error(err));
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "roomTypeId") {
      const a = newValue;
      await axios
        .get(`/api/hostel/HostelRoomType`)
        .then((res) => {
          res.data.data.map((obj) => {
            if (obj.roomTypeId === a) {
              values.newRoomType = obj.roomType;
            }
          });
        })
        .catch((err) => console.error(err));
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleUpdate = async () => {
    if (requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.hostelRoomId = HostelRoomId;
      temp.roomName = values.room;
      temp.roomTypeId = values.roomTypeId;
      temp.hostelsBlockId = values.blockId;
      temp.hostelsFloorId = values.floorId;
      temp.standardAccessoriesId = values.accessoriesId;

      await axios
        .put(`/api/hostel/HostelRooms/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HostelMaster/HostelRooms", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="roomTypeId"
                label="Room Type"
                value={values.roomTypeId}
                options={roomsType}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.roomTypeId}
                errors={errorMessages.roomTypeId}
                required
                disabled={!isNew}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="blockId"
                label="Block Name"
                value={values.blockId}
                options={hostelBlocks}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.blockId}
                errors={errorMessages.blockId}
                required
                disabled={!isNew}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="floorId"
                label="Floor Name"
                value={values.floorId}
                options={hostelFloors}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.floorId}
                errors={errorMessages.floorId}
                required
                disabled={!isNew}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="accessoriesId"
                label="Standard Accessories"
                options={getaccessories}
                value={values.accessoriesId}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.accessoriesId}
                errors={errorMessages.accessoriesId}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                name="room"
                label="Total No Of Rooms"
                value={values.room}
                handleChange={handleChange}
                checks={checks.room}
                errors={errorMessages.room}
                required
                disabled={!isNew}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
              >
                <Grid item xs={4} md={2}>
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={isNew ? handleCreate : handleUpdate}
                  >
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      <strong>{isNew ? "Create" : "Update"}</strong>
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FormWrapper>
        <TableContainer sx={{ border: 1, borderColor: "lightgray" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room Name</TableCell>
                <TableCell>Room Type</TableCell>
                <TableCell>Floor Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                .filter((val) => val.roomType === values.newRoomType)
                .map((val, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{val.roomName}</TableCell>
                      <TableCell>{val.roomType}</TableCell>
                      <TableCell>{val.floorName}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default HostelRoomForm;
