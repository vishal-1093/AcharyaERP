import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Grid,
  CircularProgress,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Check, HighlightOff } from "@mui/icons-material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomModal from "../../../components/CustomModal";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import { useDownloadExcel } from "react-export-table-to-excel";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import ApproveTemplate from "../../../pages/forms/feetemplateMaster/ApproveTemplate";
import AddIcon from "@mui/icons-material/Add";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
  approved: {
    background: "#c8e6c9 !important",
  },
}));

const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const maxLength = 300;

function FeetemplateApprovalIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [data, setData] = useState({
    acYearId: null,
    schoolId: null,
    categoryId: null,
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const [feetemplateId, setFeetemplateId] = useState(null);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState();
  const [loading, setLoading] = useState(false);
  const [studentListOpen, setStudentListOpen] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [feetemplateName, setFeetemplateName] = useState([]);
  const [acYearOptions, setAcyearOptions] = useState([]);
  const [approveTemplateOpen, setApproveTemplateOpen] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [remark, setRemark] = useState([
    { remarks: "", status: false },
    { remarks: "", status: false },
  ]);
  const [remarksOpen, setRemarksOpen] = useState(false);
  const [remarksResponse, setRemarksResponse] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();
  const classes = useStyles();
  const tableRef = useRef(null);
  const setCrumbs = useBreadcrumbs();

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    fileName: "Student List",
    sheet: "Student List",
  });

  const handleChangeAcYearId = (name, newValue) => {
    setData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleApprove = async (params) => {
    setApproveTemplateOpen(true);
    setFeetemplateId(params.row.id);
  };

  const getRemainingCharacters = (field, index) =>
    maxLength - remark[index][field].length;

  const getRowClassName = (params) => {
    if (params.row.approved_status) {
      return classes.approved;
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "fee_template_name", headerName: " Name", flex: 1 },
    { field: "ac_year", headerName: " AC Year", flex: 1, hide: true },
    { field: "school_name_short", headerName: "School", flex: 1, hide: true },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "program_specialization",
      headerName: "Specialization",
      flex: 1,
    },
    { field: "program_type_name", headerName: "Term" },
    {
      field: "fee_admission_category_short_name",
      headerName: "Category",
      hide: true,
    },
    {
      field: "fee_admission_sub_category_short_name",
      headerName: "Sub-Category",
    },
    {
      field: "currency_type_name",
      headerName: "Currency",
      flex: 1,
      hide: true,
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
      hide: true,
    },
    {
      field: "countOfStudent",
      headerName: "STD-List",
      renderCell: (params) => {
        return params.row.countOfStudent !== 0 ? (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              component="span"
              color="primary.main"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setStudentListOpen(true);
                getStudentList(params);
              }}
            >
              {params.row.countOfStudent}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              component="span"
              color="primary.main"
              sx={{ cursor: "pointer" }}
            >
              {params.row.countOfStudent}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "view",
      type: "actions",
      flex: 1,
      headerName: "Template",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/Feetemplate/Multiple/Pdf`, {
              state: { templateIds: [params.row.id], status: false },
            })
          }
          color="primary"
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>,
      ],
    },
    {
      field: "upload",
      headerName: "Attachment",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params.row.fee_template_path === null ? (
          <IconButton onClick={() => handleUpload(params)} color="primary">
            <CloudUploadOutlinedIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            onClick={() =>
              navigate(`/FeetemplateAttachmentView/${params.row.id}`, {
                state: { approverScreen: true },
              })
            }
            color="primary"
          >
            <CloudDownloadIcon fontSize="small" />
          </IconButton>
        ),
      ],
    },

    {
      field: "remarks",
      headerName: "Add-On Note",
      type: "actions",
      getActions: (params) => [
        <>
          <IconButton color="primary" onClick={() => handleRemarks(params)}>
            <AddIcon />
          </IconButton>
        </>,
      ],
    },

    {
      field: "history",
      type: "actions",
      flex: 1,
      headerName: "History",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/FeetemplateSubAmountHistory/${params.row.id}`)
          }
          color="primary"
        >
          <HistoryIcon fontSize="small" />
        </IconButton>,
      ],
    },

    {
      field: "fee",
      headerName: "Template",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        (params.row.approved_status === null ||
          params.row.approved_status === false) &&
        roleShortName === "SAA" &&
        params.row.active === true ? (
          <IconButton
            onClick={() =>
              navigate(
                `/FeetemplateMaster/Feetemplate/Update/${params.row.id}`,
                { state: true }
              )
            }
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : (params.row.approved_status === null ||
            params.row.approved_status === false) &&
          roleShortName !== "SAA" &&
          params.row.countOfStudent === 0 &&
          params.row.active === true ? (
          <IconButton
            onClick={() =>
              navigate(
                `/FeetemplateMaster/Feetemplate/Update/${params.row.id}`,
                { state: true }
              )
            }
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : params.row.active === false ? (
          <IconButton color="primary">
            <EditOffIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton color="primary">
            <EditOffIcon fontSize="small" />
          </IconButton>
        ),
      ],
    },

    {
      field: "edit_fee",
      headerName: "Edit Fee",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        (params.row.approved_status === null ||
          params.row.approved_status === false) &&
        roleShortName === "SAA" &&
        params.row.active === true ? (
          <IconButton
            onClick={() =>
              navigate(
                `/FeetemplateApproval/${params.row.id}/${params.row.lat_year_sem}`
              )
            }
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : (params.row.approved_status === null ||
            params.row.approved_status === false) &&
          roleShortName !== "SAA" &&
          params.row.countOfStudent === 0 &&
          params.row.active === true ? (
          <IconButton
            onClick={() =>
              navigate(
                `/FeetemplateApproval/${params.row.id}/${params.row.lat_year_sem}`
              )
            }
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : params.row.active === false ? (
          <IconButton color="primary">
            <EditOffIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton color="primary">
            <EditOffIcon fontSize="small" />
          </IconButton>
        ),
      ],
    },
    {
      field: "approve_fee",
      headerName: "Approve Template",
      type: "actions",
      getActions: (params) => [
        params.row.approved_status ? (
          <IconButton color="primary">
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton color="primary" onClick={() => handleApprove(params)}>
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        ),
      ],
    },

    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff fontSize="small" />
          </IconButton>
        ),
      ],
    },
    {
      field: "edit",
      headerName: "Action",
      type: "actions",
      getActions: (params) => [
        params.row.approved_status && roleShortName === "SAA" ? (
          <IconButton
            onClick={() => handleEditSubamount(params)}
            color="primary"
          >
            <LockIcon fontSize="small" />
          </IconButton>
        ) : params.row.approved_status && params.row.countOfStudent === 0 ? (
          <IconButton
            onClick={() => handleEditSubamount(params)}
            color="primary"
          >
            <LockIcon fontSize="small" />
          </IconButton>
        ) : params.row.approved_status &&
          params.row.countOfStudent > 0 &&
          roleShortName !== "SAA" ? (
          <IconButton color="primary">
            <LockIcon fontSize="small" />
          </IconButton>
        ) : params.row.approved_status === false &&
          params.row.countOfStudent > 0 &&
          roleShortName !== "SAA" ? (
          <IconButton color="primary">
            <LockIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton color="primary">
            <LockOpenRoundedIcon fontSize="small" />
          </IconButton>
        ),
      ],
    },
  ];

  useEffect(() => {
    getAcYearData();

    setCrumbs([]);
  }, []);

  const getAcYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const optionData = [];
        const ids = [];
        res.data.data.forEach((obj) => {
          optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
          ids.push(obj.current_year);
        });
        const latestYear = Math.max(...ids);
        const latestYearId = res.data.data.filter(
          (obj) => obj.current_year === latestYear
        );
        setAcyearOptions(optionData);
        setData((prev) => ({
          ...prev,
          acYearId: latestYearId[0].ac_year_id,
        }));
      })
      .catch((error) => console.error(error));
  };

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name_short,
            school_name_short: obj.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getAdmissionCategory = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_type,
            school_name_short: obj.school_name_short,
          });
        });
        setCategoryOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
    getSchoolDetails();
    getAdmissionCategory();
  }, [data.acYearId, data.schoolId, data.categoryId]);

  const getStudentList = async (params) => {
    await axios
      .get(`/api/finance/FetchStudentDetailsByFeeTemplateId/${params.row.id}`)
      .then((res) => {
        setStudentList(res.data.data);
        setFeetemplateName(res.data.data[0].fee_template_name);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    let API_URL;
    if (
      data.acYearId !== null &&
      data.schoolId !== null &&
      data.categoryId !== null
    ) {
      API_URL = `&ac_year_id=${data.acYearId}&school_id=${data.schoolId}&fee_admission_category_id=${data.categoryId}`;
    } else if (data.acYearId !== null && data.schoolId !== null) {
      API_URL = `&ac_year_id=${data.acYearId}&school_id=${data.schoolId}`;
    } else if (data.acYearId !== null) {
      API_URL = `&ac_year_id=${data.acYearId}`;
    }

    await axios
      .get(
        `/api/finance/fetchFeeTemplateDetailByAcYearId?page=${0}&page_size=${10000}&sort=created_date${API_URL}`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleUpload = (params) => {
    setFeetemplateId(params.row.id);
    setModalUploadOpen(true);
  };

  const update = async () => {
    setLoading(true);
    const dataArray = new FormData();
    dataArray.append("file", fileUpload);
    dataArray.append("fee_template_id", feetemplateId);
    await axios
      .post(`/api/finance/FeeTemplateUploadFile`, dataArray)
      .then((res) => {
        setLoading(false);
        setAlertMessage({
          severity: "success",
          message: "File Uploaded",
        });
        setAlertOpen(true);
        if (pathname.toLowerCase() === "/feetemplateapprovalindex") {
          navigate("/FeetemplateApprovalIndex", { replace: true });
        } else {
          navigate("/FeetemplateMaster", { replace: true });
        }
        getData();
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };

  const handleEditSubamount = (params) => {
    const id = params.row.id;
    const handleTogg = async () => {
      if (params.row.approved_status === true) {
        await axios
          .delete(`/api/finance/activateApproveFeeTemplate/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    if (params.row.approved_status === true) {
      setModalContent({
        title: "",
        message: "Give permission to Edit?",
        buttons: [
          { name: "Yes", color: "primary", func: handleTogg },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
    }

    setConfirmModal(true);
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/finance/FeeTemplate/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/finance/activateFeeTemplate/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        });
    setConfirmModal(true);
  };

  const handleChangeRemarks = (e, index) => {
    if (e.target.value.length > 300) return;
    setRemark((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleRemarks = async (params) => {
    setFeetemplateId(params.row.id);
    setRemarksOpen(true);
    try {
      const response = await axios.get(
        `/api/finance/getFeeTemplateRemarksDetails/${params.row.id}`
      );

      const addStatus = response.data.data.map((obj) => ({
        ...obj,
        status: true,
      }));

      setRemarksResponse(addStatus);

      if (addStatus.length > 0 && addStatus.length === 1) {
        const staticData = {
          fee_template_remarks_id: null,
          fee_template_id: null,
          remarks: "",
          active: true,
        };

        const updatedJson = [...addStatus, staticData];

        setRemark(updatedJson);
      } else if (addStatus.length > 0) {
        setRemark(addStatus);
      } else {
        setRemark([
          { remarks: "", status: false },
          { remarks: "", status: false },
        ]);
      }
    } catch {
      setAlertMessage({ severity: "error", message: "Error Occured" });
      setAlertOpen(true);
    }
  };

  const handleSubmitRemarks = async () => {
    try {
      if (remarksResponse.length > 0) {
        const payload = [];

        remark.map((obj) => {
          payload.push({
            fee_template_remarks_id: obj.fee_template_remarks_id,
            fee_template_id: feetemplateId,
            remarks: obj.remarks,
            active: true,
          });
        });

        const putData = await axios.put(
          `/api/finance/updateFeeTemplateRemarks/${feetemplateId}`,
          payload
        );

        if (putData.status === 200 || putData.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Updated Successfully",
          });
          setAlertOpen(true);
          setRemarksOpen(false);
          getData();
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
          setAlertOpen(true);
        }
      } else {
        const payload = [];

        remark.map((obj) => {
          if (obj.remarks !== "") {
            payload.push({
              fee_template_id: feetemplateId,
              remarks: obj.remarks,
              active: true,
            });
          }
        });

        const postData = await axios.post(
          `/api/finance/saveFeeTemplateRemarks`,
          payload
        );

        if (postData.status === 200 || postData.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Created Successfully",
          });
          setAlertOpen(true);
          setRemarksOpen(false);
          getData();
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
          setAlertOpen(true);
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "success",
        message: error?.response?.data?.message,
      });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <CustomModal
        open={confirmModal}
        setOpen={setConfirmModal}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <ModalWrapper maxWidth={800} open={remarksOpen} setOpen={setRemarksOpen}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="error">
            {roleShortName !== "SAA"
              ? "NOTE : ONCE SUBMITTED IT CAN'T BE EDITED"
              : ""}
          </Typography>
        </Grid>
        {remark?.map((obj, i) => {
          return (
            <>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={2}
                justifyContent="flex-start"
                alignItems="center"
                marginTop={1}
              >
                <Grid item xs={12}>
                  <Card>
                    <CardHeader
                      title="ADD-ON NOTE"
                      sx={{
                        backgroundColor: "tableBg.main",
                        color: "black",
                        padding: 1,
                      }}
                    />
                    <CardContent>
                      <>
                        <Grid
                          container
                          justifyContent="flex-start"
                          alignItems="center"
                          rowSpacing={2}
                          columnSpacing={2}
                        >
                          <Grid item xs={12} md={12} key={i}>
                            <CustomTextField
                              name="remarks"
                              multiline
                              rows={2.4}
                              value={obj.remarks}
                              label="Add-On Note"
                              handleChange={(e) => handleChangeRemarks(e, i)}
                              disabled={roleShortName !== "SAA" && obj.status}
                              helperText={`Remaining characters : ${getRemainingCharacters(
                                "remarks",
                                i
                              )}`}
                            />
                          </Grid>
                        </Grid>
                      </>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          );
        })}

        <Grid item xs={12} align="right" mt={2}>
          <Button
            variant="contained"
            onClick={handleSubmitRemarks}
            sx={{ borderRadius: 2 }}
          >
            SUBMIT
          </Button>
        </Grid>
      </ModalWrapper>

      <ModalWrapper
        open={modalUploadOpen}
        setOpen={setModalUploadOpen}
        maxWidth={500}
        title="Upload File"
      >
        <Grid item xs={12} md={10}>
          <input
            type="file"
            onChange={(e) => setFileUpload(e.target.files[0])}
          />
        </Grid>

        <Grid item xs={12} textAlign="right">
          <Button
            variant="contained"
            size="small"
            style={{ borderRadius: 4 }}
            onClick={update}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong> Upload</strong>
            )}
          </Button>
        </Grid>
      </ModalWrapper>

      <ModalWrapper
        open={studentListOpen}
        setOpen={setStudentListOpen}
        title={feetemplateName ? feetemplateName : ""}
      >
        <Grid container justifyContent="flex-start" alignItems="center">
          <Grid item xs={12} md={12} mt={4}>
            <TableContainer component={Paper} elevation={3}>
              <Table ref={tableRef} size="small">
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      SL No.
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      AUID
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      DOA
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Year / Sem
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentList.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {i + 1}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.auid}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {moment(obj.date_of_admission).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.current_year} / {obj.current_sem}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.student_name}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={2} mt={2}>
            <Button variant="contained" onClick={onDownload}>
              Export to Excel
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <ModalWrapper
        open={approveTemplateOpen}
        maxWidth={1500}
        setOpen={setApproveTemplateOpen}
      >
        <ApproveTemplate
          id={feetemplateId}
          setApproveTemplateOpen={setApproveTemplateOpen}
          approveTemplateOpen={approveTemplateOpen}
          reload={getData}
        />
      </ModalWrapper>

      <Box sx={{ mt: 2 }}>
        <Grid
          container
          justifyContent="right"
          rowSpacing={2}
          columnSpacing={2}
          alignItems="center"
        >
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="acYearId"
              label="Ac Year"
              value={data.acYearId}
              options={acYearOptions}
              handleChangeAdvance={handleChangeAcYearId}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={data.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAcYearId}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="categoryId"
              label="Category"
              value={data.categoryId}
              options={categoryOptions}
              handleChangeAdvance={handleChangeAcYearId}
              required
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <GridIndex
              rows={rows}
              columns={columns}
              getRowClassName={getRowClassName}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default FeetemplateApprovalIndex;
