import React, { lazy, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Button,
  CircularProgress,
  Paper,
  Card,
  CardHeader,
  CardContent,
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
const StudentDetails = lazy(() => import("../../../components/StudentDetails"));

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
    // border: "3px solid #ccc",
    // borderRadius: 5,
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  blockName: {
    // padding: theme.spacing(1),
    // borderBottom: "1px solid #ccc",
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
  floorBox: {
    border: "2px solid #ccc",
    borderRadius: 3,
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
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

const AllBedDetails = ({ bedDetails, selectedValues, getBedDetials }) => {
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
  // const blockName = bedDetails[firstRoomKey][0].blockName;
  // console.log(blockName, "blockName", bedDetails);

  const checks = {
    // type: [values.type !== ""],
    auid: [values.auid !== ""],
    doj: [values.doj !== ""],
  };
  const getStudentDetails = async () => {
    try {
      setLoading(true);
      const containsAlphabetic = /[a-zA-Z]/.test(debouncedAuid);
      const baseUrl = "/api/student/getStudentDetailsBasedOnAuidAndStrudentId";
      const url = `${baseUrl}?${
        containsAlphabetic ? "auid" : "student_id"
      }=${debouncedAuid}`;
      const response = await axios.get(url);
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
    if (bed?.bedStatus === null || bed?.bedStatus === "") {
      setBedDetail(bed);
      setBedOpen(true);
    } else {
      setAlertMessage({
        severity: "error",
        message: "Bed Occupied",
      });
      setAlertOpen(true);
    }
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
      temp.hostelFloorId = bed?.hostelFloorId;
      temp.acYearId = selectedValues?.acYearId;
      temp.hostelFeeTemplateId = selectedValues?.feeTemplate;
      temp.hostelRoomId = bed?.hostelRoomId;
      temp.hostelBedId = bed?.hostelBedId;
      temp.studentId = studentDetails?.id;
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
  const renderDetailRow = (label, value) => {
    return (
      <>
        <Grid item xs={12} md={1.5}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4.5}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
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
        </Grid>
        {/* <StudentDetails id={values?.auid} /> */}
        {studentDetails && Object.keys(studentDetails)?.length > 0 && (
          <Grid container>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title="Student Details"
                  titleTypographyProps={{
                    variant: "subtitle2",
                  }}
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    textAlign: "center",
                    padding: 1,
                  }}
                />
                <CardContent>
                  <Grid container columnSpacing={2} rowSpacing={1}>
                    {renderDetailRow("AUID", studentDetails.auid)}
                    {renderDetailRow(
                      "Student Name",
                      studentDetails.student_name
                    )}
                    {renderDetailRow("USN", studentDetails.usn ?? "-")}
                    {renderDetailRow(
                      "DOA",
                      moment(studentDetails.date_of_admission).format(
                        "DD-MM-YYYY"
                      )
                    )}
                    {renderDetailRow(
                      "School",
                      studentDetails.school_name_short
                    )}
                    {renderDetailRow(
                      "Program",
                      `${studentDetails.program_short_name} - ${studentDetails.program_specialization_short_name}`
                    )}
                    {renderDetailRow(
                      "Academic Batch",
                      studentDetails.academic_batch
                    )}
                    {renderDetailRow(
                      "Current Year/Sem",
                      `${studentDetails.current_year}/${studentDetails.current_sem}`
                    )}
                    {renderDetailRow(
                      "Fee Template",
                      studentDetails.fee_template_name
                    )}
                    {renderDetailRow(
                      "Admission Category",
                      `${studentDetails.fee_admission_category_short_name} - ${studentDetails.fee_admission_sub_category_short_name}`
                    )}
                    {renderDetailRow(
                      "Acharya Email",
                      studentDetails.acharya_email
                    )}
                    {renderDetailRow("Mobile No.", studentDetails.mobile)}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} align="right" mt={2}>
          <Button
            sx={{ borderRadius: 2 }}
            variant="contained"
            onClick={() => handleCreate()}
            disabled={
              !(
                values.auid &&
                values.doj &&
                studentDetails &&
                Object.keys(studentDetails)?.length > 0
              )
            }
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
      </ModalWrapper>

      <Grid container direction="column">
        <Grid item className={classes.blockContainer}>
          {(() => {
            // Sort the floors by name in ascending order
            const sortedFloors = Object.entries(bedDetails).sort(
              ([aFloorName], [bFloorName]) =>
                aFloorName.localeCompare(bFloorName)
            );

            // Move the last floor to the first position
            const lastFloor = sortedFloors.pop(); // Remove the last floor
            if (lastFloor) {
              sortedFloors.unshift(lastFloor); // Insert the last floor at the start
            }

            return sortedFloors.map(([floorName, rooms]) => (
              <Box key={floorName} className={classes.floorBox}>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {floorName}
                </Typography>

                {/* Iterate over each room within the floor */}
                <Grid container>
                  {Object.entries(rooms)
                    .sort(([aRoomName], [bRoomName]) =>
                      aRoomName.localeCompare(bRoomName)
                    ) // Sort rooms by name in ascending order
                    .map(([roomName, beds]) => (
                      <Grid item key={roomName} style={{ margin: "5px" }}>
                        <Card
                          className={classes.roomCard}
                          style={{
                            width: 80,
                            height: !selectedValues?.occupancyType
                              ? 110
                              : selectedValues?.occupancyType <= 2
                              ? 80
                              : selectedValues?.occupancyType <= 4
                              ? 90
                              : 110,
                            padding: 3,
                            textAlign: "center",
                            transition: "transform 0.3s ease-in-out",
                            borderRadius: 5,
                            border: "2px solid #ccc",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            color="black"
                            style={{ fontWeight: "bold", fontSize: 12 }}
                          >
                            {roomName}
                          </Typography>
                          <Grid container justifyContent="center">
                            {beds
                              .sort((a, b) =>
                                a.bedName.localeCompare(b.bedName)
                              ) // Sort beds by name in ascending order
                              .slice(0, 6) // Limit to 6 beds
                              .map((bed) => (
                                <Grid item key={bed.hostelBedId}>
                                  <Box textAlign="center">
                                    <Tooltip title={`${bed.bedName}`}>
                                      <IconButton size="small">
                                        <BedIcon
                                          style={{
                                            color: getStatusColor(
                                              bed.bedStatus
                                            ),
                                            fontSize: 16,
                                          }}
                                          onClick={() => onOpenPopUp(bed)}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Grid>
                              ))}
                          </Grid>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            ));
          })()}
        </Grid>
      </Grid>
    </>
  );
};

export default AllBedDetails;
