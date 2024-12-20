import React from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  PDFViewer,
  View,
  Font,
} from "@react-pdf/renderer";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";

// Register the Arial font
Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoBold, fontStyle: "bold", fontWeight: 700 },
    { src: RobotoItalic, fontStyle: "italic", fontWeight: 200 },
    { src: RobotoLight, fontStyle: "light", fontWeight: 300 },
    { src: RobotoRegular, fontStyle: "normal" },
  ],
});

// Create styles
const styles = StyleSheet.create({
  pageLayout: {
    margin: 25,
  },
  viewer: {
    width: "100%",
    height: "100vh", // Ensure the viewer fills the screen
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column1: {
    width: "23%", // Adjust width to fit 4 columns in one row
    textAlign: "center",
  },
  column: {
    width: "16%", // Adjust width to fit 4 columns in one row
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 12,
  },
  value: {
    fontSize: 12,
  },
  table: {
    width: "100%",
    border: "1px solid black",
    display: "table",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid black",
  },
  tableCell: {
    width: "50%",
    padding: 2,
    textAlign: "center",
    fontSize: 12,
    borderRight: "1px solid black",
    fontFamily: "Roboto",
  },
});

// Create a Document with multiple pages or sections
const MyDocument = () => {
  return (
    <View style={styles.pageLayout}>
      <Text style={styles.title}>EXAM FEE RECEIPT</Text>

      {/* Displaying 4 items in a row */}
      <View style={styles.row}>
        <View style={styles.column1}>
          <Text style={styles.label}>Student Name</Text>
        </View>
        <View style={styles.column1}>
          <Text style={styles.label}>Rupesh Kumar</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Amount Paid</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>50000</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>50000</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>50000</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Fee Type</Text>
          <Text style={styles.tableCell}>Amount</Text>
          <Text style={styles.tableCell}>Amount</Text>
          <Text style={styles.tableCell}>Amount</Text>
          <Text style={styles.tableCell}>Amount</Text>
          <Text style={styles.tableCell}>Amount</Text>
          <Text style={styles.tableCell}>Amount</Text>
          <Text style={styles.tableCell}>Amount</Text>
          <Text style={styles.tableCell}>Amount</Text>
          <Text style={styles.tableCell}>Amount</Text>
          <Text style={styles.tableCell}>Amount</Text>{" "}
          <Text style={styles.tableCell}>Amount</Text>
        </View>
      </View>
    </View>
  );
};

const App = () => {
  return (
    <PDFViewer style={styles.viewer}>
      <Document title="Exam Fee Receipt">
        <Page size="A4">
          <MyDocument />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default App;
