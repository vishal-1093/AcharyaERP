import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";

function TimetableForSectionIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalSelectContent, setModalSelectContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSelectOpen, setModalSelectOpen] = useState(false);
  const [ids, setIds] = useState([]);

  const navigate = useNavigate();
  //   const classes = useStyles();

  const columns = [
    {
      field: "ac_year",
      headerName: "AC Year",
      flex: 1,
    },
    { field: "school_name_short", headerName: " School Name", flex: 1 },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    { field: "current_year", headerName: "Year/Sem", flex: 1 },
    { field: "from_date", headerName: "From Date", flex: 1 },
    { field: "to_date", headerName: "To Date", flex: 1 },
    { field: "week_day", headerName: "Week Day", flex: 1 },
    { field: "timeSlots", headerName: "Time Slots", flex: 1 },
    {
      field: "intervalTypeShort",
      headerName: "Interval Type",
      flex: 1,
      hide: true,
    },
    { field: "employee_name", headerName: "Employee", flex: 1 },
    { field: "course", headerName: "Course", flex: 1, hide: true },
    {
      field: "section_name",
      headerName: "Section",
      flex: 1,
      valueGetter: (params) =>
        params.row.section_name ? params.row.section_name : "NA",
    },
    {
      field: "batch_name",
      headerName: "Batch",
      flex: 1,
      valueGetter: (params) =>
        params.row.batch_name ? params.row.batch_name : "NA",
    },
    // { field: "room_name", headerName: "Room", flex: 1 },
    // { field: "remarks", headerName: "remarks", flex: 1 },
    // { field: "online_status", headerName: "Online Status", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
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
        `/api/academic/fetchAllTimeTableDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setIds(selectedRowsData.map((val) => val.id));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/TimeTable/${ids.toString()}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateTimeTable/${ids.toString()}`)
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

  const handleSelectOpen = () => {
    const handleSectionCreation = () => {
      navigate("/SectionMaster/Timetable/Section/New");
    };
    const handleBatchCreation = () => {
      navigate("/SectionMaster/Timetable/Batch/New");
    };
    setModalSelectOpen(true);
    setModalSelectContent({
      title: "Create Timetable For",
      message: "",
      buttons: [
        { name: "Section", color: "primary", func: handleSectionCreation },
        { name: "Batch", color: "primary", func: handleBatchCreation },
      ],
    });
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
      <CustomModal
        open={modalSelectOpen}
        setOpen={setModalSelectOpen}
        title={modalSelectContent.title}
        message={modalSelectContent.message}
        buttons={modalSelectContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={handleSelectOpen}
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
          //   getRowClassName={(params) => {
          //     return params.row.section_name ? classes.red : "";
          //   }}
        />
      </Box>
    </>
  );
}
export default TimetableForSectionIndex;
