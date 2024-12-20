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

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getSchoolData();
  }, []);

  useEffect(() => {
    getBankData();
  }, [values.schoolId]);

  useEffect(() => {
    let count = 0;
    payTillYears.forEach((year) => {
      dueData[year].reduce((total, sum) => {
        count += Number(sum.amountPaying);
      }, 0);
    });

    setTotalPaying(count);
  }, [payTillYears, dueData]);

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

          if (studentExamDueResponse.data.data.length > 0) {
            const years = [];
            const mainData = {};
            for (let i = 1; i <= studentExamDueResponse.data.data.length; i++) {
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

  console.log(dueData);

  const handleCreate = async () => {
    const payload = {};
    try {
    } catch {}
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
                      rowSpacing={4}
                      alignItems="center"
                    >
                      <Grid item xs={12} md={4} align="center">
                        {payTillYears.length > 0 ? (
                          <>
                            {payTillYears.map((obj, i) => {
                              return (
                                <>
                                  <Accordion
                                    sx={{
                                      background: "#F0F0F0",
                                    }}
                                    key={i}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1-content"
                                      id="panel1-header"
                                    >
                                      <Typography variant="subtitle2">
                                        {`${"SEM-" + obj}`}
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails
                                      sx={{
                                        background: "white",
                                      }}
                                    >
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
                                                <Grid item xs={12} key={index}>
                                                  <CustomTextField
                                                    name="amountPaying"
                                                    label={voucher.voucher_head}
                                                    value={voucher.amountPaying}
                                                    handleChange={(e) =>
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
                                            value={dueData[obj].reduce(
                                              (a, b) =>
                                                Number(a) +
                                                Number(b.amountPaying),
                                              0
                                            )}
                                          />
                                        </Grid>
                                      </Grid>
                                    </AccordionDetails>
                                  </Accordion>
                                </>
                              );
                            })}
                          </>
                        ) : (
                          <></>
                        )}
                        <Grid item xs={12}>
                          <CustomTextField value={totalPaying} />
                        </Grid>
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
