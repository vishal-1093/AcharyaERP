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
import moment from "moment";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const initialVoucherData = {
  interSchoolId: null,
  vendorId: null,
  deptId: null,
  deptOptions: [],
  debit: 0,
  credit: 0,
};

const initialValues = {
  voucherData: [],
  remarks: "",
};

const requiredFields = ["remarks"];

function JournalGrnForm({ rowData, getData, setModalWrapperOpen }) {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [total, setTotal] = useState({ debit: 0, credit: 0 });
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const maxLength = 250;

  useEffect(() => {
    fetchData();
  }, []);

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
    console.log("rowData", rowData);
    try {
      const [
        schoolResponse,
        vendorResponse,
        grnResponse,
        activeVendorResponse,
        deptResponse,
      ] = await Promise.all([
        axios.get("/api/institute/school"),
        axios.get("/api/finance/getAllJournalTypeExceptInflow"),
        axios.get(`/api/purchase/getJournalVoucher?grnNo=${rowData.grn_no}`),
        axios.get("/api/inventory/vendorActiveDetails"),
        axios.get(`/api/fetchdept1/${rowData.institute_id}`),
      ]);
      const schoolOptionData = [];
      schoolResponse.data.data.forEach((obj) => {
        schoolOptionData.push({
          value: obj.school_id,
          label: obj.school_name_short,
        });
      });
      const deptOptionData = [];
      deptResponse.data.data.forEach((obj) => {
        deptOptionData.push({
          value: obj.dept_id,
          label: obj.dept_name,
        });
      });
      const grnResponseData = grnResponse.data.data;
      const { vendor_id: vendorId, total } = grnResponseData[0];
      const activeVendorResponseData = activeVendorResponse.data.data;
      const vendorVoucherId = activeVendorResponseData.find(
        (obj) => obj.vendor_id === vendorId
      );
      const amounts = grnResponseData.reduce((acc, next) => {
        const key = next.voucher_head_new_id;
        if (acc[key]) {
          acc[key] = acc[key] + next.total_amount;
        } else acc[key] = next.total_amount;
        return acc;
      }, {});
      const ids = Object.keys(amounts);
      const tempVoucherData = [];
      ids.forEach((obj) => {
        tempVoucherData.push({
          interSchoolId: null,
          vendorId: Number(obj),
          debit: amounts[obj],
          credit: 0,
          deptOptions: deptOptionData,
        });
      });
      tempVoucherData.push({
        interSchoolId: null,
        vendorId: vendorVoucherId?.voucher_head_new_id,
        debit: 0,
        credit: total,
        deptOptions: deptOptionData,
      });
      const vendorOptionaData = [];
      const vendorResponseData = vendorResponse.data.data.filter(
        (obj) =>
          obj.is_vendor === false ||
          obj.voucher_head_new_id === vendorVoucherId?.voucher_head_new_id
      );
      vendorResponseData.forEach((obj) => {
        vendorOptionaData.push({
          value: obj.voucher_head_new_id,
          label: obj.voucher_head,
          isVendor: obj.is_vendor,
        });
      });
      const optionsMap = new Map(
        vendorOptionaData
          .filter((opt) => !opt.isVendor)
          .map((opt) => [opt.value, opt.label])
      );
      const result = tempVoucherData.map(
        (item) => optionsMap.get(item.vendorId) || ""
      );
      const customRemarks = `Being Bill Towards Purchase of ${result
        ?.filter(Boolean)
        ?.toString()} vide Bill No. : ${rowData.invoice_number} / ${moment(
        rowData.invoice_date
      ).format("DD-MM-YYYY")},${rowData.vendor_name},GRN No. : ${
        rowData.grn_no
      },PO No. : ${rowData.purchase_ref_no}.`;
      setValues((prev) => ({
        ...prev,
        ["remarks"]: customRemarks,
        ["voucherData"]: tempVoucherData,
      }));
      setSchoolOptions(schoolOptionData);
      setVendorOptions(vendorOptionaData);
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the data",
      });
      setAlertOpen(true);
      setModalWrapperOpen(false);
    }
  };

  const handleInterSchoolOptions = () =>
    values.schoolId === null
      ? []
      : schoolOptions.filter((obj) => obj.value !== values.schoolId);

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

  const handleChangeAdvanceSchool = async (name, newValue) => {
    const [field, index] = name.split("-");
    try {
      const deptOptionData = [];
      if (newValue) {
        const response = await axios.get(`/api/fetchdept1/${newValue}`);
        response.data.data.forEach((obj) => {
          deptOptionData.push({
            value: obj.dept_id,
            label: obj.dept_name,
          });
        });
      }
      setValues((prev) => ({
        ...prev,
        voucherData: prev.voucherData.map((obj, i) => {
          if (i === parseInt(index))
            return { ...obj, [field]: newValue, deptOptions: deptOptionData };
          return obj;
        }),
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load Department",
      });
      setAlertOpen(true);
      setModalWrapperOpen(false);
    }
  };

  const handleChangeVoucher = (e) => {
    const { name, value } = e.target;
    const [field, index] = name.split("-");
    const parsedIndex = parseInt(index);
    if (!/^\d*\.?\d*$/.test(value)) return;
    setValues((prev) => ({
      ...prev,
      voucherData: prev.voucherData.map((obj, i) => {
        if (i === parsedIndex) return { ...obj, [field]: value };
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "remarks" && value.length > maxLength) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
    }
    return true;
  };

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
    return true;
  };

  console.log("rowData", rowData);
  const handleCreate = async () => {
    const { voucherData, remarks } = values;
    if (!validatedVoucherData()) return;
    try {
      setLoading(true);
      const postData = [];
      voucherData.forEach((obj) => {
        const { vendorId, credit, debit, interSchoolId, deptId } = obj;
        const valueObj = {
          active: true,
          credit,
          credit_total: total.credit,
          date: moment().format("DD-MM-YYYY"),
          debit,
          debit_total: total.debit,
          dept_id: deptId,
          purchase_ref_number: rowData.purchase_ref_no,
          remarks,
          school_id: rowData.institute_id,
          voucher_head_id: vendorId,
          pay_to: rowData.vendor_name,
          inter_school_id: interSchoolId,
          payment_mode: 3,
          reference_number: rowData.grn_no,
        };
        postData.push(valueObj);
      });
      console.log("postData", postData);

      const { data: response } = await axios.post(
        "/api/finance/draftJournalVoucher",
        postData
      );
      if (response.success) {
        const updateBody = {
          draft_journal_voucher_id: response.data[0].draft_journal_voucher_id,
          grn_no: rowData.grn_no,
        };
        const updateGrn = await axios.put(
          "/api/purchase/updateGrnDraftJournalVoucher",
          updateBody
        );
        if (!updateGrn.data.success) throw new Error();
        setAlertMessage({
          severity: "success",
          message: "Journal voucher has been created successfully.",
        });
        setAlertOpen(true);
        getData();
        setModalWrapperOpen(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Unable to create the journal voucher.",
      });
      setAlertOpen(true);
      setModalWrapperOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const DisplayBoldText = ({ label }) => (
    <Typography variant="subtitle2">{label}</Typography>
  );

  const DisplayHeader = ({ label, value }) => (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
      <DisplayBoldText label={label} />
      <Typography variant="subtitle2" color="textSecondary">
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box mt={2}>
      <FormPaperWrapper>
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item xs={12} md={3}>
            <DisplayHeader label="Date" value={moment().format("DD-MM-YYYY")} />
          </Grid>
          <Grid item xs={12} md={3}>
            <DisplayHeader label="Vendor Name" value={rowData.vendor_name} />
          </Grid>
          <Grid item xs={12} md={3}>
            <DisplayHeader label="PO Number" value={rowData.purchase_ref_no} />
          </Grid>
          <Grid item xs={12} md={3}>
            <DisplayHeader label="School" value={rowData.school_name_short} />
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Inter School</StyledTableCell>
                    <StyledTableCell>Ledger</StyledTableCell>
                    <StyledTableCell>Dept Id</StyledTableCell>
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
                          handleChangeAdvance={handleChangeAdvanceSchool}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`vendorId-${i}`}
                          value={values.voucherData[i].vendorId}
                          options={vendorOptions}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomAutocomplete
                          name={`deptId-${i}`}
                          value={values.voucherData[i].deptId}
                          options={values.voucherData[i].deptOptions || []}
                          handleChangeAdvance={handleChangeAdvanceVoucher}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
                        <CustomTextField
                          name={`debit-${i}`}
                          value={values.voucherData[i].debit}
                          inputProps={{
                            style: { textAlign: "right" },
                          }}
                          handleChange={handleChangeVoucher}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
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
                    <TableCell colSpan={2} sx={{ textAlign: "center" }}>
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
      </FormPaperWrapper>
    </Box>
  );
}

export default JournalGrnForm;
