import {
  Document,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  layout: { margin: "20px 20px 20px 40px" },
  box: {
    border: "1px solid black",
    padding: "5px",
  },
  school: {
    textAlign: "center",
    fontFamily: "Times-Bold",
    fontSize: 11,
  },
  address: { textAlign: "center", marginBottom: "15px" },
  label: {
    textAlign: "center",
    marginBottom: "10px",
    fontFamily: "Times-Bold",
    fontSize: 11,
  },
  row: { display: "flex", flexDirection: "row" },
  table: {
    display: "table",
    width: "95%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderColor: "#000",
  },
});

export const GenerateJournalVoucherPdf = async (data, responseData) => {
  const CustomRow = ({ children }) => (
    <View style={styles.tableRow}>{children}</View>
  );

  const CustomCell = ({
    label,
    borderRight,
    borderBottom,
    fontFamily,
    width,
    align = "center",
    color = "transparent",
  }) => (
    <Text
      style={{
        padding: 3,
        borderRightWidth: borderRight,
        borderBottomWidth: borderBottom,
        borderColor: "#000",
        fontFamily,
        width: `${width}%`,
        textAlign: align,
        textTransform: "capitalize",
        backgroundColor: color,
      }}
    >
      {label}
    </Text>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Journal Voucher">
          <Page size="A4" style={styles.pageLayout}>
            <View style={styles.layout}>
              <View style={styles.box}>
                <View>
                  <Text style={styles.school}>{data.schoolName}</Text>
                </View>
                <View>
                  <Text style={styles.address}>
                    Acharya Dr.Sarvepalli Radhakrishnan Road,Bengaluru,Karnataka
                    560107
                  </Text>
                </View>
                <View>
                  <Text style={styles.label}>Journal Voucher</Text>
                </View>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                      <Text>Voucher No : </Text>
                      <Text>{data.voucherNo}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ ...styles.row, justifyContent: "center" }}>
                      <Text>Fc Year : </Text>
                      <Text>{data.fcYear}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ ...styles.row, justifyContent: "flex-end" }}>
                      <Text>Date : </Text>
                      <Text>{data.date}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.table}>
                <CustomRow>
                  <CustomCell
                    label="Particulars"
                    borderRight={0.5}
                    borderBottom={0.5}
                    fontFamily="Times-Bold"
                    width={3}
                  />
                </CustomRow>
              </View>
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
