import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import axios from "../../../services/Api";
import { useLocation } from "react-router-dom";
import EventStatus from "./EventStatus";
import EventRoomDetails from "./EventRoomDetails";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  boxContainer: {
    position: "relative",
    width: 20,
    height: 20,
    background: "linear-gradient(to right, #a5d6a7 50%, #ef9a9a 50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  freeFull: {
    backgroundColor: "#a5d6a7",
  },
  bookedFull: {
    backgroundColor: "#ef9a9a",
  },
  halfBooked: {
    background: "linear-gradient(to right, #a5d6a7 50%, #ef9a9a 50%)",
  },
  iconStyle: {
    fontSize: "1.2rem",
    color: "#fff",
  },
}));

function EventRoomView() {
  const [data, setData] = useState([]);
  const [roomDetialsOpen, setRoomDetialsOpen] = useState(false);
  const [row, setRow] = useState();
  const classes = useStyles();

  const location = useLocation();
  const { temp } = location?.state;

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const daysInCurrentMonth = getDaysInMonth(temp.month, temp.year);

  const getData = async () => {
    try {
      const response = await axios.get(
        `/api/getEventRoomAvailability?facility_type_id=${temp.facility_type_id}&month=${temp.month}&year=${temp.year}`
      );
      setData(response.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (temp) {
      getData();
    }
  }, [temp]);

  const onClosePopUp = () => {
    setRoomDetialsOpen(false);
  };

  const handleChangeRoom = (params) => {
    setRow(params);
    setRoomDetialsOpen(true);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[temp.month - 1];

  return (
    <>
      <EventStatus />
      <Box
        p={2}
        overflow="auto"
        style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{
            backgroundColor: "primary.main",
            color: "headerWhite.main",
            textAlign: "center",
            borderRadius: "16px",
            padding: "10px",
          }}
        >
          Room Availability for {monthName} {temp.year}
        </Typography>

        <TableContainer
          style={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "16px",
            marginTop: "20px",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow
                style={{
                  background: "linear-gradient(90deg, #bbdefb, #e3f2fd)",
                }}
              >
                <TableCell
                  style={{
                    fontWeight: "bold",
                    padding: "12px",
                    color: "#01579b",
                  }}
                >
                  TYPE OF FACILITY
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    padding: "12px",
                    color: "#01579b",
                  }}
                >
                  BLOCK NAME
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    padding: "12px",
                    color: "#01579b",
                  }}
                >
                  ROOM NUMBER
                </TableCell>
                {Array.from({ length: daysInCurrentMonth }).map((_, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    style={{
                      fontWeight: "bold",
                      padding: "8px",
                      backgroundColor: "#e1f5fe",
                      border: "1px solid #ddd",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((room, index) => (
                <TableRow
                  key={index}
                  hover
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9fbe7" : "#f1f8e9",
                  }}
                >
                  <TableCell style={{ padding: "10px", fontWeight: "bold" }}>
                    {room.facility_type_name}
                  </TableCell>
                  <TableCell style={{ padding: "10px", fontWeight: "bold" }}>
                    {room.block_name}
                  </TableCell>
                  <TableCell
                    style={{
                      padding: "10px",
                      color: "#0277bd",
                      fontWeight: "bold",
                    }}
                  >
                    {room.roomcode}
                  </TableCell>
                  {/* For each day in the month */}
                  {Array.from({ length: daysInCurrentMonth }).map(
                    (_, dayIndex) => {
                      const day = new Date(
                        temp.year,
                        temp.month - 1,
                        dayIndex + 1
                      ); // Current day

                      // Check if there's any event in the roomId array for the current day
                      let eventForDay = null;
                      room.roomId.forEach((event) => {
                        const eventStart = new Date(event.event_start_time);
                        const eventEnd = new Date(event.event_end_time);

                        // Normalize eventStart and eventEnd to remove the time part
                        eventStart.setHours(0, 0, 0, 0);
                        eventEnd.setHours(0, 0, 0, 0);

                        // Compare the current day with eventStart and eventEnd
                        const comparisonDate = new Date(day);
                        comparisonDate.setHours(0, 0, 0, 0);

                        if (
                          comparisonDate.getTime() >= eventStart.getTime() &&
                          comparisonDate.getTime() <= eventEnd.getTime() &&
                          (event.approved_status === "Approved" ||
                            event.approved_status === "Pending")
                        ) {
                          eventForDay = event;
                        }
                      });
                      console.log(eventForDay, "eventForDay");

                      return (
                        <TableCell
                          key={dayIndex}
                          align="center"
                          style={{
                            padding: "8px",
                            backgroundColor:
                              eventForDay && eventForDay?.approved_status === "Pending"
                                ? "#ef9a9a"
                                : eventForDay
                                ? "#ef9a9a"
                                : "#a5d6a7",
                            border: "1px solid #ddd",
                            borderRadius: "4px", // Round individual day cells
                          }}
                        >
                          {eventForDay &&
                          eventForDay?.approved_status !== "Pending" ? (
                            <BookmarkAddedOutlinedIcon
                              className={classes.iconStyle}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.2)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                              onClick={() => handleChangeRoom(eventForDay)}
                            />
                          ) : (
                            <BookmarkAddOutlinedIcon
                              className={classes.iconStyle}
                            />
                          )}
                        </TableCell>
                      );
                    }
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {roomDetialsOpen && (
        <ModalWrapper
          title={`${row?.facility_type_name} - ${row?.block_name} - ${row?.roomcode}`}
          maxWidth={1000}
          open={roomDetialsOpen}
          setOpen={onClosePopUp}
        >
          <EventRoomDetails row={row} />
        </ModalWrapper>
      )}
    </>
  );
}

export default EventRoomView;
