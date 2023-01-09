import { useState, useEffect } from "react";
import GridIndex from "../../components/GridIndex";
import { Box, IconButton, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { convertToDMY } from "../../utils/DateTimeUtils";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import ModalWrapper from "../../components/ModalWrapper";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import CandidateDetails from "../../pages/forms/jobPortal/CandidateDetails";
import ResultReport from "../forms/jobPortal/ResultReport";
import axios from "../../services/Api";
import useAlert from "../../hooks/useAlert";

function JobPortalIndex() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [interviewData, setInterviewData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Job Portal" }]);
    getData();
  }, []);

  const columns = [
    {
      field: "reference_no",
      headerName: "Reference No",
      width: 120,
    },
    {
      field: "firstname",
      headerName: "Applicant",
      width: 220,
      renderCell: (params) => {
        return (
          <>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => handleDetails(params)}
            >
              {params.row.firstname}
            </Typography>
          </>
        );
      },
    },
    { field: "resume_headline", headerName: "Resume Headline", width: 130 },
    // {
    //   field: "key_skills",
    //   headerName: "Key Skills",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return params.row.key_skills && params.row.key_skills.length > 22
    //       ? params.row.key_skills.substr(0, 22) + "..."
    //       : params.row.key_skills;
    //   },
    // },
    { field: "graduation_short_name", headerName: "Education", flex: 1 },
    { field: "graduation", headerName: "Qualification", flex: 1 },
    {
      field: "interview_id",
      headerName: "Interview",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            {params.row.mail_sent_status === 1 &&
            params.row.mail_sent_to_candidate === 1 &&
            params.row.comment_status !== null ? (
              `${convertToDMY(params.row.frontend_use_datetime.slice(0, 10))}`
            ) : (params.row.comment_status === null ||
                params.row.comment_status === 0) &&
              params.row.mail_sent_status === 1 &&
              params.row.mail_sent_to_candidate === 1 ? (
              <IconButton
                onClick={() => navigate(`/Interview/new/${params.row.id}`)}
                color="primary"
              >
                <EventRepeatIcon fontSize="small" />
              </IconButton>
            ) : params.row.interview_id ? (
              <IconButton
                onClick={() => navigate(`/Interview/Update/${params.row.id}`)}
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => navigate(`/Interview/new/${params.row.id}`)}
                color="primary"
              >
                <AddBoxIcon fontSize="small" />
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
                onClick={() => handleResultReport(params)}
                color="primary"
              >
                <DescriptionOutlinedIcon fontSize="small" />
              </IconButton>
            ) : params.row.mail_sent_status === 1 &&
              params.row.mail_sent_to_candidate === 1 ? (
              <IconButton
                onClick={() => navigate(`/ResultForm/${params.row.id}`)}
                color="primary"
              >
                <AddBoxIcon fontSize="small" />
              </IconButton>
            ) : (
              <></>
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
                  <IconButton color="primary">
                    <DescriptionOutlinedIcon fontSize="small" />
                  </IconButton>
                </Link>
              ) : params.row.offer_id ? (
                <IconButton
                  onClick={() =>
                    navigate(
                      `/SalaryBreakupForm/${params.row.id}/${params.row.offer_id}`
                    )
                  }
                  color="primary"
                >
                  <AddBoxIcon fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() =>
                    navigate(`/SalaryBreakupForm/${params.row.id}`)
                  }
                  color="primary"
                >
                  <AddBoxIcon fontSize="small" />
                </IconButton>
              )
            ) : (
              <></>
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
                to={`/OfferLetterPrint/${params.row.id}/${params.row.offer_id}`}
                target="blank"
              >
                <IconButton color="primary">
                  <DescriptionOutlinedIcon fontSize="small" />
                </IconButton>
              </Link>
            ) : (
              <></>
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
            {params.row.mail === true ? (
              <IconButton
                onClick={() =>
                  navigate(`/OfferForm/${params.row.id}/${params.row.offer_id}`)
                }
                color="primary"
              >
                <DescriptionOutlinedIcon fontSize="small" />
              </IconButton>
            ) : params.row.offer_id ? (
              <IconButton
                onClick={() =>
                  navigate(`/OfferForm/${params.row.id}/${params.row.offer_id}`)
                }
                color="primary"
              >
                <AddBoxIcon fontSize="small" />
              </IconButton>
            ) : (
              ""
            )}
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
            {params.row.offerstatus ? (
              <IconButton
                onClick={() =>
                  navigate(
                    `/recruitment/${params.row.id}/${params.row.offer_id}`
                  )
                }
                color="primary"
              >
                <AddBoxIcon fontSize="small" />
              </IconButton>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];

  const getData = async () =>
    await axios
      .get(
        `/api/employee/fetchAllJobProfileDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));

  const handleDetails = async (params) => {
    await axios
      .get(`/api/employee/getAllApplicantDetails/${params.id}`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
          setModalOpen(true);
        } else {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong!!",
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: "Something went wrong!!",
        });
        setAlertOpen(true);
      });
  };

  const handleResultReport = async (params) => {
    await axios
      .get(`/api/employee/getAllInterviewerDeatils/${params.row.id}`)
      .then((res) => {
        setInterviewData(res.data.data);
      })
      .catch((err) => console.error(err));
    setResultModalOpen(true);
  };

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <CandidateDetails data={data} />
      </ModalWrapper>
      <ModalWrapper
        open={resultModalOpen}
        setOpen={setResultModalOpen}
        maxWidth={1000}
      >
        <ResultReport data={interviewData} />
      </ModalWrapper>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default JobPortalIndex;
