import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import { Button, Box, IconButton, Grid, Typography, CircularProgress } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import moment from "moment/moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import EditIcon from "@mui/icons-material/Edit";

const initialValues = {
  proctorId: null,
  meetingAgenda: "",
  description: "",
  meetingDate: null,
  proctorHeadId: null,
};


function EmployeeProctorIndex() {
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const state = location.state;

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



  useEffect(() => {
    // setCrumbs([{ name: "Proctor Master", link: "/ProctorMaster" }, { name: state?.concat_employee_name }]);
    getData();
  }, []);


  const getData = async () => {

    setLoading(true);
      try {
        const temp = {
          ac_year_id: values.acYearId,
          ...(values.programId && { program_id: values.programId  }),
          ...(values.school_Id && { school_id: values.school_Id }),
          // userId: userID,
          page: 0,
          page_size: 10000,
          sort: "created_date",
          ...(values.classDate && {
            selected_date: moment(values.classDate).format("YYYY-MM-DD"),
          }),
          ...(values.yearSem && { current_sem: values.yearSem }),
          // ...(values.yearSem && { current_year: values.yearSem }),
          // ...(filterString && { keyword: filterString }),
        };

        const queryParams = Object.keys(temp)
          .filter((key) => temp[key] !== undefined && temp[key] !== null)
          .map((key) => `${key}=${encodeURIComponent(temp[key])}`)
          .join("&");
        const url = `/api/employee/fetchAllEmployeeDetailsBasedOnProctor?${queryParams}`;
        const response = await axios.get(url);
        const { content, totalElements } = response.data.data.Paginated_data;
        setRows(content);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
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
      const empIdsArray = proctorIds.length > 0 ? proctorIds : [userData?.emp_id];
      const empIdsString = empIdsArray.join(",");

      const payload = {
        empId: empIdsArray,
        chiefProctorId: values.proctorHeadId,
      };

      const res = await axios.put(`/api/employee/updateProctorHead/${empIdsString}`, payload);

      if (res.status === 200 || res.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Updated successfully!",
        });
        getData();
        setUserModalOpen(false);
        setUserData({});
        setValues((prev) => ({
          ...prev,
          proctorHeadId: null,
        }))
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
      hideable: false,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          onClick={() =>
            navigate(`/ProctorStudent`, { state: params?.row })
          }
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

    {
      field: "designation_short_name",
      headerName: "Designation",
      flex: 1,
    },
    // { field: "email", headerName: "email", flex: 1, minWidth: 120 },
    // { field: "remarks", headerName: "remarks", flex: 1 },
    { field: "created_username", headerName: "Assigned By", flex: 1, hide: true },
    {
      field: "created_date",
      headerName: "Assigned Date",
      hide: true,
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "update",
      headerName: "Update",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton color="primary" onClick={() => handleEditClick(params?.row)}>
          <EditIcon />
        </IconButton>,
      ],
    },
  ];
  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.emp_id === id));
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
  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <Grid item xs={12} md={2} textAlign="right">
        <Button
          onClick={handleDeAssignReAssign}
          variant="contained"
          disableElevation
          sx={{
            borderRadius: 2,
          }}
        >
          Assign
        </Button>
      </Grid>
      <Box sx={{ position: "relative", mt: 2 }}>
       {!loading && <GridIndex
          rows={rows}
          columns={columns}
          checkboxSelection
          getRowId={(row) => row?.emp_id}
          onSelectionModelChange={onSelectionModelChange}
        />}

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

    </>
  );
}
export default EmployeeProctorIndex;
