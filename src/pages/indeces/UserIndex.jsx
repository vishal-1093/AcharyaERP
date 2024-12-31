import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import EditIcon from "@mui/icons-material/Edit";
import { Check, HighlightOff, LockResetRounded } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Grid,
  Button,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TableHead,
  styled,
  tableCellClasses,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import CustomModal from "../../components/CustomModal";
import ModalWrapper from "../../components/ModalWrapper";
import CustomSelect from "../../components/Inputs/CustomSelect";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import moment from "moment";

const initValues = {
  roleId: [],
  approverDesignation: "",
  approverDesignationList: [
    { label: "Dean Research & Development", value: "Dean Research & Development" },
    { label: "Assistant Director Research & Development", value: "Assistant Director Research & Development" },
    { label: "Head QA", value: "Head QA" },
    { label: "Human Resource", value: "Human Resource" },
    { label: "Finance", value: "Finance" },
  ],
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "left",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function UserIndex() {
  const [staffData, setStaffData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [values, setValues] = useState(initValues);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [role, setRole] = useState([]);
  const [assignedListOpen, setAssignedListOpen] = useState(false);
  const [assignedList, setAssignedList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [approverModalOpen, setApproverModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [tab, setTab] = useState("Staff");

  useEffect(() => {
    setCrumbs([{ name: "Users" }]);
    getData();
  }, []);

  const handletabChange = (event, newValue) => {
    setTab(newValue);
  };

  const columns = [
    {
      field: "username",
      headerName: "User Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      hideable: false,
    },
    {
      field: "role_name",
      headerName: "Role",
      flex: 1,
      hideable: false,
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hideable: false,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        params.row.created_date
          ? moment(params.row.created_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "modified_by",
      headerName: "Assign Role",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          label="Result"
          onClick={() => handleAssign(params)}
          sx={{ padding: 0, color: "primary.main" }}
        >
          <PlaylistAddIcon sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
    {
      field: "count",
      headerName: "Submenu",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          label="Result"
          onClick={() => submenuView(params)}
          sx={{ padding: 0, color: "primary.main" }}
        >
          <PlaylistAddCheckIcon sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
    {
      field: "resetPassword",
      headerName: "Reset",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          label="Reset"
          onClick={() => handleResetPassword(params)}
          sx={{ padding: 0, color: "primary.main" }}
        >
          <LockResetRounded sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
    {
      field: "defaultPassword",
      headerName: "password",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          label="Reset"
          onClick={() => handleDefaultPassword(params)}
          sx={{ padding: 0, color: "primary.main" }}
        >
          <LockResetRounded sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
    {
      field: "book_chapter_approver_designation",
      headerName: "Incentive Approver",
      flex: 1,
      hide: tab == "Student" ? true : false,
      hideable: tab == "Student" ? false : true,
      renderCell: (params) =>
        !params.row?.book_chapter_approver_designation ? (
          <IconButton
            onClick={() => handleApprover(params)}
            sx={{ padding: 0, color: "primary.main" }}
          >
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
        ) : (
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
            onClick={() => handleApprover(params)}
          >
            {params.row?.book_chapter_approver_designation}
          </Typography>
        ),
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      renderCell: (params) =>
        params.row.active === true ? (
          <IconButton
            label="Result"
            onClick={() => {
              handleActive(params);
            }}
            sx={{ padding: 0, color: "green" }}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "red" }}
          >
            <HighlightOff />
          </IconButton>
        ),
    },
  ];

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllUserRoleDetails?page=${0}&page_size=${1000000}&sort=created_date`
      )
      .then((res) => {
        const allData = res?.data?.data?.Paginated_data?.content;
        const staffData = allData?.filter(
          (item) => item?.usertype?.toLowerCase() === "staff"
        );
        const studentData = allData?.filter(
          (item) => item?.usertype?.toLowerCase() === "student"
        );
        setStaffData(staffData);
        setStudentData(studentData);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.user_id;
    const active = () => {
      params.row.active === true
        ? axios.delete(`/api/UserAuthentication/${id}`).then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
        : axios.delete(`/api/activateUserAuthentication/${id}`).then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          });
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: active },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: active },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

  const handleAssign = async (params) => {
    await axios
      .get(`/api/Roles`)
      .then((res) => {
        setRole(
          res.data.data.map((obj) => ({
            value: obj.role_id,
            label: obj.role_name,
          }))
        );
        setModalData(params.row);
        setWrapperOpen(true);
      })
      .catch((err) => console.error(err));

    setValues({ roleId: params.row.role_id });
  };

  const submenuView = async (params) => {
    setAssignedListOpen(true);
    setModalData(params.row);

    await axios
      .get(`/api/getAssignedSubMenuDetailsByUserId/${params.row.user_id}`)
      .then((res) => {
        setAssignedList(res.data.data.assignedSubMenuList);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApprover = (params) => {
    setUserId(params.row?.user_id);
    setValues((prev) => ({
      ...prev,
      approverDesignation: !!params.row?.book_chapter_approver_designation
        ? params.row?.book_chapter_approver_designation
        : "",
    }));
    setApproverModalOpen(!approverModalOpen);
  };

  const handleCreate = async () => {
    const data = await axios
      .get(`/api/UserRole/${modalData.id}`)
      .then((res) => {
        const data = res.data.data;
        data.role_id = values.roleId;
        return data;
      })
      .catch((err) => console.error(err));

    await axios
      .put(`/api/UserRole/${modalData.id}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          setWrapperOpen(false);
          setAlertMessage({
            severity: "success",
            message: "Role assigned successfully!!",
          });
          setAlertOpen(true);
          if (modalData.username === userName) {
            sessionStorage.setItem("AcharyaErpUser", null);
            navigate("/login", { replace: true });
          }
          getData();
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `api/updatebookChapterApproverDesignationForUser/${userId}/${values.approverDesignation}`
      );
      if (res.status == 200 || res.status == 201) {
        setApproverModalOpen(!approverModalOpen);
        setLoading(false);
        setAlertMessage({
          severity: "success",
          message: "Book chapter approver designation updated successfully !!",
        });
        setAlertOpen(true);
        getData();
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const handleResetPassword = async (params) => {
    const id = params.row.user_id;
    const resetPassword = () => {
      axios
        .put(`/api/userPasswordUpdateByDefaultPassword/${id}`)
        .then(() => {
          setAlertMessage({
            severity: "success",
            message: "Reset Password successfully!!",
          });
          setAlertOpen(true);
        })
        .catch(() => {
          setAlertMessage({
            severity: "error",
            message: "Reset Password Failed!!, Please try again",
          });
          setAlertOpen(true);
        });
    };
    setModalContent({
      title: "",
      message: "Are you sure, want to reset Password?",
      buttons: [
        { name: "Yes", color: "primary", func: resetPassword },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setModalOpen(true);
  };

  const handleDefaultPassword = async (params) => {
    const id = params.row.user_id;
    const resetPassword = () => {
      axios
        .put(`/api/updateUserPassword/${id}`,{userId: Number(id)})
        .then(() => {
          setAlertMessage({
            severity: "success",
            message: "Reset default password successfully!!",
          });
          setAlertOpen(true);
        })
        .catch(() => {
          setAlertMessage({
            severity: "error",
            message: "Reset Password Failed!!, Please try again",
          });
          setAlertOpen(true);
        });
    };
    setModalContent({
      title: "",
      message: "Are you sure, want to reset default Password?",
      buttons: [
        { name: "Yes", color: "primary", func: resetPassword },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setModalOpen(true);
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

      <Tabs value={tab} onChange={handletabChange}>
        <Tab value="Staff" label="Staff" />
        <Tab value="Student" label="Student" />
      </Tabs>

      {/* Assign role  */}
      <ModalWrapper
        open={wrapperOpen}
        setOpen={setWrapperOpen}
        maxWidth={750}
        title={modalData.username}
      >
        <Box p={5}>
          <Grid container rowSpacing={3}>
            <Grid item xs={12} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
              >
                Assign
              </Button>
            </Grid>
            <Grid item xs={12}>
              <CustomSelect
                name="roleId"
                label="Role"
                value={values.roleId}
                items={role}
                handleChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      {/* Submenu assigned list  */}
      <ModalWrapper
        open={assignedListOpen}
        setOpen={setAssignedListOpen}
        maxWidth={600}
        title={modalData.username}
      >
        <Box p={2} mt={2}>
          <Grid container>
            <Grid item xs={12}>
              {assignedList.length > 0 ? (
                <TableContainer component={Paper} elevation={2}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Sl No</StyledTableCell>
                        <StyledTableCell>Submenu</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignedList.map((obj, i) => (
                        <StyledTableRow key={obj.submenu_id}>
                          <TableCell
                            sx={{ width: "65px", textAlign: "center" }}
                          >
                            <Typography variant="body2">{i + 1}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {obj.submenu_name}
                            </Typography>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  variant="subtitle2"
                  sx={{
                    textAlign: "center",
                    color: "error.main",
                    fontSize: 14,
                  }}
                >
                  No submenu is assigned for this role !!
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      {/* Update Approver  */}
      <ModalWrapper
        open={approverModalOpen}
        setOpen={setApproverModalOpen}
        maxWidth={400}
        title={"Incentive Approver Designation"}
      >
        <Box p={1}>
          <Grid container>
            <Grid item xs={12}>
              <CustomSelect
                name="approverDesignation"
                label=""
                value={values.approverDesignation || ""}
                items={values.approverDesignationList}
                handleChange={handleChange}
              />
            </Grid>
            <Grid mt={1} item xs={12} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || !values.approverDesignation}
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
          </Grid>
        </Box>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 3 }}>
        <Button
          onClick={() => navigate("/UserForm")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex
          rows={tab === "Staff" ? staffData : studentData}
          columns={columns}
        />
      </Box>
    </>
  );
}

export default UserIndex;
