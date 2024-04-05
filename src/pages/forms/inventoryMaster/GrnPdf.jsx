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
    width: "51%",
    borderRight: "1px solid black",
    padding: "2px",
  },

  invoiceData: {
    width: "49%",
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
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  uom: {
    width: "14%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },

  seriolNoHeader: {
    width: "10%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  itemNameHeader: {
    width: "50%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  quantityHeader: {
    width: "14%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },

  rate: {
    width: "14%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
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
  },

  seriolNo: {
    width: "10%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },

  quantity: {
    width: "14%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },

  itemName: {
    width: "50%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },

  timeTableTdStyle: {
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

  amountHeader: {
    width: "15%",
    borderBottom: "1px solid black",
    color: "black",
  },
  amount: {
    width: "15%",
    borderBottom: "1px solid black",
  },
});

function GrnPdf() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [costValue, setCostValue] = useState();
  const [gstValue, setGstValue] = useState();
  const [discValue, setDiscValue] = useState();

  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();

  useEffect(() => {
    setCrumbs([{ name: "GRN Index", link: "/GRNIndex" }]);
    getPdfData();
  }, []);

  useEffect(() => {
    const temp = data?.grnListDTO?.reduce((a, b) => a + b.totalAmount, 0);
    setTotal(temp);

    const costTotal = data?.grnListDTO?.reduce(
      (a, b) => Number(a) + Number(b.costTotal),
      0
    );

    setCostValue(costTotal);

    const gstTotal = data?.grnListDTO?.reduce(
      (a, b) => Number(a) + Number(b.gstTotal),
      0
    );

    setGstValue(gstTotal);

    const discTotal = data?.grnListDTO?.reduce(
      (a, b) => Number(a) + Number(b.discountTotal),
      0
    );

    setDiscValue(discTotal);
  }, [data]);

  const getPdfData = async () => {
    await axios
      .get(`/api/purchase/getListofGRNForPdf?grnNo=${id?.replace(/_/g, "/")}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
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
          <Text style={styles.thStyle}>
            GRN : {data?.grnListDTO?.[0]?.grnNumber}
          </Text>

          <Text style={styles.thStyle1}>
            Invoice No : {data?.grnListDTO?.[0]?.invoiceNo}
          </Text>
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
              {moment(data?.grnListDTO?.[0]?.createdDate).isValid()
                ? moment(data[0]?.createdDate).format("DD-MM-YYYY")
                : null}
            </Text>

            <Text style={styles.thStyle1}>
              Invoice Date :{" "}
              {moment(data?.grnListDTO?.[0]?.invoiceDate).format("DD-MM-YYYY")}
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

            <Text style={styles.thStyle1}>E & O.E </Text>
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
            <Text style={styles.thStyle}>
              Remarks : {data?.grnListDTO?.[0].remarks}
            </Text>

            <Text style={styles.thStyle1}>
              Created By : {data?.grnListDTO?.[0].createdByUserName}
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
              <Text style={styles.supplierOne}>
                {data?.vendor?.vendor_name}
              </Text>
              <Text style={styles.supplierOne}>
                {data?.vendor?.street_name}
              </Text>
              <Text style={styles.supplierOne}>
                {data?.vendor?.city_name} {data?.vendor?.state_name}
              </Text>
              <Text style={styles.supplierOne}>
                GST No. : {data?.vendor?.vendor_gst_no}
              </Text>
              <Text style={styles.supplierOne}>
                M-Id : {data?.vendor?.vendor_email}
              </Text>
              <Text style={styles.supplierOne}>
                PH No. : {data?.vendor?.vendor_contact_no}
              </Text>{" "}
              <Text style={styles.supplierOne}>
                PAN No. : {data?.vendor?.pan_number}
              </Text>
            </View>
            <View style={styles.invoiceData}>
              <Text style={styles.supplierOne}>Invoice To :</Text>
              <Text style={styles.supplierOne}>
                ACHARYA INSTITUTE OF TECHNOLOGY
              </Text>
              <Text style={styles.supplierOne}>No.89/90, Soladevanahalli,</Text>
              <Text style={styles.supplierOne}>
                Hesaraghatta Main Road, Chikbanavara,
              </Text>
              <Text style={styles.supplierOne}>Bangalore - 560090</Text>
              <Text style={styles.supplierOne}>
                Email-Id: purchase@acharya.ac.in
              </Text>
              <Text style={styles.supplierOne}>
                State Name: Karnataka Code: 29
              </Text>
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
        {data?.grnListDTO?.map((obj, i) => {
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
                  {obj.enterQuantity}
                </Text>
              </View>
              <View style={styles.uom}>
                <Text style={styles.timeTableTdStyleAmount}>
                  {obj.uomShortName}
                </Text>
              </View>

              <View style={styles.rate}>
                <Text style={styles.timeTableTdStyleAmount}>
                  {obj?.rate * obj?.quantity}
                </Text>
              </View>

              <View style={styles.rate}>
                <Text style={styles.timeTableTdStyleAmount}>{obj?.gst}</Text>
              </View>

              <View style={styles.rate}>
                <Text style={styles.timeTableTdStyleAmount}>
                  {obj?.rate * obj?.discount}
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
              width: "6.9%",
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
              width: "34.5%",
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
              width: "48.3%",
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
              width: "10.3%",
              fontFamily: "Times-Roman",
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
              width: "6.9%",
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
              width: "34.5%",
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
              width: "48.3%",
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
              width: "10.3%",
              fontFamily: "Times-Roman",
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
              width: "6.9%",
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
              width: "34.5%",
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
              width: "48.3%",
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
              width: "10.3%",
              fontFamily: "Times-Roman",
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
              width: "6.9%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
              height: "15px",
            }}
          >
            <Text></Text>
          </View>
          <View
            style={{
              width: "34.5%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",

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
              width: "48.3%",
              fontFamily: "Times-Roman",
              borderRight: "1px solid black",
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
              width: "10.3%",
              fontFamily: "Times-Roman",
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
                  <View style={styles.containerOne}>
                    {timeTableHeader()}
                    {timeTableBody()}
                  </View>
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
