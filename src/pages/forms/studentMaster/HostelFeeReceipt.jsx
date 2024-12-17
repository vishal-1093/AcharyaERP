import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Typography,
  Checkbox,
  CircularProgress,
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

const initialValues = {
  auid: "",
  acYearId: null,
  schoolId: null,
  bankId: null,
  ddAmount: "",
  receivedIn: "INR",
  transactionType: "",
  receivedAmount: "",
  transactionAmount: "",
  narration: "",
  ddChequeNo: "",
  bankName: "",
  ddDate: null,
  bankImportedId: "",
  transactionDate: null,
  transactionNo: "",
  bankId: null,
  fromName: "",
  checkAuid: "",
};

const initialValuesOne = {
  voucherId: null,
  payingAmount: 0,
};

const requiredFields = [];

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

function HostelFeeReceipt() {
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
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
  const [fixedAmount, setFixedAmount] = useState();
  const [minimumAmount, setMinimumAmount] = useState();
  const [balanceAmount, setBalanceAmount] = useState();
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [minimumAmountValidation, setMinimumAmountValidation] = useState(false);
  const [schoolIdHostel, setSchooIdlHostel] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  useEffect(() => {
    getAcYearData();
    getVoucherHeadData();
    getSchoolData();
    let count = 0;
    const val = data?.hostelFeeTemplate?.reduce((a, b) => {
      return Number(a) + Number(b.payingAmount);
    }, 0);
    count = count + Number(val);
    setTotal(count);

    const fixedTotal = data?.hostelFeeTemplate?.reduce((a, b) => {
      return Number(a) + Number(b.advance_amount);
    }, 0);
    const temp = [];
    data?.hostelFeeTemplate?.map((obj) => {
      temp.push(data.voucherheadwiseDueAmount[obj.voucher_head_new_id]);
    });

    const balanceTotal = temp.reduce(
      (total, sum) => Number(total) + Number(sum),
      0
    );

    const minimumTotal = data?.hostelFeeTemplate?.reduce((a, b) => {
      return Number(a) + Number(b.minimum_amount);
    }, 0);

    const checkValid = data?.hostelFeeTemplate?.every(
      (obj) => obj.payingAmount >= obj.minimum_amount
    );

    setMinimumAmountValidation(checkValid);

    setBalanceAmount(balanceTotal);
    setMinimumAmount(minimumTotal);
    setFixedAmount(fixedTotal);
  }, [data]);

  useEffect(() => {
    getBankData();
  }, [values.schoolId]);

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

  const checks = {};

  const getAcYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcyearOptions(
          res.data.data.map((obj) => ({
            label: obj.ac_year,
            value: obj.ac_year_id,
          }))
        );
      })
      .catch((error) => console.error(error));
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

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const schoolData = [];

        const schoolIdHostel = res.data.data.filter(
          (obj) => obj.school_name_short.toLowerCase() === "hos"
        );

        console.log(schoolIdHostel);

        setSchooIdlHostel(schoolIdHostel);

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

  const getStudentData = async () => {
    try {
      if (values.auid && values.acYearId) {
        const studentResponse = await axios.get(
          `/api/student/studentDetailsByAuid/${values.auid}`
        );
        setStudentData(studentResponse.data.data[0]);
        if (studentResponse.data.data.length > 0) {
          setAuidOpen(true);
          setOpen(true);
          const hostelResponse = await axios.get(
            `/api/finance/hostelDueCalculationVocherHeadWise/${values.acYearId}/${studentResponse.data.data[0].student_id}`
          );

          if (hostelResponse.status === 200) {
            const addRows = {
              voucherheadwiseDueAmount:
                hostelResponse.data.data.voucherheadwiseDueAmount,
              hostelFeeTemplate: hostelResponse.data.data.hostelFeeTemplate.map(
                (obj) => ({
                  ...obj,
                  voucherId: null,
                  payingAmount: 0,
                  minimumAmount: obj.minimum_amount,
                })
              ),
            };
            setData(addRows);
          } else if (hostelResponse.status !== 200) {
            setAuidOpen(false);
            setOpen(false);
            setAlertMessage({
              severity: "error",
              message: "No data found",
            });
            setAlertOpen(true);
          }
        } else {
          setAuidOpen(false);
          setOpen(false);
          setAlertMessage({
            severity: "error",
            message: "No data found",
          });
          setAlertOpen(true);
        }
      }
    } catch (error) {
      setAuidOpen(false);
      setOpen(false);
      setAlertMessage({
        severity: "error",
        message: error.response.data.message
          ? error.response.data.message
          : "No data found",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = async (e) => {
    if (e.target.name === "transactionType" && values.receivedIn === "") {
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
    if (name === "acYearId") {
      setValues((prev) => ({ ...prev, [name]: newValue }));
    }

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
    setData((prev) => {
      const updateData = prev.hostelFeeTemplate.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      });

      return { ...prev, hostelFeeTemplate: updateData };
    });
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
      const payload = {};
      const paidYears = [];
      const sph = [];
      const tr = [];

      data.hostelFeeTemplate.forEach((obj) => {
        sph.push({
          active: true,
          balance_amount: (obj.total_amount - obj.payingAmount).toFixed(2),
          paid_year: obj.key,
          dollar_value: values.dollarValue,
          fee_template_id: obj.hostel_fee_template_id,
          paid_amount: obj.payingAmount,
          remarks: values.narration,
          school_id: schoolIdHostel?.[0]?.school_id,
          student_id: studentData.student_id,
          to_pay: obj.total_amount,
          total_amount: total,
          transcation_type: values.transactionType,
          voucher_head_new_id: obj.voucher_head_new_id,
          receipt_type: "Hostel Fee",
        });
      });

      data.hostelFeeTemplate.forEach((obj) => {
        tr.push({
          active: true,
          auid: studentData.auid,
          bank_institute: values.bankName,
          dd_bank_name: values.bankName,
          dd_no: values.ddChequeNo,
          deposited_bank: values.bankId,
          remarks: values.narration,
          total_amount: values.receivedAmount
            ? values.receivedAmount
            : values.ddAmount,
          total: obj.payingAmount,
          paid_year: obj.key,
          paid_amount: obj.payingAmount,
          to_pay: obj.total_amount,
          voucher_head_new_id: obj.voucher_head_new_id,
          received_type: "General",
          received_in: values.receivedIn,
          transaction_type: values.transactionType,
          student_id: studentData.student_id,
          fee_template_id: obj.hostel_fee_template_id,
          student_name: studentData.student_name,
          school_name: schoolIdHostel?.school_name,
          school_id: schoolIdHostel?.[0]?.school_id,
          transaction_no:
            values.transactionType === "RTGS"
              ? bankImportedDataById.transaction_no
              : null,
          transaction_date:
            values.transactionType === "RTGS"
              ? bankImportedDataById.transaction_date
              : null,
          deposited_bank: bankName,
          voucher_head: obj.voucher_head,
        });
      });

      const feeRec = {
        active: true,
        ac_year_id: values.acYearId,
        bank_transaction_history_id: values.bankImportedId,
        receipt_type: "Hostel Fee",
        student_id: studentData.student_id,
        school_id: schoolIdHostel?.[0]?.school_id,
        transaction_type: values.transactionType,
        remarks: values.narration,
        paid_amount: values.receivedAmount
          ? values.receivedAmount
          : values.ddAmount,
        received_in: values.receivedIn,
        hostel_status: 1,
      };

      const bit = {
        active: true,
        amount: bankImportedDataById?.amount,
        bank_inr_amt: bankImportedDataById?.amount,
        bank_usd_amt: bankImportedDataById?.usd,
        cheque_dd_no: bankImportedDataById?.cheque_dd_no,
        deposited_bank_id: bankImportedDataById?.deposited_bank_id,
        start_row: bankImportedDataById?.start_row,
        end_row: bankImportedDataById?.end_row,
        paid: values.receivedAmount ? values.receivedAmount : values.ddAmount,
        school_id: bankImportedDataById?.school_id,
        student_id: studentData?.student_id,
        transaction_date: bankImportedDataById?.transaction_date,
        transaction_no: bankImportedDataById?.transaction_no,
        transaction_remarks: bankImportedDataById?.transaction_remarks,
        bank_import_transaction_id: values.bankImportedId,
        bank_name: bankName,
        voucher_head_new_id: bankImportedDataById?.voucher_head_new_id,
      };

      if (bankImportedDataById?.balance === null) {
        bit.balance = bankImportedDataById?.amount - values.receivedAmount;
      } else {
        bit.balance = bankImportedDataById?.balance - values.receivedAmount;
      }

      if (values.transactionType.toLowerCase() === "rtgs") {
        payload.bit = bit;
      }

      payload.fee_rec = feeRec;
      payload.sph = sph;
      payload.tr = tr;
      payload.hostel_status = 1;
      payload.school_id = schoolIdHostel?.[0]?.school_id;

      const ddPayload = {
        active: true,
        bank_name: values.bankName,
        dd_amount: values.ddAmount,
        dd_date: values.ddDate,
        dd_number: values.ddChequeNo,
        deposited_into: values.bankId,
        receipt_amount: total,
        receipt_type: "Hostel Fee",
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
      } else if (
        Number(values.receivedAmount) === total ||
        Number(values.ddAmount) === total
      ) {
        setLoading(false);
        const res = await axios.post(`/api/finance/feeReceipt`, payload);

        if (
          values.auid !== "" &&
          values.transactionType === "DD" &&
          (res.status === 200 || res.status === 201)
        ) {
          axios.post(`/api/finance/ddDetails`, ddPayload);
          setAlertMessage({
            severity: "success",
            message: "Fee Receipt Created Successfully",
          });
          navigate(`/HostelFeePdf/${res.data.data.fee_receipt_id}`, {
            state: { replace: true },
          });
          setAlertOpen(true);
        } else {
          setAlertMessage({
            severity: "success",
            message: "Fee Receipt Created Successfully",
          });
          navigate(`/HostelFeePdf/${res.data.data.fee_receipt_id}`, {
            state: { replace: true },
          });
          setAlertOpen(true);
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
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="acYearId"
              label="Ac Year"
              value={values.acYearId}
              options={acyearOptions}
              handleChangeAdvance={handleChangeAdvanceOne}
            />
          </Grid>
          {/* {values.auid === "" ? (
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
          )} */}

          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={getStudentData}
            >
              Submit
            </Button>
          </Grid>

          <Grid item xs={12} mt={2}>
            {auidOpen && open ? <StudentDetails id={values.auid} /> : <></>}

            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              rowSpacing={2}
              columnSpacing={4}
            >
              {/* {auidOpen && open ? (
                <Grid item xs={12} md={2.4} mt={4}>
                  <CustomTextField
                    name="fromName"
                    label="From"
                    value={values.fromName}
                    handleChange={handleChange}
                    required
                  />
                </Grid>
              ) : (
                <></>
              )} */}
              {open ? (
                <>
                  <Grid item xs={12} md={2.4} mt={4}>
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
                  <Grid item xs={12} md={2.4} mt={4}>
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
                      <Grid item xs={12} md={2.4} mt={4}>
                        <CustomTextField
                          name="receivedAmount"
                          label="Received Amount"
                          value={values.receivedAmount}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={2.4} mt={4}>
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
                      <Grid item xs={12} md={2.4} mt={4}>
                        <CustomTextField
                          name="transactionAmount"
                          label="Transaction Amount"
                          value={values.transactionAmount}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={2.4} mt={4}>
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
                      <Grid item xs={12} md={3} mt={6}>
                        <CustomTextField
                          name="ddChequeNo"
                          label="DD/Cheque No."
                          value={values.ddChequeNo}
                          handleChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={3} mt={6}>
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
                          label="DD/Cheque Date"
                          value={values.ddDate}
                          handleChangeAdvance={handleChangeAdvanceOne}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3} mt={2}>
                        <CustomTextField
                          name="ddAmount"
                          label="DD Amount"
                          value={values.ddAmount}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={3} mt={2}>
                        <CustomAutocomplete
                          name="schoolId"
                          label="School"
                          value={values.schoolId}
                          handleChangeAdvance={handleChangeAdvanceOne}
                          options={schoolOptions}
                        />
                      </Grid>
                      <Grid item xs={12} md={3} mt={2}>
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
                                  {obj.cheque_dd_no}
                                </TableCell>
                                <TableCell>{obj.transaction_no}</TableCell>
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
          {open ? (
            <Grid item xs={12} md={5} mt={2}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ width: 100, textAlign: "left" }}>
                        Fee Heads
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: 100, textAlign: "left" }}>
                        Fixed
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: 100, textAlign: "left" }}>
                        Minimum
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: 100, textAlign: "left" }}>
                        Balance
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                        Paying Now
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.hostelFeeTemplate?.map((obj, i) => {
                      return (
                        <TableRow key={i}>
                          <StyledTableCell sx={{ height: "50px" }}>
                            <Typography variant="subtitle2">
                              {obj.voucher_head}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ height: "50px" }}>
                            <Typography variant="subtitle2">
                              {obj.advance_amount}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ height: "50px" }}>
                            <Typography variant="subtitle2">
                              {obj.minimum_amount}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ height: "50px" }}>
                            <Typography variant="subtitle2">
                              {
                                data?.["voucherheadwiseDueAmount"][
                                  obj.voucher_head_new_id
                                ]
                              }
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ width: "25%" }}>
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
                      <TableCell>
                        <Typography variant="subtitle2">Total</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {fixedAmount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {minimumAmount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {balanceAmount}
                        </Typography>
                      </TableCell>
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

          <Grid item xs={12} align="center">
            {!minimumAmountValidation && open ? (
              <>
                <Typography variant="subtitle2" color="error">
                  Note : Paying Amount should be greater than minimum amount..!!
                </Typography>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} align="right">
          {auidOpen || open ? (
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !minimumAmountValidation}
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

export default HostelFeeReceipt;
