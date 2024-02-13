import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Grid,
  Box,
  IconButton,
  Button,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  styled,
  tableCellClasses,
  TableHead,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomModal from "../../../components/CustomModal";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ModalWrapper from "../../../components/ModalWrapper";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import FactCheckIcon from "@mui/icons-material/FactCheck";

const initValues = { submenu: [] };

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

function RoleIndex() {
  const [values, setValues] = useState(initValues);
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [wrapperContent, setWrapperContent] = useState({});
  const [submenuOptions, setSubmenuOptions] = useState([]);
  const [assignedList, setAssignedList] = useState([]);
  const [menuAssignmentId, setMenuAssignmentId] = useState([]);
  const [assignedListOpen, setAssigedListOpen] = useState(false);
  const [AssignedRoleOpen, setAssignedRoleOpen] = useState(false);
  const [Assignrole, setAssignRole] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const columns = [
    {
      field: "role_name",
      headerName: "Role",
      width: 220,
      hideable: false,
      renderCell: (params) =>
        params.row.role_name.length > 33 ? (
          <HtmlTooltip title={params.row.role_name}>
            <span>{params.row.role_name.substr(0, 29) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.role_name
        ),
    },
    {
      field: "role_short_name",
      headerName: "Short Name",
      width: 90,
      hideable: false,
    },
    {
      field: "role_desc",
      headerName: "Description",
      width: 220,
      hideable: false,
      renderCell: (params) =>
        params.row.role_desc.length > 33 ? (
          <HtmlTooltip title={params.row.role_desc}>
            <span>{params.row.role_desc.substr(0, 29) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.role_desc
        ),
    },
    {
      field: "lms_status",
      headerName: "LMS Status",
      width: 80,
    },
    {
      field: "access",
      headerName: "HR Access",
      flex: 1,
      hide: true,
      valueGetter: (params) => (params.row.access ? "YES" : "NO"),
    },
    {
      field: "back_date",
      headerName: "Leave Initiation",
      flex: 1,
      hide: true,
      valueGetter: (params) => (params.row.back_date ? "YES" : "NO"),
    },
    { field: "created_username", headerName: "Created By", width: 160 },
    {
      field: "created_Date",
      headerName: "Created Date",
      width: 100,
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "modified_username",
      headerName: "Assign Submenu",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          onClick={() => handleOpen(params)}
          sx={{ padding: 0, color: "auzColor.main" }}
        >
          <AssignmentIcon />
        </IconButton>,
      ],
    },
    {
      field: "count",
      headerName: "Submenu List",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          onClick={() => submenuView(params)}
          sx={{ padding: 0, color: "auzColor.main" }}
        >
          <FactCheckIcon />
        </IconButton>,
      ],
    },

    {
      field: "role",
      headerName: "User List",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          onClick={() => roleview(params)}
          sx={{ padding: 0, color: "auzColor.main" }}
        >
          <PlaylistAddCheckIcon />
        </IconButton>,
      ],
    },

    {
      field: "created_by",
      headerName: "Update",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/NavigationMaster/Role/Update/${params.row.id}`)
          }
          sx={{ padding: 0 }}
        >
          <EditIcon />
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

  useEffect(() => {
    getData();
    getSubmenuOptions();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllRolesDetails?page=${0}&page_size=${10000}&sort=created_Date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const getSubmenuOptions = async () => {
    await axios
      .get(`/api/SubMenu`)
      .then((res) => {
        setSubmenuOptions(
          res.data.data
            .sort((a, b) => a.submenu_name.localeCompare(b.submenu_name))
            ?.map((obj) => ({
              value: obj.submenu_id,
              label: obj.submenu_name,
            }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues({ [name]: newValue });
  };
  const handleSelectAll = (name, options) => {
    setValues({ [name]: options.map((obj) => obj.value) });
  };
  const handleSelectNone = (name) => {
    setValues({ [name]: [] });
  };

  const submenuView = async (params) => {
    await axios
      .get(`/api/fetchSubMenuDetailsOnRoleId/${params.row.id}`)
      .then((res) => {
        if (res.data.data.length > 0) {
          setAssignedList(res.data.data[0]);
        }
      })
      .catch((err) => console.error(err));

    setAssigedListOpen(true);
    setWrapperContent(params.row);
  };

  const handleOpen = async (params) => {
    handleSelectNone("submenu");

    await axios
      .get(`/api/fetchSubMenuDetailsOnRoleId/${params.row.id}`)
      .then((res) => {
        if (res.data.data.length > 0) {
          setAssignedList(res.data.data[0]);
          setValues({
            submenu:
              res.data.data[0].submenu_name !== null
                ? res.data.data[0]?.submenu_ids?.split(",")?.map(Number)
                : [],
          });
          setMenuAssignmentId(res.data.data[0].menu_assignment_id);
        }
      })
      .catch((err) => console.error(err));

    setWrapperContent(params.row);
    setWrapperOpen(true);
  };

  const handleAssign = async () => {
    const temp = {};
    temp.active = true;
    temp.submenu_ids =
      values.submenu.length > 0 ? values.submenu.toString() : null;
    temp.role_id = wrapperContent.id;

    if (Object.keys(assignedList).length > 0) {
      temp.menu_assignment_id = menuAssignmentId;

      await axios
        .put(`/api/SubMenuAssignment/${menuAssignmentId}`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Submenu assigned successfully",
          });
          setAlertOpen(true);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "An error occured",
          });
          setAlertOpen(true);
          console.error(err);
        });
    } else {
      await axios
        .post(`/api/SubMenuAssignment`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Submenu assigned successfully",
          });
          setAlertOpen(true);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "An error occured",
          });
          setAlertOpen(true);
          console.error(err);
        });
    }

    setWrapperOpen(false);
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      params.row.active === true
        ? await axios
            .delete(`/api/Roles/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getData();
              }
            })
            .catch((err) => console.error(err))
        : await axios
            .delete(`/api/activateRoles/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getData();
              }
            })
            .catch((err) => console.error(err));
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        });
    setModalOpen(true);
  };

  const roleview = async (rowData) => {
    await axios
      .get(`/api/getUserDetailsBasedOnRole/${rowData.row.id}`)
      .then((res) => {
        setAssignRole(res.data.data);
        setWrapperContent(rowData.row);
        setAssignedRoleOpen(true);
      })
      .catch((err) => console.error(err));
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

      {/* assign submenu  */}
      <ModalWrapper
        open={wrapperOpen}
        setOpen={setWrapperOpen}
        maxWidth={1200}
        title={wrapperContent.role_name}
      >
        <Box p={4}>
          <Grid container rowSpacing={3} columnSpacing={3} alignItems="center">
            <Grid item xs={12} md={11}>
              <CheckboxAutocomplete
                name="submenu"
                label="Submenu"
                value={values?.submenu}
                options={submenuOptions}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                required
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <Button variant="contained" onClick={handleAssign}>
                Assign
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      {/* assigned submenu list  */}
      <ModalWrapper
        open={assignedListOpen}
        setOpen={setAssigedListOpen}
        maxWidth={600}
        title={wrapperContent.role_name}
      >
        <Box p={2} mt={2}>
          <Grid container>
            <Grid item xs={12}>
              {Object.keys(assignedList).length > 0 ? (
                <TableContainer component={Paper} elevation={2}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Sl No</StyledTableCell>
                        <StyledTableCell>Submenu</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignedList.submenu_name !== null
                        ? assignedList.submenu_name.split(",").map((obj, i) => {
                            return (
                              <StyledTableRow key={i}>
                                <TableCell
                                  sx={{ width: "65px", textAlign: "center" }}
                                >
                                  <Typography variant="body2">
                                    {i + 1}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">{obj}</Typography>
                                </TableCell>
                              </StyledTableRow>
                            );
                          })
                        : ""}
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

      {/* User List  */}
      <ModalWrapper
        open={AssignedRoleOpen}
        setOpen={setAssignedRoleOpen}
        maxWidth={600}
        title={wrapperContent.role_name}
      >
        <Box p={2} mt={2}>
          <Grid container>
            <Grid item xs={12}>
              {Assignrole.length > 0 ? (
                <TableContainer component={Paper} elevation={2}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Sl No</StyledTableCell>
                        <StyledTableCell>User</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Assignrole.map((obj, i) => (
                        <StyledTableRow key={obj.user_id}>
                          <TableCell
                            sx={{ width: "65px", textAlign: "center" }}
                          >
                            <Typography variant="body2">{i + 1}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {obj.username}
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
                  No user is assigned for this role !!
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/NavigationMaster/Role/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>

        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default RoleIndex;
