import { useEffect, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import moment from "moment";
import { Box, Button, Grid, IconButton, Stack } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import useAlert from "../../hooks/useAlert";
import CustomModal from "../../components/CustomModal";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import ModalWrapper from "../../components/ModalWrapper";
import { useNavigate } from "react-router-dom";
import EmpRelieveForm from "../forms/employeeMaster/EmpRelieveForm";
import EmpRetainForm from "../forms/employeeMaster/EmpRetainForm";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import EmpDirectRelieveForm from "../forms/employeeMaster/EmpDirectRelieveForm";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionSharpIcon from "@mui/icons-material/DescriptionSharp";
import ResignationUpload from "../forms/employeeMaster/ResignationUpload";
import PrintIcon from "@mui/icons-material/Print";
import { GenerateNoduesPrint } from "../forms/employeeMaster/GenerateNoduesPrint";
import OverlayLoader from "../../components/OverlayLoader";

function EmployeeResignationIndex() {
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 50,
    total: 0,
  });
  const [filterString, setFilterString] = useState("");
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [noDueData, setNoDueData] = useState([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [initiateOpen, setInitiateOpen] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [values, setValues] = useState({ userId: null });
  const [relieveModalOpen, setRelieveModalOpen] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [noDueApproved, setNoDueApproved] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Employee Relieving" }]);
  }, [paginationData.page, paginationData.pageSize, filterString]);

  const getData = async () => {
    setPaginationData((prev) => ({
      ...prev,
      loading: true,
    }));

    const searchString = filterString !== "" ? "&keyword=" + filterString : "";

    await axios(
      `/api/employee/fetchAllResignationDetails?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date${searchString}`
    )
      .then((res) => {
        setPaginationData((prev) => ({
          ...prev,
          rows: res.data.data.Paginated_data.content,
          total: res.data.data.Paginated_data.totalElements,
          loading: false,
        }));
      })
      .catch((err) => console.error(err));
  };

  const handleOnPageChange = (newPage) => {
    setPaginationData((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleOnPageSizeChange = (newPageSize) => {
    setPaginationData((prev) => ({
      ...prev,
      pageSize: newPageSize,
    }));
  };

  const handleOnFilterChange = (value) => {
    setFilterString(
      value.items.length > 0
        ? value.items[0].value === undefined
          ? ""
          : value.items[0].value
        : value.quickFilterValues.join(" ")
    );
  };

  const handleUpdateNodueStatus = (data) => {
    return new Promise(async (resolve, reject) => {
      const resignationData = await axios
        .get(`/api/employee/resignation/${data.id}`)
        .then((res) => res.data.data)
        .catch((err) => console.error(err));

      if (resignationData.resignation_id) {
        resignationData.nodues_approve_status = 1;

        await axios
          .put(`/api/employee/resignation/${data.id}`, resignationData)
          .then((res) => resolve(res.data.success))
          .catch((err) => reject(err));
      }
    });
  };

  const handleCreateNodueData = (data) => {
    return new Promise(async (resolve, reject) => {
      // Get all HOD admins from various department
      const getHodAdmins = await axios
        .get("/api/getDepartmentBasedOnHodId")
        .then((res) => res.data.data)
        .catch((err) => console.error(err));

      const hodIds = [];
      const postNodueData = [];
      // Create post body format
      getHodAdmins.forEach((obj) => {
        hodIds.push({ [obj.id]: obj.hod_id });
        postNodueData.push({
          active: true,
          department_id: data.dept_id,
          employee_Id: data.emp_id,
          resignation_id: data.id,
          approver_id: obj.hod_id,
        });
      });

      // validate resignation emp department and HOD department are not same
      if (
        hodIds.length === 0 ||
        data.leaveApproverdept_id in hodIds === false ||
        hodIds[data.leaveApproverdept_id] !== data.leaveApproverUserId
      ) {
        postNodueData.unshift({
          active: true,
          department_id: data.dept_id,
          employee_Id: data.emp_id,
          resignation_id: data.id,
          approver_id: data.leaveApproverUserId,
        });
      }

      await axios
        .post(`/api/employee/noDuesAssignment`, postNodueData)
        .then((res) => resolve(res.data.success))
        .catch((err) => reject(err));
    });
  };

  const handleNodueStatus = async (data) => {
    const updateStatus = () => {
      Promise.all([handleUpdateNodueStatus(data), handleCreateNodueData(data)])
        .then((res) => {
          if (res) {
            setAlertMessage({
              severity: "success",
              message: "Sent to No Due approval successfully !!",
            });
            setAlertOpen(true);
            getData();
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
        });
    };

    setConfirmContent({
      title: "",
      message: "Are you sure want send to No Due approval !! ?",
      buttons: [
        { name: "Yes", color: "primary", func: updateStatus },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  const handleRelieve = async (data) => {
    await axios
      .get(`/api/employee/getAllNoDueAssignmentData/${data.id}`)
      .then((res) => {
        const checkApproved = [];
        res.data.data.forEach((obj) => {
          if (obj.no_due_status === true) {
            checkApproved.push(obj.no_due_status);
          }
        });
        setNoDueData(res.data.data);
        setNoDueApproved(
          res.data.data.length === checkApproved.length ? true : false
        );
      })
      .catch((err) => console.error(err));

    setRowData(data);
    setModalOpen(true);
  };

  const handleRetain = async (data) => {
    setRowData(data);
    setCancelModalOpen(true);
  };

  const handleOpenInitiate = async () => {
    await axios
      .get(`/api/employee/getAllActiveEmployeeDetailsWithUserId`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.id,
            label: obj.employee_name + " - " + obj.empcode,
          });
        });
        setUserOptions(optionData);
      })
      .catch((err) => console.error(err));

    setInitiateOpen(true);
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleInitiate = () => {
    navigate(`/empresignationform/${values.userId}`);
    setInitiateOpen(false);
  };

  const handleUploadDocument = (data) => {
    setRowData(data);
    setDocumentModalOpen(true);
  };

  const handlePrintNodue = async (data) => {
    setPrintLoading(true);

    const noDuesData = await axios
      .get(`/api/employee/getAllNoDueAssignmentData/${data.id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const blobFile = await GenerateNoduesPrint(noDuesData);
    window.open(URL.createObjectURL(blobFile));
    setPrintLoading(false);
  };

  const columns = [
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "employee_name", headerName: "Emp Name", flex: 1 },
    { field: "designation_short_name", headerName: "Designation", flex: 1 },
    { field: "dept_name_short", headerName: "Department", flex: 1 },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      flex: 1,
    },
    {
      field: "employee_reason",
      headerName: "Reason",
      flex: 1,
    },
    { field: "additional_reason", headerName: "Additional Reason", flex: 1 },
    {
      field: "created_date",
      headerName: "Initiated Date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "requested_relieving_date",
      headerName: "Expected Relieving",
      flex: 1,
      valueGetter: (params) => moment(params.value).format("DD-MM-YYYY"),
    },
    {
      field: "attachment_path",
      headerName: "Upload Document",
      flex: 1,
      renderCell: (params) =>
        params.row.attachment_path ? (
          <IconButton
            onClick={() => handleUploadDocument(params.row)}
            title="Preview Document"
            sx={{ padding: 0 }}
          >
            <DescriptionSharpIcon color="primary" sx={{ fontSize: 24 }} />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleUploadDocument(params.row)}
            title="Send to No Due Approval"
            sx={{ padding: 0 }}
          >
            <CloudUploadIcon color="primary" sx={{ fontSize: 24 }} />
          </IconButton>
        ),
    },
    {
      field: "nodues_approve_status",
      headerName: "No Due Required",
      flex: 1,
      renderCell: (params) =>
        params.row.nodues_approve_status === 0 && params.row.attachment_path ? (
          <IconButton
            onClick={() => handleNodueStatus(params.row)}
            title="Send to No Due Approval"
            sx={{ padding: 0 }}
          >
            <AddBoxIcon color="primary" sx={{ fontSize: 24 }} />
          </IconButton>
        ) : params.row.nodues_approve_status === 1 ? (
          <IconButton title="Approval Pending" sx={{ padding: 0 }}>
            <PendingActionsRoundedIcon color="primary" sx={{ fontSize: 24 }} />
          </IconButton>
        ) : params.row.nodues_approve_status === 2 ? (
          <IconButton
            onClick={() => handlePrintNodue(params.row)}
            title="Approved"
            sx={{ padding: 0 }}
          >
            <PrintIcon color="primary" sx={{ fontSize: 24 }} />
          </IconButton>
        ) : (
          <></>
        ),
    },
    {
      field: "relieving_date",
      headerName: "Relieve",
      flex: 1,
      renderCell: (params) =>
        params.row.nodues_approve_status === 1 ||
        params.row.nodues_approve_status === 2 ? (
          <IconButton title="Relieve" onClick={() => handleRelieve(params.row)}>
            <ExitToAppIcon color="error" />
          </IconButton>
        ) : (
          <></>
        ),
    },
    {
      field: "status",
      headerName: "Retain",
      flex: 1,
      renderCell: (params) => (
        <IconButton title="Retain" onClick={() => handleRetain(params.row)}>
          <CallReceivedIcon color="error" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

      {/* Relieve  */}
      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <EmpRelieveForm
          rowData={rowData}
          noDueData={noDueData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          setModalOpen={setModalOpen}
          getData={getData}
          noDueApproved={noDueApproved}
        />
      </ModalWrapper>

      {/* Retain / Cancel   */}
      <ModalWrapper
        open={cancelModalOpen}
        setOpen={setCancelModalOpen}
        maxWidth={700}
        title={rowData.employee_name + " ( " + rowData.empcode + " )"}
      >
        <EmpRetainForm
          rowData={rowData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          setCancelModalOpen={setCancelModalOpen}
          getData={getData}
        />
      </ModalWrapper>

      {/* Initiate  */}
      <ModalWrapper
        open={initiateOpen}
        setOpen={setInitiateOpen}
        maxWidth={600}
        title="Initiate Resignation"
      >
        <Box p={2} mt={2}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <CustomAutocomplete
                name="userId"
                label="Employee"
                value={values.userId}
                options={userOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={handleInitiate}
                disabled={values.userId === null}
              >
                Initiate
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      {/* Direct Relieve   */}
      <ModalWrapper
        open={relieveModalOpen}
        setOpen={setRelieveModalOpen}
        maxWidth={1200}
      >
        <EmpDirectRelieveForm
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          setRelieveModalOpen={setRelieveModalOpen}
          getData={getData}
        />
      </ModalWrapper>

      {/* Upload Document  */}
      <ModalWrapper
        open={documentModalOpen}
        setOpen={setDocumentModalOpen}
        maxWidth={700}
        title={rowData.employee_name + " ( " + rowData.empcode + " )"}
      >
        <ResignationUpload
          attachmentPath={rowData.attachment_path}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          rowData={rowData}
          setDocumentModalOpen={setDocumentModalOpen}
          getData={getData}
        />
      </ModalWrapper>

      {printLoading ? <OverlayLoader /> : <></>}

      <Box>
        <Grid container rowSpacing={2}>
          <Grid item xs={12} align="right">
            <Stack direction="row" spacing={2} justifyContent="right">
              <Button
                variant="outlined"
                size="small"
                onClick={handleOpenInitiate}
              >
                Initiate
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => setRelieveModalOpen(true)}
              >
                Direct Relieve
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <GridIndex
              rows={paginationData.rows}
              columns={columns}
              rowCount={paginationData.total}
              page={paginationData.page}
              pageSize={paginationData.pageSize}
              handleOnPageChange={handleOnPageChange}
              handleOnPageSizeChange={handleOnPageSizeChange}
              loading={paginationData.loading}
              handleOnFilterChange={handleOnFilterChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default EmployeeResignationIndex;
