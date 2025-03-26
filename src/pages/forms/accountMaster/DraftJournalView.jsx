import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import numberToWords from "number-to-words";
import moment from "moment";

function DraftJournalView({ draftJournalId }) {
  const [data, setData] = useState({});
  const [voucherData, setVoucherData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, [draftJournalId]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `api/purchase/getDraftJournalVoucher?draft_journal_voucher_id=${draftJournalId}`
      );
      const responseData = response.data;
      if (!responseData.length > 0) throw new Error();
      const {
        school_name: schoolName,
        financial_year: fcYear,
        pay_to: payTo,
        dept_name: dept,
        remarks,
        debit_total: debitTotal,
        credit_total: creditTotal,
        created_username: createdBy,
        created_date: createdDate,
      } = responseData[0];
      setData({
        schoolName,
        fcYear,
        payTo,
        dept,
        remarks,
        debitTotal,
        creditTotal,
        createdBy,
        createdDate,
      });
      setVoucherData(responseData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the data",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center" }}
      >
        Loading ....
      </Typography>
    );
  }

  const DisplayBoldText = ({ label }) => (
    <Typography variant="subtitle2">{label}</Typography>
  );

  const DisplayText = ({ label }) => (
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
  );

  return (
    <Box sx={{ border: "2px solid grey", padding: 2 }}>
      <Grid container rowSpacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
            {data.schoolName}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
            {data.fcYear}
          </Typography>
        </Grid>

        <Grid item xs={12} mt={1}>
          <TableContainer>
            <Table
              size="small"
              sx={{
                border: "1px solid black",
                "& td, & th": { border: "1px solid black" },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Particulars</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>Debit</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>Credit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {voucherData.map((obj, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ borderBottom: "hidden !important" }}>
                      <DisplayText label={obj.voucher_head} />
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "right",
                        borderBottom: "hidden !important",
                      }}
                    >
                      <DisplayText label={Math.round(obj.debit)} />
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "right",
                        borderBottom: "hidden !important",
                      }}
                    >
                      <DisplayText label={Math.round(obj.credit)} />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell sx={{ borderBottom: "hidden !important" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <DisplayBoldText label="Pay To" />
                      <DisplayText label={data.payTo} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "hidden !important" }} />
                  <TableCell sx={{ borderBottom: "hidden !important" }} />
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "hidden !important" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <DisplayBoldText label="Department" />
                      <DisplayText label={data.dept} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "hidden !important" }} />
                  <TableCell sx={{ borderBottom: "hidden !important" }} />
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: "hidden !important" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <DisplayBoldText label="Narration" />
                      <DisplayText label={data.remarks} />
                    </Box>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <DisplayBoldText
                        label={numberToWords.toWords(data.debitTotal || 0)}
                      />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <DisplayBoldText label={Math.round(data.debitTotal)} />
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <DisplayBoldText label={Math.round(data.creditTotal)} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <DisplayBoldText label="Created By" />
            <DisplayText
              label={` ${data.createdBy} on ${moment(data.createdDate).format(
                "DD-MM-YYYY LT"
              )}`}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}></Grid>
      </Grid>
    </Box>
  );
}

export default DraftJournalView;
