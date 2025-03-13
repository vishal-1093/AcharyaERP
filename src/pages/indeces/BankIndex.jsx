import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import CustomModal from "../../components/CustomModal";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import moment from "moment";

function BankIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    { field: "voucher_head", headerName: "Bank", flex: 1 },
    { field: "bank_branch_name", headerName: "Bank Branch", flex: 1 },
    { field: "acc_name", headerName: "Account Name", flex: 1 },
    { field: "acc_number", headerName: "Account No.", flex: 1 },
    { field: "ifsc_code", headerName: "IFSC Code", flex: 1 },
    { field: "swift_code", headerName: "Swift Code", flex: 1 },
    { field: "school_name", headerName: "School", flex: 1 },
    { field: "opening_balance", headerName: "Opening Balance", flex: 1 },
    {
      field: "internal_status",
      headerName: "Internal Status",
      flex: 1,
      hide: true,
      valueGetter: (value, row) => (row?.internal_status ? "Yes" : "No"),
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      valueGetter: (value, row) =>
        moment(row?.created_date).format("DD-MM-YYYY"),
    },

    {
      field: "id",
      flex: 1,
      headerName: "Update",
      renderCell: (params) => (
        <IconButton
          onClick={() => navigate(`/BankForm/Update/${params.row.id}`)}
        >
          <EditIcon />
        </IconButton>
      ),
    },

    {
      field: "active",
      headerName: "Active",
      flex: 1,
      renderCell: (params) =>
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
    },
  ];

  useEffect(() => {
    getTranscriptData();
    setCrumbs([{ name: "Bank Index" }]);
  }, []);

  const getTranscriptData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllBankAssignmentDetails?page=${0}&page_size=${10000}&sort=created_date`
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
          .delete(`/api/finance/BankAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getTranscriptData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/finance/activateBankAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getTranscriptData();
            }
          })
          .catch((err) => console.error(err));
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
    setModalOpen(true);
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 4 }}>
        <Button
          onClick={() => navigate("/BankForm/New")}
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
export default BankIndex;
