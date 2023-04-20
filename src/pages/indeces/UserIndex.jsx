import { useState, useEffect } from "react";
import GridIndex from "../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { Box, IconButton, Grid, Button } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import AssignmentIndSharpIcon from "@mui/icons-material/AssignmentIndSharp";
import ModalWrapper from "../../components/ModalWrapper";
import CustomSelect from "../../components/Inputs/CustomSelect";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import axios from "../../services/Api";

const initValues = { roleId: [] };

function UserIndex() {
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
  const [role, setRole] = useState([]);
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Users" }]);
    getData();
  }, []);

  const columns = [
    { field: "username", headerName: "User Name", flex: 1, hideable: false },
    { field: "email", headerName: "Email", flex: 1, hideable: false },
    { field: "usertype", headerName: "User Type", flex: 1, hideable: false },
    { field: "role_name", headerName: "Role", flex: 1, hideable: false },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
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
          color="primary"
        >
          <AssignmentIndSharpIcon />
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

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllUserRoleDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
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
          navigate("/userindex", { replace: true });
          setAlertMessage({
            severity: "success",
            message: "Role assigned successfully!!",
          });
          setAlertOpen(true);
          getData();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <ModalWrapper
        open={wrapperOpen}
        setOpen={setWrapperOpen}
        maxWidth={750}
        title={modalData.username}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={3}
          mt={0}
        >
          <Grid item xs={12} textAlign="right">
            <Button variant="contained" color="primary" onClick={handleCreate}>
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
      </ModalWrapper>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
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
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default UserIndex;
