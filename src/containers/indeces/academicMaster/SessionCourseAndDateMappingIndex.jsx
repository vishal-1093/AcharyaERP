import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Button,
  IconButton,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { makeStyles } from "@mui/styles";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  bg: {
    background: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const requiredFields = ["courseId", "timeSlotId"];

function SessionCourseAndDateMappingIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAssignOpen, setModalAssignOpen] = useState(false);

  const [timeSlotsOptions, setTimeSlotOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [internalData, setInternalData] = useState([]);
  const [validation, setValidation] = useState(null);
  const [validationFields, setValidationFields] = useState(false);
  const [internalId, setInternalId] = useState(null);

  const navigate = useNavigate();
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    { field: "internal_name", headerName: "Session", flex: 1 },
    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
      // type: "date",
      valueGetter: (value, row) => new Date(row.from_date),
    },
    {
      field: "to_date",
      headerName: "To Date",
      flex: 1,
      // type: "date",
      valueGetter: (value, row) => new Date(row?.to_date),
    },
    { field: "ac_year", headerName: "AC Year", flex: 1 },
    { field: "school_name_short", headerName: " School Name", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    { field: "year_sem", headerName: "Year/Sem", flex: 1 },
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
      // type: "date",
      valueGetter: (value, row) =>
        moment(row?.created_date).format("DD-MM-YYYY"),
      hide: true,
    },
    {
      field: "assign",
      headerName: " Student Assign",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton
          color="primary"
          onClick={() =>
            navigate(
              `/SessionRoomInvigilatorAssignment/Assign/${params.row.id}`
            )
          }
        >
          <AssignmentIndIcon />
        </IconButton>,
      ],
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/SessionAssignmentForm/Update/${params.row.id}`)
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
        `/api/academic/fetchAllInternalSessionAssignment?page=${0}&page_size=${10000}&sort=created_by`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/internalSessionAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateinternalSessionAssignment/${id}`)
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
          onClick={() => navigate("/SessionAssignmentForm")}
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
export default SessionCourseAndDateMappingIndex;
