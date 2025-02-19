import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import YouTubeIcon from '@mui/icons-material/YouTube';
import VideoPlayer from "../../../components/CustomVideoPlayer/VideoPlayer";

function AllowStudentFeedbackIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false)

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
      type: "date",
      valueGetter: (params) => moment(params.row.created_date).format("DD-MM-YYYY"),
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
      <ModalWrapper open={showVideo} setOpen={setShowVideo} maxWidth={1000} height={1000}>
        <VideoPlayer videoPath="https://acharyauniversitynavigationvideos.s3.us-east-2.amazonaws.com/Counsellor+Login+.mov" />
      </ModalWrapper>

      {/* {rows.length > 0 && (
        <Box sx={{display: "flex", justifyContent: "flex-end", gap: "30px", alignItems: "flex-end"}}>
          <YouTubeIcon sx={{color: "red", fontSize: "3rem", cursor: "pointer"}} onClick={() => setShowVideo(true)} />
        </Box>
      )} */}
    </>
  );
}
export default AllowStudentFeedbackIndex;
