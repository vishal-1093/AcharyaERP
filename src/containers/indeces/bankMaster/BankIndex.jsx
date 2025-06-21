import { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Divider, Grid, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";

function BankIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [bankBalanceModalOpen, setBankBalanceModalOpen] = useState(false);
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    school_name: false,
    internal_status: false,
    created_username: false
  })
  const [openingBalance, setOpeningBalance] = useState()
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    { field: "voucher_head", headerName: "Bank", flex: 1 },
    {
      field: "bank_short_name",
      headerName: "Short Name",
      flex: 1,
    },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "account_name", headerName: "Acc Name", flex: 1 },
    { field: "account_number", headerName: "Acc Number", flex: 1 },
    { field: "ifsc_code", headerName: "IFSC code", flex: 1 },
    { field: "swift_code", headerName: "Swift code", flex: 1 },
    { field: "school_name", headerName: "School", flex: 1, hide: true },
    {
      field: "internal_status",
      headerName: "Internal Status",
      flex: 1,
      valueGetter: (value, row) => (row.internal_status ? "Yes" : "No"),
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "bank_balance",
      headerName: "Bank Balance",
      flex: 1,
      type: "actions",
      renderCell: (params) => {
        return <Typography
          onClick={() => handleBankBalance(params.row)}
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'none' }
          }}
        >
          {params?.row?.bank_balance}
        </Typography>
      }
    },
    {
      field: "opening_balance",
      headerName: "Opening Balance",
      flex: 1,
      align: 'right'
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() => navigate(`/BankMaster/Bank/Update/${params.row.id}`)}
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
    getTranscriptData();
    setCrumbs([{ name: "Bank Index" }]);
  }, []);

  const getTranscriptData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllBanknDetails?page=${0}&page_size=${10000}&sort=created_date`
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
          .delete(`/api/finance/Bank/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getTranscriptData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/finance/activateBank/${id}`)
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
          { name: "No", color: "primary", func: () => { } },
        ],
      })
      : setModalContent({
        title: "",
        message: "Do you want to make it Active ?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
        ],
      });
    setModalOpen(true);
  };

  const handleBankBalance = (paramObj) => {
    setBankBalanceModalOpen(true)
    //  setBankId(paramObj?.id)
    setValues((prev) => ({
      ...prev,
      bankBalance: paramObj?.bank_balance,
    }));
    setOpeningBalance(paramObj?.opening_balance)
    getProgramData(paramObj?.id)
  }

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e?.target?.value,
    }));
  };

  const getProgramData = async (bankId) => {
    await axios
      .get(`/api/finance/Bank/${bankId}`)
      .then((res) => {
        const { data } = res?.data
        setValues({
          bankName: data.bank_name,
          bankShortName: data.bank_short_name,
          bankBranchName: data.bank_branch_name,
          internalStatus: data.internal_status,
          ifscCode: data.ifsc_code,
          school: data.school_id,
          accName: data.account_name,
          accNumber: data.account_number,
          bankGroup: data.bank_group_id,
          swiftCode: data.swift_code,
          bankId: data.bank_id,
          voucherHeadNewId: data.voucher_head_new_id,
          bankBalance: data.bank_balance || ""
        });
      })
      .catch((err) => console.error(err));
  };

  const handleUpdate = async () => {
    setLoading(true);
    const temp = {};
    temp.active = true;
    temp.voucher_head_new_id = values.voucherHeadNewId;
    temp.bank_id = values.bankId;
    temp.bank_short_name = values.bankShortName;
    temp.internal_status = values.internalStatus;
    temp.ifsc_code = values.ifscCode;
    temp.school_id = values.school;
    temp.account_name = values.accName;
    temp.account_number = values.accNumber;
    temp.bank_branch_name = values.bankBranchName;
    temp.bank_group_id = values.bankGroup;
    temp.swift_code = values.swiftCode;
    temp.bank_name = values.bankName;
    temp.bank_balance = values.bankBalance;
    temp.opening_balance = openingBalance;

    await axios
      .put(`/api/finance/Bank/${values.bankId}`, temp)
      .then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Bank Balance Updated Successfully",
          });
          getTranscriptData()
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
        setBankBalanceModalOpen(false)
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
        setAlertOpen(true);
      })
  };

  const BankAmountUpdateData = () => {
    return (
      <Grid
        container
        direction="column"
        spacing={3}
        sx={{ p: 1 }}
      >
        <Grid item sx={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={10}>
              <CustomTextField
                name="bankBalance"
                label="Bank Balance"
                value={values.bankBalance}
                handleChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 1, px: 2 }}
              disabled={!values?.bankBalance || loading}
              onClick={handleUpdate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Update"}</strong>
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <ModalWrapper
        open={bankBalanceModalOpen}
        setOpen={setBankBalanceModalOpen}
        maxWidth={400}
        title={
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "1.3rem",
              color: "primary.main",
              paddingBottom: 1,
            }}
          >
            <Typography variant="h6" mb={1}>
              Update Bank Balance
            </Typography>
            <Divider />
          </Box>
        }
      >
        {BankAmountUpdateData()}
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 4 }}>
        <Button
          onClick={() => navigate("/BankMaster/Bank/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} columnVisibilityModel={columnVisibilityModel} setColumnVisibilityModel={setColumnVisibilityModel} />
      </Box>
    </>
  );
}
export default BankIndex;
