import { useState, useEffect, lazy } from "react";
import axios from "../services/Api";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "./ModalWrapper";
import { CustomDataExport } from "../components/CustomDataExport";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";
import useAlert from "../hooks/useAlert";
import { EmployeeTypeConfirm } from "../components/EmployeeTypeConfirm";
import { JobTypeChange } from "../components/JobTypeChange";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CustomDatePicker from "./Inputs/CustomDatePicker";
import moment from "moment";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { convertStringToDate } from "../utils/DateTimeUtils";
import { makeStyles } from "@mui/styles";
import CustomTextField from "./Inputs/CustomTextField";

const useStyles = makeStyles({
  redRow: {
    backgroundColor: "#FFD6D7 !important",
  },
});

const GridIndex = lazy(() => import("../components/GridIndex"));
const EmployeeDetailsView = lazy(() =>
  import("../components/EmployeeDetailsView")
);

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
const initialValues = {
  schoolId: null,
  deptId: null,
  dept_name_short: "",
  deptShortName: "",
  school_name_short: "",
  schoolShortName: "",
};

const initialState = {
  empNameCode: "",
  probationEndDate: "",
  empId: null,
  confirmModalOpen: false,
  isOpenJobTypeModal: false,
  jobTypeId: null,
  jobShortName: "",
  jobTypeLists: [],
};
const roleName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;

const extendInitialValues = { fromDate: null, endDate: null, amount: "" };

const requiredFields = ["endDate"];

function EmployeeIndex() {
  const [rows, setRows] = useState([]);
  const [empId, setEmpId] = useState();
  const [state, setState] = useState(initialState);
  const [offerId, setOfferId] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [extendValues, setExtendValues] = useState(extendInitialValues);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [extendLoading, setExtendLoading] = useState(false);
  const classes = useStyles();

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    fromDate: [extendValues.fromDate !== null],
    endDate: [extendValues.endDate !== null],
    amount: [extendValues.amount !== null],
  };

  const errorMessages = {
    fromDate: ["This field required"],
    endDate: ["This field required"],
    amount: ["This field required"],
  };

  useEffect(() => {
    setCrumbs([{ name: "Employee Index" }]);
    getData();
    getSchoolDetails();
    getJobTypeData();
  }, []);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name,
            school_name_short: obj.school_name_short,
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
              label: obj.dept_name,
              dept_name_short: obj.dept_name_short,
            });
          });
          setDepartmentOptions(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const getJobTypeData = async () => {
    await axios
      .get(
        `/api/employee/JobType?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          jobTypeLists: res?.data?.data.map((el) => ({
            ...el,
            label: el.job_type,
            value: el.job_type_id,
          })),
        }));
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setExtendValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "schoolId") {
      setValues((prev) => ({
        ...prev,
        schoolId: newValue,
        deptId: "",
        schoolShortName: schoolOptions.find((el) => el.value == newValue)
          .school_name_short,
      }));
      setDepartmentOptions([]);
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        deptShortName: departmentOptions.find((el) => el.value == newValue)
          .dept_name_short,
      }));
    }
  };

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllEmployeeDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleDetails = (params) => {
    setEmpId(params.row.id);
    setOfferId(params.row.offer_id);
    setModalOpen(true);
  };
  const onClosePopUp = () => {
    setValues(initialValues);
    setSwapOpen(false);
  };
  const handleChangeSwap = (params) => {
    setEmpId(params?.row?.id);
    setSwapOpen(true);
    setValues({
      schoolId: params?.row?.school_id,
      deptId: params?.row?.dept_id,
      dept_name_short: params.row?.dept_name_short,
      school_name_short: params.row?.school_name_short,
    });
  };

  const updateDeptAndSchoolOfEmployee = async () => {
    setLoading(true);
    const temp = {};
    temp.emp_id = empId;
    if (!!values.deptId) {
      temp.dept_id = values.deptId;
      temp.dept_name_short = !!values.deptShortName
        ? `<font color='blue'>${values.deptShortName || ""}</font>`
        : values.dept_name_short;
    }
    if (!!values.schoolId) {
      temp.school_id = values.schoolId;
      temp.school_name_short = !!values.schoolShortName
        ? `<font color='blue'>${values.schoolShortName || ""}</font>`
        : values.school_name_short;
    }
    await axios
      .put(`/api/employee/updateDeptAndSchoolOfEmployee/${empId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Department and school of the employee have been changed.",
          });
          setValues(initialValues);
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
          setValues(initialValues);
        }
        setAlertOpen(true);
        setSwapOpen(false);
        setLoading(false);
        getData();
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hideable: false },
    {
      field: "employee_name",
      headerName: "Employee",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {params?.row?.employee_name?.toLowerCase()}
            </Typography>
          }
        >
          <Typography
            variant="subtitle2"
            color="primary"
            onClick={() =>
              navigate(
                `/EmployeeDetailsView/${params.row.id}/${params.row.offer_id}`
              )
            }
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
            }}
          >
            {params.row?.phd_status === "holder"
              ? "Dr. " + params?.row?.employee_name?.toLowerCase()
              : params?.row?.employee_name?.toLowerCase()}
          </Typography>
        </HtmlTooltip>
      ),
    },
    {
      field: "empTypeShortName",
      headerName: "Onboard",
      flex: 1,
      hideable: false,
    },
    // { field: "email", headerName: "Email", flex: 1, hideable: false },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <div onClick={() => handleChangeSwap(params)}>{params.value}</div>
      ),
    },
    {
      field: "dept_name_short",
      headerName: "Department",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <div onClick={() => handleChangeSwap(params)}>{params.value}</div>
      ),
    },
    {
      field: "designation_short_name",
      headerName: "Designation",
      flex: 1,
      hideable: false,
    },
    {
      field: "job_type",
      headerName: "Job Type",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          color="primary"
          onClick={(e) => onClickJobType(params)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params.row?.job_type}
        </Typography>
      ),
    },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      flex: 1,
      hideable: false,
      renderCell: (params) => {
        return (
          <>{params.row?.date_of_joining ? params.row?.date_of_joining : "-"}</>
        );
      },
    },
    {
      field: "to_date",
      headerName: "Probation End Date",
      flex: 1,
      hide: true,
      renderCell: (params) => {
        return <>{params.row?.to_date ? params.row?.to_date : "-"}</>;
      },
    },
    {
      field: "mobile",
      headerName: "Phone",
      flex: 1,
      // hide: true,
      renderCell: (params) => {
        return <>{params.row?.mobile ? params.row?.mobile : ""}</>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => {
        <Typography
          variant="subtitle2"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.row?.email ? params.row?.email : ""}
        </Typography>;
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      hide: true,
      renderCell: (params) => {
        return <>{params.row?.gender ? params.row?.gender : ""}</>;
      },
    },
    {
      field: "leaveApproverName1",
      headerName: "Leave Approver 1",
      flex: 1,
      hide: true,
      renderCell: (params) => {
        return (
          <>
            {params.row?.leaveApproverName1
              ? params.row?.leaveApproverName1
              : ""}
          </>
        );
      },
    },
    {
      field: "leaveApproverName2",
      headerName: "Leave Approver 2",
      flex: 1,
      hide: true,
      renderCell: (params) => {
        return (
          <>
            {params.row?.leaveApproverName2
              ? params.row?.leaveApproverName2
              : ""}
          </>
        );
      },
    },
    {
      field: "storeIndentApproverName",
      headerName: "Store Indent Approver 1",
      flex: 1,
      hide: true,
      renderCell: (params) => {
        return (
          <>
            {params.row?.storeIndentApproverName
              ? params.row?.storeIndentApproverName
              : ""}
          </>
        );
      },
    },
    {
      field: "confirm",
      headerName: "Confirm",
      flex: 1,
      hideable: false,
      renderCell: (params) => {
        return (
          <>
            {!params.row.permanent_file ? (
              <IconButton
                disabled={
                  params.row?.empTypeShortName !== "ORR" || !params.row.to_date
                }
                color="primary"
                onClick={() => onClickConfirm(params)}
              >
                <PlaylistAddIcon sx={{ fontSize: 22 }} />
              </IconButton>
            ) : (
              <IconButton
                disabled={!params.row?.permanent_file}
                onClick={() =>
                  navigate(
                    `/EmployeePermanentAttachmentView?fileName=${params.row?.permanent_file}`,
                    {
                      state: { approverScreen: true },
                    }
                  )
                }
                color="primary"
              >
                <CloudDownloadIcon fontSize="small" />
              </IconButton>
            )}
          </>
        );
      },
    },
    {
      field: "ctc",
      headerName: "CTC",
      flex: 1,
      hide: true,
      renderCell: (params) => {
        return (
          <>
            {params.row?.empTypeShortName === "CON"
              ? params.row?.consolidated_amount
              : params.row?.ctc}
          </>
        );
      },
    },
    {
      field: "test",
      headerName: "Approve Status",
      flex: 1,
      hide: true,
      type: "actions",
      getActions: (params) => [
        params.row?.new_join_status === 1 ? (
          <Typography variant="subtitle2" color="green">
            Approved
          </Typography>
        ) : (
          <Typography variant="subtitle2" color="error">
            Pending
          </Typography>
        ),
      ],
    },
    {
      field: "fte_status",
      headerName: "Extend Date",
      flex: 1,
      renderCell: (params) =>
        params.row.empTypeShortName !== "ORR" &&
        new Date(moment(new Date()).format("YYYY-MM-DD")) ? (
          <IconButton onClick={() => handleExtendDate(params.row)}>
            <AddBoxIcon color="primary" />
          </IconButton>
        ) : (
          params.row.to_date
        ),
    },
    {
      field: "id",
      headerName: "swap",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton color="primary" onClick={() => handleChangeSwap(params)}>
          <SwapHorizIcon />
        </IconButton>,
      ],
    },
  ];

  if (roleName === "Superadmin") {
    columns.push({
      field: "created_by",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => navigate(`/employeeupdateform/${params.row?.id}`)}
        >
          <EditIcon />
        </IconButton>
      ),
    });
  }

  const onClickConfirm = (params) => {
    setState((prevState) => ({
      ...prevState,
      empNameCode: `${params.row?.employee_name}   ${params.row?.empcode}`,
      probationEndDate: params.row?.to_date
        ? convertStringToDate(params.row?.to_date)
        : null,
      empId: params.row?.id,
    }));
    handleConfirmModal();
  };

  const handleConfirmModal = () => {
    setState((prevState) => ({
      ...prevState,
      confirmModalOpen: !state.confirmModalOpen,
    }));
  };

  const onClickJobType = (params) => {
    setState((prevState) => ({
      ...prevState,
      jobTypeId: params.row?.job_type_id,
      jobShortName: params.row?.job_short_name,
      empId: params.row?.id,
      isOpenJobTypeModal: !state.isOpenJobTypeModal,
    }));
  };

  const handleJobTypeModal = () => {
    setState((prevState) => ({
      ...prevState,
      isOpenJobTypeModal: !state.isOpenJobTypeModal,
    }));
  };

  const handleExtendDate = (data) => {
    setExtendValues(extendInitialValues);
    if (data.empTypeShortName === "CON") {
      ["fromDate", "amount"].forEach((obj) => {
        if (requiredFields.includes(obj) === true) {
          const getIndex = requiredFields.indexOf(obj);
          requiredFields.splice(getIndex, 1);
        } else {
          requiredFields.push(obj);
        }
      });
    }
    setRowData(data);
    setExtendValues((prev) => ({
      ...prev,
      amount:
        data.empTypeShortName === "CON" ? data.consolidated_amount : data.ctc,
    }));
    setExtendModalOpen(true);
  };

  const handleChangeAdvanceExtend = (name, newValue) => {
    setExtendValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!extendValues[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    // Get Employee Details
    const empData = await axios
      .get(`/api/employee/EmployeeDetails/${rowData.id}`)
      .then((res) => res.data.data[0])
      .catch((err) => console.error(err));

    const temp = { ...empData };
    const toDate = moment(extendValues.endDate).format("DD-MM-YYYY");
    temp.to_date = `<font color='blue'>${toDate}</font>`;
    empData.to_date = toDate;

    if (rowData.empTypeShortName === "CON") {
      empData.date_of_joining = moment(extendValues.fromDate).format(
        "DD-MM-YYYY"
      );
      empData.consolidated_amount = extendValues.amount;

      temp.date_of_joining = `<font color='blue'>${moment(
        extendValues.fromDate
      ).format("DD-MM-YYYY")}</font>`;
      temp.consolidated_amount = `<font color='blue'>${extendValues.amount}</font>`;
    }

    setExtendLoading(true);
    await axios
      .put(`/api/employee/EmployeeDetails/${rowData.id}`, empData)
      .then((res) => {
        axios
          .post(`/api/employee/employeeDetailsHistory`, temp)
          .then((resHis) => {
            setExtendLoading(false);
            setExtendModalOpen(false);
            setAlertMessage({
              severity: "success",
              message: "To Date extended successfully !!",
            });
            setAlertOpen(true);
            getData();
          })
          .catch((errHis) => console.error(errHis));
      })
      .catch((err) => console.error(err));
  };

  const getRowClassName = (params) => {
    return params.row?.new_join_status === 1 ? "" : classes.redRow;
  };

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <EmployeeDetailsView empId={empId} offerId={offerId} />
      </ModalWrapper>
      <ModalWrapper
        title="swap"
        maxWidth={1000}
        open={swapOpen}
        setOpen={() => onClosePopUp()}
      >
        <Grid container rowSpacing={2} columnSpacing={4} mt={1}>
          <Grid item xs={6} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <CustomAutocomplete
              name="deptId"
              label="Department"
              value={values.deptId}
              options={departmentOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={() => updateDeptAndSchoolOfEmployee()}
              disabled={!(values.schoolId && values.deptId)}
            >
              {isLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      {!!state.confirmModalOpen && (
        <EmployeeTypeConfirm
          handleConfirmModal={handleConfirmModal}
          empNameCode={state.empNameCode}
          probationEndDate={state.probationEndDate}
        />
      )}

      {!!state.isOpenJobTypeModal && (
        <ModalWrapper
          title="Job Type Change"
          maxWidth={400}
          open={state.isOpenJobTypeModal}
          setOpen={() => handleJobTypeModal()}
        >
          <JobTypeChange
            jobTypeId={state.jobTypeId}
            jobTypeLists={state.jobTypeLists}
            empId={state.empId}
            jobShortName={state.jobShortName}
            handleJobTypeModal={handleJobTypeModal}
            getData={getData}
          />
        </ModalWrapper>
      )}
      {rows.length > 0 && (
        <CustomDataExport dataSet={rows} titleText="Employee Inactive" />
      )}

      {/* Extend Date   */}
      <ModalWrapper
        open={extendModalOpen}
        setOpen={setExtendModalOpen}
        maxWidth={550}
        title={
          (rowData.phd_status === "holder"
            ? "Dr. " + rowData.employee_name
            : rowData.employee_name) + " - Extend End Date"
        }
      >
        <Box mt={2}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12} mb={1}>
              <Typography display="inline">CTC :&nbsp;</Typography>
              <Typography display="inline" variant="subtitle2">
                {rowData.empTypeShortName === "CON"
                  ? rowData.consolidated_amount
                  : rowData.ctc}
              </Typography>
            </Grid>

            {rowData.empTypeShortName === "CON" ? (
              <Grid item xs={12}>
                <CustomDatePicker
                  name="fromDate"
                  label="From Date"
                  value={extendValues.fromDate}
                  handleChangeAdvance={handleChangeAdvanceExtend}
                />
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={12}>
              <CustomDatePicker
                name="endDate"
                label="End Date"
                value={extendValues.endDate}
                handleChangeAdvance={handleChangeAdvanceExtend}
                minDate={moment(
                  rowData?.to_date?.split("-").reverse().join("-")
                ).add(1, "day")}
              />
            </Grid>

            {rowData.empTypeShortName === "CON" ? (
              <Grid item xs={12}>
                <CustomTextField
                  name="amount"
                  label="CTC"
                  value={extendValues.amount}
                  handleChange={handleChange}
                  checks={checks.amount}
                  errors={errorMessages.amount}
                  required
                />
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                size="small"
                onClick={handleCreate}
                disabled={extendLoading || !requiredFieldsValid()}
              >
                {extendLoading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <GridIndex
        rows={rows}
        columns={columns}
        getRowClassName={getRowClassName}
      />
    </Box>
  );
}

export default EmployeeIndex;
