import templateList from "./SchoolImages";
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
  idcardContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: "20px",
    marginRight: "20px",
  },
  idcard: {
    margin: "15px",
    height: "241px",
    width: "151px",
    position: "relative",
  },
  image: {
    position: "absolute",
    minWidth: "100%",
    minHeight: "100%",
    display: "block",
    height: "100%",
    width: "100%",
  },
  userImage: {
    top: "22px",
    position: "absolute",
    width: "63px",
    height: "63px",
    left: "10px",
    border: "none !important",
  },
  name: {
    width: "150px",
    position: "absolute",
    top: "90px",
    marginHorizontal: "auto",
    fontSize: "10px",
    fontWeight: "heavy",
    textTransform: "uppercase",
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
  currentYear: {
    width: "150px",
    position: "absolute",
    top: "102px",
    marginHorizontal: "auto",
    fontSize: "8px",
    textTransform: "uppercase",
    color: "#000",
    fontFamily: "Roboto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  programWithSpecialization: {
    width: "150px",
    position: "absolute",
    top: "113px",
    marginHorizontal: "auto",
    fontSize: "8px",
    textTransform: "uppercase",
    color: "#000",
    fontFamily: "Roboto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  auid: {
    width: "150px",
    position: "absolute",
    top: "124px",
    marginHorizontal: "auto",
    fontSize: "8px",
    textTransform: "uppercase",
    color: "#000",
    fontFamily: "Roboto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  usn: {
    width: "150px",
    position: "absolute",
    top: "135px",
    marginHorizontal: "auto",
    fontSize: "9px",
    fontWeight: "heavy",
    textTransform: "uppercase",
    color: "#000",
    fontFamily: "Roboto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  barCode: {
    marginTop: "147px",
    width: "100px",
    left: "25px",
  },
  validTillDateMain: {
    width: "120px",
    position: "absolute",
    top: "170px",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  validTillDateKey: {
    left: "20px",
    marginHorizontal: "auto",
    fontSize: "7px",
    textTransform: "uppercase",
    color: "#000",
    fontFamily: "Roboto",
  },
  validTillDateValue: {
    left: "10px",
    marginHorizontal: "auto",
    fontSize: "7px",
    textTransform: "uppercase",
    color: "#000",
    fontFamily: "Roboto",
  },
});

Font.registerHyphenationCallback((word) => [word]);

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const getTemplate = (schoolId) => {
  return templateList.find((obj) => obj.schoolId === schoolId)?.src;
};

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
  return (
    <View style={styles.idcard}>
      <Image src={getTemplate(data?.schoolId)} style={styles.image} />
      <View style={{ position: "relative" }}>
        <Image src={data.studentBlobImagePath} style={styles.userImage} />
        <Text style={styles.name}>{`${data.studentName}`}</Text>
        <Text style={styles.currentYear}>
          {`${data.currentYear}` == 1
            ? "I YEAR"
            : `${data.currentYear}` == 2
            ? "II YEAR"
            : `${data.currentYear}` == 3
            ? "III YEAR"
            : "IV YEAR"}
        </Text>
        <Text
          style={styles.programWithSpecialization}
        >{`${data.programWithSpecialization}`}</Text>
        <Text style={styles.auid}>{`${data.auid}`}</Text>
        <Text style={styles.usn}>{`${data.auid}`}</Text>
        <View style={styles.barCode}>
          <Image src={generateBarcodeDataUrl(data.auid)} />
        </View>
        <View style={styles.validTillDateMain}>
          <Text style={styles.validTillDateKey}>VALID Till :</Text>
          <Text
            style={styles.validTillDateValue}
          >{`${data.validTillDate}`}</Text>
        </View>
      </View>
    </View>
  );
};

export const GenerateIdCard = (studentList) => {
  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title="ID Card">
          {studentList.map((chunk, key1) => {
            return (
              <Page size="a4" style={styles.body} key={key1}>
                <View style={styles.idcardContainer}>
                  {chunk.map((obj, key) => {
                    return <UpdateData data={obj} key={key} />;
                  })}
                </View>
              </Page>
            );
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
