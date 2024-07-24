import { useState, useEffect,lazy} from "react";
import axios from "../../../services/Api";
import {
  Button,
  Box,
  Tooltip,
  tooltipClasses,
  styled
} from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
const GridIndex = lazy(() => import("../../../components/GridIndex"));

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
      field: "ledger_short_name",
      headerName: "Short Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "tally_fee_head",
      headerName: "Tally Head",
      flex: 1,
      hideable: false,
    },
    {
      field: "priority",
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
      field: "financial_report_status",
      headerName: "Report Type",
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
      renderCell: (params) => (
          <span>{params.row.created_username}</span>
      ),
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      renderCell: (params) => (
          <span>{moment(params.row.created_date).format("DD-MM-YYYY")}</span>
      ),
    },
    {
      field: "created_by",
      headerName: "Update",
      hideable: false,
      type: "actions",
      flex: 1,
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
      flex: 1,
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
