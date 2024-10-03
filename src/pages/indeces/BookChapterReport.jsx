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
        maxWidth={800}
        title={"Follow Up"}
      >
        <Box p={1}>
          <Grid container>
            <Grid xs={12}>
              <Timeline position="alternate">
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined">
                      <MailIcon color="primary" />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                  <Box sx={{ borderTop:"3px solid steelblue" }}>
                    <Card sx={{ minWidth: 100 }}>
                      <CardContent>
                        <Grid container>
                          <Grid
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>H.O.D</Typography>
                            <Typography>30-9-2024</Typography>
                          </Grid>
                          <Grid
                            mt={2}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>Note:</Typography>
                            <Typography>Date:</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined">
                      <MailIcon color="primary" />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                  <Box sx={{ borderTop:"3px solid steelblue" }}>
                    <Card sx={{ minWidth: 100,borderTopWidth:"1px solid purple" }}>
                      <CardContent>
                        <Grid container>
                          <Grid
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>H.O.D</Typography>
                            <Typography>30-9-2024</Typography>
                          </Grid>
                          <Grid
                            mt={2}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>Note:</Typography>
                            <Typography>Date:</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined">
                      <MailIcon color="primary" />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                  <Box sx={{ borderTop:"3px solid steelblue" }}>
                    <Card sx={{ minWidth: 100 }}>
                      <CardContent>
                        <Grid container>
                          <Grid
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>H.O.D</Typography>
                            <Typography>30-9-2024</Typography>
                          </Grid>
                          <Grid
                            mt={2}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>Note:</Typography>
                            <Typography>Date:</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined">
                      <MailIcon color="primary" />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                  <Box sx={{ borderTop:"3px solid steelblue" }}>
                    <Card sx={{ minWidth: 100 }}>
                      <CardContent>
                        <Grid container>
                          <Grid
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>H.O.D</Typography>
                            <Typography>30-9-2024</Typography>
                          </Grid>
                          <Grid
                            mt={2}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>Note:</Typography>
                            <Typography>Date:</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                    </Box>
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
