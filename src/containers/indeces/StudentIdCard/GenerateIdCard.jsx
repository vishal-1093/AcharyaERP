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
    height: "325px",
    width: "204px",
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
    top: "70px",
    position: "absolute",
    width: "70px",
    height: "75px",
    left: "70px",
    border: "none !important",
  },
  userDisplayName: {
    top: "33px",
    left: "65px",
    width: "120px",
    fontSize: "10px",
    fontWeight: "bold",
  },
  userName: {
    width: "140px",
    top: "150px",
    left: "35px",
    fontSize: "9px",
    fontWeight: "heavy",
  },
  userCurrentYear: {
    width: "100px",
    top: "164px",
    left: "55px",
    fontSize: "8px",
    fontWeight: "thin",
  },
  userProgrammeSpecialization: {
    width: "100px",
    top: "177px",
    left: "55x",
    fontSize: "8px",
    fontWeight: "thin",
  },
  userAuid: {
    width: "100px",
    top: "190px",
    left: "55px",
    fontSize: "8px",
    fontWeight: "thin",
  },
  userUsn: {
    width: "100px",
    top: "202px",
    left: "55px",
    fontSize: "9px",
    fontWeight: "bold",
  },
  studentIdCard: {
    position: "absolute",
    marginHorizontal: "auto",
    fontFamily: "Roboto",
    textTransform: "uppercase",
    color: "#000",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  barCode: {
    marginTop: "272px",
    width: "100px",
    left: "80px",
  },
  validTillDateMain: {
    width: "100px",
    position: "absolute",
    left: "30px",
    top: "262px",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  validTillDate: {
    fontSize: "7px",
    fontWeight: "500",
    color: "#000",
    fontFamily: "Roboto",
    textTransform: "uppercase",
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
    height: 90,
    displayValue: false,
  });
  return canvas.toDataURL("image/png");
};

const UpdateData = ({ data }) => {
  return (
    <View style={styles.idcard}>
      <Image src={getTemplate(data?.schoolId)} style={styles.image} />
      <View style={{ position: "relative" }}>
        <Text
          style={{ ...styles.studentIdCard, ...styles.userDisplayName }}
        >{`${data.displayName}`}</Text>
        <Image src={data.studentBlobImagePath} style={styles.userImage} />
        <Text
          style={{ ...styles.studentIdCard, ...styles.userName }}
        >{`${data.studentName}`}</Text>
        <Text
          style={
            data.studentName.length > 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userCurrentYear,
                  marginTop: "13px",
                }
              : {
                  ...styles.studentIdCard,
                  ...styles.userCurrentYear,
                  marginTop: "0px",
                }
          }
        >
          {`${data.currentYear}` == 1
            ? "I YEAR"
            : `${data.currentYear}` == 2
            ? "II YEAR"
            : `${data.currentYear}` == 3
            ? "III YEAR"
            : "IV YEAR"}
        </Text>
        <Text
          style={
            data.studentName.length > 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userProgrammeSpecialization,
                  marginTop: "13px",
                }
              : {
                  ...styles.studentIdCard,
                  ...styles.userProgrammeSpecialization,
                  marginTop: "0px",
                }
          }
        >{`${data.programWithSpecialization}`}</Text>
        <Text
          style={
            data.studentName.length > 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userAuid,
                  marginTop: "13px",
                }
              : {
                  ...styles.studentIdCard,
                  ...styles.userAuid,
                  marginTop: "0px",
                }
          }
        >{`${data.auid}`}</Text>
        <Text
          style={
            data.studentName.length > 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userUsn,
                  marginTop: "13px",
                }
              : { ...styles.studentIdCard, ...styles.userUsn, marginTop: "0px" }
          }
        >{`${data.auid}`}</Text>
        <View style={styles.barCode}>
          <Image src={generateBarcodeDataUrl(data.auid)} />
        </View>
        <View style={styles.validTillDateMain}>
          <Text style={{ ...styles.validTillDate, left: "35px" }}>
            VALID Till :
          </Text>
          <Text
            style={{ ...styles.validTillDate, left: "38px" }}
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
