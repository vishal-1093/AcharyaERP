import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";

function CourseassignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const columns = [
    { field: "auid", headerName: "Auid", flex: 1 },
    { field: "student_name", headerName: "Student", flex: 1 },
    { field: "course_short_name", headerName: "Course", flex: 1 },
    { field: "course_code", headerName: "C-Code", flex: 1 },
    // { field: "course_assignment_coursecode", headerName: "C-Code", flex: 1 },
    // { field: "course_type_name", headerName: "C-Type", flex: 1 },
    // { field: "year_sem", headerName: "Year/Sem", flex: 1 },
    // {
    //   field: "school_name_short",
    //   headerName: "School",
    //   flex: 1,
    //   hide: true,
    // },
    // { field: "program_short_name", headerName: "Program", flex: 1 },
    // {
    //   field: "program_specialization_short_name",
    //   headerName: "Specialization",
    //   flex: 1,
    // },

    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
      hide: true,
    },

    // {
    //   field: "id",
    //   type: "actions",
    //   flex: 1,
    //   headerName: "Update",
    //   getActions: (params) => [
    //     <IconButton
    //       onClick={() =>
    //         navigate(`/CourseMaster/Student/Update/${params.row.id}`)
    //       }
    //     >
    //       <EditIcon />
    //     </IconButton>,
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
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];
  useEffect(() => {
    getTranscriptData();
  }, []);

  const getTranscriptData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllCourseStudentAssignmentDetail?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/CourseAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getTranscriptData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateCourseAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getTranscriptData();
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
    setModalOpen(true);
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 8 }}>
        <Button
          onClick={() => navigate("/CourseMaster/Student/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default CourseassignmentIndex;
