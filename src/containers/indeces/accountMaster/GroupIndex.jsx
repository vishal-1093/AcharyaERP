import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Button,
  Box,
  IconButton,
  Tooltip,
  tooltipClasses,
  styled,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
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

function GroupIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllgroupDetail?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/group/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/activateGroup/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const columns = [
    {
      field: "group_name",
      headerName: "Group",
      width: 200,
      hideable: false,
      renderCell: (params) =>
        params.row.group_name.length > 30 ? (
          <HtmlTooltip title={params.row.group_name}>
            <span>{params.row.group_name.substr(0, 25) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.group_name
        ),
    },
    {
      field: "group_short_name",
      headerName: "Short Name",
      width: 100,
      hideable: false,
      align: "center",
    },
    {
      field: "name_in_english",
      headerName: "Name In English",
      width: 200,
      hideable: false,
      renderCell: (params) =>
        params.row.name_in_english?.length > 30 ? (
          <HtmlTooltip title={params.row.name_in_english}>
            <span>{params.row.name_in_english.substr(0, 25) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.name_in_english
        ),
    },
    {
      field: "name_in_russia",
      headerName: "Name In Russian",
      width: 200,
      hideable: false,
      renderCell: (params) =>
        params.row.name_in_russia?.length > 30 ? (
          <HtmlTooltip title={params.row.name_in_russia}>
            <span>{params.row.name_in_russia.substr(0, 25) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.name_in_russia
        ),
    },
    {
      field: "group_priority",
      headerName: "Row Code",
      flex: 1,
      hide: true,
    },
    {
      field: "balance_sheet_row_code",
      headerName: "BS' Row Code",
      flex: 1,
      hide: true,
    },
    {
      field: "financials",
      headerName: "Financial Status",
      flex: 1,
      hideable: false,
    },
    {
      field: "balance_sheet_group",
      headerName: "Balance Sheet",
      flex: 1,
      hide: true,
      renderCell: (params) =>
        params.row.balance_sheet_group.length > 15 ? (
          <HtmlTooltip title={params.row.balance_sheet_group}>
            <span>
              {params.row.balance_sheet_group.substr(0, 10) + " ...."}
            </span>
          </HtmlTooltip>
        ) : (
          params.row.balance_sheet_group
        ),
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 200,
      hideable: false,
      renderCell: (params) =>
        params.row.remarks.length > 30 ? (
          <HtmlTooltip title={params.row.remarks}>
            <span>{params.row.remarks.substr(0, 25) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.remarks
        ),
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <HtmlTooltip
          title={
            <Box>
              <Typography variant="body2">
                {params.row.created_username}
              </Typography>
              <Typography variant="body2">
                {moment(params.row.created_date).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          }
        >
          <span>{params.row.created_username}</span>
        </HtmlTooltip>
      ),
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      hideable: false,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/AccountMaster/Group/Update/${params.row.id}`)
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
      hideable: false,
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
            sx={{ padding: 0 }}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
            sx={{ padding: 0 }}
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
        onClick={() => navigate("/AccountMaster/Group/New")}
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

export default GroupIndex;
