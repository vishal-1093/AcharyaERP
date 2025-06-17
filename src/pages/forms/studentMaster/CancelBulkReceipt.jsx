import { useState } from "react";
import {
  Grid,
  Button,
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
import { useNavigate } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";

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

function CancelBulkReceipt({ bulkReceiptData, studentData, data }) {
  const [values, setValues] = useState(initialValues);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
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

  const handleCancel = () => {
    setModalOpen(true);
    const handleToggle = async () => {
      if (!requiredFieldsValid()) {
        setAlertMessage({
          severity: "error",
          message: "Please fill required fields",
        });
        setAlertOpen(true);
      } else {
        const temp = {};
        temp.bulk_fee_receipt_id = bulkReceiptData[0].bulk_fee_receipt_id;
        temp.bulk_fee_receipt = bulkReceiptData[0].bulk_fee_receipt;
        temp.bank_name = bulkReceiptData[0].bank_name;
        temp.fee_receipt_id = studentData[0].fee_receipt_id;
        temp.amount_in_som = bulkReceiptData[0].amount_in_som;
        temp.student_id = studentData[0].student_id;
        temp.fee_receipt = bulkReceiptData[0].fee_receipt;
        temp.fee_template = studentData[0].fee_template_name;
        temp.cheque_dd_no = bulkReceiptData[0].cheque_dd_no;
        temp.transaction_type = bulkReceiptData[0].transaction_type;
        temp.school_id = data.schoolId;
        temp.received_in = data.receiptType;
        temp.financial_year_id = data.financialYearId;
        temp.from_name = bulkReceiptData[0].from_name;
        temp.amount = bulkReceiptData[0].amount;
        temp.remarks = values.remarks;

        await axios
          .post(`/api/finance/cancelBulkFeeReceipt`, temp)
          .then((res) => {
            setAlertMessage({
              severity: "success",
              message: "Receipt Cancelled Successfully",
            });
            setAlertOpen(true);
            navigate("/feereceipt-cancel-index")
          })
          .catch((err) => console.error(err));
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
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <Grid container alignItems="center" justifyContent="center" marginTop={4}>
        {studentData[0]?.auid === null ? (
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
                  <Typography variant="subtitle2">Receipt No</Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Typography variant="body2" color="textSecondary">
                    {bulkReceiptData?.fee_receipt}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Receipt Date</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    {moment(bulkReceiptData?.receipt_date).format(
                      "DD-MM-YYYY"
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Received From</Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Typography variant="body2" color="textSecondary">
                    {bulkReceiptData?.from_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Cashier</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    {bulkReceiptData?.cashier}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ) : (
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
                    {studentData[0]?.auid}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">School</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    {studentData[0]?.school_name_short}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Name</Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentData[0]?.student_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Program</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    {studentData[0]?.program_name || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">DOA</Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Typography variant="body2" color="textSecondary">
                    {moment(studentData[0]?.date_of_admission).format(
                      "DD-MM-YYYY"
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Year/Sem</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="textSecondary">
                  {studentData[0].current_year ? studentData[0].current_year:"-"}/{studentData[0].current_sem ? studentData[0].current_sem:"-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Template</Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentData[0]?.fee_template_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Mobile</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="textSecondary">
                    {studentData[0]?.mobile}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

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
                    <StyledTableCell sx={{ textAlign: "left" }}>
                      Fee Heads
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "right" }}>
                      Paid Amount
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bulkReceiptData.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <StyledTableCell sx={{ textAlign: "left" }}>
                          {obj.voucher_head}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "right" }}>
                          {obj.amount}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <StyledTableCell>Total</StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "right" }}>
                      {bulkReceiptData.length > 0
                        ? bulkReceiptData[0].amount
                        : ""}
                    </StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3} mt={2}>
          <CustomTextField
            multiline
            rows={2}
            name="remarks"
            label="Cancelled Reason"
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
      </Grid>
    </>
  );
}

export default CancelBulkReceipt;
