import { Box, Grid, Tooltip, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useLocation } from "react-router-dom";
import ModalWrapper from "../../../components/ModalWrapper";

function TimeTableRoomView() {
  const [data, setData] = useState([]);
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const location = useLocation();
  const { temp } = location?.state;

  const timeSlots = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);

  // Status colors
  const statusColors = {
    available: "#90ee90", // Green
    booked: "#ffcccb", // Red
    "in-use": "#add8e6", // Blue
    maintenance: "#d3d3d3", // Gray
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `/api/getEventRoomAvailabilityForTimeTable?block_id=${temp.block_id}&month=${temp.month}&year=${temp.year}&floor_id=${temp.floor_id}`
      );
      setData(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (temp) {
      getData();
    }
  }, [temp]);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setRoomDetailsOpen(true);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "#333" }}
      >
        Room Availability Schedule
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden", padding: 2 }}>
        {/* Header Row: Room Label + Time Slots */}
        <Grid container sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", padding: "8px" }}>
          <Grid item xs={2} sx={{ p: 1, borderRight: "1px solid #ddd", textAlign: "center" }}>
            Rooms
          </Grid>
          {timeSlots.map((slot, index) => (
            <Grid
              key={index}
              item
              xs={1}
              sx={{
                p: 1,
                textAlign: "center",
                borderRight: "1px solid #ddd",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {slot}
            </Grid>
          ))}
        </Grid>

        {/* Room Names & Availability */}
        {data.map((room, roomIndex) => (
          <Grid
            container
            key={roomIndex}
            sx={{
              backgroundColor: roomIndex % 2 === 0 ? "#fafafa" : "#ffffff",
              borderBottom: "1px solid #ddd",
            }}
          >
            {/* Room Name Column */}
            <Grid
              item
              xs={2}
              sx={{
                p: 2,
                textAlign: "center",
                fontWeight: "bold",
                cursor: "pointer",
                borderRight: "1px solid #ddd",
                transition: "0.3s",
                "&:hover": { backgroundColor: "#f0f0f0", color: "#1976d2" },
              }}
              onClick={() => handleRoomClick(room)}
            >
              {room.roomcode}
            </Grid>

            {/* Time Slots Availability */}
            {timeSlots.map((slot, timeIndex) => {
              const isBooked = data.some(
                (b) =>
                  b.room_id === room.room_id &&
                  new Date(b.selected_date).getHours() === parseInt(slot)
              );
              const bgColor = isBooked ? statusColors.booked : statusColors.available;

              return (
                <Tooltip
                  key={`${roomIndex}-${timeIndex}`}
                  title={`${slot} - ${isBooked ? "Booked" : "Available"}`}
                  arrow
                >
                  <Grid
                    item
                    xs={1}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRight: "1px solid #ddd",
                      backgroundColor: bgColor,
                      transition: "0.3s",
                      "&:hover": { opacity: 0.7, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" },
                    }}
                  />
                </Tooltip>
              );
            })}
          </Grid>
        ))}
      </Paper>

      {roomDetailsOpen && (
        <ModalWrapper
          title={`Room Details: ${selectedRoom?.roomcode}`}
          open={roomDetailsOpen}
          setOpen={() => setRoomDetailsOpen(false)}
        >
          {/* <EventRoomDetails row={selectedRoom} /> */}
        </ModalWrapper>
      )}
    </Box>
  );
}

export default TimeTableRoomView;
