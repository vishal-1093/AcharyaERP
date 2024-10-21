import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Grid,
  Button,
  Checkbox,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  styled,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import StudentDetails from "../../../components/StudentDetails";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import BankImportedDataById from "./BankImportedDataById";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
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

function StudentReceipt() {
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
  const [noOfYears, setNoOfYears] = useState([]);
  const [voucherHeadIds, setVoucherHeadIds] = useState([]);
  const [display, setDisplay] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const [feetemplateId, setFeetemplateId] = useState();
  const [studentId, setStudentId] = useState();
  const [disable, setDisable] = useState(false);
  const [firstData, setFirstData] = useState({});

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
  }, [display, data.postData]);

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
              i <= studentDataResponse.data.data[0].number_of_years;
              i++
            ) {
              years.push({
                label: "Sem" + "-" + i,
                key: i,
                feeDetailsOpen: true,
              });
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
              years.push({
                label: "Sem" + "-" + i,
                key: i,
                feeDetailsOpen: true,
              });
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

          setFirstData(mainFormat[1]);
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

  const disabledFunction = (splitName, updatedData) => {
    setDisable(false);
    setData(updatedData);
    const allYears = noOfYears.map((obj) => obj.key);
    const newObject = [];
    const userEntered = [];

    allYears.forEach((obj) => {
      if (updatedData !== undefined && updatedData !== null)
        newObject?.push(
          Object?.values(display?.dueAmount[obj])?.reduce(
            (a, b) => Number(a) + Number(b),
            0
          )
        );
    });

    allYears.forEach((obj) => {
      if (updatedData !== undefined && updatedData !== null)
        userEntered?.push(
          Object?.values(updatedData?.postData[obj])?.reduce(
            (a, b) => Number(a) + Number(b),
            0
          )
        );
    });

    const lastIndex = userEntered
      .map((value, index) => (value > 0 ? index : -1))
      .reduce(
        (lastIdx, currentIdx) => (currentIdx > -1 ? currentIdx : lastIdx),
        -1
      );

    for (let i = 0; i <= lastIndex; i++) {
      if (i === lastIndex) {
        continue;
      }

      if (userEntered[i] < newObject[i]) {
        const newUpdatedData = {
          ...data,
          postData: {
            ...data.postData,
            [splitName[1]]: {
              ...data.postData[splitName[1]],
              [splitName[0]]: 0,
            },
          },
        };
        setData(newUpdatedData);
        setAlertMessage({
          severity: "error",
          message: "Please clear your previous due...",
        });
        setDisable(true);
        setAlertOpen(true);
        return true;
      } else {
        setData(updatedData);
        setDisable(false);
        return false;
      }
    }
  };

  const handleCopy = (e, year) => {
    if (e.target.checked === true) {
      const dueData = display.dueAmount[year];
      setDisable(false);
      const updateData = {
        ...data,
        postData: {
          ...data.postData,
          [year]: dueData,
        },
      };
      setData(updateData);
    } else if (e.target.checked === false) {
      setDisable(true);
      const updateData = {
        ...data,
        postData: {
          ...data.postData,
          [year]: firstData,
        },
      };
      setData(updateData);
    }
  };

  const handleChangeOne = (e) => {
    const splitName = e.target.name.split("-");

    const updatedData = {
      ...data,
      postData: {
        ...data.postData,
        [splitName[1]]: {
          ...data.postData[splitName[1]],
          [splitName[0]]: Number(e.target.value),
        },
      },
    };

    disabledFunction(splitName, updatedData);
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

  const rendeFeeDetails = (obj1) => {
    return (
      <>
        {voucherHeadIds.length > 0 ? (
          voucherHeadIds.map((obj, i) => {
            return (
              <TableRow key={i}>
                {display.fee_template_sub_amount_format !== undefined &&
                  display?.fee_template_sub_amount_format?.[obj1]?.[obj.id] >
                    0 && (
                    <>
                      <TableCell sx={{ width: "20%" }}>{obj.label}</TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        {display.fee_template_sub_amount_format[obj1] !==
                        undefined ? (
                          display.fee_template_sub_amount_format[obj1][obj.id]
                        ) : (
                          <></>
                        )}
                      </TableCell>

                      <TableCell sx={{ width: "20%" }}>
                        {display.dueAmount[obj1] !== undefined
                          ? display.dueAmount[obj1][obj.id]
                          : 0}
                      </TableCell>

                      <TableCell sx={{ width: "20%" }}>
                        <CustomTextField
                          name={obj.id + "-" + obj1}
                          value={
                            data.postData[obj1] !== undefined
                              ? data.postData[obj1][obj.id]
                              : ""
                          }
                          handleChange={handleChangeOne}
                          inputProps={{
                            style: {
                              height: 10,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </>
                  )}
              </TableRow>
            );
          })
        ) : (
          <></>
        )}
      </>
    );
  };

  const handleOpen = (id) => {
    setNoOfYears((prev) =>
      prev.map((obj, i) => {
        if (obj.key === id) return { ...obj, ["feeDetailsOpen"]: true };
        return obj;
      })
    );
  };

  const handleClose = (id) => {
    setNoOfYears((prev) =>
      prev.map((obj, i) => {
        if (obj.key === id) return { ...obj, ["feeDetailsOpen"]: false };
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
              school_id: studentData.school_id,
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

      const removeRepeatedYears = [...new Set(paidYears)];

      const feeRec = {
        active: true,
        ac_year_id: studentData.ac_year_id,
        bank_transaction_history_id: values.bankImportedId,
        receipt_type: "General",
        student_id: studentData.student_id,
        school_id: studentData.school_id,
        transaction_type: values.transactionType,
        remarks: values.narration,
        paid_amount: values.receivedAmount,
        received_in: values.receivedIn,
        hostel_status: 0,
        paid_year: removeRepeatedYears.toString(),
      };

      const bit = {
        active: true,
        amount: bankImportedDataById.amount,
        bank_inr_amt: bankImportedDataById.amount,
        bank_usd_amt: bankImportedDataById.usd,
        cheque_dd_no: bankImportedDataById.cheque_dd_no,
        deposited_bank_id: bankImportedDataById.deposited_bank_id,
        start_row: bankImportedDataById.start_row,
        end_row: bankImportedDataById.end_row,
        paid: values.receivedAmount,
        school_id: bankImportedDataById.school_id,
        student_id: studentId,
        transaction_date: bankImportedDataById.transaction_date,
        transaction_no: bankImportedDataById.transaction_no,
        transaction_remarks: bankImportedDataById.transaction_remarks,
        bank_import_transaction_id: values.bankImportedId,
        bank_name: bankName,
        voucher_head_new_id: bankImportedDataById.voucher_head_new_id,
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
      console.log(error);
      setAlertOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      <FormPaperWrapper>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
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
          <Grid item xs={12} md={2}>
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
                              <TableCell sx={{ width: "5%" }}>SL No.</TableCell>
                              <TableCell sx={{ width: "5%" }}>Select</TableCell>
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
                                    <TableCell>{obj.transaction_no}</TableCell>
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
                  ) : (
                    <></>
                  )}
                  {openBankImportedDataById ? (
                    <>
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
                  <Grid item xs={12}>
                    {noOfYears.length > 0 ? (
                      <>
                        {noOfYears.map((obj, i) => {
                          return (
                            <TableContainer
                              component={Paper}
                              elevation={2}
                              sx={{ marginBottom: 2 }}
                              key={i}
                            >
                              <Table size="small">
                                <TableBody>
                                  <StyledTableRow>
                                    <TableCell sx={{ width: "20%" }}>
                                      <Typography variant="subtitle2">
                                        {obj.label}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ width: "20%" }}>
                                      <Typography variant="subtitle2">
                                        Fixed
                                      </Typography>
                                    </TableCell>

                                    <TableCell sx={{ width: "20%" }}>
                                      <Typography variant="subtitle2">
                                        Due
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ width: "20%" }}>
                                      <FormGroup>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              size="small"
                                              name={obj.key}
                                              onChange={(e) =>
                                                handleCopy(e, obj.key)
                                              }
                                            />
                                          }
                                          label="Copy from due"
                                        ></FormControlLabel>
                                      </FormGroup>
                                    </TableCell>
                                    <TableCell sx={{ width: "2% !important" }}>
                                      <IconButton
                                        sx={{ padding: 0, transition: "1s" }}
                                      >
                                        {obj.feeDetailsOpen ? (
                                          <ArrowDropUpIcon
                                            onClick={() => handleClose(obj.key)}
                                          />
                                        ) : (
                                          <ArrowDropDownIcon
                                            onClick={() => handleOpen(obj.key)}
                                          />
                                        )}
                                      </IconButton>
                                    </TableCell>
                                  </StyledTableRow>

                                  {obj.feeDetailsOpen ? (
                                    rendeFeeDetails(obj.key)
                                  ) : (
                                    <></>
                                  )}
                                  <TableRow>
                                    <TableCell>
                                      <Typography variant="subtitle2">
                                        Total
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="subtitle2">
                                        {display.fee_template_sub_amount_format !==
                                          undefined &&
                                        display.fee_template_sub_amount_format !==
                                          null ? (
                                          Object.values(
                                            display
                                              ?.fee_template_sub_amount_format[
                                              obj.key
                                            ]
                                          ).reduce((a, b) => a + b)
                                        ) : (
                                          <></>
                                        )}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="subtitle2">
                                        {display.dueAmount !== undefined &&
                                        display.dueAmount !== null ? (
                                          Object.values(
                                            display?.dueAmount[obj.key]
                                          ).reduce((a, b) => a + b)
                                        ) : (
                                          <></>
                                        )}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                      <Typography variant="subtitle2">
                                        {data.postData !== undefined &&
                                        data.postData !== null ? (
                                          Object.values(
                                            data?.postData[obj.key]
                                          ).reduce((a, b) => a + b)
                                        ) : (
                                          <></>
                                        )}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          );
                        })}
                      </>
                    ) : (
                      <></>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer component={Paper} elevation={2}>
                      <Table size="small">
                        <TableHead>
                          <StyledTableRow>
                            <TableCell>
                              <Typography variant="subtitle2">Total</Typography>
                            </TableCell>
                            <TableCell sx={{ width: "1%" }}>{total}</TableCell>
                          </StyledTableRow>
                        </TableHead>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item xs={12} md={12} align="right" mt={2}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      disabled={loading || disable}
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
            </>
          ) : (
            <></>
          )}
        </Grid>
      </FormPaperWrapper>
    </>
  );
}

export default StudentReceipt;
