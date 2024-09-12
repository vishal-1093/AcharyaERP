import { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { convertDateFormat } from "../../utils/Utils";
import useAlert from "../../hooks/useAlert";
const GridIndex = lazy(() => import("../../components/GridIndex"));
const CustomModal = lazy(() => import("../../components/CustomModal"));
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete")
);
const FormWrapper = lazy(() => import("../../components/FormWrapper"));
const ModalWrapper = lazy(() => import("../../components/ModalWrapper"));
const CustomFileInput = lazy(() =>
  import("../../components/Inputs/CustomFileInput")
);

const initialValues = {
  department: "",
  employeeName: "",
  designation: "",
  dateofJoining: "",
  email: "",
  institute: "AUZ",
  document: "",
};
function SalaryIncrementInitIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    dept_id: "",
    fromDate: "",
    toDate: "",
    title: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const setCrumbs = useBreadcrumbs();
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  useEffect(() => {
    getData();
    getDepartmentOptions();
    setCrumbs([{ name: "Employee Details" }]);
  }, []);

  const handleSubmit = async () => {
    if (values.department) {
      setLoading(true);
      const temp = {};
      temp.employeeName = null;
      temp.designation = null;
      temp.department = values.department;
      temp.email = null;
      temp.dateofJoining = null;

      await axios
        .post(
          `/api/incrementCreation/getEmployeeListForIncrementCreation`,
          temp
        )
        .then((res) => {
          setLoading(false);

          setRows(res.data.data);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    } else {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    }
  };

  const getData = async (deptId) => {
    const temp = {};
    temp.employeeName = null;
    temp.designation = null;
    temp.department = null;
    temp.email = null;
    temp.dateofJoining = null;
    await axios
      .post(`/api/incrementCreation/getEmployeeListForIncrementCreation`, temp)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const instituteData = [{ label: "AUZ", value: "AUZ" }];

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getDepartmentOptions = async () => {
    await axios
      .get(`/api/incrementCreation/getDepartments`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.departmentName,
            label: obj.departmentName,
          });
        });
        setDepartmentOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a CSV",
      "Maximum size 2 MB",
    ],
  };

  const checks = {
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".csv"),
      values.document && values.document.size < 2000000,
    ],
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

  const columns = [
    { field: "empCode", headerName: "Employee Code", flex: 1 },

    {
      field: "employeeName",
      headerName: "Employee Name",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row.employeeName} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 150,
            }}
            // onClick={() =>
            //   navigate(`/StudentDetailsMaster/StudentsDetails/${params.row.id}`)
            // }
          >
            {params.row.employeeName.length > 15
              ? `${params.row.employeeName.slice(0, 18)}...`
              : params.row.employeeName}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row.department} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 150,
            }}
          >
            {params.row.department.length > 15
              ? `${params.row.department.slice(0, 18)}...`
              : params.row.department}
          </Typography>
        </Tooltip>
      ),
    },

    { field: "designation", headerName: "Designation", flex: 1 },
    {
      field: "dateofJoining",
      headerName: "Date Of Joining",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.dateofJoining
            ? convertDateFormat(params.row.dateofJoining)
            : "--"}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.email} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 180,
            }}
          >
            {params.row.email?.length > 25
              ? `${params.row.email.slice(0, 25)}...`
              : params.row.email}
          </Typography>
        </Tooltip>
      ),
    },

    {
      field: "Increment",
      type: "actions",
      headerName: "Increment",
      width: 100,
      renderCell: (params) =>
        params.row?.approved_status == 1 || params.row?.approved_status == 2 ? (
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{ paddingLeft: 0, cursor: "pointer", textAlign: "center" }}
            //onClick={()=>navigate(`/SalaryBudgetCreate`,{state:{row:params.row}})}
          >
            {""}
          </Typography>
        ) : (
          <IconButton
            onClick={() =>
              navigate(`/SalaryBudgetCreate`, { state: { row: params.row } })
            }
          >
            <AddIcon />
          </IconButton>
        ),
    },
  ];

  const getCsvData = async () => {
    await axios
      .get(`/api/incrementCreation/getTemporaryIncrementCreationList`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  };

  const handleCreate = async () => {
    const dataArray = new FormData();
    dataArray.append("active", true);
    dataArray.append("file", values.document);

    await axios
      .post(
        `/api/incrementCreation/uploadIncrementCreationFile?month=9&year=2024`,
        dataArray
      )
      .then((res) => {
        getCsvData();
        // setIsSubmit(true);
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error Occured",
        });
        setAlertOpen(true);
      });
  };

  const modalData = () => {
    return (
      <>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Budget Create CSV"
              titleTypographyProps={{ variant: "subtitle2" }}
              sx={{
                backgroundColor: "auzColor.main",
                color: "headerWhite.main",
                padding: 1,
              }}
            />
            <CardContent>
              <CustomFileInput
                name="document"
                label="Document"
                file={values.document}
                helperText="CSV - smaller than 2 MB"
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.document}
                errors={errorMessages.document}
              />
            </CardContent>
            <CardActions sx={{ padding: 2 }}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={12} md={3} align="right">
                  <Button size="small" href={""} download="Document Format">
                    Download Format
                  </Button>
                </Grid>
                <Grid item xs={12} md={3} align="right">
                  <Button
                    variant="contained"
                    onClick={handleCreate}
                    disabled={checks.document.includes(false) === true}
                  >
                    Import
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </>
    );
  };

  return (
    <>
      <ModalWrapper
        maxWidth={900}
        title="Import CSV"
        open={isModalOpen}
        setOpen={setIsModalOpen}
      >
        {modalData()}
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 3 }}>
        <FormWrapper>
          <Grid container columnSpacing={2} rowSpacing={2}>
            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              title={modalContent.title}
              message={modalContent.message}
              buttons={modalContent.buttons}
            />
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="institute"
                label="Institute"
                value={values.institute}
                options={instituteData}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="department"
                label="Department"
                options={departmentOptions}
                value={values.department}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={5} align="right">
              <Button
                onClick={handleSubmit}
                variant="contained"
                disableElevation
                sx={{
                  position: "absolute",
                  right: 140,
                  top: 30,
                  borderRadius: 2,
                }}
              >
                GO
              </Button>
              <Button
                // onClick={() => setIsModalOpen(true)}
                onClick={() => navigate("/BudgetCreateCsv")}
                variant="contained"
                disableElevation
                sx={{
                  position: "absolute",
                  right: 20,
                  top: 30,
                  borderRadius: 2,
                }}
                startIcon={<AddIcon />}
              >
                Import
              </Button>
            </Grid>
          </Grid>
        </FormWrapper>
        <GridIndex
          rows={rows}
          columns={columns}
          getRowId={(row) => row.empId}
        />
      </Box>
    </>
  );
}

export default SalaryIncrementInitIndex;
