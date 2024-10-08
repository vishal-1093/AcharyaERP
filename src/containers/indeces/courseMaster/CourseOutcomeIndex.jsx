import { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
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
import axios from "../../../services/Api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ModalWrapper from "../../../components/ModalWrapper";
import Card from "@mui/material/Card";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function CourseOutcomeIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOutcomeOpen, setModalOutcomeOpen] = useState(false);
  const [courseOutcome, setCourseOutcome] = useState([]);

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
            navigate(
              `/CourseSubjectiveMaster/CourseOutcome/Update/${params.row.course_assignment_id}`
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
        `/api/academic/fetchAllCourseOutComeDetail?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleView = async (params) => {
    setModalOutcomeOpen(true);

    await axios
      .get(
        `/api/academic/getCourseOutComeDetails/${params.row.course_assignment_id}`
      )
      .then((res) => {
        setCourseOutcome(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/courseOutCome/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateCourseOutComes/${id}`)
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
        maxWidth={800}
        // maxHeight={500}
        open={modalOutcomeOpen}
        setOpen={setModalOutcomeOpen}
      >
        <TableHead>
          <StyledTableCell
            sx={{
              width: 800,
              textAlign: "center",
              fontSize: 16,
              padding: "8px",
            }}
          >
            Course Outcome
          </StyledTableCell>
        </TableHead>
        <Typography sx={{ fontSize: 16, paddingLeft: 1 }}>
          {/* {courseOutcome.map((val, i) => (
                <ul>
                  <li>
                    <Typography
                      variant="h6"
                      color="inherit"
                      component="div"
                      mt={2}
                    >
                      {"CO" + Number(i + 1)}
                    </Typography>
                    {val.course_outcome_objective}
                  </li>
                </ul>
              ))} */}

          {courseOutcome.map((row, i) => (
            <Card variant="outlined">
              <CardContent style={{ paddingBottom: "0px", padding: "0px" }}>
                <TableContainer>
                  <Table sx={{ width: "100%" }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "40%" }}>
                          {row.course_outcome_code}
                        </TableCell>
                        <TableCell sx={{ width: "30%" }}>Taxonomy</TableCell>
                        <TableCell sx={{ width: "30%" }}>
                          Taxonomy Details
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell minWidth="40%">
                          {row.course_outcome_objective}
                        </TableCell>
                        <TableCell minWidth="30%">{row.toxonomy}</TableCell>
                        <TableCell minWidth="30%">
                          {row.toxonomy_details}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))}
        </Typography>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/CourseSubjectiveMaster/CourseOutcome/New")}
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
export default CourseOutcomeIndex;
