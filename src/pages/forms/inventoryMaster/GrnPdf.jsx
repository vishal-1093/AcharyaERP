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
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import numberToWords from "number-to-words";

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

  title: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    textAlign: "center",
  },

  supplierData: {
    width: "50%",
    borderRight: "1px solid black",
    padding: "2px",
  },

  supplierOne: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },

  goods: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    textAlign: "center",
    marginTop: "15px",
  },

  thStyle: {
    marginLeft: "25px",
    fontSize: "11px",
    fontWeight: "bold",
    width: "100%",
    fontFamily: "Times-Roman",
    color: "#000000",
  },

  thStyle1: {
    marginRight: "-50px",
    fontSize: "11px",
    fontWeight: "bold",
    width: "45%",
    fontFamily: "Times-Roman",
    color: "#000000",
  },

  containerOne: {
    width: "90%",
    height: "auto",
    border: "1px solid black",
    // display: "flex",
    justifyContent: "flex-start",
  },

  vendor: {
    fontSize: "10px",
    fontWeight: "bold",
    padding: "1px",
    fontFamily: "Times-Roman",
    color: "#000000",
    marginLeft: "10px",
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
    width: "82.7%",
    borderRight: "1px solid black",
  },

  Amount: {
    fontSize: "10px",
    fontFamily: "Times-Roman",
    width: "16%",
    textAlign: "right",
  },

  timeTableThHeaderStyle: {
    width: "14%",
    // borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  seriolNoHeader: {
    width: "10%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  itemNameHeader: {
    width: "50%",
    // borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  quantityHeader: {
    width: "14%",
    // borderTop: "1px solid black",
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
    width: "20%",
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
    width: "15%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    height: "25px",
  },

  itemName: {
    width: "50%",
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
    width: "20%",
    borderRight: "0.2px solid black",
    borderBottom: "1px solid black",
    height: "25px",
  },
  amountHeader: {
    width: "15%",
    // borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },
});

function GrnPdf() {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [total, setTotal] = useState();
  const [userName, setUserName] = useState([]);
  const [costValue, setCostValue] = useState();
  const [gstValue, setGstValue] = useState();
  const [discValue, setDiscValue] = useState();

  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();

  useEffect(() => {
    setCrumbs([{ name: "GRN Index", link: "/Itemmaster/GRN" }]);
    getPdfData();
  }, []);

  useEffect(() => {
    let count = 0;

    data?.map((obj, i) => {
      return (count += obj.value);
    });

    setTotal(count);
  }, [data]);

  console.log(total);

  const getPdfData = async () => {
    await axios
      .get(
        `/api/purchase/getListofDirectGRNById?grnNo=${id?.replace(/_/g, "/")}`
      )
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const address = () => {
    return (
      <>
        <View style={{ flexDirection: "row", display: "flex" }}>
          <View style={styles.address}>
            <Text style={styles.addressone}>Invoice To:</Text>
            <Text style={styles.addressone}></Text>
            {/* <Text style={styles.addressone}>
              Khojalar neighborhood citizen council,
            </Text>
            <Text style={styles.addressone}>
              Bukhara street karakol district,
            </Text>
            <Text style={styles.addressone}>Uzbekistan.</Text> */}
          </View>

          <View style={styles.date}>
            <Text style={styles.dateone}></Text>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.store}>
                <Text style={styles.storeName}>Po Reference No:</Text>
              </View>
              <View style={styles.destination}>
                <Text style={styles.storeName}>Quotation No. :</Text>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  const timeTableTitle = () => {
    return (
      <>
        <View>
          <Text style={styles.title}>ACHARYA UNIVERSITY</Text>
        </View>

        <View>
          <Text style={styles.goods}>Goods Receipt Note</Text>
        </View>
      </>
    );
  };

  const GrnDetails = () => {
    return (
      <>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.thStyle}>GRN : {data[0]?.grnNumber}</Text>

          <Text style={styles.thStyle1}>Invoice No : {data[0]?.invoiceNo}</Text>
        </View>
      </>
    );
  };

  const GrnDetailsOne = () => {
    return (
      <>
        <View style={{ marginTop: "5px" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.thStyle}>
              GRN Date :{" "}
              {moment(data[0]?.createdDate).isValid()
                ? moment(data[0]?.createdDate).format("DD-MM-YYYY")
                : null}
            </Text>

            <Text style={styles.thStyle1}>
              Invoice Date :{" "}
              {moment(data[0]?.invoiceDate).isValid()
                ? moment(data[0]?.invoiceDate).format("DD-MM-YYYY")
                : null}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const vendorName = () => {
    return (
      <>
        <View style={{ marginTop: "5px" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.vendor}>
              Vendor Name : {data[0]?.vendorName}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const amountInWords = () => {
    return (
      <>
        <View style={{ marginTop: "5px" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.thStyle}>
              Amount in Words :{" "}
              {total !== undefined && total !== null
                ? numberToWords.toWords(total)
                : ""}
            </Text>

            <Text style={styles.thStyle1}>E & O.E : </Text>
          </View>
        </View>
      </>
    );
  };

  const remarks = () => {
    return (
      <>
        <View style={{ marginTop: "5px" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.thStyle}>Remarks : {data[0]?.remarks}</Text>

            <Text style={styles.thStyle1}>
              Created By : {data[0]?.createdByUserName}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const supplierData = () => {
    return (
      <>
        <View style={styles.containerOne}>
          <View style={{ flexDirection: "row", display: "flex" }}>
            <View style={styles.supplierData}>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>{" "}
              <Text style={styles.supplierOne}>Supplier :</Text>
              {/* <Text style={styles.addressone}>{schoolName ?? ""}</Text> */}
            </View>
            <View style={styles.supplierData}>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>
              <Text style={styles.supplierOne}>Supplier :</Text>{" "}
              <Text style={styles.supplierOne}>Supplier :</Text>
              {/* <Text style={styles.addressone}>{schoolName ?? ""}</Text> */}
            </View>
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
            <Text style={styles.timeTableThStyle}>Description of goods</Text>
          </View>
          <View style={styles.quantityHeader}>
            <Text style={styles.timeTableThStyle}>Qty</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>UOM</Text>
          </View>
          <View style={styles.quantityHeader}>
            <Text style={styles.timeTableThStyle}>Rate</Text>
          </View>
          <View style={styles.quantityHeader}>
            <Text style={styles.timeTableThStyle}>GST(%)</Text>
          </View>
          <View style={styles.quantityHeader}>
            <Text style={styles.timeTableThStyle}>DISC(%)</Text>
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
        {data?.purchaseOrder?.purchaseItems?.map((obj, i) => {
          return (
            <View style={styles.tableRowStyle} key={i}>
              <View style={styles.seriolNo}>
                <Text style={styles.timeTableTdStyle}>{i + 1}</Text>
              </View>
              <View style={styles.itemName}>
                <Text style={styles.timeTableTdStyle}>{obj.itemName}</Text>
              </View>
              <View style={styles.quantity}>
                <Text style={styles.timeTableTdStyleAmount}>
                  {obj.quantity}
                </Text>
              </View>

              <View style={styles.amount}>
                <Text style={styles.timeTableTdStyleAmount}> {obj?.rate}</Text>
              </View>

              <View style={styles.timeTableTdHeaderStyle1}>
                <Text style={styles.timeTableTdStyleAmount}>
                  {obj?.rate * obj?.quantity}
                </Text>
              </View>

              <View style={styles.amount}>
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
          <View
            style={{
              width: "8.7%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",

              height: "15px",
            }}
          >
            <Text></Text>
          </View>
          <View
            style={{
              width: "34.8%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Times-Roman",
                fontSize: "10px",
              }}
            >
              Total
            </Text>
          </View>

          <View
            style={{
              width: "47.8%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Times-Roman",
                fontSize: "10px",
              }}
            ></Text>
          </View>

          <View
            style={{
              width: "8.7%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                fontFamily: "Times-Roman",
                padding: "1px",
                textAlign: "right",
                marginRight: "5px",
              }}
            >
              {costValue}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "8.7%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text></Text>
          </View>
          <View
            style={{
              width: "34.8%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Times-Roman",
                fontSize: "10px",
              }}
            >
              Disc Total
            </Text>
          </View>

          <View
            style={{
              width: "47.8%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Times-Roman",
                fontSize: "10px",
              }}
            ></Text>
          </View>

          <View
            style={{
              width: "8.7%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                fontFamily: "Times-Roman",
                padding: "1px",
                textAlign: "right",
                marginRight: "5px",
              }}
            >
              {discValue}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "8.7%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text></Text>
          </View>
          <View
            style={{
              width: "34.8%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Times-Roman",
                fontSize: "10px",
              }}
            >
              Gst Total
            </Text>
          </View>

          <View
            style={{
              width: "47.8%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Times-Roman",
                fontSize: "10px",
              }}
            ></Text>
          </View>

          <View
            style={{
              width: "8.7%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              padding: "1px",
              height: "15px",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                fontFamily: "Times-Roman",
                marginRight: "5px",
                textAlign: "right",
              }}
            >
              {gstValue}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "8.7%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text></Text>
          </View>
          <View
            style={{
              width: "34.8%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Times-Roman",
                fontSize: "10px",
              }}
            >
              Grand Total
            </Text>
          </View>

          <View
            style={{
              width: "47.8%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Times-Roman",
                fontSize: "10px",
              }}
            ></Text>
          </View>

          <View
            style={{
              width: "8.7%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              height: "15px",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                fontFamily: "Times-Roman",
                padding: "1px",
                textAlign: "right",
                marginRight: "5px",
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
        <Document title="">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <View style={styles.container}>
                <View style={styles.title}>{timeTableTitle()}</View>
                <View>{GrnDetails()}</View>
                <View>{GrnDetailsOne()}</View>

                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  {supplierData()}
                </View>
                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.containerOne}>{timeTableHeader()}</View>
                </View>

                <View>{amountInWords()}</View>
                <View style={{ marginBottom: "5px" }}>{remarks()}</View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}

export default GrnPdf;
