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
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";

// Register the Arial font
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
  pageLayout: { margin: 25 },

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
    marginTop: "-20px",
  },

  feetemplateTitle: {
    fontSize: 12,
    fontFamily: "Times-Roman",
    textAlign: "center",
    color: "white",
    backgroundColor: "#4A57A9",
    padding: 5,
  },

  templateData1: {
    width: "25%",
  },

  templateHeaders: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    textAlign: "center",
    fontStyle: "bold",
  },

  templateValues: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    textAlign: "center",
  },

  tableRowStyle: {
    flexDirection: "row",
  },

  thStyle: {
    fontSize: "11px",
    fontWeight: "bold",
    width: "40%",
    fontFamily: "Times-Roman",
    color: "#000000",
  },

  border: {
    border: "1px solid black",
    marginLeft: "100px",
    marginRight: "100px",
  },

  timeTableThHeaderStyleParticulars: {
    width: "30%",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },

  timeTableThHeaderStyleParticulars1: {
    width: "10%",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },

  timeTableThHeaderStyle: {
    width: "20%",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
  },

  timeTableThStyle: {
    textAlign: "center",
    padding: "5px",
    fontFamily: "Times-Roman",
    textAlign: "right",
    fontSize: "12px",
  },
  timeTableThStyle1: {
    textAlign: "center",
    padding: "5px",
    fontFamily: "Times-Roman",
    textAlign: "center",
    fontSize: "12px",
  },
});

function PaymentVoucherPdf() {
  const [feeTemplateData, setFeeTemplateData] = useState({});
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Feetemplate Master", link: "/FeetemplateMaster" }]);
  }, []);

  const getData = async () => {
    // FeeTemplate
    await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${id}`)
      .then(async (res) => {
        const templateData = res.data.data[0];

        await axios
          .get(
            `/api/academic/FetchAcademicProgram/${templateData.ac_year_id}/${templateData.program_id}/${templateData.school_id}`
          )
          .then((res) => {
            const yearSem = [];

            if (templateData.program_type_name.toLowerCase() === "yearly") {
              for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
                yearSem.push({ key: i, value: "Year " + i });
              }
            } else if (
              templateData.program_type_name.toLowerCase() === "semester"
            ) {
              for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
                yearSem.push({ key: i, value: "Sem " + i });
              }
            }

            setNoOfYears(yearSem);
          })
          .catch((err) => console.error(err));

        setFeeTemplateData(templateData);
      })
      .catch((err) => console.error(err));

    //   FeeTemplateSubAmount
    await axios
      .get(`/api/finance/FetchFeeTemplateSubAmountDetail/${id}`)
      .then((res) => {
        setFeeTemplateSubAmountData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const feeTemplateTitle = () => {
    return (
      <>
        <View>
          <Text style={styles.feetemplateTitle}>Fee Template</Text>
        </View>
      </>
    );
  };

  const feetemplateData = () => {
    return (
      <>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <View style={styles.templateData1}>
            <Text style={styles.templateHeaders}>Academic Year </Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateValues}>
              {feeTemplateData?.ac_year}
            </Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateHeaders}> Template Name</Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateValues}>
              {feeTemplateData?.fee_template_name}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <View style={styles.templateData1}>
            <Text style={styles.templateHeaders}>Paid At Board </Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateValues}>
              {feeTemplateData?.Is_paid_at_board ? "Yes" : "No"}
            </Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateHeaders}>School</Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateValues}>
              {feeTemplateData?.school_name_short}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <View style={styles.templateData1}>
            <Text style={styles.templateHeaders}>Program</Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateValues}>
              {feeTemplateData?.program_short_name}
            </Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateHeaders}>Specialization</Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateValues}>
              {feeTemplateData?.program_specialization}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <View style={styles.templateData1}>
            <Text style={styles.templateHeaders}>Currency</Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateValues}>
              {feeTemplateData?.currency_type_name}
            </Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateHeaders}>Fee Scheme</Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateValues}>
              {feeTemplateData?.program_type_name}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <View style={styles.templateData1}>
            <Text style={styles.templateHeaders}>Admission Category</Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateValues}>
              {feeTemplateData?.fee_admission_category_short_name}{" "}
            </Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateHeaders}>Admission Sub Category</Text>
          </View>
          <View style={styles.templateData1}>
            <Text style={styles.templateValues}>
              {feeTemplateData?.fee_admission_sub_category_name}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const timeTableHeader = () => {
    return (
      <>
        <View style={styles.tableRowStyle}>
          <View style={styles.timeTableThHeaderStyleParticulars}>
            <Text style={styles.timeTableThStyle1}>Particulars</Text>
          </View>

          {noOfYears.map((obj, i) => {
            return (
              <View style={styles.timeTableThHeaderStyleParticulars1} key={i}>
                <Text style={styles.timeTableThStyle}>{obj.value}</Text>
              </View>
            );
          })}
          <View style={styles.timeTableThHeaderStyleParticulars1}>
            <Text style={styles.timeTableThStyle1}>Total</Text>
          </View>
        </View>
      </>
    );
  };

  const timeTableBody = () => {
    return (
      <>
        {feeTemplateSubAmountData.map((obj, i) => {
          return (
            <View style={styles.tableRowStyle} key={i}>
              <View style={styles.timeTableThHeaderStyleParticulars}>
                <Text style={styles.timeTableThStyle1}>{obj.voucher_head}</Text>
              </View>

              {noOfYears.map((obj1, i) => {
                return (
                  <>
                    <View
                      style={styles.timeTableThHeaderStyleParticulars1}
                      key={i}
                    >
                      <Text style={styles.timeTableThStyle}>
                        {obj["year" + obj1.key + "_amt"]}
                      </Text>
                    </View>
                  </>
                );
              })}

              <View style={styles.timeTableThHeaderStyleParticulars1}>
                <Text style={styles.timeTableThStyle}>{obj.total_amt}</Text>
              </View>
            </View>
          );
        })}
        <View style={styles.tableRowStyle}>
          <View style={styles.timeTableThHeaderStyleParticulars}>
            <Text style={styles.timeTableThStyle1}>Total</Text>
          </View>

          {noOfYears.map((obj, i) => {
            return (
              <View style={styles.timeTableThHeaderStyleParticulars1} key={i}>
                <Text style={styles.timeTableThStyle}>
                  {feeTemplateSubAmountData.length > 0 ? (
                    feeTemplateSubAmountData[0]["fee_year" + obj.key + "_amt"]
                  ) : (
                    <></>
                  )}
                </Text>
              </View>
            );
          })}

          <View style={styles.timeTableThHeaderStyleParticulars1}>
            <Text style={styles.timeTableThStyle}>
              {feeTemplateData.fee_year_total_amount}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const remarksFooter = () => {
    return (
      <>
        <View>
          <Text style={{ fontSize: 12, fontFamily: "Times-Roman" }}>
            Note : {feeTemplateData?.remarks}
          </Text>
        </View>
      </>
    );
  };

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Fee Template">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <View>
                <View>{feeTemplateTitle()}</View>
                <View>{feetemplateData()}</View>

                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "85%",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    {timeTableHeader()}
                    {timeTableBody()}
                  </View>
                </View>

                <View style={{ marginTop: 10 }}>{remarksFooter()}</View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}

export default PaymentVoucherPdf;
