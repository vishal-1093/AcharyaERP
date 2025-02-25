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
  Tooltip,
  tooltipClasses,
  styled,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import StudentDetails from "../../../components/StudentDetails";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
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
  payingAmount: "",
  schoolId: null,
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

const requiredFields = ["transactionType", "receivedIn"];

function StudentReceipt() {
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState([]);
  const [openStudentData, setOpenStudentData] = useState(false);
  const [bankName, setBankName] = useState("");
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
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
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [testData, setTestData] = useState([]);
  const [inrValue, setInrValue] = useState();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();
  const navigate = useNavigate();

  const checks = {};

  useEffect(() => {
    getSchoolData();
    getInrValue();
    if (testData !== undefined) {
      const total = Object.values(testData).reduce((total, category) => {
        const categoryTotal = category.reduce(
          (sum, voucher) => sum + voucher.payingNow,
          0
        );
        return total + categoryTotal;
      }, 0);

      setTotal(total);
    }
  }, [testData]);

  useEffect(() => {
    getBankData();
  }, [values.schoolId]);

  const getInrValue = async () => {
    await axios
      .get(`/api/finance/allActiveDollarToInrConversion`)
      .then((res) => {
        const inr = res.data.data.reduce((max, obj) => {
          return obj.dollar_to_inr_id > max.dollar_to_inr_id ? obj : max;
        }, res.data.data[0]);
        setInrValue(inr);
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

          const startYear = dueResponse.data.data.Student_info[0]
            .old_std_id_readmn
            ? dueResponse.data.data.Student_info[0].semOrYear
            : 1;

          const years = [];
          if (
            studentDataResponse.data.data[0].program_type_name.toLowerCase() ===
            "yearly"
          ) {
            for (
              let i = startYear;
              i <= studentDataResponse.data.data[0].number_of_semester;
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
              let i = startYear;
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

          const readmissionStatus =
            dueResponse.data.data.Student_info[0].old_std_id_readmn;

          const readmissionYear =
            dueResponse.data.data.Student_info[0].semOrYear;

          setNoOfYears(years);

          // Create a mapping of voucherId to its label from responseTwo
          const voucherMapping = Ids.reduce((acc, { id, label }) => {
            acc[id] = label;
            return acc;
          }, {});

          const formattedData = Object.keys(
            dueResponse.data.data.dueAmount
          ).reduce((acc, key) => {
            const fees = dueResponse.data.data.dueAmount[key];
            const subamount =
              dueResponse.data.data.fee_template_sub_amount_format[key];
            const feeArray = Object.keys(fees).map((feeId) => {
              return {
                voucherId: parseInt(feeId),
                amount: fees[feeId],
                subamount: subamount[feeId],
                payingNow: 0,
                voucherHeadName: voucherMapping[feeId],
              };
            });
            acc[key] = feeArray;
            return acc;
          }, {});

          if (readmissionStatus) {
            formattedData[readmissionYear] = [
              {
                voucherId:
                  dueResponse.data.data.readmissionData.voucherHeadNewId,
                amount: dueResponse.data.data.readmissionData.dueAmount,
                payingNow: 0,
                voucherHeadName:
                  dueResponse.data.data.readmissionData.voucherHead,
                subamount: dueResponse.data.data.readmissionData.totalAmount,
              },
            ];
          }

          setVoucherHeadIds(Ids);

          setTestData(formattedData);

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

          setFirstData(formattedData);
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
    } else {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeAdvanceOne = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCheckBox = (e, id) => {
    setValues((prev) => ({ ...prev, bankImportedId: id }));
    getBankImportedDataById(id);
    getReceiptDetails(id);
  };

  const disabledFunction = (splitName, updatedData, firstData) => {
    // Reset disable state initially
    setDisable(false);

    // Define an array to store the total amount due and the total amount paid
    const allYears = noOfYears.map((obj) => obj.key); // Assuming noOfYears is an array of year objects
    const totalDueAmounts = [];
    const totalPaidAmounts = [];

    // Calculate the total amount due for each year
    allYears.forEach((year) => {
      if (testData && testData[year]) {
        totalDueAmounts.push(
          Object.values(testData[year]).reduce(
            (total, item) => total + Number(item.amount),
            0
          )
        );
      }
    });

    // Calculate the total amount paid by the user for each year
    allYears.forEach((year) => {
      if (testData && testData[year]) {
        totalPaidAmounts.push(
          Object.values(testData[year]).reduce(
            (total, item) => total + Number(item.payingNow),
            0
          )
        );
      }
    });

    // Find the last index where the user entered a payment
    const lastIndex = totalPaidAmounts
      .map((amount, index) => (amount > 0 ? index : -1))
      .reduce(
        (lastIdx, currentIdx) => (currentIdx > -1 ? currentIdx : lastIdx),
        -1
      );

    // Loop through each year up to the last index of entered payments
    for (let i = 0; i <= lastIndex; i++) {
      // Skip the current year validation (we are only comparing previous years)
      if (i === lastIndex) {
        continue;
      }

      // If the user has not paid enough to cover the dues for a previous year
      if (totalPaidAmounts[i] < totalDueAmounts[i]) {
        // Reset the data to its initial state if payment is insufficient
        setTestData(firstData); // firstData is the initial data (you might need to pass it into the function)

        // Show an alert message
        setAlertMessage({
          severity: "error",
          message: "Please clear your previous due before proceeding.",
        });
        setDisable(true); // Disable further changes
        setAlertOpen(true); // Open the alert
        return; // Prevent further processing
      }
    }

    // If all previous years' dues have been cleared, allow updates
    setData(updatedData);
    setDisable(false); // Allow updates for the current year
  };

  const handleCopy = (e, year) => {
    if (e.target.checked === true) {
      const dueData = testData[year];
      setDisable(false);
      setTestData((prev) => {
        const updatedData = { ...prev };

        updatedData[year] = dueData.map((item) => ({
          ...item,
          ["payingNow"]: item.amount > 0 ? item.amount : 0,
        }));

        return updatedData;
      });
    } else if (e.target.checked === false) {
      setDisable(true);

      setTestData((prev) => {
        const updatedData = { ...prev };
        updatedData[year] = firstData?.[year]?.map((item) => ({
          ...item,
          ["payingNow"]: 0,
        }));

        return updatedData;
      });
    }
  };

  const handleChangeOne = (e, year, voucherId) => {
    const splitName = e.target.name.split("-");
    setTestData((prev) => {
      const updatedData = { ...prev };

      const index = updatedData[year].findIndex(
        (item) => item.voucherId === voucherId
      );

      updatedData[year][index].payingNow = Number(e.target.value);

      return updatedData;
    });

    disabledFunction(splitName, testData, firstData);
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
        {testData?.[obj1].map((vouchers) => {
          if (vouchers.amount !== 0)
            return (
              <StyledTableRow>
                <TableCell>{vouchers.voucherHeadName}</TableCell>
                <TableCell>{vouchers.subamount ?? 0}</TableCell>
                <TableCell>{vouchers.amount ?? 0}</TableCell>
                <TableCell>
                  <CustomTextField
                    name={`payingNow-${obj1}-${vouchers.voucherId}`}
                    label=""
                    value={vouchers.payingNow}
                    handleChange={(e) =>
                      handleChangeOne(e, obj1, vouchers.voucherId)
                    }
                  />
                </TableCell>
                <TableCell></TableCell>
              </StyledTableRow>
            );
        })}
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
        testData[obj.key].forEach((voucherData) => {
          if (voucherData.payingNow > 0) {
            sph.push({
              active: true,
              balance_amount: (
                voucherData.amount - voucherData.payingNow
              ).toFixed(2),
              paid_year: obj.key,
              dollar_value: values.dollarValue,
              fee_template_id: feetemplateId,
              paid_amount: Math.round(Number(voucherData.payingNow)),
              remarks: values.narration,
              school_id: studentData.school_id,
              student_id: studentId,
              to_pay: Number(voucherData.amount),
              total_amount: Math.round(Number(values.receivedAmount))
                ? Math.round(Number(values.receivedAmount))
                : values.ddAmount,
              transcation_type: values.transactionType,
              voucher_head_new_id: voucherData.voucherId,
              inr_value:
                studentData.currency_type_name === "USD"
                  ? Math.round(Number(voucherData.payingNow) * inrValue.inr)
                  : Math.round(Number(voucherData.payingNow)),
            });
          }
        });
      });

      noOfYears.forEach((obj) => {
        testData[obj.key].forEach((voucherData) => {
          if (voucherData.payingNow > 0) {
            tr.push({
              active: true,
              auid: studentData.auid,
              bank_institute: values.bankName,
              dd_bank_name: values.bankName,
              dd_no: values.ddChequeNo,
              deposited_bank: values.bankId,
              remarks: values.narration,
              total_amount: values.receivedAmount
                ? Math.round(Number(values.receivedAmount))
                : values.ddAmount,
              total: Number(voucherData.payingNow),
              paid_year: obj.key,
              particulars: voucherData.voucherHeadName,
              paid_amount: Math.round(Number(voucherData.payingNow)),
              to_pay: Number(voucherData.amount),
              voucher_head_new_id: voucherData.voucherId,
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
              voucher_head: voucherData.voucherHeadName,
              usn: studentData.usn,
            });
          }
        });
      });

      noOfYears.forEach((obj) => {
        testData[obj.key].forEach((voucherData) => {
          if (voucherData.payingNow > 0) {
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
        paid_amount: values.receivedAmount
          ? values.receivedAmount
          : values.ddAmount,
        received_in: values.receivedIn,
        hostel_status: 0,
        paid_year: removeRepeatedYears.toString(),
        inr_value:
          studentData.currency_type_name === "USD"
            ? Math.round(Number(values.receivedAmount * inrValue.inr))
            : Math.round(Number(values.receivedAmount)),
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
        paid: values.receivedAmount ? values.receivedAmount : values.ddAmount,
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

      const ddPayload = {
        active: true,
        bank_name: values.bankName,
        dd_amount: values.ddAmount,
        dd_date: values.ddDate,
        dd_number: values.ddChequeNo,
        deposited_into: values.bankId,
        receipt_amount: total,
        receipt_type: "General",
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
        Number(values.ddAmount) === total
      ) {
        const res = await axios.post(`/api/finance/feeReceipt`, payload);
        if (res.status === 200 || res.status === 201) {
          axios.post(`/api/finance/ddDetails`, ddPayload);
          setAlertMessage({
            severity: "success",
            message: "Fee Receipt Created Successfully",
          });
          navigate(`/FeeReceiptDetailsPDFV1`, {
            state: {
              auid: studentData.auid,
              studentId: studentData.student_id,
              feeReceipt: res.data.data.fee_receipt,
              transactionType: values.transactionType,
              feeReceiptId: res.data.data.fee_receipt_id,
              financialYearId: res.data.data.financial_year_id,
            },
          });
        } else {
          setAlertMessage({
            severity: "success",
            message: "Fee Receipt Created Successfully",
          });
          navigate(`/FeeReceiptDetailsPDFV1`, {
            state: {
              auid: studentData.auid,
              studentId: studentData.student_id,
              feeReceipt: res.data.data.fee_receipt,
              transactionType: values.transactionType,
              feeReceiptId: res.data.data.fee_receipt_id,
              financialYearId: res.data.data.financial_year_id,
            },
          });
        }
      } else if (
        values.transactionType.toLowerCase() !== "dd" &&
        Number(values.receivedAmount) === total
      ) {
        setLoading(false);
        const res = await axios.post(`/api/finance/feeReceipt`, payload);

        setAlertMessage({
          severity: "success",
          message: "Fee Receipt Created Successfully",
        });
        navigate(`/FeeReceiptDetailsPDFV1`, {
          state: {
            auid: studentData.auid,
            studentId: studentData.student_id,
            feeReceipt: res.data.data.fee_receipt,
            transactionType: values.transactionType,
            feeReceiptId: res.data.data.fee_receipt_id,
            financialYearId: res.data.data.financial_year_id,
          },
        });
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
                  {values.transactionType.toLowerCase() === "cash" ? (
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

                  {values.transactionType.toLowerCase() === "dd" ? (
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
                                      <HtmlTooltip title={obj.cheque_dd_no}>
                                        <p>
                                          {obj.cheque_dd_no.length > 15
                                            ? obj.cheque_dd_no.slice(0, 15) +
                                              "..."
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

                  {studentData.currency_type_name === "USD" &&
                    values.receivedIn === "INR" && (
                      <Grid item xs={12} align="center">
                        <Typography variant="subtitle2" color="error">
                          Amount of{" "}
                          {Math.round(
                            Number(values.receivedAmount || values.ddAmount) *
                              inrValue.inr
                          )}{" "}
                          is being collected in INR
                        </Typography>
                      </Grid>
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
                                    {/* <TableCell sx={{ width: "20%" }}>
                                      <Typography variant="subtitle2">
                                        P@B
                                      </Typography>
                                    </TableCell> */}

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
                                        {testData[obj.key]
                                          ?.filter((item) => item.amount > 0)
                                          .reduce(
                                            (total, sum) =>
                                              Number(total) +
                                              Number(sum.subamount),
                                            0
                                          ) ?? 0}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="subtitle2">
                                        {testData[obj.key].reduce(
                                          (total, sum) =>
                                            Number(total) + Number(sum.amount),
                                          0
                                        )}
                                      </Typography>
                                    </TableCell>

                                    <TableCell sx={{ textAlign: "center" }}>
                                      <Typography variant="subtitle2">
                                        {testData !== undefined &&
                                        testData !== null ? (
                                          testData[obj.key].reduce(
                                            (a, b) => a + b.payingNow,
                                            0
                                          )
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
