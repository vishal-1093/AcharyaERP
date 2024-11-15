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
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import Checkbox from "@mui/material/Checkbox";
import BankImportedDataById from "./BankImportedDataById";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Visibility from "@mui/icons-material/Visibility";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
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

const requiredFields = ["transactionType", "receivedIn", "receivedAmount"];

function StudentFeeReceipt() {
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState([]);
  const [openStudentData, setOpenStudentData] = useState(false);
  const [bankName, setBankName] = useState("");
  //Bank Imported Data
  const [openBankImportedData, setOpenBankImportedData] = useState(false);
  const [bankImportedData, setBankImportedData] = useState([]);

  //Bank Imported Data By Id
  const [bankImportedDataById, setBankImportedDataById] = useState([]);
  const [openBankImportedDataById, setOpenBankImportedDataById] =
    useState(false);

  const [openSavedData, setOpenSavedData] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [noOfYears, setNoOfYears] = useState([]);
  const [voucherHeadIds, setVoucherHeadIds] = useState([]);
  const [display, setDisplay] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const [feetemplateId, setFeetemplateId] = useState();
  const [studentId, setStudentId] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();
  const navigate = useNavigate();

  const checks = {};

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

  const getStudentData = async (studentAuid) => {
    try {
      if (studentAuid) {
        const studentDataResponse = await axios.get(
          `/api/student/studentDetailsByAuid/${studentAuid}`
        );

        if (studentDataResponse.data.data.length > 0) {
          setStudentData(studentDataResponse.data.data[0]);
          setOpenStudentData(true);
          setFeetemplateId(studentDataResponse.data.data[0].fee_template_id);
          setStudentId(studentDataResponse.data.data[0].student_id);
          const years = [];
          if (
            studentDataResponse.data.data[0].program_type_name.toLowerCase() ===
            "yearly"
          ) {
            for (
              let i = 1;
              i <= studentDataResponse.data.data[0].number_of_semester;
              i++
            ) {
              years.push({ label: "Sem" + "-" + i, key: i });
            }
          } else if (
            studentDataResponse.data.data[0].program_type_name.toLowerCase() ===
            "semester"
          ) {
            for (
              let i = 1;
              i <= studentDataResponse.data.data[0].number_of_semester;
              i++
            ) {
              years.push({ label: "Sem" + "-" + i, key: i });
            }
          }

          setNoOfYears(years);

          const dueResponse = await axios.get(
            `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${studentDataResponse.data.data[0].student_id}`
          );

          const Ids = [];
          dueResponse.data.data.fee_template_sub_amount_info.forEach((obj) => {
            Ids.push({
              id: obj.voucher_head_new_id,
              label: obj.voucher_head,
            });
          });

          setVoucherHeadIds(Ids);

          const voucherIds = {};
          const mainFormat = {};
          years.forEach((year) => {
            Ids.forEach((obj) => {
              voucherIds[obj.id] = 0;
              mainFormat[year.key] = voucherIds;
            });
          });

          setDisplay(dueResponse.data.data);
          setData((prev) => ({
            ...prev,
            postData: mainFormat,
          }));
        } else {
          setOpenStudentData(false);
        }
      }
    } catch {}
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
              console.log(res.data.data);
              resOne.data.data.filter((obj) => {
                if (obj.bank_id === res.data.data.deposited_bank_id) {
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

  const handleChange = (e) => {
    if (e.target.name === "auid") {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      getStudentData(e.target.value);
    } else if (
      e.target.name === "transactionType" &&
      values.receivedIn === ""
    ) {
      setAlertMessage({
        severity: "error",
        message: "Please Select Received In",
      });
      setAlertOpen(true);
    }
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCheckBox = (e, id) => {
    setValues((prev) => ({ ...prev, bankImportedId: id }));
    getBankImportedDataById(id);
    getReceiptDetails(id);
  };

  const handleChangeOne = (e) => {
    const splitName = e.target.name.split("-");
    setData((prev) => ({
      ...prev,
      postData: {
        ...prev.postData,
        [splitName[1]]: {
          ...prev.postData[splitName[1]],
          [splitName[0]]: Number(e.target.value),
        },
      },
    }));
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

  const handleOpenConfirm = () => {
    setModalContent({
      title: "",
      message: "Are you sure you want to generate the receipt ?",
      buttons: [
        { name: "Yes", color: "primary", func: handleCreate },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setModalConfirmOpen(true);
  };

  const handleCreate = async () => {
    try {
      const payload = {};
      const paidYears = [];
      const sph = [];
      const tr = [];

      noOfYears.forEach((obj) => {
        voucherHeadIds.forEach((obj1) => {
          if (data.postData[obj.key][obj1.id] > 0) {
            sph.push({
              active: true,
              balance_amount: (
                display.dueAmount[obj.key][obj1.id] -
                data.postData[obj.key][obj1.id]
              ).toFixed(2),
              paid_year: obj.key,
              dollar_value: values.dollarValue,
              fee_template_id: feetemplateId,
              paid_amount: Number(data.postData[obj.key][obj1.id]),
              remarks: values.narration,
              school_id: studentData.school_id,
              student_id: studentId,
              to_pay: Number(
                display.fee_template_sub_amount_format[obj.key][obj1.id]
              ),
              total_amount: values.receivedAmount,
              transcation_type: values.transactionType,
              voucher_head_new_id: obj1.id,
            });
          }
        });
      });

      noOfYears.forEach((obj) => {
        voucherHeadIds.forEach((obj1) => {
          if (data.postData[obj.key][obj1.id] > 0) {
            tr.push({
              active: true,
              auid: studentData.auid,
              bank_institute: values.bankName,
              dd_bank_name: values.bankName,
              dd_no: values.ddChequeNo,
              deposited_bank: values.bankName,
              remarks: values.narration,
              total_amount: values.receivedAmount,
              total: total,
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

      noOfYears.forEach((obj) => {
        voucherHeadIds.forEach((obj1) => {
          if (data.postData[obj.key][obj1.id] > 0) {
            paidYears.push(obj.key);
          }
        });
      });

      const feeRec = {
        active: true,
        ac_year_id: studentData.ac_year_id,
        bank_transaction_history_id: values.bankImportedId,
        receipt_type: "General",
        student_id: studentData.student_id,
        transaction_type: values.transactionType,
        remarks: values.narration,
        paid_amount: values.receivedAmount,
        received_in: values.receivedIn,
        hostel_status: 0,
        paid_year: paidYears.toString(),
      };

      const bit = {
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
        student_id: studentId,
        transaction_date: bankImportedDataById.transaction_date,
        transaction_no: bankImportedDataById.transaction_no,
        transaction_remarks: bankImportedDataById.transaction_remarks,
      };

      if (bankImportedDataById.balance === null) {
        bit.balance = bankImportedDataById.amount - values.receivedAmount;
      } else {
        bit.balance = bankImportedDataById.balance - values.receivedAmount;
      }

      if (values.transactionType.toLowerCase() === "rtgs") {
        payload.bit = bit;
      }

      payload.fee_rec = feeRec;
      payload.sph = sph;
      payload.tr = tr;
      payload.hostel_status = 0;
      payload.school_id = studentData.school_id;

      if (!requiredFieldsValid()) {
        setAlertMessage({
          severity: "error",
          message: "Please fill all required fields",
        });
        setAlertOpen(true);
      } else if (Number(values.receivedAmount) === total) {
        setLoading(false);
        const res = await axios.post(`/api/finance/feeReceipt`, payload);

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

      setAlertOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      {/* <FormWrapper> */}
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <CustomModal
        open={modalConfirmOpen}
        setOpen={setModalConfirmOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <Grid
        container
        justifyContent="flex-start"
        rowSpacing={2}
        columnSpacing={2}
        alignItems="center"
      >
        <Grid item xs={12} md={4}>
          <CustomTextField
            name="auid"
            value={values.auid}
            handleChange={handleChange}
            label="AUID"
          />
        </Grid>
        {openStudentData ? (
          <>
            <Grid item xs={12}>
              <StudentDetails id={studentData.auid} />
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-start"
                rowSpacing={2}
                columnSpacing={2}
              >
                <Grid item xs={12} md={3}>
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
                  <Grid item xs={12} mt={2}>
                    <TableContainer
                      component={Paper}
                      sx={{ position: "relative" }}
                    >
                      <Table size="small">
                        <TableHead>
                          <StyledTableRow>
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
                          </StyledTableRow>
                        </TableHead>
                        <TableBody>
                          {bankImportedData.length > 0 ? (
                            bankImportedData.map((obj, i) => {
                              return (
                                <StyledTableRow key={i}>
                                  <StyledTableCell>{i + 1}</StyledTableCell>
                                  <StyledTableCell>
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
                                    {obj.voucher_head}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {obj.amount}
                                  </StyledTableCell>
                                </StyledTableRow>
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
                    <BankImportedDataById
                      bankImportedDataById={bankImportedDataById}
                      receiptDetails={receiptDetails}
                      values={values}
                    />

                    <Grid item xs={12} md={2}>
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

                {noOfYears.length > 0
                  ? noOfYears.map((obj, i) => {
                      return (
                        <>
                          <Grid item xs={12} mt={2} key={i}>
                            <Accordion defaultExpanded={i === 0 ? true : false}>
                              <AccordionSummary
                                expandIcon={
                                  <Visibility
                                    color="primary"
                                    fontSize="small"
                                  />
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
                                                        obj1.id + "-" + obj.key
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
              </Grid>

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
                  onClick={handleOpenConfirm}
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
          </>
        ) : (
          <></>
        )}
      </Grid>
      {/* </FormWrapper> */}
    </>
  );
}
export default StudentFeeReceipt;
