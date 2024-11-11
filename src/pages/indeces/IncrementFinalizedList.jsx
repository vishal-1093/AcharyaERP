import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import moment from "moment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Visibility } from "@mui/icons-material";
import ModalWrapper from "../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import CustomFileInput from "../../components/Inputs/CustomFileInput";
import { useNavigate } from "react-router-dom";
import DOCView from "../../components/DOCView";
import { GridActionsCellItem } from "@mui/x-data-grid";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme?.palette?.auzColor?.main,
    color: theme?.palette?.headerWhite?.main,
    padding: "6px",
    textAlign: "center",
  },
}));

const initialValues = { fileName: "" };

function IncrementFinalizedList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [incrementCreationIds, setIncrementCreationIds] = useState([]);
  const [viewSalary, setViewSalary] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [templateWrapperOpen, setTemplateWrapperOpen] = useState(false);
  const [attachmentPath, setAttachmentPath] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const classes = useStyles();

  const checks = {
    fileName: [
      values.fileName,
      values.fileName && values.fileName.name.endsWith(".pdf"),
      values.fileName && values.fileName.size < 2000000,
    ],
  };

  const errorMessages = {
    fileName: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const columns = [
    { field: "empCode", headerName: "Empcode", flex: 1 },
    { field: "employeeName", headerName: " Employee Name", flex: 1 },
    {
      field: "dateofJoining",
      headerName: "DOJ",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.dateofJoining).format("DD-MM-YYYY"),
    },
    { field: "proposedDepartment", headerName: "Proposed Dept", flex: 1 },
    {
      field: "proposedDesignation",
      headerName: "Proposed Designation",
      flex: 1,
    },
    {
      field: "proposedSalaryStructure",
      headerName: "Proposed Salary Structure",
      flex: 1,
    },
    { field: "proposedBasic", headerName: "Proposed Basic", flex: 1 },
    { field: "proposedSplPay", headerName: "Proposed Special Pay", flex: 1 },
    { field: "proposedGrosspay", headerName: "Proposed Gross Pay", flex: 1 },
    { field: "proposedCtc", headerName: "Proposed CTC", flex: 1 },
    {
      field: "isApproved",
      headerName: "Approve Status",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row?.isRejected === true ? (
          <GridActionsCellItem
            icon={
              <Typography variant="subtitle2" color="error">
                Rejected
              </Typography>
            }
            label="Rejected"
          />
        ) : params.row?.isApproved === true ? (
          <GridActionsCellItem
            icon={
              <Typography variant="subtitle2" style={{ color: "green" }}>
                Approved
              </Typography>
            }
            label="Approved"
          />
        ) : (
          <GridActionsCellItem
            icon={
              <Typography variant="subtitle2" color="error">
                Pending
              </Typography>
            }
            label="Pending"
          />
        ),
      ],
    },
    
    {
      field: "view",
      headerName: "View",
      type: "actions",
      getActions: (params) => [
        params.row.attachmentPath !== null ? (
          <IconButton onClick={() => handleView(params)}>
            <Visibility fontSize="small" color="primary" />
          </IconButton>
        ) : (
          <>
            <IconButton onClick={() => handleUploadOpen(params)}>
              <CloudUploadIcon fontSize="small" color="primary" />
            </IconButton>
            ,
          </>
        ),
      ],
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Increment List" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/incrementCreation/getIncrementFinalizeList`)
      .then((res) => {
        const temp = [];
        res.data.data.filter((obj, index) => {
          if (obj.isChecked === true) {
            temp.push({ ...obj, id: index });
          }
        });
        setRows(temp);
      })
      .catch((err) => console.error(err));
  };

  const handleApprove = async () => {
    const selectedIdsString = incrementCreationIds
      .map((obj) => obj?.incrementCreationId)
      .join(",");
    await axios
      .post(`/api/incrementCreation/incrementIsApproved/${selectedIdsString}`)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Approved" });
          setAlertOpen(true);
          getData();
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message,
        });
        setAlertOpen(true);
      });
  };

  const handleReject = async () => {
    const selectedIdsString = incrementCreationIds
      .map((obj) => obj?.incrementCreationId)
      .join(",");
    await axios
      .post(`/api/incrementCreation/incrementIsRejected/${selectedIdsString}`)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Rejected" });
          setAlertOpen(true);
          getData();
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message,
        });
        setAlertOpen(true);
      });
  };

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setIncrementCreationIds(
      selectedRowsData.map(({ incrementCreationId }) => ({
        incrementCreationId,
      }))
    );
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleView = async (params) => {
    setTemplateWrapperOpen(true)
    setAttachmentPath(params.row.attachmentPath)
    // await axios
    //   .get(
    //     `/api/incrementCreation/downloadIncrementCreationFile?fileName=${params.row.attachmentPath}`,
    //     {
    //       responseType: "blob",
    //     }
    //   )
    //   .then((res) => {
    //     const url = window.URL.createObjectURL(new Blob([res.data]));
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "application.pdf");
    //     document.body.appendChild(link);
    //     link.click();
    //   })
    //   .catch((err) => console.error(err));
    // await axios
    //   .get(
    //     `/api/incrementCreation/getIncrementByIncrementId?incrementId=${params.row.incrementCreationId}`
    //   )
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {});
  };

  const handleUploadOpen = () => {
    if (incrementCreationIds.length > 0) {
      setUploadOpen(true);
    } else {
      setAlertMessage({
        severity: "error",
        message: "Please select the checkbox",
      });
      setAlertOpen(true);
    }
  };

  const handleUpload = async () => {
    const rowUniqueIds = {};
    rowUniqueIds.incrementIds = incrementCreationIds.map(
      (obj) => obj.incrementCreationId
    );

    const dataArray = new FormData();
    dataArray.append("file", values.fileName);
    dataArray.append("request", JSON.stringify(rowUniqueIds));
    setLoading(true);

    await axios
      .post(`/api/incrementCreation/uploadIncrementFile`, dataArray)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Uploaded Successfully",
          });
          setUploadOpen(false);
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data.message,
          });
        }

        setAlertOpen(true);
        setLoading(false);
        setUploadOpen(false);
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

  return (
    <>
      <ModalWrapper
        open={templateWrapperOpen}
        setOpen={setTemplateWrapperOpen}
        maxWidth={1200}
      >
        <>
         {attachmentPath && <DOCView
            attachmentPath={`/api/incrementCreation/downloadIncrementCreationFile?fileName=${attachmentPath}`}
          />}
        </>
      </ModalWrapper>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <ModalWrapper
        title="Upload"
        maxWidth={500}
        open={uploadOpen}
        setOpen={setUploadOpen}
      >
        <Grid
          container
          rowSpacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12}>
            <CustomFileInput
              name="fileName"
              label="Pdf"
              helperText="PDF - smaller than 2 MB"
              file={values.fileName}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checks.fileName}
              errors={errorMessages.fileName}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              disabled={loading}
              onClick={handleUpload}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Upload"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <ModalWrapper
        open={viewSalary}
        setOpen={setViewSalary}
        title="Salary Breakup"
        maxWidth={800}
      >
        <Grid container rowSpacing={1}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              Salary Breakup
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Grid
                container
                alignItems="center"
                rowSpacing={1}
                pl={2}
                pr={2}
                pb={1}
                pt={1}
              >
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Emp Code</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {"Rupesh"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Emp Name</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {"Rupesh"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Designation</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    Software
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Branch</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {"Rupesh"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Salary Structure</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {"Rupesh"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Basic Salary</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {"Rupesh"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Gross</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {"Rupesh"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">CTC</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {"Rupesh"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            {/* <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        align="center"
                        className={classes.bg}
                        sx={{ color: "white" }}
                      >
                        Salary Breakup
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(data).length > 0 ? (
                      <>
                        <TableRow>
                          <TableCell colSpan={2} align="left">
                            <Typography variant="subtitle2">
                              Earnings
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {data.earnings
                          .sort((a, b) => {
                            return a.priority - b.priority;
                          })
                          .map((obj, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell>{obj.name}</TableCell>
                                <TableCell align="right">
                                  {obj.monthly.toFixed()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">
                              Gross Earning
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              {data.grossEarning.toFixed()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2} align="left">
                            <Typography variant="subtitle2">
                              Deductions
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {data.deductions
                          .sort((a, b) => {
                            return a.priority - b.priority;
                          })
                          .map((val, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell>{val.name}</TableCell>
                                <TableCell align="right">
                                  {val.monthly.toFixed()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">
                              Total Deductions
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              {data.totDeduction.toFixed()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2} align="left">
                            <Typography variant="subtitle2">
                              Management Contribution
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {data.management
                          .sort((a, b) => {
                            return a.priority - b.priority;
                          })
                          .map((val, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell>{val.name}</TableCell>
                                <TableCell align="right">
                                  {val.monthly.toFixed()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {" "}
                              Cost to Company
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              {(
                                data.grossEarning + data.totManagement
                              ).toFixed()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">Net Pay</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              {(
                                data.grossEarning - data.totDeduction
                              ).toFixed()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                          <Typography variant="subtitle2">
                            No Records
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid> */}
          </Grid>
        </Grid>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 4 }}>
        <Button
          onClick={handleApprove}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          disabled={incrementCreationIds.length === 0}
          color="success"
        >
          Approve
        </Button>
        <Button
          onClick={handleReject}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 100, top: -57, borderRadius: 2 }}
          disabled={incrementCreationIds.length === 0}
          color="error"
        >
          Reject
        </Button>
        <GridIndex
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
        />
      </Box>
    </>
  );
}
export default IncrementFinalizedList;
