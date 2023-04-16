import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import EditOffIcon from "@mui/icons-material/EditOff";

function HolidayCalenderIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const columns = [
    { field: "leave_type_short", headerName: "Holiday Type", flex: 1 },
    { field: "holiday_name", headerName: "Name", flex: 1 },
    { field: "school_name_short", headerName: "Institute", flex: 1 },
    { field: "job_type_short_name", headerName: "Job Type", flex: 1 },
    {
      field: "from_date",
      headerName: "Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.from_date),
    },
    { field: "day", headerName: "Day", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
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
              `/HolidayCalenderMaster/HolidayCalenders/Update/${params.row.id}`
            )
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "deasign",
      type: "actions",
      flex: 1,
      headerName: "DeAssign Department",
      getActions: (params) => [
        params.row.school_name_short ? (
          <>
            <IconButton
              onClick={() =>
                navigate(
                  `/HolidayCalenderMaster/DeAssignDepartments/${params.row.id}`
                )
              }
            >
              <DisabledByDefaultIcon />
            </IconButton>
            ,
          </>
        ) : (
          <IconButton color="primary">
            <EditOffIcon />
          </IconButton>
        ),
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
        `/api/fetchAllHolidayCalenderDetails?page=${0}&page_size=${10000}&sort=created_date`
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
          .delete(`/api/HolidayCalender/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/activateHolidayCalender/${id}`)
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
      <Box sx={{ position: "relative", mt: -4 }}>
        <Button
          onClick={() =>
            navigate("/HolidayCalenderMaster/HolidayCalenders/New")
          }
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -45, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default HolidayCalenderIndex;
