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
  feeYearOne: 0,
  feeYearTwo: 0,
  feeYearThree: 0,
  feeYearFour: 0,
  feeYearFive: 0,
  feeYearSix: 0,
  feeYearSeven: 0,
  feeYearEight: 0,
  feeYearNine: 0,
  feeYearTen: 0,
  feeYearEleven: 0,
  feeYearTwelve: 0,
  remarks: "",
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
  const [values, setValues] = useState([
    initialValues,
    initialValues,
    initialValues,
    initialValues,
    initialValues,
    initialValues,
  ]);
  const [voucherOptions, setVoucherOptions] = useState([]);
  const [boardOptions, setBoardOptions] = useState([]);
  const [aliasOptions, setAliasOptions] = useState([]);
  const [feetemplateDetails, setFeetemplateDetails] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [lastRow, setLastRow] = useState({
    yearOneTotal: 0,
    yearTwoTotal: 0,
    yearThreeTotal: 0,
    yearFourTotal: 0,
    yearFiveTotal: 0,
    yearSixTotal: 0,
    yearSevenTotal: 0,
    yearEightTotal: 0,
    yearNineTotal: 0,
    yearTenTotal: 0,
    yearElevenTotal: 0,
    yearTwelveTotal: 0,
    yearTotalAmount: 0,
  });
  const [checkRowData, setCheckRowData] = useState([]);
  const [rowsValid, setRowsValid] = useState([]);

  const classes = styles();
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    const allRowsValid = values.every((obj) => obj.voucherId && obj.aliasId);

    setRowsValid(allRowsValid);
  }, [values]);

  useEffect(() => {
    Add();
    lastColumnTotal();
    values.map((obj) => {
      setCheckRowData(
        Number(obj.feeYearOne) +
          Number(obj.feeYearTwo) +
          Number(obj.feeYearThree) +
          Number(obj.feeYearFour) +
          Number(obj.feeYearFive) +
          Number(obj.feeYearSix) +
          Number(obj.feeYearSeven) +
          Number(obj.feeYearEight) +
          Number(obj.feeYearNine) +
          Number(obj.feeYearTen) +
          Number(obj.feeYearEleven) +
          Number(obj.feeYearTwelve)
      );
    });
  }, [values]);

  useEffect(() => {
    getFeetemplateDetail();
    if (pathname.toLowerCase().includes("/feetemplatesubamount/" + id)) {
      setIsNew(true);
    } else if (
      pathname
        .toLowerCase()
        .includes("/feetemplatemaster/editfeetemplatesubamount/" + id + "/1")
    ) {
      setIsNew(false);

      fetchFeetemplateSubamount();
      setCrumbs([
        { name: "Feetemplate Master", link: "FeetemplateMaster" },
        { name: "Edit Feetemplate Sub Amount" },
      ]);
    } else {
      setIsNew(false);
      fetchFeetemplateSubamount();
      setCrumbs([
        {
          name: "Feetemplate Approval Index",
          link: "FeetemplateApprovalIndex",
        },
        { name: "Feetemplate Approval" },
      ]);
    }
  }, [values.voucherId]);

  const checks = {};

  const errorMessages = {};

  const fetchFeetemplateSubamount = async () => {
    await axios
      .get(`/api/finance/FetchFeeTemplateSubAmountDetail/${id}`)
      .then((res) => {
        const subAmountHistory = [];
        for (let i = 0; i < res.data.data.length; i++) {
          subAmountHistory.push({
            remarks: res.data.data[i].remarks,
            feetempSubAmtId: res.data.data[i].fee_sub_amt_id,
            voucherHead: res.data.data[i].voucher_head,
            boardName: res.data.data[i].board_unique_name,
            aliasName: res.data.data[i].alias_name,
            voucherId: res.data.data[i].voucher_head_new_id,
            boardId: res.data.data[i].board_unique_id,
            aliasId: res.data.data[i].alias_id,
            feeYearOne: res.data.data[i].year1_amt,
            feeYearTwo: res.data.data[i].year2_amt,
            feeYearThree: res.data.data[i].year3_amt,
            feeYearFour: res.data.data[i].year4_amt,
            feeYearFive: res.data.data[i].year5_amt,
            feeYearSix: res.data.data[i].year6_amt,
            feeYearSeven: res.data.data[i].year7_amt,
            feeYearEight: res.data.data[i].year8_amt,
            feeYearNine: res.data.data[i].year9_amt,
            feeYearTen: res.data.data[i].year10_amt,
            feeYearEleven: res.data.data[i].year11_amt,
            feeYearTwelve: res.data.data[i].year12_amt,
            receiveForAllYear: res.data.data[i].receive_for_all_year,
          });
        }
        setValues(subAmountHistory);
        sethistoryData(subAmountHistory);
      })
      .catch((err) => console.error(err));
  };

  const getFeetemplateDetail = async () => {
    await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${id}`)
      .then((res) => {
        const test = res.data.data[0];

        setFeetemplateDetails(res.data.data[0]);
        axios
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
        axios
          .get(
            `/api/academic/FetchAcademicProgram/${res.data.data[0].ac_year_id}/${res.data.data[0].program_id}/${res.data.data[0].school_id}`
          )
          .then((res) => {
            const years = [];

            if (test.program_type_name.toLowerCase() === "yearly") {
              setYear(res.data.data[0].number_of_years);
              for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
                years.push({ key: i, value: "Year" + i });
              }
            } else if (test.program_type_name.toLowerCase() === "semester") {
              setYear(res.data.data[0].number_of_semester);
              for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
                years.push({ key: i, value: "Sem" + i });
              }
            }
            setNoOfYears(years);
          })
          .catch((err) => console.error(err));
        axios
          .get(
            `/api/student/fetchFeeAdmissionSubCategoryDetail/${res.data.data[0].fee_admission_sub_category_id}`
          )
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
      })
      .catch((err) => console.error(err));
  };

  const addRow = () => {
    setValues((prev) => [...prev, initialValues]);
  };

  const deleteRow = () => {
    const filterUser = [...values];
    filterUser.pop();
    setValues(filterUser);
  };

  function Add() {
    setLastRow((prev) => {
      return {
        ...prev,
        yearOneTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearOne);
        }, 0),
        yearTwoTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearTwo);
        }, 0),
        yearThreeTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearThree);
        }, 0),
        yearFourTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearFour);
        }, 0),
        yearFiveTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearFive);
        }, 0),
        yearSixTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearSix);
        }, 0),
        yearSevenTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearSeven);
        }, 0),
        yearEightTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearEight);
        }, 0),
        yearNineTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearNine);
        }, 0),
        yearTenTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearTen);
        }, 0),
        yearElevenTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearEleven);
        }, 0),
        yearTwelveTotal: values.reduce((total, obj) => {
          return total + Number(obj.feeYearTwelve);
        }, 0),
      };
    });
  }

  function lastColumnTotal() {
    setLastRow((prev) => {
      return {
        ...prev,
        yearTotalAmount: values.reduce((total, obj) => {
          return (
            total +
            Number(obj.feeYearOne) +
            Number(obj.feeYearTwo) +
            Number(obj.feeYearThree) +
            Number(obj.feeYearFour) +
            Number(obj.feeYearFive) +
            Number(obj.feeYearSix) +
            Number(obj.feeYearSeven) +
            Number(obj.feeYearEight) +
            Number(obj.feeYearNine) +
            Number(obj.feeYearTen) +
            Number(obj.feeYearEleven) +
            Number(obj.feeYearTwelve)
          );
        }, 0),
      };
    });
  }
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

    values.map((obj) => {
      if (index > 0 && obj.voucherId === newValue) {
        setAlertMessage({
          severity: "error",
          message: "Head is already selected",
        });
        setAlertOpen(true);
      }
    });

    if (keyName === "voucherId") {
      setValues((prev) =>
        prev.map((obj, i) => {
          if (index === i)
            return { ...obj, [keyName]: newValue, ["aliasId"]: newValue };
          return obj;
        })
      );
    } else {
      setValues((prev) =>
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
      setValues((prev) =>
        prev.map((obj, i) => {
          if (index === i) return { ...obj, [name]: checked };
          return obj;
        })
      );
    } else {
      setValues((prev) =>
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      if (checkRowData === 0) {
        setAlertMessage({
          severity: "error",
          message: "Row cannot be empty please delete",
        });
        setAlertOpen(true);
      } else if (checkRowData > 0) {
        const ft = {};
        const ftsa = [];
        const ftsah = [];
        const arr = [];
        const temp = {};
        ft.is_paid_at_board = feetemplateDetails.Is_paid_at_board;
        ft.is_nri = feetemplateDetails.Is_nri;
        ft.nationality = feetemplateDetails.nationality;
        ft.program_id = feetemplateDetails.program_id;
        ft.program_specialization = feetemplateDetails.program_specialization;
        ft.program_specialization_id =
          feetemplateDetails.program_specialization_id;
        ft.program_type_id = feetemplateDetails.program_type_id;
        ft.remarks = feetemplateDetails.remarks;
        ft.school_id = feetemplateDetails.school_id;
        ft.ac_year_id = feetemplateDetails.ac_year_id;
        ft.currency_type_id = feetemplateDetails.currency_type_id;
        ft.fee_admission_category_id =
          feetemplateDetails.fee_admission_category_id;
        ft.fee_admission_sub_category_id =
          feetemplateDetails.fee_admission_sub_category_id;
        ft.fee_template_id = feetemplateDetails.fee_template_id;
        ft.approved_status = feetemplateDetails.approved_status;
        ft.active = true;
        ft.fee_year1_amt = lastRow.yearOneTotal;
        ft.fee_year2_amt = lastRow.yearTwoTotal;
        ft.fee_year3_amt = lastRow.yearThreeTotal;
        ft.fee_year4_amt = lastRow.yearFourTotal;
        ft.fee_year5_amt = lastRow.yearFiveTotal;
        ft.fee_year6_amt = lastRow.yearSixTotal;
        ft.fee_year7_amt = lastRow.yearSevenTotal;
        ft.fee_year8_amt = lastRow.yearEightTotal;
        ft.fee_year9_amt = lastRow.yearNineTotal;
        ft.fee_year10_amt = lastRow.yearTenTotal;
        ft.fee_year11_amt = lastRow.yearElevenTotal;
        ft.fee_year12_amt = lastRow.yearTwelveTotal;
        ft.fee_year_total_amount = lastRow.yearTotalAmount;

        values.map((obj, i) => {
          arr.push({
            active: true,
            voucher_head_new_id: obj.voucherId,
            board_unique_id: obj.boardId,
            fee_template_id: feetemplateDetails.fee_template_id,
            receive_for_all_year: obj.receiveForAllYear,
            alias_id: obj.aliasId,
            year1_amt: obj.feeYearOne,
            year2_amt: obj.feeYearTwo,
            year3_amt: obj.feeYearThree,
            year4_amt: obj.feeYearFour,
            year5_amt: obj.feeYearFive,
            year6_amt: obj.feeYearSix,
            year7_amt: obj.feeYearSeven,
            year8_amt: obj.feeYearEight,
            year9_amt: obj.feeYearNine,
            year10_amt: obj.feeYearTen,
            year11_amt: obj.feeYearEleven,
            year12_amt: obj.feeYearTwelve,
            total_amt:
              Number(obj.feeYearOne) +
              Number(obj.feeYearTwo) +
              Number(obj.feeYearThree) +
              Number(obj.feeYearFour) +
              Number(obj.feeYearFive) +
              Number(obj.feeYearSix) +
              Number(obj.feeYearSeven) +
              Number(obj.feeYearEight) +
              Number(obj.feeYearNine) +
              Number(obj.feeYearTen) +
              Number(obj.feeYearEleven) +
              Number(obj.feeYearTwelve),
          });
        });
        temp.ft = ft;
        temp.ftsa = arr;

        await axios
          .post(`/api/finance/FeeTemplateSubAmount1`, temp)
          .then((res) => {
            navigate("/FeetemplateMaster", { replace: true });
          })
          .catch((err) => console.error(err));
      }
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
      if (checkRowData === 0) {
        setAlertMessage({
          severity: "error",
          message: "Row cannot be empty please delete",
        });
        setAlertOpen(true);
      } else if (checkRowData > 0) {
        const ft = {};
        const fth = {};
        const ftsa = [];
        const ftsah = [];
        const arr = [];
        const arrOne = [];
        const temp = {};
        ft.active = true;
        ft.fee_template_id = feetemplateDetails.fee_template_id;
        ft.fee_year1_amt = lastRow.yearOneTotal;
        ft.fee_year2_amt = lastRow.yearTwoTotal;
        ft.fee_year3_amt = lastRow.yearThreeTotal;
        ft.fee_year4_amt = lastRow.yearFourTotal;
        ft.fee_year5_amt = lastRow.yearFiveTotal;
        ft.fee_year6_amt = lastRow.yearSixTotal;
        ft.fee_year7_amt = lastRow.yearSevenTotal;
        ft.fee_year8_amt = lastRow.yearEightTotal;
        ft.fee_year9_amt = lastRow.yearNineTotal;
        ft.fee_year10_amt = lastRow.yearTenTotal;
        ft.fee_year11_amt = lastRow.yearElevenTotal;
        ft.fee_year12_amt = lastRow.yearTwelveTotal;
        ft.fee_year_total_amount = lastRow.yearTotalAmount;
        ft.is_paid_at_board = feetemplateDetails.Is_paid_at_board;

        fth.is_paid_at_board = feetemplateDetails.Is_paid_at_board;
        fth.is_nri = feetemplateDetails.Is_nri;
        fth.nationality = feetemplateDetails.nationality;
        fth.program_id = feetemplateDetails.program_id;
        fth.program_specialization =
          feetemplateDetails.program_specialization_id;
        fth.program_specialization_id =
          feetemplateDetails.program_specialization;
        fth.program_type_id = feetemplateDetails.program_type_id;
        fth.remarks = feetemplateDetails.remarks;
        fth.school_id = feetemplateDetails.school_id;
        fth.ac_year_id = feetemplateDetails.ac_year_id;
        fth.currency_type_id = feetemplateDetails.currency_type_id;
        fth.fee_admission_category_id =
          feetemplateDetails.fee_admission_category_id;
        fth.fee_admission_sub_category_id =
          feetemplateDetails.fee_admission_sub_category_id;
        fth.fee_template_id = feetemplateDetails.fee_template_id;
        fth.approved_status = feetemplateDetails.approved_status;
        fth.active = true;
        fth.fee_year1_amt = feetemplateDetails.fee_year1_amt;
        fth.fee_year2_amt = feetemplateDetails.fee_year2_amt;
        fth.fee_year3_amt = feetemplateDetails.fee_year3_amt;
        fth.fee_year4_amt = feetemplateDetails.fee_year4_amt;
        fth.fee_year5_amt = feetemplateDetails.fee_year5_amt;
        fth.fee_year6_amt = feetemplateDetails.fee_year6_amt;
        fth.fee_year7_amt = feetemplateDetails.fee_year7_amt;
        fth.fee_year8_amt = feetemplateDetails.fee_year8_amt;
        fth.fee_year9_amt = feetemplateDetails.fee_year9_amt;
        fth.fee_year10_amt = feetemplateDetails.fee_year10_amt;
        fth.fee_year11_amt = feetemplateDetails.fee_year11_amt;
        fth.fee_year12_amt = feetemplateDetails.fee_year12_amt;
        fth.fee_year_total_amount = feetemplateDetails.fee_year_total_amount;

        values.map((obj, i) => {
          arr.push({
            active: true,
            voucher_head_new_id: obj.voucherId,
            board_unique_id: obj.boardId,
            fee_template_id: feetemplateDetails.fee_template_id,
            alias_id: obj.aliasId,
            receive_for_all_year: obj.receiveForAllYear,
            fee_sub_amt_id: obj.feetempSubAmtId,
            year1_amt: obj.feeYearOne,
            year2_amt: obj.feeYearTwo,
            year3_amt: obj.feeYearThree,
            year4_amt: obj.feeYearFour,
            year5_amt: obj.feeYearFive,
            year6_amt: obj.feeYearSix,
            year7_amt: obj.feeYearSeven,
            year8_amt: obj.feeYearEight,
            year9_amt: obj.feeYearNine,
            year10_amt: obj.feeYearTen,
            year11_amt: obj.feeYearEleven,
            year12_amt: obj.feeYearTwelve,
            receive_for_all_year: obj.receiveForAllYear,
            remarks: obj.remarks,
            total_amt:
              Number(obj.feeYearOne) +
              Number(obj.feeYearTwo) +
              Number(obj.feeYearThree) +
              Number(obj.feeYearFour) +
              Number(obj.feeYearFive) +
              Number(obj.feeYearSix) +
              Number(obj.feeYearSeven) +
              Number(obj.feeYearEight) +
              Number(obj.feeYearNine) +
              Number(obj.feeYearTen) +
              Number(obj.feeYearEleven) +
              Number(obj.feeYearTwelve),
          });
        });
        temp.ft = ft;
        temp.fth = fth;
        temp.ftsa = arr;
        historyData.map((obj, i) => {
          arrOne.push({
            active: true,
            voucher_head: obj.voucherHead,
            board_unique_name: obj.boardName,
            fee_template_id: feetemplateDetails.fee_template_id,
            alias_name: obj.aliasName,
            fee_sub_amt_id: obj.feetempSubAmtId,
            year1_amt: obj.feeYearOne,
            year2_amt: obj.feeYearTwo,
            year3_amt: obj.feeYearThree,
            year4_amt: obj.feeYearFour,
            year5_amt: obj.feeYearFive,
            year6_amt: obj.feeYearSix,
            year7_amt: obj.feeYearSeven,
            year8_amt: obj.feeYearEight,
            year9_amt: obj.feeYearNine,
            year10_amt: obj.feeYearTen,
            year11_amt: obj.feeYearEleven,
            year12_amt: obj.feeYearTwelve,
            remarks: obj.remarks,
            total_amt:
              Number(obj.feeYearOne) +
              Number(obj.feeYearTwo) +
              Number(obj.feeYearThree) +
              Number(obj.feeYearFour) +
              Number(obj.feeYearFive) +
              Number(obj.feeYearSix) +
              Number(obj.feeYearSeven) +
              Number(obj.feeYearEight) +
              Number(obj.feeYearNine) +
              Number(obj.feeYearTen) +
              Number(obj.feeYearEleven) +
              Number(obj.feeYearTwelve),
          });
        });
        temp.ftsah = arrOne;

        console.log(temp);
        return false;

        await axios
          .put(`/api/finance/EditFeeTemplateSubAmount/${id}`, temp)
          .then((res) => {
            if (
              pathname.toLowerCase() ===
              "/feetemplatemaster/editfeetemplatesubamount/" + id + "/1"
            ) {
              navigate("/FeetemplateMaster", { replace: true });
            } else {
              navigate("/FeetemplateApprovalIndex", { replace: true });
            }
          })
          .catch((err) => console.error(err));
      }
    }
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
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell
                      sx={{ width: 140, color: "white" }}
                      align="center"
                    >
                      Fee Heads
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

                    <TableCell
                      sx={{ width: 100, color: "white" }}
                      align="center"
                    >
                      Alias Name
                    </TableCell>
                    {feetemplateDetails.Is_paid_at_board === true ? (
                      <TableCell sx={{ width: 2, color: "white" }}>
                        All Sems
                      </TableCell>
                    ) : (
                      <></>
                    )}

                    {noOfYears.length > 0
                      ? noOfYears.map((obj, i) => {
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
                <TableBody className={classes.tableBody}>
                  {values.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>
                          <CustomAutocomplete
                            name={"voucherId" + "-" + i}
                            label=""
                            value={obj.voucherId}
                            handleChangeAdvance={handleChangeAdvance}
                            options={voucherOptions}
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

                        {year === 1 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 2 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 3 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearThree"
                                label=""
                                value={obj.feeYearThree}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 4 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearThree"
                                label=""
                                value={obj.feeYearThree}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFour"
                                label=""
                                value={obj.feeYearFour}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 5 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearThree"
                                label=""
                                value={obj.feeYearThree}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFour"
                                label=""
                                value={obj.feeYearFour}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFive"
                                label=""
                                value={obj.feeYearFive}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 6 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearThree"
                                label=""
                                value={obj.feeYearThree}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFour"
                                label=""
                                value={obj.feeYearFour}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFive"
                                label=""
                                value={obj.feeYearFive}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSix"
                                label=""
                                value={obj.feeYearSix}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 7 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearThree"
                                label=""
                                value={obj.feeYearThree}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFour"
                                label=""
                                value={obj.feeYearFour}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFive"
                                label=""
                                value={obj.feeYearFive}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSix"
                                label=""
                                value={obj.feeYearSix}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSeven"
                                label=""
                                value={obj.feeYearSeven}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 8 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearThree"
                                label=""
                                value={obj.feeYearThree}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFour"
                                label=""
                                value={obj.feeYearFour}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFive"
                                label=""
                                value={obj.feeYearFive}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSix"
                                label=""
                                value={obj.feeYearSix}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSeven"
                                label=""
                                value={obj.feeYearSeven}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearEight"
                                label=""
                                value={obj.feeYearEight}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 9 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearThree"
                                label=""
                                value={obj.feeYearThree}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFour"
                                label=""
                                value={obj.feeYearFour}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFive"
                                label=""
                                value={obj.feeYearFive}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSix"
                                label=""
                                value={obj.feeYearSix}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSeven"
                                label=""
                                value={obj.feeYearSeven}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearEight"
                                label=""
                                value={obj.feeYearEight}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearNine"
                                label=""
                                value={obj.feeYearNine}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 10 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearThree"
                                label=""
                                value={obj.feeYearThree}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFour"
                                label=""
                                value={obj.feeYearFour}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFive"
                                label=""
                                value={obj.feeYearFive}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSix"
                                label=""
                                value={obj.feeYearSix}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSeven"
                                label=""
                                value={obj.feeYearSeven}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearEight"
                                label=""
                                value={obj.feeYearEight}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearNine"
                                label=""
                                value={obj.feeYearNine}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTen"
                                label=""
                                value={obj.feeYearTen}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 11 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearThree"
                                label=""
                                value={obj.feeYearThree}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFour"
                                label=""
                                value={obj.feeYearFour}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFive"
                                label=""
                                value={obj.feeYearFive}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSix"
                                label=""
                                value={obj.feeYearSix}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSeven"
                                label=""
                                value={obj.feeYearSeven}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearEight"
                                label=""
                                value={obj.feeYearEight}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearNine"
                                label=""
                                value={obj.feeYearNine}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTen"
                                label=""
                                value={obj.feeYearTen}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearEleven"
                                label=""
                                value={obj.feeYearEleven}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        {year === 12 ? (
                          <>
                            <TableCell>
                              <CustomTextField
                                name="feeYearOne"
                                label=""
                                value={obj.feeYearOne}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwo"
                                label=""
                                value={obj.feeYearTwo}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearThree"
                                label=""
                                value={obj.feeYearThree}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFour"
                                label=""
                                value={obj.feeYearFour}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearFive"
                                label=""
                                value={obj.feeYearFive}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSix"
                                label=""
                                value={obj.feeYearSix}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearSeven"
                                label=""
                                value={obj.feeYearSeven}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearEight"
                                label=""
                                value={obj.feeYearEight}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearNine"
                                label=""
                                value={obj.feeYearNine}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTen"
                                label=""
                                value={obj.feeYearTen}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearEleven"
                                label=""
                                value={obj.feeYearEleven}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextField
                                name="feeYearTwelve"
                                label=""
                                value={obj.feeYearTwelve}
                                handleChange={(e) => handleChange(e, i)}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}
                        <TableCell>
                          {Number(obj.feeYearOne) +
                            Number(obj.feeYearTwo) +
                            Number(obj.feeYearThree) +
                            Number(obj.feeYearFour) +
                            Number(obj.feeYearFive) +
                            Number(obj.feeYearSix) +
                            Number(obj.feeYearSeven) +
                            Number(obj.feeYearEight) +
                            Number(obj.feeYearNine) +
                            Number(obj.feeYearTen) +
                            Number(obj.feeYearEleven) +
                            Number(obj.feeYearTwelve)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableHead>
                  <TableRow>
                    {feetemplateDetails.Is_paid_at_board ? (
                      <TableCell colSpan={4}>Total</TableCell>
                    ) : (
                      <TableCell colSpan={2}>Total</TableCell>
                    )}

                    {year === 1 ? (
                      <TableCell>
                        <CustomTextField
                          name="yearOneTotal"
                          label=""
                          value={lastRow.yearOneTotal}
                          handleChange={handleChangeRow}
                        />
                      </TableCell>
                    ) : (
                      <></>
                    )}
                    {year === 2 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    {year === 3 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearThreeTotal"
                            label=""
                            value={lastRow.yearThreeTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    {year === 4 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearThreeTotal"
                            label=""
                            value={lastRow.yearThreeTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFourTotal"
                            label=""
                            value={lastRow.yearFourTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    {year === 5 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearThreeTotal"
                            label=""
                            value={lastRow.yearThreeTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFourTotal"
                            label=""
                            value={lastRow.yearFourTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFiveTotal"
                            label=""
                            value={lastRow.yearFiveTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    {year === 6 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearThreeTotal"
                            label=""
                            value={lastRow.yearThreeTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFourTotal"
                            label=""
                            value={lastRow.yearFourTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFiveTotal"
                            label=""
                            value={lastRow.yearFiveTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSixTotal"
                            label=""
                            value={lastRow.yearSixTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    {year === 7 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearThreeTotal"
                            label=""
                            value={lastRow.yearThreeTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFourTotal"
                            label=""
                            value={lastRow.yearFourTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFiveTotal"
                            label=""
                            value={lastRow.yearFiveTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSixTotal"
                            label=""
                            value={lastRow.yearSixTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSevenTotal"
                            label=""
                            value={lastRow.yearSevenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    {year === 8 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearThreeTotal"
                            label=""
                            value={lastRow.yearThreeTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFourTotal"
                            label=""
                            value={lastRow.yearFourTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFiveTotal"
                            label=""
                            value={lastRow.yearFiveTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSixTotal"
                            label=""
                            value={lastRow.yearSixTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSevenTotal"
                            label=""
                            value={lastRow.yearSevenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearEightTotal"
                            label=""
                            value={lastRow.yearEightTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    {year === 9 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearThreeTotal"
                            label=""
                            value={lastRow.yearThreeTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFourTotal"
                            label=""
                            value={lastRow.yearFourTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFiveTotal"
                            label=""
                            value={lastRow.yearFiveTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSixTotal"
                            label=""
                            value={lastRow.yearSixTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSevenTotal"
                            label=""
                            value={lastRow.yearSevenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearEightTotal"
                            label=""
                            value={lastRow.yearEightTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearEightTotal"
                            label=""
                            value={lastRow.yearEightTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearNineTotal"
                            label=""
                            value={lastRow.yearNineTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    {year === 10 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearThreeTotal"
                            label=""
                            value={lastRow.yearThreeTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFourTotal"
                            label=""
                            value={lastRow.yearFourTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFiveTotal"
                            label=""
                            value={lastRow.yearFiveTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSixTotal"
                            label=""
                            value={lastRow.yearSixTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSevenTotal"
                            label=""
                            value={lastRow.yearSevenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearEightTotal"
                            label=""
                            value={lastRow.yearEightTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>

                        <TableCell>
                          <CustomTextField
                            name="yearNineTotal"
                            label=""
                            value={lastRow.yearNineTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTenTotal"
                            label=""
                            value={lastRow.yearTenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    {year === 11 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearThreeTotal"
                            label=""
                            value={lastRow.yearThreeTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFourTotal"
                            label=""
                            value={lastRow.yearFourTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFiveTotal"
                            label=""
                            value={lastRow.yearFiveTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSixTotal"
                            label=""
                            value={lastRow.yearSixTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSevenTotal"
                            label=""
                            value={lastRow.yearSevenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearEightTotal"
                            label=""
                            value={lastRow.yearEightTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>

                        <TableCell>
                          <CustomTextField
                            name="yearNineTotal"
                            label=""
                            value={lastRow.yearNineTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTenTotal"
                            label=""
                            value={lastRow.yearTenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearElevenTotal"
                            label=""
                            value={lastRow.yearElevenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    {year === 12 ? (
                      <>
                        <TableCell>
                          <CustomTextField
                            name="yearOneTotal"
                            label=""
                            value={lastRow.yearOneTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwoTotal"
                            label=""
                            value={lastRow.yearTwoTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearThreeTotal"
                            label=""
                            value={lastRow.yearThreeTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFourTotal"
                            label=""
                            value={lastRow.yearFourTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearFiveTotal"
                            label=""
                            value={lastRow.yearFiveTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSixTotal"
                            label=""
                            value={lastRow.yearSixTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearSevenTotal"
                            label=""
                            value={lastRow.yearSevenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearEightTotal"
                            label=""
                            value={lastRow.yearEightTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>

                        <TableCell>
                          <CustomTextField
                            name="yearNineTotal"
                            label=""
                            value={lastRow.yearNineTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTenTotal"
                            label=""
                            value={lastRow.yearTenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearElevenTotal"
                            label=""
                            value={lastRow.yearElevenTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="yearTwelveTotal"
                            label=""
                            value={lastRow.yearTwelveTotal}
                            handleChange={handleChangeRow}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <></>
                    )}
                    <TableCell>{lastRow.yearTotalAmount}</TableCell>
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
