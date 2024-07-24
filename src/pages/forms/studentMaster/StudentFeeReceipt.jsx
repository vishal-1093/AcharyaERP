import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Collapse,
  CircularProgress,
  Typography,
  Checkbox,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  styled,
  tableCellClasses,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { makeStyles } from "@mui/styles";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const label = { inputprops: { "aria-label": "Checkbox demo" } };

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const initialValues = {
  auid: "",
  receivedIn: "",
  transactionType: "",
  receivedAmount: "",
  transactionAmount: "",
  narration: "",
  ddChequeNo: "",
  ddAmount: "",
  bankName: "",
  ddDate: null,
  bankImportedId: "",
  transactionDate: null,
  transactionNo: "",
  bankId: null,
  payingAmount: "",
};

const requiredFields = ["transactionType", "receivedIn", "receivedAmount"];

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
    padding: "5px",
    borderRadius: "2px",
  },
  yearSem: {
    color: theme.palette.error.main,
    border: "1px solid rgba(0, 0, 0, 1)",
    padding: "2px",
    borderRadius: "2px",
  },

  table: {
    minWidth: 650,
    "& .MuiTableCell-root": {
      border: "1px solid rgba(224, 224, 224, 1)",
    },
  },
}));

function StudentFeeReceipt() {
  const [values, setValues] = useState(initialValues);

  const [studentData, setStudentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [noOfYears, setNoOfYears] = useState([]);
  // const [feeHeads, setFeeHeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feetemplateId, setFeetemplateId] = useState();
  const [somValue, setSomValue] = useState();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [studentId, setStudentId] = useState();
  const [bankImportedData, setBankImportedData] = useState([]);
  const [bankImportedDataById, setBankImportedDataById] = useState();
  const [openBankImportedData, setOpenBankImportedData] = useState(false);
  const [openBankImportedDataById, setOpenBankImportedDataById] =
    useState(false);
  const [bankName, setBankName] = useState("");
  const [receiptDetails, setReceiptDetails] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const [unAssigned, setUnAssigned] = useState([]);
  const [display, setDisplay] = useState([]);
  const [voucherHeadIds, setVoucherHeadIds] = useState([]);
  const [showData, setShowData] = useState();
  const [openSavedData, setOpenSavedData] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  useEffect(() => {
    if (data.postData !== undefined) {
      let temp = 0;
      Object.values(data.postData).forEach((obj) => {
        const val = Object.values(obj).reduce((a, b) => {
          const x = Number(a) > 0 ? Number(a) : 0;
          const y = Number(b) > 0 ? Number(b) : 0;
          return x + y;
        });
        temp += Number(val);
      });
      setTotal(temp);
    }
  }, [data.postData]);

  useEffect(() => {
    if (total > values.receivedAmount) {
      setAlertMessage({
        severity: "error",
        message: "Total amount cannot be greater than received amount",
      });
      setAlertOpen(true);
    } else {
      setAlertOpen(false);
    }
  }, [total, values.receivedAmount]);

  useEffect(() => {
    noOfYears.forEach((obj) => {
      voucherHeadIds.forEach((obj1) => {
        if (
          data.postData[obj.key][obj1.id] >
          display?.fee_template_sub_amount_format?.[obj.key]?.[obj1.id]
        ) {
          setAlertMessage({ severity: "error", message: "test" });
          setAlertOpen(true);
        }
      });
    });
  }, [noOfYears, voucherHeadIds, data.postData, display]);

  useEffect(() => {
    handleViewBankImportDataById();
    getDetailsofReceipt();
  }, [values.bankImportedId]);

  const checks = {};

  const handleViewBankImportData = async () => {
    await axios
      .get(
        `/api/student/bankImportTransactionDetailsOnAmount/${values.transactionAmount}`
      )
      .then((res) => {
        if (res.data.data.length > 0) {
          setOpenBankImportedData(true);
          setBankImportedData(res.data.data);
        } else {
          setAlertMessage({
            severity: "error",
            message: "No records found for this amount...!",
          });
          setAlertOpen(true);
          setOpenBankImportedData(false);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleViewBankImportDataById = async () => {
    if (values.bankImportedId)
      await axios
        .get(`/api/student/bankImportTransaction/${values.bankImportedId}`)
        .then((resOne) => {
          if (resOne.data.data) {
            setBankImportedDataById(resOne.data.data);
            setOpenBankImportedData(false);
            setOpenBankImportedDataById(true);
            axios
              .get(`/api/finance/Bank`)
              .then((res) => {
                res.data.data.filter((obj) => {
                  if (obj.bank_id === resOne.data.data.deposited_bank_id) {
                    setBankName(obj.bank_name);
                  }
                });
              })
              .catch((err) => console.error(err));
          }
        })
        .catch((err) => console.error(err));
  };

  const getDetailsofReceipt = async () => {
    if (values.bankImportedId)
      await axios
        .get(`/api/finance/allRTGSFeeHistoryDetails/${values.bankImportedId}`)
        .then((res) => {
          setReceiptDetails(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const handleChange = async (e) => {
    if (e.target.name === "auid") {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
      await axios
        .get(`/api/student/studentDetailsByAuid/${e.target.value}`)
        .then((res) => {
          if (res.data.data.length > 0) {
            setFeetemplateId(res.data.data[0].fee_template_id);
            setStudentId(res.data.data[0].student_id);
            const years = [];
            const yearsValue = {};
            const showTable = {};
            setStudentData(res.data.data[0]);
            if (res.data.data[0].program_type_name.toLowerCase() === "yearly") {
              for (let i = 1; i <= 2; i++) {
                years.push({ key: i, label: "Year" + "-" + i });
                yearsValue["year" + i] = 0;
                showTable[i] = true;
              }
            } else if (
              res.data.data[0].program_type_name.toLowerCase() === "semester"
            ) {
              for (let i = 1; i <= 2; i++) {
                years.push({ key: i, label: "Sem" + "-" + i });
                yearsValue["sem" + i] = 0;
                showTable[i] = true;
              }
            }
            setNoOfYears(years);
            setOpen(true);
            setShowData(showTable);

            axios
              .get(
                `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${res.data.data[0].student_id}`
              )
              .then((res) => {
                setSomValue(res.data.data.SOM_VALUE);

                const Ids = [];
                res.data.data.fee_template_sub_amount_info.forEach((obj) => {
                  Ids.push({
                    id: obj.voucher_head_new_id,
                    label: obj.voucher_head,
                  });
                });

                const temp = {};
                const mainData = {};
                setVoucherHeadIds(Ids);
                setDisplay(res.data.data);
                years.forEach((val) => {
                  Ids.forEach((obj) => {
                    temp[obj.id] = 0;
                    mainData[val.key] = temp;
                  });

                  setData((prev) => ({
                    ...prev,
                    postData: mainData,
                  }));
                });
              })
              .catch((err) => console.error(err));
          } else {
            setOpen(false);
          }
        })
        .catch((err) => console.error(err));
    } else if (
      e.target.name === "transactionType" &&
      values.receivedIn === ""
    ) {
      setAlertMessage({
        severity: "error",
        message: "Please Select Received In",
      });
      setAlertOpen(true);
    } else {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = async () => {
    if (Number(values.payingAmount) > Number(values.transactionAmount)) {
      setAlertMessage({
        severity: "error",
        message: "Paying Amount cannot be greater than transaction amount..!",
      });
      setAlertOpen(true);
    } else if (
      bankImportedDataById.balance === null ||
      values.payingAmount <= bankImportedDataById.balance
    ) {
      setModalOpen(true);
      const handleToggle = () => {
        setOpenSavedData(true);
        setOpenBankImportedDataById(false);
        setValues((prev) => ({
          ...prev,
          receivedAmount: values.payingAmount,
        }));
      };
      setModalContent({
        title: "",
        message: "Do you really want to save",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
    } else if (
      bankImportedDataById.balance !== null &&
      values.payingAmount > bankImportedDataById.balance
    ) {
      setAlertMessage({
        severity: "error",
        message: "Paying Amount cannot be greater than balance amount..!",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll" && checked === true) {
      let tempUser = bankImportedData.map((test) => {
        return { ...test, isChecked: checked };
      });
      setBankImportedData(tempUser);

      setValues({
        ...values,
        bankImportedId: bankImportedData
          .map((obj) => obj.bank_import_transaction_id)
          .toString(),
      });
    } else if (name === "selectAll" && checked === false) {
      let tempUser = bankImportedData.map((test) => {
        return { ...test, isChecked: checked };
      });
      setBankImportedData(tempUser);

      setValues({
        ...values,
        bankImportedId: [],
      });
    } else if (name !== "selectAll" && checked === true) {
      const uncheckTemp = unAssigned;
      if (
        uncheckTemp.includes(e.target.value) === true &&
        uncheckTemp.indexOf(e.target.value) > -1
      ) {
        uncheckTemp.splice(uncheckTemp.indexOf(e.target.value), 1);
      }

      setUnAssigned(uncheckTemp);

      let temp = bankImportedData.map((obj) => {
        return obj.bank_import_transaction_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });
      setBankImportedData(temp);
      const newTemp = [];
      temp.forEach((obj) => {
        if (obj.isChecked === true) {
          newTemp.push(obj.bank_import_transaction_id);
        }
      });
      setValues({
        ...values,
        bankImportedId: newTemp.toString(),
      });
    } else if (name !== "selectAll" && checked === false) {
      const uncheckTemp = unAssigned;
      if (uncheckTemp.includes(e.target.value) === false) {
        uncheckTemp.push(e.target.value);
      }

      setUnAssigned(uncheckTemp);

      let temp = bankImportedData.map((obj) => {
        return obj.bank_import_transaction_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });

      setBankImportedData(temp);

      const existData = [];

      values.bankImportedId.split(",").forEach((obj) => {
        existData.push(obj);
      });

      const index = existData.indexOf(e.target.value);

      if (index > -1) {
        existData.splice(index, 1);
      }

      setValues({
        ...values,
        bankImportedId: existData.toString(),
      });
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleClick = (name) => {
    setShowData((prev) => ({
      ...prev,
      [name]: showData[name] === true ? false : true,
    }));
  };

  const handleChangeOne = (e) => {
    const splitName = e.target.name.split("-");
    setData((prev) => ({
      ...prev,
      postData: {
        ...prev.postData,
        [splitName[1]]: {
          ...prev.postData[splitName[1]],
          [splitName[0]]:
            Number(e.target.value) >
            display.dueAmount[splitName[1]][splitName[0]]
              ? display.dueAmount[splitName[1]][splitName[0]]
              : e.target.value,
        },
      },
    }));
  };

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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else if (Number(values.receivedAmount) === total) {
      setLoading(true);
      const mainData = {};
      const feeRec = {};
      const temp = [];
      const tempOne = [];
      const paidYears = [];
      const bit = {};

      noOfYears.forEach((obj) => {
        voucherHeadIds.forEach((obj1) => {
          if (data.postData[obj.key][obj1.id] > 0) {
            temp.push({
              active: true,
              balance_amount: (
                display.dueAmount[obj.key][obj1.id] -
                data.postData[obj.key][obj1.id]
              ).toFixed(2),
              paid_year: obj.key,
              remarks: values.narration,
              total_amount: values.receivedAmount,
              total_amount_som: values.receivedAmount,
              total: total,
              total_som: total,
              paid_amount: Number(data.postData[obj.key][obj1.id]),
              paid_amount_som: data.postData[obj.key][obj1.id],
              to_pay: Number(
                display.fee_template_sub_amount_format[obj.key][obj1.id]
              ),
              to_pay_som:
                display.fee_template_sub_amount_format[obj.key][obj1.id],
              voucher_head_new_id: obj1.id,
              transcation_type: values.transactionType,
              student_id: studentId,
              fee_template_id: feetemplateId,
            });
          }
        });
      });

      noOfYears.forEach((obj) => {
        voucherHeadIds.forEach((obj1) => {
          if (data.postData[obj.key][obj1.id] > 0) {
            tempOne.push({
              active: true,
              auid: studentData.auid,
              bank_institute: values.bankName,
              dd_no: values.ddChequeNo,
              deposited_bank: values.bankName,
              transaction_type: values.transactionType,
              total_amount: values.receivedAmount,
              total_amount_som: values.receivedAmount,
              total: total,
              total_som: total,
              paid_year: obj.key,
              paid_amount: Number(data.postData[obj.key][obj1.id]),
              to_pay: data.postData[obj.key][obj1.id],
              voucher_head_new_id: obj1.id,
              received_type: "General",
              received_in: values.receivedIn,
              transcation_type: values.transactionType,
              student_id: studentId,
              fee_template_id: feetemplateId,
              student_name: studentData.student_name,
              school_name: studentData.school_name,

              transaction_no:
                values.transactionType === "RTGS"
                  ? bankImportedDataById.transaction_no
                  : null,
              transaction_date:
                values.transactionType === "RTGS"
                  ? bankImportedDataById.transaction_date
                  : null,
              deposited_bank: bankName,
              voucher_head: voucherHeadIds
                .filter((obj) => obj.id === obj1.id)
                .map((val) => {
                  return val.label;
                })
                .toString(),
            });
          }
        });
      });
      feeRec.bank_transaction_history_id = values.bankImportedId;
      feeRec.receipt_type = "General";
      feeRec.ac_year_id = studentData.ac_year_id;
      feeRec.active = true;
      feeRec.school_id = studentData.school_id;
      feeRec.student_id = studentData.student_id;
      feeRec.transaction_type = values.transactionType;
      feeRec.remarks = values.narration;
      feeRec.paid_amount = values.receivedAmount;
      feeRec.received_in = values.receivedIn;
      feeRec.hostel_status = 0;
      noOfYears.forEach((obj) => {
        voucherHeadIds.forEach((obj1) => {
          if (data.postData[obj.key][obj1.id] > 0) {
            paidYears.push(obj.key);
          }
        });
      });
      feeRec.paid_year = paidYears.toString();
      mainData.hostel_status = 0;
      mainData.school_id = studentData.school_id;
      mainData.sph = temp;
      mainData.fee_rec = feeRec;
      mainData.tr = tempOne;

      if (values.transactionType.toLowerCase() === "rtgs") {
        bit.active = true;
        bit.amount = bankImportedDataById.amount;
        if (bankImportedDataById.balance === null) {
          bit.balance = bankImportedDataById.amount - values.receivedAmount;
        } else {
          bit.balance = bankImportedDataById.balance - values.receivedAmount;
        }
        bit.bank_import_transaction_id = values.bankImportedId;
        bit.bank_transaction_history_id = values.bankImportedId;
        bit.cheque_dd_no = bankImportedDataById.cheque_dd_no;
        bit.deposited_bank_id = bankImportedDataById.deposited_bank_id;
        bit.end_row = bankImportedDataById.end_row;
        bit.paid = values.receivedAmount;
        bit.start_row = bankImportedDataById.start_row;
        bit.school_id = studentData.school_id;
        bit.transaction_date = bankImportedDataById.transaction_date;
        bit.transaction_no = bankImportedDataById.transaction_no;
        bit.transaction_remarks = bankImportedDataById.transaction_remarks;
        mainData.bit = bit;
      }

      await axios.post(`/api/finance/feeReceipt`, mainData).then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Fee Receipt Created Successfully",
          });
          navigate(
            `/FeeReceiptDetails/${studentData.auid}/${
              studentData.student_id
            }/${res.data.data.fee_receipt.split("/").join("_")}/${
              res.data.data.financial_year_id
            }/${values.transactionType}`,
            { replace: true }
          );
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
        setLoading(false);
      });
    } else {
      setAlertMessage({
        severity: "error",
        message: "Total amount is not matching to received amount",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormPaperWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={0}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
          />
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="auid"
              label="AUID"
              value={values.auid}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            {open ? (
              <Grid
                container
                alignItems="center"
                justifyContent="flex-start"
                rowSpacing={1}
                columnSpacing={{ xs: 2, md: 4 }}
              >
                <Grid item xs={12} md={12} mt={2}>
                  <Typography className={classes.bg}>
                    Student Details
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Paper elevation={2}>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="center"
                      rowSpacing={1}
                      pl={2}
                      pr={2}
                      pb={1}
                      pt={1}
                    >
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">AUID</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.auid}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">School</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.school_name_short}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Name</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.student_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Program</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.program_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">DOA</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {moment(studentData.date_of_admission).format(
                            "DD-MM-YYYY"
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">
                          Admission Category
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.fee_admission_category_type}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Year/Sem</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.current_sem}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Template</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.fee_template_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Email</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.acharya_email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Mobile</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.mobile}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    rowSpacing={2}
                    justifyContent="flex-start"
                    columnSpacing={2}
                  >
                    <Grid item xs={12} md={3} mt={1}>
                      <CustomRadioButtons
                        name="receivedIn"
                        label="Received In"
                        value={values.receivedIn}
                        items={[
                          { value: "DOLLAR", label: "DOLLAR" },
                          { value: "INR", label: "INR" },
                        ]}
                        handleChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={3} mt={1}>
                      <CustomRadioButtons
                        name="transactionType"
                        label="Transaction Type"
                        value={values.transactionType}
                        items={[
                          { value: "CASH", label: "CASH" },
                          { value: "RTGS", label: "RTGS" },
                        ]}
                        handleChange={handleChange}
                        required
                      />
                    </Grid>
                    {values.transactionType.toLowerCase() === "rtgs" ? (
                      <>
                        <Grid item xs={12} md={3} mt={3}>
                          <CustomTextField
                            name="transactionAmount"
                            label="Transaction Amount"
                            value={values.transactionAmount}
                            handleChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} mt={3}>
                          <Button
                            variant="contained"
                            onClick={handleViewBankImportData}
                          >
                            View
                          </Button>
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}

                    {openBankImportedData ? (
                      <Grid item xs={12} md={12}>
                        <TableContainer
                          component={Paper}
                          sx={{ position: "relative" }}
                        >
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell sx={{ width: "5%" }}>
                                  SL No.
                                </StyledTableCell>
                                <StyledTableCell sx={{ width: "5%" }}>
                                  Select
                                </StyledTableCell>
                                <StyledTableCell sx={{ width: "5%" }}>
                                  Import Date
                                </StyledTableCell>
                                <StyledTableCell sx={{ width: "5%" }}>
                                  CHQ/DD No.
                                </StyledTableCell>
                                <StyledTableCell sx={{ width: "5%" }}>
                                  Transaction No.
                                </StyledTableCell>
                                <StyledTableCell sx={{ width: "5%" }}>
                                  Transaction Date
                                </StyledTableCell>
                                <StyledTableCell sx={{ width: "5%" }}>
                                  Deposited In
                                </StyledTableCell>
                                <StyledTableCell sx={{ width: "5%" }}>
                                  Amount
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {bankImportedData.length > 0 ? (
                                bankImportedData.map((obj, i) => {
                                  return (
                                    <TableRow key={i}>
                                      <StyledTableCell>{i + 1}</StyledTableCell>
                                      <StyledTableCell>
                                        <Checkbox
                                          {...label}
                                          sx={{
                                            "& .MuiSvgIcon-root": {
                                              fontSize: 15,
                                            },
                                          }}
                                          name={obj.bank_import_transaction_id}
                                          value={obj.bank_import_transaction_id}
                                          onChange={handleChangeCheckbox}
                                          checked={obj?.isChecked || false}
                                        />
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {moment(obj.created_Date).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </StyledTableCell>
                                      <StyledTableCell
                                        style={{
                                          whiteSpace: "normal",
                                          wordWrap: "break-word",
                                        }}
                                      >
                                        {obj.cheque_dd_no}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {obj.transaction_no}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {obj.transaction_date}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        YES BANK
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {obj.amount}
                                      </StyledTableCell>
                                    </TableRow>
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    ) : (
                      <></>
                    )}

                    {openBankImportedDataById ? (
                      <>
                        <Grid item xs={12} md={12}>
                          <TableContainer
                            component={Paper}
                            sx={{ position: "relative" }}
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell sx={{ width: "5%" }}>
                                    Import Date
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ width: "5%" }}>
                                    CHQ/DD No.
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ width: "5%" }}>
                                    Transaction No.
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ width: "5%" }}>
                                    Transaction Date
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ width: "5%" }}>
                                    Deposited In
                                  </StyledTableCell>
                                  <StyledTableCell sx={{ width: "5%" }}>
                                    Amount
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <StyledTableCell>26-05-2023</StyledTableCell>
                                  <StyledTableCell
                                    style={{
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    {bankImportedDataById.cheque_dd_no}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {bankImportedDataById.transaction_no}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {bankImportedDataById.transaction_date}
                                  </StyledTableCell>
                                  <StyledTableCell>YES BANK</StyledTableCell>
                                  <StyledTableCell>
                                    {bankImportedDataById.amount}
                                  </StyledTableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TableContainer component={Paper}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Receipt No.</StyledTableCell>
                                  <StyledTableCell>Date</StyledTableCell>

                                  <StyledTableCell>Amount</StyledTableCell>
                                  <StyledTableCell>Paid</StyledTableCell>
                                  <StyledTableCell>Balance</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {receiptDetails.map((obj, i) => {
                                  return (
                                    <TableRow key={i}>
                                      <StyledTableCell>
                                        {obj.receipt_no}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {obj.created_date
                                          ? moment(obj.created_date).format(
                                              "DD-MM-YYYY"
                                            )
                                          : "NA"}
                                      </StyledTableCell>

                                      <StyledTableCell>
                                        {obj.rtgs_net_amount}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {obj.paid}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {obj.rtgs_balance_amount}
                                      </StyledTableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <CustomTextField
                            name="payingAmount"
                            label="Paying Now"
                            value={values.payingAmount}
                            handleChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Button variant="contained" onClick={handleSave}>
                            Save
                          </Button>
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}

                    {openSavedData ? (
                      <>
                        <Grid item xs={12} md={3} mt={2}>
                          <CustomTextField
                            name="receivedAmount"
                            label="Received Amount"
                            value={values.receivedAmount}
                            handleChange={handleChange}
                          />
                        </Grid>

                        <Grid item xs={12} md={3} mt={2}>
                          <CustomTextField
                            name="transactionNo"
                            label="Transaction No"
                            value={bankImportedDataById.transaction_no}
                            handleChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={3} mt={2}>
                          <CustomTextField
                            name="transactionDate"
                            label="Transaction Date"
                            value={bankImportedDataById.transaction_date}
                            handleChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={3} mt={2}>
                          <CustomTextField
                            multiline
                            rows={2}
                            name="narration"
                            label="Narration"
                            value={values.narration}
                            handleChange={handleChange}
                          />
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}

                    {values.transactionType.toLowerCase() === "bank" ? (
                      <>
                        <Grid item xs={12} md={3} mt={2}>
                          <CustomTextField
                            name="ddChequeNo"
                            label="Payment reference No."
                            value={values.ddChequeNo}
                            handleChange={handleChange}
                          />
                        </Grid>

                        <Grid item xs={12} md={3} mt={2}>
                          <CustomTextField
                            name="bankName"
                            label="Bank"
                            value={values.bankName}
                            handleChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} mt={2}>
                          <CustomDatePicker
                            name="ddDate"
                            label="Payment Date"
                            value={values.ddDate}
                            handleChangeAdvance={handleChangeAdvance}
                            required
                          />
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}

                    {values.transactionType.toLowerCase() !== "rtgs" ? (
                      <>
                        <Grid item xs={12} md={3} mt={2}>
                          <CustomTextField
                            name="receivedAmount"
                            label="Received Amount"
                            value={values.receivedAmount}
                            handleChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} mt={2}>
                          <CustomTextField
                            multiline
                            rows={2}
                            name="narration"
                            label="Narration"
                            value={values.narration}
                            handleChange={handleChange}
                            required
                          />
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}
                  </Grid>

                  {noOfYears.length > 0
                    ? noOfYears.map((obj, i) => {
                        return (
                          <>
                            <Grid item xs={12} mt={2}>
                              <Accordion defaultExpanded>
                                <AccordionSummary
                                  expandIcon={
                                    <ArrowDownwardIcon fontSize="small" />
                                  }
                                  aria-controls="panel1-content"
                                  id="panel1-header"
                                  style={{
                                    backgroundColor: "#f7f7f7",
                                    height: "40px",
                                  }}
                                >
                                  <Typography>{obj.label}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <TableContainer>
                                    <Table size="small">
                                      <TableHead className={classes.bg}>
                                        <TableRow>
                                          <TableCell
                                            sx={{
                                              color: "white",
                                              width: "10%",
                                            }}
                                          >
                                            Heads
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              color: "white",
                                              width: "10%",
                                            }}
                                          >
                                            Fixed
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              color: "white",
                                              width: "10%",
                                            }}
                                          >
                                            Grant
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              color: "white",
                                              width: "10%",
                                            }}
                                          >
                                            Due
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              color: "white",
                                              width: "10%",
                                            }}
                                          >
                                            Payment
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {voucherHeadIds.length > 0 ? (
                                          voucherHeadIds.map((obj1, j) => {
                                            return (
                                              <TableRow key={j}>
                                                {display.fee_template_sub_amount_format !==
                                                  undefined &&
                                                display
                                                  ?.fee_template_sub_amount_format?.[
                                                  obj.key
                                                ]?.[obj1.id] > 0 ? (
                                                  <>
                                                    <TableCell>
                                                      {obj1.label}
                                                    </TableCell>
                                                    <TableCell>
                                                      {display
                                                        .fee_template_sub_amount_format[
                                                        obj.key
                                                      ] !== undefined ? (
                                                        display
                                                          .fee_template_sub_amount_format[
                                                          obj.key
                                                        ][obj1.id]
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </TableCell>

                                                    <TableCell>
                                                      {display
                                                        .scholarship_approval_amount[
                                                        obj.key
                                                      ] !== undefined
                                                        ? display
                                                            .scholarship_approval_amount[
                                                            obj.key
                                                          ][obj1.id]
                                                        : 0}
                                                    </TableCell>

                                                    <TableCell>
                                                      {display.dueAmount[
                                                        obj.key
                                                      ] !== undefined
                                                        ? display.dueAmount[
                                                            obj.key
                                                          ][obj1.id]
                                                        : 0}
                                                    </TableCell>

                                                    <TableCell>
                                                      <CustomTextField
                                                        name={
                                                          obj1.id +
                                                          "-" +
                                                          obj.key
                                                        }
                                                        value={
                                                          data.postData[
                                                            obj.key
                                                          ] !== undefined
                                                            ? data.postData[
                                                                obj.key
                                                              ][obj1.id]
                                                            : ""
                                                        }
                                                        handleChange={
                                                          handleChangeOne
                                                        }
                                                        inputProps={{
                                                          style: {
                                                            height: 10,
                                                          },
                                                        }}
                                                      />
                                                    </TableCell>
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                              </TableRow>
                                            );
                                          })
                                        ) : (
                                          <></>
                                        )}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </AccordionDetails>
                              </Accordion>
                            </Grid>
                          </>
                        );
                      })
                    : ""}

                  <Grid item xs={12} md={12}>
                    <TableContainer component={Paper} elevation={2}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell colSpan={3} sx={{ width: "10%" }}>
                              Total
                            </TableCell>
                            <TableCell sx={{ width: "1%" }}>{total}</TableCell>
                          </TableRow>
                        </TableHead>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={12} align="right" mt={2}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      onClick={handleCreate}
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        <strong>{"Create"}</strong>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default StudentFeeReceipt;
