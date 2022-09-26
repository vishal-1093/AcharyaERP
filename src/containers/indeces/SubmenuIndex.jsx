import { useState, useEffect } from "react";
import { Button, Box, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../components/CustomModal";
import axios from "axios";
import ApiUrl from "../../services/Api";
const initialValues = {
  user_ids: [],
};
function SubmenuIndex() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [storedata, setStoredata] = useState(initialValues);
  const [assignedUserList, setAssignedUserList] = useState([]);
  const [AlertOpen, setAlertOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const navigate = useNavigate();

  const getData = async () => {
    axios
      .get(
        `${ApiUrl}/fetchAllSubMenuDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };
  useEffect(() => {
    getData();
    getUserDetails();
  }, []);

  const getUserDetails = () => {
    axios.get(`${ApiUrl}/UserAuthentication`).then((res) => {
      setAllUsers(
        res.data.data.map((obj) => ({ value: obj.id, label: obj.username }))
      );
    });
  };

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = () => {
      if (params.row.active === true) {
        axios.delete(`${ApiUrl}/SubMenu/${id}`).then((res) => {
          if (res.status == 200) {
            getData();
            setModalOpen(false);
          }
        });
      } else {
        axios.delete(`${ApiUrl}/activateSubMenu/${id}`).then((res) => {
          if (res.status == 200) {
            getData();
            setModalOpen(false);
          }
        });
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleOpen = (params) => {
    setStoredata((prev) => ({
      ...prev,
      menu_id: params.row.menu_id,
      active: true,
      status: params.row.status,
      submenu_desc: params.row.submenu_desc,
      submenu_name: params.row.submenu_name,
      submenu_id: params.row.id,
    }));
    setOpen(true);
    axios
      .get(`${ApiUrl}/getSubMenuRelatedUser/${params.row.id}`)
      .then((res) => {
        setAssignedUserList(res.data.AssignedUser);
      });
  };

  const handleUserId = (name, newValue) => {
    console.log(newValue);
    setStoredata((prev) => ({
      ...prev,
      [name]: newValue.toString(),
    }));
  };

  const update = () => {
    axios
      .post(`${ApiUrl}/postUserDetails/${storedata.submenu_id}`, storedata)
      .then((response) => {
        if (response.status == 200) {
          setAlertOpen(true);
        }
        console.log(response);
      });
  };

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
      headerName: "User Assignment",
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <IconButton label="User Assignment" onClick={() => handleOpen(params)}>
          <EditIcon />
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
  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
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
  );
}
export default SubmenuIndex;
