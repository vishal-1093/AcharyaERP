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
    backgroundColor: "#182778",
    color: "white",
    padding: "5px",
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

function TimeTableFacultyViewPDF() {
  const [timeTableData, setTimeTableData] = useState([]);

  const { acYearId } = useParams();
  const { schoolId } = useParams();
  const { programSpeId } = useParams();
  const { programId } = useParams();
  const { yearsemId } = useParams();
  const { sectionId } = useParams();
  const { date } = useParams();
  const { courseId } = useParams();
  const { programType } = useParams();

  useEffect(() => {
    getTimeTableData();
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
          res.data.data.filter((obj) => {
            if (obj.course_id === Number(courseId) && obj.start === date) {
              temp.push(obj);
            }
          });
          setTimeTableData(temp);
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
            if (obj.course_id === courseId && obj.start === date) {
              temp.push(obj);
            }
          });
          setTimeTableData(temp);
        })
        .catch((err) => console.error(err));
    }
  };

  const timeTableTitle = () => {
    return (
      <>
        <View style={{ textAlign: "center" }}>
          <Text>Time Table Faculty Wise</Text>
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
            <Text style={styles.timeTableThStyle}>Faculty</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>EmpCode</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Code</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Course</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Week Day</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Time Slot</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Room Code</Text>
          </View>
        </View>
      </>
    );
  };

  const timeTableBody = () => {
    return (
      <>
        {timeTableData.map((obj, i) => {
          return (
            <>
              <View style={styles.tableRowStyle} key={i}>
                <View style={styles.timeTableTdHeaderStyle1}>
                  <Text style={styles.timeTableTdStyle}>
                    {obj.start.split("-").reverse().join("-")}
                  </Text>
                </View>
                <View style={styles.timeTableTdHeaderStyle1}>
                  <Text style={styles.timeTableTdStyle}>
                    {obj.employee_name}
                  </Text>
                </View>
                <View style={styles.timeTableTdHeaderStyle1}>
                  <Text style={styles.timeTableTdStyle}>{obj.empcode}</Text>
                </View>
                <View style={styles.timeTableTdHeaderStyle1}>
                  <Text style={styles.timeTableTdStyle}>{obj.course_code}</Text>
                </View>
                <View style={styles.timeTableTdHeaderStyle1}>
                  <Text style={styles.timeTableTdStyle}>{obj.course_name}</Text>
                </View>
                <View style={styles.timeTableTdHeaderStyle1}>
                  <Text style={styles.timeTableTdStyle}>{obj.week_day}</Text>
                </View>
                <View style={styles.timeTableTdHeaderStyle1}>
                  <Text style={styles.timeTableTdStyle}>{obj.time}</Text>
                </View>
                <View style={styles.timeTableTdHeaderStyle1}>
                  <Text style={styles.timeTableTdStyle}>{obj.roomcode}</Text>
                </View>
              </View>
            </>
          );
        })}
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

export default TimeTableFacultyViewPDF;
