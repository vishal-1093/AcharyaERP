import { useState, useEffect, lazy } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import useAlert from "../../../hooks/useAlert";
import { convertDateFormat } from "../../../utils/Utils";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomModal from "../../../components/CustomModal";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const GridIndex = lazy(() => import("../../../components/GridIndex"));

const initialValues = {
  document: "",
  month: null,
  date: "",
  schoolId: "",
  studentId: "",
  programId: "",
  empId: "",
};
function BudgetIncrementIndex() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const empId = localStorage.getItem("empId");
  const [values, setValues] = useState(initialValues);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [incrementOpen, setIncrementOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    getData();
    getEmployeeData();
    setCrumbs([{ name: "Budget Index" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/incrementCreation/getIncrementCreationList`)
      .then((res) => {
        const temp = [];
        res.data.data.filter((obj, index) => {
          if (obj.isChecked === false || obj.isChecked === null) {
            temp.push({ ...obj, id: index });
          }
        });
        setRows(temp);
      })
      .catch((err) => console.error(err));
  };

  const getEmployeeData = async () => {
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
        const employeeData = [];
        res.data.data.forEach((obj) => {
          employeeData.push({
            label:
              obj.employeeName + "-" + obj.empCode + "-" + obj.dept_name_short,
            value: obj.empId,
            ...obj,
          });
        });
        setEmployeeOptions(employeeData);
      })
      .catch((err) => console.error(err));
  };

  const handleUploadOpen = () => {
    if (selectedRows.length > 0) {
      setUploadOpen(true);
    } else {
      setAlertMessage({
        severity: "error",
        message: "Please select the checkbox",
      });
      setAlertOpen(true);
    }
  };
  const handleIncrementOpen = () => {
    setValues(initialValues);
    setIncrementOpen(true);
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const increment = async (params) => {
    const employee = employeeOptions?.find((obj) => obj.value === params);
    if (employee?.permanent_status === 1) {
      setModalOpen(true);
      setModalContent({
        message: "Staff is probationary, Do you want to continue??",
        buttons: [
          {
            name: "Yes",
            color: "primary",
            func: () =>
              navigate(`/SalaryBudgetCreate`, { state: { row: employee } }),
          },
          { name: "No", color: "primary", func: () => { } },
        ],
      });
    } else {
      navigate(`/SalaryBudgetCreate`, { state: { row: employee } });
    }
  };
  const columns = [
    {
      field: "empCode",
      headerName: "Staff Code",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.empCode ? params.row?.empCode : params.row?.empCode}
        </Typography>
      ),
    },

    {
      field: "employeeName",
      headerName: "Employee Name",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.employeeName} arrow>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 130,
            }}
          >
            {params.row.employeeName?.length > 20
              ? `${params.row.employeeName?.slice(0, 22)}...`
              : params.row.employeeName}
          </Typography>
        </Tooltip>
      ),
    },

    {
      field: "previousDesignation",
      headerName: "Current Designation",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.previousDesignation
            ? params.row?.previousDesignation
            : "-"}
        </Typography>
      ),
    },

    {
      field: "dateofJoining",
      headerName: "DOJ",
      flex: 1,
      type: "date",
      hide: true,
      valueGetter: (params) =>
        params.row.dateofJoining
          ? convertDateFormat(params.row.dateofJoining)
          : "--",
    },
    {
      field: "previousDepartment",
      headerName: "Department",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.previousDepartment ? params.row.previousDepartment : "--",
    },

    {
      field: "previousSalaryStructure",
      headerName: "Current Salary Structure",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.previousSalaryStructure
            ? params.row?.previousSalaryStructure
            : "--"}
        </Typography>
      ),
    },

    {
      field: "experience",
      headerName: "Experience",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.experience ? params.row?.experience : "-"}
        </Typography>
      ),
    },

    {
      field: "previousBasic",
      headerName: "Current Basic",
      flex: 1,
      hide: true,
    },

    {
      field: "previousSplPay",
      headerName: "Current SplPay",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.previousSplPay ? params.row?.previousSplPay : "-"}
        </Typography>
      ),
    },

    {
      field: "previousGrosspay",
      headerName: "Current Gross",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.previousGrosspay ? params.row?.previousGrosspay : "-"}
        </Typography>
      ),
    },

    {
      field: "previousMedicalReimburesment",
      headerName: "Medical Reimburesment",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.previousMedicalReimburesment
            ? params.row?.previousMedicalReimburesment
            : "-"}
        </Typography>
      ),
    },

    {
      field: "previousCtc",
      headerName: "Current CTC",
      flex: 1,
      type: "date",
      hide: true,
      valueGetter: (params) =>
        params.row.previousCtc ? params.row.previousCtc : "",
    },
    {
      field: "proposedDesignation",
      headerName: "Designation Name",
      flex: 1,
      hide: true,
    },
    {
      field: "proposedSalaryStructure",
      headerName: "Salary Structure",
      flex: 1,
    },
    {
      field: "Month",
      headerName: "From Month",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.month ? `${params.row.month}/${params.row.year}` : "--",
    },
    {
      field: "proposedBasic",
      headerName: "Proposed Basic",
      flex: 1,
      hide: true,
    },
    {
      field: "proposedSplPay",
      headerName: "Proposed SplPay",
      flex: 1,
      hide: true,
    },
    { field: "proposedGrosspay", headerName: "Proposed Gross", flex: 1 },
    { field: "proposedCtc", headerName: "Proposed CTC", flex: 1, hide: true },

    { field: "grossDifference", headerName: "Gross Difference ", flex: 1 },
    { field: "ctcDifference", headerName: " CTC Difference", flex: 1 },
    {
      field: "edit",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          key="edit"
          onClick={() =>
            navigate("/SalaryBudgetCreate", { state: { row: params.row } })
          }
          sx={{ padding: 0 }}
        >
          <EditIcon />
        </IconButton>,
      ],
    },

    // {
    //   field: "upload",
    //   headerName: "Upload",
    //   type: "actions",
    //   getActions: (params) => [
    //     <IconButton onClick={() => handleUploadOpen(params)}>
    //       <CloudUploadIcon fontSize="small" color="primary" />
    //     </IconButton>,
    //   ],
    // },
  ];
  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const checks = {
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
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


  const handleCreate = async () => {
    if (!values.document) {
      setAlertMessage({
        severity: "error",
        message: "Please upload a PDF",
      });
      setAlertOpen(true);
    } else {
      try {
        // const dataArray = new FormData();
        // dataArray.append(
        //   "request",
        //   JSON.stringify({
        //     incrementIds: selectedRows.map((obj) => obj?.incrementCreationId),
        //   })
        // );
        // dataArray.append("file", values.document);

        // // First request to upload the file
        // await axios.post(
        //   `/api/incrementCreation/uploadIncrementFile`,
        //   dataArray
        // );

        // Convert selectedRows to a comma-separated string for the second request
        const selectedIdsString = selectedRows
          .map((obj) => obj?.incrementCreationId)
          .join(",");

        // Second request to finalize increments with selected IDs
        await axios
          .post(
            `/api/incrementCreation/incrementIsFinalize/${selectedIdsString}`
          )
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              setAlertMessage({ severity: "success", message: "Finalized" });
              setAlertOpen(true);
              getData();
              setValues(initialValues);
            }
          });
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error Occurred",
        });
        setAlertOpen(true);
      }
    }
  };

  const handleUpload = async () => {
    if (!values.document) {
      setAlertMessage({
        severity: "error",
        message: "Please upload a PDF",
      });
      setAlertOpen(true);
    } else {
      const rowUniqueIds = {};
      rowUniqueIds.incrementIds = selectedRows.map(
        (obj) => obj.incrementCreationId
      );

      const dataArray = new FormData();
      dataArray.append("file", values.document);
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
    }
  };
  const handleApprove = async () => {
    // Convert selectedRows to a comma-separated string for the second request
    const selectedIdsString = selectedRows
      .map((obj) => obj?.incrementCreationId)
      .join(",");

    await axios
      .post(`/api/incrementCreation/incrementIsFinalize/${selectedIdsString}`)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Finalized" });
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
  const handleActive = async () => {
    if (!values.document) {
      setAlertMessage({
        severity: "error",
        message: "Please upload a PDF",
      });
      setAlertOpen(true);
    } else {
      setModalContent({
        title: "Approver",
        message: "Do you really want to finalize & move to approver screen?",
        buttons: [
          { name: "Yes", color: "primary", func: () => handleCreate() },
          { name: "No", color: "primary", func: () => { } },
        ],
      });
      setModalOpen(true);
    }
  };
  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      {/* <Box sx={{ position: "relative", mt: 3 }}> */}
      {/* <CustomFileInput
          name="document"
          label="Document"
          file={values.document}
          helperText="PDF - smaller than 2 MB"
          handleFileDrop={handleFileDrop}
          handleFileRemove={handleFileRemove}
          checks={checks.document}
          errors={errorMessages.document}
        /> */}

      <Grid item xs={12} md={12} display="flex" justifyContent="flex-end" gap={3} mb={2}>

        <Button
          onClick={() => handleUploadOpen()}
          variant="contained"
          disableElevation
          sx={{ borderRadius: 2 }}
        >
          Upload File
        </Button>
        <Button
          onClick={() => handleActive()}
          variant="contained"
          disableElevation
          sx={{ borderRadius: 2 }}
          disabled={selectedRows.length === 0}
        >
          Finalize
        </Button>
        <Button
          onClick={() => handleIncrementOpen()}
          variant="contained"
          disableElevation
          sx={{ borderRadius: 2 }}
        >
          Create
        </Button>
      </Grid>

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
              name="document"
              label="Document"
              file={values.document}
              helperText="PDF - smaller than 2 MB"
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checks.document}
              errors={errorMessages.document}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              // disabled={loading}
              onClick={handleUpload}
              disabled={
                !values?.document?.name?.endsWith(".pdf") ||
                values?.document?.size > 2000000
              }
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
        title="Employee Increment"
        maxWidth={800}
        open={incrementOpen}
        setOpen={setIncrementOpen}
      >
        <Grid
          container
          rowSpacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="empId"
              value={values.empId}
              label="Employee"
              handleChangeAdvance={handleChangeAdvance}
              options={employeeOptions}
            />
          </Grid>
          <Grid item xs={12} md={6}>

          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={() => increment(values?.empId)}
              disabled={!values?.empId}
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
        </Grid>
      </ModalWrapper>
      <GridIndex
        rows={rows}
        columns={columns}
        getRowId={(row) => row.incrementCreationId}
        checkboxSelection={true}
        onSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          const selectedRows = rows.filter((row) =>
            selectedIDs.has(row.incrementCreationId)
          );
          setSelectedRows(selectedRows);
        }}
      />
      {/* </Box> */}
    </>
  );
}

export default BudgetIncrementIndex;
