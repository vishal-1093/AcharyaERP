import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Button,
  Box,
  Grid,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TableHead,
  styled,
  tableCellClasses,
  Paper,
  tooltipClasses,
  Tooltip,
} from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CustomModal from "../../../components/CustomModal";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

const initValues = {
  userIds: [],
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
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

function SubmenuIndex() {
  const [values, setValues] = useState(initValues);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [wrapperContent, setWrapperContent] = useState({});
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [assignedListOpen, setAssignedListOpen] = useState(false);
  const [assignedList, setAssignedList] = useState([]);
  const [AssignedRoleOpen, setAssignedRoleOpen] = useState(false);
  const [Assignrole, setAssignRole] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const columns = [
    {
      field: "submenu_name",
      headerName: "Submenu",
      width: 150,
      hideable: false,
      renderCell: (params) =>
        params.row.submenu_name.length > 19 ? (
          <HtmlTooltip title={params.row.submenu_name}>
            <span>{params.row.submenu_name.substr(0, 15) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.submenu_name
        ),
    },
    {
      field: "submenu_url",
      headerName: "Url",
      width: 150,
      hideable: false,
      renderCell: (params) =>
        params.row.submenu_url.length > 19 ? (
          <HtmlTooltip title={params.row.submenu_url}>
            <span>{params.row.submenu_url.substr(0, 15) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.submenu_url
        ),
    },
    {
      field: "menu_name",
      headerName: "Menu",
      width: 150,
      hideable: false,
      renderCell: (params) =>
        params.row.menu_name?.length > 19 ? (
          <HtmlTooltip title={params.row.menu_name}>
            <span>{params.row.menu_name.substr(0, 15) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.menu_name
        ),
    },
    {
      field: "module_name",
      headerName: "Module",
      width: 150,
      hideable: false,
      renderCell: (params) =>
        params.row.module_name?.length > 19 ? (
          <HtmlTooltip title={params.row.module_name}>
            <span>{params.row.module_name.substr(0, 15) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.module_name
        ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 80,
      hideable: false,
      renderCell: (params) =>
        params.row.status.length > 11 ? (
          <HtmlTooltip title={params.row.status}>
            <span>{params.row.status.substr(0, 7) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.status
        ),
    },
    {
      field: "created_username",
      headerName: "Created By",
      width: 160,
      hideable: false,
    },
    {
      field: "created_Date",
      headerName: "Created Date",
      width: 100,
      hideable: false,
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      headerName: "Assign User",
      field: "actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton
          onClick={() => handleOpen(params)}
          sx={{ padding: 0, color: "auzColor.main" }}
        >
          <AssignmentIndIcon />
        </IconButton>,
      ],
    },
    {
      field: "user",
      headerName: "User List",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          onClick={() => userView(params)}
          sx={{ padding: 0, color: "auzColor.main" }}
        >
          <PlaylistAddCheckIcon />
        </IconButton>,
      ],
    },

    {
      field: "role",
      headerName: "Role List",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          onClick={() => roleview(params)}
          sx={{ padding: 0, color: "auzColor.main" }}
        >
          <FactCheckIcon />
        </IconButton>,
      ],
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/NavigationMaster/Submenu/Update/${params.row.id}`)
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
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "green" }}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
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
    getUserDetails();
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllSubMenuDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const getUserDetails = async () => {
    await axios
      .get(`/api/staffUserDetails`)
      .then((res) => {
        setUserOptions(
          res.data.data.map((obj) => ({ value: obj.id, label: obj.username }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleOpen = async (params) => {
    setValues({ userIds: [] });

    await axios
      .get(`/api/getSubMenuRelatedUser/${params.row.id}`)
      .then((res) => {
        setValues({
          userIds: res.data.data.AssignedUser.map((str) => parseInt(str)),
        });
        setWrapperContent(params.row);
        setOpen(true);
      })
      .catch((err) => console.error(err));
  };

  const handleAssign = async () => {
    let temp = {};
    temp.user_ids = values.userIds.toString();

    await axios
      .post(`/api/postUserDetails/${wrapperContent.id}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setOpen(false);
          setAlertMessage({
            severity: "success",
            message: "Submenu assigned successfully",
          });
          setAlertOpen(true);
        } else {
          setOpen(false);
          setAlertMessage({
            severity: "error",
            message: "An error occured",
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => console.error(err));
  };

  const userView = async (rowData) => {
    await axios
      .get(`/api/getAllAssignedUserBySubmenuId/${rowData.row.id}`)
      .then((res) => {
        setAssignedList(res.data.data.AssignedUser);
        setAssignedListOpen(true);
        setWrapperContent(rowData.row);
      })
      .catch((err) => console.error(err));
  };

  const roleview = async (rowData) => {
    await axios
      .get(`/api/getAllAssignedRoleBySubmenuId/${rowData.row.id}`)
      .then((res) => {
        setAssignRole(res.data.data.AssignedRole);
        setAssignedRoleOpen(true);
        setWrapperContent(rowData.row);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/SubMenu/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/activateSubMenu/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setConfirmModal(true);
  };

  return (
    <>
      <CustomModal
        open={confirmModal}
        setOpen={setConfirmModal}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      {/* Assign users  */}
      <ModalWrapper
        open={open}
        setOpen={setOpen}
        maxWidth={750}
        title={wrapperContent.submenu_name}
      >
        <Box p={5}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12} textAlign="right">
              <Button variant="contained" onClick={handleAssign}>
                Assign
              </Button>
            </Grid>

            <Grid item xs={12}>
              <CustomMultipleAutocomplete
                name="userIds"
                label="Users"
                value={values.userIds}
                options={userOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      {/* Assigned user list */}
      <ModalWrapper
        open={assignedListOpen}
        setOpen={setAssignedListOpen}
        maxWidth={600}
        title={wrapperContent.submenu_name}
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
                        <StyledTableCell>User Name</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignedList.map((obj, i) => (
                        <StyledTableRow key={obj.usercode}>
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
                  No user is assigned for this submenu !!
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      {/* Assigned Role List */}
      <ModalWrapper
        open={AssignedRoleOpen}
        setOpen={setAssignedRoleOpen}
        maxWidth={600}
        title={wrapperContent.submenu_name}
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
                        <StyledTableCell>Role</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Assignrole.map((obj, i) => (
                        <StyledTableRow key={obj.role_id}>
                          <TableCell
                            sx={{ width: "65px", textAlign: "center" }}
                          >
                            <Typography variant="body2">{i + 1}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {obj.role_name}
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
                  No role is assigned for this submenu !!
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/NavigationMaster/Submenu/New")}
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

export default SubmenuIndex;
