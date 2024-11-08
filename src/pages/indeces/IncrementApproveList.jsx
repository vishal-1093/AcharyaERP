import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import moment from "moment";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme?.palette?.auzColor?.main,
    color: theme?.palette?.headerWhite?.main,
    padding: "6px",
    textAlign: "center",
  },
}));

const initialValues = { fileName: "" };

function IncrementApproveList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  function formatMonthYear(month, year) {
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}-${formattedYear}`;
  }

  const columns = [
    { field: "empCode", headerName: "Empcode", flex: 1 },
    { field: "employeeName", headerName: " Employee Name", flex: 1 },
    {
      field: "dateofJoining",
      headerName: "DOJ",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.dateofJoining).format("DD-MM-YYYY"),
    },
    { field: "proposedDepartment", headerName: "Dept", flex: 1 },
    {
      field: "proposedDesignation",
      headerName: "Designation",
      flex: 1,
    },
    {
      field: "proposedSalaryStructure",
      headerName: "Salary Structure",
      flex: 1,
    },
    { field: "proposedBasic", headerName: "Basic", flex: 1 },
    { field: "proposedSplPay", headerName: "Special Pay", flex: 1 },
    { field: "proposedGrosspay", headerName: "Gross Pay", flex: 1 },
    { field: "proposedCtc", headerName: "CTC", flex: 1 },
    { field: "ctcDifference", headerName: "Increment Amount", flex: 1 },
    {
      field: "month",
      headerName: "MM/YY",
      flex: 1,
      renderCell: (params) => {
        return <>{formatMonthYear(params?.row?.month, params?.row?.year)}</>;
      },
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Increment Approve List" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/incrementCreation/getIncrementApprovedList`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
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
        <GridIndex
          rows={rows}
          columns={columns}
          getRowId={(row) => row.incrementCreationId}
        />
      </Box>
    </>
  );
}
export default IncrementApproveList;
