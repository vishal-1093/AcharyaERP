import { useState, useEffect } from "react";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { convertToDMY } from "../../../utils/DateTimeUtils";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import ModalWrapper from "../../../components/ModalWrapper";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import CandidateDetails from "../../../pages/forms/jobPortal/CandidateDetails";

const JobPortal = () => {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const columns = [
    { field: "reference_no", headerName: "Reference No", flex: 1 },
    {
      field: "firstname",
      headerName: "Applicant",
      width: 200,
      renderCell: (params) => {
        return (
          <>
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
          </>
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
      field: "interview_id",
      headerName: "Interview",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            {params.row.approve ||
            params.row.approve === false ||
            params.row.comment_status === 1 ? (
              params.row.frontend_use_datetime ? (
                `${convertToDMY(params.row.frontend_use_datetime.slice(0, 10))}`
              ) : (
                ""
              )
            ) : params.row.interview_id &&
              (params.row.mail_sent_status === null ||
                params.row.mail_sent_status === 0 ||
                params.row.mail_sent_to_candidate === 0) ? (
              <IconButton
                onClick={() => navigate(`/Interview/Update/${params.row.id}`)}
                style={{ color: "#4A57A9", textAlign: "center" }}
              >
                <EditIcon />
              </IconButton>
            ) : (params.row.comment_status === null ||
                params.row.comment_status === 0) &&
              params.row.mail_sent_status === 1 &&
              params.row.mail_sent_to_candidate === 1 ? (
              <IconButton
                onClick={() => navigate(`/Interview/new/${params.row.id}`)}
                style={{ color: "#4A57A9", textAlign: "center" }}
              >
                <EventRepeatIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => navigate(`/Interview/new/${params.row.id}`)}
                style={{ color: "#4A57A9", textAlign: "center" }}
              >
                <AddBoxIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
    {
      field: "mail",
      headerName: "Result",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            {params.row.approve || params.row.approve === false ? (
              <IconButton
                onClick={() => navigate(`/InterviewDetails/${params.row.id}`)}
                style={{ color: "#4A57A9", textAlign: "center" }}
              >
                <VisibilityIcon />
              </IconButton>
            ) : params.row.interview_id ? (
              <IconButton
                onClick={() => navigate(`/Result/${params.row.id}`)}
                style={{ color: "#4A57A9", textAlign: "center" }}
              >
                <AddBoxIcon />
              </IconButton>
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      field: "offer_id",
      headerName: "Salary Breakup",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            {params.row.approve === true ? (
              params.row.ctc_status ? (
                <Link
                  to={`/SalaryBreakupPrint/${params.row.id}/${params.row.offer_id}`}
                  target="blank"
                >
                  <IconButton style={{ color: "#4A57A9", textAlign: "center" }}>
                    <DescriptionOutlinedIcon />
                  </IconButton>
                </Link>
              ) : params.row.offer_id ? (
                <IconButton
                  onClick={() =>
                    navigate(
                      `/SalaryBreakup/${params.row.id}/${params.row.offer_id}`
                    )
                  }
                  style={{ color: "#4A57A9", textAlign: "center" }}
                >
                  <AddBoxIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => navigate(`/SalaryBreakup/${params.row.id}}`)}
                  style={{ color: "#4A57A9", textAlign: "center" }}
                >
                  <AddBoxIcon />
                </IconButton>
              )
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      field: "ctc_status",
      headerName: "Offer Letter",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            {params.row.offer_id ? (
              <Link
                to={`/offerLetterPrint/${params.row.id}/${params.row.offer_id}`}
                target="blank"
              >
                <IconButton style={{ color: "#4A57A9", textAlign: "center" }}>
                  <DescriptionOutlinedIcon />
                </IconButton>
              </Link>
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      field: "offerstatus",
      headerName: "Job Offer",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() =>
                navigate(`/offerform/${params.row.id}/${params.row.offer_id}`)
              }
              style={{ color: "#4A57A9", textAlign: "center" }}
            >
              <AddBoxIcon />
            </IconButton>
          </>
        );
      },
    },
    {
      field: "employee_status",
      headerName: "Recruitment",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() =>
                navigate(`/recruitment/${params.row.id}/${params.row.offer_id}`)
              }
              style={{ color: "#4A57A9", textAlign: "center" }}
            >
              <AddBoxIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const getData = async () =>
    await axios
      .get(
        `${ApiUrl}/employee/fetchAllJobProfileDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

  useEffect(() => {
    setCrumbs([{ name: "" }]);
    getData();
  }, []);

  const handleDetails = async (params) => {
    await axios
      .get(`${ApiUrl}/employee/getAllApplicantDetails/${params.id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setModalOpen(true);
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 4 }}>
        <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
          <CandidateDetails data={data} />
        </ModalWrapper>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
};

export default JobPortal;
