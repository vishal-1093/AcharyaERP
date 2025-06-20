import React, { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Grid,
  Typography,
  Box,
  Tooltip
} from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import FloorIcon from "@mui/icons-material/Apartment";
import VacantIcon from "@mui/icons-material/EventAvailable";
import OccupiedIcon from "@mui/icons-material/EventBusy";
import NightShelterRoundedIcon from "@mui/icons-material/NightShelterRounded";
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

      const mapped = response.data.data.map((row, index) => ({
        ...row,
        id: row.hostel_block_id || index,
      }));

      if (mapped.length > 0) {
        const totalRow = {
          id: "total",
          block_name: "Total",
          countOfFloors: mapped.reduce((acc, r) => acc + (r.countOfFloors || 0), 0),
          countOfRooms: mapped.reduce((acc, r) => acc + (r.countOfRooms || 0), 0),
          countOfBeds: mapped.reduce((acc, r) => acc + (r.countOfBeds || 0), 0),
          assignedCountBeds: mapped.reduce((acc, r) => acc + (r.assignedCountBeds || 0), 0),
          occupiedCountBeds: mapped.reduce((acc, r) => acc + (r.occupiedCountBeds || 0), 0),
          vacantBeds: mapped.reduce((acc, r) => acc + (r.vacantBeds || 0), 0),
          isTotal: true,
        };
        setRows([...mapped, totalRow]);
      } else {
        setRows(mapped);
      }
    } catch (error) {
      setAlertMessage("Error fetching data");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    const currentYear = academicYearOptions[0]?.value === newValue;
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      currentYear: currentYear,
    }));
  };

  const handleHistory = async (params, type) => {
    setHistoryOpen(true);
    try {
      const response = await axios.get(
        `/api/hostel/hostelAssignedStudentDetails?academicYearId=${values?.acYearId}&hostelBlockId=${params?.hostel_block_id}&bedStatus=${type}`
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
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params?.row?.student_name?.toLowerCase()}
        </Typography>
      ),
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "bed_name",
      headerName: "Bed Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "template_name",
      headerName: "Template Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "occupied_date",
      headerName: "Occupied Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ width: "100%", textAlign: "center" }}>
          {moment(params.row.occupied_date).format("DD-MM-YYYY")}
        </Typography>
      ),
    },
    {
      field: "paid",
      headerName: "Paid",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const columns = [
    {
      field: "block_name",
      headerName: "Block Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            width: "100%",
            textAlign: "center",
          }}
        >
          {params.row.block_name}
        </Typography>
      ),
    },
    {
      field: "countOfFloors",
      headerName: "Floors",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <FloorIcon sx={{ mr: 1 }} />
          Floors
        </Box>
      ),
    },
    {
      field: "countOfRooms",
      headerName: "Rooms",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <RoomIcon sx={{ mr: 1 }} />
          Rooms
        </Box>
      ),
    },
    ...(values?.currentYear
      ? [
        {
          field: "countOfBeds",
          headerName: "Total Beds",
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <Box display="flex" alignItems="center" justifyContent="center">
              <BedIcon sx={{ mr: 1 }} />
              Total Beds
            </Box>
          ),
        },
      ]
      : []),
    {
      field: "assignedCountBeds",
      headerName: "Assigned Beds",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <NightShelterRoundedIcon sx={{ mr: 1 }} />
          Assigned Beds
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title="View Assigned Beds">
          <Typography
            onClick={() => handleHistory(params.row, "Assigned")}
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              textAlign: "center",
              width: "100%",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {params.row.assignedCountBeds}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "occupiedCountBeds",
      headerName: "Occupied Beds",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <OccupiedIcon sx={{ mr: 1, color: "red" }} />
          Occupied Beds
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title="View Occupied Beds">
          <Typography
            onClick={() => handleHistory(params.row, "Occupied")}
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              textAlign: "center",
              width: "100%",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {params.row.occupiedCountBeds}
          </Typography>
        </Tooltip>
      ),
    },
    ...(values?.currentYear
      ? [
        {
          field: "vacantBeds",
          headerName: "Vacant Beds",
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <Box display="flex" alignItems="center" justifyContent="center">
              <VacantIcon sx={{ mr: 1, color: "lightgreen" }} />
              Vacant Beds
            </Box>
          ),
          renderCell: (params) => (
            <Tooltip title="View Vacant Beds">
              <Typography
                onClick={() =>
                  navigate("/AllHostelBedViewMaster/AllHostelBedView/New", {
                    state: params.row.hostel_block_id,
                  })
                }
                sx={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  textAlign: "center",
                  width: "100%",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {params.row.vacantBeds}
              </Typography>
            </Tooltip>
          ),
        },
      ]
      : []),
  ];

  return (
    <>
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

      <Box mt={2} sx={{ position: "relative" }}>
        <GridIndex
          rows={rows}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.id}
          getRowClassName={(params) =>
            params.row?.isTotal ? "custom-total-row" : ""
          }
          isRowSelectable={(params) => !params.row?.isTotal}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#376a7d",
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            },
            "& .custom-total-row": {
              backgroundColor: "#376a7d",
              pointerEvents: "none",
            },
            "& .custom-total-row .MuiDataGrid-cell": {
              color: "#fff !important",
              fontWeight: "bold",
              "& *": {
                color: "#fff !important",
              },
            },
          }}
        />
      </Box>

      <ModalWrapper open={historyOpen} setOpen={setHistoryOpen} title="Student Details">
        <GridIndex rows={historyData} columns={callHistoryColumns} />
      </ModalWrapper>
    </>
  );
}

export default HostelBlockView;
