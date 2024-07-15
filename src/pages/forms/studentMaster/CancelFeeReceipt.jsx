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
    fontSize: 14,
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

  const [rowTotal, setRowTotal] = useState([]);
  const [bulkReceiptData, setBulkReceiptData] = useState([]);
  const [receiptType, setReceiptType] = useState("");

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getFinancialYearData();
    setCrumbs([
      { name: "Cancelled Fee Receipt Index", link: "/Cancelfeereceiptindex" },
    ]);
  }, []);

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
        `/api/finance/getDataForDisplayingAndCancelFeeReceipt?financial_year_id=${values.financialYearId}&school_id=1&fee_receipt=${values.receiptNo}`
      )
      .then((res) => {
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
            res.data.data.payment_details.length > 0 ||
            res.data.data.student_details.length > 0
          ) {
            setStudentDetailsOpen(true);
            const uniqueChars = res.data.data.payment_details.filter(
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
            res.data.data.payment_details.forEach((item) => {
              temp[item.paid_year] = Object.values(rest)
                .map((obj) => obj[item.paid_year])
                .reduce((a, b) => a + b);
            });

            setRowTotal(temp);

            setVoucherIds(uniqueChars);
            setStudentData(res.data.data.student_details[0]);
            setVoucherData(res.data.data.payment_details);
            setVoucherDataOne(res.data.data);
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
        temp.school_id = 1;
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
              window.location.reload();
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
          {/* <Grid item xs={12} md={3}>
            <CustomSelect
              name="receiptType"
              value={values.receiptType}
              label="Receipt Type"
              items={[
                {
                  value: "general",
                  label: "General",
                },
                {
                  value: "Bulk",
                  label: "Bulk",
                },
                { value: "hostel", label: "Hostel" },
              ]}
              handleChange={handleChange}
            />
          </Grid> */}
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

          <Grid item textAlign="right">
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
                <strong>Go</strong>
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
                          {studentData.current_sem
                            ? studentData.current_sem
                            : studentData.current_year}
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
                  marginTop={4}
                >
                  <Grid item xs={10} align="center">
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              Heads
                            </StyledTableCell>
                            {voucherData.map((obj, i) => {
                              return (
                                <StyledTableCell
                                  key={i}
                                  sx={{ textAlign: "center" }}
                                >
                                  {"Sem" + obj.paid_year}
                                </StyledTableCell>
                              );
                            })}
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              Total
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {voucherIds.map((obj, i) => {
                            return (
                              <StyledTableCell
                                key={i}
                                sx={{ textAlign: "center" }}
                              >
                                {obj.voucher_head}
                              </StyledTableCell>
                            );
                          })}
                          {voucherData.length > 0 ? (
                            voucherData.map((obj, i) => {
                              return voucherIds.map((obj1, j) => {
                                return (
                                  <>
                                    <StyledTableCell
                                      key={j}
                                      sx={{ textAlign: "center" }}
                                    >
                                      {
                                        voucherDataOne[
                                          obj1.voucher_head_new_id
                                        ][obj.paid_year]
                                      }
                                    </StyledTableCell>
                                  </>
                                );
                              });
                            })
                          ) : (
                            <></>
                          )}
                          {voucherIds.map((obj, i) => {
                            return (
                              <StyledTableCell
                                key={i}
                                sx={{ textAlign: "center" }}
                              >
                                {Object.values(
                                  voucherDataOne[obj.voucher_head_new_id]
                                ).length > 0
                                  ? Object.values(
                                      voucherDataOne[obj.voucher_head_new_id]
                                    ).reduce((a, b) => {
                                      const x = Number(a) > 0 ? Number(a) : 0;
                                      const y = Number(b) > 0 ? Number(b) : 0;
                                      return x + y;
                                    })
                                  : 0}
                              </StyledTableCell>
                            );
                          })}
                          <TableRow>
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              Total
                            </StyledTableCell>
                            {voucherData.length > 0 ? (
                              voucherData.map((obj, i) => {
                                return (
                                  <StyledTableCell
                                    sx={{ textAlign: "center" }}
                                    key={i}
                                  >
                                    {rowTotal[obj.paid_year]}
                                  </StyledTableCell>
                                );
                              })
                            ) : (
                              <></>
                            )}
                            <StyledTableCell sx={{ textAlign: "center" }}>
                              {voucherData?.[0]?.total_amount}
                            </StyledTableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
                <Grid item xs={12} ml={8} md={3} mt={2}>
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
                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                    onClick={handleCancel}
                  >
                    Cancel
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
