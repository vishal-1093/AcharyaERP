import React, { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Typography,
  Tooltip
} from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import FloorIcon from "@mui/icons-material/Apartment";
import VacantIcon from "@mui/icons-material/EventAvailable";
import OccupiedIcon from "@mui/icons-material/EventBusy";
import NightShelterRoundedIcon from "@mui/icons-material/NightShelterRounded";
import ModalWrapper from "../../../components/ModalWrapper";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import BlockIcon from '@mui/icons-material/Block';

const occupancy = [
  { value: 1, label: "SINGLE OCCUPANCY" },
  { value: 2, label: "DOUBLE OCCUPANCY" },
  { value: 3, label: "TRIPLE OCCUPANCY" },
  { value: 4, label: "QUADRUPLE OCCUPANCY" },
  { value: 6, label: "SIXTAPLE OCCUPANCY" },
  { value: 7, label: "SEVEN OCCUPANCY" },
  { value: 8, label: "EIGHT OCCUPANCY" },
];

const BlockDetails = ({ blockOpen, setBlockOpen, blockData, acYearId }) => {
  console.log(blockData, "vvv");

  const [rows, setRows] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getData = async () => {
    if (!acYearId || !blockData?.id) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/hostel/roomTypewiseHostelbedDetails?academicYearId=${acYearId}&hostelBlockId=${blockData?.id}`
      );
      const data = res.data?.data || [];

      const mapped = data.map((item, index) => ({
        ...item,
        countOfBeds:
          (item.blockedCountBeds || 0) +
          (item.occupiedCountBeds || 0) +
          (item.vacantBeds || 0) +
          (item.assignedCountBeds || 0),
        id: `${item.room_type}-${index}`,
      }));

      const totalRow = {
        room_type: "Total",
        countOfFloors: data.reduce((acc, r) => acc + (r.countOfFloors || 0), 0),
        countOfRooms: data.reduce((acc, r) => acc + (r.countOfRooms || 0), 0),
        countOfBeds: mapped.reduce((acc, r) => acc + (r.countOfBeds || 0), 0),
        assignedCountBeds: mapped.reduce((acc, r) => acc + (r.assignedCountBeds || 0), 0),
        occupiedCountBeds: mapped.reduce((acc, r) => acc + (r.occupiedCountBeds || 0), 0),
        vacantBeds: mapped.reduce((acc, r) => acc + (r.vacantBeds || 0), 0),
        blockedCountBeds: mapped.reduce((acc, r) => acc + (r.blockedCountBeds || 0), 0),
        isTotal: true,
        id: "total-row"
      };

      setRows([...mapped, totalRow]);
    } catch (err) {
      console.error("Error fetching block details:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getData();
  }, [acYearId, blockData?.id]);

  const handleHistory = async (row, type) => {
    setHistoryOpen(true);
    try {
      const res = await axios.get(
        `/api/hostel/hostelAssignedStudentDetails?academicYearId=${acYearId}&hostelBlockId=${blockData?.id}&bedStatus=${type}`
      );
      const sorted = res.data?.data
        ?.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        ?.map((row, index) => ({ ...row, id: index }));
      setHistoryData(sorted);
    } catch (err) {
      console.error("Error fetching student history:", err);
    }
  };

  const columns = [
    {
      field: "room_type",
      headerName: "Occupancy Type",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ textAlign: "center", fontWeight: "bold", width: "100%" }}>
          {params.row?.isTotal
            ? "Total"
            : occupancy.find((o) => o.value == params.row?.room_type)?.label || ""}
        </Typography>
      ),
    },
    // {
    //   field: "countOfFloors",
    //   headerName: "Floors",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   renderHeader: () => (
    //     <Box display="flex" alignItems="center" justifyContent="center">
    //       <FloorIcon sx={{ mr: 1 }} />
    //       Floors
    //     </Box>
    //   ),
    // },
    // {
    //   field: "countOfRooms",
    //   headerName: "Rooms",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   renderHeader: () => (
    //     <Box display="flex" alignItems="center" justifyContent="center">
    //       <RoomIcon sx={{ mr: 1 }} />
    //       Rooms
    //     </Box>
    //   ),
    // },
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


    {
      field: "blockedCountBeds",
      headerName: "Blocked Beds",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <BlockIcon sx={{ mr: 1, color: "yellow" }} />
          Blocked Beds
        </Box>
      ),
      renderCell: (params) => (
        <Tooltip title="View Blocked Beds">
          <Typography
            onClick={() =>
              navigate("/AllHostelBedViewMaster/AllHostelBedView/New", {
                state: params.row,
              })}
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              textAlign: "center",
              width: "100%",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {params.row.blockedCountBeds}
          </Typography>
        </Tooltip>
      ),
    },
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
                state: params.row,
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
  ];

  const studentColumns = [
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
            textTransform: "capitalize",
            color: "primary.main",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.row.student_name?.toLowerCase()}
        </Typography>
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1, align: "center", headerAlign: "center" },
    { field: "bed_name", headerName: "Bed Name", flex: 1, align: "center", headerAlign: "center" },
    { field: "template_name", headerName: "Template", flex: 1, align: "center", headerAlign: "center" },
    // {
    //   field: "occupied_date",
    //   headerName: "Occupied Date",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <Typography sx={{ width: "100%", textAlign: "center" }}>
    //       {moment(params.row.occupied_date).format("DD-MM-YYYY")}
    //     </Typography>
    //   ),
    // },
    { field: "paid", headerName: "Paid", flex: 1, align: "center", headerAlign: "center" },
  ];

  return (
    <>
      <ModalWrapper open={blockOpen} setOpen={setBlockOpen} title={`Block Details - ${blockData?.block_name} `} >
        <Box mt={2}>
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
      </ModalWrapper>

      <ModalWrapper open={historyOpen} setOpen={setHistoryOpen} title="Student Details">
        <GridIndex rows={historyData} columns={studentColumns} />
      </ModalWrapper>
    </>
  );
};

export default BlockDetails;
