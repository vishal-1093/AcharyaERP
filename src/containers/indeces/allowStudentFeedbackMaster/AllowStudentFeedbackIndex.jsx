import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";

function AllowStudentFeedbackIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const columns = [
    { field: "ac_year", headerName: "Academy Year", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "courseConcate", headerName: "Course", flex: 1 },
    { field: "year_or_sem", headerName: "Semester", flex: 1 },
    { field: "actualPercentage", headerName: "Percentage", flex: 1 },
    { field: "windowPeriod", headerName: "Window Period", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      // type: "date",
      valueGetter: (value, row) => moment(row?.created_date).format("DD-MM-YYYY"),
    },

  ];
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
    .get(
        `/api/fetchAllFeedbackAllowForStudentDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res?.data?.data.Paginated_data?.content);
      })
      .catch((err) => console.error(err));
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
      <Box sx={{ position: "relative", marginTop: 3 }}>
        <Button
          onClick={() => navigate("/AllowStudentFeedbackMaster/students/New")}
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
export default AllowStudentFeedbackIndex;
