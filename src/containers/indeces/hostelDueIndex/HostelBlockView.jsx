import React, { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Typography } from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import FloorIcon from "@mui/icons-material/Apartment";
import VacantIcon from "@mui/icons-material/EventAvailable";
import OccupiedIcon from "@mui/icons-material/EventBusy";
import NightShelterRoundedIcon from '@mui/icons-material/NightShelterRounded';
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const initialValues = { acYearId: "", currentYear: true };

function HostelBlockView() {
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    getAcademicYearData();
  }, []);

  useEffect(() => {
    if (values?.acYearId) {
      getData();
    }
  }, [values?.acYearId]);

  const getAcademicYearData = async () => {
    try {
      const res = await axios.get("/api/academic/academic_year");
      const data = res.data.data.map((obj) => ({
        value: obj.ac_year_id,
        label: obj.ac_year,
      }));

      setAcademicYearOptions(data);

      if (data.length > 0) {
        setValues((prev) => ({
          ...prev,
          acYearId: data[0]?.value,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };


  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/hostel/hostelbedDetailsByBlockAndAcademic${values?.acYearId ? `?academicYearId=${values?.acYearId}` : ""}`
      );
      setRows(response.data.data);
    } catch (error) {
      setAlertMessage("Error fetching data");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    const currentYear = academicYearOptions[0]?.value === newValue
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      currentYear: currentYear
    }));
  };
  const handleHistory = async (params, type) => {
    setHistoryOpen(true);
    try {
      const response = await axios.get(
        `/api/hostel/hostelAssignedStudentDetails?academicYearId=${values?.acYearId}&hostelBlockId=${params?.id}&bedStatus=${type}`
      );

      const sortedData = response?.data?.data
        ?.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        ?.map((item, index) => ({ ...item, id: index }));

      setHistoryData(sortedData);
    } catch (err) {
      console.error(err);
    }
  };


  const callHistoryColumns = [
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params?.row?.student_name?.toLowerCase()}
        </Typography>
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1, minWidth: 120 },
    { field: "bed_name", headerName: "Bed Name", flex: 1 },
    { field: "template_name", headerName: "Template Name", flex: 1 },
    {
      field: "occupied_date",
      headerName: "Occupied Date",
      flex: 1,
      valueFormatter: (value) =>
        moment(value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        moment(params.row.occupied_date).format("DD-MM-YYYY"),
    },
    {
      field: "paid",
      headerName: "Paid",
      flex: 1,
      // valueGetter: (params) => (params?.row?.paid ? "Yes" : "No"),
      // valueGetter: (params) => (params?.row?.paid),
    },
  ];
  return (
    <>
      {/* Filter Dropdown */}
      <Grid container spacing={2} justifyContent="flex-end" mb={2}>
        <Grid item xs={12} sm={4} md={3}>
          <CustomAutocomplete
            name="acYearId"
            label="Academic Year"
            value={values.acYearId}
            options={academicYearOptions}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>
      </Grid>

      {/* Custom Styled Table */}
      <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main", }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>Block Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <FloorIcon sx={{ verticalAlign: "middle", marginRight: 1 }} /> Floors
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <RoomIcon sx={{ verticalAlign: "middle", marginRight: 1 }} /> Rooms
              </TableCell>
              {values?.currentYear && <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <BedIcon sx={{ verticalAlign: "middle", marginRight: 1 }} /> Total Beds
              </TableCell>}
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <NightShelterRoundedIcon sx={{ verticalAlign: "middle", marginRight: 1 }} /> Assigned Beds
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <OccupiedIcon sx={{ color: "red", verticalAlign: "middle", marginRight: 1 }} /> Occupied Beds
              </TableCell>
              {values?.currentYear && <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <VacantIcon sx={{ color: "lightgreen", verticalAlign: "middle", marginRight: 1 }} /> Vacant Beds
              </TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((block, index) => (
                <TableRow
                  key={block.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f7f7f7" : "white",
                    transition: "background-color 0.3s ease",
                    "&:hover": { backgroundColor: "#e0f7fa" },
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold", fontSize: "14px", textAlign: "center" }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                      {block.block_name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>{block.countOfFloors}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>{block.countOfRooms}</TableCell>
                  {values?.currentYear && <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>{block.countOfBeds}</TableCell>}
                  <TableCell
                    variant="subtitle2"
                    onClick={() => handleHistory(block, "Assigned")}
                    sx={{
                      textAlign: "center",
                      fontSize: "14px",
                      color: "green",
                      fontWeight: "bold",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      }
                    }}
                  >
                    {block.assignedCountBeds}
                  </TableCell>
                  <TableCell
                    variant="subtitle2"
                    onClick={() => handleHistory(block, "Occupied")}
                    sx={{
                      textAlign: "center",
                      fontSize: "14px",
                      color: "red",
                      fontWeight: "bold",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      }
                    }}
                  >
                    {block.occupiedCountBeds}
                  </TableCell>
                  {values?.currentYear && <TableCell
                    variant="subtitle2"
                    onClick={() => navigate("/AllHostelBedViewMaster/AllHostelBedView/New", { state: block.id })}
                    sx={{
                      textAlign: "center",
                      fontSize: "14px",
                      color: "green",
                      fontWeight: "bold",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      }
                    }}
                  >
                    {block.vacantBeds}
                  </TableCell>}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", fontStyle: "italic", py: 2 }}>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalWrapper open={historyOpen} setOpen={setHistoryOpen}
        title={`Student Details`}
      >
        <GridIndex rows={historyData} columns={callHistoryColumns} />
      </ModalWrapper>
    </>
  );
}

export default HostelBlockView;
