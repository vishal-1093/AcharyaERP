import { useState, useEffect } from "react";
import { Grid, Box, IconButton, Button } from "@mui/material";
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
import axios from "../../../services/Api";

const initValues = { submenu: [] };

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

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const columns = [
    { field: "role_name", headerName: "Role Name", flex: 1, hideable: false },
    {
      field: "role_short_name",
      headerName: "Role Short Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "role_desc",
      headerName: "Role Description",
      flex: 1,
      hideable: false,
    },
    {
      field: "access",
      headerName: "HR Access",
      flex: 1,
      valueGetter: (params) => (params.row.access ? "YES" : "NO"),
      hide: true,
    },
    {
      field: "back_date",
      headerName: "Leave Initiation",
      flex: 1,
      valueGetter: (params) => (params.row.back_date ? "YES" : "NO"),
      hide: true,
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_Date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_Date),
    },
    {
      field: "modified_username",
      headerName: "Assign Submenu",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton label="Result" onClick={() => handleOpen(params)}>
          <AssignmentIcon />
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
            style={{ color: "green" }}
            onClick={() => {
              handleActive(params);
            }}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
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
    await axios(
      `/api/fetchAllRolesDetails?page=${0}&page_size=${10000}&sort=created_Date`
    )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const getSubmenuOptions = async () => {
    await axios(`/api/SubMenu`)
      .then((res) => {
        setSubmenuOptions(
          res.data.data.map((obj) => ({
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

  const handleOpen = async (params) => {
    handleSelectNone("submenu");
    setWrapperContent(params.row);
    setWrapperOpen(true);
    await axios(`/api/fetchSubMenuDetails/${params.row.id}`)
      .then((res) => {
        if (res.data.data[0]) {
          setAssignedList(res.data.data[0].submenu_name.split(","));
          setValues({ submenu: res.data.data[0].submenu_ids });
          setMenuAssignmentId(res.data.data[0].menu_assignment_id);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleAssign = async () => {
    const temp = {};
    temp.active = true;
    temp.submenu_ids = values.submenu.toString();
    temp.role_id = wrapperContent.id;
    if (assignedList.length > 0) {
      temp.menu_assignment_id = menuAssignmentId;
    }

    assignedList.length === 0
      ? await axios
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
          })
      : await axios
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

  return (
    <>
      <ModalWrapper
        open={wrapperOpen}
        setOpen={setWrapperOpen}
        maxWidth={750}
        title={wrapperContent.role_name}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={3}
          mt={0}
        >
          <Grid item xs={12} textAlign="right">
            <Button variant="contained" color="primary" onClick={handleAssign}>
              Assign
            </Button>
          </Grid>
          <Grid item xs={12}>
            <CheckboxAutocomplete
              name="submenu"
              label="Submenu"
              value={values.submenu}
              options={submenuOptions}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
              required
            />
          </Grid>
        </Grid>
      </ModalWrapper>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

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
