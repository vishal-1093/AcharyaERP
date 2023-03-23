import { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import axios from "../services/Api";
import { useParams } from "react-router-dom";
import acharyaLogo from "../assets/acharyaLogo.png";
import studentLogo from "../assets/studentLogo.png";
import { convertToDMY } from "../utils/DateTimeUtils";

function StudentDocumentCollectionPdf() {
  const [studentDetails, setStudentDetails] = useState({});
  const [transcriptData, setTranscriptData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/student/getDataForTestimonials/${id}`)
      .then((res) => {
        setStudentDetails(res.data.data.Student_details);
        setTranscriptData(res.data.data.Student_Transcript_Details);
      })
      .catch((err) => console.error(err));
  };

  const styles = StyleSheet.create({
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    pageLayout: { margin: 25 },

    header: {
      fontSize: "10px",
      fontWeight: "bold",
      padding: "3px",
      textAlign: "center",
      marginBottom: "10px",
      fontFamily: "Times-Roman",
      borderBottom: "1px solid black",
    },

    logoHeaderStyle: {
      flexDirection: "row",
      backgroundColor: "#182778",
      color: "white",
      padding: "5px",
      marginBottom: "10px",
    },

    img: {
      width: "50px",
      marginVertical: 0,
      marginHorizontal: 0,
    },

    tableRowStyle: {
      flexDirection: "row",
    },

    thStyle: {
      fontSize: "10px",
      fontWeight: "bold",
      width: "15%",
      fontFamily: "Times-Roman",
      color: "#000000",
      padding: "4px",
    },

    tdStyle: {
      fontSize: "10px",
      width: "35%",
      fontWeight: "600",
      textTransform: "capitalize",
      fontFamily: "Times-Roman",
    },

    studentTableStyle: { marginBottom: "10px" },

    transcripttableStyle: {
      display: "table",
      width: "auto",
      marginBottom: "75px",
    },

    transcriptThHeaderStyle: {
      width: "20%",
      backgroundColor: "#182778",
      color: "white",
    },

    transcriptThStyle: {
      textAlign: "center",
      padding: "5px",
      fontFamily: "Times-Roman",
      fontSize: "10px",
      fontWeight: "bold",
    },

    transcriptTdHeaderStyle1: {
      width: "20%",
      borderWidth: 1,
      borderTopWidth: 0,
    },

    transcriptTdHeaderStyle: {
      width: "20%",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },

    transcriptTdStyle: {
      textAlign: "center",
      padding: "5px",
      fontFamily: "Times-Roman",
      fontSize: "10px",
      fontWeight: "bold",
    },

    studentSignatureStyle: {
      fontSize: "10px",
      fontFamily: "Times-Roman",
      width: "50%",
      marginBottom: "20px",
    },

    collectorSignatureStyle: {
      fontSize: "10px",
      fontFamily: "Times-Roman",
      width: "50%",
      textAlign: "right",
    },
    // heading: {
    //   backgroundColor: "#182778",
    //   color: "white",
    //   // fontSize: 11,
    //   padding: 3,
    //   textAlign: "center",
    //   fontFamily: "Times-Roman",
    // },
    // tableRowStyle: {
    //   flexDirection: "row",
    //   // border: "1px solid #dddddd",
    //   padding: "5px",
    // },

    // rowStyle: { flexDirection: "row" },

    // transcriptTh: {
    //   fontSize: "10px",
    //   fontWeight: "bold",
    //   fontFamily: "Times-Roman",
    //   backgroundColor: "#182778",
    //   color: "white",
    //   width: "100%",
    //   padding: "5px",
    //   textAlign: "center",
    // },

    // transcriptTd: {
    //   fontSize: "10px",
    //   fontFamily: "Times-Roman",
    // },
  });

  const logoHeader = () => {
    return (
      <>
        <View style={{ width: "10%" }}>
          <Image src={acharyaLogo} style={styles.img} />
        </View>
        <View
          style={{
            width: "80%",
            textAlign: "center",
          }}
        >
          <Text
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              lineHeight: "1.5",
              fontFamily: "Times-Roman",
            }}
          >
            ACHARYA INSTITUTES
          </Text>
          <Text
            style={{
              fontSize: "10px",
              lineHeight: "1.5",
              fontFamily: "Times-Roman",
            }}
          >
            Acharya Dr.Sarvepalli Radha krishna road, Bangalore - 560107,India.
          </Text>
          <Text
            style={{
              fontSize: "10px",
              lineHeight: "1.5",
              fontFamily: "Times-Roman",
            }}
          >
            Document Collection
          </Text>
        </View>
        <View
          style={{
            width: "10%",
            textAlign: "right",
          }}
        >
          <Image
            src={studentLogo}
            style={{ width: "50px", borderRadius: "60%" }}
          />
        </View>
      </>
    );
  };

  const studentTable = () => {
    return (
      <>
        <View style={styles.tableRowStyle}>
          <Text style={styles.thStyle}>Name</Text>
          <Text style={styles.tdStyle}>{studentDetails.candidate_name} </Text>

          <Text style={styles.thStyle}>Visitor Id</Text>
          <Text style={styles.tdStyle}>{studentDetails.visitor_id}</Text>
        </View>

        <View style={styles.tableRowStyle}>
          <Text style={styles.thStyle}>Date of visit</Text>
          <Text style={styles.tdStyle}>{studentDetails.date_of_visit}</Text>

          <Text style={styles.thStyle}>Mobile</Text>
          <Text style={styles.tdStyle}>{studentDetails.mobile}</Text>
        </View>

        <View style={styles.tableRowStyle}>
          <Text style={styles.thStyle}>AUID</Text>
          <Text style={styles.tdStyle}>{studentDetails.auid}</Text>

          <Text style={styles.thStyle}>USN</Text>
          <Text style={styles.tdStyle}>{studentDetails.usn}</Text>
        </View>

        <View style={styles.tableRowStyle}>
          <Text style={styles.thStyle}>AC Year</Text>
          <Text style={styles.tdStyle}>{studentDetails.ac_year} </Text>

          <Text style={styles.thStyle}>School</Text>
          <Text style={styles.tdStyle}>{studentDetails.school_name_short}</Text>
        </View>

        <View style={styles.tableRowStyle}>
          <Text style={styles.thStyle}>Program</Text>
          <Text style={styles.tdStyle}>
            {studentDetails.program_short_name}
          </Text>

          <Text style={styles.thStyle}>Specilization</Text>
          <Text style={styles.tdStyle}>
            {studentDetails.program_specialization_short_name}
          </Text>
        </View>

        <View style={styles.tableRowStyle}>
          <Text style={styles.thStyle}>Category</Text>
          <Text style={styles.tdStyle}>
            {studentDetails.fee_admission_category_type}
          </Text>

          <Text style={styles.thStyle}>Fee Template</Text>
          <Text style={styles.tdStyle}>{studentDetails.fee_template_name}</Text>
        </View>
      </>
    );
  };

  const transcriptTableHeader = () => {
    return (
      <>
        <View style={styles.tableRowStyle} fixed>
          <View style={styles.transcriptThHeaderStyle}>
            <Text style={styles.transcriptThStyle}>Transcript</Text>
          </View>
          <View style={styles.transcriptThHeaderStyle}>
            <Text style={styles.transcriptThStyle}>Collected</Text>
          </View>
          <View style={styles.transcriptThHeaderStyle}>
            <Text style={styles.transcriptThStyle}>Submit By</Text>
          </View>
          <View style={styles.transcriptThHeaderStyle}>
            <Text style={styles.transcriptThStyle}>Collected By</Text>
          </View>
          <View style={styles.transcriptThHeaderStyle}>
            <Text style={styles.transcriptThStyle}>Collected By Institute</Text>
          </View>
        </View>
      </>
    );
  };

  const transcriptTableBody = () => {
    return (
      <>
        {transcriptData.map((obj, i) => {
          return (
            <View style={styles.tableRowStyle}>
              <View style={styles.transcriptTdHeaderStyle1}>
                <Text style={styles.transcriptTdStyle}>{obj.transcript}</Text>
              </View>
              <View style={styles.transcriptTdHeaderStyle}>
                <Text style={styles.transcriptTdStyle}>
                  {obj.will_submit_by ? "" : "Yes"}
                </Text>
              </View>
              <View style={styles.transcriptTdHeaderStyle}>
                <Text style={styles.transcriptTdStyle}>
                  {obj.will_submit_by
                    ? `${convertToDMY(obj.will_submit_by.slice(0, 10))}`
                    : ""}
                </Text>
              </View>
              <View style={styles.transcriptTdHeaderStyle}>
                <Text style={styles.transcriptTdStyle}>
                  {obj.created_username}
                </Text>
              </View>
              <View style={styles.transcriptTdHeaderStyle}>
                <Text style={styles.transcriptTdStyle}>
                  {obj.collected_by_institute}
                </Text>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  const handleSignature = () => {
    return (
      <>
        <View style={styles.tableRowStyle}>
          <Text style={styles.studentSignatureStyle}>
            Signature of the document collector
          </Text>
          <Text style={styles.collectorSignatureStyle}>
            Signature of the document collector
          </Text>
        </View>

        <View style={styles.tableRowStyle}>
          <Text style={styles.studentSignatureStyle}>Date : </Text>
          <Text style={styles.collectorSignatureStyle}>Place : Bangalore</Text>
        </View>
      </>
    );
  };
  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Document Collection">
          <Page size="A4">
            <View style={styles.pageLayout}>
              {/* <Text style={styles.header}>Document Collection</Text> */}
              <View style={styles.logoHeaderStyle}>{logoHeader()}</View>
              <View style={styles.studentTableStyle}>{studentTable()}</View>
              <View style={styles.transcripttableStyle}>
                {transcriptTableHeader()}
                {transcriptTableBody()}
              </View>
              <View>{handleSignature()}</View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}

export default StudentDocumentCollectionPdf;
