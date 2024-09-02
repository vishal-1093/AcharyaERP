import { useEffect, useState } from "react";
import axios from "../../../services/Api";
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
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import occupationList from "../../../utils/OccupationList";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const requiredFields = [
  "residency",
  "scholarship",
  "reason",
  "income",
  "occupation",
  "document",
];

function DirectScholarshipAmountForm({
  feeTemplateData,
  feeTemplateSubAmountData,
  noOfYears,
  yearwiseSubAmount,
  values,
  setValues,
  reasonOptions,
  setAlertMessage,
  setAlertOpen,
  studentData,
}) {
  const [scholarshipTotal, setScholarshipTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const maxLength = 150;

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

  const scholarshipRequired = requiredFields.includes("scholarshipYes");
  if (values.scholarship === "true" && !scholarshipRequired) {
    requiredFields.push("scholarshipYes");
  } else if (values.scholarship !== "true" && scholarshipRequired) {
    const index = requiredFields.indexOf("scholarshipYes");
    requiredFields.splice(index, 1);
  }

  useEffect(() => {
    const scholarshipValues = Object.values(values.scholarshipData);

    if (scholarshipValues.length > 0) {
      const total = scholarshipValues.reduce((acc, val) => {
        const num = Number(val) || 0;
        return acc + (num > 0 ? num : 0);
      }, 0);
      setScholarshipTotal(total);
    }
  }, [values.scholarshipData]);

  if (!feeTemplateData) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No Fee Template data available.
      </Typography>
    );
  }

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "remarks" && value.length > maxLength) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeScholarship = (e) => {
    const { name, value } = e.target;
    if (/^[A-Za-z]+$/.test(value)) return;
    const { scholarshipData } = values;

    const newValue = Math.min(Number(value), yearwiseSubAmount[name]);

    setValues((prev) => ({
      ...prev,
      scholarshipData: {
        ...scholarshipData,
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
    try {
      setIsLoading(true);

      const {
        residency,
        scholarship,
        scholarshipYes,
        income,
        occupation,
        reason,
        document,
        scholarshipData,
        remarks,
      } = values;
      const { student_id, candidate_id } = studentData;

      const reasonLabel = reasonOptions.find(
        (obj) => obj.value === reason
      )?.label;

      const scholarshipPostData = {
        active: true,
        residence: residency,
        award: scholarship,
        award_details: scholarship === "true" ? scholarshipYes : "",
        parent_income: income,
        occupation,
        reason: reasonLabel,
        requested_scholarship: scholarshipTotal,
        student_id,
        candidate_id,
      };

      const approverPostData = {
        active: true,
        student_id,
        candidate_id,
        pre_approval_status: true,
        prev_approved_amount: scholarshipTotal,
        requestedByRemarks: remarks,
      };

      noOfYears.forEach((val) => {
        approverPostData[`year${val.key}_amount`] =
          Number(scholarshipData[`year${val.key}`]) || 0;
      });

      const postData = { s: scholarshipPostData, sas: approverPostData };

      const [documentResponse, scholarshipResponse] = await Promise.all([
        document
          ? axios.post(
              "/api/uploadFile",
              createFormData(document, candidate_id)
            )
          : null,
        axios.post("/api/student/saveDirectScholarship", postData),
      ]);

      if (scholarshipResponse.data.success) {
        setAlertMessage({
          severity: "success",
          message:
            "Your scholarship request has been successfully initiated !!",
        });
        setAlertOpen(true);
        navigate("/verify-scholarship");
      } else {
        throw new Error("Failed to save scholarship request !!");
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Unable to create the data",
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

  const renderTextInput = () => {
    return noOfYears.map((obj, i) => {
      return (
        <TableCell key={i} align="right">
          <CustomTextField
            name={"year" + obj.key}
            value={values.scholarshipData["year" + obj.key]}
            handleChange={handleChangeScholarship}
            disabled={
              obj.key % 2 === 0 &&
              feeTemplateData.program_type_name === "Yearly"
            }
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
    <Box>
      <Grid container rowSpacing={4} columnSpacing={4}>
        <Grid item xs={12} md={3}>
          <CustomRadioButtons
            name="residency"
            label="Residence"
            value={values.residency}
            items={[
              {
                value: "own",
                label: "Own",
              },
              {
                value: "rented",
                label: "Rented",
              },
            ]}
            handleChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomRadioButtons
            name="scholarship"
            label="Scholarship Awarded From An OutSide Body"
            value={values.scholarship}
            items={[
              {
                value: "true",
                label: "Yes",
              },
              {
                value: "false",
                label: "No",
              },
            ]}
            handleChange={handleChange}
            required
          />
        </Grid>

        {values.scholarship === "true" ? (
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="scholarshipYes"
              label="If Yes, Please Specify"
              value={values.scholarshipYes}
              handleChange={handleChange}
              required
            />
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            name="reason"
            label="Reason For Fee Exemption"
            value={values.reason}
            options={reasonOptions}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomTextField
            name="income"
            label="Parent Income (pa)"
            value={values.income}
            handleChange={handleChange}
            checks={checks.income}
            errors={errorMessages.income}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            name="occupation"
            label="Occupation"
            value={values.occupation}
            options={occupationList}
            handleChangeAdvance={handleChangeAdvance}
            checks={checks.occupation}
            errors={errorMessages.occupation}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {renderHeaderCells("Particulars")}
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(obj.value, i, "right")
                  )}
                  {renderHeaderCells("Total", 0, "right")}
                </TableRow>
              </TableHead>

              <TableBody>
                {feeTemplateSubAmountData.map((obj, i) => (
                  <TableRow key={i}>
                    {renderBodyCells(obj.voucher_head)}
                    {noOfYears.map((cell, j) =>
                      renderBodyCells(obj[`year${cell.key}_amt`], j, "right")
                    )}
                    {renderHeaderCells(obj.total_amt, 0, "right")}
                  </TableRow>
                ))}
                {/* Total */}
                <TableRow>
                  {renderHeaderCells("Total")}
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(
                      feeTemplateSubAmountData[0][`fee_year${obj.key}_amt`],
                      i,
                      "right"
                    )
                  )}
                  {renderHeaderCells(
                    feeTemplateData.fee_year_total_amount,
                    0,
                    "right"
                  )}
                </TableRow>
                {/* Scholarship  */}
                <TableRow>
                  {renderHeaderCells("Scholarship")}
                  {renderTextInput()}
                  {renderHeaderCells(scholarshipTotal, 0, "right")}
                </TableRow>
                {/* Grand Total  */}
                <TableRow>
                  {renderHeaderCells("Grand Total")}
                  {noOfYears.map((obj, i) =>
                    renderHeaderCells(
                      yearwiseSubAmount[`year${obj.key}`] -
                        values.scholarshipData[`year${obj.key}`],
                      i,
                      "right"
                    )
                  )}
                  {renderHeaderCells(
                    feeTemplateData.fee_year_total_amount - scholarshipTotal,
                    0,
                    "right"
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
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
            disabled={
              isLoading || !requiredFieldsValid() || scholarshipTotal <= 0
            }
            onClick={handleCreate}
          >
            {isLoading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Initiate"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DirectScholarshipAmountForm;
