import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";

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

function ApproveTemplate({
  id,
  setApproveTemplateOpen,
  reload,
  approveTemplateOpen,
}) {
  const [feetemplateData, setFeeTemplateData] = useState({});
  const [feetemplateSubAmountData, setFeetemplateSubAmountData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addOnFeeTable, setAddonFeeTable] = useState([]);
  const [uniformTable, setUniformTable] = useState([]);
  const [allSpecializations, setAllSpecilizations] = useState([]);

  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const status = location?.state?.status;
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

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

      const addonRes = await axios.get(
        `/api/otherFeeDetails/getOtherFeeDetailsData1?fee_template_id=${id}`
      );

      setAddonFeeTable(addonRes.data);

      const uniformResponse = await axios.get(
        `/api/otherFeeDetails/getOtherFeeDetailsData?schoolId=${templateResponse.data.data[0].school_id}&acYearId=${templateResponse.data.data[0].ac_year_id}&programId=${templateResponse.data.data[0].program_id}&programSpecializationId=${templateResponse.data.data[0].program_specialization_id}`
      );

      const uniqueSpecializations = [
        ...new Set(
          uniformResponse.data.map(
            (program) => program.program_specialization_short_name
          )
        ),
      ];

      setAllSpecilizations(uniqueSpecializations);

      const newObject = {};

      uniqueSpecializations.forEach((obj, i) => {
        uniformResponse.data.forEach((obj1) => {
          newObject[obj] = uniformResponse.data.filter(
            (test) =>
              test.program_specialization_short_name ===
              uniqueSpecializations[i]
          );
        });
      });

      const result = {};
      uniqueSpecializations.forEach((spec) => {
        const total = calculateSemesterTotals(newObject[spec]);
        result[spec] = [
          {
            sem1: total.sem1,
            sem2: total.sem2,
            sem3: total.sem3,
            sem4: total.sem4,
            sem5: total.sem5,
            sem6: total.sem6,
            sem7: total.sem7,
            sem8: total.sem8,
            sem9: total.sem9,
            sem10: total.sem10,
            sem11: total.sem11,
            sem12: total.sem12,
          },
        ];
      });

      setUniformTable(result);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student details. Please try again later.");
    } finally {
      setLoading(false);
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

  const totalSum = addOnFeeTable.reduce((total, program) => {
    return (
      total +
      noOfYears.reduce((sum, sem) => {
        return sum + (program[`sem${sem.key}`] || 0);
      }, 0)
    );
  }, 0);

  const handleUpdate = async () => {
    setButtonLoading(true);
    const payload = {};

    const ft = {
      active: true,
      ac_year_id: feetemplateData.ac_year_id,
      program_specialization: feetemplateData.program_specialization,
      currency_type_id: feetemplateData.currency_type_id,
      fee_admission_category_id: feetemplateData.fee_admission_category_id,
      fee_admission_sub_category_id:
        feetemplateData.fee_admission_sub_category_id,
      fee_template_id: feetemplateData.fee_template_id,
      is_nri: feetemplateData.Is_nri,
      is_paid_at_board: feetemplateData.Is_paid_at_board,
      nationality: feetemplateData.nationality,
      program_id: feetemplateData.program_id,
      program_specialization_id: feetemplateData.program_specialization_id,
      program_type_id: feetemplateData.program_type_id,
      remarks: feetemplateData.remarks,
      school_id: feetemplateData.school_id,
      approved_status: true,
      fee_year1_amt: feetemplateData.fee_year1_amt,
      fee_year2_amt: feetemplateData.fee_year2_amt,
      fee_year3_amt: feetemplateData.fee_year3_amt,
      fee_year4_amt: feetemplateData.fee_year4_amt,
      fee_year5_amt: feetemplateData.fee_year5_amt,
      fee_year6_amt: feetemplateData.fee_year6_amt,
      fee_year7_amt: feetemplateData.fee_year7_amt,
      fee_year8_amt: feetemplateData.fee_year8_amt,
      fee_year9_amt: feetemplateData.fee_year9_amt,
      fee_year10_amt: feetemplateData.fee_year10_amt,
      fee_year11_amt: feetemplateData.fee_year11_amt,
      fee_year12_amt: feetemplateData.fee_year12_amt,
      fee_year_total_amount: feetemplateData.fee_year_total_amount,
    };

    const fth = {
      is_paid_at_board: feetemplateData.Is_paid_at_board,
      is_nri: feetemplateData.Is_nri,
      nationality: feetemplateData.nationality,
      program_id: feetemplateData.program_id,
      program_specialization: feetemplateData.program_specialization,
      program_specialization_id: feetemplateData.program_specialization_id,
      program_type_id: feetemplateData.program_type_id,
      remarks: feetemplateData.remarks,
      school_id: feetemplateData.school_id,
      ac_year_id: feetemplateData.ac_year_id,
      currency_type_id: feetemplateData.currency_type_id,
      fee_admission_category_id: feetemplateData.fee_admission_category_id,
      fee_admission_sub_category_id:
        feetemplateData.fee_admission_sub_category_id,
      fee_template_id: feetemplateData.fee_template_id,
      approved_status: feetemplateData.approved_status,
      active: true,
      fee_year1_amt: feetemplateData.fee_year1_amt,
      fee_year2_amt: feetemplateData.fee_year2_amt,
      fee_year3_amt: feetemplateData.fee_year3_amt,
      fee_year4_amt: feetemplateData.fee_year4_amt,
      fee_year5_amt: feetemplateData.fee_year5_amt,
      fee_year6_amt: feetemplateData.fee_year6_amt,
      fee_year7_amt: feetemplateData.fee_year7_amt,
      fee_year8_amt: feetemplateData.fee_year8_amt,
      fee_year9_amt: feetemplateData.fee_year9_amt,
      fee_year10_amt: feetemplateData.fee_year10_amt,
      fee_year11_amt: feetemplateData.fee_year11_amt,
      fee_year12_amt: feetemplateData.fee_year12_amt,
      fee_year_total_amount: feetemplateData.fee_year_total_amount,
    };

    const arr = [];

    feetemplateSubAmountData.map((obj, i) => {
      arr.push({
        active: true,
        voucher_head_new_id: obj.voucher_head_new_id,
        voucher_head_id: obj.voucher_head_id,
        board_unique_id: obj.board_unique_id,
        alias_id: obj.alias_id,
        created_by: obj.created_by,
        created_date: obj.created_date,
        created_username: obj.created_username,
        receive_for_all_year: obj.receive_for_all_year,
        modified_by: 0,
        modified_date: obj.modified_date,
        voucher_head: obj.voucher_head,
        board_unique_name: obj.board_unique_name,
        fee_template_id: feetemplateData.fee_template_id,
        fee_sub_amt_his_id: obj.fee_sub_amt_his_id,
        alias_name: obj.alias_name,
        fee_sub_amt_id: obj.fee_sub_amt_id,
        fee_year1_amt: obj.fee_year1_amt,
        fee_year2_amt: obj.fee_year2_amt,
        fee_year3_amt: obj.fee_year3_amt,
        fee_year4_amt: obj.fee_year4_amt,
        fee_year5_amt: obj.fee_year5_amt,
        fee_year6_amt: obj.fee_year6_amt,
        fee_year7_amt: obj.fee_year7_amt,
        fee_year8_amt: obj.fee_year8_amt,
        fee_year9_amt: obj.fee_year9_amt,
        fee_year10_amt: obj.fee_year10_amt,
        fee_year11_amt: obj.fee_year11_amt,
        fee_year12_amt: obj.fee_year12_amt,
        fee_year_total_amount: obj.fee_year_total_amount,
        year1_amt: obj.year1_amt,
        year2_amt: obj.year2_amt,
        year3_amt: obj.year3_amt,
        year4_amt: obj.year4_amt,
        year5_amt: obj.year5_amt,
        year6_amt: obj.year6_amt,
        year7_amt: obj.year7_amt,
        year8_amt: obj.year8_amt,
        year9_amt: obj.year9_amt,
        year10_amt: obj.year10_amt,
        year11_amt: obj.year11_amt,
        year12_amt: obj.year12_amt,
        remarks: obj.remarks,
        total_amt:
          Number(obj.year1_amt) +
          Number(obj.year2_amt) +
          Number(obj.year3_amt) +
          Number(obj.year4_amt) +
          Number(obj.year5_amt) +
          Number(obj.year6_amt) +
          Number(obj.year7_amt) +
          Number(obj.year8_amt) +
          Number(obj.year9_amt) +
          Number(obj.year10_amt) +
          Number(obj.year11_amt) +
          Number(obj.year12_amt),
      });
    });

    payload.ft = ft;
    payload.fth = fth;
    payload.ftsa = arr;
    payload.ftsah = arr;

    await axios
      .put(`/api/finance/approveFeeTemplateSubAmount/${id}`, payload)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Approved Successfully",
          });
          setAlertOpen(true);
          navigate("/FeetemplateApprovalIndex", { replace: true });
          setApproveTemplateOpen(false);
          reload();
          setButtonLoading(false);
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
          setAlertOpen(true);
          setApproveTemplateOpen(false);
          setButtonLoading(false);
        }
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error,
        });
        setAlertOpen(true);
        setApproveTemplateOpen(false);
        setButtonLoading(false);
      });
  };

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

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Approve Fee Template"
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
                          ] > 0 &&
                          feetemplateData.program_type_name.toLowerCase() ===
                            "yearly"
                        ) {
                          return (
                            <th className={classes.th} key={i}>
                              {val.value}
                            </th>
                          );
                        } else {
                          return (
                            <th className={classes.th} key={i}>
                              {val.value}
                            </th>
                          );
                        }
                      })}

                      <th className={classes.th}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feetemplateSubAmountData.length > 0 ? (
                      feetemplateSubAmountData.map((obj, i) => {
                        return (
                          <tr key={i}>
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
                                ] > 0 &&
                                feetemplateData.program_type_name === "Yearly"
                              ) {
                                return (
                                  <td className={classes.yearTd} key={j}>
                                    {obj["year" + v.key + "_amt"]}
                                  </td>
                                );
                              } else {
                                return (
                                  <td className={classes.yearTd} key={j}>
                                    {obj["year" + v.key + "_amt"]}
                                  </td>
                                );
                              }
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
                          ] > 0 &&
                          feetemplateData.program_type_name === "Yearly"
                        ) {
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
                        } else {
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
                        }
                      })}

                      <td className={classes.yearTd}>
                        {feetemplateData.fee_year_total_amount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Grid>

              <Grid item xs={12} mt={4}>
                {addOnFeeTable.length > 0 &&
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
                                    {addOnFeeTable.reduce((sum, program) => {
                                      return (
                                        sum + (program[`sem${obj1.key}`] || 0)
                                      );
                                    }, 0)}
                                  </td>
                                );
                              })}
                              <td className={classes.yearTd}>{totalSum}</td>
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

                {allSpecializations.length > 0 && mainResponse.isEqual ? (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ textAlign: "center", marginTop: 2 }}
                    >
                      Uniform And Stationery Fee
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
                        {allSpecializations.length === 1 ? (
                          allSpecializations.map((obj, i) => {
                            return (
                              <>
                                <tr key={i}>
                                  <td className={classes.td}>
                                    Uniform And Stationery Fee - {obj}
                                  </td>

                                  {noOfYears.map((obj1, j) => {
                                    return (
                                      <td className={classes.yearTd} key={j}>
                                        {mainResponse?.[obj]?.[0]?.[
                                          "sem" + obj1.key
                                        ] ?? 0}
                                      </td>
                                    );
                                  })}
                                  <td className={classes.yearTd}>
                                    {Object.values(
                                      mainResponse?.[obj]?.[0]
                                    )?.reduce(
                                      (total, sum) =>
                                        Number(total) + Number(sum),
                                      0
                                    )}
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        ) : (
                          <>
                            <tr>
                              <td className={classes.td}>
                                Uniform And Stationery Fee -{" "}
                                {allSpecializations.join(",")}
                              </td>
                              {noOfYears.map((obj1, j) => {
                                return (
                                  <td className={classes.yearTd} key={j}>
                                    {mainResponse?.[
                                      allSpecializations.join(",")
                                    ]?.[0]?.["sem" + obj1.key] ?? 0}
                                  </td>
                                );
                              })}
                              <td className={classes.yearTd}>
                                {Object.values(
                                  mainResponse?.[
                                    allSpecializations.join(",")
                                  ]?.[0]
                                )?.reduce(
                                  (total, sum) => Number(total) + Number(sum),
                                  0
                                )}
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <>
                    {allSpecializations.length > 0 ? (
                      <>
                        <Typography
                          variant="h6"
                          sx={{ textAlign: "center", marginTop: 2 }}
                        >
                          Uniform And Stationery Fee
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
                            {allSpecializations.map((spec, i) => {
                              return (
                                <>
                                  <tr key={i}>
                                    <td className={classes.td}>
                                      Uniform And Stationery Fee - {spec}
                                    </td>
                                    {noOfYears.map((obj1, j) => {
                                      return (
                                        <td className={classes.yearTd} key={j}>
                                          {mainResponse?.data?.[spec]?.[0]?.[
                                            "sem" + obj1.key
                                          ] ?? 0}
                                        </td>
                                      );
                                    })}
                                    <td className={classes.yearTd}>
                                      {Object.values(
                                        mainResponse?.data?.[spec]?.[0]
                                      ).reduce(
                                        (total, sum) =>
                                          Number(total) + Number(sum),
                                        0
                                      )}
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}

                <Grid item xs={12} md={6} mt={2}>
                  <Typography variant="subtitle2">
                    Note : {feetemplateData.remarks}
                  </Typography>
                </Grid>
                <Grid item xs={12} align="right">
                  <Button
                    onClick={handleUpdate}
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                    disabled={buttonLoading}
                  >
                    {buttonLoading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      <strong>{"Approve"}</strong>
                    )}
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

export default ApproveTemplate;
