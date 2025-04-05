import { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import numberToWords from "number-to-words";
import moment from "moment";

// Register the Arial font
Font.register({
  family: "Times New Roman",
  src: "/fonts/arial/ARIAL.woff",

  fonts: [
    {
      src: "/fonts/arial/ARIAL.woff",
    },
    {
      src: "/fonts/arial/ARIALBD.woff",
      fontWeight: "bold",
    },
    { src: "/fonts/arial/ARIALI.woff", fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  pageLayout: { margin: 25 },

  container: {
    width: "100%",
    border: "1px solid black",
    display: "flex",
    justifyContent: "center",
  },

  bodyContainer: {
    width: "100%",
    height: "230px",
    border: "0.5px solid #000",
    display: "flex",
    justifyContent: "center",
  },

  table: {
    border: "1px solid black",
    width: "540px",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    borderBottom: "1px solid black",
  },

  paymentVoucher: {
    fontSize: 12,
    fontFamily: "Times-Roman",
    fontWeight: 600,
  },

  address: {
    width: "50%",
    borderRight: "1px solid black",
    padding: "7px",
  },

  vendorDetails: {
    width: "50%",
    padding: "7px",
  },

  addressone: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },

  addresstwo: {
    width: "50%",
    borderRight: "1px solid black",
    padding: "5px",
    borderTop: "1px solid black",
  },

  addresstwoNames: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },

  date: {
    width: "50%",
  },

  dateone: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    textAlign: "center",
    borderBottom: "1px solid black",
    padding: "16px",
  },

  store: {
    width: "50%",
    borderRight: "1px solid black",
  },

  destination: {
    width: "50%",
  },

  storeName: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    padding: "10px",
  },

  quotation: {
    width: "50%",
    borderRight: "1px solid black",
    borderTop: "1px solid black",
    padding: "10px",
  },

  quotationName: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },

  termsandconditions: {
    padding: "2px",
    borderTop: "1px solid black",
  },
  termsandconditionsName: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    marginTop: "5px",
  },

  tableRowStyle: {
    flexDirection: "row",
  },

  tableRowStyle: {
    flexDirection: "row",
  },

  Total: {
    fontSize: 12,
    fontFamily: "Times-Roman",
    width: "92%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },

  Amount: {
    width: "8%",
    borderBottom: "1px solid black",
  },

  timeTableThHeaderStyle: {
    width: "15%",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  seriolNoHeader: {
    width: "10%",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  itemNameHeader: {
    width: "40%",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  quantityHeader: {
    width: "10%",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  rateHeader: {
    width: "10%",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  gstHeader: {
    width: "8%",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  discountHeader: {
    width: "10%",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  timeTableThStyle: {
    textAlign: "center",
    padding: "5px",
    fontFamily: "Times-Roman",
    fontSize: "10px",
    fontWeight: "bold",
  },

  timeTableThStyleAmount: {
    textAlign: "center",
    padding: "5px",
    fontFamily: "Times-Roman",
    fontSize: "10px",
    fontWeight: "bold",
    textAlign: "right",
  },

  timeTableTdHeaderStyle1: {
    width: "15%",
    borderRight: "0.5px solid black",
    borderBottom: "1px solid black",
    height: "25px",
  },

  seriolNo: {
    width: "10%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    height: "25px",
  },

  quantity: {
    width: "10%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    height: "25px",
  },

  itemName: {
    width: "40%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    height: "25px",
  },

  timeTableTdStyle: {
    textAlign: "center",
    padding: "5px",
    fontFamily: "Times-Roman",
    fontSize: "10px",
  },

  timeTableTdStyleAmount: {
    textAlign: "center",
    padding: "5px",
    fontFamily: "Times-Roman",
    fontSize: "10px",
    textAlign: "right",
  },

  amount: {
    width: "10%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    height: "25px",
  },

  gstBody: {
    width: "8%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    height: "25px",
  },

  amountHeader: {
    width: "10%",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },
});

function DirectPOPdf() {
  const [data, setData] = useState([]);

  const [schoolName, setSchoolName] = useState("");
  const [total, setTotal] = useState();

  const { id } = useParams();

  useEffect(() => {
    getData();
    getSchoolData();
  }, []);

  useEffect(() => {
    const temp = data[0]?.temporaryPurchaseItems?.reduce(
      (a, b) => a + b.totalAmount,
      0
    );
    setTotal(temp);
  }, [data]);

  const getData = async () => {
    await axios
      .get(`/api/purchase/getDraftPurchaseOrderById?id=${id}`)
      .then((res) => {
        const temp = [];
        temp.push(res.data.data);
        setData(temp);
        const val = res.data.data?.temporaryPurchaseItems?.reduce((a, b) => {
          return a.totalAmount + b.totalAmount;
        });
      })
      .catch((error) => console.error(error));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        res.data.data.filter((obj) => {
          if (obj.school_id === 1) {
            setSchoolName(obj.school_name);
          }
        });
      })
      .catch((err) => console.error(err));
  };

  const timeTableTitle = () => {
    return (
      <>
        <View style={{ textAlign: "center" }}>
          <Text>Purchase Order</Text>
        </View>
      </>
    );
  };

  const address = () => {
    return (
      <>
        <View style={{ flexDirection: "row", display: "flex" }}>
          <View style={styles.address}>
            <Text style={styles.addressone}>Invoice To:</Text>
            <Text style={styles.addressone}>{schoolName ?? ""}</Text>
            <Text style={styles.addressone}>
              Khojalar neighborhood citizen council,
            </Text>
            <Text style={styles.addressone}>
              Bukhara street karakol district,
            </Text>
            <Text style={styles.addressone}>Uzbekistan.</Text>
          </View>

          <View style={styles.date}>
            <Text style={styles.dateone}>
              Date : {moment(data[0]?.quotationDate).format("DD-MM-YYYY")}{" "}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.store}>
                <Text style={styles.storeName}>
                  Quotation No. : {data[0]?.quotationNo}
                </Text>
              </View>
              <View style={styles.destination}>
                <Text style={styles.storeName}>
                  Destination : {data[0]?.destination}{" "}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  const addresstwo = () => {
    return (
      <>
        <View style={{ flexDirection: "row", display: "flex" }}>
          <View style={styles.addresstwo}>
            <Text style={styles.addresstwoNames}>Supplier :</Text>
            <Text style={styles.addresstwoNames}>{data[0]?.vendor}</Text>
            <Text style={styles.addresstwoNames}>{data[0]?.vendorAddress}</Text>
            <Text style={styles.addresstwoNames}>
              Ph No. : {data[0]?.vendorContactNo}
            </Text>
          </View>

          <View style={styles.date}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.quotation}>
                <Text style={styles.quotationName}>
                  Other References :{data[0]?.otherReference}
                </Text>
              </View>
              <View style={styles.quotation}>
                <Text style={styles.quotationName}>
                  Request Type : {data[0]?.requestType}
                </Text>
              </View>
            </View>
            <View style={styles.termsandconditions}>
              <Text style={styles.termsandconditionsName}>
                Terms and conditions :
              </Text>
              <Text style={styles.termsandconditionsName}>
                {data[0]?.termsAndConditions}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const VendorDetails = () => {
    return (
      <>
        <View style={{ flexDirection: "row", display: "flex" }}>
          <View style={styles.vendorDetails}>
            <Text style={styles.addresstwoNames}>Amount in Words</Text>
            <Text style={styles.addresstwoNames}>
              {total !== undefined && total !== null
                ? numberToWords
                  .toWords(Math.round(total))
                  .replace(/\b\w/g, (char) => char.toUpperCase())
                : ""}{" "}
            </Text>
            <Text style={styles.addresstwoNames}>Bank Details</Text>
            <Text style={styles.addresstwoNames}>
              Account Holder Name : {data[0]?.accountHolderName}
            </Text>
            <Text style={styles.addresstwoNames}>
              Bank Name : {data[0]?.bankName}
            </Text>

            <Text style={styles.addresstwoNames}>
              Bank branch : {data[0]?.bankBranch}
            </Text>
            <Text style={styles.addresstwoNames}>
              Account No. : {data[0]?.accountNo}
            </Text>
            <Text style={styles.addresstwoNames}>
              Bank IFSC No. : {data[0]?.bankIfscNo}
            </Text>
          </View>
          <View style={styles.vendorDetails}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Times-Roman",
                textAlign: "right",
              }}
            >
              Date : {moment(data?.quotationDate).format("DD-MM-YYYY")}
            </Text>

            <Text
              style={{
                fontSize: 11,
                fontFamily: "Times-Roman",
                textAlign: "right",
              }}
            >
              For {schoolName.toUpperCase() ?? ""}{" "}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Times-Roman",
                textAlign: "right",
                marginTop: "100px",
              }}
            >
              Authorized Signatory
            </Text>
          </View>
        </View>
      </>
    );
  };

  const timeTableHeader = () => {
    return (
      <>
        <View style={styles.tableRowStyle} fixed>
          <View style={styles.seriolNoHeader}>
            <Text style={styles.timeTableThStyle}>Sl No.</Text>
          </View>
          <View style={styles.itemNameHeader}>
            <Text style={styles.timeTableThStyle}>
              Goods Description / Service
            </Text>
          </View>

          <View style={styles.quantityHeader}>
            <Text style={styles.timeTableThStyle}>Quantity</Text>
          </View>

          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>UOM</Text>
          </View>

          <View style={styles.rateHeader}>
            <Text style={styles.timeTableThStyleAmount}>Rate</Text>
          </View>
          <View style={styles.rateHeader}>
            <Text style={styles.timeTableThStyleAmount}>Cost</Text>
          </View>
          <View style={styles.gstHeader}>
            <Text style={styles.timeTableThStyleAmount}>GST %</Text>
          </View>
          <View style={styles.discountHeader}>
            <Text style={styles.timeTableThStyleAmount}>DISC %</Text>
          </View>
          <View style={styles.amountHeader}>
            <Text style={styles.timeTableThStyleAmount}>Amount</Text>
          </View>
        </View>
      </>
    );
  };

  const timeTableBody = () => {
    return (
      <>
        {data[0]?.temporaryPurchaseItems?.map((obj, i) => {
          return (
            <View style={styles.tableRowStyle} key={i}>
              <View style={styles.seriolNo}>
                <Text style={styles.timeTableTdStyle}>{i + 1}</Text>
              </View>
              <View style={styles.itemName}>
                <Text style={styles.timeTableTdStyle}>{obj.itemName}</Text>
              </View>
              <View style={styles.quantity}>
                <Text style={styles.timeTableTdStyle}>{obj.quantity}</Text>
              </View>
              <View style={styles.timeTableTdHeaderStyle1}>
                <Text style={styles.timeTableTdStyle}>{obj?.measureName}</Text>
              </View>
              <View style={styles.amount}>
                <Text style={styles.timeTableTdStyleAmount}> {obj?.rate}</Text>
              </View>
              <View style={styles.amount}>
                <Text style={styles.timeTableTdStyleAmount}>
                  {obj?.rate * obj?.quantity}
                </Text>
              </View>
              <View style={styles.gstBody}>
                <Text style={styles.timeTableTdStyleAmount}>{obj?.gst}</Text>
              </View>
              <View style={styles.amount}>
                <Text style={styles.timeTableTdStyleAmount}>
                  {obj?.discount}
                </Text>
              </View>
              <View style={styles.amount}>
                <Text style={styles.timeTableTdStyleAmount}>
                  {obj?.totalAmount}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={{ flexDirection: "row" }}>
          <View style={styles.Total}>
            <Text> Total</Text>
          </View>
          <View style={styles.Amount}>
            <Text
              style={{
                fontSize: "10px",
                fontFamily: "Times-Roman",
                textAlign: "right",
              }}
            >
              {total}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Draft Po">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <View style={styles.container}>
                <View style={styles.title}>{timeTableTitle()}</View>
                <View>{address()}</View>
                <View>{addresstwo()}</View>
                <View>{timeTableHeader()}</View>
                <View>{timeTableBody()}</View>
                <View>{VendorDetails()}</View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}

export default DirectPOPdf;
