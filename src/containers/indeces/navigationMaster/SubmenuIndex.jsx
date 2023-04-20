import { useState, useEffect } from "react";
import { Button, Box, Grid, IconButton } from "@mui/material";
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
import axios from "../../../services/Api";

const initValues = {
  userIds: [],
};

function SubmenuIndex() {
  const [values, setValues] = useState(initValues);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false); // user assignment modal wrapper
  const [wrapperContent, setWrapperContent] = useState({});
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const [userOptions, setUserOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const columns = [
    { field: "submenu_name", headerName: "Submenu ", flex: 1 },
    { field: "menu_name", headerName: "Menu ", flex: 1 },
    { field: "submenu_url", headerName: "Url", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      headerName: "Assign",
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => handleOpen(params)}>
          <AssignmentIndIcon />
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
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
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
    getUserDetails();
  }, []);

  const getData = async () => {
    await axios(
      `/api/fetchAllSubMenuDetails?page=${0}&page_size=${10000}&sort=created_date`
    )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const getUserDetails = async () => {
    await axios(`/api/UserAuthentication`)
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
    setWrapperContent(params.row);
    setOpen(true);

    await axios(`/api/getSubMenuRelatedUser/${params.row.id}`)
      .then((res) => {
        setValues({
          userIds: res.data.data.AssignedUser.map((str) => parseInt(str)),
        });
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
      <ModalWrapper
        open={open}
        setOpen={setOpen}
        maxWidth={750}
        title={wrapperContent.submenu_name}
      >
        <Grid container my={2} rowSpacing={2}>
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
