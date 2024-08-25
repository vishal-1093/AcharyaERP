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

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    borderCollapse: "collapse",
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

      setAddonData(addOnResponse);

      const allResponse = addOnResponse.data.map(
        (obj) => obj.uniform_number + "/" + obj.feetype
      );

      const uniqueItems = Array.from(
        new Map(allResponse.map((item) => [item, item])).values()
      );

      const newObject = {};

      uniqueItems.map((item) => {
        newObject[item] = addOnResponse.data.filter(
          (obj) => obj.uniform_number + "/" + obj.feetype === item
        );
      });

      setUniqueFees(newObject);
      setUniformNumber(uniqueItems);
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
                  "Fee Scheme",
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
                      feetemplateSubAmountData.map((obj) => {
                        return (
                          <tr>
                            <td className={classes.td}>{obj.voucher_head}</td>
                            {feetemplateData.Is_paid_at_board ? (
                              <>
                                <td className={classes.td}>{obj.alias_name}</td>
                                <td className={classes.td}>
                                  {obj.board_unique_name}
                                </td>
                              </>
                            ) : (
                              <></>
                            )}

                            {noOfYears.map((v, i) => {
                              return (
                                <td className={classes.yearTd} key={i}>
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
                        return (
                          <td className={classes.td} key={i} align="right">
                            {feetemplateSubAmountData.length > 0 ? (
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
                {uniformNumber.length > 0 ? (
                  <table className={classes.table}>
                    <thead>
                      <tr>
                        <th className={classes.th}>AUID Format</th>
                        <th className={classes.th}>Fee Type</th>

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
                      {uniformNumber.map((obj) => {
                        const splitUniformNumber = obj?.split("/");
                        return (
                          <tr>
                            <td className={classes.td}>
                              {splitUniformNumber[0]}
                            </td>
                            <td className={classes.td}>
                              {splitUniformNumber[1]}
                            </td>

                            {noOfYears.map((obj1, j) => {
                              return (
                                <td className={classes.yearTd} key={j}>
                                  {uniqueFess[obj].reduce((sum, value) => {
                                    return (
                                      Number(sum) +
                                      Number(value["sem" + obj1.key])
                                    );
                                  }, 0)}
                                </td>
                              );
                            })}

                            <td className={classes.yearTd}>{rowTotal(obj)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
