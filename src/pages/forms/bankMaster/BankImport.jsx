import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button } from "@mui/material";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import BankImportTable from "./BankImportTable";
import csvFile from "../../../assets/sample.xlsx";
import CustomSelect from "../../../components/Inputs/CustomSelect";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const feeTypeOption = [
  { label: "Registration", value: 1 },
  { label: "Bulk", value: 2 },
  { label: "College", value: 3 },
  { label: "Exam", value: 4 },
]

const initialValues = {
 // type: "import",
  fileImportedDate: new Date(),
  schoolId: null,
  bankId: null,
  startRow: "",
  endRow: "",
  date: "",
  transactionNo: "",
  chequeNo: "",
  amount: "",
  remarks: "",
  csvFile: "",
  // settlement: "",
  // utr: "",
  // feeType: null,
  // auid: "",
  // payId: "",
  // orderId: "",
  // emailId: "",
  // phone: ""
};

const requiredFields = ["bankId", "startRow", "endRow"];

function BankImport() {
  const [values, setValues] = useState(initialValues);
  const [bankOptions, setBankOptions] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [schoolId, setSchoolId] = useState();

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    startRow: [/[0-9]/.test(values.startRow)],
    endRow: [/[0-9]/.test(values.endRow)],
    // type: [values.type !== ""],
    // payId: [values.payId !== ""],
    // orderId: [values.orderId !== ""],
    // settlement: [values.settlement !== ""],
    // utr: [values.utr !== ""],
    // feeType: [values.feeType !== null],
    // auid: [values.auid !== ""],
    // amount: [values.amount !== "", /[0-9]/.test(values.amount)],
  };

  const errorMessages = {
    startRow: ["Enter only numbers"],
    endRow: ["Enter only numbers"],
    // type: ["This field is required"],
    // payId: ["This field is required"],
    // orderId: ["This field is required"],
    // settlement: ["This field is required"],
    // utr: ["This field is required"],
    // feeType: ["This field is required"],
    // amount: ["This field is required", "Invalid Amount"],
  };

  let element = (
    <a href={csvFile} style={{ textDecoration: "none", color: "white" }}>
      Download Sample File
    </a>
  );

  useEffect(() => {
    getSchoolData();
    setCrumbs([
      { name: "BankMaster", link: "/BankMaster/Import" },
      { name: "Bank Import" },
      { name: "Create" },
    ]);
  }, []);

  useEffect(() => {
    getBankData();
  }, [values.schoolId]);

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const schoolData = [];
        res.data.data.forEach((obj) => {
          schoolData.push({
            label: obj.school_name,
            value: obj.school_id,
          });
        });
        setSchoolOptions(schoolData);
      })
      .catch((err) => console.error(err));
  };

  const getBankData = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/finance/bankDetailsBasedOnSchoolId/${values.schoolId}`)
        .then((res) => {
          const voucherData = [];
          res.data.data.forEach((obj) => {
            voucherData.push({
              label: obj.voucher_head,
              value: obj.id,
              voucherHeadNewId: obj.voucher_head_new_id,
            });
          });
          setBankOptions(voucherData);
        })
        .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "startRow" && e.target.value > 1) {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
    if (e.target.name === "startRow" && e.target.value < 2) {
      setAlertMessage({
        severity: "error",
        message: "Start row should be greater than 1",
      });
      setAlertOpen(true);
    }

    if (e?.target?.name === "endRow" || e?.target?.name === "type") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      const itemSelected = bankOptions.find(
        (obj) => obj.value === values.bankId
      );

      setValues((prev) => ({
        ...prev,
        ["voucherHeadNewId"]: itemSelected?.voucherHeadNewId,
      }));

      const dataArray = new FormData();
      dataArray.append("active", true);
      dataArray.append("file", values.csvFile);
      dataArray.append("amount", values.amount);
      dataArray.append("cheque_dd_no", values.chequeNo);
      dataArray.append("deposited_bank_id", values.bankId);
      dataArray.append("start_row", values.startRow);
      dataArray.append("end_row", values.endRow);
      dataArray.append("school_id", values.schoolId);
      dataArray.append("voucher_head_new_id", itemSelected?.voucherHeadNewId);

      await axios
        .post(`/api/student/bankImportTransactionCSV`, dataArray)
        .then((res) => {
          setTableData(res.data.data);
          setIsSubmit(true);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error Occured",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      {isSubmit ? (
        <BankImportTable values={values} tableData={tableData} />
      ) : (
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={2.4} mt={2.5}>
              <CustomDatePicker
                name="fileImportedDate"
                label="File Imported Date"
                value={values.fileImportedDate}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.fileImportedDate}
                errors={errorMessages.fileImportedDate}
                required
                disabled
              />
            </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="schoolId"
                  label="School"
                  value={values.schoolId}
                  options={schoolOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="bankId"
                  label="Bank"
                  value={values.bankId}
                  options={bankOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Import Start Row"
                  name="startRow"
                  value={values.startRow}
                  handleChange={handleChange}
                  errors={errorMessages.startRow}
                  checks={checks.startRow}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Import End Row"
                  name="endRow"
                  value={values.endRow}
                  handleChange={handleChange}
                  errors={errorMessages.endRow}
                  checks={checks.endRow}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomFileInput
                  name="csvFile"
                  label="CSV file"
                  file={values.csvFile}
                  handleFileDrop={handleFileDrop}
                  handleFileRemove={handleFileRemove}
                  checks={checks.csvFile}
                  errors={errorMessages.csvFile}
                />
              </Grid>
        
            {/* <Grid item xs={12} md={2.4}>
            <CustomSelect
              name="type"
              label="Type"
              value={values?.type}
              items={[
                { label: "Instant", value: "instant" },
                { label: "Import", value: "import" },
              ]}
              handleChange={handleChange}
              checks={checks.type}
              errors={errorMessages.type}
              required
            />
            </Grid>   
            {values?.type === "instant" ? (
               <>
               <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Pay Id"
                  name="payId"
                  value={values.payId}
                  handleChange={handleChange}
                  errors={errorMessages.payId}
                  checks={checks.payId}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Order Details"
                  name="orderId"
                  value={values.orderId}
                  handleChange={handleChange}
                  errors={errorMessages.orderId}
                  checks={checks.orderId}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="feeType"
                  label="Fee Type"
                  value={values.feeType}
                  options={feeTypeOption}
                  handleChangeAdvance={handleChangeAdvance}
                  errors={errorMessages.feeType}
                  checks={checks.feeType}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="AUID"
                  name="auid"
                  value={values.auid}
                  handleChange={handleChange}
                  errors={errorMessages.auid}
                  checks={checks.auid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="schoolId"
                  label="School"
                  value={values.schoolId}
                  options={schoolOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
  
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="bankId"
                  label="Bank"
                  value={values.bankId}
                  options={bankOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Email"
                  name="emailId"
                  value={values.startRow}
                  handleChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Phone"
                  name="phone"
                  value={values.endRow}
                  handleChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Amount"
                  name="amount"
                  value={values.amount}
                  handleChange={handleChange}
                  required
                />
              </Grid>
              </>
            ):(
              <>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="schoolId"
                  label="School"
                  value={values.schoolId}
                  options={schoolOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="bankId"
                  label="Bank"
                  value={values.bankId}
                  options={bankOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Import Start Row"
                  name="startRow"
                  value={values.startRow}
                  handleChange={handleChange}
                  errors={errorMessages.startRow}
                  checks={checks.startRow}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Import End Row"
                  name="endRow"
                  value={values.endRow}
                  handleChange={handleChange}
                  errors={errorMessages.endRow}
                  checks={checks.endRow}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomFileInput
                  name="csvFile"
                  label="CSV file"
                  file={values.csvFile}
                  handleFileDrop={handleFileDrop}
                  handleFileRemove={handleFileRemove}
                  checks={checks.csvFile}
                  errors={errorMessages.csvFile}
                />
              </Grid>
              </>
            )} */}
          </Grid>

          <Grid container justifyContent="flex-start">
            {/* {values?.type === "import" ? ( */}
               <Grid item xs={12} md={12} mt={6}>
               <Button
                 variant="contained"
                 style={{ marginLeft: "34px" }}
                 color="success"
               >
                 {element}
               </Button>
             </Grid>
            {/* ):<></>} */}
            <Grid item xs={12} md={12} align="right" mt={1}>
              <Button variant="contained" onClick={handleCreate}>
                Import
              </Button>
            </Grid>
          </Grid>
        </FormWrapper>
      )}
    </Box>
  );
}

export default BankImport;
