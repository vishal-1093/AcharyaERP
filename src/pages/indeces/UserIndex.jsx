import { useState, useEffect } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
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
  Tooltip,
  tooltipClasses,
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

const initValues = { roleId: [] };

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

const userName = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userName;

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

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Users" }]);
    getData();
  }, []);

  const columns = [
    {
      field: "username",
      headerName: "User Name",
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        params.row.username.length > 33 ? (
          <HtmlTooltip title={params.row.username}>
            <span>{params.row.username.substr(0, 29) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.username
        ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        params.row.email.length > 33 ? (
          <HtmlTooltip title={params.row.email}>
            <span>{params.row.email.substr(0, 29) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.email
        ),
    },
    {
      field: "role_name",
      headerName: "Role",
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        params.row.role_name.length > 19 ? (
          <HtmlTooltip title={params.row.role_name}>
            <span>{params.row.role_name.substr(0, 15) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.role_name
        ),
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
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "modified_by",
      headerName: "Assign Role",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          onClick={() => handleAssign(params)}
          sx={{ padding: 0, color: "auzColor.main" }}
        >
          <PlaylistAddIcon sx={{ fontSize: 22 }} />
        </IconButton>,
      ],
    },
    {
      field: "count",
      headerName: "Submenu",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          onClick={() => submenuView(params)}
          sx={{ padding: 0, color: "auzColor.main" }}
        >
          <PlaylistAddCheckIcon sx={{ fontSize: 22 }} />
        </IconButton>,
      ],
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
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
      ],
    },
  ];

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllUserRoleDetails?page=${0}&page_size=${10000}&sort=created_date`
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
    setModalData(params.row);
    setWrapperOpen(true);

    await axios
      .get(`/api/Roles`)
      .then((res) => {
        setRole(
          res.data.data.map((obj) => ({
            value: obj.role_id,
            label: obj.role_name,
          }))
        );
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
            localStorage.setItem("AcharyaErpUser", null);
            navigate("/login", { replace: true });
          }
          getData();
        }
      })
      .catch((err) => console.error(err));
  };

  const [tab, setTab] = useState("Staff");
  const handletabChange = (event, newValue) => {
    setTab(newValue);
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
