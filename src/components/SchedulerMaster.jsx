import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import moment from "moment";
import axios from "../services/Api";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import dayjs from "dayjs";

const mLocalizer = momentLocalizer(moment);

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "lightblue",
    },
  });

export default function SchedulerMaster({
  localizer = mLocalizer,
  showDemoLink = true,
  selectedEmpId,
  ...props
}) {
  const roleName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;

  const customAgendaEvent = ({ event }) => (
    <>
      {event?.type === "timeTable" && (
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "rgba(74, 87, 169, 0.1)" }}>
            <TableRow>
              <TableCell>Class Date</TableCell>
              <TableCell>WeekDay</TableCell>
              <TableCell>TimeSlots</TableCell>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Sem</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Room code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.week_day}</TableCell>
              <TableCell>{event.timeSlots}</TableCell>
              <TableCell>{event.course_code}</TableCell>
              <TableCell>{event.course_name}</TableCell>
              <TableCell>{event.current_sem}</TableCell>
              <TableCell>{event.section_name}</TableCell>
              <TableCell>{event.roomcode}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </>
  );

  const { components, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
        agenda: {
          event: customAgendaEvent,
        },
      },
      views: ["month", "week", "day", "agenda"],
    }),
    []
  );

  const [events, setEvents] = useState([]);
  const setCrumbs = useBreadcrumbs();
  useEffect(() => {
    getEventData();
    setCrumbs([{ name: "" }]);
  }, [selectedEmpId]);

  const user_id = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
  const navigate = useNavigate();

  function combineDateAndTime(selectedDate, startingTime) {
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
  }
  const getEventData = async () => {
    let temp = [];
    let temp2 = [];
    let temp3 = [];
    let studentData = [];
    let internalTimeTableData = [];

    await axios
      .get(`/api/institute/eventCreation`)
      .then(async (res) => {
        await axios
          .get(`/api/listAllHolidayCalenderData`)
          .then((holiddayRes) => {
            temp = holiddayRes.data.data.map((obj) => {
              let formattedResult = "";
              if (obj?.days_count > 1) {
                const parsedDate = dayjs(obj?.from_date, { utc: true });
                const resultDate = parsedDate.add(obj?.days_count, "day");
                formattedResult = resultDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
              } else {
                formattedResult = obj?.from_date;
              }
              return {
                id: obj?.holiday_calendar_id,
                title: `${obj?.leave_type_short} ${obj?.holiday_name}`,
                start: new Date(obj?.from_date),
                end: new Date(formattedResult),
                name: obj?.concat_holiday_name,
                description: obj?.holiday_description,
                type: "holiday",
              };
            });
          })
          .catch((err) => console.error(err));

        if (selectedEmpId) {
          await axios
            .get(
              `/api/academic/internalTimeTableAssignmentDetailsByEmployeeId/${selectedEmpId}`
            )
            .then((res) => {
              internalTimeTableData = res?.data?.data.map((event) => {
                const start = combineDateAndTime(
                  event?.selected_date,
                  event?.starting_time
                );
                const end = combineDateAndTime(
                  event?.selected_date,
                  event?.ending_time
                );
                return {
                  start: start,
                  end: end,
                  type: "InternaltimeTable",
                  title: `${event?.internal_short_name} ${event?.timeSlots}`,
                  name: `${event?.internal_short_name} ${event?.timeSlots}`,
                  student_ids: event?.student_ids,
                  internal_time_table_id: event?.internal_time_table_id,
                  id: event?.id,
                  internal_name: event?.internal_name,
                  course_with_coursecode: event?.course_with_coursecode,
                  timeSlots: event?.timeSlots,
                  course_assignment_id: event?.course_assignment_id,
                  course_id: event?.course_id,
                  emp_ids: event?.emp_ids,
                  date_of_exam: event?.date_of_exam,
                  exam_time: event?.exam_time,
                  room_id: event?.room_id,
                  internal_id: event?.internal_id,
                  itta_remarks: event?.itta_remarks,
                  week_day: event?.week_day,
                  empId: event?.emp_id,
                  ac_year_id:event?.ac_year_id,
                  program_assignment_id:event?.program_assignment_id,
                  program_id:event?.program_id,
                  program_specialization_id:event?.program_specialization_id,
                  year_sem:event?.year_sem,
                  attendance_status: event?.attendance_status,
                };
              });
            })
            .catch((err) => console.error(err));
        } else {
          await axios
            .get(
              `/api/academic/internalTimeTableAssignmentDetailsByUserId/${user_id}`
            )
            .then((res) => {
              internalTimeTableData = res?.data?.data.map((event) => {
                const start = combineDateAndTime(
                  event?.selected_date,
                  event?.starting_time
                );
                const end = combineDateAndTime(
                  event?.selected_date,
                  event?.ending_time
                );
                return {
                  start: start,
                  end: end,
                  type: "InternaltimeTable",
                  title: `${event?.internal_short_name} ${event?.timeSlots}`,
                  name: `${event?.internal_short_name} ${event?.timeSlots}`,
                  student_ids: event?.student_ids,
                  internal_time_table_id: event?.internal_time_table_id,
                  id: event?.id,
                  internal_name: event?.internal_name,
                  course_with_coursecode: event?.course_with_coursecode,
                  timeSlots: event?.timeSlots,
                  course_assignment_id: event?.course_assignment_id,
                  course_id: event?.course_id,
                  emp_ids: event?.emp_ids,
                  date_of_exam: event?.date_of_exam,
                  exam_time: event?.exam_time,
                  room_id: event?.room_id,
                  internal_id: event?.internal_id,
                  itta_remarks: event?.itta_remarks,
                  week_day: event?.week_day,
                  empId: event?.emp_id, 
                  ac_year_id:event?.ac_year_id,
                  program_assignment_id:event?.program_assignment_id,
                  program_id:event?.program_id,
                  program_specialization_id:event?.program_specialization_id,
                  year_sem:event?.year_sem,
                  attendance_status: event?.attendance_status,
                };
              });
            })
            .catch((err) => console.error(err));
        }
        if (selectedEmpId) {
          await axios
            .get(
              `/api/academic/fetchTimeTableDetailsByEmployeeId/${selectedEmpId}`
            )
            .then((ttRes) => {
              ttRes?.data?.data.forEach((event) => {
                const start = combineDateAndTime(
                  event?.selected_date,
                  event?.starting_time
                );
                const end = combineDateAndTime(
                  event?.selected_date,
                  event?.ending_time
                );

                temp3.push({
                  start: start,
                  end: end,
                  id: event?.time_table_id,
                  secID: event?.section_assignment_id,
                  acYearId: event?.ac_year_id,
                  schoolID: event?.school_id,
                  empId: event?.emp_id,
                  programId: event?.program_id,
                  courseId: event?.course_id,
                  programSpecializationId: event?.program_specialization_id,
                  title: `${event?.interval_type_short} ${event?.timeSlots}`,
                  name: `${event?.interval_type_short} ${event?.timeSlots}`,
                  description: event?.holiday_description || "-",
                  type: "timeTable",
                  week_day: event?.week_day,
                  course_code: event?.course_code,
                  current_sem: event?.current_sem,
                  course_name: event?.course_name,
                  current_year: event?.current_year,
                  course_assignment_id: event?.course_assignment_id,
                  roomcode: event?.roomcode,
                  timeSlots: event?.timeSlots,
                  ac_year: event?.ac_year,
                  program_short_name: event?.program_short_name,
                  program_specialization_short_name:
                    event?.program_specialization_short_name,
                  date: event?.selected_date,
                  section_name: event?.section_name,
                  time_slots_id: event?.time_slots_id,
                  batch_assignment_id: event?.batch_assignment_id,
                  batch_id: event?.batch_id,
                  attendance_status: event?.attendance_status,
                });
              });
            })
            .catch((err) => console.error(err));
        } else if (roleName === "Student") {
          await axios
            .get(`/api/academic/timeTableDetailsOfStudentForWeb/${user_id}`)
            .then((ttRes) => {
              ttRes?.data?.data.forEach((event) => {
                const start = combineDateAndTime(
                  event?.selected_date,
                  event?.starting_time
                );
                const end = combineDateAndTime(
                  event?.selected_date,
                  event?.ending_time
                );

                studentData.push({
                  start: start,
                  end: end,
                  id: event?.time_table_id,
                  secID: event?.section_assignment_id,
                  acYearId: event?.ac_year_id,
                  schoolID: event?.school_id,
                  empId: event?.emp_id,
                  programId: event?.program_id,
                  courseId: event?.course_id,
                  programSpecializationId: event?.program_specialization_id,
                  title: `${event?.interval_type_short} ${event?.timeSlots}`,
                  name: `${event?.interval_type_short} ${event?.timeSlots}`,
                  description: event?.holiday_description || "-",
                  type: "student",
                  week_day: event?.week_day,
                  course_code: event?.course_code,
                  current_sem: event?.current_sem,
                  course_assignment_id: event?.course_assignment_id,
                  course_name: event?.course_name,
                  current_year: event?.current_year,
                  roomcode: event?.roomcode,
                  timeSlots: event?.timeSlots,
                  ac_year: event?.ac_year,
                  program_short_name: event?.program_short_name,
                  program_specialization_short_name:
                    event?.program_specialization_short_name,
                  date: event?.selected_date,
                  section_name: event?.section_name,
                  time_slots_id: event?.time_slots_id,
                  batch_assignment_id: event?.batch_assignment_id,
                  batch_id: event?.batch_id,
                  attendance_status: event?.attendance_status,
                });
              });
            })
            .catch((err) => console.error(err));
        } else {
          await axios
            .get(`/api/academic/fetchTimeTableDetailsForCalender/${user_id}`)
            .then((ttRes) => {
              ttRes?.data?.data.forEach((event) => {
                const start = combineDateAndTime(
                  event?.selected_date,
                  event?.starting_time
                );
                const end = combineDateAndTime(
                  event?.selected_date,
                  event?.ending_time
                );

                temp2.push({
                  start: start,
                  end: end,
                  id: event?.time_table_id,
                  secID: event?.section_assignment_id,
                  acYearId: event?.ac_year_id,
                  schoolID: event?.school_id,
                  empId: event?.emp_id,
                  programId: event?.program_id,
                  courseId: event?.course_id,
                  programSpecializationId: event?.program_specialization_id,
                  title: `${event?.interval_type_short} ${event?.timeSlots}`,
                  name: `${event?.interval_type_short} ${event?.timeSlots}`,
                  description: event?.holiday_description || "-",
                  type: "timeTable",
                  week_day: event?.week_day,
                  course_code: event?.course_code,
                  current_sem: event?.current_sem,
                  course_assignment_id: event?.course_assignment_id,
                  course_name: event?.course_name,
                  current_year: event?.current_year,
                  roomcode: event?.roomcode,
                  timeSlots: event?.timeSlots,
                  ac_year: event?.ac_year,
                  program_short_name: event?.program_short_name,
                  program_specialization_short_name:
                    event?.program_specialization_short_name,
                  date: event?.selected_date,
                  section_name: event?.section_name,
                  time_slots_id: event?.time_slots_id,
                  batch_assignment_id: event?.batch_assignment_id,
                  batch_id: event?.batch_id,
                  attendance_status: event?.attendance_status,
                });
              });
            })
            .catch((err) => console.error(err));
        }

        const tempEvents = res.data.data.map((obj) => ({
          id: obj?.event_id,
          title: obj?.event_name,
          start: new Date(obj?.event_start_time),
          end: new Date(obj?.event_end_time),
          resource: obj?.event_description,
          name: obj?.event_name,
          description: obj?.event_description,
        }));

        setEvents([
          ...temp,
          ...tempEvents,
          ...temp2,
          ...temp3,
          ...internalTimeTableData,
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleSelectEvent = useCallback((selectedEvent) => {
    if (selectedEvent?.type === "timeTable") {
      navigate("/FacultyDetails", {
        state: { eventDetails: selectedEvent },
      });
    }

    if (selectedEvent?.type === "InternaltimeTable") {
      navigate(`/InternalTimeTable`, {
        state: { eventDetails: selectedEvent },
      });
    }
    if (selectedEvent?.type === "holiday") {
      alert(selectedEvent?.title);
    }
  }, []);

  return (
    <>
      <Fragment>
        <div style={{ height: "80vh" }} className="height600" {...props}>
          <Calendar
            components={components}
            events={events}
            localizer={localizer}
            showMultiDayTimes
            startAccessor="start"
            endAccessor="end"
            step={60}
            views={views}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => {
              const color =
                event?.type === "timeTable" && event?.attendance_status
                  ? "green"
                  : event?.type === "InternaltimeTable" && event?.attendance_status
                  ? "green"
                  : new Date(event?.date) > new Date() ||
                    event?.type === "holiday"
                  ? "darkBlue"
                  : "red";
              return {
                style: {
                  backgroundColor: "transparent",
                  color: color,
                  fontSize: "12px",
                  textDecoration: "underline",
                },
              };
            }}
          />
        </div>
      </Fragment>
    </>
  );
}
