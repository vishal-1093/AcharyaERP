import { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import { convertDateToString, getWeekDays } from "../../../utils/DateTimeUtils";

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  pageLayout: { margin: 20 },

  tableRowStyle: {
    flexDirection: "row",
  },

  timeTableTitle: {
    color: "#182778",
    fontSize: 12,
    fontFamily: "Times-Roman",

    marginBottom: "10px",
  },

  timetableStyle: {
    display: "table",
    width: "auto",
    marginBottom: "75px",
  },

  timeTableThHeaderStyle: {
    width: "20%",
    backgroundColor: "#182778",
    color: "white",
  },

  timeTableThStyle: {
    textAlign: "center",
    padding: "5px",
    fontFamily: "Times-Roman",
    fontSize: "10px",
    fontWeight: "bold",
  },

  timeTableTdHeaderStyle1: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    borderWidth: 0.5,
    borderTopWidth: 0,
    height: "50px",
  },

  timeTableTdStyle: {
    textAlign: "center",
    padding: "5px",
    fontFamily: "Times-Roman",
    fontSize: 10,
  },
});

function TimeTableViewWeekWisePdf() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [allTime, setAllTime] = useState([]);
  const [schoolName, setSchoolName] = useState("");
  const [sectionName, setSectionName] = useState("");

  const { acYearId } = useParams();
  const { schoolId } = useParams();
  const { programSpeId } = useParams();
  const { programId } = useParams();
  const { yearsemId } = useParams();
  const { sectionId } = useParams();
  const { date } = useParams();
  const { programType } = useParams();

  useEffect(() => {
    getTimeTableDetails();
    getSchoolName();
    getSectionName();
  }, []);

  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getTimeTableDetails = async () => {
    if (Number(programType) === 1) {
      await axios
        .get(
          `/api/academic/coursesAssignedDetailsForTimeTableView?ac_year_id=${acYearId}&school_id=${schoolId}&program_id=${programId}&program_specialization_id=${programSpeId}&section_id=${sectionId}&current_year=${yearsemId}&selected_date=${date}`
        )
        .then((res) => {
          const tempOne = {};
          const temp = [];
          const weekDays = getWeekDays(new Date(date));
          const dates = [];

          const timesId = [];

          res.data.data.map((obj) => {
            weekDays.filter((obj1) => {
              if (
                convertDateToString(obj1).split("/").reverse().join("-") ===
                obj.start
              ) {
                temp.push(obj);
              }
            });

            temp.forEach((val) => {
              if (dates.includes(val.start) === false) {
                dates.push(val.start);
              }
              if (timesId.includes(val.time) === false) {
                timesId.push(val.time_slots_id);
              }
            });

            const times = [];

            temp.forEach((obj) => {
              if (
                times.filter((item) => item.slotId === obj.time_slots_id)
                  .length === 0
              ) {
                times.push({
                  slotId: obj.time_slots_id,
                  slotName: obj.time,
                });
              }
            });

            allDays.forEach((obj) => {
              timesId.forEach((obj1) => {
                const maintest = temp.filter(
                  (val) => val.week_day === obj && val.time_slots_id === obj1
                );
                tempOne[obj + "-" + obj1] = maintest;
              });
            });

            setTimeSlots(tempOne);

            setAllTime(times);
          });
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/academic/coursesAssignedDetailsForTimeTableView?ac_year_id=${acYearId}&school_id=${schoolId}&program_id=${programId}&program_specialization_id=${programSpeId}&section_id=${sectionId}&current_sem=${yearsemId}&selected_date=${date}`
        )
        .then((res) => {
          const tempOne = {};
          const temp = [];
          const weekDays = getWeekDays(new Date(date));
          const dates = [];

          const timesId = [];

          res.data.data.map((obj) => {
            weekDays.filter((obj1) => {
              if (
                convertDateToString(obj1).split("/").reverse().join("-") ===
                obj.start
              ) {
                temp.push(obj);
              }
            });

            temp.forEach((val) => {
              if (dates.includes(val.start) === false) {
                dates.push(val.start);
              }
              if (timesId.includes(val.time) === false) {
                timesId.push(val.time_slots_id);
              }
            });

            const times = [];

            temp.forEach((obj) => {
              if (
                times.filter((item) => item.slotId === obj.time_slots_id)
                  .length === 0
              ) {
                times.push({
                  slotId: obj.time_slots_id,
                  slotName: obj.time,
                });
              }
            });

            allDays.forEach((obj) => {
              timesId.forEach((obj1) => {
                const maintest = temp.filter(
                  (val) => val.week_day === obj && val.time_slots_id === obj1
                );
                tempOne[obj + "-" + obj1] = maintest;
              });
            });

            setTimeSlots(tempOne);
            setAllTime(times);
          });
        })
        .catch((err) => console.error(err));
    }
  };

  const getSchoolName = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        res.data.data.filter((obj) => {
          if (obj.school_id === Number(schoolId)) {
            setSchoolName(obj.school_name);
          }
        });
      })
      .catch((err) => console.error(err));
  };

  const getSectionName = async () => {
    await axios
      .get(`/api/academic/Section`)
      .then((res) => {
        res.data.data.filter((obj) => {
          if (obj.section_id === Number(sectionId)) {
            setSectionName(obj.section_name);
          }
        });
      })
      .catch((err) => console.error(err));
  };

  const timeTableTitle = () => {
    return (
      <>
        <View style={{ textAlign: "center" }}>
          <Text>{schoolName}</Text>
          <Text>
            Section : {sectionName} , Year/Sem : {yearsemId}
          </Text>
          <Text></Text>
        </View>
      </>
    );
  };

  const timeTableHeader = () => {
    return (
      <>
        <View style={styles.tableRowStyle} fixed>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Day</Text>
          </View>
          {allTime.map((obj, i) => {
            return (
              <View style={styles.timeTableThHeaderStyle} key={i}>
                <Text style={styles.timeTableThStyle}>{obj.slotName}</Text>
              </View>
            );
          })}
        </View>
      </>
    );
  };

  const timeTableBody = () => {
    return (
      <>
        {allDays.map((obj, i) => {
          return (
            <View style={styles.tableRowStyle}>
              <View style={styles.timeTableTdHeaderStyle1} key={i}>
                <Text style={styles.timeTableTdStyle}>{obj}</Text>
              </View>
              {allTime.map((obj1) => {
                return (
                  <View style={styles.timeTableTdHeaderStyle1}>
                    <Text style={styles.timeTableTdStyle}>
                      {timeSlots[obj + "-" + obj1.slotId].length > 0
                        ? timeSlots[obj + "-" + obj1.slotId][0]["course_name"]
                        : "--"}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </>
    );
  };

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Internal Assessment">
          <Page size="A4" orientation="landscape">
            <View style={styles.pageLayout}>
              <View style={styles.timeTableTitle}>{timeTableTitle()}</View>

              <View style={styles.timetableStyle}>
                {timeTableHeader()}
                {timeTableBody()}
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}

export default TimeTableViewWeekWisePdf;
