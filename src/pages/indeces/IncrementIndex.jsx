import { useState, useEffect } from "react";
import { Box, Button, IconButton, CircularProgress, Grid } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import moment from "moment";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ModalWrapper from "../../components/ModalWrapper";
import CustomFileInput from "../../components/Inputs/CustomFileInput";

const initialValues = { fileName: "" };

function IncrementIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [incrementCreationIds, setIncrementCreationIds] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

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
       valueGetter: (value, row) =>
        moment(row.dateofJoining).format("DD-MM-YYYY"),
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
      field: "upload",
      headerName: "Upload",
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => handleUploadOpen(params)}>
          <CloudUploadIcon fontSize="small" color="primary" />
        </IconButton>,
      ],
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Increment Index" }]);
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

  const handleApprove = async () => {
    await axios
      .post(`/api/incrementCreation/incrementIsFinalize`, incrementCreationIds)
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

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setIncrementCreationIds(
      selectedRowsData.map(({ incrementCreationId }) => ({
        incrementCreationId,
        isChecked: true,
      }))
    );
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
      <Box sx={{ position: "relative", mt: 4 }}>
        <Button
          onClick={handleApprove}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          disabled={incrementCreationIds.length === 0}
        >
          Finalize
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
export default IncrementIndex;
