import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
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
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { makeStyles } from "@mui/styles";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import StudentDetails from "../../../components/StudentDetails";

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

const requiredFields = [];

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.auzColor,
    color: theme.palette.headerWhite,
    textAlign: "center",
    padding: "5px",
    borderRadius: "2px",
  },
  yearSem: {
    color: theme.palette.error,
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

function FeeTransfer() {
  const [values, setValues] = useState(initialValues);

  const [studentData, setStudentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [noOfYears, setNoOfYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feetemplateId, setFeetemplateId] = useState();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [studentId, setStudentId] = useState();
  const location = useLocation();
  const rowData = location.state.row;

  const [receiptDetails, setReceiptDetails] = useState([]);

  const [oldStudentId, setOldStudentId] = useState(null);

  const [display, setDisplay] = useState([]);
  const [voucherHeadIds, setVoucherHeadIds] = useState([]);
  const [showData, setShowData] = useState();
  const [receiptData, setReceiptData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();
  const { r, auid } = useParams();

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
    const temp = [];
    receiptData.forEach((obj) => {
      if (obj.isChecked === true) {
        temp.push(obj);
      }
    });

    const sumone = temp.reduce((a, b) => {
      return a + b.paid_amount;
    }, 0);
    setValues((prev) => ({ ...prev, receivedAmount: sumone }));
  }, [receiptData]);

  useEffect(() => {
    getStudentData();
  }, [auid]);

  const getStudentData = async () => {
    try {
      const res1 = await axios.get(`/api/student/Student_Details/${auid}`);
      const oldAuid = res1.data.data.auid;

      const inactiveStudentRes = await axios.get(
        `/api/student/inActiveStudentDetailsByAuid/${oldAuid}`
      );

      const studentData = inactiveStudentRes.data.data;

      if (studentData.length > 0) {
        setOldStudentId(rowData?.old_student_id);
        setFeetemplateId(studentData[0].fee_template_id);
        setStudentId(rowData?.id);
        setStudentData(studentData[0]);

        const years = [];
        const yearsValue = {};
        const showTable = {};

        const programType = studentData[0].program_type_name?.toLowerCase();

        if (programType === "yearly" || programType === "semester") {
          const labelType = programType === "yearly" ? "Year" : "Sem";

          for (let i = 1; i <= 2; i++) {
            years.push({ key: i, label: labelType + i });
            yearsValue[labelType.toLowerCase() + i] = 0;
            showTable[i] = true;
          }
        }

        setNoOfYears(years);
        setOpen(true);
        setShowData(showTable);

        const receiptRes = await axios.get(
          `/api/finance/feeReceiptByStudentIdForReceiptTransfer/${rowData?.old_student_id}`
        );
        const status = receiptRes.data.data.map((obj) => ({
          ...obj,
          submittedStatus: false,
        }));
        setReceiptData(status);

        const dueAmountRes = await axios.get(
          `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${rowData?.id}`
        );

        const Ids = dueAmountRes.data.data.fee_template_sub_amount_info.map(
          (obj) => ({
            id: obj.voucher_head_new_id,
            label: obj.voucher_head,
          })
        );

        const temp = {};
        const mainData = {};
        setVoucherHeadIds(Ids);
        setDisplay(dueAmountRes.data.data);

        years.forEach((val) => {
          Ids.forEach((obj) => {
            temp[obj.id] = 0;
            mainData[val.key] = { ...temp };
          });
        });

        setData((prev) => ({
          ...prev,
          postData: mainData,
        }));
      } else {
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (values.receivedAmount && total > values.receivedAmount) {
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
      voucherHeadIds?.forEach((obj1) => {
        if (
          data.postData[obj.key][obj1.id] >
          display.fee_template_sub_amount_format[obj.key][obj1.id]
        ) {
          setAlertMessage({ severity: "error", message: "test" });
          setAlertOpen(true);
        }
      });
    });
  }, [noOfYears, voucherHeadIds, data.postData, display]);

  useEffect(() => {
    getDetailsofReceipt();
  }, [values.bankImportedId]);

  const checks = {};

  const getDetailsofReceipt = async () => {
    if (values.bankImportedId)
      await axios
        .get(`/api/finance/allRTGSFeeHistoryDetails/${values.bankImportedId}`)
        .then((res) => {
          setReceiptDetails(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll" && checked === true) {
      let tempUser = receiptData.map((test) => {
        return { ...test, isChecked: checked };
      });
      setReceiptData(tempUser);

      setValues({
        ...values,
        feeReceipt: receiptData.map((obj) => obj.fee_receipt).toString(),
      });
    } else if (name === "selectAll" && checked === false) {
      let tempUser = receiptData.map((test) => {
        return { ...test, isChecked: checked };
      });
      setReceiptData(tempUser);

      setValues({
        ...values,
        transferAmount: [],
      });
    } else if (name !== "selectAll" && checked === true) {
      const tempData = receiptData.map((obj) => {
        if (obj.fee_receipt === e.target.name) {
          return { ...obj, isChecked: true };
        }

        if (obj.fee_receipt !== e.target.name) {
          return { ...obj, submittedStatus: true };
        }
        return obj;
      });

      setReceiptData(tempData);
      const newTemp = [];
      tempData.forEach((obj) => {
        if (obj.isChecked === true) {
          newTemp.push(obj.fee_receipt);
        }
      });
      setValues({
        ...values,
        feeReceipt: newTemp.toString(),
      });
    } else if (name !== "selectAll" && checked === false) {
      const tempData = receiptData.map((obj) => {
        if (obj.fee_receipt === e.target.name) {
          return { ...obj, isChecked: false };
        }

        if (obj.fee_receipt !== e.target.name) {
          return { ...obj, submittedStatus: false };
        }
        return obj;
      });

      setReceiptData(tempData);

      const existData = [];

      values.feeReceipt.split(",").forEach((obj) => {
        existData.push(obj);
      });

      const index = existData.indexOf(e.target.value);

      if (index > -1) {
        existData.splice(index, 1);
      }

      setValues({
        ...values,
        feeReceipt: existData.toString(),
      });
    }
  };

  const handleChange = async (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
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

      const newTemp = [];

      receiptData?.forEach((obj) => {
        noOfYears?.forEach((obj1) => {
          voucherHeadIds?.forEach((obj2) => {
            if (
              obj.isChecked === true &&
              data.postData[obj1.key][obj2.id] > 0
            ) {
              newTemp?.push({
                isChecked: obj.isChecked,
                active: true,
                fee_receipt: obj.fee_receipt,
                fee_receipt_id: obj.id,
                financial_year_id: obj.financial_year_id,
                bank_id: obj.bank_id,
                transcation_type: obj.transaction_type,
                year_back_status: obj.year_back_status,
                type: obj.type,
                balance_amount: (
                  display.dueAmount[obj1.key][obj2.id] -
                  data.postData[obj1.key][obj2.id]
                )?.toFixed(2),
                paid_year: obj1.key,
                remarks: values.remarks,
                total_amount: values.receivedAmount,
                total_amount_som: values.receivedAmount,
                total: total,
                total_som: total,
                paid_amount: Number(data.postData[obj1.key][obj2.id]),
                paid_amount_som: data.postData[obj1.key][obj2.id],
                to_pay: Number(
                  display.fee_template_sub_amount_format[obj1.key][obj2.id]
                ),
                to_pay_som:
                  display.fee_template_sub_amount_format[obj1.key][obj2.id],
                voucher_head_new_id: obj2.id,
                student_id: studentId,
                fee_template_id: feetemplateId,
              });
            }
          });
        });
      });

      await axios
        .put(
          `/api/finance/feeReceiptTransfer/${oldStudentId}/${studentId}`,
          newTemp
        )
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Fee Transferred Successfully",
            });
            getStudentData();
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
  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={2} lg={1.5}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={4.5}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
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
          <Grid item xs={12}>
            {/* Student Details */}
            <Grid item xs={12}>
              <StudentDetails id={studentId} />
            </Grid>
            {open ? (
              <Grid container mt={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader
                      title="Old Student Details"
                      titleTypographyProps={{
                        variant: "subtitle2",
                      }}
                      sx={{
                        backgroundColor: "tableBg.main",
                        color: "tableBg.textColor",
                        textAlign: "center",
                        padding: 1,
                      }}
                    />
                    <CardContent>
                      <Grid container columnSpacing={2} rowSpacing={1}>
                        <DisplayContent label="AUID" value={studentData.auid} />
                        <DisplayContent
                          label="Student Name"
                          value={studentData.student_name}
                        />
                        <DisplayContent
                          label="USN"
                          value={studentData.usn ?? "-"}
                        />
                        <DisplayContent
                          label="DOA"
                          value={moment(studentData.date_of_admission).format(
                            "DD-MM-YYYY"
                          )}
                        />
                        <DisplayContent
                          label="School"
                          value={studentData.school_name}
                        />
                        <DisplayContent
                          label="Program"
                          value={`${studentData.program_short_name} - ${studentData.program_specialization_short_name}`}
                        />
                        <DisplayContent
                          label="Academic Batch"
                          value={studentData.ac_year}
                        />
                        <DisplayContent
                          label="Current Year/Sem"
                          value={`${studentData.current_year}/${studentData.current_sem}`}
                        />
                        <DisplayContent
                          label="Fee Template"
                          value={`${studentData.fee_template_name} - ${
                            studentData.program_type_name === "Semester"
                              ? "S"
                              : "Y"
                          }`}
                        />
                        <DisplayContent
                          label="Admission Category"
                          value={`${studentData.fee_admission_category_type}`}
                        />
                        <DisplayContent
                          label="Acharya Email"
                          value={studentData.acharya_email}
                        />
                        <DisplayContent
                          label="Mobile No."
                          value={studentData.mobile}
                        />
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                {/* Receipts Section */}
                {receiptData.length > 0 ? (
                  <>
                    {" "}
                    <Grid item xs={12} mt={3}>
                      <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Receipts
                        </Typography>
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Select</StyledTableCell>
                                <StyledTableCell>Receipt No.</StyledTableCell>
                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell>Old auid</StyledTableCell>
                                <StyledTableCell>Amount</StyledTableCell>
                                <StyledTableCell>User</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {receiptData?.map((obj, i) => (
                                <TableRow key={i}>
                                  <StyledTableCell>
                                    <Checkbox
                                      sx={{
                                        "& .MuiSvgIcon-root": { fontSize: 15 },
                                      }}
                                      name={obj.fee_receipt}
                                      value={obj.fee_receipt}
                                      onChange={handleChangeCheckbox}
                                      checked={obj?.isChecked || false}
                                      disabled={obj.submittedStatus}
                                    />
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {obj.fee_receipt}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {moment(obj.modified_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </StyledTableCell>
                                  <StyledTableCell>{obj.auid}</StyledTableCell>
                                  <StyledTableCell>
                                    {obj.paid_amount}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {obj.created_by}
                                  </StyledTableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Grid>
                    {/* Year Sem Section */}
                    {noOfYears?.map((yearObj, i) => (
                      <Grid item xs={12} key={i} mt={3}>
                        <Paper elevation={3} sx={{ padding: 2 }}>
                          <Typography variant="h6">
                            {yearObj.label}
                            <VisibilityIcon
                              fontSize="small"
                              sx={{
                                marginLeft: 2,
                                color: "#4A57A9",
                                cursor: "pointer",
                              }}
                              onClick={() => handleClick(yearObj.key)}
                            />
                          </Typography>
                          <Collapse in={showData[yearObj.key]}>
                            <TableContainer>
                              <Table size="small">
                                <TableHead sx={{ backgroundColor: "#4A57A9" }}>
                                  <TableRow>
                                    <TableCell sx={{ color: "white" }}>
                                      Heads
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                      Fixed
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                      Grant
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                      Due
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                      Payment
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {voucherHeadIds?.map(
                                    (voucher, j) =>
                                      display?.fee_template_sub_amount_format[
                                        yearObj.key
                                      ][voucher.id] > 0 && (
                                        <TableRow key={j}>
                                          <TableCell>{voucher.label}</TableCell>
                                          <TableCell>
                                            {
                                              display
                                                ?.fee_template_sub_amount_format[
                                                yearObj.key
                                              ][voucher.id]
                                            }
                                          </TableCell>
                                          <TableCell>
                                            {display
                                              ?.scholarship_approval_amount?.[
                                              yearObj.key
                                            ]?.[voucher.id] ?? 0}
                                          </TableCell>
                                          <TableCell>
                                            {display?.dueAmount[yearObj.key]?.[
                                              voucher.id
                                            ] ?? 0}
                                          </TableCell>
                                          <TableCell>
                                            <CustomTextField
                                              name={`${voucher.id}-${yearObj.key}`}
                                              value={
                                                data?.postData[yearObj.key]?.[
                                                  voucher.id
                                                ] || ""
                                              }
                                              handleChange={handleChangeOne}
                                            />
                                          </TableCell>
                                        </TableRow>
                                      )
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Collapse>
                        </Paper>
                      </Grid>
                    ))}
                    {/* Total Section */}
                    <Grid item xs={12} mt={3}>
                      <Card elevation={4} sx={{ padding: 2 }}>
                        <Grid container alignItems="center">
                          <Grid item xs={6}>
                            <Typography variant="h6" color="primary">
                              Total Amount
                            </Typography>
                          </Grid>
                          <Grid item xs={6} align="right">
                            <Typography variant="h6" color="secondary">
                              {total}{" "}
                              {/* Display the total amount dynamically */}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                    {/* Transfer Button */}
                    <Grid item xs={12} align="right" mt={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreate}
                        sx={{ borderRadius: 7 }}
                        disabled={total === 0 ? true : false}
                      >
                        {loading ? (
                          <CircularProgress size={25} color="inherit" />
                        ) : (
                          "Transfer"
                        )}
                      </Button>
                    </Grid>{" "}
                  </>
                ) : (
                  <Grid
                    container
                    sx={{ display: "flex", justifyContent: "center" }}
                    pt={3}
                    pb={3}
                  >
                    <h3>No Receipt Data found!!!</h3>
                  </Grid>
                )}
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

export default FeeTransfer;
