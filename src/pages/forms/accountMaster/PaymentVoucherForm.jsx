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
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import FormWrapper from "../../../components/FormWrapper";
import { useLocation, useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const initialVoucherData = {
  interSchoolId: null,
  vendorId: null,
  poReference: null,
  jvNo: "",
  jvSchoolId: null,
  poOptions: [],
  jvFcyear: null,
  debit: "",
};

const initialValues = {
  schoolId: null,
  date: moment().format("DD-MM-YYYY"),
  bankId: null,
  chequeNo: "",
  payTo: "",
  deptId: null,
  isOnline: "yes",
  voucherData: [initialVoucherData],
  remarks: "",
  document: "",
};

const requiredFields = ["schoolId", "bankId", "payTo", "remarks"];

const onlineOptions = [
  {
    value: "yes",
    label: "Yes",
  },
  {
    value: "no",
    label: "No",
  },
];

function PaymentVoucherForm() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions1, setSchoolOptions1] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [fcyearOptions, setFcyearOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalDebit, setTotalDebit] = useState(0);
  const [rowValid, setRowValid] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const location = useLocation();
  const amount = location?.state?.amount;
  const index_status = location?.state?.index_status;
  const school_id = location?.state?.school_id;
  const directStatus = location?.state?.directStatus;
  const advance_status = location?.state?.advance_status;
  const schoolId = location?.state?.schoolId;
  const directDemandId = location?.state?.directDemandId;
  const navigate = useNavigate();

  const maxLength = 150;

  const checks = {
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getData();
    if (school_id || schoolId) {
      setValues((prev) => ({ ...prev, ["schoolId"]: school_id || schoolId }));
    }
    if (index_status) {
      setCrumbs([
        { name: "Payment Voucher", link: "/JournalMaster/Demand" },
        { name: "Create" },
      ]);
    } else if (advance_status) {
      setCrumbs([
        { name: "Payment Voucher", link: "/advance-payment-voucher" },
        { name: "Create" },
      ]);
    } else {
      setCrumbs([
        { name: "Payment Voucher", link: "/accounts-voucher" },
        { name: "Create" },
      ]);
    }
  }, []);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  useEffect(() => {
    const hasVendorId = values.voucherData.every((obj) => obj.vendorId);

    setRowValid(hasVendorId);

    const calculateTotalDebit = () => {
      const total = values.voucherData.reduce((sum, voucher) => {
        const debit = parseFloat(voucher.debit) || 0;
        return sum + debit;
      }, 0);
      setTotalDebit(total);
    };

    calculateTotalDebit();
  }, [values.voucherData]);

  const getData = async () => {
    try {
      const [
        { data: schoolResponse },
        { data: schoolResponse1 },
        { data: vendorResponse },
        { data: fcyearResponse },
      ] = await Promise.all([
        axios.get("/api/institute/school"),
        axios.get("/api/institute/school"),
        axios.get("/api/finance/VoucherHeadNewDetailsWoJournal"),
        axios.get("/api/FinancialYear"),
      ]);
      const schoolOptionData = [];
      const schoolData = [];
      schoolResponse?.data?.forEach((obj) => {
        schoolOptionData.push({
          value: obj.school_id,
          label: obj.school_name_short,
        });
      });
      schoolResponse1?.data?.forEach((obj) => {
        schoolData.push({
          value: obj.school_id,
          label: obj.school_name,
        });
      });

      const vendorOptionaData = [];
      vendorResponse?.data?.forEach((obj) => {
        vendorOptionaData.push({
          value: obj.voucher_head_new_id,
          label: obj.voucher_head,
        });
      });
      const fcyearOptionaData = [];
      fcyearResponse?.data?.forEach((obj) => {
        fcyearOptionaData.push({
          value: obj.financial_year_id,
          label: obj.financial_year,
        });
      });
      setSchoolOptions1(schoolData);
      setSchoolOptions(schoolOptionData);
      setVendorOptions(vendorOptionaData);
      setFcyearOptions(fcyearOptionaData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the data",
      });
      setAlertOpen(true);
    }
  };

  const getDepartmentOptions = async () => {
    const { schoolId } = values;
    if (!schoolId) return;

    try {
      const [deptResponse, bankResponse] = await Promise.all([
        axios.get(`/api/fetchdept1/${schoolId}`),
        axios.get(`/api/finance/bankDetailsBasedOnSchoolId/${schoolId}`),
      ]);
      const deptOptionData = [];
      const bankOptionData = [];
      deptResponse?.data?.data?.forEach((obj) => {
        deptOptionData.push({
          value: obj.dept_id,
          label: obj.dept_name,
        });
      });

      bankResponse?.data?.data.forEach((obj) => {
        bankOptionData.push({
          value: obj.id,
          label: obj.bank_name,
        });
      });
      setDeptOptions(deptOptionData);
      setBankOptions(bankOptionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the data",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > maxLength) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleChangeVoucher = (e) => {
    const { name, value } = e.target;
    const [field, index] = name.split("-");
    const parsedIndex = parseInt(index);
    // if (!/^\d*$/.test(value)) return;
    setValues((prev) => ({
      ...prev,
      voucherData: prev.voucherData.map((obj, i) => {
        if (i === parsedIndex)
          return {
            ...obj,
            [field]:
              (advance_status || index_status) && value > amount ? 0 : value,
          };
        return obj;
      }),
    }));
  };

  const handleChangeAdvanceVoucher = (name, newValue) => {
    const [field, index] = name.split("-");
    setValues((prev) => ({
      ...prev,
      voucherData: prev.voucherData.map((obj, i) => {
        if (i === parseInt(index)) return { ...obj, [field]: newValue };
        return obj;
      }),
    }));
  };

  const handleChangeAdvanceVendor = async (name, newValue) => {
    const [field, index] = name.split("-");

    const filterSchoolId = values.voucherData.find((obj, i) => {
      if (parseInt(index) === i) {
        return obj;
      }
    });

    let url;

    try {
      if (filterSchoolId?.interSchoolId) {
        url = `/api/purchase/getPurchaseOrderOnVoucherHeadNewIdAndSchoolId/${newValue}/${filterSchoolId?.interSchoolId}`;
      } else {
        url = `/api/purchase/getPurchaseOrderOnVoucherHeadNewIdAndSchoolId/${newValue}/${values.schoolId}`;
      }

      const { data: response } = await axios.get(`${url}`);

      const poOptionData = [];
      response?.data?.forEach((obj) => {
        poOptionData.push({
          value: obj.poReferenceNo,
          label: obj.poReferenceNo,
        });
      });
      setValues((prev) => ({
        ...prev,
        voucherData: prev.voucherData.map((obj, i) => {
          if (i === parseInt(index))
            return { ...obj, [field]: newValue, poOptions: poOptionData };
          return obj;
        }),
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load PO Reference",
      });
      setAlertOpen(true);
    }
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

  const add = () => {
    setValues((prev) => ({
      ...prev,
      voucherData: [...prev.voucherData, { ...initialVoucherData }],
    }));
  };

  const remove = () => {
    setValues((prevValues) => ({
      ...prevValues,
      voucherData: prevValues.voucherData.slice(0, -1),
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

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

  const getTotalDebit = () => {
    return values.voucherData.reduce((sum, voucher) => {
      const debit = parseFloat(voucher.debit) || 0;
      return sum + debit;
    }, 0);
  };

  const validatedVoucherData = () => {
    const { voucherData } = values;
    const hasVendor = values.voucherData.every((obj) => obj.vendorId);
    if (!hasVendor) {
      setAlertMessage({
        severity: "error",
        message: "Please select at least one vendor.",
      });
      setAlertOpen(true);
      return;
    }

    const isValid = voucherData.every((obj) => {
      const { vendorId, jvNo, jvSchoolId, jvFcyear, debit } = obj;
      if (vendorId) {
        return jvNo && jvSchoolId !== null && jvFcyear !== null && debit !== "";
      }
      return true;
    });

    if (!isValid) {
      setAlertMessage({
        severity: "error",
        message: "Please complete all fields for the selected vendor.",
      });
      setAlertOpen(true);
      return;
    }
  };

  const handleCreate = async () => {
    const {
      voucherData,
      schoolId,
      date,
      bankId,
      remarks,
      chequeNo,
      payTo,
      isOnline,
      deptId,
      document,
    } = values;
    if (!validatedVoucherData) return;
    try {
      setLoading(true);
      const postData = [];
      voucherData.forEach((obj) => {
        const maindebit = parseFloat(Number(obj?.debit).toFixed(2));
        const {
          vendorId,
          debit,
          interSchoolId,
          jvSchoolId,
          jvFcyear,
          poReference,
        } = obj;
        const vendorName = vendorOptions.find(
          (obj) => obj.value === vendorId
        )?.label;
        const valueObj = {
          school_id: schoolId,
          date: date,
          bank_id: bankId,
          voucher_head_id: vendorId,
          active: true,
          remarks,
          cheque_dd_no: chequeNo,
          debit: maindebit,
          debit_total: parseFloat(Number(totalDebit).toFixed(2)),
          inter_school_id: interSchoolId,
          jv_school_id: jvSchoolId,
          jv_financial_year_id: jvFcyear,
          pay_to: payTo,
          vendor_name: vendorName,
          po_reference: poReference,
          online: isOnline === "yes" ? 1 : 0,
          payment_mode: 3,
          dept_id: deptId,
          env_bill_details_id: directDemandId || null,
          type: school_id
            ? "DIRECT-PV"
            : directStatus
            ? "DEMAND-PV"
            : advance_status
            ? "ADVANCE-PV"
            : "GRN-PV",
        };
        postData.push(valueObj);
      });

      const { data: response } = await axios.post(
        "/api/finance/draftPaymentVoucher",
        postData
      );

      if (!response.success) {
        setAlertMessage({
          severity: "error",
          message: "Unable to create the payment voucher.",
        });
        setAlertOpen(true);
        return;
      }
      const responseData = response.data[0];

      if (!directStatus) {
        const dataArray = new FormData();
        dataArray.append("file", document);
        dataArray.append("voucher_no", responseData.voucher_no);
        const { data: documentResponse } = await axios.post(
          "/api/finance/draftPaymentVoucherUploadFile",
          dataArray
        );
        if (documentResponse.success) {
          setAlertMessage({
            severity: "success",
            message: "Payment voucher has been created successfully.",
          });
          setAlertOpen(true);
          setValues(initialValues);
          navigate("/draft-payment-voucher-verify");
        }
      }

      if (response.status) {
        setAlertMessage({
          severity: "success",
          message: "Payment voucher has been created successfully.",
        });
        setAlertOpen(true);
        setValues(initialValues);
        navigate("/draft-payment-voucher-verify");
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Unable to create the payment voucher.",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ margin: { xs: "20px 0px 0px 0px", md: "15px 15px 0px 15px" } }}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions1}
              disabled={school_id || schoolId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="date"
              label="Date"
              value={values.date}
              disabled
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
              name="chequeNo"
              label="Cheque No."
              value={values.chequeNo}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="payTo"
              label="Pay To"
              value={values.payTo}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <CustomAutocomplete
              name="deptId"
              label="Department"
              value={values.deptId}
              options={deptOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="isOnline"
              label="Is Online"
              value={values.isOnline}
              items={onlineOptions}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Inter School</StyledTableCell>
                    <StyledTableCell>Vendor</StyledTableCell>
                    <StyledTableCell>PO Reference</StyledTableCell>
                    <StyledTableCell>JV No</StyledTableCell>
                    <StyledTableCell>JV School</StyledTableCell>
                    <StyledTableCell>JV FC Year</StyledTableCell>
                    <StyledTableCell>Debit</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {values.voucherData?.map((obj, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <CustomAutocomplete
                          name={`interSchoolId-${i}`}
                          value={values.voucherData[i].interSchoolId}
                          options={schoolOptions.filter(
                            (obj) => obj.value !== values.schoolId
                          )}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`vendorId-${i}`}
                          value={values.voucherData[i].vendorId}
                          options={vendorOptions}
                          handleChangeAdvance={handleChangeAdvanceVendor}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`poReference-${i}`}
                          value={values.voucherData[i].poReference}
                          options={values.voucherData[i].poOptions || []}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          name={`jvNo-${i}`}
                          value={values.voucherData[i].jvNo}
                          handleChange={handleChangeVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`jvSchoolId-${i}`}
                          value={values.voucherData[i].jvSchoolId}
                          options={schoolOptions}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`jvFcyear-${i}`}
                          value={values.voucherData[i].jvFcyear}
                          options={fcyearOptions}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          name={`debit-${i}`}
                          value={values.voucherData[i].debit}
                          inputProps={{
                            style: { textAlign: "right" },
                          }}
                          handleChange={handleChangeVoucher}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                      <Typography variant="subtitle2">Total</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle2">{totalDebit}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={add}
              >
                <AddIcon />
              </Button>
              {values.voucherData?.length > 1 && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={remove}
                >
                  <RemoveIcon />
                </Button>
              )}
            </Box>
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
          {!directStatus ? (
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
          ) : (
            <></>
          )}

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading || !requiredFieldsValid() || !rowValid}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Create"
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default PaymentVoucherForm;
