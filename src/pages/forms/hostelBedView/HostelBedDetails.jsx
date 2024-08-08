import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";
import { makeStyles } from "@mui/styles";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { convertToDMY } from "../../../utils/DateTimeUtils";
import useDebounce from "../../../hooks/useDebounce";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import { useParams } from "react-router-dom";

const occupancy = [
  { value: 1, label: "SINGLE OCCUPANCY" },
  { value: 2, label: "DOUBLE OCCUPANCY" },
  { value: 3, label: "TRIPLE OCCUPANCY" },
  { value: 4, label: "QUADRUPLE OCCUPANCY" },
  { value: 6, label: "SIXTAPLE OCCUPANCY" },
  { value: 7, label: "SEVEN OCCUPANCY" },
  { value: 8, label: "EIGHT OCCUPANCY" },
];

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
    textAlign: "center",
  },
  blockContainer: {
    border: "2px solid #ccc",
    borderRadius: 4,
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  blockName: {
    padding: theme.spacing(1),
    borderBottom: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
  },
  roomContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
  roomBox: {
    border: "2px solid #ccc",
    borderRadius: 4,
    padding: theme.spacing(1),
    flex: "1 0 100px",
  },
  bedIcon: {
    fontSize: "1.5rem",
    marginRight: theme.spacing(0.5),
  },
  iconsContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  numbersContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  bedNumber: {
    marginRight: theme.spacing(0.5),
  },
  bedCount: {
    textAlign: "center",
    marginTop: theme.spacing(0.5),
  },
}));
const getStatusColor = (status) => {
  switch (status) {
    case "Vacant":
      return "#32CD32";
    case "Occupied":
      return "#F08080";
    case "Assigned":
      return "#87CEEB";
    case "Blocked":
      return "#FFA07A";
    default:
      return "#32CD32";
  }
};

const initialValues = { auid: "", doj: "", remarks: "" };
const requiredFields = ["auid", "doj"];

const BedDetails = ({ bedDetails, selectedValues, getBedDetials }) => {
  const classes = useStyles();
  const [bedOpen, setBedOpen] = useState(false);
  const [bed, setBedDetail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [studentDetails, setStudentDetails] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id } = useParams();

  const debouncedAuid = useDebounce(values.auid, 500); // Use debounce with a 500ms delay
  const firstRoomKey = Object.keys(bedDetails)[0];
  const blockName = bedDetails[firstRoomKey][0].blockName;

  const checks = {
    // type: [values.type !== ""],
    auid: [values.auid !== ""],
    doj: [values.doj !== ""],
  };
  const getStudentDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/student/studentDetailsByAuid/${debouncedAuid}`
      );
      setStudentDetails(response?.data?.data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedAuid) {
      getStudentDetails();
    }
  }, [debouncedAuid]);

  // useEffect(() => {
  //   getData();
  // }, [id]);

  const onClosePopUp = () => {
    setBedOpen(false);
    setValues(initialValues);
    setStudentDetails([]);
  };

  const onOpenPopUp = (bed) => {
    setBedDetail(bed);
    setBedOpen(true);
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
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
  // const getData = async () => {
  //   await axios
  //     .get(`/api/hostel/hostelBedAssignment/${id}`)
  //     .then((res) => {
  //       // setValues({
  //       //   auid: res.data.data.roomName,
  //       //   remarks: res.data.data.roomTypeId,
  //       //   doj: res.data.data.hostelsBlockId,
  //       // });
  //     })
  //     .catch((error) => console.error(error));
  // };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.hostelBlockId = selectedValues?.blockName;
      temp.hostelFloorId = selectedValues?.hostelFloorName;
      temp.acYearId = selectedValues?.acYearId;
      temp.hostelFeeTemplateId = selectedValues?.feeTemplate;
      temp.hostelRoomId = bed?.hostelRoomId;
      temp.hostelBedId = bed?.hostelBedId;
      temp.studentId = studentDetails?.student_id;
      // temp.fromDate = moment(values?.doj).format("YYYY-MM-DD");
      temp.expectedJoiningDate = moment(values?.doj).format("YYYY-MM-DD");
      temp.remarks = values?.remarks;
      temp.active = true;
      temp.bedStatus = "Occupied";

      await axios
        .post(`/api/hostel/hostelBedAssignment`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Assigned Successfully",
          });
          setAlertOpen(true);
          onClosePopUp();
          getBedDetials();
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
    <>
      <ModalWrapper
        title=""
        maxWidth={1000}
        open={bedOpen}
        setOpen={() => onClosePopUp()}
      >
        <Typography variant="subtitle2" className={classes.bg}>
          BED ASSIGN - {bed?.roomName} -{" "}
          {
            occupancy.find((occupancy) => occupancy.value === bed?.roomTypeId)
              ?.label
          }
        </Typography>
        <Grid container rowSpacing={2} columnSpacing={4} mt={1}>
          {/* <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="type"
              label="Type"
              value={values.type}
              items={[
                { value: "auid", label: "AUID" },
                { value: "Withoutauid", label: "Without AUID" },
                { value: "Guest", label: "Guest" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid> */}
          <Grid item xs={12} md={4} mt={2}>
            <CustomTextField
              name="auid"
              label="AUID"
              value={values.auid}
              handleChange={handleChange}
              helperText=" "
              errors={["This field is required"]}
              checks={[values.auid !== ""]}
              required
            />
          </Grid>
          <Grid item xs={12} md={4} mt={2}>
            <CustomDatePicker
              name="doj"
              label="Expected date of joining"
              value={values.doj}
              minDate={new Date()}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
          {studentDetails && Object.keys(studentDetails)?.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" className={classes.bg}>
                      Student Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} component={Paper} elevation={3} p={2}>
                    <Grid container rowSpacing={1.5} columnSpacing={2}>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Name</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {studentDetails.student_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">AUID</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {studentDetails.auid}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Program</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {studentDetails.program_short_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">
                          Date of Admission
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {studentDetails.date_of_admission}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Gender</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {studentDetails.candidate_sex}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">School</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {studentDetails.school_name_short}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">
                          Admission Category
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {studentDetails.fee_admission_category_type}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">
                          Fee Template
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {studentDetails.fee_template_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
          <Grid item xs={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={() => handleCreate()}
              disabled={!(values.auid && values.doj)}
            >
              {isLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Assign"
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <Grid container direction="column">
        <Grid item className={classes.blockContainer}>
          <Grid item className={classes.blockName}>
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", textAlign: "center" }}
            >
              {blockName}
            </Typography>
          </Grid>
          <Grid item className={classes.roomContainer}>
            {Object.entries(bedDetails).map(([roomName, beds]) => (
              <Box key={roomName} className={classes.roomBox}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  color="black"
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {roomName}
                </Typography>
                <Box className={classes.iconsContainer}>
                  {beds.map((bed, index) => (
                    <Box key={bed.hostelBedId} textAlign="center">
                      <Tooltip title={`Bed ${bed.bedName}`}>
                        <IconButton>
                          <BedIcon
                            className={classes.bedIcon}
                            style={{ color: getStatusColor(bed.bedStatus) }}
                            onClick={() => onOpenPopUp(bed)}
                          />
                        </IconButton>
                      </Tooltip>
                      <Typography variant="body2" className={classes.bedCount}>
                        {index + 1}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default BedDetails;
