import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initValues = {
  schoolId: null,
  blockId: null,
  floorId: null,
  noOfRooms: "",
  remarks: "",
  facilityId: null,
  manualRoomNo: "",
  strength: "",
  area: "",
  description: "",
  showInEvent: false,
};

const requiredFields = [
  "schoolId",
  "blockId",
  "floorId",
  "noOfRooms",
  "remarks",
];
const requiredFields1 = [
  "description",
  "strength",
  "manualRoomNo",
  "area",
  "facilityId",
];

function RoomForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [RoomId, setRoomsId] = useState(null);
  const [schoolShortName, setSchoolName] = useState([]);
  const [facilityName, setFacilityName] = useState([]);
  const [blockName, setBlockName] = useState([]);
  const [floorName, setFloorName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState(null);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    schoolId: [values.schoolId !== ""],
    blockId: [values.blockId !== ""],
    floorId: [values.floorId !== ""],
    noOfRooms: [values.noOfRooms !== "", /^[0-9]*$/.test(values.noOfRooms)],
    remarks: [
      values.remarks !== "",
      values.remarks.trim().split(/ +/).join(" "),
    ],
  };
  const checks1 = {
    facilityId: [values.facilityId !== ""],
    strength: [values.strength !== "", /^[0-9]*$/.test(values.strength)],
    manualRoomNo: [values.manualRoomNo !== ""],
    area: [values.area !== "", /^[0-9,.]*$/.test(values.area)],
    description: [values.description !== ""],
  };

  const errorMessages = {
    schoolId: ["This field required"],
    blockId: ["This field required"],
    floorId: ["This field is required"],
    noOfRooms: ["This field required", "Alow Only Numbers"],
    remarks: ["This field is required"],
  };
  const errorMessages1 = {
    facilityId: ["This field required"],
    strength: ["This field is required", "Allow Only Number"],
    manualRoomNo: ["This field required"],
    area: ["This field is required", "Allow Only Number"],
    description: ["This field required"],
    showInEvent: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/infrastructuremaster/rooms/new") {
      setIsNew(true);
      setCrumbs([
        { name: "InfrastructureMaster", link: "/InfrastructureMaster/Rooms" },
        { name: "Rooms" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getRoomsData();
    }
  }, [pathname]);

  const getRoomsData = async () => {
    await axios
      .get(`/api/rooms/${id}`)
      .then((res) => {
        setValues({
          schoolId: res.data.data.school_id,
          blockId: res.data.data.block_id,
          floorId: res.data.data.floor_id,
          noOfRooms: res.data.data.no_of_rooms,
          remarks: res.data.data.remarks,
          showInEvent: res.data.data.show_in_event
            ? res.data.data.show_in_event
            : false,
          facilityId: res.data.data.facility_type_id,
          strength: res.data.data.strength,
          area: res.data.data.area,
          manualRoomNo: res.data.data.manual_room_no,
          description: res.data.data.description,
        });
        axios
          .get(`/api/getFloors/${res.data.data.block_id}`)
          .then((res) => {
            setFloorName(
              res.data.data.map((object) => ({
                value: object.floor_id,
                label: object.floor_name,
              }))
            );
          })
          .catch((err) => console.error(err));
        setRoomsId(res.data.data.room_id);
        setRoomCode(res.data.data.roomcode);

        setCrumbs([
          { name: "InfrastructureMaster", link: "/InfrastructureMaster/Rooms" },
          { name: "Rooms" },
          { name: "Update" },
          { name: res.data.data.roomcode },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    getSchoolName();
    getBlockName();
    getFacilityName();
    getFloorNames();
  }, [values.blockId]);

  const getFloorNames = async () => {
    await axios
      .get(`/api/getFloors/${values.blockId}`)
      .then((res) => {
        setFloorName(
          res.data.data.map((object) => ({
            value: object.floor_id,
            label: object.floor_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolName = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolName(
          res.data.data.map((object) => ({
            value: object.school_id,
            label: object.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getBlockName = async () => {
    await axios
      .get(`/api/blocks`)
      .then((res) => {
        setBlockName(
          res.data.data.map((object) => ({
            value: object.block_id,
            label: object.block_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getFacilityName = async () => {
    await axios
      .get(`/api/facilityType`)
      .then((res) => {
        setFacilityName(
          res.data.data.map((obj) => ({
            value: obj.facility_type_id,
            label: obj.facility_type_name,
          }))
        );
      })
      .catch((err) => console.error(err));
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
  const requiredFieldsValid1 = () => {
    for (let j = 0; j < requiredFields1.length; j++) {
      const field1 = requiredFields1[j];
      if (Object.keys(checks1).includes(field1)) {
        const ch1 = checks1[field1];
        for (let k = 0; k < ch1.length; k++) if (!ch1[k]) return false;
      } else if (!values[field1]) return false;
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
      temp.block_id = values.blockId;
      temp.school_id = values.schoolId;
      temp.floor_id = values.floorId;
      temp.remarks = values.remarks;
      temp.no_of_rooms = values.noOfRooms;

      await axios
        .post(`/api/rooms`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/InfrastructureMaster/Rooms", { replace: true });
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
          console.error(err);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid1()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.room_id = RoomId;
      temp.no_of_rooms = values.noOfRooms;
      temp.remarks = values.remarks;
      temp.school_id = values.schoolId;
      temp.block_id = values.blockId;
      temp.floor_id = values.floorId;
      temp.facility_type_id = values.facilityId;
      temp.strength = values.strength;
      temp.area = values.area;
      temp.manual_room_no = values.manualRoomNo;
      temp.description = values.description;
      temp.roomcode = roomCode;
      temp.show_in_event = values.showInEvent;

      await axios
        .put(`/api/rooms/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/InfrastructureMaster/Rooms", { replace: true });
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: res.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };
  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="schoolId"
                label="Institute Name"
                handleChangeAdvance={handleChangeAdvance}
                options={schoolShortName}
                value={values.schoolId}
                checks={checks.schoolId}
                errors={errorMessages.schoolId}
                required
                disabled={!isNew}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="blockId"
                label="Block Name"
                options={blockName}
                handleChangeAdvance={handleChangeAdvance}
                value={values.blockId}
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
                options={floorName}
                handleChangeAdvance={handleChangeAdvance}
                value={values.floorId}
                checks={checks.floorId}
                errors={errorMessages.floorId}
                required
                disabled={!isNew}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                name="noOfRooms"
                label="No Of Rooms"
                value={values.noOfRooms}
                handleChange={handleChange}
                checks={checks.noOfRooms}
                errors={errorMessages.noOfRooms}
                required
                disabled={!isNew}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                rows={2}
                multiline
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
                checks={checks.remarks}
                errors={errorMessages.remarks}
                required
                disabled={!isNew}
              />
            </Grid>
          </>

          {!isNew ? (
            <>
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="facilityId"
                  label="Facility Name"
                  options={facilityName}
                  handleChangeAdvance={handleChangeAdvance}
                  value={values.facilityId}
                  checks={checks1.facilityId}
                  errors={errorMessages1.facilityId}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="strength"
                  label="Strength"
                  value={values.strength}
                  handleChange={handleChange}
                  checks={checks1.strength}
                  errors={errorMessages1.strength}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="manualRoomNo"
                  label="Manual Room No"
                  value={values.manualRoomNo}
                  handleChange={handleChange}
                  checks={checks1.manualRoomNo}
                  errors={errorMessages1.manualRoomNo}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="area"
                  label="Area(sq ft)"
                  value={values.area}
                  handleChange={handleChange}
                  checks={checks1.area}
                  errors={errorMessages1.area}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  rows={2}
                  multiline
                  name="description"
                  label="Description"
                  value={values.description}
                  handleChange={handleChange}
                  checks={checks1.description}
                  errors={errorMessages1.description}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid item xs={12} md={4}>
                  <CustomRadioButtons
                    name="showInEvent"
                    label="Show in Event"
                    items={[
                      { value: true, label: "Yes" },
                      { value: false, label: "No" },
                    ]}
                    value={values.showInEvent}
                    handleChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}

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
    </Box>
  );
}

export default RoomForm;
