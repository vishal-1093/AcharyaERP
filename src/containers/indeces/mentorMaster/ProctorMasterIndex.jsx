import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import { Button, Box, IconButton, Grid, Typography, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import moment from "moment/moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function ProctorMasterIndex() {
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();



  useEffect(() => {
    setCrumbs([{ name: "Proctor Master" }]);
    getData();
  }, []);


  const getData = async () => {
    try {
      const response = await axios.get('/api/proctor/getAllActiveProctors');
      setRows(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  const columns = [
    {
      field: "concat_employee_name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          onClick={() =>
            navigate("/ProctorEmployeeMaster/Proctor", {
              state: params.row,
            })
          }
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params?.value?.toLowerCase() || ""}
        </Typography>
      ),
    },
    { field: "email", headerName: "email", flex: 1, minWidth: 120 },
    { field: "remarks", headerName: "remarks", flex: 1 },
    { field: "created_username", headerName: "Assigned By", flex: 1, hide: true },
    {
      field: "created_date",
      headerName: "Assigned Date",
      hide: true,
      flex: 1,
      //type: "date",
       valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
  ];

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default ProctorMasterIndex;
