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
import CustomModal from "../../../components/CustomModal";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import moment from "moment";

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
  approvedData: {},
  grandTotal: "",
  document: "",
};

function ScholarshipUpdate({ data, scholarshipId }) {
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

  const checks = {
    income: [values.income !== "", /^[0-9.]*$/.test(values.income)],
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    income: ["This field required", "Enter valid income"],
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getData();
  }, []);

  const getTotal = () => {
    const { approvedData } = values;
    const scholarshipValues = Object.values(approvedData);

    if (scholarshipValues.length > 0) {
      const total = scholarshipValues.reduce((acc, val) => {
        const num = Number(val) || 0;
        return acc + (num > 0 ? num : 0);
      }, 0);

      setValues((prev) => ({
        ...prev,
        grandTotal: total,
      }));
    }
  };

  useEffect(() => {
    getTotal();
  }, [values.approvedData]);

  const getData = async () => {
    try {
      const [subAmountResponse, scholarshipResponse, schHistory, studentDue] =
        await Promise.all([
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
        const scholarshipData = {};
        const totalYearsOrSemesters =
          data.program_type_name.toLowerCase() === "yearly"
            ? data.number_of_years * 2
            : data.number_of_semester;

        let sum = 0;
        let rowTot = 0;
        for (let i = 1; i <= totalYearsOrSemesters; i++) {
          // if (
          //   (feeTemplateData.program_type_name === "Semester" ||
          //     (feeTemplateData.program_type_name === "Yearly" && i % 2 !== 0)) &&
          //   Number(schData[`year${i}_amount`]) !== 0
          // ) {
          yearSemesters.push({ key: i, value: `Sem ${i}` });
          scholarshipData[`year${i}`] = schData[`year${i}_amount`] || 0;
          sum += rest[`sem${i}`];
          rowTot += feeTemplateSubAmtData[`fee_year${i}_amt`] || 0;
          // }
        }

        setFeeTemplateSubAmountData(feeTemplateSubAmtData);
        setNoOfYears(yearSemesters);
        setScholarshipData(schData);
        setRequestedData(filterRequestedData);
        setVerifiedData(filterVerifiedData);
        setFeeDueData(dueData);
        setValues((prev) => ({
          ...prev,
          approvedData: scholarshipData,
          remarks: schData.approversRemarks,
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

  const handleChangeScholarship = (e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;

    const { approvedData } = values;

    const newValue = Math.min(
      Number(value),
      Number(feeTemplateSubAmountData[`fee_${name}_amt`])
    );

    setValues((prev) => ({
      ...prev,
      approvedData: {
        ...approvedData,
        [name]: newValue,
      },
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const handleCreate = async () => {
    const { approvedData, remarks, document, grandTotal } = values;
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
      updateData.comments = remarks;
      updateData.approved_date = moment();
      updateData.approved_amount = grandTotal;
      updateData.ipAdress = ipAdress;

      noOfYears.forEach(({ key }) => {
        updateData[`year${key}_amount`] = approvedData[`year${key}`];
      });

      const [documentResponse, schHistory, updateResponse] = await Promise.all([
        document
          ? axios.post(
              "/api/uploadFile",
              createFormData(document, updateData.candidate_id)
            )
          : null,
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
        navigate("/scholarship-history", { replace: true });
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to verify !!",
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const createFormData = (file, candidateId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("candidate_id", candidateId);
    return formData;
  };

  const handleSubmit = () => {
    setConfirmContent({
      title: "",
      message: "Would you like to confirm?",
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

  const renderTextInput = () => {
    return noOfYears.map((obj, i) => {
      return (
        <TableCell key={i} align="right">
          <CustomTextField
            name={`year${obj.key}`}
            value={values.approvedData[`year${obj.key}`]}
            handleChange={handleChangeScholarship}
            sx={{
              "& .MuiInputBase-root": {
                "& input": {
                  textAlign: "right",
                },
              },
            }}
          />
        </TableCell>
      );
    });
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
                  {feeTemplateSubAmountData.length > 0 && (
                    <TableRow>
                      {renderHeaderCells("Fee Due")}
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

                  <TableRow>
                    {renderHeaderCells("Approved")}
                    {renderTextInput()}
                    {renderHeaderCells(values.grandTotal, 0, "right")}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" display="inline">
              Requested Remarks :&nbsp;
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="inline"
            >
              {scholarshipData.requestedByRemarks}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6} align="center">
            <CustomFileInput
              name="document"
              label="Document"
              helperText="PDF - smaller than 2 MB"
              file={values.document}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checks.document}
              errors={errorMessages.document}
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              disabled={isLoading}
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

export default ScholarshipUpdate;
