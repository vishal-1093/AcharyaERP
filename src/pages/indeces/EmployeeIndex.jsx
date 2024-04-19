import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
import { convertToDMY } from "../../utils/DateTimeUtils";
import { CustomDataExport } from "../../components/CustomDataExport";
import useAlert from "../../hooks/useAlert";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomFileInput from "../../components/Inputs/CustomFileInput";
import moment from "moment";
import Visibility from "@mui/icons-material/Visibility";
const GridIndex = lazy(() => import("../../components/GridIndex"));
const EmployeeDetailsView = lazy(() =>
  import("../../components/EmployeeDetailsView")
);

const initialValues = { document: "" };

const userInitialValues = { employeeEmail: "", roleId: "", document };

const requiredFields = ["document"];

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

function EmployeeIndex() {
  const [rows, setRows] = useState([]);
  const [empId, setEmpId] = useState();
  const [offerId, setOfferId] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userValues, setUserValues] = useState(userInitialValues);
  const [roleOptions, setRoleOptions] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [permanentModalOpen, setPermanentModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    document: [
      values.document,
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
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
        console.log("first", res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleDetails = (params) => {
    setEmpId(params.row.id);
    setOfferId(params.row.offer_id);
    setModalOpen(true);
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "roleId") {
      setUserValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
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
            message: "Form Submitted Successfully",
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

  const handleMakePermanent = (rowData) => {
    const handleOpenPermanent = async () => {
      setRowData(rowData);
      setPermanentModalOpen(true);

      if (rowData.permanent_status === 1) {
        setLoading(true);
        await axios
          .get(
            `/api/employee/employeePermanentFileViews?fileName=${rowData.permanent_file}`,
            {
              responseType: "blob",
            }
          )
          .then((res) => {
            const url = URL.createObjectURL(res.data);
            setFileUrl(url);
            setLoading(false);
          })
          .catch((err) => {
            setAlertMessage({
              severity: "error",
              message: err.response
                ? err.response.data.message
                : "An error occured",
            });
            setAlertOpen(true);
            setLoading(false);
          });
      }
    };

    const oneDay = 1000 * 60 * 60 * 24;
    const date = rowData.to_date?.split("-").reverse().join("-");
    const fromDate = new Date();
    const toDate = new Date(date);
    const timeDifference =
      new Date(toDate).getTime() - new Date(fromDate).getTime();
    const dateDifference = Math.round(timeDifference / oneDay) + 1;

    if (rowData.permanent_status === 1) {
      return (
        <IconButton color="primary" onClick={handleOpenPermanent}>
          <Visibility />
        </IconButton>
      );
    } else if (rowData.empTypeShortName === "PRB") {
      if (dateDifference === 0) {
        return (
          <IconButton color="primary" onClick={handleOpenPermanent}>
            <AddBoxIcon />
          </IconButton>
        );
      }

      if (dateDifference > 0) {
        return dateDifference + " Days left";
      }
    } else {
      return "NA";
    }
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

  const handlePermanentSubmit = async () => {
    setLoading(true);

    const currentDate = moment().format("DD-MM-YYYY");

    await axios
      .post(`/api/employee/makeEmployeePermanent/${rowData.id}/${currentDate}`)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          const dataArray = new FormData();
          dataArray.append("file", values.document);
          dataArray.append("emp_id", rowData.id);

          axios
            .post("/api/employee/employeePermanentFileUpload", dataArray)
            .then((documentRes) => {
              setAlertMessage({
                severity: "success",
                message: "Make permanent successfull !!",
              });
              setAlertOpen(true);
              setLoading(false);
              setPermanentModalOpen(false);
              getData();
            })
            .catch((documentErr) => {
              setAlertMessage({
                severity: "error",
                message: documentErr.response
                  ? documentErr.response.data.message
                  : "An error occured",
              });
            });
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
      });
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
            {params.row.phd_status === "holder"
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
          <>
            {params.row.date_of_joining
              ? `${convertToDMY(params.row.date_of_joining.slice(0, 10))}`
              : ""}
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
      field: "username",
      headerName: "User",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          color="primary"
          onClick={() => getUserDataAndRole(params.row)}
        >
          {params.row.username === null ? <AddBoxIcon /> : <PersonIcon />}
        </IconButton>,
      ],
    },
    {
      field: "new_join_status",
      headerName: "Approve Status",
      flex: 1,
      renderCell: (params) =>
        params.row.new_join_status === 1 ? (
          <Typography variant="subtitle2" color="green">
            Approved
          </Typography>
        ) : (
          <Typography variant="subtitle2" color="error">
            Pending
          </Typography>
        ),
    },
    {
      field: "to_date",
      headerName: "Make Permanent",
      flex: 1,
      align: "center",
      renderCell: (params) => handleMakePermanent(params.row),
    },
    {
      field: "created_by",
      headerName: "Update",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          color="primary"
          onClick={() => navigate(`/employeeupdateform/${params.row.id}`)}
        >
          <EditIcon />
        </IconButton>,
      ],
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
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
              disabled={userLoading}
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
        open={permanentModalOpen}
        setOpen={setPermanentModalOpen}
        title="Make Permanent"
        maxWidth={900}
      >
        <Box p={1}>
          <Card elevation={4}>
            <CardHeader
              title="Employee Details"
              titleTypographyProps={{
                variant: "subtitle2",
              }}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                padding: 1,
              }}
            />
            <CardContent>
              <Grid container rowSpacing={1}>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Employee Name</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">
                    {rowData.employee_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Emp Code</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">{rowData.empcode}</Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Date Of Joining</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">
                    {rowData.date_of_joining}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">
                    Probationary End Date
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">{rowData.to_date}</Typography>
                </Grid>

                {rowData.permanent_status === 1 ? (
                  <>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">
                        Permanent Made On
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">
                        {rowData.date_of_permanent}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">
                        Permanent Made By
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">
                        {rowData.permanent_done_by}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} mt={2}>
                      {loading ? (
                        <Typography variant="subtitle2" color="primary">
                          Document Loading....
                        </Typography>
                      ) : (
                        <>
                          <iframe src={fileUrl} style={{ width: "100%" }} />
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => window.open(fileUrl)}
                          >
                            View Document
                          </Button>
                        </>
                      )}
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} mt={2}>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} md={6} mt={2}>
                      <CustomFileInput
                        name="document"
                        label="Document"
                        file={values.document}
                        handleFileDrop={handleFileDrop}
                        handleFileRemove={handleFileRemove}
                        checks={checks.document}
                        errors={errorMessages.document}
                        helperText="PDF - smaller than 2 MB"
                      />
                    </Grid>
                    <Grid item xs={12} align="right">
                      <Button
                        variant="contained"
                        onClick={handlePermanentSubmit}
                        disabled={loading || !requiredFieldsValid()}
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
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </ModalWrapper>

      {rows.length > 0 && (
        <CustomDataExport dataSet={rows} titleText="Employee Inactive" />
      )}

      <GridIndex
        rows={rows}
        columns={columns}
        getRowClassName={(params) => {
          return params.row.username === null ? "highlight" : "";
        }}
      />
    </Box>
  );
}

export default EmployeeIndex;
