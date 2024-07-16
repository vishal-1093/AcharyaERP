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
  Button,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

  const [events, setEvents] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([])
  const [eventsData, setEventsData] = useState([]);
  const [holidayChecked, setHolidayChecked] = useState(true)
  const [dailyPlanChecked, setDailyPlanChecked] = useState(true)
  const [timetableChecked, setTimetableChecked] = useState(true)
  const [open, setOpen] = useState(false)
  const setCrumbs = useBreadcrumbs()

  useEffect(() => {
    getEventData();
    setCrumbs([{ name: "" }])
  }, [selectedEmpId])

  const { components, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
        agenda: {
          event: customAgendaEvent,
        },
        month: {
          dateHeader: ({ date, label }) => {
            const attendenceList = events.filter(obj => obj.type === "attendence")
            const formattedDate = moment(date).format("YYYY-MM-DD")
            let obj = attendenceList.find(event => moment(formattedDate).isSame(event.date))
            if (obj && (obj.status === "P" || obj.status === "MA"))
              return <div style={{ display: "flex", justifyContent: "flex-end", gap: "9px" }}>
                <h4 style={{ color: "green",fontSize: "13px", fontWeight: 600 }}>{obj.status}</h4>
                <h5 style={{ color: "white", backgroundColor: "#00c04b", borderRadius: "50%", padding: "4px 5px 2px 5px",fontSize: "11px", fontWeight: 600 }}>{label}</h5>
              </div>

            if (obj && (obj.status === "A" || obj.status === "p/a"))
              return <div style={{ display: "flex", justifyContent: "flex-end", gap: "9px" }}>
                <h4 style={{ color: "#FF7F7F",fontSize: "13px", fontWeight: 600 }}>{obj.status}</h4>
                <h5 style={{ color: "white", backgroundColor: "#FF7F7F", borderRadius: "50%", padding: "4px 5px 2px 5px",fontSize: "11px", fontWeight: 600 }}>{label}</h5>
              </div>

            if (obj)
              return <div style={{ display: "flex", justifyContent: "flex-end", gap: "9px" }}>
                <label style={{ color: "#1c96c5",fontSize: "13px", fontWeight: 600 }}>{obj.status}</label>
                <label style={{ color: "white", backgroundColor: "#1c96c5", borderRadius: "50%", padding: "4px 5px 2px 5px", fontSize: "11px", fontWeight: 600 }}>{label}</label>
              </div>

            return <label style={{fontSize: "11px", fontWeight: 600}}>{label}</label>
          }
        }
      },
      views: ["month", "week", "day", "agenda"]
    }), [events])

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

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
    let studentTimeTable = []
    let internaltimeTable = []
    let timeTable = []
    let dailyPlans = []
    let attendence = []
    const holidayList = await getAllHolidayList()
    if (roleName === "Student") {
      studentTimeTable = await getStudentTimeTable()
    } else if (selectedEmpId) {
      // fetch selected employee data
      timeTable = await getEmployeeTimeTable()
      internaltimeTable = await getEmployeeInternalTimeTable()
      dailyPlans = await getDialyPlans(selectedEmpId)
      await getLeaveType()
      attendence = await getemployeeAttendence(selectedEmpId)
      await getemployeeLeaveDetails()
    } else {
      // Fetch loggedin user data
      const empId = await getEmployeeId()
      timeTable = await getUserTimeTable()
      internaltimeTable = await getUserInternalTimeTable()
      dailyPlans = await getDialyPlans(empId)
      if (empId !== null) {
        await getLeaveType()
        attendence = await getemployeeAttendence(empId)
        await getemployeeLeaveDetails()
      }
    }

    const combinedList = [...holidayList, ...studentTimeTable, ...internaltimeTable, ...timeTable, ...dailyPlans, ...attendence]
    setEvents([...combinedList])
    setDisplayEvents([...combinedList])
  }

  const getAllHolidayList = () => {
    return new Promise(async resolve => {
      axios.get(`/api/listAllHolidayCalenderData`)
        .then((holiddayRes) => {
          const list = holiddayRes.data.data.map((obj) => {
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
          })

          resolve(list)
        })
        .catch((err) => {
          console.error(err)
          resolve([])
        });
    })
  }

  const getStudentTimeTable = () => {
    return new Promise(async resolve => {
      axios
        .get(`/api/academic/timeTableDetailsOfStudentForWeb/${user_id}`)
        .then((ttRes) => {
          const timeTable = ttRes?.data?.data.map((event) => {
            const [startTime, endTime] = event.timeSlots.split(" - ")
            const start = combineDateAndTime(
              event?.selected_date,
              startTime
            );
            const end = combineDateAndTime(
              event?.selected_date,
              endTime
            );

            return {
              start: start,
              end: end,
              id: event?.time_table_id,
              secID: event?.section_id,
              sectionAssignmentId: event?.section_assignment_id,
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
            }
          })

          resolve(timeTable)
        })
        .catch((err) => {
          console.error(err)
          resolve([])
        })
    })
  }

  const getEmployeeTimeTable = () => {
    return new Promise(async resolve => {
      axios.get(`/api/academic/fetchTimeTableDetailsByEmployeeId/${selectedEmpId}`)
        .then((ttRes) => {
          const timeTable = ttRes?.data?.data.map((event) => {
            const [startTime, endTime] = event.timeSlots.split(" - ")
            const start = combineDateAndTime(
              event?.selected_date,
              startTime
            );
            const end = combineDateAndTime(
              event?.selected_date,
              endTime
            );

            return {
              start: start,
              end: end,
              id: event?.time_table_id,
              secID: event?.section_id,
              sectionAssignmentId: event?.section_assignment_id,
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
            }
          })

          resolve(timeTable)
        })
        .catch((err) => {
          console.error(err)
          resolve([])
        });
    })
  }

  const getEmployeeInternalTimeTable = () => {
    return new Promise(async resolve => {
      axios.get(`/api/academic/internalTimeTableAssignmentDetailsByEmployeeId/${selectedEmpId}`)
        .then((res) => {
          const internalTimeTableData = res?.data?.data.map((event) => {
            const [startTime, endTime] = event.timeSlots.split(" - ")
            const start = combineDateAndTime(
              event?.selected_date,
              startTime
            );
            const end = combineDateAndTime(
              event?.selected_date,
              endTime
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
              ac_year_id: event?.ac_year_id,
              program_assignment_id: event?.program_assignment_id,
              program_id: event?.program_id,
              program_specialization_id: event?.program_specialization_id,
              year_sem: event?.year_sem,
              attendance_status: event?.attendance_status,
            };
          });

          resolve(internalTimeTableData)
        })
        .catch((err) => {
          console.error(err)
          resolve([])
        });
    })
  }

  const getUserInternalTimeTable = () => {
    return new Promise(async resolve => {
      axios.get(`/api/academic/internalTimeTableAssignmentDetailsByUserId/${user_id}`)
        .then((res) => {
          const internalTimeTableData = res?.data?.data.map((event) => {
            const [startTime, endTime] = event.timeSlots.split(" - ")
            const start = combineDateAndTime(
              event?.selected_date,
              startTime
            );
            const end = combineDateAndTime(
              event?.selected_date,
              endTime
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
              ac_year_id: event?.ac_year_id,
              program_assignment_id: event?.program_assignment_id,
              program_id: event?.program_id,
              program_specialization_id: event?.program_specialization_id,
              year_sem: event?.year_sem,
              attendance_status: event?.attendance_status,
            }
          })

          resolve(internalTimeTableData)
        })
        .catch((err) => {
          console.error(err)
          resolve([])
        });
    })
  }

  const getUserTimeTable = () => {
    return new Promise(async resolve => {
      axios.get(`/api/academic/fetchTimeTableDetailsForCalender/${user_id}`)
        .then((ttRes) => {
          const timeTable = ttRes?.data?.data.map((event) => {
            const [startTime, endTime] = event.timeSlots.split(" - ")
            const start = combineDateAndTime(
              event?.selected_date,
              startTime
            );
            const end = combineDateAndTime(
              event?.selected_date,
              endTime
            )

            return {
              start: start,
              end: end,
              id: event?.time_table_id,
              secID: event?.section_id,
              sectionAssignmentId: event?.section_assignment_id,
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
            }
          })
          resolve(timeTable)
        })
        .catch((err) => {
          console.error(err)
          resolve([])
        });
    })
  }

  const getDialyPlans = (empId) => {
    return new Promise(async resolve => {
      axios.get(`/api/getAllActiveDailyPlannerBasedOnEmpId/${empId}`)
        .then(res => {
          const plans = res.data.data.map(obj => {
            const start = new Date(`${moment(`${obj.from_date} ${obj.from_time}`, "DD-MM-YYYY h:mm A")}`)
            const end = new Date(`${moment(`${obj.to_date} ${obj.to_time}`, "DD-MM-YYYY h:mm A")}`)

            return {
              id: `daily_task_${obj.id}`,
              start: start,
              end: end,
              type: "dailyPlan",
              title: `${obj?.task_title}`,
              name: `${obj?.task_title}`,
              description: obj.description,
              status: obj.task_status,
              priority: obj.task_priority,
              startTime: moment(obj.from_time, 'h:mm A').format('h:mm A'),
              endTime: moment(obj.to_time, 'h:mm A').format('h:mm A')
            }
          })
          resolve(plans)
        })
        .catch(err => {
          console.log(err);
          resolve([])
        })
    })
  }

  const getLeaveType = () => {
    return new Promise(async resolve => {
      axios.get("/api/LeaveType")
        .then(res => {
          resolve([])
        })
        .catch(err => {
          console.log(err);
        })
    })
  }

  const getemployeeAttendence = (empId) => {
    return new Promise(async resolve => {
      const createObj = (obj) => {
        const { month, year } = obj
        const array = []
        for (let day = 1; day <= 31; day++) {
          if (obj[`day${day}`]) {
            array.push({
              id: `att_day${day}_${month}_${year}`,
              status: obj[`day${day}`],
              type: "attendence",
              date: moment(`${day}-${month}-${year}`, "DD-MM-YYYY")
            })
          }
        }

        return array
      }

      axios.get(`/api/employee/getAttendanceOfEmployeeByEmployeeId/${empId}/2024-01/${moment().year()}-${moment().month() + 1}`)
        .then(res => {
          const data = res.data.data.map(obj => createObj(obj))
          resolve(data.flat())
        })
        .catch(err => {
          console.log(err);
          resolve([])
        })
    })
  }

  const getemployeeLeaveDetails = () => {
    return new Promise(async resolve => {
      axios.get(`/api/getLeaveKettyDetails/${user_id}`)
        .then(res => {
          resolve([])
        })
        .catch(err => {
          console.log(err);
          resolve([])
        })
    })
  }

  const getEmployeeId = () => {
    return new Promise(async resolve => {
      axios.get(`/api/employee/getEmployeeDetailsByUserID/${user_id}`)
        .then(res => {
          resolve(res.data.data.emp_id)
        })
        .catch(err => {
          console.log(err);
          resolve(null)
        })
    })
  }

  const handleSelectEvent = useCallback((selectedEvent) => {
    setEventsData(selectedEvent);
    if (selectedEvent?.type === "timeTable") {
      console.log("its selected", selectedEvent);
      navigate("/FacultyDetails", {
        state: { eventDetails: selectedEvent },
      });
    }

    if (selectedEvent?.type === "InternaltimeTable") {
      navigate(`/InternalTimeTable`, {
        state: { eventDetails: selectedEvent },
      });
    }
    if (selectedEvent?.type === "holiday" || selectedEvent?.type === "dailyPlan") {
      handleClickOpen();
    }
  }, []);

  const handleCheckBox = (e) => {
    const name = e.target.name
    const isChecked = e.target.checked
    if (name === "holiday") {
      setHolidayChecked(isChecked)
      showSelectedItemsOnCalander(isChecked, timetableChecked, dailyPlanChecked)
    } else if (name === "timeTable") {
      setTimetableChecked(isChecked)
      showSelectedItemsOnCalander(holidayChecked, isChecked, dailyPlanChecked)
    } else if (name === "dailyPlan") {
      setDailyPlanChecked(isChecked)
      showSelectedItemsOnCalander(holidayChecked, timetableChecked, isChecked)
    }
  }

  const showSelectedItemsOnCalander = (showHoliday, showtimeTable, showDailyPlan) => {
    const groupedResult = Object.groupBy(events, ({ type }) => type)
    let result = []

    if (showHoliday && "holiday" in groupedResult)
      result.push(...groupedResult["holiday"])

    if (showtimeTable && "timeTable" in groupedResult)
      result.push(...groupedResult["timeTable"])

    if (showtimeTable && "InternaltimeTable" in groupedResult)
      result.push(...groupedResult["InternaltimeTable"])

    if (showtimeTable && "student" in groupedResult)
      result.push(...groupedResult["student"])

    if (showDailyPlan && "dailyPlan" in groupedResult)
      result.push(...groupedResult["dailyPlan"])

    setDisplayEvents([...result])
  }

  return (
    <>
      <FormControl component="fieldset" sx={{ pb: 2 }}>
        <FormGroup aria-label="position" row>
          <FormControlLabel control={<Switch checked={holidayChecked} onChange={e => handleCheckBox(e)} />} label="Holidays" name="holiday" />
          <FormControlLabel control={<Switch checked={timetableChecked} onChange={e => handleCheckBox(e)} />} label="Time table" name="timeTable" />
          {roleName !== "Student" && <FormControlLabel control={<Switch checked={dailyPlanChecked} onChange={e => handleCheckBox(e)} />} label="Daily Plans" name="dailyPlan" />}
        </FormGroup>
      </FormControl>
      <Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px",
              },
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">{`${eventsData?.title} - ${eventsData?.priority} Task`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {eventsData.type === "dailyPlan" && <>
                {`${eventsData.startTime} - ${eventsData.endTime}`}
                <br></br><br></br>
              </>}
              {eventsData?.description}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Ok</Button>
          </DialogActions>
        </Dialog>
        <div style={{ height: "80vh" }} className="height600" {...props}>
          <Calendar
            components={components}
            events={displayEvents}
            localizer={localizer}
            showMultiDayTimes
            startAccessor="start"
            endAccessor="end"
            step={60}
            views={views}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => {
              let color = ""
              if(event?.type === "timeTable" && event?.attendance_status){
                color = "green"
              }else {
                if(event?.type === "InternaltimeTable" && event?.attendance_status){
                  color = "green"
                }else if(new Date(event?.date) > new Date() || event?.type === "holiday"){
                  color = "darkBlue"
                }else if(event?.type === "dailyPlan"){
                  if(event.status === "Completed"){
                    color = "green"
                  }else if(event.status === "Pending"){
                    color = "brown"
                  }else{
                    color = "black"
                  }
                }else color = "red"
              }

              // const color =
              //   event?.type === "timeTable" && event?.attendance_status
              //     ? "green"
              //     : event?.type === "InternaltimeTable" &&
              //       event?.attendance_status
              //       ? "green"
              //       : new Date(event?.date) > new Date() ||
              //         event?.type === "holiday"
              //         ? "darkBlue"
              //         : "red";
              return {
                style: {
                  backgroundColor: "transparent",
                  color: color,
                  fontSize: "12px",
                },
              };
            }}
          />
        </div>
      </Fragment>
    </>
  );
}
