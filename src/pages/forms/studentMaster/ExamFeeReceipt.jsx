import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Grid,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  tableCellClasses,
  styled,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import StudentDetails from "../../../components/StudentDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import Checkbox from "@mui/material/Checkbox";
import BankImportedDataById from "./BankImportedDataById";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Visibility from "@mui/icons-material/Visibility";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { MailRounded } from "@mui/icons-material";
import { isArray } from "chart.js/helpers";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.tableBg.main,
  },
}));

const initialValues = {
  auid: "",
  receivedIn: "",
  transactionType: "",
  receivedAmount: "",
  narration: "",
  transactionAmount: "",
  ddChequeNo: "",
  bankName: "",
  ddDate: null,
  ddAmount: "",
  schoolId: null,
  bankId: "",
  bankImportedId: null,
  payingAmount: "",
};

const requiredFields = ["transactionType", "receivedIn"];

function ExamFeeReceipt() {
  const [values, setValues] = useState(initialValues);
  const [studentDetailsOpen, setStudentDetailsOpen] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  //Bank Import Data
  const [bankImportDataOpen, setBankImportDataOpen] = useState(false);
  const [bankImportedData, setBankImportedData] = useState([]);

  //Bank Imported Data By Id
  const [bankImportedDataByIdOpen, setBankImportedDataByIdOpen] =
    useState(false);
  const [bankImportedDataById, setBankImportedDataById] = useState([]);
  const [bankName, setBankName] = useState("");
  const [receiptDetails, setReceiptDetails] = useState([]);
  const [openSavedData, setOpenSavedData] = useState(false);
  const [accordianOpen, setAccordianOpen] = useState(false);
  const [dueData, setDueData] = useState([]);
  const [payTillYears, setPayTillYears] = useState([]);
  const [totalPaying, setTotalPaying] = useState();
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getSchoolData();
  }, []);

  useEffect(() => {
    getBankData();
  }, [values.schoolId]);

  useEffect(() => {
    let count = 0;
    payTillYears?.forEach((year) => {
      dueData?.[year]?.reduce((total, sum) => {
        count += Number(sum.amountPaying);
      }, 0);
    });

    setTotalPaying(count);
  }, [payTillYears, dueData]);

  const checks = {};

  const getStudentData = async () => {
    try {
      const studentDataResponse = await axios.get(
        `/api/student/studentDetailsByAuid/${values.auid}`
      );
      if (studentDataResponse.data.data.length > 0) {
        try {
          const studentExamDueResponse = await axios.get(
            `/api/finance/feePaymentDetailsForExamFeeByStudentId/${studentDataResponse?.data?.data?.[0]?.student_id}`
          );

          if (
            studentExamDueResponse.data.data.length > 0 &&
            Array.isArray(studentExamDueResponse.data.data)
          ) {
            const years = [];
            const mainData = {};
            for (
              let i = 1;
              i <= studentExamDueResponse.data.data[0].pay_till;
              i++
            ) {
              years.push(i);
            }

            const allAmount =
              studentExamDueResponse?.data?.data?.[0]?.vocherHead?.map(
                (obj) => ({
                  ...obj,
                  amountPaying: 0,
                  focused: false,
                })
              );

            years.forEach((obj) => {
              mainData[obj] = allAmount;
            });

            setPayTillYears(years);
            setAccordianOpen(true);
            setDueData(mainData);
            setAlertOpen(false);
            setStudentDetailsOpen(true);
          } else {
            setAccordianOpen(false);
            setAlertMessage({ severity: "error", message: "NO FEE HEADS" });
            setAlertOpen(true);
          }
        } catch {
          setAlertMessage({ severity: "error", message: "Error Occured" });
          setAlertOpen(true);
        }

        setStudentData(studentDataResponse.data.data[0]);
      } else {
        setAlertMessage({
          severity: "error",
          message: "Student Data Not Found...!!!",
        });
        setAlertOpen(true);
        setStudentDetailsOpen(false);
        setOpenSavedData(false);
        setBankImportDataOpen(false);
        setBankImportedDataByIdOpen(false);
        setValues(initialValues);
      }
    } catch (error) {
      setStudentDetailsOpen(false);
      setAlertMessage({ severity: "error", message: error });
      setAlertOpen(true);
    }
  };

  const getImportData = async () => {
    try {
      const bankImportTransactionResponse = await axios.get(
        `/api/student/bankImportTransactionDetailsOnAmount/${values.transactionAmount}`
      );
      if (bankImportTransactionResponse.data.data.length > 0) {
        setBankImportDataOpen(true);
        setBankImportedData(bankImportTransactionResponse.data.data);
        setBankImportedDataByIdOpen(false);
      } else {
        setAlertMessage({
          severity: "error",
          message: "No records found for this amount...!",
        });
        setAlertOpen(true);
        setBankImportDataOpen(false);
      }
    } catch (error) {
      setAlertMessage({ severity: "error", message: error });
      setAlertOpen(true);
    }
  };

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

  const getBankImportedDataById = async (bankImportId) => {
    return await axios
      .get(`/api/student/bankImportTransaction/${bankImportId}`)
      .then(async (res) => {
        if (res.data.data) {
          setBankImportedDataById(res.data.data);
          setBankImportDataOpen(false);
          setBankImportedDataByIdOpen(true);
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
        setBankImportedDataByIdOpen(false);
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

  const handleChange = (e) => {
    if (e.target.name === "transactionType" && values.receivedIn === "") {
      setAlertMessage({
        severity: "error",
        message: "Please Select Received In",
      });
      setAlertOpen(true);
    } else {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleChangeAdvanceOne = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCheckBox = (e, id) => {
    setValues((prev) => ({ ...prev, bankImportedId: id }));
    getBankImportedDataById(id);
    getReceiptDetails(id);
  };

  const handleChangeVoucher = (e, year, voucherId) => {
    setDueData((prev) => {
      if (!prev[year]) {
        console.warn(`No entry found with ID: ${year}`);
        return prev; // Return previous state
      }

      const updateFees = dueData[year].map((fee) => {
        if (fee.voucher_head_new_id === voucherId) {
          return { ...fee, amountPaying: parseFloat(e.target.value) || 0 };
        }

        return fee;
      });

      return { ...dueData, [year]: updateFees };
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
      const tr = [];
      const paidYears = [];

      payTillYears?.forEach((year) => {
        dueData?.[year]?.forEach((voucher, i) => {
          if (voucher.amountPaying > 0) {
            paidYears.push(year);
          }
        });
      });

      const newArr = [...new Set(paidYears)];

      payload.acYearId = studentData.ac_year_id;
      payload.active = true;
      payload.receivedIn = values.receivedIn;
      payload.remarks = values.narration;
      payload.schoolId = studentData.school_id;
      payload.studentId = studentData.student_id;

      const bankImportTransaction = {
        active: true,
        amount: bankImportedDataById.amount,
        bank_inr_amt: bankImportedDataById.amount,
        bank_usd_amt: bankImportedDataById.usd,
        cheque_dd_no: bankImportedDataById.cheque_dd_no,
        deposited_bank_id: bankImportedDataById.deposited_bank_id,
        // dollor:bankImportedDataById.dollar
        // dollor_rate,
        start_row: bankImportedDataById.start_row,
        end_row: bankImportedDataById.end_row,
        paid: values.receivedAmount,
        school_id: studentData.school_id,
        student_id: studentData.student_id,
        transaction_date: bankImportedDataById.transaction_date,
        transaction_no: bankImportedDataById.transaction_no,
        transaction_remarks: bankImportedDataById.transaction_remarks,
        voucher_head_new_id: bankImportedDataById.voucher_head_new_id,
      };

      if (bankImportedDataById.balance === null) {
        bankImportTransaction.balance =
          bankImportedDataById.amount - values.receivedAmount;
      } else {
        bankImportTransaction.balance =
          bankImportedDataById.balance - values.receivedAmount;
      }

      const feeReceipt = {
        active: true,
        ac_year_id: studentData.ac_year_id,
        bank_id: 1,
        bank_transaction_history_id: values.bankImportedId,
        receipt_type: "Exam",
        student_id: studentData.student_id,
        transaction_type: values.transactionType,
        remarks: values.narration,
        paid_amount: values.receivedAmount,
        received_in: values.receivedIn,
        hostel_status: 0,
        paid_year: newArr?.toString(),
        school_id: studentData.school_id,
      };

      const response = payTillYears?.map((obj) => {
        const vouchers = dueData?.[obj]
          ?.filter((voucher) => voucher.amountPaying > 0)
          ?.map((voucher) => ({
            amount: voucher.amountPaying,
            voucherHeadNewId: voucher.voucher_head_new_id,
          }));

        return {
          voucherHeadWithAmountDtos: vouchers,
          yearOrSem: obj,
        };
      });

      payTillYears?.forEach((year) => {
        dueData?.[year]?.forEach((voucher, i) => {
          if (voucher.amountPaying > 0) {
            tr.push({
              active: true,
              auid: studentData?.auid,
              bank_institute: values.bankName,
              dd_bank_name: values.bankName,
              dd_no: values.ddChequeNo,
              deposited_bank: values.bankName,
              remarks: values.narration,
              total_amount: values.receivedAmount,
              total: voucher.amountPaying,
              paid_year: year,
              paid_amount: voucher.amountPaying,
              to_pay: voucher.amountPaying,
              voucher_head_new_id: voucher.voucher_head_new_id,
              received_type: "Exam",
              received_in: values.receivedIn,
              transcation_type: values.transactionType,
              student_id: studentData?.student_id,
              fee_template_id: studentData?.fee_template_id,
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
              voucher_head: voucher.voucher_head,
            });
          }
        });
      });

      payload.tallyReceipt = tr;
      payload.bankImportTransaction = bankImportTransaction;
      payload.feeReceipt = feeReceipt;
      payload.voucherHeadAndYearSemDtos = response;

      const ddPayload = {
        active: true,
        bank_name: values.bankName,
        dd_amount: values.ddAmount,
        dd_date: values.ddDate,
        dd_number: values.ddChequeNo,
        deposited_into: values.bankId,
        receipt_amount: totalPaying,
        receipt_type: "Exam",
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
        values.transactionType.toLowerCase() === "dd" &&
        Number(values.ddAmount) === totalPaying
      ) {
        const examResponse = await axios.post(
          `/api/finance/examFeeReceipt`,
          payload
        );
        if (examResponse.status === 200 || examResponse.status === 201) {
          axios.post(`/api/finance/ddDetails`, ddPayload);
          setAlertMessage({
            severity: "success",
            message: "Fee Receipt Created Successfully",
          });
          navigate(`/ExamReceiptPdf`, { state: examResponse.data.data });
        } else {
          setAlertMessage({
            severity: "success",
            message: "Exam Receipt Created Successfully",
          });
          navigate(`/ExamReceiptPdf`, { state: examResponse.data.data });
        }
      } else if (
        values.transactionType.toLowerCase() !== "dd" &&
        Number(values.receivedAmount) === totalPaying
      ) {
        setLoading(false);
        const examResponse = await axios.post(
          `/api/finance/examFeeReceipt`,
          payload
        );

        setAlertMessage({
          severity: "success",
          message: "Exam Receipt Created Successfully",
        });
        navigate(`/ExamReceiptPdf`, { state: examResponse.data.data });
      } else {
        setAlertMessage({
          severity: "error",
          message: "Total amount is not matching to received amount",
        });
        setAlertOpen(true);
        setLoading(false);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error Occured",
      });
      console.log(error);
      setAlertOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="center">
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <Paper sx={{ padding: 2, width: "70%" }}>
          <Grid item xs={12}>
            <Grid
              container
              justifyContent="flex-start"
              rowSpacing={2}
              columnSpacing={2}
              alignItems="center"
            >
              <Grid item xs={12} md={3}>
                <CustomTextField
                  name="auid"
                  value={values.auid}
                  handleChange={handleChange}
                  label="AUID"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={getStudentData}
                >
                  Submit
                </Button>
              </Grid>
              {studentDetailsOpen && (
                <>
                  <Grid item xs={12}>
                    <StudentDetails id={studentData.auid} />
                  </Grid>
                  <Grid item xs={12} md={3}>
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

                  <Grid item xs={12} md={3} mt={1}>
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

                  {/*For Cash Starts */}
                  {values.transactionType === "CASH" && (
                    <>
                      <Grid item xs={12} md={3} mt={2}>
                        <CustomTextField
                          type="number"
                          name="receivedAmount"
                          label="Received Amount"
                          value={values.receivedAmount}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={3} mt={2}>
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
                  )}
                  {/*For Cash Ends */}

                  {/*For Rtgs Starts */}

                  {values.transactionType === "RTGS" && (
                    <>
                      <Grid item xs={12} md={3} mt={2}>
                        <CustomTextField
                          type="number"
                          name="transactionAmount"
                          label="Transaction Amount"
                          value={values.transactionAmount}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={2.4} mt={2}>
                        <Button variant="contained" onClick={getImportData}>
                          View
                        </Button>
                      </Grid>
                    </>
                  )}

                  {/*For Rtgs Ends */}

                  {/*For DD Starts */}

                  {values.transactionType === "DD" && (
                    <>
                      <Grid item xs={12} md={3} mt={2}>
                        <CustomTextField
                          name="ddChequeNo"
                          label="DD/Cheque No."
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
                          label="DD/Cheque Date"
                          value={values.ddDate}
                          handleChangeAdvance={handleChangeAdvanceOne}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          type="number"
                          name="ddAmount"
                          label="DD Amount"
                          value={values.ddAmount}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                          name="schoolId"
                          label="School"
                          value={values.schoolId}
                          handleChangeAdvance={handleChangeAdvanceOne}
                          options={schoolOptions}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                          name="bankId"
                          label="Bank"
                          value={values.bankId}
                          handleChangeAdvance={handleChangeAdvanceOne}
                          options={bankOptions}
                        />
                      </Grid>
                    </>
                  )}
                  {/*For DD Ends */}

                  {/*For Bank Import Data Starts*/}
                  {bankImportDataOpen && (
                    <>
                      <Grid item xs={12} mt={2}>
                        <TableContainer
                          component={Paper}
                          sx={{ position: "relative" }}
                        >
                          <Table size="small">
                            <TableHead>
                              <StyledTableRow>
                                <TableCell sx={{ width: "5%" }}>
                                  SL No.
                                </TableCell>
                                <TableCell sx={{ width: "5%" }}>
                                  Select
                                </TableCell>
                                <TableCell sx={{ width: "5%" }}>
                                  Import Date
                                </TableCell>
                                <TableCell sx={{ width: "5%" }}>
                                  CHQ/DD No.
                                </TableCell>
                                <TableCell sx={{ width: "5%" }}>
                                  Transaction No.
                                </TableCell>
                                <TableCell sx={{ width: "5%" }}>
                                  Transaction Date
                                </TableCell>
                                <TableCell sx={{ width: "5%" }}>
                                  Deposited In
                                </TableCell>
                                <TableCell sx={{ width: "5%" }}>
                                  Amount
                                </TableCell>
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
                                          onChange={(e) =>
                                            handleCheckBox(e, obj.id)
                                          }
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
                                      <TableCell>
                                        {obj.transaction_no}
                                      </TableCell>
                                      <TableCell>
                                        {obj.transaction_date}
                                      </TableCell>
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
                    </>
                  )}
                  {/*For Bank Import Data Ends */}

                  {/*For Bank Import Data By Id Starts */}

                  {bankImportedDataByIdOpen && (
                    <>
                      <BankImportedDataById
                        bankImportedDataById={bankImportedDataById}
                        receiptDetails={receiptDetails}
                        values={values}
                        bankName={bankName}
                      />

                      <Grid item xs={12} md={2}>
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
                  )}

                  {/*For Bank Import Data By Id Ends */}

                  {/*Saved Data Open Starts */}

                  {openSavedData && values.transactionType === "RTGS" && (
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
                  )}
                  {/*Saved Data Open Ends */}

                  {/* Accordian Start */}
                  <Grid item xs={12} align="center">
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: "80%" }}
                    >
                      <Grid item xs={12} md={5}>
                        <Paper
                          elevation={1}
                          sx={{
                            padding: "20px",
                            background: "#F5F5F5",
                            // borderRadius: "15px",
                          }}
                        >
                          <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                          >
                            <>
                              {payTillYears.length > 0 ? (
                                <>
                                  <Grid item xs={12} mt={2}>
                                    {/* <Paper
                                      // elevation={4}
                                      sx={{
                                        padding: "12px",
                                        borderRadius: "8px",
                                      }}
                                    > */}
                                    <Grid
                                      container
                                      justifyContent="flex-start"
                                      alignItems="center"
                                      rowSpacing={1}
                                    >
                                      {payTillYears.map((obj, i) => {
                                        return (
                                          <>
                                            <Grid item xs={12} key={i}>
                                              <Accordion
                                                sx={{
                                                  background: "#ECECEC",
                                                }}
                                              >
                                                <AccordionSummary
                                                  expandIcon={
                                                    <ExpandMoreIcon />
                                                  }
                                                  aria-controls="panel1-content"
                                                  id="panel1-header"
                                                >
                                                  <Typography variant="subtitle2">
                                                    {"SEM-" + obj}
                                                  </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                  <Grid
                                                    container
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    rowSpacing={2}
                                                  >
                                                    {dueData?.[obj]?.map(
                                                      (voucher, index) => {
                                                        return (
                                                          <>
                                                            <Grid
                                                              item
                                                              xs={12}
                                                              key={index}
                                                            >
                                                              <CustomTextField
                                                                name="amountPaying"
                                                                label={
                                                                  voucher.voucher_head
                                                                }
                                                                value={
                                                                  voucher.amountPaying
                                                                }
                                                                handleChange={(
                                                                  e
                                                                ) =>
                                                                  handleChangeVoucher(
                                                                    e,
                                                                    obj,
                                                                    voucher.voucher_head_new_id
                                                                  )
                                                                }
                                                              />
                                                            </Grid>
                                                          </>
                                                        );
                                                      }
                                                    )}

                                                    <Grid item xs={12}>
                                                      <CustomTextField
                                                        label="Total"
                                                        value={dueData?.[
                                                          obj
                                                        ]?.reduce(
                                                          (a, b) =>
                                                            Number(a) +
                                                            Number(
                                                              b.amountPaying
                                                            ),
                                                          0
                                                        )}
                                                      />
                                                    </Grid>
                                                  </Grid>
                                                </AccordionDetails>
                                              </Accordion>
                                            </Grid>
                                          </>
                                        );
                                      })}
                                    </Grid>
                                    {/* </Paper> */}
                                  </Grid>
                                  <Grid item xs={12} mt={2}>
                                    <CustomTextField
                                      name="totalPaying"
                                      label="Total Paying"
                                      value={totalPaying}
                                    />
                                  </Grid>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          </Grid>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/*Accrordian End */}
                  <Grid item xs={12} align="right">
                    <Button
                      variant="contained"
                      sx={{ borderRadius: 2 }}
                      onClick={handleCreate}
                    >
                      SUBMIT
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}
export default ExamFeeReceipt;
