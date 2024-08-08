import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { makeStyles } from "@mui/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

const occupancy = [
  { value: 1, label: "SINGLE OCCUPANCY" },
  { value: 2, label: "DOUBLE OCCUPANCY" },
  { value: 3, label: "TRIPLE OCCUPANCY" },
  { value: 4, label: "QUADRUPLE OCCUPANCY" },
  { value: 6, label: "SIXTAPLE OCCUPANCY" },
  { value: 7, label: "SEVEN OCCUPANCY" },
  { value: 8, label: "EIGHT OCCUPANCY" },
];

const initialValues = {
  feeTemplate: "",
  hostelRoomName: "",
  hostelBedName: "",
};

const requiredFields = ["feeTemplate", "hostelRoomName", "hostelBedName"];

const ChangeBed = ({ rowDetails, getData }) => {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [hostelRooms, setHostelRooms] = useState([]);
  const [hostelBeds, setHostelBeds] = useState([]);
  const [feeTemplate, setFeeTemplate] = useState([]);
  const [unassignedBedDetails, setUnassignedBedDetails] = useState([]);
  const [rows, setRows] = useState([]);
  console.log(hostelBeds, "hostelBeds");
  console.log(values, "values");

  const roleShortName = JSON.parse(
    sessionStorage.getItem("AcharyaErpUser")
  )?.roleShortName;

  const checks = {
    feeTemplate: [values.feeTemplate !== ""],
    hostelRoomName: [values.hostelRoomName !== ""],
    hostelBedName: [values.hostelBedName !== ""],
  };
  const errorMessages = {
    feeTemplate: ["This field is required"],
    hostelRoomName: ["This field is required"],
    hostelBedName: ["This field is required"],
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

  useEffect(() => {
    if (rowDetails?.id) {
      getHostelBedData();
      getFeeTemplate();
      getStudentBedDetails();
    }
  }, []);

  const getFeeTemplate = async () => {
    try {
      const res = await axios.get(`/api/finance/HostelFeeTemplate`);
      let feeTemp;
      if (roleShortName !== "SAA") {
        feeTemp = res.data.data.filter(
          (obj) => obj.total_amount >= rowDetails.totalAmount
        );
      } else {
        feeTemp = res.data.data;
      }

      const feeTemplate = feeTemp.map((obj) => ({
        value: obj.hostel_fee_template_id,
        label:
          obj.template_name +
          " " +
          occupancy.find(
            (occupancy) => occupancy.value === obj.hostel_room_type_id
          )?.label,
        hostel_room_type_id: obj.hostel_room_type_id,
      }));
      setFeeTemplate(feeTemplate);
    } catch (err) {
      console.error(err);
    }
  };

  const getHostelBedData = async () => {
    try {
      const response = await axios.get(
        `/api/hostel/unassignedBedDetailsForBedChange`
      );
      const data = response.data.data;
      setUnassignedBedDetails(data);
      // Extract and transform room data
      const hostelRooms = Object.keys(data).map((roomName) => ({
        value: roomName,
        label: roomName,
      }));
      setHostelRooms(hostelRooms);

      // // Set initial bed data based on the first room (if available)
      // if (hostelRooms.length > 0) {
      //   const firstRoom = hostelRooms[0].value;
      //   setHostelBeds(
      //     data[firstRoom].map((bed) => ({
      //       value: bed.hostelBedId,
      //       label: bed.bedName,
      //     }))
      //   );
      // }
    } catch (err) {
      console.error(err);
    }
  };
  const getStudentBedDetails = async () => {
    await axios
      .get(`/api/hostel/hostelBedAssignment/${rowDetails?.id}`)
      .then((Response) => {
        setRows(Response?.data?.data);
      })
      .catch((err) => console.error(err));
  };
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async () => {
    const hostelBedData = hostelBeds?.find(
      (obj) => obj.hostelBedId === values.hostelBedName
    );
    console.log(hostelBedData, "hostelBedData");

    const temp = {};
    temp.hostelBlockId = hostelBedData?.hostelBlockId;
    temp.hostelFloorId = hostelBedData?.hostelFloorId;
    temp.hostelRoomId = hostelBedData?.hostelRoomId;
    temp.hostelBedId = hostelBedData?.hostelBedId;
    temp.acYearId = rows?.acYear?.ac_year_id;
    temp.hostelFeeTemplateId = values?.feeTemplate;
    temp.studentId = rows?.student?.student_id;
    temp.fromDate = moment(rows?.fromDate).format("YYYY-MM-DD");
    temp.remarks = rows?.remarks;
    temp.active = true;
    temp.bedStatus = "Occupied";

    try {
      const res = await axios.post(`/api/hostel/hostelBedAssignment`, temp);
      if (res.status === 200 || res.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Vacate Status updated",
        });

        // Call the DELETE API
        const deleteResponse = await axios.delete(
          `/api/hostel/deactiveHostelBedAssignment/${rowDetails?.id}`
        );

        if (deleteResponse.status === 200 || deleteResponse.status === 204) {
          console.log("Hostel bed assignment deactivated successfully");
        } else {
          console.log("Error deactivating hostel bed assignment");
        }
      } else {
        setAlertMessage({
          severity: "error",
          message: "Error Occurred",
        });
      }
      setAlertOpen(true);
      getData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // If room name changes, update the bed options accordingly
    if (name === "hostelRoomName") {
      const selectedRoom = newValue;
      if (selectedRoom) {
        const beds = unassignedBedDetails[selectedRoom]?.map((bed) => ({
          value: bed.hostelBedId,
          label: bed.bedName,
          hostelBedId: bed.hostelBedId,
          hostelBlockId: bed.hostelBlockId,
          hostelFloorId: bed.hostelFloorId,
          hostelRoomId: bed.hostelRoomId,
          roomTypeId: bed.roomTypeId,
        }));
        setHostelBeds(beds);
      } else {
        setHostelBeds([]);
      }
    }
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              Student Details
            </Typography>
          </Grid>

          <Grid item xs={12} component={Paper} elevation={3} p={2}>
            <>
              <Grid container rowSpacing={1.5} columnSpacing={2}>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Name</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {rows?.student?.student_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Email</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {rows?.student?.acharya_email}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">AUID</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {rows?.student?.auid}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Mobile</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {rows?.student?.mobile}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Block Name</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {rows?.hostelBlock?.blockName}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Floor Name</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {rows?.hostelFloor?.floorName}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Room Name</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {rows?.hostelRoom?.roomName}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Bed Name</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {rows?.hostelBed?.bedName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Fee Template</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {rows?.hostelFeeTemplate?.template_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Template Amount</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {rows?.hostelFeeTemplate?.total_amount}
                  </Typography>
                </Grid>
              </Grid>
            </>
          </Grid>
        </Grid>
      </Box>
      <Grid container rowSpacing={2} columnSpacing={6} mt={1}>
        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="feeTemplate"
            label="Fee Template"
            value={values.feeTemplate}
            options={feeTemplate}
            handleChangeAdvance={handleChangeAdvance}
            checks={checks.feeTemplate}
            errors={errorMessages.feeTemplate}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="hostelRoomName"
            label="Hostel Room"
            value={values.hostelRoomName}
            options={hostelRooms}
            handleChangeAdvance={handleChangeAdvance}
            checks={checks.hostelRoomName}
            errors={errorMessages.hostelRoomName}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="hostelBedName"
            label="Hostel Bed"
            value={values.hostelBedName}
            options={hostelBeds}
            handleChangeAdvance={handleChangeAdvance}
            checks={checks.hostelBedName}
            errors={errorMessages.hostelBedName}
            required
          />
        </Grid>
        <Grid item xs={12} align="right">
          <Button
            sx={{ borderRadius: 2 }}
            variant="contained"
            onClick={handleCreate}
            disabled={
              !values.feeTemplate ||
              !values.hostelRoomName ||
              !values.hostelBedName
            }
          >
            {isLoading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Change Bed"
            )}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ChangeBed;
