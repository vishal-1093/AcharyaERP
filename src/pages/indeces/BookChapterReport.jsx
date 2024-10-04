import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import {
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import MailIcon from "@mui/icons-material/Mail";


const empId = sessionStorage.getItem("empId");

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  remark: "",
  followUpDate: "",
  loading: false,
};

function BookChapterReport() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [{ remark, loading, followUpDate }, setState] = useState(initialState);
  const navigate = useNavigate();

  const columns = [
    {
      field: "",
      headerName: "Application Status",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleIncentive(params)}
          sx={{ padding: 0, color: "primary.main" }}
        >
          <PlaylistAddIcon sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
    { field: "book_title", headerName: "Book title", flex: 1 },
    { field: "authore", headerName: "Author Name", flex: 1 },
    { field: "publisher", headerName: "Publisher", flex: 1 },
    { field: "published_year", headerName: "Published Year", flex: 1 },
    { field: "isbn_number", headerName: "ISBN No.", flex: 1 },

    { field: "doi", headerName: "DOI", flex: 1 },
    { field: "created_username", headerName: "Unit", flex: 1 },
    {
      field: "attachment_path",
      type: "actions",
      flex: 1,
      headerName: "View",
      getActions: (params) => [
        params.row.attachment_path ? (
          <IconButton
            onClick={() => handleDownload(params.row.attachment_path)}
            sx={{ padding: 0 }}
          >
            <VisibilityIcon
              fontSize="small"
              color="primary"
              sx={{ cursor: "pointer" }}
            />
          </IconButton>
        ) : (
          <></>
        ),
      ],
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Follow Up",
      getActions: (params) => [
        <IconButton onClick={() => handleFollowUp(params)} sx={{ padding: 0 }}>
          <NoteAddIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: "pointer" }}
          />
        </IconButton>,
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/employee/bookChapterDetailsBasedOnEmpId/843`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/bookChapterFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleIncentive = (params) => {
    navigate("/addon-incentive-application", { state: { empId: "843" } });
  };

  const handleFollowUp = (params) => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={600}
        title={"Follow Up"}
      >
        <Box p={1}>
          <Grid container>
            <Grid xs={12}>
              <Timeline>
                <TimelineItem>
                  <TimelineOppositeContent color="textSecondary">
                        <Typography>1-10-2024</Typography>
                        <Typography>H.O.D</Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot>
                      <CheckCircleIcon color="success" />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                  <Typography>Note - </Typography>
                  <Typography>Follow Up Date - </Typography>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                        <Typography>1-10-2024</Typography>
                        <Typography>H.O.D</Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot>
                      <CheckCircleIcon color="success" />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                  <Typography>Note - </Typography>
                  <Typography>Follow Up Date - </Typography>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                        <Typography>1-10-2024</Typography>
                        <Typography>H.O.D</Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot>
                      <CheckCircleIcon color="success" />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                  <Typography>Note - </Typography>
                  <Typography>Follow Up Date - </Typography>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default BookChapterReport;
