import { useState, useEffect } from "react";
import axios from "axios";
import ApiUrl from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { Box, IconButton, Typography, Grid, Button } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import CandidateDetails from "../../pages/forms/jobPortal/CandidateDetails";
import ModalWrapper from "../../components/ModalWrapper";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";

const initValues = { comments: "" };

const HodComments = () => {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [values, setValues] = useState(initValues);
  const [jobId, setJobId] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const userId = JSON.parse(localStorage.getItem("authenticate")).userId;
  const userName = JSON.parse(localStorage.getItem("authenticate")).username1;

  useEffect(() => {
    setCrumbs([]);
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
              component="span"
              sx={{ color: "primary.main", cursor: "pointer" }}
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
      .get(`${ApiUrl}/employee/jobProfileDetailsOnUserId/${userId}`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });

  const handleDetails = async (params) => {
    await axios
      .get(`${ApiUrl}/employee/getAllApplicantDetails/${params.id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
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
      .get(`${ApiUrl}/employee/getAllInterviewerDeatils/${params.row.id}`)
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
        `${ApiUrl}/employee/setInterviewerCommentsFromApp/${userId}/${jobId}/${values.comments}`
      )
      .then((res) => {
        setAlertMessage({
          severity: "success",
          message: "Comments received Successfully",
        });
        setAlertOpen(true);
        setCommentModalOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Box sx={{ position: "relative", mt: 4 }}>
      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <CandidateDetails data={data} />
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
};

export default HodComments;
