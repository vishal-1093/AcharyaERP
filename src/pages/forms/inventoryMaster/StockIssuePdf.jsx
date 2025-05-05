import { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import axios from "../../../services/Api";
import { useLocation } from "react-router-dom";
import acharyaLogo from "../../../assets/acharyaLogo.png";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";

// Register the Arial font

const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    height: '90vh',
  },
  // viewer: {
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // },

  pageLayout: {
    margin: 25,
  },

  rowStyle: { flexDirection: "row" },

  serialHeader: {
    width: "6%",
    padding: 5,
    border: "1px solid black",
  },

  serialHeaderText: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textAlign: "center",
  },

  endUserHeader: {
    width: "15%",
    padding: 5,
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },

  endUserText: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textAlign: "center",
  },

  schoolHeader: {
    width: "9%",
    padding: 5,
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },
  schoolText: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textAlign: "center",
  },

  deptHeader: {
    width: "7%",
    padding: 5,
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },
  deptText: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textAlign: "center",
  },

  itemHeader: {
    width: "25%",
    padding: 5,
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },
  itemText: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textAlign: "center",
  },

  requestedQty: {
    width: "12%",
    padding: 5,
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },
  qtyText: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textAlign: "center",
  },

  uomHeader: {
    width: "8%",
    padding: 5,
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },
  uomText: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textAlign: "center",
  },

  issuedQty: {
    width: "8%",
    padding: 5,
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },
  issuedQtyText: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textAlign: "center",
  },

  approverHeader: {
    width: "15%",
    padding: 5,
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },
  approverText: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textAlign: "center",
  },

  issuedBy: {
    width: "15%",
    padding: 5,
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },
  issuedByText: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textAlign: "center",
  },

  serialBodyText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    textAlign: "center",
  },
  endUserBodyText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    textAlign: "center",
  },
  schoolBodyText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    textAlign: "center",
  },
  deptBodyText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    textAlign: "center",
  },
  itemBodyText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    textAlign: "center",
    wordWrap: "break-word",
  },
  uomBodyText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    textAlign: "center",
  },
  qtyBodyText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    textAlign: "center",
  },
  issuedByBodyText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    textAlign: "center",
  },
  issuedQtyBodyText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    textAlign: "center",
  },
  approverBodyText: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    textAlign: "center",
  },
});

function StockIssuePdf() {
  const [username, setUserName] = useState("");

  const location = useLocation();

  const setCrumbs = useBreadcrumbs();
  const itemData = location.state?.values;

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Stock Issue" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/purchase/getApprovers`)
      .then((res) => {
        const userName = res.data.data.filter((obj) => {
          if (obj.userId === itemData[0].issuedBy) {
            return obj.userName;
          }
        });
        setUserName(userName);
      })
      .catch((err) => console.error(err));
  };

  const acharyaInstituteLogo = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Image
          style={{ width: 50, height: 50, objectFit: "contain" }}
          src={acharyaLogo}
        />
        <View style={{ marginLeft: 15, justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: "Times-Bold",
              fontSize: 12,
              textAlign: "left",
              marginBottom: 2,
            }}
          >
            {itemData[0]?.school_name}
          </Text>
          <Text
            style={{
              fontFamily: "Times-Roman",
              fontSize: 10,
              textAlign: "left",
              color: "#555",
            }}
          >
            Stock Issued
          </Text>
        </View>
      </View>
    );
  };
  

  const indentTitle = () => {
    return (
      <View style={{ marginTop: "20px" }}>
        <Text
          style={{
            fontFamily: "Times-Roman",
            fontSize: 10,
            textAlign: "left",
          }}
        >
          Indent Ticket No. : {itemData[0]?.indent_ticket}
        </Text>
      </View>
    );
  };

  const tableHeaders = () => {
    return (
      <View style={styles.rowStyle} fixed>
        <View style={styles.serialHeader}>
          <Text style={styles.serialHeaderText}>Sl No.</Text>
        </View>
        <View style={styles.endUserHeader}>
          <Text style={styles.endUserText}>End User</Text>
        </View>
        <View style={styles.schoolHeader}>
          <Text style={styles.schoolText}>School</Text>
        </View>

        <View style={styles.deptHeader}>
          <Text style={styles.deptText}>Dept</Text>
        </View>

        <View style={styles.itemHeader}>
          <Text style={styles.itemText}>Item</Text>
        </View>
        <View style={styles.uomHeader}>
          <Text style={styles.uomText}>UOM</Text>
        </View>

        <View style={styles.requestedQty}>
          <Text style={styles.qtyText}>Requested Qty</Text>
        </View>
        <View style={styles.issuedQty}>
          <Text style={styles.issuedQtyText}>Issued Qty</Text>
        </View>
        <View style={styles.approverHeader}>
          <Text style={styles.approverText}>Approver</Text>
        </View>
        <View style={styles.issuedBy}>
          <Text style={styles.issuedByText}>Issued By</Text>
        </View>
      </View>
    );
  };

  const tabelBody = () => {
    return (
      <>
        {itemData?.map((obj, i) => {
          return (
            <View style={styles.rowStyle} fixed key={i}>
              <View style={styles.serialHeader}>
                <Text style={styles.serialBodyText}>{i + 1}</Text>
              </View>
              <View style={styles.endUserHeader}>
                <Text style={styles.endUserBodyText}>{obj.requested_by_With_date}</Text>
              </View>
              <View style={styles.schoolHeader}>
                <Text style={styles.schoolBodyText}>
                  {obj.school_name_short}
                </Text>
              </View>

              <View style={styles.deptHeader}>
                <Text style={styles.deptBodyText}>{obj.dept_name}</Text>
              </View>

              <View style={styles.itemHeader}>
                <Text style={styles.itemBodyText}>{obj.ITEM_NAME}</Text>
              </View>
              <View style={styles.uomHeader}>
                <Text style={styles.uomBodyText}>{obj.measure_short_name}</Text>
              </View>

              <View style={styles.requestedQty}>
                <Text style={styles.qtyBodyText}>{obj.quantity}</Text>
              </View>
              <View style={styles.issuedQty}>
                <Text style={styles.issuedQtyBodyText}>
                  {obj.issued_quantity}
                </Text>
              </View>
              <View style={styles.approverHeader}>
                <Text style={styles.approverBodyText}>
                  {obj.StoreIndent_approver1_name}
                </Text>
              </View>
              <View style={styles.issuedBy}>
                <Text style={styles.issuedByBodyText}>
                  {obj.approver1_status === 1 ? username[0]?.userName : "NA"}
                </Text>
                <Text style={styles.issuedByBodyText}>
                  {moment(obj.issueDate).format("DD-MM-YYYY")}
                </Text>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  const footer = () => {
    return (
      <View style={{ flexDirection: "row", marginTop: "20px" }}>
        <View style={{ width: "50%" }}>
          <Text style={{ fontFamily: "Times-Roman", fontSize: 10 }}>
            Store Keeper
          </Text>
          <Text style={{ fontFamily: "Times-Roman", fontSize: 10 }}>
            {username[0]?.userName}
          </Text>
        </View>
        <View style={{ width: "50%", textAlign: "right" }}>
          <Text style={{ fontFamily: "Times-Roman", fontSize: 10 }}>
            Receiver signature
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Store Indent">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                }}
              >
                {acharyaInstituteLogo()}
              </View>
              <View> {indentTitle()}</View>
              <View style={{ marginTop: "10px" }}>{tableHeaders()}</View>
              <View>{tabelBody()}</View>
              <View>{footer()}</View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}

export default StockIssuePdf;
