import { useState, useEffect } from "react";
import axios from "../../services/Api";
import useAlert from "../../hooks/useAlert";
import { Box, IconButton,Typography,Grid,Badge } from "@mui/material";
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
import CircleIcon from '@mui/icons-material/Circle';
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TimelineOppositeContent  from '@mui/lab/TimelineOppositeContent';
import moment from "moment";

const empId = sessionStorage.getItem("empId");

function ConferenceReport() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [timeLineList,setTimeLineList] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [isApprover,setIsApprover] = useState(false);
  const navigate = useNavigate();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState();

  const columns = [
    {
      field: "",
      headerName: "Application Status",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleIncentive(params)}
          disabled={(!!params.row?.status  && params.row?.approver_status !=null && params.row?.approver_status == false && params.row?.approved_status === null)}
          sx={{ padding: 0, color: "primary.main" }}
        >
          <PlaylistAddIcon sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
    { field: "conference_type", headerName: "Conference Type", flex: 1 },
    { field: "paper_type", headerName: "Paper Type", flex: 1},
    { field: "conference_name", headerName: "Conference Name", flex: 1 },
    { field: "paper_title", headerName: "Paper Title", flex: 1},
    { field: "place", headerName: "City", flex: 1},
    { field: "from_date", headerName: "From Date", flex: 1},
    { field: "to_date", headerName: "To Date", flex: 1},
    { field: "organiser", headerName: "Organizer", flex: 1},
    { field: "presentation_type", headerName: "Presentation Type", flex: 1},
    {
      field: "attachment_cert_path",
      type: "actions",
      flex: 1,
      headerName: "Certificate",
      getActions: (params) => [
        params.row.attachment_cert_path ? (
          <IconButton
            onClick={() => handleDownload(params.row.attachment_cert_path)}
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
      field: "attachment_paper_path",
      type: "actions",
      flex: 1,
      headerName: "Conference Paper",
      getActions: (params) => [
        params.row.attachment_paper_path ? (
          <IconButton
            onClick={() =>
              handleDownloadConferencePaper(params.row.attachment_paper_path)
            }
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
        <IconButton
        disabled={!params.row?.incentive_approver_id}
         onClick={() => handleFollowUp(params)} sx={{ padding: 0 }}>
          <NoteAddIcon
            fontSize="small"
            color={!!params.row?.incentive_approver_id ? "primary": "secondary"}
            sx={{ cursor: "pointer" }}
          />
        </IconButton>,
      ],
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        !(params.row?.status === null) && <div style={{textAlign:"center",marginLeft:"24px"}}>
        <Badge badgeContent= {(!!params.row?.status && (!!params.row?.approver_status || params.row?.approver_status===null) && params.row?.approved_status ===null) ? "In-progress" : (!!params.row?.status  && !params.row?.approver_status && params.row?.approved_status === null) ? "Rejected":(!!params.row?.status  && !!params.row?.approver_status && params.row?.approved_status == "All Approved") ? "Completed":""}
         color={(!!params.row?.status && (!!params.row?.approver_status || params.row?.approver_status===null) && params.row?.approved_status ===null) ? "secondary" : (!!params.row?.status  && !params.row?.approver_status && params.row?.approved_status === null) ? "error": (!!params.row?.status  && !!params.row?.approver_status && params.row?.approved_status == "All Approved") ? "success":""}>
        </Badge>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData(empId)
  }, []);


  const getData = async (empId) => {
      await axios
        .get(`api/employee/conferenceBasedOnEmpId?emp_id=${empId}`)
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((error) => {
          setAlertMessage({
            severity: "error",
            message: error.response
              ? error.response.data.message
              : "An error occured !!",
          });
          setAlertOpen(true);
        });
  };

  const handleDownloadConferencePaper = async (path) => {
    await axios
      .get(`/api/employee/conferenceFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/conferenceCertificateFileviews?fileName=${path}`, {
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
      state: {isApprover: false, tabName: "CONFERENCE", rowData: params.row ,urlName:"/AddonReport"},
    });
  };

  const handleFollowUp = async (params) => {
    try {
      setModalOpen(!modalOpen);
      if (!!params.row?.incentive_approver_id) {
        const res = await axios.get(
          `/api/employee/incentiveApproverBasedOnEmpId/${params.row?.emp_id}/${params.row?.incentive_approver_id}`
        );
        if (res?.status == 200 || res?.status == 201) {
          const timeLineLists = [
            {
              date: res.data.data[0]?.date,
              type: "Initiated By",
              note: res.data.data[0]?.remark,
              name: res.data.data[0]?.created_username,
              status: res.data.data[0]?.status,
            },
            {
              date: res.data.data[0]?.hod_date,
              type: "Head of Department",
              note: res.data.data[0]?.hod_remark,
              name: res.data.data[0]?.hod_name,
              status: res.data.data[0]?.hod_status,
            },
            {
              date: res.data.data[0]?.hoi_date,
              type: "Head of Institute",
              note: res.data.data[0]?.hoi_remark,
              name: res.data.data[0]?.hoi_name,
              status: res.data.data[0]?.hoi_status,
            },
            {
              date: res.data.data[0]?.asst_dir_date,
              type: "Assistant Director R & D",
              note: res.data.data[0]?.asst_dir_remark,
              name: res.data.data[0]?.asst_dir_name,
              status: res.data.data[0]?.asst_dir_status,
            },
            {
              date: res.data.data[0]?.qa_date,
              type: "Quality Assurance",
              note: res.data.data[0]?.qa_remark,
              name: res.data.data[0]?.qa_name,
              amount: res.data?.data[0]?.amount,
              status: res.data.data[0]?.qa_status,
            },
            {
              date: res.data.data[0]?.hr_date,
              type: "Human Resources",
              note: res.data.data[0]?.hr_remark,
              name: res.data.data[0]?.hr_name,
              status: res.data.data[0]?.hr_status,
            },
            {
              date: res.data.data[0]?.finance_date,
              type: "Finance",
              note: res.data.data[0]?.finance_remark,
              name: res.data.data[0]?.finance_name,
              status: res.data.data[0]?.finance_status,
            },
          ];
          setTimeLineList(timeLineLists);
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  return (
    <>
          <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={800}
        title={"TimeLine"}
      >
            <Box p={1}>
          <Grid container>
            <Grid xs={12}>
              <Timeline>
                {!!timeLineList.length &&
                  timeLineList.map((obj, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="textSecondary">
                        <Typography>
                          {!!obj.date ? moment(obj.date).format("lll") : ""}
                        </Typography>
                        <Typography sx={{ fontWeight: "500" }}>
                          {obj.name}
                        </Typography>
                        <Typography>{obj.type}</Typography>
                      </TimelineOppositeContent>
                      {!(obj.date && obj.status) && (
                        <TimelineSeparator>
                          <TimelineDot>
                            <CircleIcon color="error" />
                          </TimelineDot>
                          {index < timeLineList.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                      )}
                      {!!(obj.date && obj.status) && (
                        <TimelineSeparator>
                          <TimelineDot>
                            <CheckCircleIcon color="success" />
                          </TimelineDot>
                          {index < timeLineList.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                      )}
                      <TimelineContent>
                        <Typography>
                          <span style={{ fontWeight: "500" }}>Remark</span> :-{" "}
                          {obj.note}
                        </Typography>
                        {!!obj.amount && (
                          <Typography>
                            <span style={{ fontWeight: "500" }}>Amount</span> -{" "}
                            {obj.amount}
                          </Typography>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
              </Timeline>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>
      <Box
          sx={{
            position:"relative",
            marginTop: { xs: 10, md: 1 },
          }}
        >
          <Box sx={{ position: "absolute", width: "100%",  }}>
            <GridIndex rows={rows} columns={columns}
            columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel}/>
          </Box>
        </Box>
    </>
  );
}
export default ConferenceReport;
