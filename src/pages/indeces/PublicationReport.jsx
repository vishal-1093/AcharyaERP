import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, IconButton,Grid,Typography } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

const empId = sessionStorage.getItem("empId");

const timeLineData = [
  {date:"8-10-2024",type:"Head of Department",note:"",name:""},
  {date:"8-10-2024",type:"Head of Institute",note:"",name:""},
  {date:"8-10-2024",type:"Dean R & D",note:"",name:""},
  {date:"8-10-2024",type:"Assistant Director R & D",note:"",name:""},
  {date:"8-10-2024",type:"Quality Assurance",note:"",name:""},
  {date:"8-10-2024",type:"Human Resources",note:"",name:""},
  {date:"8-10-2024",type:"Finance",note:"",name:""}
];

function PublicationReport() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
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
    { field: "Type", headerName: " Type", flex: 1 },
    { field: "journal_name", headerName: "Journal Name", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "volume",
      headerName: "Volume",
      flex: 1,
    },
    {
      field: "issue_number",
      headerName: "Issue Number",
      flex: 1,
    },

    {
      field: "paper_title",
      headerName: "Paper Title",
      flex: 1,
    },
    {
      field: "page_number",
      headerName: "Paper Number",
      flex: 1,
    },
    {
      field: "issn",
      headerName: "ISSN",
      flex: 1,
    },
    {
      field: "issn_type",
      headerName: "ISSN Type",
      flex: 1,
    },

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
      headerName: "TimeLine",
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
      .get(`/api/employee/publicationDetailsBasedOnEmpId/${empId}`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/publicationsFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleIncentive = (params) => {
    navigate("/addon-incentive-application", {
      state: { empId: empId, tabName: "PUBLICATION", rowData: params.row },
    });
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
        title={"TimeLine"}
      >
        <Box p={1}>
          <Grid container>
            <Grid xs={12}>
              <Timeline>
                {timeLineData.map((obj,index)=>(
                  <TimelineItem>
                  <TimelineOppositeContent color="textSecondary">
                        <Typography>{obj.date}</Typography>
                        <Typography>{obj.type}</Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot>
                      <CheckCircleIcon color="success" />
                    </TimelineDot>
                    {index < timeLineData.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                  <Typography>Note - </Typography>
                  <Typography>Divya Kumari</Typography>
                  </TimelineContent>
                </TimelineItem>
                ))}
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
export default PublicationReport;
