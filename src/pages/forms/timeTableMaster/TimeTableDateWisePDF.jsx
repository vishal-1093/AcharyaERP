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

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  pageLayout: { margin: 25 },

  tableRowStyle: {
    flexDirection: "row",
  },

  timeTableTitle: {
    color: "#182778",
    fontSize: 12,
    fontFamily: "Times-Roman",
    marginTop: "100px",
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
    width: "20%",
    borderWidth: 0.5,
    borderTopWidth: 0,
    height: "40px",
  },

  timeTableTdStyle: {
    textAlign: "center",
    padding: "5px",
    fontFamily: "Times-Roman",
    fontSize: "10px",
  },
});

function TimeTableDateWisePDF() {
  const [timeTableData, setTimeTableData] = useState([]);
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
    getTimeTableData();
    getSchoolName();
    getSectionName();
  }, []);

  const allDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getDay = new Date(date);
  let day = getDay.getDay();

  const showDay = allDays[day + 1];

  const getTimeTableData = async () => {
    if (Number(programType) === 1) {
      await axios
        .get(
          `/api/academic/coursesAssignedDetailsForTimeTableView?ac_year_id=${acYearId}&school_id=${schoolId}&program_id=${programId}&program_specialization_id=${programSpeId}&section_id=${sectionId}&current_year=${yearsemId}&selected_date=${date}`
        )
        .then((res) => {
          const temp = [];
          const times = [];
          const tempOne = {};
          res.data.data.filter((obj) => {
            if (obj.start === date) {
              temp.push(obj);
            }
          });
          temp.forEach((obj) => {
            times.push(obj.time);
          });
          setAllTime(times);
          times.forEach((obj) => {
            const test = temp.filter((val) => val.time === obj);
            tempOne[obj] = test;
          });

          setTimeTableData(tempOne);
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/academic/coursesAssignedDetailsForTimeTableView?ac_year_id=${acYearId}&school_id=${schoolId}&program_id=${programId}&program_specialization_id=${programSpeId}&section_id=${sectionId}&current_sem=${yearsemId}&selected_date=${date}`
        )
        .then((res) => {
          const temp = [];
          const times = [];
          const tempOne = {};
          res.data.data.filter((obj) => {
            if (obj.start === date) {
              temp.push(obj);
            }
          });
          temp.forEach((obj) => {
            times.push(obj.time);
          });
          setAllTime(times);
          times.forEach((obj) => {
            const test = temp.filter((val) => val.time === obj);
            tempOne[obj] = test;
          });

          setTimeTableData(tempOne);
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
            <Text style={styles.timeTableThStyle}>Date</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Day</Text>
          </View>
          {allTime.map((obj, i) => {
            return (
              <View style={styles.timeTableThHeaderStyle} key={i}>
                <Text style={styles.timeTableThStyle}>{obj}</Text>
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
        <View style={styles.tableRowStyle}>
          <View style={styles.timeTableTdHeaderStyle1}>
            <Text style={styles.timeTableTdStyle}>
              {date.split("-").reverse().join("-")}
            </Text>
          </View>
          <View style={styles.timeTableTdHeaderStyle1}>
            <Text style={styles.timeTableTdStyle}>{showDay}</Text>
          </View>
          {allTime.map((obj) => {
            return timeTableData[obj].map((obj1, i) => {
              return (
                <View style={styles.timeTableTdHeaderStyle1}>
                  <Text style={styles.timeTableTdStyle}>
                    {obj1.course_name}
                  </Text>
                </View>
              );
            });
          })}
        </View>
      </>
    );
  };

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Internal Assessment">
          <Page size="A4">
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

export default TimeTableDateWisePDF;
