import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import axiosNoToken from "../../../services/ApiWithoutToken";
import useAlert from "../../../hooks/useAlert";
import {
  Box,
  Button,
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
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate } from "react-router-dom";
import ScholarshipDetails from "./ScholarshipDetails";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import moment from "moment";
import CustomModal from "../../../components/CustomModal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const initialValues = {
  remarks: "",
  approverStatus: "conditional",
  grandTotal: "",
};

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const approverStatusList = [
  {
    value: "conditional",
    label: "Conditional",
  },
  {
    value: "unconditional",
    label: "Unconditional",
  },
];

function ScholarshipApproveForm({ data, scholarshipId }) {
  const [values, setValues] = useState(initialValues);
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scholarshipData, setScholarshipData] = useState([]);
  const [requestedData, setRequestedData] = useState([]);
  const [verifiedData, setVerifiedData] = useState([]);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [feeDueData, setFeeDueData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const maxLength = 100;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const [
        feeTemplateResponse,
        subAmountResponse,
        scholarshipResponse,
        schHistory,
        studentDue,
      ] = await Promise.all([
        axios.get(
          `/api/finance/FetchAllFeeTemplateDetail/${data.fee_template_id}`
        ),
        axios.get(
          `/api/finance/FetchFeeTemplateSubAmountDetail/${data.fee_template_id}`
        ),
        axios.get(`/api/student/fetchScholarship2/${scholarshipId}`),
        axios.get(
          `/api/student/getScholarshipApprovalStatusHistoryData/${scholarshipId}`
        ),
        axios.get(
          `/api/student/studentWiseDueReportByStudentId/${data.student_id}`
        ),
      ]);

      const feeTemplateData = feeTemplateResponse.data.data[0];
      const feeTemplateSubAmtData = subAmountResponse.data.data[0];
      const schData = scholarshipResponse.data.data[0];
      const schHistoryData = schHistory.data.data;
      const filterRequestedData = schHistoryData.find(
        (obj) => obj.editedBy === "requested"
      );
      const filterVerifiedData = schHistoryData.find(
        (obj) => obj.editedBy === "verified"
      );

      const dueData = studentDue.data.data;

      if (Object.values(dueData).length > 0) {
        const {
          addOn,
          auid,
          currentSem,
          currentYear,
          hostelFee,
          studentName,
          templateName,
          ...rest
        } = dueData;

        const yearSemesters = [];
        const totalYearsOrSemesters =
          data.program_type_name === "Yearly"
            ? data.number_of_years * 2
            : data.number_of_semester;

        let sum = 0;
        let rowTot = 0;
        for (let i = 1; i <= totalYearsOrSemesters; i++) {
          if (
            feeTemplateData.program_type_name === "Semester" ||
            (feeTemplateData.program_type_name === "Yearly" && i % 2 !== 0)
          ) {
            yearSemesters.push({ key: i, value: `Sem ${i}` });
            sum += rest[`sem${i}`];
            rowTot += feeTemplateSubAmtData[`fee_year${i}_amt`] || 0;
          }
        }

        setFeeTemplateSubAmountData(feeTemplateSubAmtData);
        setNoOfYears(yearSemesters);
        setScholarshipData(schData);
        setRequestedData(filterRequestedData);
        setVerifiedData(filterVerifiedData);
        setFeeDueData(dueData);
        setValues((prev) => ({
          ...prev,
          total: sum,
          rowTotal: rowTot,
        }));
      } else {
        throw new Error("Failed to load student due data");
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load fee template details!",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    if (e.target.value.length > maxLength) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const handleCreate = async () => {
    const { approverStatus, remarks } = values;
    try {
      setIsLoading(true);

      const ipResponse = await axiosNoToken.get(
        "https://api.ipify.org?format=json"
      );
      const ipAdress = ipResponse.ip;

      const response = await axios.get(
        `/api/student/scholarshipapprovalstatus/${scholarshipData.scholarship_approved_status_id}`
      );
      const updateData = response.data.data;
      updateData.approval = approverStatus;
      updateData.approved_by = userId;
      updateData.comments = remarks;
      updateData.is_approved = approverStatus === "conditional" ? "yes" : "no";
      updateData.approved_date = moment();
      updateData.approved_amount = scholarshipData.verified_amount;
      updateData.ipAdress = ipAdress;

      const [schHistory, updateResponse] = await Promise.all([
        axios.post("api/student/scholarshipApprovalStatusHistory", {
          ...updateData,
          editedBy: "approved",
        }),
        axios.put(
          `/api/student/updateScholarshipStatus/${scholarshipData.scholarship_approved_status_id}`,
          { sas: updateData }
        ),
      ]);

      if (updateResponse.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Scholarship approval was completed successfully !!",
        });
        setAlertOpen(true);
        navigate("/approve-scholarship", { replace: true });
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to verify !!",
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    setConfirmContent({
      title: "",
      message: "Are you sure want to approve?",
      buttons: [
        { name: "Yes", color: "primary", func: handleCreate },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  const renderHeaderCells = (label, key, align) => (
    <StyledTableCell key={key} align={align}>
      <Typography variant="subtitle2">{label}</Typography>
    </StyledTableCell>
  );

  const renderBodyCells = (label, key, align) => (
    <TableCell key={key} align={align}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    </TableCell>
  );

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
        <Grid container rowSpacing={4} columnSpacing={4}>
          <Grid item xs={12}>
            <ScholarshipDetails scholarshipData={scholarshipData} />
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={2}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                    {noOfYears.map((obj, i) =>
                      renderHeaderCells(obj.value, i, "right")
                    )}
                    {renderHeaderCells("Total", 0, "right")}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {feeTemplateSubAmountData && (
                    <TableRow>
                      {renderHeaderCells("Fixed Fee")}
                      {noOfYears.map((obj, i) =>
                        renderHeaderCells(
                          feeTemplateSubAmountData[`fee_year${obj.key}_amt`],
                          i,
                          "right"
                        )
                      )}
                      {renderHeaderCells(values.rowTotal, 0, "right")}
                    </TableRow>
                  )}

                  {feeDueData && (
                    <TableRow>
                      {renderHeaderCells("Fee Due")}
                      {noOfYears.map((obj, i) =>
                        renderHeaderCells(
                          feeDueData[`sem${obj.key}`],
                          i,
                          "right"
                        )
                      )}
                      {renderHeaderCells(values.total, 0, "right")}
                    </TableRow>
                  )}

                  {requestedData && (
                    <TableRow>
                      {renderHeaderCells("Requested")}
                      {noOfYears.map((obj, i) =>
                        renderHeaderCells(
                          requestedData[`year${obj.key}_amount`],
                          i,
                          "right"
                        )
                      )}
                      {renderHeaderCells(
                        scholarshipData.prev_approved_amount,
                        0,
                        "right"
                      )}
                    </TableRow>
                  )}

                  {verifiedData && (
                    <TableRow>
                      {renderHeaderCells("Verified")}
                      {noOfYears.map((obj, i) =>
                        renderHeaderCells(
                          verifiedData[`year${obj.key}_amount`],
                          i,
                          "right"
                        )
                      )}
                      {renderHeaderCells(
                        scholarshipData.verified_amount,
                        0,
                        "right"
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" display="inline">
              Verifier Remarks :&nbsp;
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="inline"
            >
              {scholarshipData.verifier_remarks}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              helperText={`Remaining characters : ${getRemainingCharacters(
                "remarks"
              )}`}
              multiline
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomRadioButtons
              name="approverStatus"
              label="Approval"
              value={values.approverStatus}
              items={approverStatusList}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              disabled={
                isLoading ||
                values.remarks === "" ||
                values.approverStatus === ""
              }
              onClick={handleSubmit}
            >
              {isLoading ? (
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
    </>
  );
}

export default ScholarshipApproveForm;
