import { useEffect, useState } from "react";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import numberToWords from "number-to-words";
import moment from "moment";
import CustomModal from "../../../components/CustomModal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const breadCrumbsList = [
  { name: "JV Verifier", link: "/journal-verify" },
  { name: "Verify" },
];

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function JournalVerifyForm() {
  const [data, setData] = useState(null);
  const [voucherData, setVoucherData] = useState([]);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { vcNo, schoolId, fcyearId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  console.log("data", data);
  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/finance/getDraftJournalVoucherData/${vcNo}/${schoolId}/${fcyearId}`
      );
      const responseData = response.data;
      const resData = responseData[0];
      setCrumbs([
        ...breadCrumbsList,
        { name: resData.school_name_short },
        { name: resData.financial_year },
      ]);
      setData(resData);
      setVoucherData(responseData);
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the data",
      });
      setAlertOpen(true);
    }
  };

  if (!data) return;

  const handleVerify = async () => {
    const putData = [...voucherData];
    const postData = [];

    try {
      setLoading(true);

      putData.forEach((obj, i) => {
        const {
          school_id,
          date,
          pay_to,
          expensense_head,
          credit,
          credit_total,
          debit,
          debit_total,
          dept_name,
          vendor_active,
          inter_school_id,
          dept_id,
          purchase_ref_number,
          payment_mode,
        } = obj;
        obj.draft_journal_voucher_id = obj.id;
        obj.verified_status = 1;
        obj.verifier_id = userId;
        obj.verified_date = moment().format("DD-MM-YYYY");
        obj.approved_status = 1;
        obj.approver_id = userId;
        obj.approved_date = moment().format("DD-MM-YYYY");
        delete obj.id;

        postData.push({
          school_id,
          date,
          active: true,
          pay_to,
          expensense_head,
          credit,
          credit_total,
          debit,
          debit_total,
          dept_name,
          vendor_active,
          inter_school_id,
          dept_id,
          purchase_ref_number,
          draft_journal_voucher_id: obj.draft_journal_voucher_id,
          payment_mode,
        });
      });

      const ids = [];
      voucherData.forEach((obj) => {
        ids.push(obj.draft_journal_voucher_id);
      });

      const [{ data: response }] = await Promise.all([
        axios.put(
          `/api/finance/updateDraftJournalVoucher/${ids.toString()}`,
          putData
        ),
        axios.post("api/finance/journalVoucher", postData),
      ]);
      if (!response.success) {
        setAlertMessage({
          severity: "error",
          message: "Unable to update the journal voucher.",
        });
        setAlertOpen(true);
        return;
      }
      setAlertMessage({
        severity: "success",
        message: "Journal voucher has been updated successfully.",
      });
      setAlertOpen(true);
      navigate("/draft-jv");
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Unable to create the payment voucher.",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (data.created_by === userId) {
      setAlertMessage({
        severity: "error",
        message: "You are not authorized to verify this voucher !!",
      });
      setAlertOpen(true);
      return false;
    }
    setConfirmContent({
      title: "",
      message: "Are you sure want to verify?",
      buttons: [
        { name: "Yes", color: "primary", func: handleVerify },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

      <Box>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: "#f6f6ff",
                p: 5,
                mb: 3,
                borderRadius: 5,
              }}
            >
              <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table
                      size="small"
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Particulas</StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            Debit
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            Credit
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {voucherData.map((obj, i) => (
                          <TableRow key={i}>
                            <TableCell sx={{ borderBottom: "hidden" }}>
                              {obj.voucher_head}
                            </TableCell>
                            <StyledTableCellBody
                              sx={{
                                textAlign: "right",
                                borderBottom: "hidden !important",
                              }}
                            >
                              {obj.debit}
                            </StyledTableCellBody>
                            <StyledTableCellBody
                              sx={{
                                textAlign: "right",
                                borderBottom: "hidden !important",
                              }}
                            >
                              {obj.credit}
                            </StyledTableCellBody>
                          </TableRow>
                        ))}
                        <TableRow>
                          <StyledTableCellBody
                            sx={{
                              borderBottom: "hidden !important",
                            }}
                          >
                            Pay To :{` ${data.pay_to}`}
                          </StyledTableCellBody>
                          <StyledTableCellBody
                            sx={{
                              borderBottom: "hidden !important",
                            }}
                          />
                          <StyledTableCellBody
                            sx={{
                              borderBottom: "hidden !important",
                            }}
                          />
                        </TableRow>
                        <TableRow>
                          <StyledTableCellBody
                            sx={{
                              borderBottom: "hidden !important",
                            }}
                          >
                            Department :{` ${data.dept_name_short}`}
                          </StyledTableCellBody>
                          <StyledTableCellBody
                            sx={{
                              borderBottom: "hidden !important",
                            }}
                          />
                          <StyledTableCellBody
                            sx={{
                              borderBottom: "hidden !important",
                            }}
                          />
                        </TableRow>
                        <TableRow>
                          <StyledTableCellBody
                            sx={{
                              borderBottom: "hidden !important",
                              textAlign: "justify",
                            }}
                          >
                            Narration :{` ${data.remarks}`}
                          </StyledTableCellBody>
                          <StyledTableCellBody />
                          <StyledTableCellBody />
                        </TableRow>
                        <TableRow>
                          <StyledTableCellBody
                            sx={{ textTransform: "capitalize" }}
                          >
                            <Typography variant="subtitle2">
                              {`${numberToWords.toWords(
                                Number(data.debit_total)
                              )} rupess`}
                            </Typography>
                          </StyledTableCellBody>
                          <StyledTableCellBody sx={{ textAlign: "right" }}>
                            <Typography variant="subtitle2">
                              {data.debit_total}
                            </Typography>
                          </StyledTableCellBody>
                          <StyledTableCellBody sx={{ textAlign: "right" }}>
                            <Typography variant="subtitle2">
                              {data.credit_total}
                            </Typography>
                          </StyledTableCellBody>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography variant="subtitle2">Created By :</Typography>
                    <Typography variant="subtitle2" color="textSecondary">{` ${
                      data.created_username
                    } on ${moment(data.created_date).format(
                      "DD-MM-YYYY LT"
                    )}`}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} align="right">
                  <Button variant="contained" onClick={handleSubmit}>
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default JournalVerifyForm;
