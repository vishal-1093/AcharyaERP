import { useState, useEffect } from "react";
import GridIndex from "../../components/GridIndex";
import { Box, IconButton, Typography, Grid, Button } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ModalWrapper from "../../components/ModalWrapper";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";
import axios from "../../services/Api";
import CandidateDetailsView from "../../components/CandidateDetailsView";

const initValues = { comments: "" };

function HodComments() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [values, setValues] = useState(initValues);
  const [jobId, setJobId] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const userId = JSON.parse(localStorage.getItem("AcharyaErpUser")).userId;
  const userName = JSON.parse(localStorage.getItem("AcharyaErpUser")).userName;

  useEffect(() => {
    setCrumbs([{ name: "Job Profile" }]);
    getData();
  }, []);

  const columns = [
    { field: "reference_no", headerName: "Reference No", flex: 1 },
    {
      field: "firstname",
      headerName: "Applicant",
      width: 200,
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
    { field: "resume_headline", headerName: "Resume Headline", flex: 1 },
    {
      field: "key_skills",
      headerName: "Key Skills",
      flex: 1,
      renderCell: (params) => {
        return params.row.key_skills.length > 22
          ? params.row.key_skills.substr(0, 22) + "..."
          : params.row.key_skills;
      },
    },
    { field: "graduation_short_name", headerName: "Education", flex: 1 },
    { field: "graduation", headerName: "Qualification", flex: 1 },
    {
      field: "comments",
      headerName: "Comment",
      flex: 1,

      renderCell: (params) => {
        return (
          <IconButton
            style={{ color: "#4A57A9", textAlign: "center" }}
            onClick={() => handleComments(params)}
          >
            <ChatBubbleOutlinedIcon />
          </IconButton>
        );
      },
    },
  ];
  const getData = async () =>
    await axios
      .get(`/api/employee/jobProfileDetailsOnUserId/${userId}`)
      .then((res) => {
        setRows(res.data.data);
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
    setValues((prev) => ({
      ...prev,
      comments: "",
    }));
    await axios
      .get(`/api/employee/getAllInterviewerDeatils/${params.row.id}`)
      .then((res) => {
        const data = res.data.data.filter(
          (a) => a.interviewer_name.toLowerCase() === userName.toLowerCase()
        );

        if (data.length > 0) {
          setValues({ ...values, comments: data[0]["interviewer_comments"] });
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
        maxWidth={750}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={3}
          mt={0}
        >
          <Grid item xs={12}>
            <CustomTextField
              name="comments"
              label="Comments"
              value={values.comments}
              multiline
              rows={4}
              inputProps={{ maxLength: 300 }}
              handleChange={handleChange}
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
