import { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
} from "@react-pdf/renderer";
import axios from "../../../services/Api";
import { useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";
import LetterheadImage from "../../../assets/aisait.jpg";

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

  image: { position: "absolute", width: "99%" },

  feetemplateTitle: {
    fontSize: 12,
    fontFamily: "Times-Roman",
    textAlign: "center",
    color: "white",
    backgroundColor: "#4A57A9",
    padding: 5,
    marginTop: 115,
    borderRadius: 4,
  },

  templateData1: {
    width: "25%",
  },

  templateHeaders: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    textAlign: "left",
    fontStyle: "bold",
  },

  templateValues: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    textAlign: "left",
  },

  tableRowStyle: {
    flexDirection: "row",
  },
});

export const getImage = (employeeDocuments) => {
  try {
    if (!employeeDocuments || !employeeDocuments.school_name_short) {
      throw new Error("schoolShortName is not defined");
    }
    return require(`../../../assets/${employeeDocuments?.org_type?.toLowerCase()}${employeeDocuments?.school_name_short?.toLowerCase()}.jpg`);
  } catch (error) {
    console.error(
      "Image not found for schoolShortName:",
      employeeDocuments?.school_name_short,
      "Error:",
      error.message
    );
    return LetterheadImage;
  }
};
function PaymentVoucherPdf() {
  const [feeTemplateData, setFeeTemplateData] = useState({});
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [mainData, setMainData] = useState([]);

  const [addOnFeeTable, setAddonFeeTable] = useState([]);
  const [uniformTable, setUniformTable] = useState([]);
  const [allSpecializations, setAllSpecilizations] = useState([]);

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const status = location?.state;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      // Fetch the template response
      const templateResponse = await axios.get(
        `/api/finance/FetchFeeTemplateDetailsByFeeTemplateId/170,171`
      );

      // Set the main data (to be used elsewhere in your component)
      setMainData(templateResponse.data.data);

      // Get template IDs
      const templateIds = Object.keys(templateResponse.data.data);

      // Initialize an array to hold the results
      const temp = [];

      // Loop through each templateId
      for (const ids of templateIds) {
        const data = templateResponse.data.data;

        // Make the second API call to get academic program details
        const getYearSem = await axios.get(
          `/api/academic/FetchAcademicProgram/${data?.[ids]?.[0]?.FeeTemplate?.ac_year_id}/${data?.[ids]?.[0]?.FeeTemplate?.program_id}/${data?.[ids]?.[0]?.FeeTemplate?.school_id}`
        );
        const allYears = [];

        if (
          data?.[ids]?.[0]?.FeeTemplate?.program_type_name.toLowerCase() ===
          "yearly"
        ) {
          // Loop through the number of semesters returned in the API response
          const numberOfSemesters = getYearSem.data.data[0].number_of_semester;

          for (let i = 1; i <= numberOfSemesters; i++) {
            allYears.push({ key: i, value: `Sem ${i}` });
          }

          // Log the semesters generated for each template
          console.log(`${ids} - Number of Semesters:`, allYears);
        } else if (
          data?.[ids]?.[0]?.FeeTemplate?.program_type_name.toLowerCase() ===
          "semester"
        ) {
          const numberOfSemesters = getYearSem.data.data[0].number_of_semester;

          for (let i = 1; i <= numberOfSemesters; i++) {
            allYears.push({ key: i, value: `Sem ${i}` });
          }
        }

        // Prepare the year-semester object for this templateId
        const yearsem = {};
        yearsem[ids] = allYears; // Store the semesters generated

        // Push the result into the temp array
        temp.push(yearsem);
      }
    } catch (error) {
      // Catch and log any errors
      console.error("Error fetching data:", error);
    }
  };

  console.log(mainData);

  const totalSum = addOnFeeTable.reduce((total, program) => {
    return (
      total +
      noOfYears.reduce((sum, sem) => {
        return sum + (program[`sem${sem.key}`] || 0);
      }, 0)
    );
  }, 0);

  const allSemestersEqual = (data, specs) => {
    if (!data || !Array.isArray(specs) || specs.length === 0) {
      return null; // Return null if data is invalid
    }

    const firstSpec = specs[0];
    if (!data[firstSpec] || !data[firstSpec][0]) {
      return null; // Return null if the first specialization is not defined
    }

    const semesterKeys = Object.keys(data[firstSpec][0]);
    const comparisonResults = {};

    for (const sem of semesterKeys) {
      const values = specs.map((spec) => data[spec]?.[0]?.[sem]); // Extract values for each spec

      if (new Set(values).size === 1) {
        // Check if all values are equal
        comparisonResults[sem] = values[0]; // Store the common value
      } else {
        return { isEqual: false, data }; // If any are different, return null
      }
    }

    return { isEqual: true, [specs.join(",")]: [comparisonResults] }; // Return the result with specialization names
  };

  const mainResponse = allSemestersEqual(uniformTable, allSpecializations);

  const calculateSemesterTotals = (programFees) => {
    const totalSem = {
      sem1: 0,
      sem2: 0,
      sem3: 0,
      sem4: 0,
      sem5: 0,
      sem6: 0,
      sem7: 0,
      sem8: 0,
      sem9: 0,
      sem10: 0,
      sem11: 0,
      sem12: 0,
    };

    programFees.forEach((fee) => {
      for (let sem in totalSem) {
        if (fee[sem]) {
          totalSem[sem] += fee[sem];
        }
      }
    });

    return totalSem;
  };

  if (status) {
    setCrumbs([
      { name: "Feetemplate Master", link: "/FeetemplateMaster" },
      { name: feeTemplateData?.fee_template_name },
    ]);
  } else {
    setCrumbs([
      { name: "Feetemplate Master", link: "/FeetemplateApprovalIndex" },
      { name: feeTemplateData?.fee_template_name },
    ]);
  }

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
        <View style={{ display: "flex" }}>
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
              <Text style={styles.templateHeaders}>Template Name</Text>
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
              <Text style={styles.templateHeaders}>Fee Collection Pattern</Text>
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
        </View>
      </>
    );
  };

  const timeTableHeader = () => {
    return (
      <View style={{ backgroundColor: "#edeff7" }}>
        <View style={styles.tableRowStyle} fixed>
          <View style={styles.timeTableThHeaderStyleParticulars}>
            <Text style={styles.timeTableThStyle1}>Particulars</Text>
          </View>

          {feeTemplateData?.Is_paid_at_board ? (
            <View style={styles.timeTableThHeaderStyleParticularsBoard}>
              <Text style={styles.timeTableThStyle1}>Board</Text>
            </View>
          ) : (
            <></>
          )}

          {noOfYears.map((obj, i) => {
            if (
              feeTemplateSubAmountData?.[0]?.["fee_year" + obj.key + "_amt"] >
                0 &&
              feeTemplateData.program_type_name === "Yearly"
            ) {
              return (
                <View style={styles.timeTableThHeaderStyleParticulars1} key={i}>
                  <Text style={styles.timeTableThStyle}>{obj.value}</Text>
                </View>
              );
            } else {
              return (
                <View style={styles.timeTableThHeaderStyleParticulars1} key={i}>
                  <Text style={styles.timeTableThStyle}>{obj.value}</Text>
                </View>
              );
            }
          })}
          <View style={styles.timeTableThHeaderStyleParticulars1}>
            <Text style={styles.timeTableThStyleTotal}>Total</Text>
          </View>
        </View>
      </View>
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

              {feeTemplateData?.Is_paid_at_board ? (
                <View style={styles.timeTableThHeaderStyleParticularsBoard}>
                  <Text style={styles.timeTableThStyle1}>
                    {obj.board_unique_short_name}
                  </Text>
                </View>
              ) : (
                <></>
              )}

              {noOfYears.map((obj1, j) => {
                if (
                  feeTemplateSubAmountData?.[i]?.[
                    "fee_year" + obj1.key + "_amt"
                  ] > 0 &&
                  feeTemplateData.program_type_name === "Yearly"
                ) {
                  return (
                    <>
                      <View
                        style={styles.timeTableThHeaderStyleParticulars1}
                        key={j}
                      >
                        <Text style={styles.timeTableThStyle}>
                          {obj["year" + obj1.key + "_amt"]}
                        </Text>
                      </View>
                    </>
                  );
                } else {
                  return (
                    <>
                      <View
                        style={styles.timeTableThHeaderStyleParticulars1}
                        key={j}
                      >
                        <Text style={styles.timeTableThStyle}>
                          {obj["year" + obj1.key + "_amt"]}
                        </Text>
                      </View>
                    </>
                  );
                }
              })}

              <View style={styles.timeTableThHeaderStyleParticulars1}>
                <Text style={styles.timeTableThStyle}>{obj.total_amt}</Text>
              </View>
            </View>
          );
        })}
        <View style={{ backgroundColor: "#edeff7" }}>
          <View style={styles.tableRowStyle}>
            <View
              style={
                feeTemplateData?.Is_paid_at_board
                  ? styles.timeTableThHeaderStyleTotalParticulars
                  : styles.timeTableThHeaderStyleParticulars
              }
            >
              <Text style={styles.timeTableThStyle1}>Total</Text>
            </View>

            {noOfYears.map((obj, i) => {
              if (
                feeTemplateSubAmountData?.[0]?.["fee_year" + obj.key + "_amt"] >
                  0 &&
                feeTemplateData.program_type_name === "Yearly"
              ) {
                return (
                  <View
                    style={
                      feeTemplateData?.Is_paid_at_board
                        ? styles.timeTableThHeaderAllTotal
                        : styles.timeTableThHeaderStyleParticulars1
                    }
                    key={i}
                  >
                    <Text style={styles.timeTableThStyle}>
                      {feeTemplateSubAmountData.length > 0 ? (
                        feeTemplateSubAmountData[0][
                          "fee_year" + obj.key + "_amt"
                        ]
                      ) : (
                        <></>
                      )}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <View
                    style={
                      feeTemplateData?.Is_paid_at_board
                        ? styles.timeTableThHeaderAllTotal
                        : styles.timeTableThHeaderStyleParticulars1
                    }
                    key={i}
                  >
                    <Text style={styles.timeTableThStyle}>
                      {feeTemplateSubAmountData.length > 0 ? (
                        feeTemplateSubAmountData[0][
                          "fee_year" + obj.key + "_amt"
                        ]
                      ) : (
                        <></>
                      )}
                    </Text>
                  </View>
                );
              }
            })}

            <View
              style={
                feeTemplateData?.Is_paid_at_board
                  ? styles.timeTableThHeaderTotal
                  : styles.timeTableThHeaderStyleParticulars1
              }
            >
              <Text style={styles.timeTableThStyle}>
                {feeTemplateData.fee_year_total_amount}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const timeTableHeaderUniform = () => {
    return (
      <>
        {allSpecializations.length > 0 && feeTemplateData.uniform_status ? (
          <View style={{ backgroundColor: "#edeff7" }}>
            <View style={styles.tableRowStyle} fixed>
              <View style={styles.timeTableThHeaderStyleParticulars}>
                <Text style={styles.timeTableThStyle1}>Particulars</Text>
              </View>

              {noOfYears.map((obj, i) => {
                return (
                  <View
                    style={styles.timeTableThHeaderStyleParticulars1}
                    key={i}
                  >
                    <Text style={styles.timeTableThStyle}>{obj.value}</Text>
                  </View>
                );
              })}
              <View style={styles.timeTableThHeaderStyleParticulars1}>
                <Text style={styles.timeTableThStyleTotal}>Total</Text>
              </View>
            </View>
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };

  const timeTableBodyUniform = () => {
    return (
      <>
        {allSpecializations.length === 1 && feeTemplateData.uniform_status ? (
          allSpecializations.map((obj) => {
            return (
              <View style={styles.tableRowStyle}>
                <View style={styles.timeTableThHeaderStyleParticulars}>
                  <Text style={styles.timeTableThStyle1}>
                    Uniform & Stationery Fee - {obj}
                  </Text>
                </View>
                {noOfYears.map((obj1, i) => {
                  return (
                    <>
                      <View
                        style={styles.timeTableThHeaderStyleParticulars1}
                        key={i}
                      >
                        <Text style={styles.timeTableThStyle}>
                          {mainResponse?.[obj]?.[0]?.["sem" + obj1.key] ?? 0}
                        </Text>
                      </View>
                    </>
                  );
                })}

                <View style={styles.timeTableThHeaderStyleParticulars1}>
                  <Text style={styles.timeTableThStyle}>
                    {Object.values(mainResponse?.[obj]?.[0])?.reduce(
                      (total, sum) => Number(total) + Number(sum),
                      0
                    )}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <>
            <View style={styles.tableRowStyle}>
              <View style={styles.timeTableThHeaderStyleParticulars}>
                <Text style={styles.timeTableThStyle1}>
                  Uniform & Stationery Fee - {allSpecializations.join(",")}
                </Text>
              </View>
              {noOfYears.map((obj1, i) => {
                return (
                  <>
                    <View
                      style={styles.timeTableThHeaderStyleParticulars1}
                      key={i}
                    >
                      <Text style={styles.timeTableThStyle}>
                        {mainResponse?.[allSpecializations.join(",")]?.[0]?.[
                          "sem" + obj1.key
                        ] ?? 0}
                      </Text>
                    </View>
                  </>
                );
              })}
              <View style={styles.timeTableThHeaderStyleParticulars1}>
                <Text style={styles.timeTableThStyle}>
                  {Object.values(
                    mainResponse?.[allSpecializations.join(",")]?.[0]
                  )?.reduce((total, sum) => Number(total) + Number(sum), 0)}
                </Text>
              </View>
            </View>
          </>
        )}
      </>
    );
  };

  const timeTableHeaderAddon = () => {
    return (
      <>
        {addOnFeeTable.length > 0 ? (
          <View style={{ backgroundColor: "#edeff7" }}>
            <View style={styles.tableRowStyle} fixed>
              <View style={styles.timeTableThHeaderStyleParticulars}>
                <Text style={styles.timeTableThStyle1}>Particulars</Text>
              </View>

              {noOfYears.map((obj, i) => {
                return (
                  <View
                    style={styles.timeTableThHeaderStyleParticulars1}
                    key={i}
                  >
                    <Text style={styles.timeTableThStyle}>{obj.value}</Text>
                  </View>
                );
              })}
              <View style={styles.timeTableThHeaderStyleParticulars1}>
                <Text style={styles.timeTableThStyleTotal}>Total</Text>
              </View>
            </View>
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };

  const timeTableBodyAddon = () => {
    return (
      <>
        {addOnFeeTable.length > 0 ? (
          <>
            <View style={styles.tableRowStyle}>
              <View style={styles.timeTableThHeaderStyleParticulars}>
                <Text style={styles.timeTableThStyle1}>
                  Add-on Programme Fee
                </Text>
              </View>
              {noOfYears.map((obj1, i) => {
                return (
                  <>
                    <View
                      style={styles.timeTableThHeaderStyleParticulars1}
                      key={i}
                    >
                      <Text style={styles.timeTableThStyle}>
                        {addOnFeeTable.reduce((sum, program) => {
                          return sum + (program[`sem${obj1.key}`] || 0);
                        }, 0)}
                      </Text>
                    </View>
                  </>
                );
              })}
              <View style={styles.timeTableThHeaderStyleParticulars1}>
                <Text style={styles.timeTableThStyle}>{totalSum}</Text>
              </View>
            </View>
          </>
        ) : (
          ""
        )}
      </>
    );
  };

  const remarksFooter = () => {
    return (
      <>
        <View>
          <Text style={{ fontSize: 12, fontFamily: "Times-Roman" }}>
            Note : {remarks}
          </Text>
        </View>
      </>
    );
  };

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Fee Template">
          {Object.keys(mainData).map((Ids) => {
            return (
              <>
                <Page size="A4">
                  <View style={styles.image}>
                    <Image src={getImage(feeTemplateData)} />
                  </View>
                  <View style={styles.pageLayout}>
                    <View>{feeTemplateTitle()}</View>
                    <View>{feetemplateData()}</View>
                  </View>
                </Page>
              </>
            );
          })}
        </Document>
      </PDFViewer>
    </>
  );
}

export default PaymentVoucherPdf;
