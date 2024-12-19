import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import HistoryIcon from "@mui/icons-material/History";
import { Button, Box, IconButton, Grid, Typography } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import StudentHistory from "../../../pages/forms/mentorMaster/StudentHistory";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CallIcon from '@mui/icons-material/Call';
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment/moment";

const initialValues = {
  proctorId: null,
  meetingAgenda: "",
  description: "",
  meetingDate: null,
};

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function StudentProctorIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [proctorIds, setProctorIds] = useState([]);
  const [proctorData, setProctorData] = useState([]);
  const [proctId, setProctId] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [proctorOptions, setProctorOptions] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState([]);
  const [modalTelegramOpen, setModalTelegramOpen] = useState(false);
  const [studentIds, setStudentIds] = useState([]);
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
    getProctorDetails();
  }, []);

  const checks = {
    meetingAgenda: [values.meetingAgenda !== ""],
    description: [values.description !== ""],
  };

  const errorMessages = {
    meetingAgenda: ["This field is required"],
    description: ["This field is required"],
  };

  const getData = async () => {
    await axios
      .get(
        `/api/proctor/getProctorStatusAssignedStudentDetailsListByUserId/${userId}`
      )
      .then((res) => {
        const rowId = res.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setRows(rowId);
      })
      .catch((err) => console.error(err));
  };

  const getProctorDetails = async () => {
    await axios
      .get(`/api/employee/GetEmployeeNames`)
      .then((res) => {
        setProctorOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.employee_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    proctorData.map((val) => {
      proctId.push({
        proctor_assign_id: val.id,
        emp_id: newValue,
        school_id: val.school_id,
        student_id: val.student_id,
        active: true,
        proctor_status: 1,
      });
    });
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAssign = async () => {
    const temp = [];
    proctorData.map((obj) => {
      temp.push({
        proctor_assign_id: obj.id,
        proctor_status: obj.proctor_status,
        active: true,
        from_date: obj.from_date,
        to_date: obj.to_date,
        school_id: obj.school_id,
        student_id: obj.student_id,
        student_name: obj.student_name,
        emp_id: obj.emp_id,
      });
    });

    await axios
      .post(`/api/proctor/ProctorHeadHistory`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          axios
            .put(`/api/proctor/ProctorStudentAssignment/${proctorIds}`, proctId)
            .then((res) => {
              setReassignOpen(false);
              getData();
              // window.location.reload();
              setAlertMessage({
                severity: "success",
                message: "Students Assigned",
              });
              setAlertOpen(true);
            })
            .catch((err) => {
              setReassignOpen(false);
              setAlertMessage({ severity: "error", message: "Error" });
              console.error(err);
            });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({ severity: "error", message: "Error" });
        console.error(err);
      });
    setAlertOpen(true);
  };

  const handleHistory = async (params) => {
    setHistoryOpen(true);
    await axios
      .get(`/api/proctor/getAllStudentDetailsList/${params.row.emp_id}`)
      .then((res) => {
        setStudentDetails(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleTelegram = (params) => {
    setConfirmModal(true);

    const handleToggle = async () => {
      await axios
        .post(
          `/api/feedback/sendingSmsWithTelegramVerificationLink?application_no_npf=${params.row.application_no_npf}`
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Telegram Verification Sent To Student",
            });
          } else {
            setAlertMessage({ severity: "error", message: "Error Occured" });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response.data.message,
          });
          setAlertOpen(true);
        });
    };

    setModalContent({
      title: "Telegram Verification",
      message: "Are you sure you want to send telegram verification?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
  };

  const columns = [
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          onClick={() =>
            navigate(`/student-profile/${params.row.student_id}`, { state: true })
          }
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params.value.toLowerCase()}
        </Typography>
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "created_username", headerName: "Assigned By", flex: 1 },
    {
      field: "created_date",
      headerName: "Assigned Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },

    // {
    //   field: "Profile",
    //   type: "actions",
    //   flex: 1,
    //   headerName: "Profile",
    //   getActions: (params) => [
    //     params.row.proctor_status === 1 &&
    //     params.row.proctor_assign_status === 1 ? (
    //       <IconButton
    //         label="Profile"
    //         onClick={() =>
    //           navigate(`/student-profile/${params.row.student_id}`)
    //         }
    //       >
    //         <AccountBoxIcon />
    //       </IconButton>
    //     ) : (
    //       <IconButton label="Profile">
    //         <AccountBoxIcon />
    //       </IconButton>
    //     ),
    //   ],
    // },
    {
      field: "History",
      type: "actions",
      flex: 1,
      headerName: "History",
      getActions: (params) => [
        <IconButton label="History" onClick={() => handleHistory(params)}>
          <HistoryIcon />
        </IconButton>,
      ],
    },
    {
      field: "IVR",
      type: "actions",
      flex: 1,
      headerName: "IVR",
      getActions: (params) => [
          <IconButton label="IVR Call" onClick={() =>""}>
            <CallIcon />
          </IconButton>
      ],
    },
    {
      field: "WhatsApp",
      type: "actions",
      flex: 1,
      headerName: "WhatsApp",
      getActions: (params) => [
          <IconButton label="WhatsApp" onClick={() => ""}>
            <WhatsAppIcon />
          </IconButton>
      ],
    },
  ];
  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={confirmModal}
          setOpen={setConfirmModal}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />

        <ModalWrapper
          open={reassignOpen}
          setOpen={setReassignOpen}
          maxWidth={700}
          title="Re-Assign Mentor"
        >
          <Grid
            container
            alignItems="left"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="proctorId"
                value={values.proctorId}
                label="Mentor"
                options={proctorOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                onClick={handleAssign}
              >
                Assign
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>

        <ModalWrapper open={historyOpen} setOpen={setHistoryOpen}>
          <StudentHistory studentDetails={studentDetails} />
        </ModalWrapper>

        <ModalWrapper
          title="Telegram"
          maxWidth={800}
          open={modalTelegramOpen}
          setOpen={setModalTelegramOpen}
        >
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={2}
          >
            <Grid item xs={12} md={4}>
              <CustomTextField
                multiline
                name="meetingAgenda"
                label="Agenda of meeting"
                value={values.meetingAgenda}
                handleChange={handleChange}
                checks={checks.meetingAgenda}
                errors={errorMessages.meetingAgenda}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="description"
                label="Description"
                value={values.description}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4} mt={2}>
              <CustomDatePicker
                name="meetingDate"
                label="Date of Meeting"
                value={values.meetingDate}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} align="right">
              {/* <Button
                variant="contained"
                onClick={handleSendTelegram}
                sx={{ borderRadius: 2 }}
                startIcon={<TelegramIcon />}
              >
                Send
              </Button> */}
            </Grid>
          </Grid>
        </ModalWrapper>

        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default StudentProctorIndex;
