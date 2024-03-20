import { useState, useEffect } from "react";
import GridIndex from "../../components/GridIndex";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  Button,
  Tooltip,
  tooltipClasses,
  styled,
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ModalWrapper from "../../components/ModalWrapper";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";
import axios from "../../services/Api";
import CandidateDetailsView from "../../components/CandidateDetailsView";
import moment from "moment";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    borderRadius: 2,
    padding: 5,
  },
}));

const initValues = { comments: "" };

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 270,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

function HodComments() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [values, setValues] = useState(initValues);
  const [jobId, setJobId] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const classes = useStyles();

  const userId = JSON.parse(localStorage.getItem("AcharyaErpUser")).userId;
  const userName = JSON.parse(localStorage.getItem("AcharyaErpUser")).userName;

  useEffect(() => {
    setCrumbs([{ name: "Job Profile" }]);
    getData();
  }, []);

  const handleAlert = () => {
    setAlertMessage({
      severity: "error",
      message: "Dont have access to give comments",
    });
    setAlertOpen(true);
  };

  const date = moment(new Date()).format("YYYY-MM-DD");
  const currentDate = new Date(date);

  const columns = [
    { field: "reference_no", headerName: "Reference No", flex: 1 },
    {
      field: "firstname",
      headerName: "Applicant",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => handleDetails(params)}
            >
              {params.row.firstname}
            </Typography>
            <Typography variant="body2">{params.row.email}</Typography>
          </Box>
        );
      },
    },
    {
      field: "resume_headline",
      headerName: "Resume Headline",
      flex: 1,
      renderCell: (params) => {
        return params.row.resume_headline.length > 22 ? (
          <HtmlTooltip title={params.row.resume_headline}>
            <span>{params.row.resume_headline.substr(0, 22) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.resume_headline
        );
      },
    },
    {
      field: "key_skills",
      headerName: "Key Skills",
      flex: 1,
      renderCell: (params) => {
        return params.row.key_skills.length > 22 ? (
          <HtmlTooltip title={params.row.key_skills}>
            <span>{params.row.key_skills.substr(0, 22) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.key_skills
        );
      },
    },
    {
      field: "interview_date",
      headerName: "Interview Date",
      valueGetter: (params) => params?.row?.interview_date.split(",")[0],
    },

    {
      field: "comments",
      headerName: "Comment",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        currentDate >=
        new Date(params?.row.only_date.split("-").reverse().join("-")) ? (
          <IconButton
            style={{ color: "#4A57A9", textAlign: "center" }}
            onClick={() => handleComments(params)}
          >
            <ChatBubbleOutlinedIcon />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "#4A57A9", textAlign: "center" }}
            onClick={() => handleAlert(params)}
          >
            <ChatBubbleOutlinedIcon />
          </IconButton>
        ),
      ],
    },
  ];
  const getData = async () =>
    await axios
      .get(`/api/employee/jobProfileDetailsOnUserId/${userId}`)
      .then((res) => {
        setRows(res.data.data.reverse());
      })
      .catch((err) => console.error(err));

  const handleDetails = async (params) => {
    setJobId(params.row.id);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleComments = async (params) => {
    setJobId(params.row.id);

    await axios
      .get(`/api/employee/getAllInterviewerDeatils/${params.row.id}`)
      .then((res) => {
        const data = res.data.data.filter(
          (a) => a.username.toLowerCase() === userName.toLowerCase()
        );

        if (data.length > 0) {
          setValues((prev) => ({
            ...prev,
            ["comments"]: res.data.data[0].interviewer_comments,
            ["email"]: res.data.data[0].email,
            ["interviewer_comments"]: res.data.data[0].interviewer_comments,
          }));
        }
      })
      .catch((err) => console.error(err));
    setCommentModalOpen(true);
  };

  const handleCreate = async () => {
    await axios
      .put(
        `/api/employee/setInterviewerCommentsFromApp/${userId}/${jobId}/${values.comments}`
      )
      .then((res) => {
        setAlertMessage({
          severity: "success",
          message: "Comments received Successfully",
        });
        setAlertOpen(true);
        setCommentModalOpen(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <CandidateDetailsView id={jobId} />
      </ModalWrapper>
      <ModalWrapper
        open={commentModalOpen}
        setOpen={setCommentModalOpen}
        maxWidth={500}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          rowSpacing={2}
          mt={0}
        >
          <Grid item xs={12}>
            <Typography className={classes.bg}>{values.email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              name="comments"
              label="Comments"
              value={values.comments}
              multiline
              rows={4}
              inputProps={{ maxLength: 300 }}
              handleChange={handleChange}
              disabled={values.interviewer_comments !== null}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleCreate}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default HodComments;
