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
import { useNavigate } from "react-router-dom";
import ModalWrapper from "./ModalWrapper";
import { CustomDataExport } from "../components/CustomDataExport";
import { EmployeeTypeConfirm } from "../components/EmployeeTypeConfirm";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CustomDatePicker from "./Inputs/CustomDatePicker";
import moment from "moment";
import useAlert from "../hooks/useAlert";

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

const initialState = {
  empNameCode: "",
  probationEndDate: "",
  confirmModalOpen: false,
};

const initialValues = { fromDate: null, endDate: null };

const requiredFields = [];

const roleName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;

function EmployeeIndex() {
  const [rows, setRows] = useState([]);
  const [empId, setEmpId] = useState();
  const [state, setState] = useState(initialState);
  const [offerId, setOfferId] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    fromDate: [values.dateofJoining !== null],
    endDate: [values.endDate !== null],
  };

  const errorMessages = {
    fromDate: ["This field required"],
    endDate: ["This field required"],
  };

  useEffect(() => {
    setCrumbs([{ name: "Employee Index" }]);
    getData();
  }, []);

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

  const columns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hideable: false },
    {
      field: "employee_name",
      headerName: "Employee Name",
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
            {params.row.phd_status === "holder"
              ? "Dr. " + params?.row?.employee_name?.toLowerCase()
              : params?.row?.employee_name?.toLowerCase()}
          </Typography>
        </HtmlTooltip>
      ),
    },
    {
      field: "empTypeShortName",
      headerName: "Type",
      flex: 1,
      hideable: false,
    },
    // { field: "email", headerName: "Email", flex: 1, hideable: false },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      hideable: false,
    },
    {
      field: "dept_name_short",
      headerName: "Department",
      flex: 1,
      hideable: false,
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
          <>{params.row.date_of_joining ? params.row.date_of_joining : "-"}</>
        );
      },
    },
    {
      field: "to_date",
      headerName: "Probation End Date",
      flex: 1,
      hide: true,
      renderCell: (params) => {
        return <>{params.row.to_date ? params.row.to_date : "-"}</>;
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
            <IconButton
              disabled={params.row.empTypeShortName !== "ORR"}
              color="primary"
              onClick={() => handleConfirmModal(params)}
            >
              <PlaylistAddIcon sx={{ fontSize: 22 }} />
            </IconButton>
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
            {params.row.empTypeShortName === "CON"
              ? params.row.consolidated_amount
              : params.row.ctc}
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
        params.row.new_join_status === 1 ? (
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
        new Date(moment(new Date()).format("YYYY-MM-DD")) >=
          new Date(params?.row?.to_date?.split("-").reverse().join("-")) ? (
          <IconButton onClick={() => handleExtendDate(params.row)}>
            <AddBoxIcon color="primary" />
          </IconButton>
        ) : (
          <></>
        ),
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
          onClick={() => navigate(`/employeeupdateform/${params.row.id}`)}
        >
          <EditIcon />
        </IconButton>
      ),
    });
  }

  const handleConfirmModal = (params) => {
    setState((prevState) => ({
      ...prevState,
      empNameCode: `${params.row?.employee_name}   ${params.row?.empcode}`,
      probationEndDate: params.row?.to_date,
      confirmModalOpen: !state.confirmModalOpen,
    }));
  };

  const handleExtendDate = (data) => {
    setValues(initialValues);
    if (data.empTypeShortName === "CON") {
      ["fromDate", "endDate"].forEach((obj) => {
        requiredFields.push(obj);
      });
    } else {
      requiredFields.push("endDate");
    }
    setRowData(data);
    setExtendModalOpen(true);
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
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
      } else if (!values[field]) return false;
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
    const toDate = moment(values.endDate).format("DD-MM-YYYY");
    temp.to_date = `<font color='blue'>${toDate}</font>`;
    empData.to_date = toDate;

    await axios
      .put(`/api/employee/EmployeeDetails/${rowData.id}`, empData)
      .then((res) => {
        axios
          .post(`/api/employee/employeeDetailsHistory`, temp)
          .then((resHis) => {
            setLoading(false);
            setExtendModalOpen(false);
            setAlertMessage({
              severity: "success",
              message: "To Date extended successfully !!",
            });
            setAlertOpen(true);
          })
          .catch((errHis) => console.error(errHis));
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <EmployeeDetailsView empId={empId} offerId={offerId} />
      </ModalWrapper>

      {!!state.confirmModalOpen && (
        <EmployeeTypeConfirm
          handleConfirmModal={handleConfirmModal}
          empNameCode={state.empNameCode}
          probationEndDate={state.probationEndDate}
        />
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
                {rowData.ctc}
              </Typography>
            </Grid>

            {rowData.empTypeShortName === "CON" ? (
              <Grid item xs={12}>
                <CustomDatePicker
                  name="fromDate"
                  label="From Date"
                  value={values.fromDate}
                  handleChangeAdvance={handleChangeAdvance}
                />
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={12}>
              <CustomDatePicker
                name="endDate"
                label="End Date"
                value={values.endDate}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Stack direction="row" spacing={1} justifyContent="right">
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() =>
                    navigate(
                      `/SalaryBreakupForm/New/${rowData?.job_id}/${rowData?.offer_id}/extend`
                    )
                  }
                >
                  Change Amount
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCreate}
                  disabled={!requiredFieldsValid()}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      {rows.length > 0 && (
        <CustomDataExport dataSet={rows} titleText="Employee Inactive" />
      )}
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default EmployeeIndex;
