import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import {
  Button,
  Box,
  IconButton,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import moment from "moment/moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import EditIcon from "@mui/icons-material/Edit";
import ForumIcon from "@mui/icons-material/Forum";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const initialValues = {
  proctorId: null,
  meetingAgenda: "",
  description: "",
  meetingDate: null,
  proctorHeadId: null,
  schoolId: null,
  proctorHead: null,
  deptId: null,
};

const empID = JSON.parse(sessionStorage.getItem("userData"))?.emp_id;
const schoolID = JSON.parse(sessionStorage.getItem("userData"))?.school_id;
const deptID = JSON.parse(sessionStorage.getItem("userData"))?.dept_id;
const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;

function EmployeeProctorIndex() {
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const state = location.state;
  const { pathname } = useLocation();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [proctorOptions, setProctorOptions] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [userLoading, setUserLoading] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [proctorIds, setProctorIds] = useState([]);
  const [proctorData, setProctorData] = useState([]);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [proctor, setProctor] = useState({});

  const checks = {
    meetingAgenda: [values.meetingAgenda !== ""],
    description: [values.description !== ""],
  };

  const errorMessages = {
    meetingAgenda: ["This field is required"],
    description: ["This field is required"],
  };

  const getDepartmentOptions = async () => {
    try {
      const isPathValid =
        pathname.toLowerCase() === "/proctoremployeemaster-user" ||
        pathname.toLowerCase() === "/proctoremployeemaster-inst" ||
        pathname.toLowerCase() === "/proctoremployeemaster-dept";

      if (isPathValid) {
        const res = await axios.get(`/api/fetchdept1/${schoolID}`);
        const data = res.data.data.map((obj) => ({
          value: obj.dept_id,
          label: obj.dept_name,
          dept_name_short: obj?.dept_name_short,
        }));
        setDepartmentOptions(data);
      } else if (values.schoolId) {
        const res = await axios.get(`/api/fetchdept1/${values.schoolId}`);
        const data = res.data.data.map((obj) => ({
          value: obj.dept_id,
          label: obj.dept_name,
          dept_name_short: obj?.dept_name_short,
        }));
        setDepartmentOptions(data);
      }
    } catch (err) {
      console.error("Error fetching department options:", err);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      let params = {
        ac_year_id: values.acYearId,
        // ...(values.programId && { program_id: values.programId  }),
        // ...(values.school_Id && { school_id: values.school_Id }),
        // userId: userID,
        page: 0,
        page_size: 10000,
        sort: "created_date",
        ...(values.classDate && {
          selected_date: moment(values.classDate).format("YYYY-MM-DD"),
        }),
        ...(values.yearSem && { current_sem: values.yearSem }),
        // ...(filterString && { keyword: filterString }),
      };
      switch (pathname?.toLowerCase()) {
        case "/proctoremployeemaster-user":
          params = {
            ...params,
            emp_id: empID,
            school_id: schoolID,
            ...(values.deptId && { dept_id: values.deptId }),
          };
          break;

        case "/proctoremployeemaster-inst":
          params = {
            ...params,
            school_id: schoolID,
            ...(values.deptId && { dept_id: values.deptId }),
          };
          break;

        case "/proctoremployeemaster-dept":
          params = {
            ...params,
            dept_id: deptID,
            school_id: schoolID,
          };
          break;
        default:
          params = {
            ...params,
            ...(values.schoolId && { school_id: values.schoolId }),
            ...(values.deptId && { dept_id: values.deptId }),
          };
      }
      const queryParams = Object.keys(params)
        .filter((key) => params[key] !== undefined && params[key] !== null)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");
      const url = `/api/employee/fetchAllEmployeeDetailsBasedOnProctor?${queryParams}`;
      const response = await axios.get(url);
      const { content, totalElements } = response?.data?.data?.Paginated_data;
      setRows(content || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };
  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };
  const getProctorDetails = async () => {
    await axios
      .get(`/api/proctor/getAllActiveProctors`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.id,
            label: obj.concat_employee_name,
            employeeName: obj.employee_name,
          });
        });
        setProctorOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const handleEditClick = (row) => {
    setValues((prev) => ({
      ...prev,
      proctorHeadId: row?.chief_proctor_id,
    }));
    getProctorDetails();
    setUserModalOpen(true);
    setUserData(row);
  };
  const handleUpdateClick = async () => {
    setUserLoading(true);

    if (!values?.proctorHeadId) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      setUserLoading(false);
      return;
    }

    try {
      const empIdsArray =
        proctorIds.length > 0 ? proctorIds : [userData?.emp_id];
      const empIdsString = empIdsArray.join(",");

      const payload = {
        empId: empIdsArray,
        chiefProctorId: values.proctorHeadId,
      };

      const res = await axios.put(
        `/api/employee/updateProctorHead/${empIdsString}`,
        payload
      );

      if (res.status === 200 || res.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Updated successfully!",
        });
        getData();
        setUserModalOpen(false);
        setUserData({});
        setProctorIds([]);
        setValues((prev) => ({
          ...prev,
          proctorHeadId: null,
        }));
      } else {
        setAlertMessage({
          severity: "error",
          message: res.data?.message || "An error occurred",
        });
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "An error occurred",
      });
    } finally {
      setAlertOpen(true);
      setUserLoading(false);
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleHistory = async (params) => {
    setHistoryOpen(true);
    try {
      const response = await axios.get(`api/getIvrCreationDataBasedOnEmp/${params.row.emp_id}`);
      const sortedData = response.data.data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setHistoryData(sortedData);
    } catch (err) {
      console.error(err);
    }
  };
  const handleFeedback = async (params) => {
    setValues((prev) => ({
      ...prev,
      "minutesOfMeeting": "",
    }));
    if (params?.row?.proctor_id) {
      setFeedbackOpen(true);
      setProctor(params?.row)
    } else {

    }
  };
  const callHistoryColumns = [
    {
      field: "studentName",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          onClick={() =>
            navigate(`/student-profile/${params.row.student_id}`, { state: true })
          }
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params?.row?.studentName?.toLowerCase()}
        </Typography>
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1, minWidth: 120 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "callFrom", headerName: "Call From", flex: 1 },
    { field: "relationship", headerName: "Call To", flex: 1 },
    { field: "status", headerName: "status", flex: 1 },
    {
      field: "created_date",
      headerName: "Call Time",
      flex: 1,
      valueFormatter: (value) =>
        moment(value).format("DD-MM-YYYY HH:mm:ss"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY HH:mm:ss"),
    },
    { field: "customer", headerName: "Customer", flex: 1 },
    {
      field: "give feedback",
      type: "actions",
      flex: 1,
      headerName: "Call Summarize",
      getActions: (params) => {
        return [
          params?.row?.summarize ? (
            <span>{params?.row?.summarize}</span>
          ) : (
            <IconButton label="" onClick={() => handleFeedback(params)}>
              <ForumIcon />
            </IconButton>
          ),
        ];
      },
    },
    // {
    //   field: "recording",
    //   headerName: "Recording",
    //   flex: 1,
    //   minWidth: 300,
    //   renderCell: (params) => (
    //     <audio controls style={{ backgroundColor: 'transparent', border: 'none', width: '100%' }}>
    //       <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3" />
    //       Your browser does not support the audio element.
    //     </audio>
    //   ),
    // },
    {
      field: "recording",
      headerName: "Recording",
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        const recordingUrl = params.row.recording;
        if (!recordingUrl) {
          return <span>No recording available</span>;
        }
        return (
          <audio
            controls
            controlsList="nodownload"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              width: '100%',
              pointerEvents: roleId === 3 ? 'none' : 'auto'
            }}
          >
            <source src={recordingUrl} type="audio/mp3" />
            <source src={recordingUrl} type="audio/ogg" />
            <source src={recordingUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        );
      },
    }
  ];
  const columns = [
    {
      field: "proctorHeadName",
      headerName: "Mentor Head",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          // onClick={() =>
          //   navigate(`/ProctorStudentMaster/Proctor`, { state: params?.row })
          // }
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params?.value?.toLowerCase()}
        </Typography>
      ),
    },
    {
      field: "proctorName",
      headerName: "Mentor",
      flex: 1,
      hideable: false,
    },
    { field: "school_name_short", headerName: "Inst", flex: 1 },
    {
      field: "dept_name_short",
      headerName: "Department",
      flex: 1,
    },
    {
      field: "studentCount",
      headerName: "Mentees",
      flex: 1,
      align: "right",
      headerAlign: "right",
      hideable: false,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          onClick={() => navigate(`/ProctorStudent`, { state: params?.row })}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params?.value}
        </Typography>
      ),
    },
    // {
    //   field: "callCount",
    //   type: "action",
    //   align: "right",
    //   headerAlign: "right",
    //   flex: 1,
    //   headerName: "IVR History",
    //   renderCell: (params) => (
    //     <Typography
    //       variant="subtitle2"
    //       onClick={() => handleHistory(params)}
    //       sx={{
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //         color: "primary.main",
    //         textTransform: "capitalize",
    //         cursor: "pointer",
    //       }}
    //     >
    //       {params.value}
    //     </Typography>
    //   )
    // },
    {
      field: "designation_short_name",
      headerName: "Designation",
      flex: 1,
    },
    // { field: "remarks", headerName: "remarks", flex: 1 },
    {
      field: "created_username",
      headerName: "Assigned By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Assigned Date",
      hide: true,
      flex: 1,
      // type: "date",
      valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "update",
      headerName: "Update",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          color="primary"
          onClick={() => handleEditClick(params?.row)}
        >
          <EditIcon />
        </IconButton>,
      ],
    },
  ];
  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) =>
      rows.find((row) => row.emp_id === id)
    );
    setProctorIds(selectedRowsData.map((row) => row.emp_id));
    setProctorData(selectedRowsData);
  };

  const handleDeAssignReAssign = () => {
    if (proctorIds.length > 0) {
      getProctorDetails();
      setUserModalOpen(true);
    } else {
      setModalContent({
        title: "",
        message: "Please select the checkbox !!!!",
        buttons: [],
      });
      setModalOpen(true);
    }
  };
  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateCall = async () => {
    if (!values?.minutesOfMeeting) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
      return
    }
    const temp = {};
    temp.ivr_creation_id = proctor?.ivr_creation_id;
    temp.summarize = values?.minutesOfMeeting;

    await axios
      .put(
        `/api/updateIvrCreation/${proctor?.ivr_creation_id}`,
        temp
      )
    await axios
      .get(`/api/getIvrCreationData/${proctor.student_id}`)
      .then((res) => {
        setHistoryData(res.data.data);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Call summarize updated" });
          setAlertOpen(true);
          setFeedbackOpen(false);
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
  useEffect(() => {
    getData();
    getSchoolDetails();
  }, []);

  useEffect(() => {
    if (values.schoolId !== null) {
      getDepartmentOptions();
      getData();
    }
  }, [values.schoolId]);

  useEffect(() => {
    getData();
  }, [values.deptId]);
  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <Box mt={2}>
        <Grid container alignItems="center" spacing={3}>
          {!(
            pathname.toLowerCase() === "/proctoremployeemaster-user" ||
            pathname.toLowerCase() === "/proctoremployeemaster-inst" ||
            pathname.toLowerCase() === "/proctoremployeemaster-dept"
          ) ? (
            <Grid item md={2}>
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          ) : (
            <Grid item md={2}>
              {" "}
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={schoolID}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled={true}
              />
            </Grid>
          )}
          {pathname.toLowerCase() === "/proctoremployeemaster/proctor" ? (
            <Grid item xs={6} md={2}>
              <CustomAutocomplete
                name="deptId"
                label="Department"
                value={values.deptId}
                options={departmentOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!values.schoolId}
              />
            </Grid>
          ) : (
            <Grid item xs={6} md={2}>
              <CustomAutocomplete
                name="deptId"
                label="Department"
                value={values.deptId}
                options={departmentOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          )}
          <Grid item xs={6} md={6}></Grid>
          <Grid item>
            <Button
              onClick={handleDeAssignReAssign}
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 2,
                textAlign: "right",
              }}
            >
              DE-ASSIGN AND RE-ASSIGN
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ position: "relative", mt: 2 }}>
        {/* {!loading && ( */}
        <GridIndex
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection
          getRowId={(row) => row.emp_id}
          onRowSelectionModelChange={onSelectionModelChange}
        />

        {/* )} */}
      </Box>
      {/* Proctor Head   */}
      <ModalWrapper
        open={userModalOpen}
        setOpen={() => {
          setUserModalOpen(false);
          setValues((prev) => ({
            ...prev,
            proctorHeadId: null,
          }));
        }}
        maxWidth={800}
        title="Proctor Head Assignment"
      >
        <Grid
          container
          justifyContent="flex-start"
          rowSpacing={3}
          columnSpacing={3}
          mt={2}
        >
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="proctorHeadId"
              label="Proctor Head"
              value={values.proctorHeadId}
              options={proctorOptions}
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
              onClick={handleUpdateClick}
            >
              {userLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Assign"
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      <ModalWrapper open={historyOpen} setOpen={setHistoryOpen}
        title={`History`}
      >
        <GridIndex rows={historyData} columns={callHistoryColumns} getRowId={row => row?.ivr_creation_id} />
        <ModalWrapper
          title="Call Summarize"
          maxWidth={800}
          open={feedbackOpen}
          setOpen={setFeedbackOpen}
        >
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={2}
            marginTop={2}
          >
            <Grid item xs={12} md={8}>
              <CustomTextField
                multiline
                rows={2}
                name="minutesOfMeeting"
                label="Minutes of meeting / Call output"
                value={values.minutesOfMeeting}
                handleChange={handleChange}
                checks={checks.minutesOfMeeting}
                errors={errorMessages.minutesOfMeeting}
              />
            </Grid>
            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={handleCreateCall}
                sx={{ borderRadius: 2 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>
      </ModalWrapper>
    </>
  );
}
export default EmployeeProctorIndex;
