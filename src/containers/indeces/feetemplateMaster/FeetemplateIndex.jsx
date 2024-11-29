import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  CircularProgress,
  Paper,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import EditOffIcon from "@mui/icons-material/EditOff";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomModal from "../../../components/CustomModal";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";
import axios from "../../../services/Api";
import { makeStyles } from "@mui/styles";
import { useDownloadExcel } from "react-export-table-to-excel";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import moment from "moment";
import Feetemplatesubamountview from "../../../pages/forms/feetemplateMaster/ViewFeetemplateSubAmount";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
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

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

function FeetemplateIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [values, setValues] = useState({
    acYearId: null,
  });
  const [data, setData] = useState({
    acYearId: null,
    schoolId: null,
    categoryId: null,
  });

  const [confirmModal, setConfirmModal] = useState(false);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState();
  const [feetemplateId, setFeetemplateId] = useState();
  const [loading, setLoading] = useState(false);
  const [studentListOpen, setStudentListOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [feetemplateName, setFeetemplateName] = useState([]);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [acYearOptions, setAcyearOptions] = useState([]);
  const [currentYear, setCurrentYear] = useState();
  const [prevAcYear, setPrevAcYear] = useState();
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [error, setError] = useState();
  const [rowsData, setRowsData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [remarksOpen, setRemarksOpen] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();
  const tableRef = useRef(null);
  const setCrumbs = useBreadcrumbs();

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    fileName: "Student List",
    sheet: "Student List",
  });

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "fee_template_name",
      headerName: "Name",
      width: 220,
      flex: 1,
      hide: false,
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              component="span"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => handleDetails(params)}
            >
              {params.row.fee_template_name}
            </Typography>
          </Box>
        );
      },
    },
    { field: "ac_year", headerName: "AC Year", flex: 1, hide: true },
    { field: "school_name_short", headerName: "School", flex: 1, hide: true },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "program_specialization",
      headerName: "Specialization",
      flex: 1,
    },
    { field: "program_type_name", headerName: "Term" },
    {
      field: "currency_type_name",
      headerName: "Currency",
      flex: 1,
      hide: true,
    },
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
      field: "uniform_status",
      headerName: "Uniform Status",
      valueGetter: (params) => (params.row.uniform_status ? "Yes" : "No"),
      hide: true,
    },
    {
      field: "laptop_status",
      headerName: "Laptop Status",
      valueGetter: (params) => (params.row.laptop_status ? "Yes" : "No"),
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
      flex: 1,
      renderCell: (params) => {
        return params.row.countOfStudent !== 0 ? (
          <Box
            sx={{
              width: "100%",
              marginLeft: "15px",
            }}
          >
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
          <Box
            sx={{
              width: "100%",
              marginLeft: "15px",
            }}
          >
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
      field: "add-on",
      headerName: "Add-On Fee",
      type: "actions",
      getActions: (params) => [
        params.row.approved_status ? (
          <>
            <HtmlTooltip title={"Template Approved"}>
              <IconButton color="primary">
                <CheckCircleRoundedIcon fontSize="small" />
              </IconButton>
            </HtmlTooltip>
          </>
        ) : (
          <>
            {" "}
            <IconButton
              color="primary"
              onClick={() => navigate(`/AddonFee`, { state: params.row })}
            >
              <AddIcon />
            </IconButton>
          </>
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
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </>,
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
                state: { approverScreen: false },
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
      field: "view",
      type: "actions",
      flex: 1,
      headerName: "Template",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate("/Feetemplate/Multiple/Pdf", {
              state: { templateIds: [params.row.id], status: true },
            })
          }
          color="primary"
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>,
      ],
    },

    {
      field: "update",
      type: "actions",
      flex: 1,
      headerName: "Template",
      getActions: (params) => [
        (params.row.approved_status === false ||
          params.row.approved_status === null) &&
        params.row.countOfStudent === 0 &&
        params.row.active === true ? (
          <IconButton
            onClick={() =>
              navigate(`/FeetemplateMaster/Feetemplate/Update/${params.row.id}`)
            }
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : params.row.approved_status && params.row.active === true ? (
          <IconButton color="primary">
            <EditOffIcon fontSize="small" />
          </IconButton>
        ) : params.row.approved_status === false &&
          params.row.countOfStudent > 0 &&
          params.row.active === true ? (
          <IconButton color="primary">
            <EditOffIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton style={{ color: "red" }}>
            <HighlightOff fontSize="small" />
          </IconButton>
        ),
      ],
    },
    {
      field: "copy",
      type: "actions",
      flex: 1,
      headerName: "Copy",
      getActions: (params) => [
        // params.row.approved_status ? (
        <IconButton color="primary" onClick={() => handleCopy(params)}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>,
        // ) : (
        //   <></>
        // ),
      ],
    },
    {
      field: "updatesubamount",
      type: "actions",
      flex: 1,
      headerName: "Fee",
      getActions: (params) => [
        (params.row.approved_status === false ||
          params.row.approved_status === null) &&
        params.row.countOfStudent === 0 &&
        params.row.active === true ? (
          <IconButton
            onClick={() =>
              navigate(
                `/FeetemplateMaster/Editsubamount/${params.row.id}/${params.row.lat_year_sem}`
              )
            }
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : params.row.approved_status && params.row.active === true ? (
          <IconButton color="primary">
            <EditOffIcon fontSize="small" />
          </IconButton>
        ) : params.row.approved_status === false &&
          params.row.countOfStudent > 0 &&
          params.row.active === true ? (
          <IconButton color="primary">
            <EditOffIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton style={{ color: "red" }}>
            <HighlightOff fontSize="small" />
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
  ];

  useEffect(() => {
    setCrumbs([]);
    getAcYearData();
    getSchoolDetails();
    getAdmissionCategory();
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
  }, [data.acYearId, data.schoolId, data.categoryId]);

  const handleDetails = async (params) => {
    setFeetemplateId(params.row.id);
    setDetailsOpen(true);
  };

  const handleChangeAcYearId = (name, newValue) => {
    setData((prev) => ({ ...prev, [name]: newValue }));
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

  const getStudentList = async (params) => {
    setFeetemplateName(params.row.fee_template_name);
    await axios
      .get(`/api/finance/FetchStudentDetailsByFeeTemplateId/${params.row.id}`)
      .then((res) => {
        setStudentList(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setFeetemplateId(id);
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

  const handleUpload = (params) => {
    setFeetemplateId(params.row.id);
    setModalUploadOpen(true);
  };

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setRowsData(selectedRowsData);
    setSelectedRows(selectedRowsData.map((obj) => obj.id));
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
        navigate("/FeetemplateMaster", { replace: true });
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

  const handleCopy = async (params) => {
    setValues({ acYearId: null });
    setError();
    setFeetemplateId(params.row.id);
    setPrevAcYear(params.row.ac_year_id);
    setCopyModalOpen(true);
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcyearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "acYearId") {
      await axios
        .get(`/api/academic/academic_year`)
        .then((res) => {
          res.data.data.filter((obj) => {
            if (obj.ac_year_id === newValue) {
              setCurrentYear(obj.current_year);
            }
          });
        })
        .catch((error) => console.error(error));
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreate = async (e) => {
    const temp = {};

    temp.old_ac_year_id = prevAcYear;
    temp.new_ac_year_id = values.acYearId;
    temp.current_year = currentYear;
    temp.fee_template_id = feetemplateId;

    await axios
      .post(`/api/finance/copyFeeTemplates`, temp)
      .then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Template Created successfully",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setCopyModalOpen(false);
        setAlertOpen(true);
        getData();
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  };

  const handleRemarks = async (params) => {
    setRemarksOpen(true);
    await axios
      .get(`/api/finance/getFeeTemplateRemarksDetails/${params.row.id}`)
      .then((res) => {
        setRemarks(res.data.data);
      })
      .catch((err) => console.error(err));
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

      <ModalWrapper
        maxWidth={500}
        maxHeight={500}
        open={remarksOpen}
        setOpen={setRemarksOpen}
      >
        <Card
          sx={{ minWidth: 450, minHeight: 200, marginTop: 4 }}
          elevation={4}
        >
          <TableHead>
            <StyledTableCell
              sx={{
                width: 500,
                textAlign: "center",
                fontSize: 18,
                padding: "10px",
              }}
            >
              ADD-ON NOTE
            </StyledTableCell>
          </TableHead>
          <CardContent>
            <Typography sx={{ fontSize: 16, paddingLeft: 1 }}>
              {remarks.length > 0 ? (
                remarks.map((val, i) => (
                  <ul key={i}>
                    <li>
                      <Typography
                        variant="subtitle2"
                        color="inherit"
                        component="div"
                        mt={2}
                      >
                        {val.remarks}
                      </Typography>
                    </li>
                  </ul>
                ))
              ) : (
                <>
                  <Typography
                    variant="h6"
                    color="error"
                    component="div"
                    mt={2}
                    align="center"
                  >
                    NO DATA
                  </Typography>
                </>
              )}
            </Typography>
          </CardContent>
        </Card>
      </ModalWrapper>

      <ModalWrapper
        open={copyModalOpen}
        setOpen={setCopyModalOpen}
        maxWidth={800}
        title="Copy To"
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          columnSpacing={2}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="acYearId"
              label="Ac Year"
              value={values.acYearId}
              options={acYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Create"}</strong>
              )}
            </Button>
          </Grid>
          <Grid item xs={12} mt={2} align="center">
            <Typography variant="subtitle2" color="red">
              {error}
            </Typography>
          </Grid>
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
      <ModalWrapper open={detailsOpen} maxWidth={1500} setOpen={setDetailsOpen}>
        <Feetemplatesubamountview id={feetemplateId} />
      </ModalWrapper>
      <ModalWrapper
        open={studentListOpen}
        setOpen={setStudentListOpen}
        title={feetemplateName}
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
          <Grid item xs={12} md={1}>
            <Button
              onClick={() => navigate("/FeetemplateMaster/Feetemplate/New")}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              onClick={() =>
                navigate("/Feetemplate/Multiple/Pdf", {
                  state: { templateIds: selectedRows, status: true },
                })
              }
              variant="contained"
              disableElevation
              startIcon={<LocalPrintshopIcon />}
            >
              PRINT
            </Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <GridIndex
              rows={rows}
              checkboxSelection
              onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
              columns={columns}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default FeetemplateIndex;
