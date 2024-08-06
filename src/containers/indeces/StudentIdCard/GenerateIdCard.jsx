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
    marginLeft: "22px",
    marginRight: "22px",
  },
  idcard: {
    margin: "5px",
    height: "258px",
    width: "167px",
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
    top: "58px",
    position: "absolute",
    width: "60px",
    height: "70px",
    left: "55px",
    border: "none !important",
  },
  userDisplayName: {
    top: "28px",
    width: "110px",
    left:'48px',
    color: "#000",
    fontSize: "9px",
    fontWeight: "bold",
  },
  userName: {
    width: "110px",
    top: "130px",
    left: "32px",
    color: "#000",
    fontSize: "8px",
    fontWeight: "400",
  },
  userCurrentYear: {
    width: "100px",
    top: "141px",
    left: "35px",
    fontSize: "8px",
    fontWeight: "thin",
  },
  userProgrammeSpecialization: {
    width: "118px",
    top: "151px",
    left: "25px",
    fontSize: "8px",
    fontWeight: "thin",
  },
  userAuid: {
    width: "100px",
    top: "161px",
    left: "35px",
    fontSize: "8px",
    fontWeight: "thin",
  },
  userUsn: {
    width: "100px",
    top: "171px",
    left: "35px",
    color: "#000",
    fontSize: "8px",
    fontWeight: "400",
  },
  studentIdCard: {
    position: "absolute",
    marginHorizontal: "auto",
    fontFamily: "Roboto",
    textTransform: "uppercase",
    color: "#2e2d2d",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  barCode: {
    position: "absolute",
    top: "183px",
    width: "125px",
    left: "22px",
  },
  validTillDateMain: {
    width: "100px",
    position: "absolute",
    left: "0px",
    top: "206px",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  validTillDate: {
    fontSize: "6px",
    fontWeight: "400",
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

const getTemplate = (school_name_short) => {
  return templateList.find((obj) => obj.school_name_short === school_name_short)?.src;
};

const generateBarcodeDataUrl = (value) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, value, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: false,
  });
  return canvas.toDataURL("image/png");
};

const UpdateData = ({ data }) => {
  return (
    <View style={styles.idcard}>
      <Image src={getTemplate(data?.schoolNameShort)} style={styles.image} />
      <View style={{ position: "relative" }}>
        <Text
          style={{ ...styles.studentIdCard, ...styles.userDisplayName}}
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
                  marginTop: "10px",
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
            : `${data.currentYear}` === 2
            ? "II YEAR"
            : `${data.currentYear}` === 3
            ? "III YEAR"
            : "IV YEAR"}
        </Text>
        <Text
          style={
            data.studentName.length > 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userProgrammeSpecialization,
                  marginTop: "10px",
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
                  marginTop: "10px",
                }
              : data.programWithSpecialization.length > 25 ? {...styles.studentIdCard,
                ...styles.userAuid,
                marginTop: "10px",} :{
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
                  marginTop: "10px",
                }
              : data.programWithSpecialization.length > 25 ? {...styles.studentIdCard,
                ...styles.userUsn,marginTop: "10px",}: { ...styles.studentIdCard, ...styles.userUsn, marginTop: "0px" }
          }
        >{`${!!data.usn ? data.usn : ""}`}</Text>
        <View
          style={
            data.studentName.length > 25
              ? { ...styles.barCode, marginTop: "10px" }
              : data.programWithSpecialization.length > 25 ? { ...styles.barCode, marginTop: "10px" }: { ...styles.barCode, marginTop: "0px" }
          }
        >
          <Image src={generateBarcodeDataUrl(data.auid)} />
        </View>
        <View
          style={
            data.studentName.length > 25
              ? { ...styles.validTillDateMain, marginTop: "10px" }
              : data.programWithSpecialization.length > 25 ? {...styles.validTillDateMain, marginTop: "10px" }: { ...styles.validTillDateMain, marginTop: "0px" }
          }
        >
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
