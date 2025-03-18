import { useState, useEffect } from "react";
import { Box, Button, Card, styled, IconButton, TableCell, tableCellClasses, TableHead, CardContent, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { AddCircleOutline, Check, HighlightOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModalWrapper from "../../../components/ModalWrapper";
import useRoleBasedNavigation from "../../../components/useRoleBasedNavigation";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function CourseAssignmentEmployeeIndex() {
  const navigateBasedOnRole = useRoleBasedNavigation();
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [courseObjectiveOpen, setCourseObjectiveOpen] = useState(false);
  const [courseObjective, setCourseObjective] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();

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

  const columns = [
    { field: "username", headerName: "Faculty", flex: 1 },
    { field: "course_name", headerName: "Course", flex: 1 },
    { field: "course_code", headerName: "Course Code", flex: 1 },
    { field: "duration", headerName: "Univ Hrs", flex: 1 },
    {
      field: "course_assignment",
      headerName: "Assign",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            params.row.course_assignment_id == null
              ? navigate(`/CourseAssignment`, { state: params?.row })
              : navigate(`/CourseAssignment/Update/${params?.row?.course_assignment_id}`, { state: params?.row })
          }
        >
          {params.row.course_assignment_id == null ? (
            <AddIcon />
          ) : (
            <VisibilityIcon />
          )}
        </IconButton>,
      ],
    },

    {
      field: "syllabus",
      headerName: "Syllabus",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/CourseSubjectiveMaster/Syllabus/Update/${params.row.course_assignment_id}`, {
              state: pathname,
            }

            )
          }
          disabled={params?.row?.course_assignment_id == null}
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "out",
      headerName: "OutCome",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(

              `/CourseSubjectiveMaster/CourseOutcome/Update/${params.row.course_assignment_id}`, {
              state: pathname,
            })
          }
          disabled={params?.row?.course_assignment_id == null}
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "objective",
      headerName: "Objective",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/CourseSubjectiveMaster/CourseObjective/Update/${params.row.course_assignment_id}`, {
              state: pathname,
            }
            )
          }
          disabled={params?.row?.course_assignment_id == null}
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      // type: "date",
      valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
    // {
    //   field: "id",
    //   type: "actions",
    //   flex: 1,
    //   headerName: "Update",
    //   getActions: (params) => [
    //     <IconButton
    //       onClick={() =>
    //         navigate(`/CourseassignmentEmployeeUpdate/${params.row.id}`)
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

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllCourseAssignmentEmployee?page=${0}&page_size=${100000}&sort=created_date&user_id=${userId}`
      )
      .then((res) => {
        const temp = [];
        res.data.data.Paginated_data.content.map((obj, index) => {
          temp.push({
            active: obj?.active,
            id: obj.id,
            username: obj.username,
            course_name: obj.course_name,
            course_code: obj.course_code,
            created_username: obj.created_username,
            created_date: obj.created_date,
            duration: obj.duration,
            course_id: obj.course_id,
            course_assignment_id: obj.course_assignment_id,
          });
        });

        setRows(temp);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
    setCrumbs([
      {
        name: "Dashboard",
        link: () => navigateBasedOnRole()
      },
      { name: "My Course" },
    ]);
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
          { name: "No", color: "primary", func: () => { } },
        ],
      })
      : setModalContent({
        title: "",
        message: "Do you want to make it Active?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
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
      <Box sx={{ position: "relative", mt: 5 }}>
        {/* <Button
          onClick={() => navigate("/CourseAssignmentEmployee")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -40, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button> */}
        <GridIndex mt={2} rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default CourseAssignmentEmployeeIndex;
