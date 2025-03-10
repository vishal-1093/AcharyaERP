import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../services/Api";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  styled,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import useAlert from "../../../hooks/useAlert";
import GridIndex from "../../../components/GridIndex";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 270,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));


function HostelStudentDueIndex() {
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    getData();
  }, []);



  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `api/hostel/hostelBedAssignmentByAcYearAndhostelBlock/${id}`
      );
      const data = response.data.data;

      setRows(data);
    } catch (error) {
      setAlertMessage("Error fetching data");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };


  const detailedColumns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "studentName", headerName: "Student", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "acYear", headerName: "AcYear", flex: 1 },
    { field: "occipiedDate", headerName: "Occupied Date", flex: 1 },
    {
      field: "Year/sem",
      headerName: "Year/sem",
      flex: 1,
      renderCell: (params) => (
        <>{`${params?.row?.year} / ${params?.row?.sem}`}</>
      ),
    },
    { field: "blockName", headerName: "Block", flex: 1 },
    { field: "bedName", headerName: "Bed", flex: 1 },
    {
      field: "fixed", headerName: "Fixed", flex: 1, align: "right",
      headerAlign: "right"
    },
    {
      field: "paid", headerName: "Paid", flex: 1, align: "right",
      headerAlign: "right"
    },
    {
      field: "waiver", headerName: "Waiver", flex: 1, align: "right",
      headerAlign: "right"
    },
    {
      field: "due", headerName: "Due", flex: 1, align: "right",
      headerAlign: "right"
    },
  ];

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box mt={4}>
        <GridIndex rows={rows} columns={detailedColumns} getRowId={row => row.studentId} />
      </Box>
    </>
  );
}

export default HostelStudentDueIndex;
