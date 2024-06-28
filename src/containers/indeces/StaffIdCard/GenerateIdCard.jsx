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
    maxWidth: "100px",
    width: "95px",
    position: "absolute",
    top: "130",
    right: "30",
    marginHorizontal: "auto",
    fontSize: "10px",
    fontWeight: "heavy",
    color: "#000",
    fontFamily: "Roboto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  designationName: {
    maxWidth: "100px",
    width: "95px",
    position: "absolute",
    left: "54px",
    marginHorizontal: "auto",
    fontWeight: "semibold",
    color: "red",
    fontSize: "7px",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: "Roboto",
  },
  empcodeKey: {
    color: "#484848",
    position: "absolute",
    fontSize: "6px",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    left: "59px",
    top: "142px",
  },
  deptKey: {
    color: "#484848",
    position: "absolute",
    fontSize: "6px",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    left: "59px",
    top: "164px",
  },
  empValue: {
    color: "#000",
    position: "absolute",
    fontSize: "7px",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    right: "11px",
    top: "142px",
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
    color: "#000",
    maxWidth: "100px",
    width: "95px",
    position: "absolute",
    left: "54px",
    marginHorizontal: "auto",
    top: "162px",
    fontSize: "7px",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
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
        {/* <Text>{generateBarcodeDataUrl(data.empcode)}</Text> */}
        {/* <Text style={styles.empcodeKey}>
                    Emp Code
                </Text>
                <Text style={styles.empValue}>
                    {`${data.empcode}`}
                </Text>
                <Text style={styles.designationNameFull}>
                    {`${data.designation_name}`}
                </Text> */}
      </View>
    </Page>
  );
};

export const GenerateIdCard = (selectedStaff) => {
  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title="Id card">
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
