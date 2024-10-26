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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const initialVoucherData = {
  interSchoolId: null,
  headType: "",
  vendorId: null,
  poReference: null,
  debit: "",
  credit: "",
};

const initialValues = {
  schoolId: null,
  deptId: null,
  date: moment().format("DD-MM-YYYY"),
  payTo: "",
  voucherData: [initialVoucherData, initialVoucherData],
  remarks: "",
};

const requiredFields = ["schoolId", "deptId", "payTo", "remarks"];

const headTypeList = [
  {
    value: 0,
    label: "Expense Head",
  },
  {
    value: 1,
    label: "Vendor",
  },
];

function JournalVoucherForm() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({ debit: 0, credit: 0 });

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const maxLength = 150;

  useEffect(() => {
    getData();
    setCrumbs([
      { name: "Accounts Voucher", link: "/accounts-voucher" },
      { name: "Journal" },
      { name: "Create" },
    ]);
  }, []);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  useEffect(() => {
    const calculateTotal = () => {
      const totals = values.voucherData.reduce(
        (acc, voucher) => {
          acc.debit += parseFloat(voucher.debit) || 0;
          acc.credit += parseFloat(voucher.credit) || 0;
          return acc;
        },
        { debit: 0, credit: 0 }
      );
      setTotal(totals);
    };
    calculateTotal();
  }, [values.voucherData]);

  const getData = async () => {
    try {
      const [
        { data: schoolResponse },
        { data: vendorResponse },
        { data: deptResponse },
      ] = await Promise.all([
        axios.get("/api/institute/school"),
        axios.get("/api/finance/getAllJournalTypeExceptInflow"),
        axios.get("/api/dept"),
      ]);
      const schoolOptionData = [];
      schoolResponse?.data?.forEach((obj) => {
        schoolOptionData.push({
          value: obj.school_id,
          label: obj.school_name,
        });
      });
      const vendorOptionaData = [];
      vendorResponse?.data?.forEach((obj) => {
        vendorOptionaData.push({
          value: obj.voucher_head_new_id,
          label: obj.voucher_head,
          isVendor: obj.is_vendor,
        });
      });
      const deptOptionData = [];
      deptResponse?.data?.forEach((obj) => {
        deptOptionData.push({
          value: obj.dept_id,
          label: obj.dept_name,
        });
      });

      setSchoolOptions(schoolOptionData);
      setVendorOptions(vendorOptionaData);
      setDeptOptions(deptOptionData);
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
      const { data: deptResponse } = await axios.get(
        `/api/fetchdept1/${schoolId}`
      );
      const deptOptionData = [];
      deptResponse?.data?.forEach((obj) => {
        deptOptionData.push({
          value: obj.dept_id,
          label: obj.dept_name,
        });
      });
      setDeptOptions(deptOptionData);
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
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleChangeVoucher = (e) => {
    const { name, value } = e.target;
    const [field, index] = name.split("-");
    const parsedIndex = parseInt(index);
    if (!/^\d*$/.test(value)) return;
    setValues((prev) => ({
      ...prev,
      voucherData: prev.voucherData.map((obj, i) => {
        if (i === parsedIndex) return { ...obj, [field]: value };
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
      if (!values[field]) return false;
    }
    return true;
  };

  const filteredVendorOptions = (index) => {
    const type = values.voucherData[index].headType;
    const id = type === 1 ? true : type === 0 ? false : null;
    const filterOptions = vendorOptions.filter((obj) => obj.isVendor === id);
    return filterOptions;
  };

  const handleInterSchoolOptions = () =>
    values.schoolId === null
      ? []
      : schoolOptions.filter((obj) => obj.value !== values.schoolId);

  const validatedVoucherData = () => {
    const { voucherData } = values;
    const hasVendor = voucherData.some((obj) => obj.vendorId !== null);
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
        const { vendorId, debit, interSchoolId, poReference } = obj;
        const vendorName = vendorOptions.find(
          (obj) => obj.value === vendorId
        )?.label;
        const valueObj = {
          school_id: schoolId,
          date: date,
          bank_id: bankId,
          expense_head_id: vendorId,
          active: true,
          remarks,
          cheque_no: chequeNo,
          //   debit,
          //   debit_total: totalDebit,
          inter_institute_id: interSchoolId,
          pay_to: payTo,
          vendor_active: true,
          vendor_name: vendorName,
          po_reference: poReference,
          online: isOnline === "yes" ? 1 : 0,
          payment_mode: 3,
          dep_id: deptId,
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
          message: "Payment voucher has beem created successfully.",
        });
        setAlertOpen(true);
        setValues(initialValues);
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

  const createFormData = (file, candidateId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("candidate_id", candidateId);
    return formData;
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
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
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
            <CustomTextField
              name="payTo"
              label="Pay To"
              value={values.payTo}
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
                    <StyledTableCell>Heads</StyledTableCell>
                    <StyledTableCell>Ledger</StyledTableCell>
                    <StyledTableCell>PO Reference</StyledTableCell>
                    <StyledTableCell>Debit</StyledTableCell>
                    <StyledTableCell>Credit</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {values.voucherData?.map((obj, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <CustomAutocomplete
                          name={`interSchoolId-${i}`}
                          value={values.voucherData[i].interSchoolId}
                          options={handleInterSchoolOptions()}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`headType-${i}`}
                          value={values.voucherData[i].headType}
                          options={headTypeList}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`vendorId-${i}`}
                          value={values.voucherData[i].vendorId}
                          options={filteredVendorOptions(i)}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`poReference-${i}`}
                          value={values.voucherData[i].poReference}
                          options={[]}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <CustomTextField
                          name={`debit-${i}`}
                          value={values.voucherData[i].debit}
                          inputProps={{
                            style: { textAlign: "right" },
                          }}
                          handleChange={handleChangeVoucher}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <CustomTextField
                          name={`credit-${i}`}
                          value={values.voucherData[i].credit}
                          inputProps={{
                            style: { textAlign: "right" },
                          }}
                          handleChange={handleChangeVoucher}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                      <Typography variant="subtitle2">Total</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle2">{total.debit}</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle2">
                        {total.credit}
                      </Typography>
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
              {values.voucherData?.length > 2 && (
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
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading || !requiredFieldsValid()}
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

export default JournalVoucherForm;
