import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { AddCircleOutline, Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function CourseAssignmentEmployeeIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    { field: "username", headerName: "Faculty", flex: 1 },
    { field: "course_name", headerName: "Course", flex: 1 },
    { field: "course_code", headerName: "Course Code", flex: 1 },
    { field: "duration", headerName: "Vtu Max Hours", flex: 1 },
    {
      field: "course_assignment",
      headerName: "Course Assignment",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          color="primary"
          onClick={() =>
            navigate(`/course-assignment-for-employee`, {
              state: params.row.course_id,
            })
          }
        >
          <AddCircleOutline fontSize="small" />
        </IconButton>,
      ],
    },
    {
      field: "syllabus",
      headerName: "Syllabus Assignment",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          color="primary"
          onClick={() => navigate("/CourseSubjectiveMaster/Syllabus/New")}
        >
          <AddCircleOutline fontSize="small" />
        </IconButton>,
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/CourseassignmentEmployeeUpdate/${params.row.id}`)
          }
        >
          <EditIcon />
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

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllCourseAssignmentEmployee?page=${0}&page_size=${100000}&sort=created_date&user_id=${userId}`
      )
      .then((res) => {
        const temp = [];
        res.data.data.Paginated_data.content.map((obj, index) => {
          temp.push({
            active: true,
            id: obj.id,
            username: obj.username,
            course_name: obj.course_name,
            course_code: obj.course_code,
            created_username: obj.created_username,
            created_date: obj.created_date,
            duration: obj.duration,
            course_id: obj.course_id,
          });
        });

        setRows(temp);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
    setCrumbs([{ name: "" }]);
  }, []);

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        axios
          .delete(`/api/academic/deactivateCourseAssignmentEmployee/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        axios
          .delete(`/api/academic/activateCourseAssignmentEmployee/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
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
      <Box sx={{ position: "relative", mt: 5 }}>
        <Button
          onClick={() => navigate("/CourseAssignmentEmployee")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -40, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex mt={2} rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default CourseAssignmentEmployeeIndex;
