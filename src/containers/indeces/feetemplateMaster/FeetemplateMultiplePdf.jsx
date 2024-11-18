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

  image: { position: "absolute", width: "99.7%" },

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

  tableRow: {
    flexDirection: "row",
  },

  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },

  //Table

  timeTableThHeaderStyleParticulars: {
    width: "40%",
    // borderStyle: "double",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },

  timeTableThHeaderStyleTotalParticulars: {
    width: "60%",
    // borderStyle: "double",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },

  timeTableThHeaderStyleParticularsBoard: {
    width: "20%",
    // borderStyle: "double",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },

  timeTableThHeaderStyleParticulars1: {
    width: "20%",
    // borderStyle: "double",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },

  timeTableTotal: {
    width: "20%",
    // borderStyle: "double",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },

  timeTableThHeaderTotal: {
    width: "20%",
    // borderStyle: "double",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },

  timeTableThHeaderAllTotal: {
    width: "20%",
    // borderStyle: "double",
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
    padding: "3px",
    fontFamily: "Times-Roman",
    textAlign: "right",
    fontSize: "10px",
  },
  timeTableThStyle1: {
    textAlign: "left",
    padding: "3px",
    fontFamily: "Times-Roman",
    fontSize: "10px",
  },
  timeTableThStyleTotal: {
    textAlign: "center",
    padding: "3px",
    fontFamily: "Times-Roman",
    fontSize: "10px",
  },
  timetableStyle: {
    display: "table",
    width: "100%",
    marginTop: "10px",
    border: "1px solid black",
  },
  amountInInr: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    textAlign: "left",
    fontStyle: "bold",
    textAlign: "right",
    width: "100%",
    marginTop: 5,
  },
  timetableStyleOne: {
    display: "table",
    width: "100%",
    marginTop: "136px",
    border: "1px solid black",
  },
});

export const getImage = (schoolShortName) => {
  try {
    if (!schoolShortName) {
      throw new Error("schoolShortName is not defined");
    }
    return require(`../../../assets/${schoolShortName?.org_type.toLowerCase()}${schoolShortName?.school_name_short?.toLowerCase()}.jpg`);
  } catch (error) {
    console.error(
      "Image not found for schoolShortName:",
      schoolShortName?.school_name_short,
      "Error:",
      error.message
    );
    return LetterheadImage;
  }
};

function PaymentVoucherPdf() {
  const [feeTemplateData, setFeeTemplateData] = useState({});
  const [noOfYears, setNoOfYears] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [mainData, setMainData] = useState([]);

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const status = location?.state?.status;
  const templateIds = location?.state?.templateIds;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const ids = templateIds.toString();
    try {
      // Fetch the template response
      const templateResponse = await axios.get(
        `/api/finance/FetchFeeTemplateDetailsByFeeTemplateId/${ids}`
      );

      // Set the main data (to be used elsewhere in your component)
      setMainData(templateResponse.data.data);

      // Get template IDs
      const templateIds = Object.keys(templateResponse.data.data);

      // Initialize an array to hold the results
      const temp = [];

      // Collect all year-semester data in parallel
      const fetchYearSemData = templateIds.map(async (ids) => {
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
            if (i % 2 !== 0) {
              allYears.push({ key: i, value: `Sem ${i}` });
            }
          }
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
      });

      // Wait for all API calls to complete
      await Promise.all(fetchYearSemData);

      // Set the state once all data is collected
      setNoOfYears(temp);
    } catch (error) {
      // Catch and log any errors
      console.error("Error fetching data:", error);
    } finally {
    }
  };

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

  const testss = {}; // Initialize an object to store results

  for (const Ids of templateIds) {
    if (mainData?.[Ids]?.length > 0) {
      // Check if there's data for this ID
      const uniformData = mainData[Ids][0]?.Uniform; // Access the Uniform data

      if (uniformData) {
        // Check if uniformData exists
        const semesterKeys = Object.keys(uniformData); // Safely get keys

        // Check for uniformity across semesters
        const mainResponse = allSemestersEqual(uniformData, semesterKeys);
        testss[Ids] = mainResponse; // Store the response
      } else {
        console.warn(`Uniform data for ${Ids} is undefined or null`);
      }
    } else {
      console.warn(`No data found for ${Ids}`);
    }
  }

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

  const feetemplateData = (Ids) => {
    return (
      <>
        <View style={{ display: "flex" }}>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>Academic Year </Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {mainData?.[Ids]?.[0]?.FeeTemplate?.ac_year}
              </Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>Template Name</Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {mainData?.[Ids]?.[0]?.FeeTemplate?.fee_template_name}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>Paid At Board </Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {mainData?.[Ids]?.[0]?.FeeTemplate?.Is_paid_at_board
                  ? "Yes"
                  : "No"}
              </Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>School</Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {mainData?.[Ids]?.[0]?.FeeTemplate?.school_name_short}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>Program</Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {mainData?.[Ids]?.[0]?.FeeTemplate?.program_short_name}
              </Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>Specialization</Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {mainData?.[Ids]?.[0]?.FeeTemplate?.program_specialization}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>Currency</Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {mainData?.[Ids]?.[0]?.FeeTemplate?.currency_type_name}
              </Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>Fee Collection Pattern</Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {mainData?.[Ids]?.[0]?.FeeTemplate?.program_type_name}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>Admission Category</Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {
                  mainData?.[Ids]?.[0]?.FeeTemplate
                    ?.fee_admission_category_short_name
                }{" "}
              </Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>Admission Sub Category</Text>
            </View>
            <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {
                  mainData?.[Ids]?.[0]?.FeeTemplate
                    ?.fee_admission_sub_category_name
                }
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const timeTableHeader = (Ids) => {
    return (
      <View style={{ backgroundColor: "#edeff7" }}>
        <View style={styles.tableRowStyle} fixed>
          <View style={styles.timeTableThHeaderStyleParticulars}>
            <Text style={styles.timeTableThStyle1}>Particulars</Text>
          </View>

          {mainData?.[Ids]?.[0]?.FeeTemplate?.Is_paid_at_board ? (
            <View style={styles.timeTableThHeaderStyleParticularsBoard}>
              <Text style={styles.timeTableThStyle1}>Board</Text>
            </View>
          ) : (
            <></>
          )}

          {noOfYears?.map((years) => {
            return years[Ids]?.map((sem, i) => {
              return (
                <>
                  <View
                    style={styles.timeTableThHeaderStyleParticulars1}
                    key={i}
                  >
                    <Text style={styles.timeTableThStyle}>{sem.value}</Text>
                  </View>
                </>
              );
            });
          })}

          <View style={styles.timeTableThHeaderStyleParticulars1}>
            <Text style={styles.timeTableThStyleTotal}>Total</Text>
          </View>
        </View>
      </View>
    );
  };

  const timeTableBody = (Ids) => {
    return (
      <>
        {mainData?.[Ids]?.[0]?.FeeTemplateSubAmount?.map((obj, i) => {
          return (
            <View style={styles.tableRowStyle} key={i}>
              <View style={styles.timeTableThHeaderStyleParticulars}>
                <Text style={styles.timeTableThStyle1}>{obj.voucher_head}</Text>
              </View>

              {mainData?.[Ids]?.[0]?.FeeTemplate?.Is_paid_at_board ? (
                <View style={styles.timeTableThHeaderStyleParticularsBoard}>
                  <Text style={styles.timeTableThStyle1}>
                    {obj.board_unique_short_name}
                  </Text>
                </View>
              ) : (
                <></>
              )}

              {noOfYears?.map((obj1) => {
                return obj1?.[Ids]?.map((sem, i) => {
                  return (
                    <>
                      <View
                        style={styles.timeTableThHeaderStyleParticulars1}
                        key={i}
                      >
                        <Text style={styles.timeTableThStyle}>
                          {obj["year" + sem.key + "_amt"]}
                        </Text>
                      </View>
                    </>
                  );
                });
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
                mainData?.[Ids]?.[0]?.FeeTemplate?.Is_paid_at_board
                  ? styles.timeTableThHeaderStyleTotalParticulars
                  : styles.timeTableThHeaderStyleParticulars
              }
            >
              <Text style={styles.timeTableThStyle1}>Total</Text>
            </View>

            {noOfYears?.map((obj1) => {
              return obj1?.[Ids]?.map((sem, i) => {
                return (
                  <>
                    <View
                      style={styles.timeTableThHeaderStyleParticulars1}
                      key={i}
                    >
                      <Text style={styles.timeTableThStyle}>
                        {
                          mainData?.[Ids]?.[0]?.FeeTemplate?.[
                            "fee_year" + sem.key + "_amt"
                          ]
                        }
                      </Text>
                    </View>
                  </>
                );
              });
            })}
            <View
              style={
                feeTemplateData?.Is_paid_at_board
                  ? styles.timeTableThHeaderTotal
                  : styles.timeTableThHeaderStyleParticulars1
              }
            >
              <Text style={styles.timeTableThStyle}>
                {mainData?.[Ids]?.[0]?.FeeTemplate?.["fee_year_total_amount"]}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const timeTableHeaderUniform = (Ids) => {
    const response = testss[Ids];
    const uniformStatus = mainData?.[Ids]?.[0]?.FeeTemplate.uniform_status;
    // Ensure response exists and handles both structures
    if (!response || !uniformStatus) {
      return <Text></Text>;
    }
    const uniformData = mainData?.[Ids]?.[0]?.Uniform;
    if (uniformData) {
      return (
        <>
          {
            <View style={{ backgroundColor: "#edeff7" }}>
              <View style={styles.tableRowStyle} fixed>
                <View style={styles.timeTableThHeaderStyleParticulars}>
                  <Text style={styles.timeTableThStyle1}>Particulars</Text>
                </View>

                {noOfYears.map((obj) => {
                  return obj?.[Ids]?.map((sem, i) => {
                    return (
                      <View
                        style={styles.timeTableThHeaderStyleParticulars1}
                        key={i}
                      >
                        <Text style={styles.timeTableThStyle}>{sem.value}</Text>
                      </View>
                    );
                  });
                })}

                <View style={styles.timeTableThHeaderStyleParticulars1}>
                  <Text style={styles.timeTableThStyleTotal}>Total</Text>
                </View>
              </View>
            </View>
          }
        </>
      );
    } else {
      <></>;
    }
  };

  const timeTableBodyUniform = (Ids) => {
    const response = testss[Ids];
    const uniformStatus = mainData?.[Ids]?.[0]?.FeeTemplate.uniform_status;
    // Ensure response exists and handles both structures
    if (!response || !uniformStatus) {
      return <Text></Text>;
    }

    const currentNoOfYears = noOfYears.find((year) => year[Ids])?.[Ids] || [];

    // Normalize data structure for both cases
    const data = response.data || (response.CS ? { CS: response.CS } : {});

    // Function to sum fees for each specialization
    const sumFeesBySpecialization = (data) => {
      const sums = {};

      Object.keys(data).forEach((specializationKey) => {
        const specializationData = data[specializationKey];

        specializationData.forEach((item) => {
          const specializationName = item.program_specialization_short_name;

          const fees = {};
          currentNoOfYears.forEach((sem) => {
            fees[`sem${sem.key}`] = item[`sem${sem.key}`] || 0;
          });

          if (!sums[specializationName]) {
            sums[specializationName] = {
              specializations: specializationName,
              fees: { ...fees },
            };
          } else {
            Object.keys(fees).forEach((sem) => {
              sums[specializationName].fees[sem] += fees[sem];
            });
          }
        });
      });

      return Object.values(sums);
    };

    // Gather and sum fees for each specialization
    const specializationResults = sumFeesBySpecialization(data);

    // Combine results based on equal semester fees
    const combinedResults = {};
    specializationResults.forEach((item) => {
      const key = JSON.stringify(item.fees);
      if (!combinedResults[key]) {
        combinedResults[key] = {
          specializations: [item.specializations],
          fees: item.fees,
        };
      } else {
        combinedResults[key].specializations.push(item.specializations);
      }
    });

    const finalData = Object.values(combinedResults);

    // Check if all fees are equal
    const isEqual =
      finalData.length > 1 &&
      finalData.every(
        (item) =>
          JSON.stringify(item.fees) === JSON.stringify(finalData[0].fees)
      );

    // Render the output as a React component
    return (
      <View>
        {finalData.map((item, index) => (
          <View style={styles.tableRowStyle} key={index}>
            <View style={styles.timeTableThHeaderStyleParticulars}>
              <Text style={styles.timeTableThStyle1}>
                Uniform & Stationary Fee - {item.specializations.join(", ")}
              </Text>
            </View>
            {currentNoOfYears.map((sem) => (
              <View
                style={styles.timeTableThHeaderStyleParticulars1}
                key={sem.key}
              >
                <Text style={styles.timeTableThStyle}>
                  {item.fees[`sem${sem.key}`]}
                </Text>
              </View>
            ))}
            <View style={styles.timeTableThHeaderStyleParticulars1}>
              <Text style={styles.timeTableThStyle}>
                {Object.values(item.fees).reduce((a, b) => a + b, 0)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const timeTableHeaderAddon = (Ids) => {
    return (
      <>
        {mainData?.[Ids]?.[0]?.AddOn.length > 0 ? (
          <>
            <View style={{ backgroundColor: "#edeff7" }}>
              <View style={styles.tableRowStyle} fixed>
                <View style={styles.timeTableThHeaderStyleParticulars}>
                  <Text style={styles.timeTableThStyle1}>Particulars</Text>
                </View>
                {noOfYears.map((obj) => {
                  return obj?.[Ids]?.map((sem, i) => {
                    return (
                      <View
                        style={styles.timeTableThHeaderStyleParticulars1}
                        key={i}
                      >
                        <Text style={styles.timeTableThStyle}>{sem.value}</Text>
                      </View>
                    );
                  });
                })}
                <View style={styles.timeTableThHeaderStyleParticulars1}>
                  <Text style={styles.timeTableThStyleTotal}>Total</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  const timeTableBodyAddon = (Ids) => {
    return (
      <>
        {mainData?.[Ids]?.[0]?.AddOn.length > 0 ? (
          <>
            <View style={styles.tableRowStyle}>
              <View style={styles.timeTableThHeaderStyleParticulars}>
                <Text style={styles.timeTableThStyle1}>
                  Add-on Programme Fee
                </Text>
              </View>
              {noOfYears.map((obj) => {
                return obj?.[Ids]?.map((sem, i) => {
                  return (
                    <View
                      style={styles.timeTableThHeaderStyleParticulars1}
                      key={i}
                    >
                      <Text style={styles.timeTableThStyle}>
                        {mainData?.[Ids]?.[0]?.AddOn.reduce((sum, program) => {
                          return sum + (program[`sem${sem.key}`] || 0);
                        }, 0)}
                      </Text>
                    </View>
                  );
                });
              })}
              <View style={styles.timeTableThHeaderStyleParticulars1}>
                <Text style={styles.timeTableThStyle}>
                  {mainData?.[Ids]?.[0]?.AddOn.reduce((sum, program) => {
                    return sum + (program.total || 0);
                  }, 0)}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  const remarksFooter = (Ids) => {
    return (
      <>
        <View>
          <Text style={{ fontSize: 10, fontFamily: "Times-Roman" }}>
            Note : {mainData?.[Ids]?.[0]?.FeeTemplate?.remarks}
          </Text>
        </View>
      </>
    );
  };

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Fee Template">
          {Object.keys(mainData).map((Ids, i) => {
            return (
              <>
                <Page size="A4" key={i}>
                  <View style={styles.image}>
                    <Image src={getImage(mainData?.[Ids]?.[0]?.FeeTemplate)} />
                  </View>
                  <View style={styles.pageLayout}>
                    <View>{feeTemplateTitle()}</View>
                    <View>{feetemplateData(Ids)}</View>
                    <View style={{ marginTop: 10 }}>
                      {timeTableHeader(Ids)}
                      {timeTableBody(Ids)}
                    </View>
                    <View style={{ marginTop: 10 }}>
                      {timeTableHeaderAddon(Ids)}
                      {timeTableBodyAddon(Ids)}
                    </View>
                    <View style={{ marginTop: 10 }}>
                      {timeTableHeaderUniform(Ids)}
                      {timeTableBodyUniform(Ids)}
                    </View>
                    <View style={{ marginTop: 8 }}>{remarksFooter(Ids)}</View>
                    {/* <View style={{ marginTop: 10 }}>{Feetemplate(Ids)}</View> */}
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
