import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import dayjs from "dayjs";
import moment from "moment";

function TimeSlotsIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const convertTimeToString1 = (time) => {
    if (time)
      return `${("0" + time.getHours()).slice(-2)}:${(
        "0" + time.getMinutes()
      ).slice(-2)}`;
  };

  function tConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? " AM" : " PM";
      time[0] = +time[0] % 12 || 12;
    }
    return time.join("");
  }

  tConvert("18:00:00");

  const columns = [
    { field: "school_name_short", headerName: "Institute", flex: 1 },
    {
      field: "starting_time",
      headerName: " Start Time",
      flex: 1,
      valueGetter: (value, row) =>
        tConvert(
          convertTimeToString1(dayjs(row?.starting_time_for_fornted).$d)
        ),
    },
    {
      field: "ending_time_for_fornted",
      headerName: "End Time",
      flex: 1,
      valueGetter: (value, row) =>
        tConvert(
          convertTimeToString1(dayjs(row?.ending_time_for_fornted).$d)
        ),
    },
    {
      field: "class_time_table",
      headerName: "Class Time Time",
      flex: 1,
      valueGetter: (value, row) => (row?.class_time_table ? "Yes" : "No"),
    },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row?.created_date).format("DD-MM-YYYY"),
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/SectionMaster/timeslots/Update/${params.row.id}`)
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
        `/api/academic/fetchAllTimeSlotsDetail?page=${0}&page_size=${1000000}&sort=created_date`
      )
      .then((res) => {
        const rows = res.data.data.Paginated_data.content.map((obj) => ({
          ...obj,
          timeSlot: `${obj.starting_time}-${obj.ending_time}`,
        }));

        const sorted = sortTimeSlots(rows);

        setRows(sorted);
      })
      .catch((err) => console.error(err));
  };

  const convertToDate = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return new Date(1970, 0, 1, hours, minutes);
  };

  // Sorting function to sort time slots by start time and then end time
  const sortTimeSlots = (slots) => {
    return slots.sort((a, b) => {
      const [startA, endA] = a.timeSlot.split("-").map(convertToDate);
      const [startB, endB] = b.timeSlot.split("-").map(convertToDate);

      // First, compare by start time
      if (startA < startB) return -1;
      if (startA > startB) return 1;

      // If start times are equal, compare by end time
      return endA - endB;
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        axios
          .delete(`/api/academic/timeSlots/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        axios
          .delete(`/api/academic/activateTimeSlots/${id}`)
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
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/SectionMaster/timeslots/New")}
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
export default TimeSlotsIndex;
