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
    left: "48px",
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
  longUserName: {
    width: "140px",
    top: "130px",
    left: "13px",
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
  studentIdCardYear: {
    position: "absolute",
    marginHorizontal: "auto",
    fontFamily: "Roboto",
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
  return templateList.find((obj) => obj.school_name_short === school_name_short)
    ?.src;
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
          style={data.displayName?.length < 42 ? { ...styles.studentIdCard, ...styles.userDisplayName } : { ...styles.studentIdCard, ...styles.userDisplayName,left:"50px",top:"26px" }}
        >{`${data.displayName}`}</Text>
        <Image src={data.studentBlobImagePath} style={styles.userImage} />
        <Text
          style={data.studentName.length < 40 ? { ...styles.studentIdCard, ...styles.userName } : { ...styles.studentIdCard, ...styles.longUserName }}
        >{`${data.studentName}`}</Text>
        <Text
          style={
            data.studentName.length > 24
              ? {
                  ...styles.studentIdCardYear,
                  ...styles.userCurrentYear,
                  marginTop: "10px",
                }
              : {
                  ...styles.studentIdCardYear,
                  ...styles.userCurrentYear,
                  marginTop: "0px",
                }
          }
        >
          {`${data.currentYear}` == 1
            ? `1ST YEAR`
            : `${data.currentYear}` == 2
            ? `2ND YEAR`
            : `${data.currentYear}` == 3
            ? `3RD YEAR`
            : `${data.currentYear}` == 4
            ? `4TH YEAR`
            : `${data.currentYear}` == 5
            ? `5TH YEAR`
            : `${data.currentYear}` == 6
            ? `6TH YEAR`
            : `${data.currentYear}` == 7
            ? `7TH YEAR`
            : `${data.currentYear}` == 8
            ? `8TH YEAR`
            : `${data.currentYear}` == 9
            ? `9TH YEAR`
            : `${data.currentYear}` == 10
            ? `10TH YEAR`
            : ""}
        </Text>
        <Text
          style={
            data.studentName.length > 24
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
            data.studentName.length > 24 &&
            data.programWithSpecialization.length <= 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userAuid,
                  marginTop: "10px",
                }
              : data.studentName.length < 24 &&
                data.programWithSpecialization.length >= 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userAuid,
                  marginTop: "10px",
                }
              : data.studentName.length > 24 &&
                data.programWithSpecialization.length >= 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userAuid,
                  marginTop: "10px",
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
            data.studentName.length > 24 &&
            data.programWithSpecialization.length <= 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userUsn,
                  marginTop: "10px",
                }
              : data.studentName.length < 24 &&
                data.programWithSpecialization.length >= 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userUsn,
                  marginTop: "10px",
                }
              : data.studentName.length > 24 &&
                data.programWithSpecialization.length >= 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.userUsn,
                  marginTop: "20px",
                }
              : {
                  ...styles.studentIdCard,
                  ...styles.userUsn,
                  marginTop: "0px",
                }
          }
        >{`${!!data.usn ? data.usn : ""}`}</Text>
        <View
          style={
            data.studentName.length > 24 &&
            data.programWithSpecialization.length <= 25
              ? {
                  ...styles.barCode,
                  marginTop: "10px",
                }
              : data.studentName.length < 24 &&
                data.programWithSpecialization.length >= 25
              ? {
                  ...styles.barCode,
                  marginTop: "10px",
                }
              : data.studentName.length > 24 &&
                data.programWithSpecialization.length >= 25
              ? {
                  ...styles.barCode,
                  marginTop: "17px",
                }
              : {
                  ...styles.barCode,
                  marginTop: "0px",
                }
          }
        >
          <Image src={generateBarcodeDataUrl(data.auid)} />
        </View>
        <View
          style={
            data.studentName.length > 24 &&
            data.programWithSpecialization.length <= 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.validTillDateMain,
                  marginTop: "10px",
                }
              : data.studentName.length < 24 &&
                data.programWithSpecialization.length >= 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.validTillDateMain,
                  marginTop: "10px",
                }
              : data.studentName.length > 24 &&
                data.programWithSpecialization.length >= 25
              ? {
                  ...styles.studentIdCard,
                  ...styles.validTillDateMain,
                  marginTop: "17px",
                }
              : {
                  ...styles.studentIdCard,
                  ...styles.validTillDateMain,
                  marginTop: "0px",
                }
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
