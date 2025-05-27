import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Paper,
  styled,
  tableCellClasses,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import CancelBulkReceipt from "./CancelBulkReceipt";

const initialValues = {
  financialYearId: "",
  receiptNo: "",
  receiptType: "",
  remarks: "",
};

const requiredFields = ["remarks"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  },
}));

function CancelFeeReceipt() {
  const [values, setValues] = useState(initialValues);
  const [financialYearOptions, setFinancialYearOptions] = useState([]);
  const [bookId, setBookId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentDetailsOpen, setStudentDetailsOpen] = useState(false);
  const [voucherData, setVoucherData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [studentData, setStudentData] = useState([]);
  const [voucherDataOne, setVoucherDataOne] = useState([]);
  const [voucherIds, setVoucherIds] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [voucherHeadNames, setVoucherHeadNames] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [yearWiseData, setYearWiseData] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);

  const [rowTotal, setRowTotal] = useState([]);
  const [bulkReceiptData, setBulkReceiptData] = useState([]);
  const [receiptType, setReceiptType] = useState("");

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getFinancialYearData();
    getSchoolDetails();
    setCrumbs([
      { name: "Cancel Fee Receipt", link: "/feereceipt-cancel-index" },
    ]);
  }, []);

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const list = res.data.data?.filter((ele)=>!ele.school_name?.includes("Acharya Hostels"));
        const schoolList = list?.map((li)=>({value:li.school_id,label:li.school_name,school_name_short:li.school_name_short}))
        setSchoolOptions(schoolList);
      })
      .catch((err) => console.error(err));
  };

  const getFinancialYearData = async () => {
    await axios
      .get(`/api/FinancialYear`)
      .then((res) => {
        setFinancialYearOptions(
          res.data.data.map((obj) => ({
            value: obj.financial_year_id,
            label: obj.financial_year,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const checks = { remarks: [values.remarks !== ""] };

  const errorMessages = { remarks: ["This field is required"] };

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
    await axios
      .get(
        `/api/finance/getDataForDisplayingAndCancelFeeReceipt?financial_year_id=${values.financialYearId}&school_id=${values.schoolId}&fee_receipt=${values.receiptNo}`
      )
      .then((res) => {
        const voucherIds = res?.data?.data?.payment_details?.map(
          (vouchers) => vouchers.voucher_head_new_id
        );

        const paidYears = res?.data?.data?.payment_details?.map(
          (vouchers) => vouchers.paid_year
        );

        const uniqueVoucherHeads = res?.data?.data?.payment_details?.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.voucher_head_new_id === value.voucher_head_new_id
            )
        );

        const filteredVoucherIds = [...new Set(voucherIds)];

        const filteredYears = [...new Set(paidYears)];

        setNoOfYears(filteredYears);
        setVoucherHeadNames(uniqueVoucherHeads);

        const dataByVoucher = {};

        res?.data?.data?.payment_details?.forEach((item) => {
          const key = `${item.paid_year}-${item.voucher_head_new_id}`;

          if (!dataByVoucher[key]) {
            dataByVoucher[key] = [];
          }

          dataByVoucher[key]?.push(item);

          return dataByVoucher;
        });

        const VoucherWiseData = res?.data?.data?.payment_details?.reduce(
          (acc, voucherId) => {
            const value = res?.data?.data?.payment_details?.filter(
              (item) =>
                item.voucher_head_new_id === voucherId.voucher_head_new_id
            );

            acc[voucherId.voucher_head_new_id] = value;
            return acc;
          },
          {}
        );

        const YearWiseData = res?.data?.data?.payment_details?.reduce(
          (acc, paidYear) => {
            const value = res?.data?.data?.payment_details?.filter(
              (item) => item.paid_year === paidYear.paid_year
            );

            acc[paidYear.paid_year] = value;
            return acc;
          },
          {}
        );

        setYearWiseData(YearWiseData);

        setVoucherHeads(VoucherWiseData);

        setTableData(dataByVoucher);

        setReceiptType(res.data.data.student_details[0].receipt_type);
        if (res.data.data.student_details[0].receipt_type === "Bulk") {
          if (
            res.data.data.Voucher_Head_Wise_Amount.length > 0 ||
            res.data.data.student_details.length > 0
          ) {
            setBulkReceiptData(res.data.data.Voucher_Head_Wise_Amount);
            setStudentData(res.data.data.student_details);
          } else {
            setAlertMessage({
              severity: "error",
              message: "Fee receipt not found",
            });
            setAlertOpen(true);
          }
        } else {
          if (
            res.data.data.payment_details?.length > 0 ||
            res.data.data.student_details?.length > 0
          ) {
            setStudentData(res.data.data.student_details[0]);
            setVoucherData(res.data.data.payment_details);
            setVoucherDataOne(res.data.data);
            setStudentDetailsOpen(true);
            const uniqueChars = res.data.data.payment_details?.filter(
              (obj, index) => {
                return (
                  index ===
                  res.data.data.payment_details.findIndex(
                    (o) =>
                      obj.voucher_head_new_id === o.voucher_head_new_id &&
                      obj.voucher_head === o.voucher_head
                  )
                );
              }
            );

            const { student_details, payment_details, ...rest } = res.data.data;
            const temp = {};
            res.data.data.payment_details?.forEach((item) => {
              temp[item.paid_year] = Object?.values(rest)
                ?.map((obj) => obj[item.paid_year])
                .reduce((a, b) => a + b);
            });

            setRowTotal(temp);

            setVoucherIds(uniqueChars);
          } else {
            setStudentDetailsOpen(false);
            setAlertMessage({
              severity: "error",
              message: "Fee receipt not found",
            });
            setAlertOpen(true);
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const handleCancel = () => {
    setModalOpen(true);
    const handleToggle = async () => {
      if (!requiredFieldsValid()) {
        setAlertMessage({
          severity: "error",
          message: "Please fill all the required fields",
        });
        setAlertOpen(true);
      } else {
        const temp = {};

        temp.fee_receipt_id = studentData.fee_receipt_id;
        temp.amount_in_som = voucherData[0].total_amount_som;
        temp.student_id = studentData.student_id;
        temp.fee_receipt = studentData.fee_receipt;
        temp.transaction_type = voucherData[0].transcation_type;
        temp.school_id = values.schoolId;
        temp.received_in = values.receiptType;
        temp.financial_year_id = values.financialYearId;
        temp.cheque_dd_no = studentData.cheque_dd_no;
        temp.fee_template = studentData.fee_template_name;
        temp.bank_name = studentData.bank_name;
        temp.amount = voucherData[0].total_amount;
        temp.remarks = values.remarks;

        await axios
          .post(`/api/finance/cancelFeeReceipt`, temp)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              setAlertMessage({
                severity: "success",
                message: "Receipt Cancelled Successfully",
              });
              setAlertOpen(true);
              navigate("/feereceipt-cancel-index")
            } else {
              setAlertMessage({
                severity: "error",
                message: res.data.message,
              });
            }
            setAlertOpen(true);
          })
          .catch((err) => {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: err.response.data
                ? err.response.data.message
                : "Error submitting",
            });
            setAlertOpen(true);
            console.error(err);
          });
      }
    };
    setModalContent({
      title: "",
      message: "Are you sure you want to cancel the receipt ?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <FormPaperWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="financialYearId"
              label="Financial Year"
              value={values.financialYearId}
              options={financialYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="receiptNo"
              label="Receipt No"
              value={values.receiptNo}
              handleChange={handleChange}
              checks={checks.booksAvailable}
              errors={errorMessages.booksAvailable}
              required
            />
          </Grid>

          <Grid item xs={2} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !( values.financialYearId && values.schoolId && values.receiptNo)}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Submit</strong>
              )}
            </Button>
          </Grid>
          <Grid item xs={12} md={12}>
            {(bulkReceiptData.length > 0 || studentData.length > 0) &&
            receiptType === "Bulk" ? (
              <CancelBulkReceipt
                bulkReceiptData={bulkReceiptData}
                studentData={studentData}
                data={values}
              />
            ) : studentDetailsOpen ? (
              <>
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
                          {studentData?.auid}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">School</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData?.school_name_short}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Name</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData?.student_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Program</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData?.program_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">DOA</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {moment(studentData?.date_of_admission).format(
                            "DD-MM-YYYY"
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Year/Sem</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.current_year ? studentData.current_year:"-"}/{studentData.current_sem ? studentData.current_sem:"-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Template</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData?.fee_template_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Mobile</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData?.mobile}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  marginTop={2}
                >
                  <Grid item xs={10} align="center">
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Heads</StyledTableCell>
                            {noOfYears.map((obj, i) => {
                              return (
                                <StyledTableCell key={i}>
                                  {"Sem" + obj}
                                </StyledTableCell>
                              );
                            })}
                            <StyledTableCell>Total</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {voucherHeadNames?.map((obj) => {
                            return (
                              <>
                                <TableRow>
                                  <TableCell>{obj.voucher_head}</TableCell>
                                  {noOfYears?.map((year) => {
                                    return (
                                      <>
                                        <TableCell style={{paddingLeft:"40px"}}>
                                          {tableData?.[
                                            `${year}-${obj.voucher_head_new_id}`
                                          ]?.[0]?.paid_amount ?? 0}
                                        </TableCell>
                                      </>
                                    );
                                  })}

                                  <TableCell style={{paddingLeft:"40px"}}>
                                    {voucherHeads?.[
                                      obj.voucher_head_new_id
                                    ]?.reduce(
                                      (total, sum) =>
                                        Number(total) + Number(sum.paid_amount),
                                      0
                                    )}
                                  </TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                          <TableRow>
                            <TableCell>Total</TableCell>
                            {noOfYears.length > 0 ? (
                              noOfYears.map((obj, i) => {
                                return (
                                  <TableCell key={i} style={{paddingLeft:"40px"}}>
                                    {yearWiseData?.[obj]?.reduce(
                                      (sum, total) =>
                                        Number(sum) + Number(total.paid_amount),
                                      0
                                    )}
                                  </TableCell>
                                );
                              })
                            ) : (
                              <></>
                            )}
                            <TableCell style={{paddingLeft:"40px"}}>
                              {voucherData?.[0]?.total_amount}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
                  <Grid item xs={12} mt={2}>
                    <Grid container sx={{alignItems:"center",justifyContent:"center"}}>
                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          multiline
                          rows={2}
                          name="remarks"
                          label="Remarks"
                          value={values.remarks}
                          handleChange={handleChange}
                          checks={checks.remarks}
                          errors={errorMessages.remarks}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                    onClick={handleCancel}
                  >
                   Submit
                  </Button>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default CancelFeeReceipt;
