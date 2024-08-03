import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
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
import { Check, HighlightOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddIcon from "@mui/icons-material/Add";
import EditOffIcon from "@mui/icons-material/EditOff";
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
import FeeTemplateView from "../../../components/FeeTemplateView";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import moment from "moment";

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
  const [values, setValues] = useState({ acYearId: null });
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
  const [error, setError] = useState();

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    fileName: "Student List",
    sheet: "Student List",
  });

  const columns = [
    {
      field: "fee_template_name",
      headerName: "Name",
      width: 220,
      flex: 1,
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
    { field: "ac_year", headerName: "AC Year", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "program_specialization",
      headerName: "Specialization",
      flex: 1,
    },
    { field: "program_type_name", headerName: "Term Type" },
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
      field: "fee_admission_sub_category_name",
      headerName: "Sub-Category",
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
            navigate(`/ViewFeetemplateSubAmount/${params.row.id}/1`)
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
        params.row.approved_status ? (
          <IconButton color="primary">
            <EditOffIcon fontSize="small" />
          </IconButton>
        ) : (
          <>
            {params.row.active === true ? (
              <IconButton
                onClick={() =>
                  navigate(
                    `/FeetemplateMaster/Feetemplate/Update/${params.row.id}`
                  )
                }
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton style={{ color: "red" }}>
                <HighlightOff fontSize="small" />
              </IconButton>
            )}
          </>
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
        params.row.approved_status ? (
          <IconButton color="primary">
            <EditOffIcon fontSize="small" />
          </IconButton>
        ) : (
          <>
            {params.row.active === true ? (
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
            ) : (
              <IconButton style={{ color: "red" }}>
                <HighlightOff fontSize="small" />
              </IconButton>
            )}
          </>
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
    getData();
  }, []);

  const handleDetails = async (params) => {
    setFeetemplateId(params.row.id);
    setDetailsOpen(true);
  };

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchFeeTemplateDetail?page=${0}&page_size=${10000}&sort=created_date`
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
      <ModalWrapper open={detailsOpen} maxWidth={1000} setOpen={setDetailsOpen}>
        <Box mt={2}>
          <FeeTemplateView feeTemplateId={feetemplateId} type={1} />
        </Box>
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
                    <TableCell sx={{ color: "white" }}>SL No.</TableCell>
                    <TableCell sx={{ color: "white" }}>AUID</TableCell>
                    <TableCell sx={{ color: "white" }}>USN</TableCell>
                    <TableCell sx={{ color: "white" }}>DOA</TableCell>
                    <TableCell sx={{ color: "white" }}>Name</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      Admission Category
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentList.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{obj.auid}</TableCell>
                        <TableCell>{obj.usn}</TableCell>
                        <TableCell>
                          {moment(obj.date_of_admission).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell>{obj.student_name}</TableCell>
                        <TableCell>{obj.fee_admission_category_type}</TableCell>
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
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/FeetemplateMaster/Feetemplate/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default FeetemplateIndex;
