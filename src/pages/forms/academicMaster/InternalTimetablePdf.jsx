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
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

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

const initialValues = {
  internalName: "",
  yearsemId: null,
};

function InternalTimetablePdf() {
  const [timeTableData, setTimeTableData] = useState([]);
  const [values, setValues] = useState(initialValues);

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getInternalTimetableData();
    getSessionAssginmentData();
    setCrumbs([{ name: "Session Master", link: "/SessionMaster/Session" }]);
  }, []);

  const getInternalTimetableData = async () => {
    await axios
      .get(`/api/academic/internalTimeTableDataBasisOfDOE/${id}`)
      .then((res) => {
        setTimeTableData(res.data.data);
      })
      .catch((error) => console.error(error));
  };

  const getSessionAssginmentData = async () => {
    await axios
      .get(`/api/academic/internalSessionAssignment/${id}`)
      .then((res) => {
        setValues({
          yearsemId: res.data.data.year_sem,
          internalName: res.data.data.internal_name,
        });
      })
      .catch((err) => console.error(err));
  };

  const timeTableTitle = () => {
    return (
      <>
        <View style={{ textAlign: "center" }}>
          <Text>
            Exam Time Table Form {values.internalName} - Year/Sem -
            {values.yearsemId}
          </Text>
        </View>
      </>
    );
  };

  const timeTableHeader = () => {
    return (
      <>
        <View style={styles.tableRowStyle} fixed>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Exam Time</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Exam Date</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Exam Day</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Course</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Min Marks</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Max Marks</Text>
          </View>
        </View>
      </>
    );
  };

  const timeTableBody = () => {
    return (
      <>
        {timeTableData.map((obj) => {
          return (
            <View style={styles.tableRowStyle}>
              <View style={styles.timeTableTdHeaderStyle1}>
                <Text style={styles.timeTableTdStyle}>{obj.timeSlots}</Text>
              </View>
              <View style={styles.timeTableTdHeaderStyle1}>
                <Text style={styles.timeTableTdStyle}>
                  {obj.date_of_exam.slice(0, 10)}
                </Text>
              </View>
              <View style={styles.timeTableTdHeaderStyle1}>
                <Text style={styles.timeTableTdStyle}>{obj.week_day}</Text>
              </View>
              <View style={styles.timeTableTdHeaderStyle1}>
                <Text style={styles.timeTableTdStyle}>{obj.course_name}</Text>
              </View>
              <View style={styles.timeTableTdHeaderStyle1}>
                <Text style={styles.timeTableTdStyle}>{obj.min_marks}</Text>
              </View>
              <View style={styles.timeTableTdHeaderStyle1}>
                <Text style={styles.timeTableTdStyle}>{obj.max_marks}</Text>
              </View>
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

export default InternalTimetablePdf;
