import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Delete";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import { makeStyles } from "@mui/styles";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 800,
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
    "& th": {
      color: theme.palette.common.white,
      fontWeight: "bold",
      textAlign: "center",
    },
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tableCell: {
    fontSize: "1rem",
    textAlign: "center",
  },
  actionsCell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addRowButton: {
    margin: theme.spacing(2, 0),
    display: "flex",
    justifyContent: "center",
  },
}));

const initialValues = {
  acYearId: "",
  occupancyType: "",
  currencyType: "",
  blockName: "",
  schoolId: "",
  active: true,
};

const requiredFields = [
  "acYearId",
  "occupancyType",
  "currencyType",
  "blockName",
  "schoolId",
];

function HostelFeeTemplateForm() {
  const classes = useStyles();
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [currencyTypeOptions, setCurrencyTypeOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [rows, setRows] = useState([
    { feeHead: "", amount: 0, minAmount: 0, total: 0 },
  ]);
  const [rowErrors, setRowErrors] = useState([{ amount: "", minAmount: "" }]);
  const checks = {
    acYearId: [values.acYearId !== ""],
    occupancyType: [values.occupancyType !== ""],
    currencyType: [values.currencyType !== ""],
    blockName: [values.blockName != ""],
    schoolId: [values.schoolId != ""],
  };

  const errorMessages = {
    acYearId: ["This field is required"],
    occupancyType: ["This field is required"],
    currencyType: ["This field is required"],
    blockName: ["This field is required"],
    schoolId: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/hostelfeetemplatemaster/feetemplate/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "Hostel Fee Template",
          link: "/HostelFeeTemplateMaster/FeeTemplate",
        },
        { name: "Fee Template" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getHostelFeeTemplateDats(id);
    }
    getAcademicyear();
    getHostelBlocks();
    getSchoolName();
    getFeeHeads();
    getCurrencyTypeData();
  }, [id]);

  const getSchoolName = async () => {
    await axios
      .get("/api/institute/school")
      .then((res) => {
        setSchoolOptions(
          res?.data?.data?.map((object) => ({
            value: object.school_id,
            label: object.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getAcademicyear = async () => {
    await axios
      .get("/api/academic/academic_year")
      .then((res) => {
        setAcademicYearOptions(
          res?.data?.data?.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getHostelBlocks = async () => {
    await axios
      .get("/api/hostel/HostelBlocks")
      .then((res) => {
        const hostelBlocks = res?.data?.data?.map((obj) => ({
          value: obj.hostelBlockId,
          label: obj.blockName,
        }));
        setHostelBlocks(hostelBlocks);
      })
      .catch((err) => console.error(err));
  };

  const getCurrencyTypeData = async () => {
    await axios
      .get(`/api/finance/CurrencyType`)
      .then((res) => {
        console.log(res, "res");
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.currency_type_id,
            label: obj.currency_type_name,
          });
        });
        setCurrencyTypeOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getHostelFeeTemplateDats = async (id) => {
    await axios
      .get(`/api/finance/HostelFeeTemplate/${id}`)
      .then((res) => {
        console.log(res, "res");
        if (res?.data?.data?.length > 0) {
          const data = res?.data?.data[0];
          console.log(data, "data");
          setValues({
            acYearId: data.ac_year_id,
            occupancyType: data.hostel_room_type_id,
            currencyType: data.currency_type_id,
            blockName: data.hostels_block_id.split(",").map(Number),
            schoolId: data.school_ids.split(",").map(Number),
            active: data.active,
          });
          const feeRows = res.data.data?.map((item) => ({
            feeHead: item.fee_head_id,
            amount: item.total_amount,
            minAmount: item.minimum_amount,
            total: item.total_amount + item.minimum_amount,
            hostel_fee_template_id: item?.hostel_fee_template_id,
            template_name: item?.template_name,
          }));
          setRows(feeRows);
          setCrumbs([
            {
              name: "Hostel Fee Template",
              link: "/HostelFeeTemplateMaster/FeeTemplate",
            },
            { name: "Fee Template" },
            { name: "Update" },
            // { name: res.data.data.block_name },
          ]);
        }
      })
      .catch((err) => console.error(err));
  };

  const getFeeHeads = async () => {
    await axios
      .get("/api/finance/voucherHeadDetailsOnHostelStatus")
      .then((res) => {
        const feeHeads = res?.data?.data?.map((obj) => ({
          value: obj.voucher_head_new_id,
          label: obj.voucher_head,
        }));
        setFeeHeads(feeHeads);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      const rowErrors = rows?.map((row) => ({
        feeHead: row.feeHead ? "" : "FeeHead is required",
        amount: row.amount ? "" : "Amount is required",
        minAmount: row.minAmount ? "" : "Minimum Amount is required",
      }));

      setRowErrors(rowErrors);

      const hasErrors = rowErrors.some(
        (error) => error.amount || error.minAmount || error.feeHead
      );

      if (hasErrors) {
        setAlertMessage({
          severity: "error",
          message: "Please fill all required fields",
        });
        setAlertOpen(true);
        return;
      }

      setLoading(true);
      
 // Calculate the total amount from all rows
const totalAmount = rows.reduce((acc, row) => acc + parseFloat(row.amount), 0);

const temp = {
  hft: rows?.map((row) => ({
    ac_year_id: values.acYearId,
    hostel_room_type_id: values.occupancyType,
    currency_type_id: values.currencyType,
    hostels_block_id: values.blockName.join(","),
    school_ids: values.schoolId.join(","),
    active: true,
    offer_status: false,
    fee_head_id: row.feeHead,
    total_amount: totalAmount,
    minimum_amount: parseFloat(row.minAmount),
  })),
};


      try {
        await axios.post(`/api/finance/HostelFeeTemplate`, temp);
        setLoading(false);
        navigate("/HostelFeeTemplateMaster", { replace: true });
        setAlertMessage({
          severity: "success",
          message: "Form Submitted Successfully",
        });
        setAlertOpen(true);
      } catch (error) {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      }
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      const rowErrors = rows?.map((row) => ({
        feeHead: row.feeHead ? "" : "FeeHead is required",
        amount: row.amount ? "" : "Amount is required",
        minAmount: row.minAmount ? "" : "Minimum Amount is required",
      }));

      setRowErrors(rowErrors);

      const hasErrors = rowErrors.some(
        (error) => error.amount || error.minAmount || error.feeHead
      );

      if (hasErrors) {
        setAlertMessage({
          severity: "error",
          message: "Please fill all required fields",
        });
        setAlertOpen(true);
        return;
      }

      const temp = rows?.map((row) => ({
        ...(row?.hostel_fee_template_id && { hostel_fee_template_id: row.hostel_fee_template_id }),
        ac_year_id: values.acYearId,
        hostel_room_type_id: values.occupancyType,
        currency_type_id: values.currencyType,
        hostels_block_id: values.blockName.join(","),
        school_ids: values.schoolId.join(","),
        active: values.active,
        fee_head_id: row.feeHead,
        total_amount: parseFloat(row.amount),
        minimum_amount: parseFloat(row.minAmount),
        template_name: rows[0]?.template_name,
      }));
      const hostelFeeTemplateIds = rows?.map((item) => item?.hostel_fee_template_id).join(",");

      try {
        await axios.put(
          `/api/finance/HostelFeeTemplate/${hostelFeeTemplateIds}`,
          temp
        );
        setLoading(false);
        navigate("/HostelFeeTemplateMaster", { replace: true });
        setAlertMessage({
          severity: "success",
          message: "Form Updated Successfully",
        });
        setAlertOpen(true);
      } catch (error) {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNew) {
      handleCreate();
    } else {
      handleUpdate();
    }
  };

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [name]: name === "feeHead" ? value : parseFloat(value) || 0,
    };
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { feeHead: "", amount: 0, minAmount: 0, total: 0 }]);
    setRowErrors([...rowErrors, { feeHead: "", amount: "", minAmount: "" }]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = [...rows];
    const updatedRowErrors = [...rowErrors];
    updatedRows.splice(index, 1);
    updatedRowErrors.splice(index, 1);
    setRows(updatedRows);
    setRowErrors(updatedRowErrors);
  };
  const handleSelectAll = (name, options) => {
    setValues((prev) => ({
      ...prev,
      [name]: options.map((obj) => obj.value),
    }));
  };

  const handleSelectNone = (name) => {
    setValues((prev) => ({ ...prev, [name]: [] }));
  };

  return (
    <Box component="form" onSubmit={(e) => handleSubmit(e)} noValidate>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
              checks={checks.acYearId}
              errors={errorMessages.acYearId}
              disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="occupancyType"
              label="Occupancy Type"
              value={values.occupancyType}
              items={[
                { value: 1, label: "SINGLE OCCUPANCY" },
                { value: 2, label: "DOUBLE OCCUPANCY" },
                { value: 3, label: "TRIPLE OCCUPANCY" },
                { value: 4, label: "QUADRUPLE OCCUPANCY" },
                { value: 6, label: "SIXTAPLE OCCUPANCY" },
                { value: 7, label: "SEVEN OCCUPANCY" },
                { value: 8, label: "EIGHT OCCUPANCY" },
              ]}
              handleChange={handleChange}
              checks={checks.occupancyType}
              errors={errorMessages.occupancyType}
              required
              disabled={!isNew}
            />
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="currencyType"
              label="Currency Type"
              value={values.currencyType}
              options={currencyTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid> */}
          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="currencyType"
              label="Currency Type"
              value={values.currencyType}
              items={currencyTypeOptions}
              handleChange={handleChange}
              required
              disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CheckboxAutocomplete
              name="blockName"
              label="Block Name"
              value={values.blockName}
              options={hostelBlocks}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
              checks={checks.blockName}
              errors={errorMessages.blockName}
              required
              // disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CheckboxAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
              checks={checks.schoolId}
              errors={errorMessages.schoolId}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table className={classes.table}>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell>Fee Head</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Minimum Amount</TableCell>
                    {/* <TableCell>Total</TableCell> */}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row, index) => (
                    <TableRow key={index} className={classes.tableRow}>
                      <TableCell className={classes.tableCell}>
                        <CustomAutocomplete
                          name="feeHead"
                          label="Fee Head"
                          value={row.feeHead}
                          options={feeHeads}
                          handleChangeAdvance={(name, value) =>
                            handleRowChange(index, { target: { name, value } })
                          }
                          checks={checks?.feeHead}
                          errors={rowErrors[index]?.feeHead}
                        />
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <CustomTextField
                          name="amount"
                          label="Amount"
                          value={row.amount}
                          handleChange={(e) => handleRowChange(index, e)}
                          checks={checks.amount}
                          errors={rowErrors[index]?.amount}
                        />
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <CustomTextField
                          name="minAmount"
                          label="Minimum Amount"
                          value={row.minAmount}
                          handleChange={(e) => handleRowChange(index, e)}
                          checks={checks.minAmount}
                          errors={rowErrors[index]?.minAmount}
                        />
                      </TableCell>
                      {/* <TableCell className={classes.tableCell}>
                        {parseFloat(row.amount) + parseFloat(row.minAmount)}
                      </TableCell> */}
                      <TableCell
                        className={classes.actionsCell}
                        style={{ textAlign: "center" }}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => handleAddRow()}
                        >
                          <AddIcon />
                        </IconButton>
                        {rows.length > 1 && (
                          <IconButton
                            color="secondary"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <div className={classes.addRowButton}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddRow}
              >
                Add Row
              </Button>
            </div> */}
          </Grid>
        </Grid>
      </FormWrapper>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isNew ? (
            "Submit"
          ) : (
            "Update"
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default HostelFeeTemplateForm;
