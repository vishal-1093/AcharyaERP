import { useState, useEffect } from "react";
import axios from "axios";
import ApiUrl from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { Check, HighlightOff } from "@mui/icons-material";
import {
  Grid,
  Box,
  IconButton,
  Button,
  List,
  ListSubheader,
  ListItemText,
} from "@mui/material";
import CustomModal from "../../components/CustomModal";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ModalWrapper from "../../components/ModalWrapper";
import CheckboxAutocomplete from "../../components/Inputs/CheckboxAutocomplete";
import useAlert from "../../hooks/useAlert";

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
  const [modalData, setModalData] = useState([]);
  const [submenuList, setSubmenuList] = useState([]);
  const [assignedList, setAssignedList] = useState([]);
  const [menuAssignmentId, setMenuAssignmentId] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    axios
      .get(
        `${ApiUrl}/fetchAllRolesDetails?page=${0}&page_size=${100}&sort=created_Date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      });
  };

  const handleActive = (params) => {
    setModalOpen(true);
    const id = params.row.id;
    const active = () => {
      params.row.active === true
        ? axios.delete(`${ApiUrl}/Roles/${id}`).then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
        : axios.delete(`${ApiUrl}/activateRoles/${id}`).then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          });
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: active },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: active },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleAssign = async (params) => {
    handleSelectNone();
    setWrapperOpen(true);
    setModalData(params.row);
    await axios.get(`${ApiUrl}/SubMenu`).then((res) => {
      setSubmenuList(
        res.data.data.map((obj) => ({
          value: obj.submenu_id,
          label: obj.submenu_name,
        }))
      );
    });
    await axios
      .get(`${ApiUrl}/fetchSubMenuDetails/${params.row.id}`)
      .then((res) => {
        if (res.data.data[0]) {
          setAssignedList(res.data.data[0].submenu_name.split(","));
          setValues({ submenu: res.data.data[0].submenu_ids });
          setMenuAssignmentId(res.data.data[0].menu_assignment_id);
        }
      });
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleSelectAll = () => {
    setValues((prev) => ({
      ...prev,
      submenu: submenuList.map((obj) => obj.value),
    }));
  };
  const handleSelectNone = () => {
    setValues((prev) => ({ ...prev, submenu: [] }));
  };
  const assignSubmenu = async () => {
    const temp = {};
    temp.active = true;
    temp.submenu_ids = values.submenu.sort((a, b) => a - b).toString();
    temp.role_id = modalData.id;
    temp.menu_assignment_id = assignedList.length > 0 ? menuAssignmentId : 0;

    assignedList.length > 0
      ? await axios
          .put(`${ApiUrl}/SubMenuAssignment/${menuAssignmentId}`, temp)
          .then((res) => {
            setAlertMessage({
              severity: "success",
              message: "Submenu assigned successfully",
            });
            setAlertOpen(true);
            setWrapperOpen(false);
          })
          .catch((error) => {})
      : await axios
          .post(`${ApiUrl}/SubMenuAssignment`, temp)
          .then((res) => {
            setAlertMessage({
              severity: "success",
              message: "Submenu assigned successfully",
            });
            setAlertOpen(true);
            setWrapperOpen(false);
          })
          .catch((error) => {});
  };
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
        <IconButton label="Result" onClick={() => handleAssign(params)}>
          <AssignmentTurnedInIcon />
        </IconButton>,
      ],
    },
    {
      field: "created_by",
      headerName: "Update",
      renderCell: (params) => {
        return (
          <Link to={`/RoleUpdate/${params.row.id}`}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
        );
      },
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
  return (
    <>
      <ModalWrapper
        open={wrapperOpen}
        title={modalData.role_name}
        maxWidth={1000}
        setOpen={setWrapperOpen}
      >
        <Box component="form">
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={6}>
              <CheckboxAutocomplete
                name="submenu"
                label="Submenu"
                value={values.submenu}
                options={submenuList}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                // helperText="Select 2 to 7 toppings"
                // errors={[
                //   "This field is required",
                //   "Select more than 2",
                //   "Select less than 7",
                // ]}
                // checks={[
                //   values.submenuList.length > 0,
                //   values.submenuList.length > 2,
                //   values.submenuList.length < 7,
                // ]}
                // setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                onClick={assignSubmenu}
              >
                Assign
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <List
                elevation={3}
                subheader={<ListSubheader>Assigned Submenu</ListSubheader>}
              >
                {assignedList.map((as, i) => {
                  return <ListItemText key={i}>{as}</ListItemText>;
                })}
              </List>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default RoleIndex;
