import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
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
const initialValues = {
  proctorId: null,
};

function ProctorStudentAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
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

  const navigate = useNavigate();

  useEffect(() => {
    getData();
    getProctorDetails();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/proctor/fetchAllProctorStudentAssignmentDetail?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
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
        proctor_id: newValue,
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

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setProctorIds(selectedRowsData.map((val) => val.id));
    setProctorData(selectedRowsData);
  };

  const handleAssign = async () => {
    await axios
      .post(`/api/proctor/ProctorHeadHistory/${proctorIds}`)
      .then((res) => {
        if (res.status === 200) {
          axios
            .put(`/api/proctor/ProctorStudentAssignment/${proctorIds}`, proctId)
            .then((res) => {
              setReassignOpen(false);
              window.location.reload();
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
      }
    };
    params.row.proctor_status === 1 && params.row.proctor_assign_status === 1
      ? setModalContent({
          title: "De-Assign",
          message: "Are you sure want to De-Assign the student?",
          buttons: [
            { name: "Yes", color: "primary", func: handleClick },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "De-Assign",
          message: "Are you sure want to De-Assign the student?",
          buttons: [
            { name: "Yes", color: "primary", func: () => {} },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleHistory = async (params) => {
    const studentId = params.row.student_id;
    setHistoryOpen(true);
    await axios
      .get(`/api/proctor/fetchProctorHeadHistoryDetail/${studentId}`)
      .then((res) => {
        setHistoryData(res.data);
      })
      .catch((err) => console.error(err));
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

  const columns = [
    { field: "employee_name", headerName: "Mentor", flex: 1 },
    { field: "empcode", headerName: "Mentor Empcode", flex: 1 },
    { field: "student_name", headerName: "Student", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
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
      <Box sx={{ position: "relative", mt: 8 }}>
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
          title="Re-Assign Proctor"
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
                label="Proctor Name"
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
          onClick={() => setReassignOpen(true)}
        >
          De-Assign and Re-Assign
        </Button>
        <ModalWrapper open={historyOpen} setOpen={setHistoryOpen}>
          <StudentHistory historyData={historyData} />
        </ModalWrapper>

        <Button
          onClick={() => navigate("/MentorStudentAssignment/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
        />
      </Box>
    </>
  );
}
export default ProctorStudentAssignmentIndex;
