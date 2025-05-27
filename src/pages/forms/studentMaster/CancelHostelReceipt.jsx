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
import CustomSelect from "../../../components/Inputs/CustomSelect";

const initialValues = {
  financialYearId: "",
  receiptNo: "",
  receiptType: "",
  remarks: "",
};

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

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

function CancelHostelReceipt() {
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
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getFinancialYearData();
    getSchoolDetails();
    setCrumbs([{ name: "Cancel Hostel Receipt",link:"/feereceipt-cancel-index" }]);
  }, []);

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj?.school_id,
            label: obj?.school_name,
            school_name_short: obj?.school_name_short,
          });
        });
        setSchoolOptions(optionData);
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
    setStudentData([]);
    setVoucherHeads([]);

    let apiUrl;

    try {
      if (values.receiptType === "general") {
        apiUrl = `/api/finance/getHostelFeeReceiptVoucherHeadWiseDetails?financial_year_id=${values.financialYearId}&fee_receipt=${values.receiptNo}&receipt_type=HOS`;
      } else {
        apiUrl = `api/finance/feeReceiptDetailForHostel?financialYearId=${values.financialYearId}&feeReceipt=${values.receiptNo}&feeReceiptId=7848&receiptType=HOSB`;
      }

      const response = await axios.get(`${apiUrl}`);

      if (
        values.receiptType === "general" &&
        response.data.data.body.voucherheadwiseData.length > 0
      ) {
        setStudentData(response.data.data.body.feeReceipt);
        setVoucherHeads(response.data.data.body.voucherheadwiseData);
      } else if (
        values.receiptType === "bulk" &&
        response.data.data.voucherheadwiseData.length > 0
      ) {
        setStudentData(response.data.data.feeReceipt);
        setVoucherHeads(response.data.data.voucherheadwiseData);
      } else {
        setAlertMessage({ severity: "error", message: "NO DATA FOUND !!!" });
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error?.response?.data?.message,
      });
      setAlertOpen(true);
      console.log(error);
    }
  };

  const handleCancel = () => {
    setModalOpen(true);
    const handleToggle = async () => {
      const postData = {
        fee_receipt: values.receiptNo,
        school_id: studentData?.student_id,
        financial_year_id: values.financialYearId,
        cancel_date: new Date(),
        cancel_remarks: values.remarks,
        cancel_by: userID,
        inr_amount: voucherHeads?.[0]?.total_amount,
        paid_amount: voucherHeads?.[0]?.total_amount,
        active: true,
      };

      let deleteApiUrl;

      if (values.receiptType === "general") {
        deleteApiUrl = `/api/finance/inActivateFeeReceiptNumber?financial_year_id=${values.financialYearId}&fee_receipt=${values.receiptNo}&receipt_type=HOS`;
      } else {
        // deleteApiUrl = `api/finance/deactivateFeeReceiptOfHostel?feeReceiptId=712&hosFeeRcptVoucHeadIds=1,2,3`;
      }

      try {
        await axios.delete(`${deleteApiUrl}`);

        try {
          const response2 = await axios.post(
            `/api/finance/saveCancelledHostelFeeReceipts`,
            postData
          );

          if (response2.status == 200 || response2.status == 201) {
            setAlertMessage({
              severity: "success",
              message: "Cancelled Successfully",
            });
            setAlertOpen(true);
            setVoucherHeads([]);
            setStudentData([]);
            setValues(initialValues);
          }
        } catch (error) {
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
          setAlertOpen(true);
          console.log(error);
        }
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
        setAlertOpen(true);
        console.log(error);
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
            <CustomSelect
              name="receiptType"
              label="Receipt Type"
              value={values.receiptType}
              items={[
                { label: "General", value: "general" },
                { label: "Bulk", value: "bulk" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="financialYearId"
              label="Financial Year"
              value={values.financialYearId}
              options={financialYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!values.receiptType}
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
              disabled={!values.receiptType}
              required
            />
          </Grid>

          <Grid item xs={12} md={6} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !(values.financialYearId && values.receiptNo)}
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

          {voucherHeads?.length > 0 ? (
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
                        {`${studentData?.current_year}/${studentData?.current_sem}`}
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

              <Grid item xs={6} align="center">
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Heads</StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "right" }}>
                          Paid Amount
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {voucherHeads.map((obj) => {
                        return (
                          <>
                            <TableRow>
                              <TableCell>{obj.voucher_head}</TableCell>
                              <TableCell sx={{ textAlign: "right" }}>
                                {obj.paying_amount}
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                      <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {voucherHeads?.[0]?.total_amount}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={8}>
                <CustomTextField
                  rows={2}
                  multiline
                  name="remarks"
                  label="Cancelled Remarks"
                  value={values.remarks}
                  handleChange={handleChange}
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
      </FormPaperWrapper>
    </Box>
  );
}

export default CancelHostelReceipt;
