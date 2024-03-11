import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Button,
  Box,
  Tooltip,
  tooltipClasses,
  styled,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
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

function LedgerIndex() {
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
        `/api/finance/fetchAllLedgerDetail?page=${0}&page_size=${10000}&sort=created_date`
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
          .delete(`/api/finance/Ledger/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/finance/ActivateLedger/${id}`)
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
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        params.row.group_name.length > 40 ? (
          <HtmlTooltip title={params.row.group_name}>
            <span>{params.row.group_name.substr(0, 35) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.group_name
        ),
    },
    {
      field: "ledger_name",
      headerName: "Ledger",
      width: 250,
      hideable: false,
      renderCell: (params) =>
        params.row.ledger_name.length > 40 ? (
          <HtmlTooltip title={params.row.ledger_name}>
            <span>{params.row.ledger_name.substr(0, 35) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.ledger_name
        ),
    },
    {
      field: "ledger_short_name",
      headerName: "Short Name",
      width: 100,
      hideable: false,
    },
    {
      field: "name_in_english",
      headerName: "Name In English",
      flex: 1,
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
      flex: 1,
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
      field: "priority",
      headerName: "Row Code",
      width: 90,
      hideable: false,
    },
    {
      field: "balance_sheet_row_code",
      headerName: "BS' Row Code",
      flex: 1,
      hide: true,
    },
    {
      field: "financial_report_status",
      headerName: "Financial Report Type",
      flex: 1,
      hide: true,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
      hide: true,
      renderCell: (params) =>
        params.row.remarks.length > 15 ? (
          <HtmlTooltip title={params.row.remarks}>
            <span>{params.row.remarks.substr(0, 10) + " ...."}</span>
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
      field: "created_by",
      headerName: "Update",
      hideable: false,
      type: "actions",
      width: 90,
      renderCell: (params) => {
        return (
          <Link to={`/AccountMaster/Ledger/Update/${params.row.id}`}>
            <GridActionsCellItem icon={<EditIcon />} label="Update" />
          </Link>
        );
      },
    },
    {
      field: "active",
      headerName: "Active",
      width: 90,
      type: "actions",
      hideable: false,
      getActions: (params) => [
        params.row.active === true ? (
          <GridActionsCellItem
            icon={<Check />}
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            {params.active}
          </GridActionsCellItem>
        ) : (
          <GridActionsCellItem
            icon={<HighlightOff />}
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            {params.active}
          </GridActionsCellItem>
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
        onClick={() => navigate("/AccountMaster/Ledger/New")}
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

export default LedgerIndex;
