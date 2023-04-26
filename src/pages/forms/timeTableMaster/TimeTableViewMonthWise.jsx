import { useEffect, useRef, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";

//Fullcalendar and Realted Plugins
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed
import { convertDateToString } from "../../../utils/DateTimeUtils";
import FormPaperWrapper from "../../../components/FormPaperWrapper";

const useStyles = makeStyles((theme) => ({
  box: {
    width: "1250px",
    fontFamily: "sans-serif",
    fontSize: 12,
    textAlign: "center",
  },
}));

function App() {
  const [timeSlots, setTimeSlots] = useState([]);

  const calendarRef = useRef(null);
  const classes = useStyles();
  const { acYearId } = useParams();
  const { schoolId } = useParams();
  const { programSpeId } = useParams();
  const { programId } = useParams();
  const { yearsemId } = useParams();
  const { sectionId } = useParams();
  const { date } = useParams();
  const { programType } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    handleGoto();
  }, []);

  const handleGoto = () => {
    if (date) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date);
    }
  };

  useEffect(() => {
    getTimeTableData();
  }, []);

  const getTimeTableData = async () => {
    if (programType === 1) {
      await axios
        .get(
          `/api/academic/coursesAssignedDetailsForTimeTableView?ac_year_id=${acYearId}&school_id=${schoolId}&program_id=${programId}&program_specialization_id=${programSpeId}&section_id=${sectionId}&current_year=${yearsemId}&selected_date=${date}`
        )
        .then((res) => {
          const temp = [];
          res.data.data.filter((obj) => {
            if (obj.selected_date === date) {
              temp.push(obj);
            }
          });

          setTimeSlots(res.data.data);
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/academic/coursesAssignedDetailsForTimeTableView?ac_year_id=${acYearId}&school_id=${schoolId}&program_id=${programId}&program_specialization_id=${programSpeId}&section_id=${sectionId}&current_sem=${yearsemId}&selected_date=${date}`
        )
        .then((res) => {
          const temp = [];
          res.data.data.filter((obj) => {
            if (obj.selected_date === date) {
              temp.push(obj);
            }
          });

          setTimeSlots(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1} className={classes.box}>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-start"
        rowSpacing={4}
        columnSpacing={{ xs: 2, md: 4 }}
      >
        <Grid item xs={12} md={12}>
          <FullCalendar
            ref={calendarRef}
            height="110vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            defaultView="month"
            eventClick={(arg) =>
              navigate(
                `/TimeTableViewForCourse/${acYearId}/${schoolId}/${programId}/${programSpeId}/${yearsemId}/${sectionId}/${convertDateToString(
                  arg.event.start
                )
                  .split("/")
                  .reverse()
                  .join("-")}/${
                  arg.event._def.extendedProps.course_id
                }/${programType}`
              )
            }
            events={timeSlots}
            headerToolbar={{
              start: "",
              center: "title",
              end: "today",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
