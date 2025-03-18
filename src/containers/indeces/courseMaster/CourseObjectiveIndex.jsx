import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
  styled,
  tableCellClasses,
  TableCell,
  TableHead,
  CardContent,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "../../../services/Api";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function CourseObjectiveIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [courseObjective, setCourseObjective] = useState([]);
  const [courseObjectiveOpen, setCourseObjectiveOpen] = useState(false);

  const navigate = useNavigate();

  const columns = [
    { field: "course_name", headerName: "Course", flex: 1 },
    {
      field: "course_code",
      headerName: "Course Code",
      flex: 1,
    },
    {
      field: "view",
      headerName: "View",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton onClick={() => handleView(params)}>
          <VisibilityIcon />
        </IconButton>,
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },

    {
      field: "id",
      type: "actions",
      flex: 0.5,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/CourseSubjectiveMaster/CourseObjective/Update/${params.row.course_assignment_id}`
            )
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
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllCourseObjectiveDetail?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleView = async (params) => {
    setCourseObjectiveOpen(true);

    await axios
      .get(
        `/api/academic/getCourseObjectiveDetails/${params.row.course_assignment_id}`
      )
      .then((res) => {
        setCourseObjective(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/courseObjective/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateCourseObjective/${id}`)
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
          title: "Deactivate",
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
      <ModalWrapper
        maxWidth={500}
        maxHeight={500}
        open={courseObjectiveOpen}
        setOpen={setCourseObjectiveOpen}
      >
        <Card
          sx={{ minWidth: 450, minHeight: 200, marginTop: 4 }}
          elevation={4}
        >
          <TableHead>
            <StyledTableCell
              sx={{
                width: 500,
                textAlign: "center",
                fontSize: 18,
                padding: "10px",
              }}
            >
              Course Objective
            </StyledTableCell>
          </TableHead>
          <CardContent>
            <Typography sx={{ fontSize: 16, paddingLeft: 1 }}>
              {courseObjective.map((val, i) => (
                <ul key={i}>
                  <li>
                    <Typography
                      variant="subtitle2"
                      color="inherit"
                      component="div"
                      mt={2}
                    >
                      {val.course_objective}
                    </Typography>
                  </li>
                </ul>
              ))}
            </Typography>
          </CardContent>
        </Card>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() =>
            navigate("/CourseSubjectiveMaster/CourseObjective/New")
          }
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
export default CourseObjectiveIndex;
