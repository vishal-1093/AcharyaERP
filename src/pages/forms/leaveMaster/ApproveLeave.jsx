import { useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";

const initialValues = { remarks: "" };

function ApproveLeave({
  empId,
  userId,
  rowData,
  setModalWrapperOpen,
  getData,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const maxLength = 100;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > maxLength) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const handleApprove = async (status) => {
    const { remarks } = values;
    const { leaveId, id, leaveType } = rowData;
    try {
      setValues((prev) => ({
        ...prev,
        ["approverComments"]: "",
      }));
      if (status === "approve") {
        setLoading(true);
      } else {
        setCancelLoading(true);
      }
      const [response, approverRes] = await Promise.all([
        axios.get(`/api/leaveApply/${leaveId}`),
        axios.get(`/api/getLeaveApproversForEmployees/${id}`),
      ]);
      const leaveApplyData = response.data.data;
      const { leave_approver1: approverOne, leave_approver2: approverTwo } =
        approverRes.data.data;
      const approverOneId = approverOne.emp_id;
      const approverTwoId = approverTwo.emp_id;
      const temp = { ...leaveApplyData };
      if (approverOneId === empId && status === "approve") {
        temp.leave_app1_status = 1;
        temp.reporting_approver_comment = remarks;
        temp.leave_approved_date = moment();
      }
      if (approverTwoId === empId && status === "approve") {
        temp.leave_app2_status = 1;
        temp.reporting_approver1_comment = remarks;
        temp.leave_approved2_date = moment();
        temp.approved_status = 2;
      }
      if (
        (approverOneId === empId || approverTwoId === empId) &&
        status === "cancel"
      ) {
        temp.cancel_by = userId;
        temp.cancel_comments = remarks;
        temp.cancel_date = moment();
        temp.approved_status = 3;
      }
      if (leaveType === "Leave") {
        const apiEndpoint =
          status === "approve"
            ? `/api/emailToEmployeeForApprovalOfLeaveRequest/${leaveId}`
            : `/api/emailToEmployeeForLeaveCancellation/${leaveId}`;
        await axios.post(apiEndpoint);
        if (approverOneId !== approverTwoId && approverOneId === empId) {
          await axios.post(
            `/api/emailToApproverForApprovingLeaveRequest/${approverTwoId}`
          );
        }
      }
      const updateResponse = await axios.put(
        `/api/leaveApply/${leaveId}`,
        temp
      );
      if (updateResponse.data.success) {
        setAlertMessage({
          severity: status === "approve" ? "success" : "error",
          message:
            status === "approve"
              ? "Leave request has been approved successfully !!"
              : "Leave request has been cancelled successfully !!",
        });
        setAlertOpen(true);
        getData();
      }
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    } finally {
      if (status === "approve") {
        setLoading(false);
      } else {
        setCancelLoading(false);
      }
      setModalWrapperOpen(false);
    }
  };

  const validate = (loader) => loader;

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={3}>
        <Grid item xs={12} md={2}>
          <Typography variant="subtitle2">Leave Date</Typography>
        </Grid>
        <Grid item xs={12} md={10}>
          <Typography variant="subtitle2" color="textSecondary">
            {rowData.days > 1
              ? `${rowData.fromDate} to ${rowData.toDate} ( ${rowData.days} Days )`
              : `${rowData.fromDate} ( ${rowData.days} Day )`}
          </Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant="subtitle2">Reason</Typography>
        </Grid>
        <Grid item xs={12} md={10}>
          <Typography variant="subtitle2" color="textSecondary">
            {rowData.reason}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            name="remarks"
            label="Comments"
            value={values.remarks}
            handleChange={handleChange}
            helperText={`Remaining characters : ${getRemainingCharacters(
              "remarks"
            )}`}
            multiline
          />
        </Grid>

        <Grid item xs={12} align="right">
          <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleApprove("approve")}
              disabled={loading || validate()}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Approve"
              )}
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => handleApprove("cancel")}
              disabled={cancelLoading || validate()}
            >
              {cancelLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Cancel"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ApproveLeave;
