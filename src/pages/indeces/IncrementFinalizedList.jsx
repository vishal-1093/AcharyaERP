import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Grid,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
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
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme?.palette?.auzColor?.main,
    color: theme?.palette?.headerWhite?.main,
    padding: "6px",
    textAlign: "center",
  },
}));

const initialValues = { fileName: "", deptId: "", schoolId: "", month: null };

export const SalaryBreakupModal = ({
  viewSalary,
  setViewSalary,
  salaryData,
}) => {
  const salaryDetails = [
    {
      label: "Basic Salary",
      current: salaryData?.previousBasic,
      proposed: salaryData?.proposedBasic,
    },
    {
      label: "Special Pay",
      current: salaryData?.previousSplPay,
      proposed: salaryData?.proposedSplPay,
    },
    {
      label: "Transport Allowance (TA)",
      current: salaryData?.previousTa,
      proposed: salaryData?.proposedTa,
    },
    {
      label: "Gross Pay",
      current: salaryData?.previousGrosspay,
      proposed: salaryData?.proposedGrosspay,
    },
    {
      label: "CTC",
      current: salaryData?.previousCtc,
      proposed: salaryData?.proposedCtc,
    },
    {
      label: "Gross Difference",
      current: "-",
      proposed: salaryData?.grossDifference,
    },
    {
      label: "CTC Difference",
      current: "-",
      proposed: salaryData?.ctcDifference,
    },
  ];

  return (
    <ModalWrapper
      open={viewSalary}
      setOpen={setViewSalary}
      title="Salary Breakup"
      maxWidth={800}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1E3A8A" }}>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Component
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Current
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Proposed
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaryDetails.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#F3F4F6" : "white",
                      "&:hover": { backgroundColor: "#E5E7EB" },
                    }}
                  >
                    <TableCell sx={{ fontWeight: "600", fontSize: "14px" }}>
                      {row.label}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "500", fontSize: "14px" }}
                    >
                      {row.current !== null ? row.current : "0"}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "500", fontSize: "14px" }}
                    >
                      {row.proposed !== null ? row.proposed : "0"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

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
  const [data, setData] = useState({});
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const classes = useStyles();
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    created_date: false,
    createdBy: false
  });
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
  function formatMonthYear(month, year) {
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}-${formattedYear}`;
  }
  const columns = [
    { field: "empCode", headerName: "Empcode", flex: 1 },
    { field: "employeeName", headerName: " Employee Name", flex: 1 },
    { field: "school_name_short", headerName: "Inst", flex: 1 },
    {
      field: "dateofJoining",
      headerName: "DOJ",
      flex: 1,
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
      field: "month",
      headerName: "MM/YY",
      flex: 1,
      renderCell: (params) => {
        return <>{formatMonthYear(params?.row?.month, params?.row?.year)}</>;
      },
    },
    {
      field: "view",
      headerName: "Attachment",
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
    {
      field: "view Salary",
      headerName: "Salary Breakup",
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => handleViewSalary(params)}>
          <Visibility fontSize="small" color="primary" />
        </IconButton>,
      ],
    },
    { field: "createdBy", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueFormatter: (value) => moment(value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
  ];

  useEffect(() => {
    getData();
    getSchoolDetails();
    setCrumbs([{ name: "Increment List" }]);
  }, []);

  useEffect(() => {
    getData();
  }, [values.deptId, values.month]);

  useEffect(() => {
    getDepartmentOptions();
    getData();
  }, [values.schoolId]);

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj?.school_id,
            label: obj?.school_name_short,
            school_name_short: obj?.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };
  const getDepartmentOptions = async () => {
    if (values.schoolId) {
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.dept_id,
              label: obj.dept_name_short,
              dept_name_short: obj?.dept_name_short,
            });
          });
          setDepartmentOptions(data);
        })
        .catch((err) => console.error(err));
    }
  };
  const getData = async () => {
    try {
      let baseURL = `/api/incrementCreation/getIncrementFinalizeList`;
      const params = new URLSearchParams();
      const month = values.month && moment(values.month).format("MM");

      if (values.schoolId) params.append("school_id", values.schoolId);
      if (values?.deptId) params.append("dept_id", values?.deptId);
      if (values.month) params.append("month", month);

      const response = await axios.get(`${baseURL}?${params.toString()}`);
      const filteredData = response.data.data
        .filter((obj) => obj.isApproved === false && obj.isRejected === false)
        .map((obj, index) => ({ ...obj, id: index }));

      setRows(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
    setTemplateWrapperOpen(true);
    setAttachmentPath(params.row.attachmentPath);
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
  const handleViewSalary = async (params) => {
    setViewSalary(true);
    await axios
      .get(
        `/api/incrementCreation/getIncrementByIncrementId?incrementId=${params.row.incrementCreationId}`
      )
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => { });
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

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <>
      <ModalWrapper
        open={templateWrapperOpen}
        setOpen={setTemplateWrapperOpen}
        maxWidth={1200}
      >
        <>
          {attachmentPath && (
            <DOCView
              attachmentPath={`/api/incrementCreation/downloadIncrementCreationFile?fileName=${attachmentPath}`}
            />
          )}
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

      {/* <ModalWrapper
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
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </Grid>
      </ModalWrapper> */}
      <SalaryBreakupModal
        viewSalary={viewSalary}
        setViewSalary={setViewSalary}
        salaryData={data}
      />
      <Grid
        container
        justifyContent="flex-start"
        rowSpacing={2}
        columnSpacing={4}
        mt={1}
        mb={2}
      >
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="schoolId"
            label="School"
            value={values.schoolId}
            options={schoolOptions}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="deptId"
            label="Department"
            value={values.deptId}
            options={departmentOptions}
            handleChangeAdvance={handleChangeAdvance}
            disabled={!values.schoolId}
          />
        </Grid>

        <Grid item xs={12} md={2} display="flex" alignItems="center">
          <CustomDatePicker
            name="month"
            label="Month"
            value={values.month}
            handleChangeAdvance={handleChangeAdvance}
            views={["month", "year"]}
            openTo="month"
            inputFormat="MM/YYYY"
            clearIcon={true}
          />
        </Grid>
        <Grid item xs={12} md={2}></Grid>
        {/* Button container with flex-end alignment */}
        <Grid
          item
          xs={12}
          md={4}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button
            onClick={handleApprove}
            variant="contained"
            disableElevation
            sx={{ borderRadius: 2, ml: 2 }}
            disabled={incrementCreationIds.length === 0}
            color="success"
          >
            Approve
          </Button>

          <Button
            onClick={handleReject}
            variant="contained"
            disableElevation
            sx={{ borderRadius: 2, ml: 2 }}
            disabled={incrementCreationIds.length === 0}
            color="error"
          >
            Reject
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ position: "relative", mt: 1 }}>
        <GridIndex
          rows={rows}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(ids) => onSelectionModelChange(ids)}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
        />
      </Box>
    </>
  );
}
export default IncrementFinalizedList;
