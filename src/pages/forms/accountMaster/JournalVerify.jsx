import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";

const DraftJournalView = lazy(() => import("./DraftJournalView"));

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function JournalVerify({ rowData, getData, setJvWrapperOpen }) {
  const [voucherData, setVoucherData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState("verify");
  const [loading, setLoading] = useState(false);
  const [envData, setEnvData] = useState({});

  const currentDate = moment().format("DD-MM-YYYY");

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    fetchData();
  }, [rowData.id]);

  useEffect(() => {
    getEnvData();
  }, [voucherData]);

  const getEnvData = async () => {
    if (voucherData?.[0]?.type === "DEMAND-JV") {
      try {
        const response = await axios.get(
          `/api/finance/getEnvBillDetails/${voucherData?.[0]?.env_bill_details_id}`
        );
        setEnvData(response.data.data);
      } catch {
        setAlertMessage({ severity: "error", message: "Error Occured" });
        setAlertOpen(true);
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `api/purchase/getDraftJournalVoucher?draft_journal_voucher_id=${rowData.id}`
      );
      const responseData = response.data;
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

  const handleSubmit = (status, type) => {
    setIsSubmitted(status);
    setStatus(type);
  };

  const handleVerify = async () => {
    try {
      setLoading(true);

      let putData = [...voucherData];
      const postData = [];
      putData = putData.map(({ created_username, id, ...rest }) => ({
        ...rest,
        verified_status: 1,
        verifier_id: userId,
        verified_date: currentDate,
        approved_status: 1,
        approver_id: userId,
        approved_date: currentDate,
        draftCreatedName: created_username,
        created_username: created_username,
        draft_journal_voucher_id: id,
        ...(status === "reject" && { cancel_voucher: 1 }),
        ...(status === "reject" && { cancelled_by: userId }),
        ...(status === "reject" && {
          cancelled_date: currentDate,
        }),
        ...(status === "reject" && { active: false }),
      }));
      putData.forEach((obj) => {
        const {
          credit,
          credit_total,
          debit,
          debit_total,
          dept_id,
          draft_journal_voucher_id,
          financial_year_id,
          pay_to,
          payment_mode,
          purchase_ref_number,
          reference_number,
          remarks,
          school_id,
          voucher_head_id,
          inter_school_id,
          draftCreatedName,
          type,
          env_bill_details_id,
        } = obj;
        postData.push({
          active: true,
          date: currentDate,
          credit,
          credit_total,
          debit,
          debit_total,
          dept_id,
          draft_journal_voucher_id,
          financial_year_id,
          pay_to,
          payment_mode,
          purchase_ref_number,
          reference_number,
          remarks,
          school_id,
          voucher_head_id,
          inter_school_id,
          draftCreatedName,
          type,
          env_bill_details_id,
        });
      });

      let ids = [];
      putData.forEach((obj) => {
        ids.push(obj.draft_journal_voucher_id);
      });
      ids = ids.toString();
      const [response, journalResponse] = await Promise.all([
        axios.put(
          `/api/finance/updateDraftJournalVoucher/${ids.toString()}`,
          putData
        ),

        axios.post("/api/finance/journalVoucher", postData),
      ]);
      if (!response.data.success) {
        throw new Error();
      }
      if (voucherData?.[0]?.type === "GRN-JV") {
        const updateBody = {
          journal_voucher_id: journalResponse.data.data[0].journal_voucher_id,
          grn_no: rowData.reference_number,
        };
        const updateGrn = await axios.put(
          "/api/purchase/updateGrnDraftJournalVoucher",
          updateBody
        );
        if (!updateGrn.data.success) throw new Error();
      }

      if (voucherData?.[0]?.type === "DEMAND-JV") {
        const updateBody = { ...envData };
        updateBody.journal_voucher_id =
          journalResponse.data.data[0].journal_voucher_id;

        const updateGrn = await axios.put(
          `/api/finance/updateEnvBillDetails/${voucherData?.[0]?.env_bill_details_id}`,
          updateBody
        );
        if (!updateGrn.data.success) throw new Error();
      }

      setAlertMessage({
        severity: "success",
        message: "Journal voucher has been verified successfully.",
      });
      setAlertOpen(true);
      getData();
      setJvWrapperOpen(false);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Unable to create the journal voucher.",
      });
      setAlertOpen(true);
      setJvWrapperOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <DraftJournalView draftJournalId={rowData.id} />
      </Grid>

      <Grid item xs={12} align="right">
        {/* {isSubmitted ? ( */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleSubmit(false)}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            onClick={handleVerify}
            disabled={loading || rowData.created_by === userId}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Confirm"
            )}
          </Button>
        </Box>
        {/* ) : (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleSubmit(true, "reject")}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleSubmit(true, "verify")}
            >
              Verify
            </Button>
          </Box>
        )} */}
      </Grid>
    </Grid>
  );
}

export default JournalVerify;
