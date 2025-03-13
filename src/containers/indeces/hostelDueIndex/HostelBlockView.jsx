import React, { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Typography } from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import FloorIcon from "@mui/icons-material/Apartment";
import VacantIcon from "@mui/icons-material/EventAvailable";
import OccupiedIcon from "@mui/icons-material/EventBusy";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";

const initialValues = { acYearId: "" };

function HostelBlockView() {
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);

  useEffect(() => {
    getData();
    getAcademicYearData();
  }, []);

  useEffect(() => {
    getData();
  }, [values?.acYearId]);

  const getAcademicYearData = async () => {
    try {
      const res = await axios.get("/api/academic/academic_year");
      const data = res.data.data.map((obj) => ({
        value: obj.ac_year_id,
        label: obj.ac_year,
      }));
      setAcademicYearOptions(data);
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
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

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
          />
        </Grid>
      </Grid>

      {/* Custom Styled Table */}
      <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#424242" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>Block Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <FloorIcon sx={{ verticalAlign: "middle", marginRight: 1 }} /> Floors
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <RoomIcon sx={{ verticalAlign: "middle", marginRight: 1 }} /> Rooms
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <BedIcon sx={{ verticalAlign: "middle", marginRight: 1 }} /> Total Beds
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <OccupiedIcon sx={{ color: "red", verticalAlign: "middle", marginRight: 1 }} /> Occupied Beds
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px", textAlign: "center" }}>
                <VacantIcon sx={{ color: "lightgreen", verticalAlign: "middle", marginRight: 1 }} /> Vacant Beds
              </TableCell>
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
                  <TableCell sx={{ textAlign: "center", fontSize: "14px" }}>{block.countOfBeds}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "14px", color: "red", fontWeight: "bold" }}>
                    {block.occupiedCountBeds}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "14px", color: "green", fontWeight: "bold" }}>
                    {block.vacantBeds}
                  </TableCell>
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
    </>
  );
}

export default HostelBlockView;
