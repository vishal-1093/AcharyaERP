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
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

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

  bankDetails: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    marginTop: "10px",
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
    padding: "15px",
  },

  quotation: {
    width: "50%",
    borderTop: "1px solid black",
    padding: "10px",
  },

  quotationName: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },

  otherRefernce: {
    width: "50%",
    borderRight: "1px solid black",
    borderTop: "1px solid black",
    padding: "10px",
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

  termsandconditionsNameBody: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    marginTop: "5px",
    lineHeight: 1.25,
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
    width: "81.7%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },

  Amount: {
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
    width: "10%",
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
  },

  seriolNo: {
    width: "10%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },

  quantity: {
    width: "10%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
  },

  itemName: {
    width: "40%",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
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
  },

  amountHeader: {
    width: "10%",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    color: "black",
  },
});

function PoPdf() {
  const [data, setData] = useState([]);
  const [schoolName, setSchoolName] = useState("");
  const [total, setTotal] = useState();
  const [costValue, setCostValue] = useState();
  const [gstValue, setGstValue] = useState();
  const [discValue, setDiscValue] = useState();

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Purchase Order", link: "/PoMaster" }]);
  }, []);

  useEffect(() => {
    const temp = data?.temporaryPurchseOrder?.temporaryPurchaseItems?.reduce(
      (a, b) => a + b.totalAmount,
      0
    );
    setTotal(temp);

    const costTotal =
      data?.temporaryPurchseOrder?.temporaryPurchaseItems?.reduce(
        (a, b) => Number(a) + Number(b.costTotal),
        0
      );

    setCostValue(costTotal);

    const gstTotal =
      data?.temporaryPurchseOrder?.temporaryPurchaseItems?.reduce(
        (a, b) => Number(a) + Number(b.gstTotal),
        0
      );

    setGstValue(gstTotal);

    const discTotal =
      data?.temporaryPurchseOrder?.temporaryPurchaseItems?.reduce(
        (a, b) => Number(a) + Number(b.discountTotal),
        0
      );

    setDiscValue(discTotal);
  }, [data]);

  const getData = async () => {
    await axios
      .get(`/api/purchase/getPurchaseOrderById?id=${id}`)
      .then((res) => {
        setData(res.data.data);
        getSchoolData(res.data.data.purchaseOrder.instituteId);
      })
      .catch((error) => console.error(error));
  };

  const getSchoolData = async (instituteId) => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        res.data.data.filter((obj) => {
          if (obj.school_id === instituteId) {
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
          <Text>Purchase Order - {data?.purchaseOrder?.requestType}</Text>
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
            <Text style={styles.addressone}>No.89/90, Soladevanahalli,</Text>
            <Text style={styles.addressone}>
              Hesaraghatta Main Road, Chikbanavara,
            </Text>
            <Text style={styles.addressone}>Bangalore - 560090</Text>
            <Text style={styles.addressone}>
              Email-Id: purchase@acharya.ac.in
            </Text>
            <Text style={styles.addressone}>
              State Name: Karnataka {"   "} Code: 29
            </Text>
          </View>

          <View style={styles.date}>
            <Text style={styles.dateone}>
              Po Reference No: {data?.purchaseOrder?.poReferenceNo}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.store}>
                <Text style={styles.storeName}>
                  Date :
                  {moment(data?.temporaryPurchseOrder?.quotationDate).format(
                    "DD-MM-YYYY"
                  )}{" "}
                </Text>
              </View>
              <View style={styles.destination}>
                <Text style={styles.storeName}>
                  Quotation No. : {data?.purchaseOrder?.quotationNo}
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

            <Text style={styles.addresstwoNames}>
              {data?.vendor?.vendor_name}
            </Text>
            <Text style={styles.addresstwoNames}>
              {data?.vendor?.street_name}
            </Text>
            <Text style={styles.addresstwoNames}>{data?.vendor?.area}</Text>
            <Text style={styles.addresstwoNames}>
              {data?.vendor?.city_name} , {data?.vendor?.state_name} -{" "}
              {data?.vendor?.pin_code}
            </Text>
            <Text style={styles.addresstwoNames}>
              GST No. : {data?.vendor?.vendor_gst_no}
            </Text>
            <Text style={styles.addresstwoNames}>
              Email Id : {data?.vendor?.vendor_email}
            </Text>
            <Text style={styles.addresstwoNames}>
              Ph No. : {data?.vendor?.vendor_contact_no}
            </Text>
            <Text style={styles.addresstwoNames}>
              PAN No. : {data?.vendor?.pan_number}
            </Text>

            <Text
              style={{
                fontSize: 11,
                fontFamily: "Times-Roman",
                marginTop: "10px",
              }}
            >
              Kind Attention :{" "}
              {data?.vendor?.vendor_address
                ? `Mr/Mrs. ${data?.vendor?.vendor_address}`
                : ""}
            </Text>
          </View>

          <View style={styles.date}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.otherRefernce}>
                <Text style={styles.quotationName}>
                  Other References :{data?.purchaseOrder?.otherReference}
                </Text>
              </View>
              <View style={styles.quotation}>
                <Text style={styles.quotationName}>
                  Payment Type : {data?.purchaseOrder?.accountPaymentType}
                </Text>
              </View>
            </View>
            <View style={styles.termsandconditions}>
              <Text style={styles.termsandconditionsName}>
                Terms and conditions :
              </Text>
              <Text style={styles.termsandconditionsNameBody}>
                {data?.purchaseOrder?.termsAndConditions}
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
                ? numberToWords.toWords(Number(total)).toUpperCase()
                : ""}
            </Text>
            <Text style={styles.bankDetails}>Bank Details</Text>
            <Text style={styles.addresstwoNames}>
              Account Holder Name :{" "}
              {data?.vendor?.vendor_bank_account_holder_name}
            </Text>
            <Text style={styles.addresstwoNames}>
              Bank Name : {data?.vendor?.vendor_bank_name}
            </Text>
            <Text style={styles.addresstwoNames}>
              Account No. : {data?.vendor?.account_no}
            </Text>
            <Text style={styles.addresstwoNames}>
              Bank branch : {data?.vendor?.bank_branch}
            </Text>
            <Text style={styles.addresstwoNames}>
              Bank IFSC No. : {data?.vendor?.vendor_bank_ifsc_code}
            </Text>
          </View>
          <View style={styles.vendorDetails}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Times-Roman",
                textAlign: "right",
                marginTop: "10px",
              }}
            >
              For {schoolName.toUpperCase() ?? ""}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Times-Roman",
                textAlign: "right",
                marginTop: "50px",
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

          <View style={styles.rateHeader}>
            <Text style={styles.timeTableThStyleAmount}>Rate</Text>
          </View>

          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Cost</Text>
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
                <Text style={styles.timeTableTdStyleAmount}>
                  {obj?.gst ?? 0}
                </Text>
              </View>
              <View style={styles.amount}>
                <Text style={styles.timeTableTdStyleAmount}>
                  {obj?.discount ?? 0}
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
        <Document title="Purchase Order">
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

export default PoPdf;
