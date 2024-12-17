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
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
  poOptions: [],
  debit: 0,
  credit: 0,
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

const breadCrumbsList = [
  { name: "Accounts Voucher", link: "/draft-jv" },
  { name: "Journal" },
];

function JournalVoucherForm() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({ debit: 0, credit: 0 });
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState([]);

  const { vcNo, schoolId, fcyearId, type, amount } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const maxLength = 150;

  useEffect(() => {
    fetchData();
    if (
      pathname === "/journal-voucher" ||
      pathname === `/journal-voucher/${type}/${amount}`
    ) {
      setIsNew(true);
      setCrumbs([...breadCrumbsList, { name: "Create" }]);
    } else {
      setIsNew(false);
      getData();
      setCrumbs([...breadCrumbsList, { name: "Edit" }]);
    }
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

  const fetchData = async () => {
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

  const getData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/finance/getDraftJournalVoucherData/${vcNo}/${schoolId}/${fcyearId}`
      );
      const responseData = response.data;
      console.log("responseData", responseData);
      const {
        school_id: school,
        dept_id: deptId,
        date,
        pay_to: payTo,
        remarks,
      } = responseData[0];

      const updateVoucherData = [];

      responseData.forEach((obj) => {
        const {
          vendor_active: headType,
          voucher_head_id: voucherId,
          purchase_ref_number: poReference,
          debit,
          credit,
          id,
          inter_school_id: interSchoolId,
        } = obj;
        updateVoucherData.push({
          interSchoolId,
          headType,
          vendorId: voucherId,
          poReference,
          debit,
          credit,
          id,
        });
      });

      setValues((prev) => ({
        ...prev,
        schoolId: school,
        deptId,
        date,
        payTo,
        voucherData: updateVoucherData,
        remarks,
      }));
      setData(responseData);
    } catch (err) {
      console.error(err);

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
    if (name === "remarks" && value.length > maxLength) return;
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

  const handleChangeAdvanceVendor = async (name, newValue) => {
    const [field, index] = name.split("-");
    const { schoolId } = values;

    try {
      const { data: response } = await axios.get(
        `api/purchase/getPurchaseOrderOnVoucherHeadNewIdAndSchoolId/${newValue}/${schoolId}`
      );

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
        message: "Please select at least one head.",
      });
      setAlertOpen(true);
      return false;
    }

    const isValid = voucherData.every((obj) => {
      const { vendorId, debit, credit } = obj;
      if (vendorId) {
        return debit || credit;
      }
      return true;
    });

    if (!isValid) {
      setAlertMessage({
        severity: "error",
        message: "Please complete all fields for the selected vendor.",
      });
      setAlertOpen(true);
      return false;
    }

    if (total.debit !== total.credit) {
      setAlertMessage({
        severity: "error",
        message: "The total debit and credit amounts must be equal.",
      });
      setAlertOpen(true);
      return false;
    }

    if (type === "demand" && total.debit !== amount) {
      setAlertMessage({
        severity: "error",
        message: `The amount exceeds the maximum limit of ${amount}`,
      });
      setAlertOpen(true);
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    const { voucherData, date, schoolId, remarks, payTo, deptId } = values;
    if (!validatedVoucherData()) return;
    try {
      setLoading(true);
      const postData = [];
      voucherData.forEach((obj) => {
        const {
          vendorId,
          credit,
          debit,
          interSchoolId,
          headType,
          poReference,
        } = obj;
        const valueObj = {
          active: true,
          credit,
          credit_total: total.credit,
          date,
          debit,
          debit_total: total.debit,
          dept_id: deptId,
          purchase_ref_number: poReference,
          remarks,
          school_id: schoolId,
          vendor_active: headType,
          voucher_head_id: vendorId,
          pay_to: payTo,
          inter_school_id: interSchoolId,
          payment_mode: 1,
        };
        if (headType === 0) {
          valueObj.expensense_head = vendorId;
        } else if (headType === 1) {
          valueObj.vendor_id = vendorId;
        }
        postData.push(valueObj);
      });

      const { data: response } = await axios.post(
        "/api/finance/draftJournalVoucher",
        postData
      );

      if (!response.success) {
        setAlertMessage({
          severity: "error",
          message: "Unable to create the journal voucher.",
        });
        setAlertOpen(true);
        return;
      }

      setAlertMessage({
        severity: "success",
        message: "Journal voucher has been created successfully.",
      });
      setAlertOpen(true);
      navigate("/draft-jv");
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

  const handleUpdate = async () => {
    const putData = [...data];
    const { voucherData, schoolId, deptId, date, remarks, payTo } = values;
    if (!validatedVoucherData()) return;
    try {
      setLoading(true);

      putData.forEach((obj, i) => {
        const filter = voucherData.filter((item) => item.id === obj.id);
        if (filter.length > 0) {
          delete obj.id;
          const { credit, debit, poReference, headType, vendorId, id } =
            filter[0];

          obj.credit = credit;
          obj.credit_total = total.credit;
          obj.debit = debit;
          obj.debit_total = total.debit;
          obj.date = date;
          obj.dept_id = deptId;
          obj.purchase_ref_number = poReference;
          obj.remarks = remarks;
          obj.school_id = schoolId;
          obj.vendor_active = headType;
          obj.voucher_head_id = vendorId;
          obj.pay_to = payTo;
          obj.draft_journal_voucher_id = id;
        }
      });

      const ids = [];
      voucherData.forEach((obj) => {
        ids.push(obj.id);
      });

      const { data: response } = await axios.put(
        `/api/finance/updateDraftJournalVoucher/${ids.toString()}`,
        putData
      );
      if (!response.success) {
        setAlertMessage({
          severity: "error",
          message: "Unable to update the journal voucher.",
        });
        setAlertOpen(true);
        return;
      }
      setAlertMessage({
        severity: "success",
        message: "Journal voucher has been updated successfully.",
      });
      setAlertOpen(true);
      navigate("/draft-jv");
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
                          handleChangeAdvance={handleChangeAdvanceVendor}
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
              onClick={isNew ? handleCreate : handleUpdate}
              disabled={loading || !requiredFieldsValid()}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : isNew ? (
                "Create"
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default JournalVoucherForm;
