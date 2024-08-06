import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";
import moment from "moment";

Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoBold, fontStyle: "bold", fontWeight: 700 },
    { src: RobotoItalic, fontStyle: "italic", fontWeight: 200 },
    { src: RobotoLight, fontStyle: "light", fontWeight: 300 },
    { src: RobotoRegular, fontStyle: "normal" },
  ],
});

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  pageLayout: {
    fontFamily: "Roboto",
    fontSize: "10px",
  },

  layout: { margin: "40px 50px 20px 50px" },

  mt: { marginTop: "20px" },

  flex: {
    display: "flex",
    flexDirection: "row",
  },

  paragraphMargin: { marginTop: "10px" },

  row: { display: "flex", flexDirection: "row" },

  cell: {
    width: "25%",
    padding: "2px",
  },

  borderBtm: { borderBottomWidth: 1 },
  borderRt: { borderRightWidth: 1 },

  tableHeader: { fontStyle: "bold", alignItems: "center" },

  textCenter: { textAlign: "center" },
});

export const GenerateNoduesPrint = (data) => {
  const Content = () => {
    return (
      <View style={styles.layout}>
        <View style={styles.mt}>
          <Text
            style={{
              fontStyle: "bold",
              fontSize: "11px",
              textAlign: "center",
              textDecoration: "underline",
              padding: "1px",
            }}
          >
            NO DUE CERTIFICATE
          </Text>
        </View>

        <View style={styles.mt}>
          <View style={styles.flex}>
            <View style={{ width: "50%" }}>
              <Text
                style={{ fontStyle: "bold", display: "inline", padding: "3px" }}
              >
                EMP Name :&nbsp;
                <Text
                  style={{
                    fontStyle: "normal",
                    display: "inline",
                  }}
                >
                  {data[0].employee_name}
                </Text>
              </Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text
                style={{
                  fontStyle: "bold",
                  padding: "3px",
                }}
              >
                EMP Code :&nbsp;
                <Text
                  style={{
                    fontStyle: "normal",
                    display: "inline",
                  }}
                >
                  {data[0].empcode}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.flex}>
          <View style={{ width: "50%" }}>
            <Text
              style={{ fontStyle: "bold", display: "inline", padding: "3px" }}
            >
              DOJ:&nbsp;
              <Text
                style={{
                  fontStyle: "normal",
                  display: "inline",
                }}
              >
                {data[0].date_of_joining}
              </Text>
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text
              style={{
                fontStyle: "bold",
                padding: "3px",
              }}
            >
              Department :&nbsp;
              <Text
                style={{
                  fontStyle: "normal",
                  display: "inline",
                }}
              >
                {data[0].dept_name}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.paragraphMargin}>
          <Text
            style={{
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            This is to inform you that the above mentioned staff has requested
            relieving from employment with the organization. You are requested
            to note this and confirm hereby by duly confirming that your
            department has No Dues from the above Staff.
          </Text>
        </View>

        <View style={{ marginTop: "20px", borderWidth: 1 }}>
          <View style={[styles.row, styles.borderBtm]}>
            <Text
              style={[
                styles.cell,
                styles.borderRt,
                styles.tableHeader,
                styles.textCenter,
              ]}
            >
              SL No.
            </Text>

            <Text
              style={[
                styles.cell,
                styles.borderRt,
                styles.tableHeader,
                styles.textCenter,
              ]}
            >
              Name
            </Text>

            <Text
              style={[
                styles.cell,
                styles.borderRt,
                styles.tableHeader,
                styles.textCenter,
              ]}
            >
              Department
            </Text>

            <Text
              style={[
                styles.cell,
                styles.borderRt,
                styles.tableHeader,
                styles.textCenter,
              ]}
            >
              Signature
            </Text>
          </View>

          {data?.map((obj, i) => {
            return (
              <View style={styles.row} key={i}>
                <Text style={[styles.cell, styles.borderRt]}>{i + 1}</Text>
                <Text style={[styles.cell, styles.borderRt]}>
                  {obj.dept_name}
                </Text>
                <Text style={[styles.cell, styles.borderRt, styles.textCenter]}>
                  {obj.employee_name}
                </Text>
                <Text style={[styles.cell, styles.textCenter]}>
                  {obj.approver_date ? (
                    <>
                      <View>
                        <Text>
                          {moment(obj.approver_date).format("DD-MM-YYYY LT")}
                        </Text>
                      </View>
                      <View>
                        <Text>{obj.noDueComments}</Text>
                      </View>
                      {obj.ip_address ? (
                        <View>
                          <Text>{obj.ip_address}</Text>
                        </View>
                      ) : (
                        <Text></Text>
                      )}
                    </>
                  ) : (
                    <View>
                      <Text>Pending</Text>
                    </View>
                  )}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={{ marginTop: "20px" }}>
          <View style={styles.paragraphMargin}>
            <Text
              style={{
                textAlign: "justify",
                lineHeight: "1.5",
              }}
            >
              I agree to authorize Acharya to deactivate my email used by me
              during my tenure with Acharya.
            </Text>
          </View>
        </View>

        <View style={{ marginTop: "20px" }}>
          <Text>
            Received: &emsp;&emsp;&emsp;&emsp; a)All Original Certificates
          </Text>
        </View>
        <View>
          <Text style={{ marginLeft: "89px" }}>
            b)College doesn’t owe anything to me
          </Text>
        </View>

        <View style={{ marginTop: "30px" }}>
          <Text style={{ textAlign: "right", fontStyle: "bold" }}>
            Employee Signature & Date
          </Text>
        </View>

        <View style={{ marginTop: "10px" }}>
          <Text style={{ fontStyle: "bold" }}>For office use Only:</Text>
        </View>

        <View style={{ marginTop: "10px" }}>
          <Text>
            Staff may be relieved from organization w.e.f/last working day
            _____________________
          </Text>
        </View>

        <View style={{ marginTop: "50px" }}>
          <Text style={{ fontStyle: "bold" }}>
            Princial/Head of the Institution
          </Text>
        </View>

        <View style={{ marginTop: "30px" }}>
          <Text>
            Note: HR Department will issue RELIEVING/EXPERIENCE LETTER only
            after collecting this letter.
          </Text>
        </View>
      </View>
    );
  };

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="No Dues">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <Content />
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(generateDocument).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};
