import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import dayjs from "dayjs";
import { convertTimeToString } from "../../../utils/DateTimeUtils";
import moment from "moment";

function ShiftIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "shiftName", headerName: "Shift", flex: 1 },
    {
      field: "actual_start_time",
      headerName: "Actual Start Time",
      flex: 1,
      valueGetter: (params) =>
        convertTimeToString(dayjs(params.row.actual_start_time).$d),
    },
    {
      field: "shiftStartTime",
      headerName: " Start Time",
      flex: 1,
      type: "time",
      valueGetter: (params) =>
        convertTimeToString(dayjs(params.row.frontend_use_start_time).$d),
    },
    {
      field: "shiftEndTime",
      headerName: "End Time",
      flex: 1,
      type: "time",
      valueGetter: (params) =>
        convertTimeToString(dayjs(params.row.frontend_use_end_time).$d),
    },
    {
      field: "timeDifference",
      headerName: "Grace (min)",
      flex: 1,
      valueGetter: (params) => {
        const graceTime = dayjs(params.row.actual_start_time);
        const startTime = dayjs(params.row.frontend_use_start_time);
        const timeDifference =
          new Date(graceTime).getTime() - new Date(startTime).getTime();
        return Math.round(timeDifference / (1000 * 60));
      },
    },
    {
      field: "is_saturday",
      headerName: "Is Saturday Off",
      flex: 1,
      renderCell: (params) => (params.row.is_saturday === true ? "Yes" : "No"),
    },
    { field: "createdUsername", headerName: "Created By", flex: 1 },

    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      renderCell: (params) =>
        moment(params.row.createdDate).format("DD-MM-YYYY"),
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/ShiftMaster/Shifts/Update/${params.row.id}`)
          }
          sx={{ padding: 0 }}
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
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "green" }}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "green", color: "red" }}
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
        `/api/employee/fetchAllShiftDetails?page=0&page_size=1000&sort=createdDate`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
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
        await axios
          .delete(`/api/employee/Shift/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/employee/activateShift/${id}`)
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
          onClick={() => navigate("/ShiftMaster/Shifts/New")}
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
export default ShiftIndex;
