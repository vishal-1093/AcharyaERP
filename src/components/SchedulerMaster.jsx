import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../services/Api";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { customColors } from "../services/Constants";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

const mLocalizer = momentLocalizer(moment);

const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;
const roleName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;
const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function SchedulerMaster({
  localizer = mLocalizer,
  showDemoLink = true,
  selectedEmpId,
  ...props
}) {
  const [displayEvents, setDisplayEvents] = useState([]);
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);

  useEffect(() => {
    getEvents();
  }, []);

  const combineDateAndTime = (selectedDate, startingTime) => {
    if (startingTime) {
      // Check if startingTime is not null or undefined
      const date = new Date(selectedDate);
      const [time, period] = startingTime?.split(" ");
      let [hours, minutes] = time?.split(":");

      if (period === "PM" && parseInt(hours, 10) < 12) {
        hours = String(parseInt(hours, 10) + 12);
      }

      date.setHours(hours);
      date.setMinutes(minutes);

      return date;
    }
  };

  const getRandomColor = () => {
    // const letters = "0123456789ABCDEF";
    // let color = "#";
    // for (let i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    // }
    // return color;
    const randomIndex = Math.floor(Math.random() * customColors.length);
    return customColors[randomIndex];
  };

  const getEvents = async (date = new Date()) => {
    let id;
    let url = "api/academic/timeTableDetailsOfStudentOrEmployeeForMobile?";
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (roleName === "Student") {
      const { data: response } = await axios.get(
        `/api/student/getStudentDetailsByAuid/${userName}`
      );
      const responseData = response.data;
      id = responseData.student_id;
      url = `${url}student_id=${id}&year=${year}&month=${month}`;
    } else {
      const { data: response } = await axios.get(
        `/api/employee/getEmployeeDataByUserID/${userId}`
      );
      const responseData = response.data;
      id = responseData.emp_id;
      url = `${url}year=${year}&employee_id=${id}&month=${month}`;
    }

    const ttResponse = await axios.get(url);
    let ttResponseData = ttResponse.data.data.flat();
    if (roleName === "Student") {
      ttResponseData = ttResponseData.filter(
        (obj) => obj.leave_type_short !== "RH"
      );
    }
    const timeTableData = [];
    ttResponseData.forEach((obj) => {
      const {
        timeSlots,
        date_of_class: dateOfClass,
        from_date: fromDate,
        start_time: startTime,
        end_time: endTime,
        interval_type_short: intervalType,
        time_table_id: timeTableId,
        holiday_calendar_id: holidayId,
        holiday_name: holiday,
        holiday_description: holidayDescription,
        present_status: presentStatus,
        course_short_name: courseName,
        course_code: code,
        employee_name: faculty,
        roomcode,
        is_online: mode,
        interval_type_name: intervalFullName,
        leave_type: leaveType,
        commencement_type: commencementType,
      } = obj;
      let date, title, start, end, type, description;
      if (timeTableId) {
        date = dateOfClass;
        title = `${intervalType} ${timeSlots}`;
        start = combineDateAndTime(date, startTime);
        end = combineDateAndTime(date, endTime);
        type = "timetable";
      } else if (holidayId || commencementType) {
        date = fromDate;
        title = holidayId ? `${holiday} - ${leaveType}` : commencementType;
        start = end = new Date(fromDate);
        type = holidayId ? "holiday" : "commencement";
        description = holidayDescription;
      }

      const tempObj = {
        start,
        end,
        title,
        bgColor: getRandomColor(),
        type,
        description,
        presentStatus,
        courseName,
        code,
        faculty,
        roomcode,
        mode,
        date,
        intervalFullName,
      };
      timeTableData.push(tempObj);
    });

    if (roleName !== "Student") {
      const [response] = await Promise.all([
        axios.get(`/api/getAllActiveDailyPlannerBasedOnEmpId/${id}`),
      ]);
      const dailyPlanData = response.data.data;
      dailyPlanData.forEach((obj) => {
        const {
          from_date: fromDate,
          to_date: toDate,
          type,
          task_title: taskTitle,
          task_type: taskType,
        } = obj;
        const start = moment(fromDate, "DD-MM-YYYY HH:mm").toDate();
        const end = moment(toDate, "DD-MM-YYYY HH:mm").toDate();
        let title;
        if (type === null) {
          title = taskTitle;
        } else if (type === "Personal") {
          title = taskTitle;
        } else {
          title = taskType;
        }
        const tempObj = { start, end, title, bgColor: getRandomColor() };
        timeTableData.push(tempObj);
      });
    }

    setDisplayEvents(timeTableData);
  };
  console.log("displayEvents", displayEvents);
  const CustomEvent = ({ event }) => {
    const { title, presentStatus } = event;
    const bg =
      presentStatus === true
        ? "green"
        : presentStatus === false
        ? "red"
        : "transparent";
    const textColor =
      presentStatus === true || presentStatus === false ? "white" : "";

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>{title}</div>
        <div
          style={{
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            // border: `1px solid white`,
            color: textColor,
            backgroundColor: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            marginLeft: "10px",
            fontWeight: "bold",
          }}
        >
          {presentStatus === true ? "P" : presentStatus === false ? "A" : ""}
        </div>
      </div>
    );
  };

  const { components, views } = useMemo(
    () => ({
      components: { event: CustomEvent },
      views: ["month", "week", "day", "agenda"],
    }),
    []
  );

  const handleNavigate = (date, view, action) => {
    if (action) {
      getEvents(date);
    }
  };

  const handleOpen = () => setWrapperOpen(true);

  const handleClose = () => setWrapperOpen(false);

  const handleSelectEvent = useCallback((event) => {
    if (event.description) {
      setSelectedEvent(event);
      handleOpen();
    }
  }, []);

  const handleEventProperty = (event) => {
    return {
      style: {
        backgroundColor: event.bgColor,
        color: "#b96b6b",
        fontSize: "12px",
      },
    };
  };

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };
  const ClassDetails = () => {
    console.log("selectedEvent", selectedEvent);
    const { courseName, code, faculty, roomcode, mode, date } = selectedEvent;
    return (
      <Grid container rowSpacing={0.5}>
        <DisplayContent
          label="Class Date"
          value={moment(date).format("DD-MM-YYYY")}
        />
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <DisplayContent label="Course" value={`${courseName} - ${code}`} />
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <DisplayContent label="Faculty" value={faculty} />
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <DisplayContent label="Room Code" value={roomcode} />
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <DisplayContent
          label="Mode of Class"
          value={mode ? "Online" : "Offline"}
        />
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Dialog
        open={wrapperOpen}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="subtitle2"
            component="span"
            sx={{ fontSize: 14 }}
          >
            {selectedEvent.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedEvent.type === "timetable" ? (
            <ClassDetails />
          ) : (
            <Typography sx={{ color: "#00000099" }}>
              {selectedEvent.description}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ height: "80vh" }} {...props}>
        <Calendar
          components={components}
          events={displayEvents}
          views={views}
          eventPropGetter={(e) => handleEventProperty(e)}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          localizer={localizer}
          showMultiDayTimes
          startAccessor="start"
          endAccessor="end"
          step={60}
        />
      </div>
    </>
  );
}

export default SchedulerMaster;
