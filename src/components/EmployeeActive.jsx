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
import { useNavigate } from "react-router-dom";
import ModalWrapper from "./ModalWrapper";
import { CustomDataExport } from "../components/CustomDataExport";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";
import useAlert from "../hooks/useAlert";
import { EmployeeTypeConfirm } from "../components/EmployeeTypeConfirm";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { convertStringToDate } from "../utils/DateTimeUtils";

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
};

const initialState = {
  empNameCode: "",
  probationEndDate: "",
  empId: null,
  confirmModalOpen: false,
};
const roleName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;

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
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [isLoading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Employee Index" }]);
    getData();
    getSchoolDetails();
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
            });
          });
          setDepartmentOptions(data);
        })
        .catch((err) => console.error(err));
    }
  };
  const handleChangeAdvance = (name, newValue) => {
    if (name === "schoolId") {
      setValues((prev) => ({
        ...prev,
        schoolId: newValue,
        deptId: "",
      }));
      setDepartmentOptions([]);
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
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
    })
  };

  const updateDeptAndSchoolOfEmployee = async () => {
    setLoading(true);
    const temp = {};
    temp.emp_id = empId;
    temp.school_id = values.schoolId;
    temp.dept_id = values.deptId;

    await axios
      .put(`/api/employee/updateDeptAndSchoolOfEmployee/${empId}`, temp)
      .then((res) => {
        console.log(res, "res");
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
      headerName: "Name",
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
      headerName: "Employee Type",
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
                onClick={() => handleChange(params)}
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
      hideable: false,
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

  const handleChange = (params) => {
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
          empId={state.empId}
        />
      )}

      {rows.length > 0 && (
        <CustomDataExport dataSet={rows} titleText="Employee Inactive" />
      )}
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default EmployeeIndex;
