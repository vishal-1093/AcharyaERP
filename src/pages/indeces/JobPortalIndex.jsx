import { useState, useEffect } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  Button,
  TableCell,
  tableCellClasses,
  TableRow,
  Table,
  TableHead,
  styled,
  Tooltip,
  tooltipClasses,
  TableContainer,
  TableBody,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { HighlightOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { convertToDMY } from "../../utils/DateTimeUtils";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import ModalWrapper from "../../components/ModalWrapper";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ResultReport from "../forms/jobPortal/ResultReport";
import CandidateDetailsView from "../../components/CandidateDetailsView";
import HelpModal from "../../components/HelpModal";
import JobPortalDoc from "../../docs/jobPortalDoc/JobPortalDoc";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomSelect from "../../components/Inputs/CustomSelect";
import useAlert from "../../hooks/useAlert";
import moment from "moment";

const initialValues = {
  hrStatus: "",
  description: "",
};

const requiredFields = ["description"];

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#5A5A5A",
    maxWidth: 200,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function JobPortalIndex() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [jobId, setJobId] = useState();
  const [interviewData, setInterviewData] = useState([]);
  const [hrStatusOpen, setHrStatusOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [descriptionHistory, setDescriptionHistory] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const roleId = JSON.parse(localStorage.getItem("AcharyaErpUser")).roleId;

  useEffect(() => {
    setCrumbs([{ name: "Job Portal" }]);
    getData();
  }, []);

  const checks = {
    description: [
      values.description !== "",
      /^(.|\n){1,200}$/.test(values.description),
    ],
  };

  const errorMessages = {
    description: ["This field is required", "Enter only 200 characters"],
  };

  const getData = async () =>
    await axios
      .get(
        `/api/employee/fetchAllJobProfileDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));

  const handleDetails = async (params) => {
    setJobId(params.row.id);
    setModalOpen(true);
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

  const handleDescription = async (params) => {
    setJobId(params.row.id);
    setHrStatusOpen(true);
    setValues((prev) => ({
      ...prev,
      ["hrStatus"]: params.row.hr_status,
      ["description"]: params.row.hr_remark,
    }));

    await axios
      .get(`/api/employee/getJobprofileDetails/${params.row.id}`)
      .then((res) => {
        setDescriptionHistory(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleUpdateHrStatus = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Description is a mandatory field",
      });
      setAlertOpen(false);
    } else {
      await axios
        .put(
          `/api/employee/updateJobProfileHrStatus/${jobId}?hr_status=${values.hrStatus}&hr_remark=${values.description}`
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({ severity: "success", message: "Status Updated" });
            setAlertOpen(true);
            setHrStatusOpen(false);

            getData();
          } else {
            setAlertMessage({ severity: "error", message: "Error Occured" });
            setAlertOpen(true);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response ? err.respons.data.message : "Error Occured",
          });
          setAlertOpen(true);
        });

      const temp = {};
      temp.active = true;
      temp.job_id = jobId;
      temp.hr_status = values.hrStatus;
      temp.hr_remark = values.description;

      await axios
        .post(`/api/employee/hrStatusHistory`, temp)
        .then((res) => {})
        .catch((err) => console.error(err));
    }
  };

  const columns = [
    {
      field: "reference_no",
      headerName: "Reference No",
      flex: 1,
    },
    {
      field: "firstname",
      headerName: "Applicant",
      width: 220,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.firstname.toLowerCase()}>
          <Typography
            variant="subtitle2"
            onClick={() => handleDetails(params)}
            sx={{
              color: "primary.main",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {params.row.firstname.toLowerCase()}
          </Typography>
        </HtmlTooltip>
      ),
    },
    { field: "job_type", headerName: "Resume Headline", flex: 1 },
    { field: "graduation_short_name", headerName: "Education", flex: 1 },
    { field: "graduation", headerName: "Qualification", flex: 1 },
    {
      field: "hrStatus",
      headerName: "HRS",
      flex: 1,
      renderCell: (params) =>
        params.row.hr_status === null ? (
          <IconButton onClick={() => handleDescription(params)} color="primary">
            <AddBoxIcon fontSize="small" />
          </IconButton>
        ) : params.row.hr_status === "Qualified" ||
          params.row.hr_status === "Shortlisted" ||
          params.row.hr_status === "Under Process" ? (
          <HtmlTooltip
            title={`HR Status : ${params.row.hr_status}  Description : ${params.row.hr_remark} `}
          >
            <IconButton
              label="Result"
              style={{ color: "green" }}
              onClick={() => handleDescription(params)}
            >
              <CheckCircleIcon />
            </IconButton>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip
            title={`HR Status : ${params.row.hr_status}  Description : ${params.row.hr_remark} `}
          >
            <IconButton
              label="Result"
              style={{ color: "red" }}
              onClick={() => handleDescription(params)}
            >
              <HighlightOff />
            </IconButton>
          </HtmlTooltip>
        ),
    },

    {
      field: "hr_status",
      headerName: "HR Status",
      width: 130,
      hide: true,
      getActions: (params) => [
        <>
          {params.row.hr_status === null ? (
            <IconButton
              onClick={() => handleDescription(params)}
              color="primary"
            >
              <AddBoxIcon fontSize="small" />
            </IconButton>
          ) : (
            <HtmlTooltip
              title={`HR Status : ${params.row.hr_status}  Description : ${params.row.hr_remark} `}
            >
              <Typography
                variant="subtitle2"
                color={
                  params.row.hr_status === "Qualified" ||
                  params.row.hr_status === "Shortlisted" ||
                  params.row.hr_status === "Under Process"
                    ? "green"
                    : "red"
                }
                sx={{ cursor: "pointer" }}
                onClick={() => handleDescription(params)}
              >
                {params.row.hr_status}
              </Typography>
            </HtmlTooltip>
          )}
        </>,
      ],
    },
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
              params.row.frontend_use_datetime ? (
                `${convertToDMY(params.row.frontend_use_datetime.slice(0, 10))}`
              ) : (
                ""
              )
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
            ) : params.row.interview_date !== null &&
              params.row.interview_id !== null ? (
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
            {params.row.offer_id ? (
              params.row.ctc_status === 2 ? (
                roleId === 1 && params.row.offerstatus !== true ? (
                  <IconButton
                    onClick={() =>
                      navigate(
                        `/SalaryBreakupForm/Update/${params.row.id}/${params.row.offer_id}`
                      )
                    }
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                ) : (
                  params.row.consolidated_amount
                )
              ) : roleId === 1 && params.row.offerstatus !== true ? (
                <IconButton
                  onClick={() =>
                    navigate(
                      `/SalaryBreakupForm/Update/${params.row.id}/${params.row.offer_id}`
                    )
                  }
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <Link
                  to={`/SalaryBreakupPrint/${params.row.id}/${params.row.offer_id}`}
                  target="blank"
                >
                  <IconButton color="primary">
                    <DescriptionOutlinedIcon fontSize="small" />
                  </IconButton>
                </Link>
              )
            ) : params.row.approve === true ? (
              <IconButton
                onClick={() =>
                  navigate(`/SalaryBreakupForm/New/${params.row.id}`)
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
            {params.row.offerstatus === true ? (
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

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <HelpModal>
        <JobPortalDoc />
      </HelpModal>

      <ModalWrapper
        title="HR STATUS"
        maxWidth={1000}
        open={hrStatusOpen}
        setOpen={setHrStatusOpen}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={4}
        >
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="hrStatus"
              label="Status"
              value={values.hrStatus}
              items={[
                { value: "Qualified", label: "Qualified" },
                { value: "Not Qualified", label: "Not Qualified" },
                { value: "No Position", label: "No Position" },
                { value: "Shortlisted", label: "Shortlisted" },
                { value: "Rejected", label: "Rejected" },
                { value: "Under Process", label: "Under Process" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <CustomTextField
              multiline
              rows={4}
              name="description"
              label="Comment"
              value={values.description}
              handleChange={handleChange}
              checks={checks.description}
              errors={errorMessages.description}
              required
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={handleUpdateHrStatus}
              disabled={values.description === ""}
            >
              Update
            </Button>
          </Grid>
          {descriptionHistory.length > 0 ? (
            <>
              <Grid item xs={12}>
                <Typography variant="h5" color="primary">
                  History
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell sx={{ width: 100 }}>
                          HR Status
                        </StyledTableCell>
                        <StyledTableCell sx={{ width: 100 }}>
                          Comment
                        </StyledTableCell>
                        <StyledTableCell sx={{ width: 100 }}>
                          Created By
                        </StyledTableCell>
                        <StyledTableCell sx={{ width: 100 }}>
                          Created Date
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {descriptionHistory.map((obj, i) => {
                        return (
                          <StyledTableRow key={i}>
                            <StyledTableCell>
                              {obj.hr_status_jp}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.hr_remark_jp}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.created_username}
                            </StyledTableCell>
                            <StyledTableCell>
                              {moment(obj.created_date).format("DD-MM-YYYY")}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
      </ModalWrapper>

      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1000}>
        <CandidateDetailsView id={jobId} />
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
