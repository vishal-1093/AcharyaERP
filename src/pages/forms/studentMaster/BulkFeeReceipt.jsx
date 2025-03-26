import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Typography,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Tooltip,
  tooltipClasses,
  styled,
  tableCellClasses,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { makeStyles } from "@mui/styles";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomModal from "../../../components/CustomModal";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import StudentDetails from "../../../components/StudentDetails";
import BankImportedDataById from "./BankImportedDataById";
import moment from "moment";

const label = { inputprops: { "aria-label": "Checkbox demo" } };

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "grey",
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const initialValues = {
  auid: "",
  receivedIn: "INR",
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
  schoolId: null,
  fromName: "",
  checkAuid: "",
  schoolIdForNoAuid: null,
};

const initialValuesOne = {
  voucherId: null,
  payingAmount: 0,
};

const requiredFields = ["transactionType", "receivedIn"];

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

function BulkFeeReceipt() {
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState([]);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([
    initialValuesOne,
    initialValuesOne,
    initialValuesOne,
    initialValuesOne,
  ]);
  const [total, setTotal] = useState();

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

  const [openSavedData, setOpenSavedData] = useState(false);
  const [checked, setChecked] = useState(false);
  const [auidOpen, setAuidOpen] = useState(false);
  const [voucherHeadOptions, setVoucherHeadOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  useEffect(() => {
    getVoucherHeadData();
    getSchoolData();
    let count = 0;
    const val = data.reduce((a, b) => {
      return Number(a) + Number(b.payingAmount);
    }, 0);
    count = count + Number(val);
    setTotal(count);
  }, [data]);

  useEffect(() => {
    if (total > values.receivedAmount && values.ddAmount === "") {
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
    getBankData();
  }, [values.schoolId]);

  const checks = {};

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const schoolData = [];
        res.data.data.forEach((obj) => {
          schoolData.push({
            label: obj.school_name,
            value: obj.school_id,
          });
        });
        setSchoolOptions(schoolData);
      })
      .catch((err) => console.error(err));
  };

  const getBankData = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/finance/bankDetailsBasedOnSchoolId/${values.schoolId}`)
        .then((res) => {
          const voucherData = [];
          res.data.data.forEach((obj) => {
            voucherData.push({
              label: obj.voucher_head,
              value: obj.id,
              voucherHeadNewId: obj.voucher_head_new_id,
            });
          });
          setBankOptions(voucherData);
        })
        .catch((err) => console.error(err));
  };

  const getVoucherHeadData = async () => {
    await axios
      .get(`/api/finance/VoucherHeadNew`)
      .then((res) => {
        const voucherData = res.data.data.filter(
          (obj) => obj.voucher_type === "inflow"
        );

        setVoucherHeadOptions(
          voucherData.map((obj) => ({
            value: obj.voucher_head_new_id,
            label: obj.voucher_head,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

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
            const years = [];
            const yearsValue = {};
            const showTable = {};
            setStudentData(res.data.data[0]);
            if (res.data.data[0].program_type_name.toLowerCase() === "yearly") {
              for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
                years.push({ key: i, label: "Year" + i });
                yearsValue["year" + i] = 0;
                showTable[i] = true;
              }
            } else if (
              res.data.data[0].program_type_name.toLowerCase() === "semester"
            ) {
              for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
                years.push({ key: i, label: "Sem" + i });
                yearsValue["year" + i] = 0;
                showTable[i] = true;
              }
            }
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
    } else if (e.target.name === "check") {
      setChecked(e.target.checked);
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
          ["receivedAmount"]: values.payingAmount,
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

  const handleSelectAuid = (e) => {
    setChecked(e.target.checked);
  };

  const handleChangeAdvance = (name, newValue) => {
    const splitName = name.split("-");
    const index = parseInt(splitName[1]);
    const keyName = splitName[0];

    setData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [keyName]: newValue };
        return obj;
      })
    );
  };

  const handleChangeAdvanceOne = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleClick = () => {
    if (checked === true) {
      setAuidOpen(true);
    } else if (checked === false) {
      setAuidOpen(false);
    }

    if (values.auid !== "") {
      setOpen(true);
    } else if (values.auid === "") {
      setOpen(false);
    }
  };

  const getBankImportedDataById = async (bankImportId) => {
    return await axios
      .get(`/api/student/bankImportTransaction/${bankImportId}`)
      .then(async (res) => {
        if (res.data.data) {
          setBankImportedDataById(res.data.data);
          setOpenBankImportedData(false);
          setOpenBankImportedDataById(true);
          await axios
            .get(`/api/finance/getAllbankDetailsData`)
            .then((resOne) => {
              resOne.data.data.filter((obj) => {
                if (obj.id === res.data.data.deposited_bank_id) {
                  setBankName(obj.voucher_head);
                }
              });
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  };

  const getReceiptDetails = async (id) => {
    const receiptResponse = await axios.get(
      `/api/finance/allRTGSFeeHistoryDetails/${id}`
    );

    setReceiptDetails(receiptResponse.data.data);
  };

  const handleCheckBox = (e, id) => {
    setValues((prev) => ({ ...prev, bankImportedId: id }));
    getBankImportedDataById(id);
    getReceiptDetails(id);
  };

  const handleChangeOne = (e, index) => {
    setData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
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
    try {
      const mainData = {};
      const tempOne = {};
      const tempTwo = {};
      const temp = {};
      const bit = {};

      mainData.active = true;
      mainData.student_id = studentData.student_id;
      mainData.transaction_type = values.transactionType;
      mainData.school_id =
        values.schoolIdForNoAuid !== null
          ? values.schoolIdForNoAuid
          : studentData.school_id;
      mainData.receipt_id = studentData.student_id;
      mainData.received_in = values.receivedIn;
      mainData.from_name = values.fromName;
      mainData.amount = values.receivedAmount
        ? values.receivedAmount
        : values.ddAmount;
      mainData.remarks = values.narration;
      data.forEach((obj) => {
        if (obj.voucherId !== null) {
          temp[obj.voucherId] = obj.payingAmount;
        }
      });
      mainData.bank_transaction_history_id = values.bankImportedId;
      mainData.voucher_head_new_id = temp;
      tempOne.active = true;
      tempOne.auid = studentData.auid;
      tempOne.received_in = values.receivedIn;
      tempOne.received_type = "Bulk";
      tempOne.remarks = values.narration;
      tempOne.total_amount = total;
      tempOne.total_amount_som = total;
      tempOne.total_som = total;
      tempOne.total = total;
      tempOne.transaction_date = bankImportedDataById?.transaction_date;
      tempOne.transaction_no = bankImportedDataById?.transaction_no;
      tempOne.transaction_type = values.transactionType;
      tempOne.deposited_bank = bankName;
      tempTwo.bank_transaction_history_id = null;
      tempTwo.bulk_id = null;
      tempTwo.bus_fee_receipt_id = null;
      tempTwo.cancel_by = null;
      tempTwo.cancel_date = null;
      tempTwo.cancel_remarks = null;
      tempTwo.change_course_id = null;
      tempTwo.exam_id = null;
      tempTwo.fee_payment_id = null;
      tempTwo.fee_receipt = null;
      tempTwo.hostel_bulk_id = null;
      tempTwo.hostel_fee_payment_id = null;
      tempTwo.hostel_status = 0;
      tempTwo.inr_value = null;
      tempTwo.student_id = studentData.student_id;
      tempTwo.paid_amount = total;
      tempTwo.print_status = null;
      tempTwo.receipt_type = "Bulk";
      tempTwo.received_in = values.receivedIn;
      tempTwo.remarks = values.narration;
      tempTwo.school_id = values.schoolIdForNoAuid
        ? values.schoolIdForNoAuid
        : studentData.school_id;
      tempTwo.transaction_type = values.transactionType;
      tempTwo.vendor_id = null;
      tempTwo.bank_transaction_history_id = values.bankImportedId;

      mainData.tr = tempOne;
      mainData.fr = tempTwo;

      if (values.transactionType.toLowerCase() === "rtgs") {
        bit.active = true;
        bit.amount = bankImportedDataById.amount;
        if (bankImportedDataById.balance === null) {
          bit.balance = bankImportedDataById.amount - values.receivedAmount;
        } else {
          bit.balance = bankImportedDataById.balance - values.receivedAmount;
        }
        bit.bank_import_transaction_id = values.bankImportedId;
        bit.cheque_dd_no = bankImportedDataById.cheque_dd_no;
        bit.deposited_bank_id = bankImportedDataById.deposited_bank_id;

        bit.student_id = studentData.student_id;

        bit.end_row = bankImportedDataById.end_row;
        bit.paid = values.receivedAmount;
        bit.start_row = bankImportedDataById.start_row;
        bit.school_id = bankImportedDataById.school_id;
        bit.transaction_date = bankImportedDataById.transaction_date;
        bit.transaction_no = bankImportedDataById.transaction_no;
        bit.transaction_remarks = bankImportedDataById.transaction_remarks;
        mainData.bit = bit;
      }

      const ddPayload = {
        active: true,
        bank_name: values.bankName,
        dd_amount: values.ddAmount,
        dd_date: values.ddDate,
        dd_number: values.ddChequeNo,
        deposited_into: values.bankId,
        receipt_amount: total,
        receipt_type: "Bulk",
        remarks: values.narration,
        school_id: values.schoolId,
        student_id: studentData.student_id,
      };

      if (!requiredFieldsValid()) {
        setAlertMessage({
          severity: "error",
          message: "Please fill all required fields",
        });
        setAlertOpen(true);
      } else if (
        total > Number(values.receivedAmount) &&
        values.ddAmount === ""
      ) {
        setAlertMessage({
          severity: "error",
          message: "Total amount is not matching to received amount",
        });
        setAlertOpen(true);
        setLoading(false);
      } else if (total > Number(values.ddAmount) && values.ddAmount !== "") {
        setAlertMessage({
          severity: "error",
          message: "Total amount is not matching to received amount",
        });
        setAlertOpen(true);
        setLoading(false);
      } else if (total < Number(values.ddAmount)) {
        setAlertMessage({
          severity: "error",
          message: "Total amount is not matching to DD Amount",
        });
        setAlertOpen(true);
        setLoading(false);
      } else if (total < Number(values.receivedAmount)) {
        setAlertMessage({
          severity: "error",
          message: "Total amount is not matching to Received Amount",
        });
        setAlertOpen(true);
        setLoading(false);
      } else if (
        Number(values.receivedAmount) === total ||
        Number(values.ddAmount) === total
      ) {
        setLoading(false);
        const bulkResponse = await axios.post(
          `/api/finance/bulkFeeReceipt`,
          mainData
        );

        if (
          values.auid !== "" &&
          values.transactionType === "DD" &&
          (bulkResponse.status === 200 || bulkResponse.status === 201)
        ) {
          axios.post(`/api/finance/ddDetails`, ddPayload);
          setAlertMessage({
            severity: "success",
            message: "Created Successfully",
          });
          setAlertOpen(true);
          navigate(`/BulkFeeReceiptPdfV1`, {
            state: {
              studentId: studentData.student_id,
              feeReceiptId: bulkResponse.data.data[0].fee_receipt_id,
              transactionType: values.transactionType,
              financialYearId: bulkResponse.data.data[0].financial_year_id,
              receiptStatus: true,
            },
          });
        } else if (
          values.auid !== "" &&
          (bulkResponse.status === 200 || bulkResponse.status === 201)
        ) {
          setAlertMessage({
            severity: "success",
            message: "Created Successfully",
          });
          setAlertOpen(true);
          navigate(`/BulkFeeReceiptPdfV1`, {
            state: {
              studentId: studentData.student_id,
              feeReceiptId: bulkResponse.data.data[0].fee_receipt_id,
              transactionType: values.transactionType,
              financialYearId: bulkResponse.data.data[0].financial_year_id,
              receiptStatus: true,
            },
          });
        } else {
          setAlertMessage({
            severity: "success",
            message: "Created Successfully",
          });
          setAlertOpen(true);
          navigate(`/BulkFeeReceiptPdfV1`, {
            state: {
              studentId: studentData.student_id,
              feeReceiptId: bulkResponse.data.data[0].fee_receipt_id,
              transactionType: values.transactionType,
              financialYearId: bulkResponse.data.data[0].financial_year_id,
              receiptStatus: true,
            },
          });
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error Occured",
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
          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="auid"
              label="AUID"
              value={values.auid}
              handleChange={handleChange}
            />
          </Grid>
          {values.auid === "" ? (
            <Grid item xs={12} md={2}>
              <FormControlLabel
                name="check"
                checked={checked}
                onChange={handleSelectAuid}
                control={<Checkbox />}
                label="NO AUID"
              />
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={() => handleClick()}
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={12} mt={2}>
            {open ? <StudentDetails id={values.auid} /> : <></>}

            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              rowSpacing={2}
              columnSpacing={4}
            >
              {auidOpen ? (
                <>
                  <Grid item xs={12} md={2} mt={4}>
                    <CustomAutocomplete
                      name="schoolIdForNoAuid"
                      label="School"
                      value={values.schoolIdForNoAuid}
                      options={schoolOptions}
                      handleChangeAdvance={handleChangeAdvanceOne}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={2} mt={4}>
                    <CustomTextField
                      name="fromName"
                      label="From"
                      value={values.fromName}
                      handleChange={handleChange}
                      required
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}
              {auidOpen || open ? (
                <>
                  <Grid item xs={12} md={2} mt={4}>
                    <CustomRadioButtons
                      name="receivedIn"
                      label="Received In"
                      value={values.receivedIn}
                      items={[
                        { value: "USD", label: "USD" },
                        { value: "INR", label: "INR" },
                      ]}
                      handleChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={2} mt={4}>
                    <CustomRadioButtons
                      name="transactionType"
                      label="Transaction Type"
                      value={values.transactionType}
                      items={[
                        { value: "CASH", label: "CASH" },
                        { value: "RTGS", label: "RTGS" },
                        { value: "DD", label: "DD" },
                      ]}
                      handleChange={handleChange}
                      required
                    />
                  </Grid>
                  {values.transactionType.toLowerCase() === "cash" ? (
                    <>
                      <Grid item xs={12} md={2} mt={4}>
                        <CustomTextField
                          name="receivedAmount"
                          label="Received Amount"
                          value={values.receivedAmount}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={2} mt={4}>
                        <CustomTextField
                          rows={2}
                          multiline
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

                  {values.transactionType.toLowerCase() === "rtgs" ? (
                    <>
                      <Grid item xs={12} md={2} mt={4}>
                        <CustomTextField
                          name="transactionAmount"
                          label="Transaction Amount"
                          value={values.transactionAmount}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={2} mt={4}>
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

                  {values.transactionType.toLowerCase() === "dd" ? (
                    <>
                      <Grid item xs={12} md={2} mt={2}>
                        <CustomTextField
                          name="ddChequeNo"
                          label="DD/Cheque No."
                          value={values.ddChequeNo}
                          handleChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={2} mt={2}>
                        <CustomTextField
                          name="bankName"
                          label="Bank"
                          value={values.bankName}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={2} mt={4}>
                        <CustomDatePicker
                          name="ddDate"
                          label="DD/Cheque Date"
                          value={values.ddDate}
                          handleChangeAdvance={handleChangeAdvanceOne}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={2} mt={2}>
                        <CustomTextField
                          name="ddAmount"
                          label="DD Amount"
                          value={values.ddAmount}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={2} mt={2}>
                        <CustomAutocomplete
                          name="schoolId"
                          label="School"
                          value={values.schoolId}
                          handleChangeAdvance={handleChangeAdvanceOne}
                          options={schoolOptions}
                        />
                      </Grid>
                      <Grid item xs={12} md={2} mt={2}>
                        <CustomAutocomplete
                          name="bankId"
                          label="Bank"
                          value={values.bankId}
                          handleChangeAdvance={handleChangeAdvanceOne}
                          options={bankOptions}
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
                      <Grid item xs={12} md={3} mt={4}>
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
                </>
              ) : (
                <></>
              )}
              {openBankImportedData ? (
                <Grid item xs={12} mt={2}>
                  <TableContainer
                    component={Paper}
                    sx={{ position: "relative" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <StyledTableRow>
                          <TableCell sx={{ width: "5%" }}>SL No.</TableCell>
                          <TableCell sx={{ width: "5%" }}>Select</TableCell>
                          <TableCell sx={{ width: "5%" }}>
                            Import Date
                          </TableCell>
                          <TableCell sx={{ width: "5%" }}>CHQ/DD No.</TableCell>
                          <TableCell sx={{ width: "5%" }}>
                            Transaction No.
                          </TableCell>
                          <TableCell sx={{ width: "5%" }}>
                            Transaction Date
                          </TableCell>
                          <TableCell sx={{ width: "5%" }}>
                            Deposited In
                          </TableCell>
                          <TableCell sx={{ width: "5%" }}>Amount</TableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {bankImportedData.length > 0 ? (
                          bankImportedData.map((obj, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>
                                  <Checkbox
                                    {...label}
                                    sx={{
                                      "& .MuiSvgIcon-root": {
                                        fontSize: 15,
                                      },
                                    }}
                                    onChange={(e) => handleCheckBox(e, obj.id)}
                                    name={obj.id}
                                  />
                                </TableCell>
                                <TableCell>
                                  {moment(obj.created_Date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </TableCell>
                                <TableCell
                                  style={{
                                    whiteSpace: "normal",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <HtmlTooltip title={obj.cheque_dd_no}>
                                    <p>
                                      {obj.cheque_dd_no.length > 15
                                        ? obj.cheque_dd_no.slice(0, 15) + "..."
                                        : obj.cheque_dd_no}
                                    </p>
                                  </HtmlTooltip>
                                </TableCell>
                                <TableCell>
                                  <HtmlTooltip title={obj.transaction_no}>
                                    <p>
                                      {obj.transaction_no.length > 15
                                        ? obj.transaction_no.slice(0, 15) +
                                          "..."
                                        : obj.transaction_no}
                                    </p>
                                  </HtmlTooltip>
                                </TableCell>
                                <TableCell>{obj.transaction_date}</TableCell>
                                <TableCell>{obj.voucher_head}</TableCell>
                                <TableCell>{obj.amount}</TableCell>
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
                  <Grid
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    rowSpacing={2}
                    columnSpacing={2}
                    mt={2}
                  >
                    <BankImportedDataById
                      bankImportedDataById={bankImportedDataById}
                      receiptDetails={receiptDetails}
                      values={values}
                      bankName={bankName}
                    />

                    <Grid item xs={12} md={2} mt={2}>
                      <CustomTextField
                        name="payingAmount"
                        label="Paying Now"
                        value={values.payingAmount}
                        handleChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} mt={2}>
                      <Button variant="contained" onClick={handleSave}>
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}
              {openSavedData &&
              values.transactionType.toLowerCase() === "rtgs" ? (
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
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={4}
        >
          {auidOpen || open ? (
            <Grid item xs={12} md={5} mt={2}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                        Fee Heads
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                        Paying Now
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((obj, i) => {
                      return (
                        <TableRow key={i}>
                          <StyledTableCell sx={{ height: "50px" }}>
                            <CustomAutocomplete
                              name={"voucherId" + "-" + i}
                              label="Select One"
                              value={obj.voucherId}
                              options={voucherHeadOptions}
                              handleChangeAdvance={handleChangeAdvance}
                              size="small"
                              required
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            <CustomTextField
                              name="payingAmount"
                              inputProps={{
                                style: { textAlign: "right" },
                              }}
                              label=""
                              value={obj.payingAmount}
                              handleChange={(e) => handleChangeOne(e, i)}
                            />
                          </StyledTableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell>Total</TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="subtitle2"> {total}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12} align="right">
          {auidOpen || open ? (
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
          ) : (
            <></>
          )}
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default BulkFeeReceipt;
