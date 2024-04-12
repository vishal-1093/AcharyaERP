import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Button,
  Checkbox,
  styled,
  tableCellClasses,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormWrapper from "../../../components/FormWrapper";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import SearchIcon from "@mui/icons-material/Search";
import TelegramIcon from "@mui/icons-material/Telegram";
import EmailIcon from "@mui/icons-material/Email";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import moment from "moment";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const initialValues = {
  proctorId: null,
  meetingAgenda: "",
  description: "",
  meetingDate: null,
};

const requiredFields = ["meetingAgenda", "description", "meetingDate"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function ProctorStudentMeeting() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [unAssigned, setUnAssigned] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    meetingAgenda: [values.meetingAgenda !== ""],
    description: [
      values.description !== "",
      /^(.|\n){1,200}$/.test(values.description),
    ],
  };

  const errorMessages = {
    meetingAgenda: ["This field is required"],
    description: ["This field is required", "Enter only 200 characters"],
  };

  useEffect(() => {
    getStudentDetails();
    setCrumbs([
      { name: "Proctor Student Index", link: "/ProctorMaster/Meeting" },
    ]);
  }, []);

  const getStudentDetails = async () => {
    await axios
      .get(
        `/api/proctor/getProctorStatusAssignedStudentDetailsListByUserId/${userId}`
      )
      .then((res) => {
        setStudentDetailsOptions(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeOne = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll" && checked === true) {
      let tempUser = studentDetailsOptions.map((test) => {
        return { ...test, isChecked: checked };
      });
      setStudentDetailsOptions(tempUser);

      setValues({
        ...values,
        studentId: studentDetailsOptions
          .map((obj) => obj.student_id)
          .toString(),
      });
    } else if (name === "selectAll" && checked === false) {
      let tempUser = studentDetailsOptions.map((test) => {
        return { ...test, isChecked: checked };
      });
      setStudentDetailsOptions(tempUser);

      setValues({
        ...values,
        studentId: [],
      });
    } else if (name !== "selectAll" && checked === true) {
      if (!isNew) {
        const uncheckTemp = unAssigned;
        if (
          uncheckTemp.includes(e.target.value) === true &&
          uncheckTemp.indexOf(e.target.value) > -1
        ) {
          uncheckTemp.splice(uncheckTemp.indexOf(e.target.value), 1);
        }

        setUnAssigned(uncheckTemp);
      }

      let temp = studentDetailsOptions.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });
      setStudentDetailsOptions(temp);
      const newTemp = [];
      temp.map((obj) => {
        if (obj.isChecked === true) {
          newTemp.push(obj.student_id);
        }
      });
      setValues({
        ...values,
        studentId: newTemp.toString(),
      });
    } else if (name !== "selectAll" && checked === false) {
      if (!isNew) {
        const uncheckTemp = unAssigned;
        if (uncheckTemp.includes(e.target.value) === false) {
          uncheckTemp.push(e.target.value);
        }

        setUnAssigned(uncheckTemp);
      }

      let temp = studentDetailsOptions.map((obj) => {
        return obj.student_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });

      setStudentDetailsOptions(temp);

      const existData = [];

      values.studentId.split(",").map((obj) => {
        existData.push(obj);
      });

      const index = existData.indexOf(e.target.value);

      if (index > -1) {
        existData.splice(index, 1);
      }

      setValues({
        ...values,
        studentId: existData.toString(),
      });
    }
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

  const handleCreate = async (obj) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);

      await axios
        .post(
          `/api/proctor/sendEmailMessageForMeeting/${
            values.studentId
          }/${userId}/${values.meetingAgenda}/${values.description}/${moment(
            values.meetingDate
          ).format("DD-MM-YYYY")}`
        )
        .then(async (res) => {
          if (res.status === 200 || res.status === 201) {
            const temp = {};
            temp.active = true;
            temp.school_id = 1;
            temp.user_id = userId;
            temp.date_of_meeting = values.meetingDate
              ? values.meetingDate.substr(0, 19) + "Z"
              : "";
            temp.meeting_agenda = values.meetingAgenda;
            temp.student_ids = values.studentId.split(",");
            temp.description = values.description;
            temp.meeting_type = "Proctor To Student";
            temp.mode_of_contact = obj;

            await axios
              .post(`/api/proctor/saveProctorStudentMeeting`, temp)
              .then((res) => {})
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

            setLoading(false);
            navigate("/ProctorStudentMeetingIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Mail sent successfully",
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

  const handleSendTelegram = async () => {
    const temp = {};
    temp.active = true;
    // temp.emp_id = data.emp_id;
    temp.school_id = 1;
    temp.date_of_meeting = values.meetingDate;
    temp.meeting_agenda = values.meetingAgenda;
    // temp.student_ids = studentIds;
    temp.meeting_type = values.description;
    temp.mode_of_contact = "Telegram";

    await axios
      .post(`/api/proctor/saveProctorStudentMeeting`)
      .post((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Meeting Scheduled",
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message,
        });
        setAlertOpen(true);
      });
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12} md={4}>
            <CustomSelect
              multiline
              name="meetingAgenda"
              label="Agenda of meeting"
              value={values.meetingAgenda}
              handleChange={handleChangeOne}
              items={[
                {
                  label: "IA marks review",
                  value: "IA marks review",
                },
                {
                  label: "Attendence review",
                  value: "Attendence review",
                },
                {
                  label: "Discipline matter",
                  value: "Discipline matter",
                },
                {
                  label: "Academic Issues",
                  value: "Academic Issues",
                },
                {
                  label: "Leave Issues",
                  value: "Leave Issues",
                },
                {
                  label: "Fee due",
                  value: "Fee due",
                },
                {
                  label: "Monthly meeting",
                  value: "Monthly meeting",
                },
                {
                  label: "Others",
                  value: "Others",
                },
              ]}
              checks={checks.meetingAgenda}
              errors={errorMessages.meetingAgenda}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={2}
              name="description"
              label="Description"
              value={values.description}
              handleChange={handleChangeOne}
              checks={checks.description}
              errors={errorMessages.description}
              required
            />
          </Grid>
          <Grid item xs={12} md={4} mt={2.4}>
            <CustomDatePicker
              name="meetingDate"
              label="Date of Meeting"
              value={values.meetingDate}
              handleChangeAdvance={handleChangeAdvance}
              disablePast
              required
            />
          </Grid>

          {studentDetailsOptions.length > 0 ? (
            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={() => handleCreate("Mail")}
                sx={{ borderRadius: 2 }}
                disabled={loading}
                endIcon={<EmailIcon />}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  <strong>{"Send"}</strong>
                )}
              </Button>
              {/* <Button
                variant="contained"
                onClick={handleSendTelegram}
                sx={{ borderRadius: 2, marginLeft: 2 }}
                disabled={loading}
                endIcon={<TelegramIcon />}
              >
                Send
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  <strong>{"Send"}</strong>
                )}
              </Button> */}
            </Grid>
          ) : (
            <></>
          )}

          {studentDetailsOptions.length > 0 ? (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              rowSpacing={2}
              columnSpacing={2}
            >
              <Grid item xs={12} md={3}>
                <CustomTextField
                  label="Search"
                  value={search}
                  handleChange={handleSearch}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                  disabled={!isNew}
                />
              </Grid>

              <Grid item xs={10} mt={2}>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          sx={{ color: "white", textAlign: "center" }}
                        >
                          <Checkbox
                            {...label}
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 12 } }}
                            style={{ color: "white" }}
                            name="selectAll"
                            checked={
                              !studentDetailsOptions.some(
                                (user) => user?.isChecked !== true
                              )
                            }
                            onChange={handleChange}
                          />
                          Select All
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ color: "white", textAlign: "center" }}
                        >
                          AUID
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ color: "white", textAlign: "center" }}
                        >
                          Student
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ color: "white", textAlign: "center" }}
                        >
                          Year/Sem
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentDetailsOptions
                        .filter((val) => {
                          if (search === "") {
                            return val;
                          } else if (
                            val.student_name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            val.auid
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return val;
                          }
                        })
                        .map((val, i) => (
                          <TableRow key={i} style={{ height: 10 }}>
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              <Checkbox
                                {...label}
                                sx={{
                                  "& .MuiSvgIcon-root": { fontSize: 12 },
                                }}
                                name={val.student_id}
                                value={val.student_id}
                                onChange={handleChange}
                                checked={val?.isChecked || false}
                              />
                            </StyledTableCell>

                            <StyledTableCell sx={{ textAlign: "center" }}>
                              {val.auid}
                            </StyledTableCell>
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              {val.student_name}
                            </StyledTableCell>
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              {val.current_sem
                                ? val.current_sem
                                : val.current_year}
                            </StyledTableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12} align="center">
              <Typography variant="h6" color="error">
                There are no students under this proctor
              </Typography>
            </Grid>
          )}
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ProctorStudentMeeting;
