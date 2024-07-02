import StaffIdCard from "../../../assets/ID_Card.jpg";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";

const styles = StyleSheet.create({
  body: {
    margin: 0,
  },
  image: {
    position: "absolute",
    minWidth: "100%",
    minHeight: "100%",
    display: "block",
    height: "100%",
    width: "100%",
  },
  name: {
    width: "150px",
    position: "absolute",
    top: "130",
    marginHorizontal: "auto",
    fontSize: "10px",
    fontWeight: "heavy",
    color: "#000",
    fontFamily: "Roboto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  empValue: {
    color: "#4d4d33",
    width: "150px",
    position: "absolute",
    marginHorizontal: "auto",
    top: "166px",
    fontSize: "9px",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: "Roboto",
  },
  deptValue: {
    color: "#000",
    position: "absolute",
    fontSize: "7px",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    right: "11px",
    top: "164px",
  },
  userImage: {
    top: "70px",
    position: "absolute",
    width: "50px",
    height: "55px",
    right: "55px",
  },
  designationNameFull: {
    color: "#4d4d33",
    width: "150px",
    position: "absolute",
    marginHorizontal: "auto",
    top: "144px",
    fontSize: "8px",
    textTransform: "uppercase",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: "Roboto",
  },
  departmentName: {
    color: "#4d4d33",
    width: "150px",
    position: "absolute",
    marginHorizontal: "auto",
    top: "155px",
    fontSize: "8px",
    textTransform: "uppercase",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: "Roboto",
  },
});

Font.registerHyphenationCallback((word) => [word]);

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const generateBarcodeDataUrl = (value) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, value, {
    format: "CODE128",
    width: 2,
    height: 60,
    displayValue: false,
  });
  return canvas.toDataURL("image/png");
};

const UpdateData = ({ data }) => {
  const isPhdHolder =
    data.phd_status !== null && data.phd_status === "holder" ? true : false;
  return (
    <Page size="ID1" style={styles.body}>
      <Image src={StaffIdCard} style={styles.image} />
      <View style={{ position: "relative" }}>
        <Image src={data.staffImagePath} style={styles.userImage} />
        <Text style={styles.name}>
          {`${isPhdHolder ? "Dr. " : ""}${data.employee_name}`}
        </Text>
        <View style={{ marginTop: "200px", width: "80px" }}>
          <Image src={generateBarcodeDataUrl(data.empcode)} />
        </View>
        <Text
          style={
            data.employee_name.length > 25
              ? { marginTop: "12px", ...styles.designationNameFull }
              : styles.designationNameFull
          }
        >
          {`${data.designation_name}`}
        </Text>
        <Text
          style={
            data.employee_name.length > 25
              ? { marginTop: "12px", ...styles.departmentName }
              : styles.departmentName
          }
        >
          {`${data.dept_name}`}
        </Text>
        <Text
          style={
            data.employee_name.length > 25
              ? { marginTop: "12px", ...styles.empValue }
              : styles.empValue
          }
        >
          {`${data.empcode}`}
        </Text>
      </View>
    </Page>
  );
};

export const GenerateIdCard = (selectedStaff) => {
  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title="ID Card">
          {selectedStaff.map((obj, key) => {
            return <UpdateData data={obj} key={key} />;
          })}
        </Document>
      );
      const blob = await pdf(HallTicketCopy).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};
