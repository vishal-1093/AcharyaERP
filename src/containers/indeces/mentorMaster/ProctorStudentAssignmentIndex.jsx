import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import HistoryIcon from "@mui/icons-material/History";
import { Button, Box, IconButton, Grid } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import StudentHistory from "../../../pages/forms/mentorMaster/StudentHistory";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import TelegramIcon from "@mui/icons-material/Telegram";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment/moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  proctorId: null,
  meetingAgenda: "",
  description: "",
  meetingDate: null,
};
const schoolID = JSON.parse(sessionStorage.getItem("userData"))?.school_id;
const empID = JSON.parse(sessionStorage.getItem("userData"))?.emp_id;
const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;
const proctorHeadID = JSON.parse(
  sessionStorage.getItem("userData")
)?.proctorHeadId;

function ProctorStudentAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [paginatedData, setPaginatedData] = useState({
    rows: [],
    loading: false,
    page: 1,
    pageSize: 100,
    total: 0,
  });
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
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    getProctorDetails();
    setCrumbs([{ name: "Mentor Master" }, { name: "Mentor Assignment Index" }]);
  }, []);

  useEffect(() => {
    getData();
  }, [paginatedData.page, paginatedData.pageSize]);

  const checks = {
    meetingAgenda: [values.meetingAgenda !== ""],
    description: [values.description !== ""],
  };

  const errorMessages = {
    meetingAgenda: ["This field is required"],
    description: ["This field is required"],
  };
  const getData = async () => {
    const { page, pageSize } = paginatedData;
    try {
      const baseUrl = `/api/proctor/fetchAllProctorStudentAssignmentDetail`;
      let params = {
        page: page,
        page_size: pageSize,
        sort: "created_date",
      };

      if (proctorHeadID === undefined || proctorHeadID === null) {
        return;
      }

      if (pathname?.toLowerCase() === "/mentormaster/mentor-head") {
        params.UserId = proctorHeadID;
        if (roleId !== 16 && params.UserId) {
          params.school_id = schoolID;
        }
      }

      const response = await axios.get(baseUrl, { params });

      const { content, totalElements } = response.data.data.Paginated_data;

      setPaginatedData((prev) => ({
        ...prev,
        rows: content,
        total: totalElements,
        loading: false,
      }));

      // setRows(response.data.data.Paginated_data.content);
    } catch (err) {
      setPaginatedData((prev) => ({
        ...prev,
        loading: false,
      }));
      console.error("Error fetching data:", err);
    }
  };

  const handleOnPageChange = (newPage) => {
    setPaginatedData((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleOnPageSizeChange = (newPageSize) => {
    setPaginatedData((prev) => ({
      ...prev,
      pageSize: newPageSize,
    }));
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

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) =>
      paginatedData?.rows?.find((row) => row.id === id)
    );
    setProctorIds(selectedRowsData.map((val) => val.id));
    setProctorData(selectedRowsData);
  };

  const handleAssign = async () => {
    const temp = [];
    const proctorAssignId = [];
    proctorData.map((obj) => {
      proctorAssignId.push(obj.proctor_assign_id);
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
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          await axios
            .put(`/api/proctor/ProctorStudentAssignment/${proctorIds}`, proctId)
            .then((res) => {
              setReassignOpen(false);
              getData();
              setValues(initialValues);
              setProctId([]);
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

  const handleDeassign = async (params) => {
    setModalOpen(true);
    const proctorAssignId = params.row.id;
    const studentId = params.row.student_id;
    const handleClick = async () => {
      if (
        params.row.proctor_status === 1 &&
        params.row.proctor_assign_status === 1
      ) {
        await axios
          .delete(
            `/api/student/updateProctorForStudent/${studentId}/${proctorAssignId}`
          )
          .then((res) => {
            getData();
            setModalOpen(false);
          })
          .catch((err) => {
            console.error(err);
          });

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
          .post(`/api/proctor/ProctorStudentAssignmentHistory`, temp)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              setAlertMessage({
                severity: "success",
                message: "De-Assigned Successfully",
              });
              setAlertOpen(true);
            } else {
              setAlertMessage({
                severity: "error",
                message: "Error",
              });
              setAlertOpen(true);
            }
          })
          .catch((err) => {
            setAlertMessage({
              severity: "error",
              message: err.response.data.message,
            });
            console.error(err);
          });
      }
    };
    params.row.proctor_status === 1 &&
    params.row.proctor_assign_status === 1 &&
    proctorData.length === 1
      ? setModalContent({
          title: "De-Assign",
          message: "Are you sure want to De-Assign the student?",
          buttons: [
            { name: "Yes", color: "primary", func: handleClick },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Please select only one row !!",
        });
  };

  const handleHistory = async (params) => {
    console.log(params);
    const studentId = params.row.student_id;
    setHistoryOpen(true);
    await axios
      .get(`/api/proctor/getAllStudentDetailsList/${params.row.emp_id}`)
      .then((res) => {
        setStudentDetails(res.data.data);
      })
      .catch((err) => console.error(err));
    // await axios
    //   .get(`/api/proctor/fetchProctorHeadHistoryDetail/${studentId}`)
    //   .then((res) => {
    //     setHistoryData(res.data);
    //   })
    //   .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/proctor/ProctorStudentAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/proctor/activateProctorStudentAssignment/${id}`)
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
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleTelegram = async (params) => {
    setModalTelegramOpen(true);
    setData(params.row);
    await axios
      .get(
        `/api/proctor/getProctorStatusAssignedStudentDetailsList/${params.row.emp_id}`
      )
      .then((res) => {
        const temp = [];
        res.data.data.map((obj) => {
          temp.push(obj.student_id);
        });
        setStudentIds(temp);
      })
      .catch((err) => console.error(err));
  };

  const handleSendTelegram = async () => {
    const temp = {};
    temp.active = true;
    temp.emp_id = data.emp_id;
    temp.school_id = 1;
    temp.date_of_meeting = values.meetingDate;
    temp.meeting_agenda = values.meetingAgenda;
    temp.student_ids = studentIds;
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

  const handleDeAssignReAssign = () => {
    if (proctorIds.length > 0) {
      setReassignOpen(true);
    } else {
      setModalContent({
        title: "",
        message: "Please select the checkbox !!!!",
        buttons: [],
      });
      setModalOpen(true);
    }
  };

  const columns = [
    { field: "employee_name", headerName: "Mentor", flex: 1 },
    { field: "empcode", headerName: "Mentor Empcode", flex: 1 },
    { field: "student_name", headerName: "Student", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "created_username", headerName: "Assigned By", flex: 1 },
    {
      field: "created_date",
      headerName: "Assigned Date",
      flex: 1,
     // type: "date",
       valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "Deassign",
      type: "actions",
      flex: 1,
      headerName: "De-Assign",
      getActions: (params) => [
        params.row.proctor_status === 1 &&
        params.row.proctor_assign_status === 1 ? (
          <IconButton label="De-Assign" onClick={() => handleDeassign(params)}>
            <AssignmentIndIcon />
          </IconButton>
        ) : (
          <IconButton>
            <NoAccountsIcon label="De-Assign" />
          </IconButton>
        ),
      ],
    },
    {
      field: "Profile",
      type: "actions",
      flex: 1,
      headerName: "Profile",
      getActions: (params) => [
        params.row.proctor_status === 1 &&
        params.row.proctor_assign_status === 1 ? (
          <IconButton
            label="Profile"
            onClick={() =>
              navigate(`/student-profile/${params.row.student_id}`)
            }
          >
            <AccountBoxIcon />
          </IconButton>
        ) : (
          <IconButton label="Profile">
            <AccountBoxIcon />
          </IconButton>
        ),
      ],
    },
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
    // {
    //   field: "Telegram",
    //   type: "actions",
    //   flex: 1,
    //   headerName: "Telegram",
    //   getActions: (params) => [
    //     params.row.proctor_status === 1 ? (
    //       <IconButton label="History" onClick={() => handleTelegram(params)}>
    //         <TelegramIcon />
    //       </IconButton>
    //     ) : (
    //       <IconButton label="History">
    //         <TelegramIcon />
    //       </IconButton>
    //     ),
    //   ],
    // },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];
  return (
    <>
      <Box sx={{ position: "relative", mt: 4 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
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
        <Button
          variant="contained"
          sx={{ position: "absolute", right: 120, top: -57, borderRadius: 2 }}
          onClick={() => handleDeAssignReAssign()}
        >
          De-Assign and Re-Assign
        </Button>
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
              <Button
                variant="contained"
                onClick={handleSendTelegram}
                sx={{ borderRadius: 2 }}
                startIcon={<TelegramIcon />}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>

        <Button
          onClick={() =>
            pathname.toLowerCase() === "/mentorassignmentindex"
              ? navigate("/MentorAssignment", { state: pathname })
              : navigate("/MentorAssignment-Inst", { state: pathname })
          }
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex
          rows={paginatedData.rows}
          columns={columns}
          rowCount={paginatedData.total}
          page={paginatedData.page}
          pageSize={paginatedData.pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
          loading={paginatedData.loading}
          checkboxSelection
          onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
        />
      </Box>
    </>
  );
}
export default ProctorStudentAssignmentIndex;
