import React, { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, IconButton } from "@mui/material";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import BankImportTable from "./BankImportTable";
import csvFile from "../../../assets/sample.xlsx";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import { Delete as DeleteIcon } from "@mui/icons-material"; 
import { useNavigate } from "react-router-dom";
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

const transactionTypeOption = [
  { label: "Registration", value: 1 },
  { label: "Bulk", value: 2 },
  { label: "College", value: 3 },
  { label: "Exam", value: 4 },
]

const initialValues = {
  type: "import",
//  fileImportedDate: new Date(),
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
  transactionType: null,
  payId: "",
  orderId: "",
  auid: "",
  emailId: "",
  phone: "",
  transactionDate: "",
};

const requiredFields = ["bankId", "startRow", "endRow"];

function BankImport() {
  const [values, setValues] = useState(initialValues);
  const [bankOptions, setBankOptions] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [dynamicFieldErrors, setDynamicFieldErrors] = useState({});
  const [dynamicFields, setDynamicFields] = useState([])
  
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  

  const checks = {
    startRow: [/[0-9]/.test(values.startRow)],
    endRow: [/[0-9]/.test(values.endRow)],
    type: [(value) => value !== null],
    payId: [(value) => value !== ""],
    orderId: [(value) => value !== ""],
    schoolId: [(value) => value !== null],
    bankId: [(value) => value !== null],
    transactionType: [(value) => value !== null],
    amount: [(value) => (value !== "", /[0-9]/.test(value))],
    transactionDate: [(value) => values !== null],
    dynamicPayId: [(value) => value !== ""],
    dynamicOrderId: [(value) => value !== ""],
    dynamicTransactionType: [(value) => value !== null],
    dynamicAmount: [(value) => (value !== "", /[0-9]/.test(value))],
    dynamicTransactionDate: [(value) => value !== ""],
    dynamicTransactionType: [(value) => value !== null],
    dynamicDeposited_bank_id:  [(value) => value !== null],
    dynamicSchoolId: [(value) => value !== null]
  };

  const errorMessages = {
    startRow: ["Enter only numbers"],
    endRow: ["Enter only numbers"],
    type: ["This field is required"],
    payId: ["This field is required"],
    orderId: ["This field is required"],
    transactionType: ["This field is required"],
    amount: ["This field is required", "Invalid Amount"],
    transactionDate: ["This field is required"],
    schoolId: ["This field is required"],
    bankId: ["This field is required"]
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

    if (e?.target?.name === "endRow") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
    else{
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
    if (values?.type === 'import') {
      if(!requiredFieldsValid()){
        setAlertMessage({
          severity: "error",
          message: "Please fill required fields",
        });
        setAlertOpen(true);
        return;
      }else{
        const itemSelected = bankOptions.find((obj) => obj.value === values.bankId);
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
    }else{
   //   Validate dynamic fields
      const isDynamicFieldsValid = validateDynamicFields();
      if (!isDynamicFieldsValid) {
        setAlertMessage({
          severity: "error",
          message: "Please fill all dynamic fields",
        });
        setAlertOpen(true);
        return;
      } else{ 
      const dynamicFieldData = dynamicFields?.length >0 && dynamicFields?.map(({ id, ...rest }) => rest);
      const itemSelected = bankOptions.find((obj) => obj.value === values.bankId);
    const obj = {
      "deposited_bank_id": values?.bankId,
      "amount": values?.amount,
      "school_id": values?.schoolId,
      "order_id": values?.orderId,
      "pay_id": values?.payId,
      "auid": "",
      "emailId": "",
      "phone": "",
      "transactionDate": values?.transactionDate,
      "transactionType": values?.transactionType,
      "remark": "create by instant",
      "receiptStatus": "P",
      "balance": values?.amount,
      "cheque_dd_no": values.chequeNo,
      "voucher_head_new_id":itemSelected?.voucherHeadNewId,
    };

  const dataArray = dynamicFields?.length > 0 ? [...dynamicFieldData, obj ] : [obj]
    await axios
    .post(`/api/student/saveBankImportTransaction`, dataArray)
    .then((res) => {
      navigate('/BankMaster/Import')
    })
    .catch((err) => {
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "Error Occured",
      });
      setAlertOpen(true);
    });

     }
  }
  }


  const handleAddField = () => {
    const newField = {
      id: Date.now(), // Unique ID for each field
      transactionDate: "",
      schoolId: null,
      deposited_bank_id: null,
      amount: "",
      transactionType: null,
      payId: "",
      orderId: "",
      auid: "",
      emailId: "",
      phone: "",
      receiptStatus: "P",
      balance: "",
      cheque_dd_no: "",
      active: true,
      voucherHeadNewId: ""
    };
    setDynamicFields([...dynamicFields, newField]);
  };

  const handleRemoveField = (id) => {
    const updatedFields = dynamicFields.filter((field) => field?.id !== id);
    setDynamicFields(updatedFields);
  };

  const handleDynamicChange = (id, e) => {
    const { name, value } = e.target;
    // Update the specific dynamic field
    let updatedFields = []
    if(name === "amount"){
       updatedFields = dynamicFields.map((field) =>
        field?.id === id ? { ...field, [name]: value, balance: value } : field
      );
    }else{
     updatedFields = dynamicFields.map((field) =>
      field?.id === id ? { ...field, [name]: value } : field
    );
    }
    setDynamicFields(updatedFields);
  };

  const handleDynamicChangeAdvance = (id, name, newValue) => {
    let updatedFields = []
    if(name === "deposited_bank_id"){
      const itemSelected = bankOptions?.find((obj) => obj?.value === newValue);
       updatedFields = dynamicFields?.map((field) =>
        field?.id === id ? { ...field, [name]: newValue,  ["voucherHeadNewId"]: itemSelected?.voucherHeadNewId } : field
      );
    }
    else{
     updatedFields = dynamicFields?.map((field) =>
      field?.id === id ? { ...field, [name]: newValue } : field
    );
    }
    setDynamicFields(updatedFields);
  };

  const validateDynamicFields = () => {
    const errors = {};
    if (!checks?.payId[0](values?.payId)) {
      errors.payId = errorMessages.payId;
    }
    if (!checks?.orderId[0](values?.orderId)) {
      errors.orderId = errorMessages.orderId;
    }
    if (!checks?.schoolId[0](values?.schoolId)) {
      errors.schoolId = errorMessages.schoolId;
    }
    if (!checks?.bankId[0](values?.bankId)) {
      errors.bankId = errorMessages.bankId;
    }
    if (!checks?.amount[0](values?.amount)) {
      errors.amount = errorMessages.amount;
    }
    if (!checks?.transactionType[0](values?.transactionType)) {
      errors.transactionType = errorMessages.transactionType;
    }
    dynamicFields?.forEach((field, index) => {
      const fieldErrors = {};
        if (!checks?.dynamicPayId[0](field?.payId)) {
        fieldErrors.payId = errorMessages.payId;
      }
      if (!checks?.dynamicPayId[0](field?.payId)) {
        fieldErrors.payId = errorMessages.payId;
      } 
      if (!checks?.dynamicOrderId[0](field?.orderId)) {
        fieldErrors.orderId = errorMessages.orderId;
      } 
      if (!checks?.dynamicTransactionType[0](field?.transactionType)) {
        fieldErrors.transactionType = errorMessages.transactionType;
      } 
      if (!checks?.dynamicAmount[0](field?.amount)) {
        fieldErrors.amount = errorMessages.amount[0];
      }
      if (!checks?.dynamicDeposited_bank_id[0](field?.deposited_bank_id)) {
        fieldErrors.dynamicDeposited_bank_id = errorMessages.bankId;
      }
      if (!checks?.dynamicSchoolId[0](field?.schoolId)) {
        fieldErrors.dynamicSchoolId = errorMessages.schoolId;
      }
      if (Object.keys(fieldErrors)?.length > 0) {
        errors[index] = fieldErrors;
      }
    });
  
    setDynamicFieldErrors(errors);
    return Object.keys(errors)?.length === 0; // Return true if no errors
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
            {/* <Grid item xs={12} md={2.4} mt={2.5}>
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
            </Grid> */}
            <Grid item xs={12} md={2.4}>
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
                 <CustomDatePicker
                      name="transactionDate"
                      label="Transaction Date"
                      value={values.transactionDate}
                      handleChangeAdvance={handleChangeAdvance}
                      errors={errorMessages.transactionDate}
                      maxDate={new Date()}
                      required
                    />
                 </Grid>
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
                  name="transactionType"
                  label="Fee Type"
                  value={values.transactionType}
                  options={transactionTypeOption}
                  handleChangeAdvance={handleChangeAdvance}
                  errors={errorMessages.transactionType}
                  checks={checks.transactionType}
                  required
                />
              </Grid>
              {/* <Grid item xs={12} md={3}>
                <CustomTextField
                  label="AUID"
                  name="auid"
                  value={values.auid}
                  handleChange={handleChange}
                  errors={errorMessages.auid}
                  checks={checks.auid}
                  required
                />
              </Grid> */}
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
              {/* <Grid item xs={12} md={3}>
                <CustomTextField
                  label="Email"
                  name="emailId"
                  value={values.emailId}
                  handleChange={handleChange}
                //  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  label="Phone"
                  name="phone"
                  value={values.phone}
                  handleChange={handleChange}
                 // required
                />
              </Grid> */}
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Amount"
                  name="amount"
                  value={values.amount}
                  handleChange={handleChange}
                  errors={errorMessages.amount}
                  checks={checks.amount}
                  required
                />
              </Grid>
              
              {/* dynamic row field */}
              {dynamicFields.map((field, index) => (
              <Grid container key={field.id} alignItems="center" justifyContent="flex-start" rowSpacing={2} columnSpacing={{ xs: 2, md: 4 }} sx={{width: '100%', marginLeft: '0px !important', marginTop: "10px"}}>
                 <Grid item xs={12} md={2.4}>
                 <CustomDatePicker
                      name="transactionDate"
                      label="Transaction Date"
                      value={field.transactionDate}
                      handleChangeAdvance={(name, value) => handleDynamicChangeAdvance(field.id, name, value)}
                      errors={dynamicFieldErrors[index]?.transactionDate}
                      maxDate={new Date()}
                      required
                    />
                 </Grid>
               <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Pay Id"
                  name="payId"
                  value={field.payId}
                  handleChange={(e) => handleDynamicChange(field.id, e)}
                  errors={dynamicFieldErrors[index]?.payId}
                  checks={checks.payId}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Order Details"
                  name="orderId"
                  value={field.orderId}
                  handleChange={(e) => handleDynamicChange(field.id, e)}
                  errors={dynamicFieldErrors[index]?.orderId}
                  checks={checks.orderId}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="transactionType"
                  label="Transaction Type"
                  value={field.transactionType}
                  options={transactionTypeOption}
                  handleChangeAdvance={(name, value) => handleDynamicChangeAdvance(field.id, name, value)}
                  errors={dynamicFieldErrors[index]?.transactionType}
                  checks={checks.transactionType}
                  required
                />
              </Grid>
              {/* <Grid item xs={12} md={3}>
                <CustomTextField
                  label="AUID"
                  name="auid"
                  value={field.auid}
                  handleChange={(e) => handleDynamicChange(field.id, e)}
                  errors={dynamicFieldErrors[index]?.auid}
                  checks={checks.auid}
                  required
                />
              </Grid> */}
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="schoolId"
                  label="School"
                  value={field.schoolId}
                  options={schoolOptions}
                  handleChangeAdvance={(name,value) => handleDynamicChangeAdvance(field.id, name, value)}
                  required
                />
              </Grid>  
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="deposited_bank_id"
                  label="Bank"
                  value={field.deposited_bank_id}
                  options={bankOptions}
                  handleChangeAdvance={(name, value) => handleDynamicChangeAdvance(field.id, name, value)}
                  required
                />
              </Grid>
              {/* <Grid item xs={12} md={3}>
                <CustomTextField
                  label="Email"
                  name="emailId"
                  value={field.startRow}
                  handleChange={(e) => handleDynamicChange(field.id, e)}
                 // required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomTextField
                  label="Phone"
                  name="phone"
                  value={field.endRow}
                  handleChange={(e) => handleDynamicChange(field.id, e)}
                 // required
                />
              </Grid> */}
              <Grid item xs={12} md={2.4}>
                <CustomTextField
                  label="Amount"
                  name="amount"
                  value={field.amount}
                  handleChange={(e) => handleDynamicChange(field.id, e)}
                  errors={dynamicFieldErrors[index]?.amount}
                  checks={checks.amount}
                  required
                />
              </Grid>
                <Grid item xs={12} md={2.4}>
                  <Box>
                  {index === dynamicFields.length - 1 && (
                     <Button
                     variant="contained"
                     color="success"
                     onClick={handleAddField}
                   >
                     Add
                   </Button>
                  )}
                 <IconButton
                      color="error"
                      onClick={() => handleRemoveField(field.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
               </Grid>
            </Grid>
              ))}
              {dynamicFields?.length < 1 && (
                 <Grid item xs={12} md={3}>
                 <Button
                   variant="contained"
                   color="success"
                   onClick={handleAddField}
                 >
                   Add
                 </Button>
               </Grid> 
              )}
              </>
            ):(
              <>
              <Grid item xs={12} md={3}>
                <CustomAutocomplete
                  name="schoolId"
                  label="School"
                  value={values.schoolId}
                  options={schoolOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomAutocomplete
                  name="bankId"
                  label="Bank"
                  value={values.bankId}
                  options={bankOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <CustomFileInput
                  name="csvFile"
                  label="CSV file"
                  file={values.csvFile}
                  acceptType=".csv"
                  handleFileDrop={handleFileDrop}
                  handleFileRemove={handleFileRemove}
                  checks={checks.csvFile}
                  errors={errorMessages.csvFile}
                />
              </Grid>
              </>
            )}
          </Grid>

          <Grid container justifyContent="flex-start">
            {values?.type !== "instant" ? (
               <Grid item xs={12} md={12} mt={6}>
               <Button
                 variant="contained"
                 style={{ marginLeft: "34px" }}
                 color="success"
               >
                 {element}
               </Button>
             </Grid>
             ):<></>}
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
