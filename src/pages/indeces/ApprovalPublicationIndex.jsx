import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, IconButton, Grid, Typography, Badge,Button } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useAlert from "../../hooks/useAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useNavigate } from "react-router-dom";
import ModalWrapperIncentive from "../../components/ModalWrapperIncentive";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import moment from "moment";

const empId = sessionStorage.getItem("empId");
const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;

function ApprovalPublicationIndex() {
  const [rows, setRows] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [timeLineList, setTimeLineList] = useState([]);
  const navigate = useNavigate();

  const marks = [
    {
      value: 10,
      label: '10',
    },
    {
      value: 20,
      label: '20',
    },
    {
      value: 30,
      label: '30',
    },
    {
      value: 40,
      label: '40',
    },
    {
      value: 60,
      label: '60',
    },
    {
      value: 80,
      label: '80',
    },
    {
      value: 100,
      label: '100',
    },
  ];

  const columns = [
    {
      field: "",
      headerName: "Application Status",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleIncentive(params)}
          disabled={(!!params.row?.status && params.row?.approver_status != null && params.row?.approver_status == false && params.row?.approved_status === null)}
          sx={{ padding: 0, color: "primary.main" }}
        >
          <PlaylistAddIcon sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 1,
    },
    {
      field: "employee_name",
      headerName: " Name",
      flex: 1,
    },
    {
      field: "dept_name_short",
      headerName: "Department",
      flex: 1,
    },
    {
      field: "experience",
      headerName: "Exp. at Acharya",
      flex: 1,
    },
    { field: "Type", headerName: " Type", flex: 1 },
    { field: "journal_name", headerName: "Journal Name", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      hide: true,
    },
    {
      field: "volume",
      headerName: "Volume",
      flex: 1,
      hide: true,
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
      hide: true,
    },
    {
      field: "issn",
      headerName: "ISSN",
      flex: 1,
      hide: true,
    },
    {
      field: "issn_type",
      headerName: "ISSN Type",
      flex: 1,
      hide: true,
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
        <IconButton
          onClick={() => handleFollowUp(params)} sx={{ padding: 0 }}>
          <NoteAddIcon
            fontSize="small"
            color={!!params.row?.incentive_approver_id ? "primary" : "secondary"}
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
        !(params.row?.status === null) && <div style={{ textAlign: "center", marginLeft: "24px" }}>
          <Badge badgeContent={(!!params.row?.status && (!!params.row?.approver_status || params.row?.approver_status === null) && params.row?.approved_status === null) ? "In-progress" : (!!params.row?.status && !params.row?.approver_status && params.row?.approved_status === null) ? "Rejected" : (!!params.row?.status && !!params.row?.approver_status && params.row?.approved_status == "All Approved") ? "Completed" : ""}
            color={(!!params.row?.status && (!!params.row?.approver_status || params.row?.approver_status === null) && params.row?.approved_status === null) ? "secondary" : (!!params.row?.status && !params.row?.approver_status && params.row?.approved_status === null) ? "error" : (!!params.row?.status && !!params.row?.approver_status && params.row?.approved_status == "All Approved") ? "success" : ""}>
          </Badge>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if(empId) getEmployeeNameForApprover(empId);
  }, []);

  const  valuetext =(value)=> {
    return `${value}%`;
  }

  const getEmployeeNameForApprover = async (empId) => {
    try {
      const res = await axios.get(
        `/api/employee/getEmpDetailsBasedOnApprover/${empId}`
      );
      if (res?.status == 200 || res?.status == 201) {
        getApproverName(
          empId,
          res.data.data?.map((ele) => ele.emp_id)?.join(",")
        );
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

  const getApproverName = async (empId, applicant_ids) => {
    try {
      const res = await axios.get(
        `/api/employee/getApproverDetailsData/${empId}`
      );
      if (res?.status == 200 || res?.status == 201) {
        const isApprover = res.data.data?.find((ele) => ele.emp_id == empId)
          ? true
          : false;
        getData(isApprover, applicant_ids);
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

  const getData = async (isApprover, applicant_ids) => {
    if (!!isApprover || roleId === 1) {
      await axios
        .get(
          `api/employee/fetchAllPublication?page=0&page_size=1000000&sort=created_date`
        )
        .then((res) => {
          setRows(res.data.data.Paginated_data.content?.filter((ele) => !!ele.status));
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
    } else {
      await axios
        .get(`/api/employee/publicationDetailsBasedOnEmpId/${applicant_ids}`)
        .then((res) => {
          setRows(res.data.data?.filter((ele) => !!ele.status));
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
    }
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
      state: {
        isApprover: true,
        tabName: "PUBLICATION",
        rowData: params.row,
        urlName: "/approve-incentive",
      },
    });
  };

  const handleFollowUp = async (params) => {
    try {
      setModalOpen(!modalOpen);
      let timeLineLists = [];
      const response = await axios.get(
        `/api/employee/getApproverDetailsData/${params.row?.emp_id}`
      );
      if (response?.status == 200 || response?.status == 201) {
        if (!!params.row?.incentive_approver_id) {
          const res = await axios.get(
            `/api/employee/incentiveApproverBasedOnEmpId/${params.row?.emp_id}/${params.row?.incentive_approver_id}`
          );
          if (res?.status == 200 || res?.status == 201) {
            if(response.data.data[0]?.hoiName === response.data.data[1]?.hodName){
             timeLineLists = [
                {
                  date: res.data.data[0]?.date,
                  type: "Initiated By",
                  note: res.data.data[0]?.remark,
                  name: res.data.data[0]?.created_username,
                  status: res.data.data[0]?.status,
                  weight:"10"
                },
                {
                  date: res.data.data[0]?.hod_date,
                  type: "Head of Department",
                  note: res.data.data[0]?.hod_remark,
                  name: res.data.data[0]?.hod_name,
                  status: res.data.data[0]?.hod_status,
                  weight:"20"
                },
                {
                  date: res.data.data[0]?.hod_date,
                  type: "Head of Institute",
                  note: res.data.data[0]?.hod_remark,
                  name: res.data.data[0]?.hod_name,
                  status: res.data.data[0]?.hod_status,
                  weight:"30"
                },
                {
                  date: res.data.data[0]?.asst_dir_date,
                  type: "Assistant Director R & D",
                  note: res.data.data[0]?.asst_dir_remark,
                  name: res.data.data[0]?.asst_dir_name,
                  status: res.data.data[0]?.asst_dir_status,
                  weight:"40"
                },
                {
                  date: res.data.data[0]?.qa_date,
                  type: "Quality Assurance",
                  note: res.data.data[0]?.qa_remark,
                  name: res.data.data[0]?.qa_name,
                  amount: res.data?.data[0]?.amount,
                  status: res.data.data[0]?.qa_status,
                  weight:"60"
                },
                {
                  date: res.data.data[0]?.hr_date,
                  type: "Human Resources",
                  note: res.data.data[0]?.hr_remark,
                  name: res.data.data[0]?.hr_name,
                  status: res.data.data[0]?.hr_status,
                  weight:"80"
                },
                {
                  date: res.data.data[0]?.finance_date,
                  type: "Finance",
                  note: res.data.data[0]?.finance_remark,
                  name: res.data.data[0]?.finance_name,
                  status: res.data.data[0]?.finance_status,
                  weight:"100"
                },
              ];
            }else {
            timeLineLists = [
                {
                  date: res.data.data[0]?.date,
                  type: "Initiated By",
                  note: res.data.data[0]?.remark,
                  name: res.data.data[0]?.created_username,
                  status: res.data.data[0]?.status,
                  weight:"10"
                },
                {
                  date: res.data.data[0]?.hod_date,
                  type: "Head of Department",
                  note: res.data.data[0]?.hod_remark,
                  name: res.data.data[0]?.hod_name,
                  status: res.data.data[0]?.hod_status,
                  weight:"20"
                },
                {
                  date: res.data.data[0]?.hoi_date,
                  type: "Head of Institute",
                  note: res.data.data[0]?.hoi_remark,
                  name: res.data.data[0]?.hoi_name,
                  status: res.data.data[0]?.hoi_status,
                  weight:"30"
                },
                {
                  date: res.data.data[0]?.asst_dir_date,
                  type: "Assistant Director R & D",
                  note: res.data.data[0]?.asst_dir_remark,
                  name: res.data.data[0]?.asst_dir_name,
                  status: res.data.data[0]?.asst_dir_status,
                  weight:"40"
                },
                {
                  date: res.data.data[0]?.qa_date,
                  type: "Quality Assurance",
                  note: res.data.data[0]?.qa_remark,
                  name: res.data.data[0]?.qa_name,
                  amount: res.data?.data[0]?.amount,
                  status: res.data.data[0]?.qa_status,
                  weight:"60"
                },
                {
                  date: res.data.data[0]?.hr_date,
                  type: "Human Resources",
                  note: res.data.data[0]?.hr_remark,
                  name: res.data.data[0]?.hr_name,
                  status: res.data.data[0]?.hr_status,
                  weight:"80"
                },
                {
                  date: res.data.data[0]?.finance_date,
                  type: "Finance",
                  note: res.data.data[0]?.finance_remark,
                  name: res.data.data[0]?.finance_name,
                  status: res.data.data[0]?.finance_status,
                  weight:"100"
                },
              ];
            }
   
            setTimeLineList(timeLineLists);
          }
      };
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
      <ModalWrapperIncentive
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={900}
        title={"Incentive TimeLine"}
      >
        <Box>
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
      </ModalWrapperIncentive>  
     <Box sx={{ position: "relative", mt: 2 }}>
        <Box
          sx={{
            marginTop: { xs: 8, md: 1 },
          }}
        >
          <GridIndex rows={rows} columns={columns} />
        </Box>
      </Box>
    </>
  );
}
export default ApprovalPublicationIndex;
