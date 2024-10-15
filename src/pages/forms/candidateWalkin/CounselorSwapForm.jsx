import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
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
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const initialValues = {
  oldCounselorId: null,
  newCounselorId: null,
};

function CounselorSwapForm({
  rowData,
  setSwapOpen,
  getData,
  setAlertMessage,
  setAlertOpen,
}) {
  const [values, setValues] = useState(initialValues);
  const [userOptions, setUserOptions] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id, counselor_id: counselorId } = rowData;

  useEffect(() => {
    getUsers();
    getHistoryData();
    handleChangeAdvance("oldCounselorId", counselorId);
  }, []);

  const getUsers = async () => {
    try {
      const { data: response } = await axios.get("/api/staffUserDetails");
      const responseData = response.data;
      const optionData = [];
      responseData.forEach((obj) => {
        optionData.push({
          value: obj.id,
          label: obj.username,
        });
      });
      setUserOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load counselor details",
      });
      setAlertOpen(true);
      setSwapOpen(false);
    }
  };

  const getHistoryData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/student/CandidateCounsellorSwappingByCandidateId/${id}`
      );
      const responseData = response.data;
      setHistoryData(responseData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load counselor details",
      });
      setAlertOpen(true);
      setSwapOpen(false);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCreate = async () => {
    const { oldCounselorId, newCounselorId } = values;
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `/api/student/Candidate_Walkin/${id}`
      );
      const counselorName = userOptions.find(
        (obj) => obj.value === newCounselorId
      );
      const responseData = response.data;
      responseData.counselor_id = newCounselorId;
      responseData.counselor_name = counselorName?.label;

      const postData = {
        active: true,
        candidateId: id,
        oldCounsellorId: oldCounselorId,
        newCounsellorId: newCounselorId,
      };

      const [swapResponse, { data: updateResponse }] = await Promise.all([
        axios.post("/api/student/saveCandidateCounsellorSwapping", postData),
        axios.put(`/api/student/Candidate_Walkin/${id}`, responseData),
      ]);
      if (updateResponse.success) {
        setAlertMessage({
          severity: "success",
          message: "Couselor has been updated successfully !!",
        });
        setAlertOpen(true);
        getData();
      }
      setSwapOpen(false);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to swap !!",
      });
      setAlertOpen(true);
      setSwapOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const DisplayText = ({ label }) => (
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        <Grid item xs={12} md={6}>
          <CustomAutocomplete
            name="oldCounselorId"
            label="Current Counselor"
            value={values.oldCounselorId}
            options={userOptions}
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomAutocomplete
            name="newCounselorId"
            label="Upcoming Counselor"
            value={values.newCounselorId}
            options={userOptions.filter((obj) => obj.value !== counselorId)}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={loading || values.newCounselorId === null}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Swap"
            )}
          </Button>
        </Grid>

        {historyData.length > 0 && (
          <>
            <Grid item xs={12}>
              <Divider sx={{ padding: 0 }}>
                <DisplayText label="History" />
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Previous Counselor</StyledTableCell>
                      <StyledTableCell>Current Counselor</StyledTableCell>
                      <StyledTableCell>Swap Date</StyledTableCell>
                      <StyledTableCell>Swapped By</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {historyData.map((obj, i) => (
                      <TableRow key={i}>
                        <StyledTableCellBody>
                          <DisplayText label={obj.oldCounsellorName} />
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          <DisplayText label={obj.newCounsellorName} />
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          <DisplayText
                            label={
                              obj.created_date
                                ? moment(obj.created_date).format(
                                    "DD-MM-YYYY LT"
                                  )
                                : ""
                            }
                          />
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          <DisplayText label={obj.created_username} />
                        </StyledTableCellBody>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}

export default CounselorSwapForm;
