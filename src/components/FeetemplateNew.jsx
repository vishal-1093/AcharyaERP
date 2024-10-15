import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Button,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { noop } from "chart.js/helpers";

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 2,
  },
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  yearTd: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "right",
  },
}));

function FeetemplateNew() {
  const [feetemplateData, setFeeTemplateData] = useState({});
  const [feetemplateSubAmountData, setFeetemplateSubAmountData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addonData, setAddonData] = useState([]);
  const [uniqueFess, setUniqueFees] = useState([]);
  const [uniformNumber, setUniformNumber] = useState([]);
  const [uniqueTables, setUniqueTables] = useState([]);
  const [addOnFeeTable, setAddonFeeTable] = useState([]);
  const [uniformTable, setUniformTable] = useState([]);

  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const status = location?.state?.status;
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const templateResponse = await axios.get(
        `/api/finance/FetchAllFeeTemplateDetail/${id}`
      );

      setFeeTemplateData(templateResponse.data.data[0]);

      const yearsemResponse = await axios.get(
        `/api/academic/FetchAcademicProgram/${templateResponse.data.data[0].ac_year_id}/${templateResponse.data.data[0].program_id}/${templateResponse.data.data[0].school_id}`
      );

      const yearSem = [];

      if (
        templateResponse.data.data[0].program_type_name.toLowerCase() ===
        "yearly"
      ) {
        for (
          let i = 1;
          i <= yearsemResponse.data.data[0].number_of_semester;
          i++
        ) {
          yearSem.push({ key: i, value: "Sem " + i });
        }
      } else if (
        templateResponse.data.data[0].program_type_name.toLowerCase() ===
        "semester"
      ) {
        for (
          let i = 1;
          i <= yearsemResponse.data.data[0].number_of_semester;
          i++
        ) {
          yearSem.push({ key: i, value: "Sem " + i });
        }
      }
      setNoOfYears(yearSem);

      const subAmountResponse = await axios.get(
        `/api/finance/FetchFeeTemplateSubAmountDetail/${id}`
      );

      setFeetemplateSubAmountData(subAmountResponse.data.data);

      const addOnResponse = await axios.get(
        `/api/otherFeeDetails/getOtherFeeDetailsData?schoolId=${templateResponse.data.data[0].school_id}&acYearId=${templateResponse.data.data[0].ac_year_id}&programId=${templateResponse.data.data[0].program_id}&programSpecializationId=${templateResponse.data.data[0].program_specialization_id}`
      );

      const addOnFeeResponse = addOnResponse.data.filter(
        (obj) => obj.feetype === "Add-on Programme Fee"
      );

      const uniqueSpecializations = [
        ...new Set(
          addOnFeeResponse.map(
            (program) => program.program_specialization_short_name
          )
        ),
      ];

      const groupedPrograms = addOnFeeResponse.reduce((acc, program) => {
        const shortName = program.program_specialization_short_name;

        if (!acc[shortName]) {
          acc[shortName] = [];
        }

        acc[shortName].push(program);

        return acc;
      }, {});

      console.log(groupedPrograms);

      const uniformResponse = addOnResponse.data.filter(
        (obj) => obj.feetype === "Uniform And Stationery Fee"
      );
      setUniformTable(uniformResponse);
      setAddonFeeTable(addOnFeeResponse);
      setUniformNumber([]);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (status) {
    setCrumbs([
      { name: "Feetemplate Master", link: "/FeetemplateMaster" },
      { name: feetemplateData?.fee_template_name },
    ]);
  } else {
    setCrumbs([
      { name: "Feetemplate Master", link: "/FeetemplateApprovalIndex" },
      { name: feetemplateData?.fee_template_name },
    ]);
  }

  if (loading) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        Please wait ....
      </Typography>
    );
  }

  if (!feetemplateData) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        Template Data Not Found
      </Typography>
    );
  }
  const renderTemplateRow = (label, value) => {
    return (
      <>
        <Grid item xs={12} md={2} lg={1.5}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={4.5}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  const rowTotal = (uniformNumber) => {
    let total = 0;
    noOfYears.forEach((obj) => {
      total += uniqueFess[uniformNumber]
        .map((obj1) => obj1["sem" + obj.key])
        .reduce((a, b) => a + b);
    });
    return total;
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Fee Template"
              titleTypographyProps={{
                variant: "subtitle2",
              }}
              sx={{
                backgroundColor: "tableBg.main",
                color: "tableBg.textColor",
                textAlign: "center",
                padding: 1,
              }}
            />
            <CardContent>
              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                rowSpacing={1}
                columnSpacing={2}
              >
                {renderTemplateRow(
                  "Fee Template",
                  feetemplateData.fee_template_name
                )}
                {renderTemplateRow("Academic Year", feetemplateData.ac_year)}
                {renderTemplateRow(
                  "Paid At Board",
                  feetemplateData.Is_paid_at_board ? "Yes" : "No"
                )}
                {renderTemplateRow("School", feetemplateData.school_name_short)}
                {renderTemplateRow("Nationality", feetemplateData.nationality)}
                {renderTemplateRow(
                  "Is NRI",
                  feetemplateData.Is_nri ? "Yes" : "No"
                )}
                {renderTemplateRow(
                  "Program",
                  feetemplateData.program_short_name
                )}
                {renderTemplateRow(
                  "Program Specialization",
                  feetemplateData.program_specialization
                )}
                {renderTemplateRow(
                  "Currency",
                  feetemplateData.currency_type_name
                )}
                {renderTemplateRow(
                  "Fee Collection Pattern",
                  feetemplateData.program_type_name
                )}
                {renderTemplateRow(
                  " Admission Category",
                  feetemplateData.fee_admission_category_short_name
                )}
                {renderTemplateRow(
                  "Admission Sub Category",
                  feetemplateData.fee_admission_sub_category_name
                )}
              </Grid>

              <Grid item xs={12} mt={4}>
                <table className={classes.table}>
                  <thead>
                    <tr>
                      <th className={classes.th}>Particulars</th>
                      {feetemplateData.Is_paid_at_board ? (
                        <>
                          <th className={classes.th}>Alias Name</th>
                          <th className={classes.th}>Board</th>
                        </>
                      ) : (
                        <></>
                      )}

                      {noOfYears.map((val, i) => {
                        if (
                          feetemplateSubAmountData?.[0]?.[
                            "fee_year" + val.key + "_amt"
                          ] > 0
                        )
                          return (
                            <th className={classes.th} key={i}>
                              {val.value}
                            </th>
                          );
                      })}

                      <th className={classes.th}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feetemplateSubAmountData.length > 0 ? (
                      feetemplateSubAmountData.map((obj, i) => {
                        return (
                          <tr>
                            <td className={classes.td}>{obj.voucher_head}</td>
                            {feetemplateData.Is_paid_at_board ? (
                              <>
                                <td className={classes.td}>{obj.alias_name}</td>
                                <td className={classes.td}>
                                  {obj.board_unique_short_name}
                                </td>
                              </>
                            ) : (
                              <></>
                            )}

                            {noOfYears.map((v, j) => {
                              if (
                                feetemplateSubAmountData?.[i]?.[
                                  "fee_year" + v.key + "_amt"
                                ] > 0
                              )
                                return (
                                  <td className={classes.yearTd} key={j}>
                                    {obj["year" + v.key + "_amt"]}
                                  </td>
                                );
                            })}
                            <td className={classes.yearTd}>{obj.total_amt}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <></>
                    )}

                    <tr>
                      {feetemplateData.Is_paid_at_board ? (
                        <>
                          <th className={classes.th} colSpan={3}>
                            Total
                          </th>
                        </>
                      ) : (
                        <>
                          <th className={classes.th} colSpan={1}>
                            Total
                          </th>
                        </>
                      )}

                      {noOfYears.map((v, i) => {
                        if (
                          feetemplateSubAmountData?.[0]?.[
                            "fee_year" + v.key + "_amt"
                          ] > 0
                        )
                          return (
                            <td className={classes.td} key={i} align="right">
                              {feetemplateSubAmountData.length > 0 &&
                              feetemplateSubAmountData[0][
                                "fee_year" + v.key + "_amt"
                              ] > 0 ? (
                                feetemplateSubAmountData[0][
                                  "fee_year" + v.key + "_amt"
                                ]
                              ) : (
                                <></>
                              )}
                            </td>
                          );
                      })}

                      <td className={classes.yearTd}>
                        {feetemplateData.fee_year_total_amount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Grid>

              <Grid item xs={12} mt={4}>
                {uniformNumber.length > 0 &&
                feetemplateData.currency_type_name === "USD" ? (
                  <Typography variant="subtitle2" sx={{ textAlign: "right" }}>
                    Amount In INR (₹)
                  </Typography>
                ) : (
                  <></>
                )}

                {addOnFeeTable.length > 0 ? (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ textAlign: "center", marginTop: 2 }}
                    >
                      Add-On Programme Fee
                    </Typography>
                    <table className={classes.table}>
                      <thead>
                        <tr>
                          <th className={classes.th}>Particulars</th>
                          {noOfYears.map((val, i) => {
                            return (
                              <th className={classes.th} key={i}>
                                {val.value}
                              </th>
                            );
                          })}
                          <th className={classes.th}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addOnFeeTable.length > 0 ? (
                          <>
                            <tr>
                              <td className={classes.td}>
                                Add-on Programme Fee
                              </td>
                              {noOfYears.map((obj1, j) => {
                                return (
                                  <td className={classes.yearTd} key={j}>
                                    {addOnFeeTable[0]["sem" + obj1.key] ?? 0}
                                  </td>
                                );
                              })}
                              <td className={classes.yearTd}>
                                {addOnFeeTable[0]["total"]}
                              </td>
                            </tr>
                          </>
                        ) : (
                          <></>
                        )}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <></>
                )}

                {uniformTable.length > 0 ? (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ textAlign: "center", marginTop: 2 }}
                    >
                      Unifrom And Stationery Fee
                    </Typography>
                    <table className={classes.table}>
                      <thead>
                        <tr>
                          <th className={classes.th}>Particulars</th>
                          {noOfYears.map((val, i) => {
                            return (
                              <th className={classes.th} key={i}>
                                {val.value}
                              </th>
                            );
                          })}
                          <th className={classes.th}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addOnFeeTable.length > 0 ? (
                          <>
                            <tr>
                              <td className={classes.td}>
                                Unifrom And Stationery Fee
                              </td>
                              {noOfYears.map((obj1, j) => {
                                return (
                                  <td className={classes.yearTd} key={j}>
                                    {uniformTable[0]["sem" + obj1.key] ?? 0}
                                  </td>
                                );
                              })}
                              <td className={classes.yearTd}>
                                {uniformTable[0]["total"]}
                              </td>
                            </tr>
                          </>
                        ) : (
                          <></>
                        )}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <></>
                )}

                <Grid item xs={12} md={6} mt={2}>
                  <Typography variant="subtitle2">
                    Note : {feetemplateData.remarks}
                  </Typography>
                </Grid>
                <Grid item xs={12} align="right">
                  <Button
                    onClick={() => navigate(`/FeetemplatePdf/${id}`)}
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                  >
                    Print
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default FeetemplateNew;
