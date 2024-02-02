import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";

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

function MenuIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);

  const navigate = useNavigate();

  const columns = [
    {
      field: "menu_name",
      headerName: "Name",
      width: 260,
      hideable: false,
      renderCell: (params) =>
        params.row.menu_name.length > 39 ? (
          <HtmlTooltip title={params.row.menu_name}>
            <span>{params.row.menu_name.substr(0, 35) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.menu_name
        ),
    },
    {
      field: "menu_short_name",
      headerName: " Short Name",
      width: 90,
      hideable: false,
    },
    {
      field: "menu_desc",
      headerName: "Description",
      width: 260,
      hideable: false,
      renderCell: (params) =>
        params.row.menu_desc.length > 39 ? (
          <HtmlTooltip title={params.row.menu_desc}>
            <span>{params.row.menu_desc.substr(0, 35) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.menu_desc
        ),
    },
    {
      field: "module_name",
      headerName: "Module Name",
      width: 220,
      hideable: false,
      renderCell: (params) =>
        params.row.module_name.length > 33 ? (
          <HtmlTooltip title={params.row.module_name}>
            <span>{params.row.module_name.substr(0, 29) + "...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.module_name
        ),
    },
    {
      field: "created_username",
      headerName: "Created By",
      width: 160,
      hideable: false,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      width: 100,
      hideable: false,
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "id",
      type: "actions",
      width: 70,
      hideable: false,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/NavigationMaster/Menu/Update/${params.row.id}`)
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
      width: 70,
      hideable: false,
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
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllMenuDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/Menu/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/activteMenu/${id}`)
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
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/NavigationMaster/Menu/New")}
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

export default MenuIndex;
