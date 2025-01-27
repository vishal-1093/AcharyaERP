import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";

const initialValues = { status: "", remarks: "" };

const statusList = [
  { value: "Pending", label: "Pending" },
  { value: "Partial", label: "Partial" },
  { value: "Completed", label: "Completed" },
];

function AuditingStatusForm({ rowData, getData, setAuditingWrapperOpen }) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const maxLength = 250;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { student_document_audit_id: auditId } = rowData;
    if (!auditId) return;
    try {
      const res = await axios.get(
        `/api/student/getStudentDocumentAudit/${auditId}`
      );
      const responseData = res.data.data;
      const { audit_status: status, remarks } = responseData;
      setValues((prev) => ({ ...prev, status, remarks }));
      setData(responseData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response.data
          ? err.response.data.message
          : "Error while submitting",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "remarks" && value.length > 250) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const handleCreate = async () => {
    const { status, remarks } = values;
    try {
      setLoading(true);
      let response;
      if (data.length > 0) {
        const updateData = { ...data, audit_status: status, remarks };
        response = await axios.put(
          `api/student/updateStudentDocumentAudit/${rowData.id}`,
          updateData
        );
      } else {
        const postData = {
          active: true,
          student_id: rowData.id,
          audit_status: status,
          remarks,
        };
        response = await axios.post(
          "api/student/saveStudentDocumentAudit",
          postData
        );
      }
      if (!response.data.success) {
        throw new Error("Failed to update the status.");
      }
      setAlertMessage({
        severity: "success",
        message: "Aduit status updated sucessfully !!",
      });
      setAlertOpen(true);
      getData();
      setAuditingWrapperOpen(false);
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong",
      });
      setAlertOpen(true);
      setAuditingWrapperOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <CustomSelect
            name="status"
            label="Document Verification Status"
            value={values.status}
            items={statusList}
            handleChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            name="remarks"
            label="Remarks"
            value={values.remarks}
            handleChange={handleChange}
            helperText={`Remaining characters : ${getRemainingCharacters(
              "remarks"
            )}`}
            multiline
            required
          />
        </Grid>
        <Grid item xs={12} align="right">
          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Submit"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AuditingStatusForm;
