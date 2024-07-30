import { useState, useEffect, lazy } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "../../../services/Api";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Button, Grid, Box, Checkbox } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const FeeTemplateView = lazy(() =>
  import("../../../components/FeeTemplateView")
);

const initialValues = {
  voucherId: "",
  boardId: null,
  aliasId: null,
  feetempSubAmtId: null,
  voucherHead: "",
  boardName: "",
  aliasName: "",
  remarks: "",
  receiveForAllYear: false,
  years: [],
};

const styles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 40,
    maxWidth: "100%",
    margin: "40px 0",
  },
  tableBody: {
    height: 10,
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
  table: {
    "& .MuiTableCell-root": {
      minWidth: 100,
      border: "1px solid rgba(192,192,192,1)",
      fontSize: "15px",
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: "50px",
    },
  },
}));

const requiredFields = [];

function FeetemplateSubamount() {
  const [year, setYear] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [historyData, sethistoryData] = useState([]);
  const [values, setValues] = useState([initialValues]);
  const [templateData, setTemplateData] = useState([
    initialValues,
    initialValues,
  ]);
  const [voucherOptions, setVoucherOptions] = useState([]);
  const [boardOptions, setBoardOptions] = useState([]);
  const [aliasOptions, setAliasOptions] = useState([]);
  const [feetemplateDetails, setFeetemplateDetails] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [checkRowData, setCheckRowData] = useState([]);
  const [rowsValid, setRowsValid] = useState([]);

  const classes = styles();
  const { id, yearsemId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    const allRowsValid = templateData.every(
      (obj) => obj.voucherId && obj.aliasId
    );
    setRowsValid(allRowsValid);
  }, [templateData]);

  useEffect(() => {
    getFeetemplateDetail();
    if (
      pathname
        .toLowerCase()
        .includes(
          "/feetemplatemaster/feetemplatesubamount/" + id + "/" + yearsemId
        )
    ) {
      setIsNew(true);
      setCrumbs([{ name: "Feetemplate Master", link: "/FeetemplateMaster" }]);
    } else {
      getFeetemplateDetail();
      setIsNew(false);
      setCrumbs([
        { name: "Fee Template Master", link: "FeetemplateMaster" },
        { name: "Fee Template" },
        { name: "Update" },
      ]);
    }
  }, [pathname, isNew]);

  const checks = {};

  const fetchFeetemplateSubamount = async (years) => {
    await axios
      .get(`/api/finance/FetchFeeTemplateSubAmountDetail/${id}`)
      .then((res) => {
        const subAmountHistory = [];

        res.data.data.map((obj) => {
          const AllYears = [];
          years.forEach((obj1) => {
            AllYears.push({
              key: obj1.key,
              ["feeYear" + obj1.key]: obj["year" + obj1.key + "_amt"],
              value: obj1.value,
            });
          });

          subAmountHistory.push({
            remarks: obj.remarks,
            feetempSubAmtId: obj.fee_sub_amt_id,
            voucherHead: obj.voucher_head,
            boardName: obj.board_unique_name,
            aliasName: obj.alias_name,
            voucherId: obj.voucher_head_new_id,
            boardId: obj.board_unique_id,
            aliasId: obj.alias_id,
            receiveForAllYear: obj.receive_for_all_year,
            years: AllYears,
          });
        });

        setTemplateData(subAmountHistory);
        setValues(subAmountHistory);
        sethistoryData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getVoucherHeads = async () => {
    await axios
      .get(`/api/finance/FetchVoucherHeadBasedOnType`)
      .then((res) => {
        const data = [];
        res.data.data.VoucherHeadDetails.forEach((obj) => {
          data.push({
            value: obj.voucher_head_new_id,
            label: obj.voucher_head,
          });
        });
        setVoucherOptions(data);

        const alias = [];
        res.data.data.AliasDetails.forEach((obj) => {
          alias.push({
            value: obj.alias_id,
            label: obj.alias_name,
          });
        });
        setAliasOptions(alias);
      })
      .catch((err) => console.error(err));
  };

  const getAcademicProgram = async (data, acYearId, programId, schoollId) => {
    await axios
      .get(
        `/api/academic/FetchAcademicProgram/${acYearId}/${programId}/${schoollId}`
      )
      .then((res) => {
        const years = [];

        if (data.program_type_name.toLowerCase() === "yearly") {
          setYear(res.data.data[0].number_of_years);
          for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
            years.push({
              key: i,
              value: "Year" + "-" + i,
              ["feeYear" + i]: 0,
            });
          }
        } else if (data.program_type_name.toLowerCase() === "semester") {
          setYear(res.data.data[0].number_of_semester);
          for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
            years.push({
              key: i,
              value: "Sem" + "-" + i,
              ["feeYear" + i]: 0,
            });
          }
        }
        setNoOfYears(years);

        if (!isNew) {
          fetchFeetemplateSubamount(years);
        }

        if (isNew) {
          setTemplateData((prev) =>
            prev.map((obj) => ({ ...obj, years: years }))
          );
        }
      })
      .catch((err) => console.error(err));
  };

  const getAdmissionSubCategory = async (subCategoryId) => {
    await axios
      .get(`/api/student/fetchFeeAdmissionSubCategoryDetail/${subCategoryId}`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.board_unique_id,
            label: obj.board_unique_short_name,
          });
        });
        setBoardOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getFeetemplateDetail = async () => {
    await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${id}`)
      .then(async (res) => {
        const data = res.data.data[0];
        setFeetemplateDetails(res.data.data[0]);
        getAdmissionSubCategory(data.fee_admission_sub_category_id);
        getAcademicProgram(
          data,
          data.ac_year_id,
          data.program_id,
          data.school_id
        );
        getVoucherHeads();
      })
      .catch((err) => console.error(err));
  };

  const addRow = () => {
    const newRow = {
      voucherId: "",
      boardId: null,
      aliasId: null,
      feetempSubAmtId: null,
      voucherHead: "",
      boardName: "",
      aliasName: "",
      remarks: "",
      receiveForAllYear: false,
      years: noOfYears,
    };

    setTemplateData((prev) => [...prev, newRow]);
  };

  const deleteRow = () => {
    const filterUser = [...templateData];
    filterUser.pop();
    setTemplateData(filterUser);
  };

  // Function to calculate the sum for a specific property key
  const calculateSum = (propertyKey) => {
    return templateData?.reduce((total, obj) => {
      return (
        total +
        obj?.years?.reduce((sum, item) => {
          return sum + (Number(item[propertyKey]) || 0); // Sum up the specific property
        }, 0)
      );
    }, 0);
  };

  //   // Calculate sums for different cost keys
  const cost1Sum = calculateSum("feeYear1");
  const cost2Sum = calculateSum("feeYear2");
  const cost3Sum = calculateSum("feeYear3");
  const cost4Sum = calculateSum("feeYear4");
  const cost5Sum = calculateSum("feeYear5");
  const cost6Sum = calculateSum("feeYear6");
  const cost7Sum = calculateSum("feeYear7");
  const cost8Sum = calculateSum("feeYear8");
  const cost9Sum = calculateSum("feeYear9");
  const cost10Sum = calculateSum("feeYear10");
  const cost11Sum = calculateSum("feeYear11");
  const cost12Sum = calculateSum("feeYear12");

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleChangeAdvance = (name, newValue) => {
    const split = name.split("-");
    const index = parseInt(split[1]);
    const keyName = split[0];

    templateData.map((obj) => {
      if (index > 0 && obj.voucherId === newValue) {
        setAlertMessage({
          severity: "error",
          message: "Head is already selected",
        });
        setAlertOpen(true);
      }
    });

    if (keyName === "voucherId") {
      setTemplateData((prev) =>
        prev.map((obj, i) => {
          if (index === i)
            return { ...obj, [keyName]: newValue, ["aliasId"]: newValue };
          return obj;
        })
      );
    } else {
      setTemplateData((prev) =>
        prev.map((obj, i) => {
          if (index === i) return { ...obj, [keyName]: newValue };
          return obj;
        })
      );
    }
  };

  const handleChange = (e, index) => {
    if (e.target.name === "receiveForAllYear") {
      const { name, checked } = e.target;
      setTemplateData((prev) =>
        prev.map((obj, i) => {
          if (index === i) return { ...obj, [name]: checked };
          return obj;
        })
      );
    } else {
      setTemplateData((prev) =>
        prev.map((obj, i) => {
          if (index === i) return { ...obj, [e.target.name]: e.target.value };
          return obj;
        })
      );
    }
  };

  const handleChangeRow = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    if (checkRowData === 0) {
      setAlertMessage({
        severity: "error",
        message: "Row cannot be empty please delete",
      });
      setAlertOpen(true);
    } else {
      const payload = {};
      const arr = [];

      templateData.map((obj, i) => {
        const a = {
          active: true,
          voucher_head_new_id: obj.voucherId,
          board_unique_id: obj.boardId,
          fee_template_id: feetemplateDetails.fee_template_id,
          receive_for_all_year: obj.receiveForAllYear,
          alias_id: obj.aliasId,
          total_amt: templateData[i].years.reduce((sum, value) => {
            return Number(sum) + Number(value["feeYear" + value.key]);
          }, 0),
        };
        obj.years.forEach((obj1) => {
          a["year" + obj1.key + "_amt"] = obj1["feeYear" + obj1.key];
        });

        arr.push(a);
      });
      const ft = {
        active: true,
        ac_year_id: feetemplateDetails.ac_year_id,
        program_specialization: feetemplateDetails.program_specialization,
        currency_type_id: feetemplateDetails.currency_type_id,
        fee_admission_category_id: feetemplateDetails.fee_admission_category_id,
        fee_admission_sub_category_id:
          feetemplateDetails.fee_admission_sub_category_id,
        fee_template_id: feetemplateDetails.fee_template_id,
        is_nri: feetemplateDetails.Is_nri,
        is_paid_at_board: feetemplateDetails.Is_paid_at_board,
        nationality: feetemplateDetails.nationality,
        program_id: feetemplateDetails.program_id,
        program_specialization_id: feetemplateDetails.program_specialization_id,
        program_type_id: feetemplateDetails.program_type_id,
        remarks: feetemplateDetails.remarks,
        school_id: feetemplateDetails.school_id,
        approved_status: feetemplateDetails.approved_status,
        fee_year1_amt: cost1Sum,
        fee_year2_amt: cost2Sum,
        fee_year3_amt: cost3Sum,
        fee_year4_amt: cost4Sum,
        fee_year5_amt: cost5Sum,
        fee_year6_amt: cost6Sum,
        fee_year7_amt: cost7Sum,
        fee_year8_amt: cost8Sum,
        fee_year9_amt: cost9Sum,
        fee_year10_amt: cost10Sum,
        fee_year11_amt: cost11Sum,
        fee_year12_amt: cost12Sum,
        fee_year_total_amount:
          Number(cost1Sum) +
          Number(cost2Sum) +
          Number(cost3Sum) +
          Number(cost4Sum) +
          Number(cost5Sum) +
          Number(cost6Sum) +
          Number(cost7Sum) +
          Number(cost8Sum) +
          Number(cost9Sum) +
          Number(cost10Sum) +
          Number(cost11Sum) +
          Number(cost12Sum),
      };

      payload.ft = ft;
      payload.ftsa = arr;

      await axios
        .post(`/api/finance/FeeTemplateSubAmount1`, payload)
        .then((res) => {
          navigate("/FeetemplateMaster", { replace: true });
        })
        .catch((err) => console.error(err));
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill  required fields",
      });
      setAlertOpen(true);
    } else {
      const payload = {};
      const arrOne = [];

      const ft = {
        active: true,
        ac_year_id: feetemplateDetails.ac_year_id,
        program_specialization: feetemplateDetails.program_specialization,
        currency_type_id: feetemplateDetails.currency_type_id,
        fee_admission_category_id: feetemplateDetails.fee_admission_category_id,
        fee_admission_sub_category_id:
          feetemplateDetails.fee_admission_sub_category_id,
        fee_template_id: feetemplateDetails.fee_template_id,
        is_nri: feetemplateDetails.Is_nri,
        is_paid_at_board: feetemplateDetails.Is_paid_at_board,
        nationality: feetemplateDetails.nationality,
        program_id: feetemplateDetails.program_id,
        program_specialization_id: feetemplateDetails.program_specialization_id,
        program_type_id: feetemplateDetails.program_type_id,
        remarks: feetemplateDetails.remarks,
        school_id: feetemplateDetails.school_id,
        approved_status: feetemplateDetails.approved_status,
        fee_year1_amt: cost1Sum,
        fee_year2_amt: cost2Sum,
        fee_year3_amt: cost3Sum,
        fee_year4_amt: cost4Sum,
        fee_year5_amt: cost5Sum,
        fee_year6_amt: cost6Sum,
        fee_year7_amt: cost7Sum,
        fee_year8_amt: cost8Sum,
        fee_year9_amt: cost9Sum,
        fee_year10_amt: cost10Sum,
        fee_year11_amt: cost11Sum,
        fee_year12_amt: cost12Sum,
        fee_year_total_amount:
          Number(cost1Sum) +
          Number(cost2Sum) +
          Number(cost3Sum) +
          Number(cost4Sum) +
          Number(cost5Sum) +
          Number(cost6Sum) +
          Number(cost7Sum) +
          Number(cost8Sum) +
          Number(cost9Sum) +
          Number(cost10Sum) +
          Number(cost11Sum) +
          Number(cost12Sum),
      };

      const fth = {
        is_paid_at_board: feetemplateDetails.Is_paid_at_board,
        is_nri: feetemplateDetails.Is_nri,
        nationality: feetemplateDetails.nationality,
        program_id: feetemplateDetails.program_id,
        program_specialization: feetemplateDetails.program_specialization,
        program_specialization_id: feetemplateDetails.program_specialization_id,
        program_type_id: feetemplateDetails.program_type_id,
        remarks: feetemplateDetails.remarks,
        school_id: feetemplateDetails.school_id,
        ac_year_id: feetemplateDetails.ac_year_id,
        currency_type_id: feetemplateDetails.currency_type_id,
        fee_admission_category_id: feetemplateDetails.fee_admission_category_id,
        fee_admission_sub_category_id:
          feetemplateDetails.fee_admission_sub_category_id,
        fee_template_id: feetemplateDetails.fee_template_id,
        approved_status: feetemplateDetails.approved_status,
        active: true,
        fee_year1_amt: feetemplateDetails.fee_year1_amt,
        fee_year2_amt: feetemplateDetails.fee_year2_amt,
        fee_year3_amt: feetemplateDetails.fee_year3_amt,
        fee_year4_amt: feetemplateDetails.fee_year4_amt,
        fee_year5_amt: feetemplateDetails.fee_year5_amt,
        fee_year6_amt: feetemplateDetails.fee_year6_amt,
        fee_year7_amt: feetemplateDetails.fee_year7_amt,
        fee_year8_amt: feetemplateDetails.fee_year8_amt,
        fee_year9_amt: feetemplateDetails.fee_year9_amt,
        fee_year10_amt: feetemplateDetails.fee_year10_amt,
        fee_year11_amt: feetemplateDetails.fee_year11_amt,
        fee_year12_amt: feetemplateDetails.fee_year12_amt,
        fee_year_total_amount: feetemplateDetails.fee_year_total_amount,
      };

      const arr = [];

      templateData.map((obj, i) => {
        const a = {
          active: true,
          voucher_head_new_id: obj.voucherId,
          board_unique_id: obj.boardId,
          fee_template_id: feetemplateDetails.fee_template_id,
          receive_for_all_year: obj.receiveForAllYear,
          alias_id: obj.aliasId,
          total_amt: templateData[i].years.reduce((sum, value) => {
            return Number(sum) + Number(value["feeYear" + value.key]);
          }, 0),
        };
        obj.years.forEach((obj1) => {
          a["year" + obj1.key + "_amt"] = obj1["feeYear" + obj1.key];
        });

        arr.push(a);
      });

      historyData.map((obj, i) => {
        arrOne.push({
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
          fee_template_id: feetemplateDetails.fee_template_id,
          fee_sub_amt_his_id: obj.fee_sub_amt_his_id,
          alias_name: obj.alias_name,
          fee_sub_amt_id: obj.fee_sub_amt_id,
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
      payload.ftsah = arrOne;

      await axios
        .put(`/api/finance/EditFeeTemplateSubAmount/${id}`, payload)
        .then((res) => {
          navigate("/FeetemplateMaster", { replace: true });
        })
        .catch((err) => console.error(err));
    }
  };

  const handleYears = (e, i, js) => {
    setTemplateData((prev) =>
      prev.map((obj, index) =>
        index === i
          ? {
              ...obj,
              years: obj.years.map((obj1, jindex) => {
                if (jindex === js)
                  return { ...obj1, [e.target.name]: e.target.value };
                return obj1;
              }),
            }
          : obj
      )
    );
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FeeTemplateView type={1} feeTemplateId={id} />
        <Grid container>
          <Grid item xs={12} md={12}>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table
                size="small"
                aria-label="simple table"
                style={{ width: "115%" }}
              >
                <TableHead className={classes.bg}>
                  <TableRow>
                    <TableCell
                      sx={{ width: 140, color: "white" }}
                      align="center"
                    >
                      Fee Heads
                    </TableCell>
                    <TableCell
                      sx={{ width: 100, color: "white" }}
                      align="center"
                    >
                      Alias Name
                    </TableCell>
                    {feetemplateDetails.Is_paid_at_board ? (
                      <TableCell
                        sx={{ width: 100, color: "white" }}
                        align="center"
                      >
                        Board
                      </TableCell>
                    ) : (
                      <></>
                    )}

                    {feetemplateDetails.Is_paid_at_board === true ? (
                      <TableCell sx={{ width: 2, color: "white" }}>
                        All Sems
                      </TableCell>
                    ) : (
                      <></>
                    )}

                    {noOfYears.length > 0
                      ? noOfYears.map((obj, i) => {
                          if (obj.key >= yearsemId)
                            return (
                              <TableCell
                                key={i}
                                sx={{ width: 100, color: "white" }}
                              >
                                {obj.value}
                              </TableCell>
                            );
                        })
                      : ""}
                    <TableCell sx={{ width: 100, color: "white" }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templateData.map((obj, i) => {
                    return (
                      <TableRow>
                        <TableCell>
                          <CustomAutocomplete
                            name={"voucherId" + "-" + i}
                            label=""
                            value={obj.voucherId}
                            handleChangeAdvance={handleChangeAdvance}
                            options={voucherOptions}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomAutocomplete
                            name={`aliasId` + "-" + i}
                            label=""
                            value={obj.aliasId}
                            handleChangeAdvance={handleChangeAdvance}
                            options={aliasOptions}
                          />
                        </TableCell>
                        {feetemplateDetails.Is_paid_at_board ? (
                          <>
                            <TableCell>
                              <CustomAutocomplete
                                name={`boardId` + "-" + i}
                                label=""
                                value={obj.boardId}
                                handleChangeAdvance={handleChangeAdvance}
                                options={boardOptions}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}

                        {feetemplateDetails.Is_paid_at_board ? (
                          <TableCell>
                            <Checkbox
                              name="receiveForAllYear"
                              value={obj.receiveForAllYear || ""}
                              onChange={(e) => handleChange(e, i)}
                              checked={obj.receiveForAllYear}
                            />
                          </TableCell>
                        ) : (
                          <></>
                        )}
                        {historyData.receiveForAllYear ? (
                          <TableCell>
                            <Checkbox
                              name="receiveForAllYear"
                              value={obj.receiveForAllYear}
                              onChange={(e) => handleChange(e, i)}
                            />
                          </TableCell>
                        ) : (
                          <></>
                        )}

                        {templateData[i].years.map((obj1, j) => {
                          const year = j + 1;
                          if (obj1.key >= yearsemId)
                            return (
                              <>
                                <TableCell>
                                  <CustomTextField
                                    name={"feeYear" + year}
                                    value={
                                      templateData[i].years[j][
                                        "feeYear" + obj1.key
                                      ]
                                    }
                                    handleChange={(e) => handleYears(e, i, j)}
                                  />
                                </TableCell>
                              </>
                            );
                        })}

                        <TableCell>
                          {templateData[i].years.reduce((sum, value) => {
                            return (
                              Number(sum) + Number(value["feeYear" + value.key])
                            );
                          }, 0)}
                        </TableCell>
                        {/* {templateData.map((obj))} */}
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableHead>
                  <TableRow>
                    {feetemplateDetails.Is_paid_at_board ? (
                      <TableCell sx={{ textAlign: "center" }} colSpan={4}>
                        Total
                      </TableCell>
                    ) : (
                      <TableCell colSpan={2}>Total</TableCell>
                    )}

                    {templateData[0]?.years?.map((obj, i) => {
                      if (obj.key >= yearsemId)
                        return (
                          <TableCell key={i}>
                            <CustomTextField
                              name={"yearTotal" + obj.key}
                              label=""
                              value={calculateSum("feeYear" + obj.key)}
                              handleChange={handleChangeRow}
                            />
                          </TableCell>
                        );
                    })}

                    <TableCell>
                      {Number(cost1Sum) +
                        Number(cost2Sum) +
                        Number(cost3Sum) +
                        Number(cost4Sum) +
                        Number(cost5Sum) +
                        Number(cost6Sum) +
                        Number(cost7Sum) +
                        Number(cost8Sum) +
                        Number(cost9Sum) +
                        Number(cost10Sum) +
                        Number(cost11Sum) +
                        Number(cost12Sum)}
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              color="success"
              sx={{
                borderRadius: 2,
              }}
              onClick={addRow}
            >
              <AddIcon />
            </Button>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
              }}
              onClick={deleteRow}
            >
              <RemoveIcon />
            </Button>
          </Grid>
          <Grid item xs={12} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={isNew ? handleCreate : handleUpdate}
              disabled={!rowsValid}
            >
              <strong>{isNew ? "Create" : "Update"}</strong>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
export default FeetemplateSubamount;
