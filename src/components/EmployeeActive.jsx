import { useState, useEffect, lazy } from "react";
import axios from "../services/Api";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DownloadIcon from "@mui/icons-material/Download";
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
import EmployeeIDCardDownload from "../components/EmployeeIDCardDownload";
import EmployeeFTEDownload from "../components/EmployeeFTEDownload";
import DownloadAppointmentPdf from "../components/EmployeeAppointmentDownload";
import ContractEmployeePaymentHistory from "../pages/indeces/ContractEmployeePaymentHistory";
import PersonIcon from "@mui/icons-material/Person";

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
  confirmModalOpen: false,
  isOpenJobTypeModal: false,
  jobTypeId: null,
  jobShortName: "",
  jobTypeLists: [],
  permanentEmpId: null,
  jobTypeEmpId: null,
};

const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const extendInitialValues = { fromDate: null, endDate: null, amount: "" };

const requiredFields = [];

const userInitialValues = { employeeEmail: "", roleId: null };

const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;

function EmployeeIndex({ tab }) {
  const [rows, setRows] = useState([]);
  const [empId, setEmpId] = useState();
  const [state, setState] = useState(initialState);
  const [offerId, setOfferId] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openORR, setOpenORR] = useState(false);
  const [openFTE, setOpenFTE] = useState(false);
  const [data, setData] = useState([]);
  const [swapOpen, setSwapOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentEmpId, setPaymentEmpId] = useState();
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [extendValues, setExtendValues] = useState(extendInitialValues);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [extendLoading, setExtendLoading] = useState(false);
  const [loadingRow, setLoadingRow] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(null);
  const [userValues, setUserValues] = useState(userInitialValues);
  const [roleOptions, setRoleOptions] = useState([]);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const classes = useStyles();

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    fromDate: [extendValues.fromDate !== null],
    endDate: [extendValues.endDate !== null],
    amount: [extendValues.amount !== "", /^[0-9]*$/.test(extendValues.amount)],
  };

  const errorMessages = {
    fromDate: ["This field required"],
    endDate: ["This field required"],
    amount: ["This field is required", "Invalid Input"],
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

  const handleDownloadEmployeeDocuments = async (empId, type) => {
    await axios
      .get(`/api/employee/getEmployeeDetailsForReportingById?empId=${empId}`)
      .then((res) => {
        setData(res?.data?.data);
        if (type === "ORR") {
          setOpenORR(true);
          // handleAPTDocDownload(res?.data?.data);
        } else if (type === "FTE") {
          setOpenFTE(true);
          // handleFTEDocDownload(res?.data?.data);
        } else if (type === "ID_CARD") {
          setOpen(true);
          // generatePdf(res?.data?.data, setLoading);
        }
        setLoadingRow(null);
        setLoadingDoc(false);
      })
      .catch((err) => console.error(err));
  };
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
              dept_name_short: obj?.dept_name_short,
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
    if (name === "roleId") {
      setUserValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    if (name === "schoolId") {
      setValues((prev) => ({
        ...prev,
        schoolId: newValue,
        deptId: "",
        schoolShortName: schoolOptions?.find((el) => el?.value == newValue)
          .school_name_short,
      }));
      setDepartmentOptions([]);
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        deptShortName: departmentOptions?.find((el) => el?.value == newValue)
          ?.dept_name_short,
      }));
    }
  };

  const getData = async () => {
    if (tab === "Consultant") {
      await axios
        .get(
          `/api/employee/fetchAllEmployeeDetails?page=${0}&page_size=${10000}&sort=created_date`
        )
        .then((res) => {
          const ConsultantData =
            res?.data?.data?.Paginated_data?.content?.filter(
              (o) => o?.empTypeShortName === "CON"
            );
          setRows(ConsultantData);
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/employee/fetchAllEmployeeDetails?page=${0}&page_size=${10000}&sort=created_date`
        )
        .then((res) => {
          const StaffData = res?.data?.data?.Paginated_data?.content?.filter(
            (o) => o?.empTypeShortName !== "CON"
          );
          setRows(StaffData);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleDetails = (params) => {
    setEmpId(params.row.id);
    setOfferId(params.row.offer_id);
    setModalOpen(true);
  };
  const onClosePopUp = () => {
    setValues(initialValues);
    setSwapOpen(false);
    setPaymentOpen(false);
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
  const handleChangeContract = (params) => {
    // navigate(`/ContractEmployeePaymentHistory/${params?.row?.id}`);
    setPaymentOpen(true);
    setPaymentEmpId(params);
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
                `/EmployeeDetailsView/${params.row.id}/${params.row.offer_id}/profile`,
                { state: true }
              )
            }
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
              cursor: "pointer",
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
      hide: tab === "Consultant" ? true : false,
      hideable: false,
      renderCell: (params) => (
        <div onClick={() => handleChangeSwap(params)}>{params.value}</div>
      ),
    },
    {
      field: "designation_short_name",
      headerName: "Designation",
      flex: 1,
      hide: tab === "Consultant" ? true : false,
    },
    {
      field: "job_type",
      headerName: "Job Type",
      flex: 1,
      hide: tab === "Consultant" ? true : false,
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
      hide: tab === "Consultant" ? true : false,
      renderCell: (params) => {
        return (
          <>{params.row?.date_of_joining ? params.row?.date_of_joining : "-"}</>
        );
      },
    },
    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
      hide: tab === "Consultant" ? false : true,
      renderCell: (params) => {
        return (
          <>{params.row?.date_of_joining ? params.row?.date_of_joining : "-"}</>
        );
      },
    },
    {
      field: "to_date",
      headerName: tab === "Consultant" ? "To Date" : "Probation End Date",
      flex: 1,
      hide: tab === "Consultant" ? false : true,
      renderCell: (params) => {
        return <>{params.row?.to_date ? params.row?.to_date : "-"}</>;
      },
    },
    {
      field: "mobile",
      headerName: "Phone",
      flex: 1,
      renderCell: (params) => {
        const mobile = params.row?.mobile;
        if (mobile && mobile.length === 10) {
          const maskedMobile = `${mobile.slice(0, 2)}XXXXXX${mobile.slice(8)}`;
          return <>{maskedMobile}</>;
        }
        return <>{mobile ? mobile : ""}</>;
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
      field: "username",
      headerName: "User Creation",
      flex: 1,
      renderCell: (params) =>
        params.row.username === null ? (
          <IconButton onClick={() => getUserDataAndRole(params.row)}>
            <AddBoxIcon color="primary" />
          </IconButton>
        ) : (
          <IconButton>
            <PersonIcon color="primary" />
          </IconButton>
        ),
    },
    {
      field: "confirm",
      headerName: "Confirm",
      flex: 1,
      hide: true,
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
      headerName: "Extend Date / Add",
      flex: 1,
      hide: true,
      renderCell: (params) =>
        params.row.empTypeShortName === "FTE" &&
        new Date(moment(new Date()).format("YYYY-MM-DD")) >=
          new Date(params.row.to_date?.split("-").reverse().join("-")) ? (
          <IconButton onClick={() => handleExtendDate(params.row)}>
            <AddBoxIcon color="primary" />
          </IconButton>
        ) : params.row.empTypeShortName === "CON" &&
          new Date(moment(new Date()).format("YYYY-MM-DD")) >=
            new Date(params.row.to_date?.split("-").reverse().join("-")) ? (
          <IconButton onClick={() => handleExtendDate(params.row, "extend")}>
            <AddBoxIcon color="primary" />
          </IconButton>
        ) : params.row.empTypeShortName === "CON" &&
          new Date(moment(new Date()).format("YYYY-MM-DD")) <
            new Date(params.row.to_date?.split("-").reverse().join("-")) ? (
          <IconButton onClick={() => handleExtendDate(params.row, "add")}>
            <AddBoxIcon color="primary" />
          </IconButton>
        ) : (
          params.row.to_date
        ),
    },
    // &&
    // new Date(moment(new Date()).format("YYYY-MM-DD"))
    {
      field: "id",
      headerName: "swap",
      flex: 1,
      type: "actions",
      hide: true,
      getActions: (params) => [
        <IconButton color="primary" onClick={() => handleChangeSwap(params)}>
          <SwapHorizIcon />
        </IconButton>,
      ],
    },
    {
      field: "Id Card",
      headerName: "ID Card",
      flex: 1,
      hide: true,
      type: "actions",
      getActions: (params) => [
        loadingRow !== params?.row?.id ? (
          <IconButton
            color="primary"
            onClick={() => {
              setLoadingRow(params.row.id);
              handleDownloadEmployeeDocuments(params?.row?.id, "ID_CARD");
            }}
          >
            <DownloadIcon />
          </IconButton>
        ) : (
          <CircularProgress size={25} color="primary" />
        ),
      ],
    },
    {
      field: "contract",
      headerName: "Contract",
      flex: 1,
      hide: true,
      type: "actions",
      getActions: (params) => [
        params?.row?.empTypeShortName !== "CON" &&
        loadingDoc !== params.row.id ? (
          <IconButton
            key="download"
            color="primary"
            onClick={() => {
              setLoadingDoc(params.row.id);
              handleDownloadEmployeeDocuments(
                params?.row?.id,
                params?.row?.empTypeShortName
              );
            }}
          >
            <DownloadIcon />
          </IconButton>
        ) : params?.row?.empTypeShortName !== "CON" ? (
          <>
            <CircularProgress size={25} color="primary" />
          </>
        ) : (
          <></>
        ),
      ],
    },
  ];
  if (tab === "Consultant") {
    columns.push({
      field: "paymentHistory",
      headerName: "Payment history",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          color="primary"
          onClick={() => handleChangeContract(params)}
        >
          <ReceiptIcon />
        </IconButton>,
      ],
    });
  }
  if (roleShortName === "SAA") {
    columns.push({
      field: "created_by",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() =>
            navigate(
              `/employeeupdateform/${params.row.id}/${params.row.offer_id}/${params.row.job_id}`
            )
          }
        >
          <EditIcon />
        </IconButton>
      ),
    });
  }

  if (roleId !== 6) {
    columns.splice(18, 0, {
      field: "ctc",
      headerName: tab === "Consultant" ? "Total" : "CTC",
      flex: 1,
      hide: tab === "Consultant" ? false : true,
      renderCell: (params) => {
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "right",
              width: 100,
            }}
          >
            {params.row?.empTypeShortName === "CON"
              ? params.row?.consolidated_amount
              : params.row?.ctc}
          </div>
        );
      },
    });
  }

  const onClickConfirm = (params) => {
    setState((prevState) => ({
      ...prevState,
      empNameCode: `${params.row?.employee_name}   ${params.row?.empcode}`,
      probationEndDate: params.row?.to_date
        ? convertStringToDate(params.row?.to_date)
        : null,
      permanentEmpId: params.row?.id,
      confirmModalOpen: !state.confirmModalOpen,
    }));
  };

  const handleConfirmModal = () => {
    setState((prevState) => ({
      ...prevState,
      confirmModalOpen: !state.confirmModalOpen,
      permanentEmpId: null,
    }));
  };

  const onClickJobType = (params) => {
    setState((prevState) => ({
      ...prevState,
      jobTypeId: params.row?.job_type_id,
      jobShortName: params.row?.job_short_name,
      jobTypeEmpId: params.row?.id,
      isOpenJobTypeModal: !state.isOpenJobTypeModal,
    }));
  };

  const handleJobTypeModal = () => {
    setState((prevState) => ({
      ...prevState,
      isOpenJobTypeModal: !state.isOpenJobTypeModal,
      jobTypeEmpId: null,
    }));
  };

  const handleExtendDate = (data, status) => {
    setExtendValues(extendInitialValues);

    if (data.empTypeShortName === "CON") {
      let cols =
        status === "extend"
          ? ["fromDate", "endDate", "amount", "remarks"]
          : ["amount", "remarks"];

      cols.forEach((obj) => {
        if (requiredFields.includes(obj) === true) {
          const getIndex = requiredFields.indexOf(obj);
          requiredFields.splice(getIndex, 1);
        } else {
          requiredFields.push(obj);
        }
      });
    }

    if (data.empTypeShortName === "FTE") {
      if (requiredFields.includes("endDate") === true) {
        const getIndex = requiredFields.indexOf("endDate");
        requiredFields.splice(getIndex, 1);
      } else {
        requiredFields.push("endDate");
      }
    }

    data.displayType = status;
    setRowData(data);
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

    if (
      rowData.empTypeShortName === "FTE" ||
      rowData.displayType === "extend"
    ) {
      const toDate = moment(extendValues.endDate).format("DD-MM-YYYY");
      temp.to_date = `<font color='blue'>${toDate}</font>`;
      empData.to_date = toDate;
    }

    if (
      rowData.empTypeShortName === "CON" &&
      rowData.displayType === "extend"
    ) {
      empData.date_of_joining = moment(extendValues.fromDate).format(
        "DD-MM-YYYY"
      );
      temp.date_of_joining = `<font color='blue'>${moment(
        extendValues.fromDate
      ).format("DD-MM-YYYY")}</font>`;
    }

    if (
      rowData.empTypeShortName === "CON" &&
      (rowData.displayType === "extend" || rowData.displayType === "add")
    ) {
      empData.consolidated_amount =
        empData.consolidated_amount + extendValues.amount;
      temp.consolidated_amount = `<font color='blue'>${
        empData.consolidated_amount + extendValues.amount
      }</font>`;
    }

    setExtendLoading(true);
    await axios
      .put(`/api/employee/EmployeeDetails/${rowData.id}`, empData)
      .then((res) => {
        if (rowData.empTypeShortName === "CON") {
          const consultant = {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            amount: extendValues.amount,
            empId: rowData.id,
            fromDate:
              rowData.displayType === "add"
                ? rowData.date_of_joining.split("-").reverse().join("-")
                : moment(extendValues.fromDate).format("YYYY-MM-DD"),
            toDate:
              rowData.displayType === "add"
                ? rowData.to_date.split("-").reverse().join("-")
                : moment(extendValues.endDate).format("YYYY-MM-DD"),
            remarks: extendValues.remarks,
          };

          axios
            .post("/api/consoliation/saveAdditionAmount", consultant)
            .then((conRes) => {})
            .catch((conErr) => console.error(conErr));
        }

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

  const getUserDataAndRole = async (rowData) => {
    // get Email
    setUserValues((prev) => ({
      ...prev,
      employeeEmail: rowData.email,
    }));

    // get Roles
    await axios
      .get(`/api/Roles`)
      .then((res) => {
        setRoleOptions(
          res.data.data.map((obj) => ({
            value: obj.role_id,
            label: obj.role_name,
          }))
        );
      })
      .catch((err) => console.error(err));

    setUserModalOpen(true);
  };

  const handleUserCreate = async () => {
    const getUserName = userValues.employeeEmail.split("@");
    const temp = {};
    temp.active = true;
    temp.username = getUserName[0];
    temp.email = userValues.employeeEmail;
    temp.usertype = "staff";
    temp.role_id = [userValues.roleId];

    setUserLoading(true);

    await axios
      .post(`/api/UserAuthentication`, temp)
      .then((res) => {
        getData();
        setUserLoading(false);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "User created successfully !!",
          });
          setAlertOpen(true);
          setUserModalOpen(false);
        } else {
          setUserLoading(false);
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "An error occured",
          });
          setAlertOpen(true);
        }
      })
      .catch((error) => {
        setUserLoading(false);
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      {/* User Creation  */}
      <ModalWrapper
        open={userModalOpen}
        setOpen={setUserModalOpen}
        maxWidth={800}
        title="User Creation"
      >
        <Grid
          container
          justifyContent="flex-start"
          rowSpacing={3}
          columnSpacing={3}
          mt={2}
        >
          <Grid item xs={12} md={5}>
            <CustomTextField
              name="employeeEmail"
              label="Email"
              value={userValues.employeeEmail}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <CustomAutocomplete
              name="roleId"
              label="Role"
              value={userValues.roleId}
              options={roleOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={userLoading || userValues.roleId === null}
              onClick={handleUserCreate}
            >
              {userLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Create"
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

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
          empId={state.permanentEmpId}
          getData={getData}
        />
      )}

      {paymentOpen && (
        <ModalWrapper
          title="Payment History"
          maxWidth={1000}
          open={paymentOpen}
          setOpen={onClosePopUp}
        >
          <ContractEmployeePaymentHistory paymentEmpId={paymentEmpId} />
        </ModalWrapper>
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
            empId={state.jobTypeEmpId}
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
            : rowData.employee_name) +
          (rowData.displayType === "add"
            ? " - Add Amount"
            : " - Extend End Date")
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

            {rowData.empTypeShortName === "FTE" ? (
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
            ) : (
              <>
                {rowData.displayType === "extend" ? (
                  <>
                    <Grid item xs={12}>
                      <CustomDatePicker
                        name="fromDate"
                        label="From Date"
                        value={extendValues.fromDate}
                        handleChangeAdvance={handleChangeAdvanceExtend}
                      />
                    </Grid>

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
                  </>
                ) : (
                  <></>
                )}

                <Grid item xs={12}>
                  <CustomTextField
                    name="amount"
                    label="Amount"
                    value={extendValues.amount}
                    handleChange={handleChange}
                    checks={checks.amount}
                    errors={errorMessages.amount}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomTextField
                    name="remarks"
                    label="Remarks"
                    value={extendValues.remarks}
                    handleChange={handleChange}
                    multiline
                    rows={2}
                    required
                  />
                </Grid>
              </>
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
      {open && (
        <EmployeeIDCardDownload
          setOpen={setOpen}
          open={open}
          employeeDocuments={data}
        />
      )}
      {openORR && (
        <DownloadAppointmentPdf
          setOpen={setOpenORR}
          open={openORR}
          employeeDocuments={data}
        />
      )}
      {openFTE && (
        <EmployeeFTEDownload
          setOpen={setOpenFTE}
          open={openFTE}
          employeeDocuments={data}
        />
      )}
    </Box>
  );
}

export default EmployeeIndex;
