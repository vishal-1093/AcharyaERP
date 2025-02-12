import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import { Badge, Box, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import GridIndex from "../../components/GridIndex";
import { HighlightOff } from "@mui/icons-material";
import CustomModal from "../../components/CustomModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ModalWrapper from "../../components/ModalWrapper";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const StudentRoomAssignment = lazy(() =>
  import("../forms/academicMaster/StudentRoomAssignment")
);
const InvigilatorSwapForm = lazy(() =>
  import("../forms/academicMaster/InvigilatorSwapForm")
);
const RoomSwapForm = lazy(() => import("../forms/academicMaster/RoomSwapForm"));

function InternalRoomAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapRoomOpen, setSwapRoomOpen] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Internal Assesment", link: "/internals" },
      { name: "Room Assignment" },
    ]);
    getData();
  }, []);

  const getData = async () => {
    try {
      const empResponse = await axios.get(
        `/api/employee/getEmployeeDataByUserID/${userId}`
      );
      const empResponseData = empResponse.data.data;
      const schoolId = empResponseData.school_id;
      const url = "/api/academic/fetchAllInternalFacultyRoomAssignment?";
      const response = await axios.get(url, {
        params: {
          page: 0,
          page_size: 10000,
          sort: "created_date",
          ...(roleShortName !== "SAA" && schoolId && { school_id: schoolId }),
        },
      });
      setRows(response.data.data.Paginated_data.content);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleActive = (params) => {
    const { id, active } = params.row;

    try {
      let title;
      let message;
      let url;

      if (active) {
        title = "Deactivate";
        message = "Do you want to make it Inactive?";
        url = `/api/academic/internalFacultyRoomAssignment/${id}`;
      } else {
        title = "Activate";
        message = "Do you want to make it Active?";
        url = `/api/academic/activateInternalFacultyRoomAssignment/${id}`;
      }

      const handleConfirm = async () => {
        const response = await axios.delete(url);

        if (response.data.success) {
          getData();
          setAlertMessage({
            severity: "success",
            message: active
              ? "Deactivated successfully !!"
              : "Activated Successfully !!",
          });
          setAlertOpen(true);
        }
      };

      setModalContent({
        title: title,
        message: message,
        buttons: [
          { name: "Yes", color: "primary", func: handleConfirm },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setModalOpen(true);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    }
  };

  const handleAddStudents = (data) => {
    setWrapperOpen(true);
    setRowData(data);
  };

  const handleSwap = (data) => {
    setRowData(data);
    setSwapOpen(true);
  };

  const handleSwapRoom = (data) => {
    setRowData(data);
    setSwapRoomOpen(true);
  };

  const columns = [
    { field: "internal_name", headerName: "Internal", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.program_short_name}-${params.row.program_specialization_short_name}`,
    },
    { field: "course_with_coursecode", headerName: "Course", flex: 1 },
    { field: "date_of_exam", headerName: "Exam Date", flex: 1 },
    { field: "timeSlot", headerName: "Time Slot", flex: 1 },
    { field: "roomcode", headerName: "Room", flex: 1 },
    { field: "facultyName", headerName: "Invigilator", flex: 1 },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    { field: "created_date", headerName: "Created Date", flex: 1, hide: true },
    {
      field: "studentId",
      headerName: "Add Students",
      flex: 1,
      renderCell: (params) => {
        if (params.row.attendance_status) {
          return null;
        }
        const hasStudents = params.row.student_ids?.length > 0;
        const studentCount = params.row.student_ids?.split(",").length || 0;
        return (
          <IconButton onClick={() => handleAddStudents(params.row)}>
            {hasStudents ? (
              <Badge
                badgeContent={studentCount}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    left: -10,
                  },
                }}
              />
            ) : (
              <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
            )}
          </IconButton>
        );
      },
    },
    {
      field: "InvigilatorSwap",
      headerName: "Invigilator Swap",
      flex: 1,
      renderCell: (params) =>
        !params.row.attendance_status && (
          <IconButton onClick={() => handleSwap(params.row)}>
            <SwapHorizontalCircleIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        ),
    },
    {
      field: "room_id",
      headerName: "Room Swap",
      flex: 1,
      renderCell: (params) =>
        !params.row.attendance_status && (
          <IconButton onClick={() => handleSwapRoom(params.row)}>
            <SwapHorizontalCircleIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        ),
    },
    {
      field: "id",
      headerName: "Active",
      flex: 1,
      renderCell: (params) =>
        params.row.attendance_status ? (
          <></>
        ) : params.row.active === true ? (
          <IconButton
            label="Result"
            onClick={() => {
              handleActive(params);
            }}
            sx={{ padding: 0, color: "success.main" }}
          >
            <CheckCircleIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "error.main" }}
          >
            <HighlightOff />
          </IconButton>
        ),
    },
  ];

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <ModalWrapper
        open={wrapperOpen}
        setOpen={setWrapperOpen}
        maxWidth={1200}
        title={`${rowData.internal_name} - ${rowData.roomcode}`}
      >
        <StudentRoomAssignment
          rowData={rowData}
          getData={getData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          setWrapperOpen={setWrapperOpen}
        />
      </ModalWrapper>

      <ModalWrapper
        open={swapOpen}
        setOpen={setSwapOpen}
        maxWidth={1000}
        title={`Swap Invigilator ( ${rowData.internal_name} - ${rowData.roomcode} )`}
      >
        <InvigilatorSwapForm
          rowData={rowData}
          setSwapOpen={setSwapOpen}
          getData={getData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
        />
      </ModalWrapper>

      <ModalWrapper
        open={swapRoomOpen}
        setOpen={setSwapRoomOpen}
        maxWidth={1000}
        title={`Swap Room ( ${rowData.internal_name} - ${rowData.roomcode} )`}
      >
        <RoomSwapForm
          rowData={rowData}
          setSwapRoomOpen={setSwapRoomOpen}
          getData={getData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
        />
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 3 }}>
        <Button
          onClick={() => navigate("/internals/room-assign")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Assign
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default InternalRoomAssignmentIndex;
