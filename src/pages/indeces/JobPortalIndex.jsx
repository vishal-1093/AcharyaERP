import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
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
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import moment from "moment";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomSelect from "../../components/Inputs/CustomSelect";
import OverlayLoader from "../../components/OverlayLoader";
import { GenerateSalaryBreakup } from "../forms/jobPortal/GenerateSalaryBreakup";
import { GenerateOfferLetter } from "../forms/jobPortal/GenerateOfferLetter";
const CustomModal = lazy(() => import("../../components/CustomModal"));
import JobFormEdit from "../forms/jobPortal/JobFormEdit";

const GridIndex = lazy(() => import("../../components/GridIndex"));
const ModalWrapper = lazy(() => import("../../components/ModalWrapper"));
const ResultReport = lazy(() => import("../forms/jobPortal/ResultReport"));
const CandidateDetailsView = lazy(() =>
  import("../../components/CandidateDetailsView")
);
const HelpModal = lazy(() => import("../../components/HelpModal"));
const JobPortalDoc = lazy(() => import("../../docs/jobPortalDoc/JobPortalDoc"));

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
    textTransform: "capitalize",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

function JobPortalIndex() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [jobId, setJobId] = useState();
  const [interviewData, setInterviewData] = useState([]);
  const [hrStatusOpen, setHrStatusOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [descriptionHistory, setDescriptionHistory] = useState([]);
  const [jobProfileData, setJobProfileData] = useState([]);
  const [salaryBreakupLoading, setSalaryBreakupLoading] = useState(false);
  const [offerLetterLoading, setOfferLetterLoading] = useState(false);
  const [isOfferLetterModalOpen, setIsOfferLetterModalOpen] = useState(false);
  const [modalContentData, setModalContentData] = useState(modalContents);
  const [isEdit, setIsEdit] = useState(false);
  const [rowData, setRowData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser")).roleId;

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

  const handleDetails = async (data) => {
    setJobId(data.id);
    setModalOpen(true);
    setRowData(data);
  };

  const handleResultReport = async (params) => {
    await axios
      .get(`/api/employee/getAllInterviewerDeatils/${params.row.id}`)
      .then((res) => {
        setInterviewData(res.data.data);
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      });

    await axios
      .get(`/api/employee/getJobProfileById/${params.row.id}`)
      .then((res) => {
        setJobProfileData(res.data.data);
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      });
    setResultModalOpen(true);
  };

  const handleDescription = async (params) => {
    setJobId(params.row.id);
    setHrStatusOpen(true);
    setValues((prev) => ({
      ...prev,
      ["hrStatus"]: params.row.hr_status ?? "",
      ["description"]: params.row.hr_remark ?? "",
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

  const handleSalaryBreakup = async (offerId) => {
    setSalaryBreakupLoading(true);

    const getOfferData = await axios
      .get(`/api/employee/fetchAllOfferDetails/${offerId}`)
      .then((res) => res.data.data[0])
      .catch((err) => console.error(err));

    const getSalaryData = await axios
      .get(`/api/finance/getFormulaDetails/${getOfferData.salary_structure_id}`)
      .then((res) => {
        const earningTemp = [];
        const deductionTemp = [];
        const managementTemp = [];
        res.data.data
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .forEach((obj) => {
            const tempArray = {
              name: obj.voucher_head,
              monthly: Math.round(
                getOfferData[obj.salaryStructureHeadPrintName]
              ),
              yearly: Math.round(
                getOfferData[obj.salaryStructureHeadPrintName] * 12
              ),
            };

            if (
              obj.category_name_type === "Earning" &&
              tempArray.monthly !== 0
            ) {
              earningTemp.push(tempArray);
            } else if (
              obj.category_name_type === "Deduction" &&
              tempArray.monthly !== 0
            ) {
              deductionTemp.push(tempArray);
            } else if (
              obj.category_name_type === "Management" &&
              tempArray.monthly !== 0
            ) {
              managementTemp.push(tempArray);
            }
          });

        const temp = {};
        temp.earnings = earningTemp;
        temp.deductions = deductionTemp;
        temp.managment = managementTemp;

        let earningMonthlyAmt = 0;
        let earningYearlyAmt = 0;
        let deductMonthlyAmt = 0;
        let deductYearlyAmt = 0;
        let managementMonthlyAmt = 0;
        let managementYearlyAmt = 0;

        if (temp.earnings.length > 0) {
          const monthly = [];
          const yearly = [];
          temp.earnings.forEach((te) => {
            monthly.push(te.monthly);
            yearly.push(te.yearly);
          });
          earningMonthlyAmt = monthly.reduce((a, b) => a + b);
          earningYearlyAmt = yearly.reduce((a, b) => a + b);
        }

        if (temp.deductions.length > 0) {
          const monthly = [];
          const yearly = [];
          temp.deductions.forEach((te) => {
            monthly.push(te.monthly);
            yearly.push(te.yearly);
          });
          deductMonthlyAmt = monthly.reduce((a, b) => a + b);
          deductYearlyAmt = yearly.reduce((a, b) => a + b);
        }

        if (temp.managment.length > 0) {
          const monthly = [];
          const yearly = [];
          temp.managment.forEach((te) => {
            monthly.push(te.monthly);
            yearly.push(te.yearly);
          });
          managementMonthlyAmt = monthly.reduce((a, b) => a + b);
          managementYearlyAmt = yearly.reduce((a, b) => a + b);
        }

        temp.earningsMonthly = earningMonthlyAmt;
        temp.earningsYearly = earningYearlyAmt;
        temp.deductionsMonthly = deductMonthlyAmt;
        temp.deductionsYearly = deductYearlyAmt;
        temp.managmentMonthly = managementMonthlyAmt;
        temp.managmentYearly = managementYearlyAmt;
        temp.netMonthly = earningMonthlyAmt - deductMonthlyAmt;
        temp.netYearly = earningYearlyAmt - deductYearlyAmt;
        temp.ctcMonthly = earningMonthlyAmt + managementMonthlyAmt;
        temp.ctcYearly = earningYearlyAmt + managementYearlyAmt;

        return temp;
      });

    const blobFile = await GenerateSalaryBreakup(getOfferData, getSalaryData);
    window.open(URL.createObjectURL(blobFile));
    setSalaryBreakupLoading(false);
  };


  const handleOfferLetter = (jobId, offerId, orgType) => {
    setOfferLetterModalOpen();
    setModalContent("", "Do you want to print on physical letter head?", [
      { name: "Yes", color: "primary", func: () => printOfferLetter(jobId, offerId, orgType,true) },
      { name: "No", color: "primary", func: () => printOfferLetter(jobId, offerId, orgType,false) },
    ]);
  };

  const setOfferLetterModalOpen = () => {
    setIsOfferLetterModalOpen(!isOfferLetterModalOpen)
  };

  const setModalContent = (title, message, buttons) => {
    setModalContentData({ title: title, message: message, buttons: buttons });
  };

  const printOfferLetter = async (jobId, offerId, orgType,status) => {
    try {
      setOfferLetterLoading(true);

      const offerResponse = await axios.get(
        `/api/employee/fetchAllOfferDetails/${offerId}`
      );
      const getOfferData = offerResponse.data.data[0];

      const empResponse = await axios.get(
        `/api/employee/getJobProfileNameAndEmail/${jobId}`
      );
      const getEmpData = empResponse.data;

      if (getEmpData) {
        getEmpData.firstname =
          getEmpData.gender === "M"
            ? `Mr. ${getEmpData.firstname}`
            : getEmpData.gender === "F"
            ? `Ms. ${getEmpData.firstname}`
            : getEmpData.firstname;
      }

      const blobFile = await GenerateOfferLetter(
        getOfferData,
        getEmpData,
        orgType,
        status
      );

      if (blobFile) {
        window.open(URL.createObjectURL(blobFile));
      } else {
        setAlertMessage({
          severity: "error",
          message: "Failed to generate the offer letter !!",
        });
        setAlertOpen(true);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";
      setAlertMessage({
        severity: "error",
        message: `An error occurred: ${errorMessage}`,
      });
      setAlertOpen(true);
    } finally {
      setOfferLetterLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEdit(true);
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
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.firstname.toLowerCase()}>
          <Typography
            variant="subtitle2"
            onClick={() => handleDetails(params.row)}
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
    { field: "resume_headline", headerName: "Resume Headline", flex: 1 },
    { field: "graduation_short_name", headerName: "Education", flex: 1 },
    { field: "graduation", headerName: "Qualification", flex: 1 },
    {
      field: "hrStatus",
      headerName: "HRS",
      flex: 1,
      renderCell: (params) =>
        params.row.hr_status === null ? (
          <IconButton
            onClick={() => handleDescription(params)}
            color="primary"
            sx={{ padding: 0 }}
          >
            <AddBoxIcon />
          </IconButton>
        ) : (
          <HtmlTooltip
            title={`HR Status : ${params.row.hr_status}  Description : ${params.row.hr_remark} `}
          >
            <IconButton
              label="Result"
              onClick={() => handleDescription(params)}
              sx={{
                color:
                  params.row.hr_status === "Qualified" ||
                  params.row.hr_status === "Shortlisted" ||
                  params.row.hr_status === "On Hold"
                    ? "green"
                    : "red",
                padding: 0,
              }}
            >
              <CheckCircleIcon />
            </IconButton>
          </HtmlTooltip>
        ),
    },
    {
      field: "hr_status",
      headerName: "HR Status",
      flex: 1,
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
                moment(params.row.frontend_use_datetime).format("DD-MM-YYYY")
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
                sx={{ padding: 0 }}
              >
                <EventRepeatIcon />
              </IconButton>
            ) : params.row.interview_id ? (
              <IconButton
                onClick={() => navigate(`/Interview/Update/${params.row.id}`)}
                color="primary"
                sx={{ padding: 0 }}
              >
                <EditIcon />
              </IconButton>
            ) : params.row.hr_status === "Shortlisted" ? (
              <IconButton
                onClick={() => navigate(`/Interview/new/${params.row.id}`)}
                color="primary"
                sx={{ padding: 0 }}
              >
                <AddBoxIcon />
              </IconButton>
            ) : (
              <></>
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
                sx={{ padding: 0 }}
              >
                <DescriptionOutlinedIcon />
              </IconButton>
            ) : params.row.interview_date !== null &&
              params.row.interview_id !== null ? (
              <IconButton
                onClick={() => navigate(`/ResultForm/${params.row.id}`)}
                color="primary"
                sx={{ padding: 0 }}
              >
                <AddBoxIcon />
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
      renderCell: (params) =>
        params.row.ctc_status === 2 ? (
          params.row.consolidated_amount
        ) : params.row.ctc_status === 1 ? (
          <>
            {roleId === 1 && params.row.offerstatus !== true ? (
              <IconButton
                onClick={() =>
                  navigate(
                    `/SalaryBreakupForm/Update/${params.row.id}/${params.row.offer_id}`
                  )
                }
                color="primary"
                sx={{ padding: 0 }}
              >
                <EditIcon />
              </IconButton>
            ) : (
              <></>
            )}

            <IconButton
              color="primary"
              onClick={() => handleSalaryBreakup(params.row.offer_id)}
              sx={{ padding: 0 }}
            >
              <DescriptionOutlinedIcon />
            </IconButton>
          </>
        ) : params.row.approve === true ? (
          <IconButton
            onClick={() => navigate(`/SalaryBreakupForm/New/${params.row.id}`)}
            color="primary"
            sx={{ padding: 0 }}
          >
            <AddBoxIcon />
          </IconButton>
        ) : (
          <></>
        ),
    },
    {
      field: "ctc_status",
      headerName: "Offer Letter",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params.row.offer_id && params.row.ctc_status !== 2 ? (
              <IconButton
                color="primary"
                onClick={() =>
                  handleOfferLetter(
                    params.row.id,
                    params.row.offer_id,
                    params.row.org_type
                  )
                }
                sx={{ padding: 0 }}
              >
                <DescriptionOutlinedIcon />
              </IconButton>
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
                sx={{ padding: 0 }}
              >
                <DescriptionOutlinedIcon />
              </IconButton>
            ) : params.row.offer_id ? (
              <IconButton
                onClick={() =>
                  navigate(`/OfferForm/${params.row.id}/${params.row.offer_id}`)
                }
                color="primary"
                sx={{ padding: 0 }}
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
                sx={{ padding: 0 }}
              >
                <AddBoxIcon />
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
      {/* Help file */}
      <HelpModal>
        <JobPortalDoc />
      </HelpModal>

      {/* HR status  */}
      <ModalWrapper
        title="HR STATUS"
        maxWidth={1000}
        open={hrStatusOpen}
        setOpen={setHrStatusOpen}
      >
        <Grid container rowSpacing={2} columnSpacing={4} mt={1}>
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="hrStatus"
              label="Status"
              value={values.hrStatus}
              items={[
                { value: "Offer Declined", label: "Offer Declined" },
                { value: "Offer withdrawn", label: "Offer withdrawn" },
                { value: "No Position", label: "No Position" },
                { value: "Shortlisted", label: "Shortlisted" },
                { value: "Rejected", label: "Rejected" },
                { value: "On Hold", label: "On Hold" },
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
              disabled={values.hrStatus === "" || values.description === ""}
            >
              Update
            </Button>
          </Grid>
          {descriptionHistory.length > 0 ? (
            <>
              <Grid item xs={12}>
                <Divider>
                  <Typography variant="subtitle2" color="textSecondary">
                    History
                  </Typography>
                </Divider>
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

      {/* Candidate Profile VIew  */}
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={1100}
        title={rowData?.firstname}
      >
        {isEdit ? (
          <JobFormEdit id={jobId} setIsEdit={setIsEdit} />
        ) : (
          <Grid container rowSpacing={2}>
            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                size="small"
                onClick={handleEdit}
                endIcon={<EditIcon sx={{ fontSize: 4 }} />}
              >
                Edit
              </Button>
            </Grid>
            <Grid item xs={12}>
              <CandidateDetailsView id={jobId} />
            </Grid>
          </Grid>
        )}
      </ModalWrapper>

      {/* Result  */}
      <ModalWrapper
        open={resultModalOpen}
        setOpen={setResultModalOpen}
        maxWidth={1000}
      >
        <ResultReport data={interviewData} jobData={jobProfileData} />
      </ModalWrapper>

      {/* Salary Breakup Loader  */}
      {salaryBreakupLoading ? <OverlayLoader /> : <></>}

      {/* Offer Letter Loader  */}
      {offerLetterLoading ? <OverlayLoader /> : <></>}

      {/* Index  */}
      <GridIndex rows={rows} columns={columns} />

      {/* letter head print confrmation */}
      {!!isOfferLetterModalOpen && (
        <CustomModal
          open={isOfferLetterModalOpen}
          setOpen={setOfferLetterModalOpen}
          title={modalContentData.title}
          message={modalContentData.message}
          buttons={modalContentData.buttons}
        />
      )}
    </Box>
  );
}

export default JobPortalIndex;
