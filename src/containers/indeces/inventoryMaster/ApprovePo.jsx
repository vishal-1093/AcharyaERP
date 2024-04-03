import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  tableCellClasses,
  styled,
  Button,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import { HighlightOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../../services/Api";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import PrintIcon from "@mui/icons-material/Print";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const initialValues = {
  approverId: "",
};

function ApprovePo() {
  const [rows, setRows] = useState([]);
  const [approverOpen, setApproverOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [userOptions, setUserOptions] = useState([]);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.createdDate).format("DD-MM-YYYY"),
    },
    { field: "vendor", headerName: "Vendor", flex: 1 },
    {
      field: "Print",
      headerName: "Print PO",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() =>
              navigate(`/DirectPoPdf/${params.row.temporaryPurchaseOrderId}`)
            }
          >
            <PrintIcon fontSize="small" color="primary" />
          </IconButton>
        );
      },
    },
    {
      field: "Cancel_po",
      headerName: "Cancel PO",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton>
            <HighlightOff fontSize="small" color="error" />
          </IconButton>
        );
      },
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/DirectPoCreation/Update/${params.row.temporaryPurchaseOrderId}`
            )
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "purchase_approver",
      headerName: "Purchase Approver",
      flex: 1,
      renderCell: (params) => [
        params.row.purchaseApprover !== null ? (
          <Typography variant="subtitle2">
            {params.row.purchaseApprover}
          </Typography>
        ) : (
          <IconButton onClick={() => handleAssignApprover(params)}>
            <AddTaskIcon fontSize="small" color="primary" />
          </IconButton>
        ),
      ],
    },
  ];

  useEffect(() => {
    getData();
    getUsers();
  }, []);

  const handleAssignApprover = () => {
    setApproverOpen(true);
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "approverId") {
      await axios
        .get(`/api/purchase/getApprovers`)
        .then((res) => {
          res.data.data.filter((obj) => {
            if (obj.userId === newValue) {
              setUserName(obj.userName);
            }
          });
        })
        .catch((err) => console.error(err));
    }

    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const getUsers = async () => {
    await axios
      .get(`/api/purchase/getApprovers`)
      .then((res) => {
        setUserOptions(
          res.data.data.map((obj) => ({
            value: obj.userId,
            label: obj.userName,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    const requestData = {
      pageNo: 0,
      pageSize: 100000,
      createdDate: null,
      institute: null,
      vendor: null,
    };

    await axios
      .post(`/api/purchase/getDraftPurchaseOrder`, requestData)
      .then((res) => {
        const rowId = res.data.data.content.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setRows(rowId);
      })
      .catch((err) => console.error(err));
  };

  const handleAssign = async () => {
    await axios
      .post(
        `/api/purchase/assignPurchaseApprover?purchaseApprover=${userName}&id=${values.approverId}`
      )
      .then((res) => {
        if (res.status === 200 || res.status === 210) {
          setAlertMessage({
            severity: "success",
            message: "Assigned Successfully",
          });
          setAlertOpen(true);
          setApproverOpen(false);
          getData();
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
        <ModalWrapper
          open={approverOpen}
          setOpen={setApproverOpen}
          maxWidth={600}
          title="Assign Approver"
        >
          <Grid
            container
            rowSpacing={2}
            columnSpacing={2}
            alignItems="center"
            justifycontents="flex-start"
            mt={2}
          >
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="approverId"
                handleChangeAdvance={handleChangeAdvance}
                label="Select Approver"
                value={values.approverId}
                options={userOptions}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={handleAssign}
              >
                Assign
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>
      </Box>
    </>
  );
}

export default ApprovePo;
