import { useState, useEffect } from "react";
import { useTheme } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "../../../services/Api";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  tableCellClasses,
  styled,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";

const initValues = {
  academicYearId: null,
  roomTypeId: null,
  blockId: [],
  schoolId: [],
  currency: "",
  advance: 0,
};
const requiredFields = [
  "academicYearId",
  "roomTypeId",
  "blockId",
  "schoolId",
  "currency",
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const voucherTableValues = { voucherId: null, amount: 0 };
const paymentTableValues = { minAmount: 0, dueDate: null };

function HostelFeeForm() {
  const [voucherData, setVoucherData] = useState([voucherTableValues]);
  const [paymentData, setPaymentData] = useState([paymentTableValues]);
  const [lastRow, setLastRow] = useState({
    totalAmount: 0,
  });
  const [lastRowData, setLastRowData] = useState({
    totalAmt: 0,
  });
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [blockId, setBlockId] = useState(null);
  const [schoolShortName, setSchoolName] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [roomsType, setRoomType] = useState([]);
  const [CurrencyType, setCurrencyType] = useState([]);
  const [heads, setHeads] = useState([]);
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    blockId: [values.blockId.length > 0],
    schoolId: [values.schoolId.length > 0],
    currency: [values.currency !== ""],
    advance: [values.advance <= lastRow.totalAmount, values.advance !== 0],
  };

  const errorMessages = {
    blockId: ["This field required"],
    schoolId: ["This field required"],
    advance: ["Advance should be less than Total"],
    dueDate: ["This field required", "This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/hostelfeemaster/hostelfee/new") {
      setIsNew(true);
      setCrumbs([
        { name: "HostelFeeMaster", link: "/HostelFeeMaster/HostelFees" },
        { name: "Hostel Fee" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
    }
  }, [pathname]);

  useEffect(() => {
    getTotalAmont();
    getTotalPayment();
  }, [voucherData, paymentData]);

  const handleChangeAdvanceVoucher = (name, newValue) => {
    const index = Number(name.slice(-1));
    const keyName = name.substr(0, name.length - 1);
    setVoucherData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [keyName]: newValue };
        return obj;
      })
    );
  };
  const handleChangeAdvancePayment = (name, newValue) => {
    const index = Number(name.slice(-1));
    const keyName = name.substr(0, name.length - 1);
    setPaymentData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [keyName]: newValue };
        return obj;
      })
    );
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleChangeVoucher = (e, index) => {
    setVoucherData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVoucherTotal = (e, index) => {
    setVoucherData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleChangePaymemt = (e, index) => {
    setPaymentData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const addVoucherData = () => {
    setVoucherData((prev) => [...prev, voucherTableValues]);
  };

  const removeVoucherData = () => {
    const filterVoucherData = [...voucherData];
    filterVoucherData.pop();
    setVoucherData(filterVoucherData);
  };
  const addPaymentData = () => {
    setPaymentData((prev) => [...prev, paymentTableValues]);
  };
  const removePaymentData = () => {
    const filterPaymentData = [...paymentData];
    filterPaymentData.pop();
    setPaymentData(filterPaymentData);
  };

  const getTotalAmont = () => {
    setLastRow((prev) => {
      return {
        ...prev,
        totalAmount: voucherData.reduce((total, obj) => {
          return total + Number(obj.amount);
        }, 0),
      };
    });
  };
  const getTotalPayment = (e) => {
    setLastRowData((prev) => ({
      ...prev,
      totalAmt: paymentData.reduce((total, obj) => {
        return total + Number(obj.minAmount);
      }, 0),
    }));
  };

  useEffect(() => {
    getSchoolName();
    getAcademicYear();
    getRoomType();
    getHostelBlocks();
    getCurrencyType();
    getVoucherHeads();
  }, []);
  const getSchoolName = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolName(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getAcademicYear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYear(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getRoomType = async () => {
    await axios
      .get(`/api/hostel/HostelRoomType`)
      .then((res) => {
        setRoomType(
          res.data.data.map((object) => ({
            value: object.roomTypeId,
            label: object.roomType,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getHostelBlocks = async () => {
    await axios
      .get(`/api/hostel/HostelBlocks`)
      .then((res) => {
        setHostelBlocks(
          res.data.data.map((object) => ({
            value: object.hostelBlockId,
            label: object.blockName,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getCurrencyType = async () => {
    await axios
      .get(`/api/finance/CurrencyType`)
      .then((res) => {
        setCurrencyType(
          res.data.data.map((obj) => ({
            value: obj.currency_type_id,
            label: obj.currency_type_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getVoucherHeads = async () => {
    await axios
      .get(`/api/finance/voucherHeadNewOnHostelStatus`)
      .then((res) => {
        setHeads(
          res.data.data.map((obj) => ({
            value: obj.voucher_head_new_id,
            label: obj.voucher_head_short_name,
          }))
        );
      })
      .catch((err) => console.error(err));
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const hft = {};
      const hfts = [];
      const hhwa = [];
      const arr = [];
      const arr1 = [];
      const temp = {};
      hft.active = true;
      hft.ac_year_id = values.academicYearId;
      hft.hostel_room_type_id = values.roomTypeId;
      hft.hostels_block_id = values.blockId.toString();
      hft.school_ids = values.schoolId.toString();
      hft.currency_type_id = values.currency;
      hft.advance_amount = values.advance;
      hft.total_amount = lastRow.totalAmount;
      temp.hft = hft;

      voucherData.map((obj, i) => {
        arr.push({
          active: true,
          voucher_head_new_id: obj.voucherId,
          amount: obj.amount,
        });
      });
      paymentData.map((obj, i) => {
        arr1.push({
          active: true,
          due_date: obj.dueDate,
          minimum_amount: obj.minAmount,
        });
      });

      temp.hfts = arr1;
      temp.hhwa = arr;

      await axios
        .post(`/api/finance/HostelFeeTemplate`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HostelFeeMaster/HostelFees", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.hostelBlockId = blockId;
      temp.blockName = values.blockName;
      temp.blockShortName = values.shortName;
      temp.address = values.address;
      temp.remarks = values.remarks;
      temp.totalFloors = values.totalNoOfFloors;
      temp.hostelType = values.type;

      await axios
        .put(`/api/finance/HostelFeeTemplate/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/HostelFeeMaster/HostelFees", { replace: true });
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: res.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          justifyContents="flex-start"
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          {" "}
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="academicYearId"
              options={academicYear}
              handleChangeAdvance={handleChangeAdvance}
              label="Academic Year"
              value={values.academicYearId}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="roomTypeId"
              label="Occupancy Type"
              value={values.roomTypeId}
              options={roomsType}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomMultipleAutocomplete
              name="blockId"
              label="Block Name"
              value={values.blockId}
              options={hostelBlocks}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.blockId}
              errors={errorMessages.blockId}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomMultipleAutocomplete
              name="schoolId"
              options={schoolShortName}
              handleChangeAdvance={handleChangeAdvance}
              label="School Name"
              value={values.schoolId}
              checks={checks.schoolId}
              errors={errorMessages.schoolId}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="currency"
              options={CurrencyType}
              handleChangeAdvance={handleChangeAdvance}
              label="Currency Type"
              value={values.currency}
              checks={checks.currency}
              errors={errorMessages.currency}
              required
            />
          </Grid>
        </Grid>

        <Grid
          item
          xs={6}
          md={6}
          align="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
          sx={{ p: 5 }}
        >
          <TableContainer component={Paper} sx={{ width: "55%" }}>
            <Table>
              <TableHead>
                <StyledTableCell align="center">Particulars</StyledTableCell>
                <StyledTableCell align="center">Amount</StyledTableCell>
              </TableHead>

              <TableBody>
                {voucherData.map((obj, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ width: "50%" }}>
                      <CustomAutocomplete
                        name={`voucherId${i}`}
                        label=""
                        value={obj.voucherId}
                        options={heads}
                        handleChangeAdvance={handleChangeAdvanceVoucher}
                        required
                      />
                    </TableCell>
                    <TableCell sx={{ width: "50%" }}>
                      <CustomTextField
                        name="amount"
                        label=""
                        value={obj.amount}
                        handleChange={(e) => handleChangeVoucher(e, i)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TableBody>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>
                  <CustomTextField
                    name="totalAmount"
                    label=""
                    value={lastRow.totalAmount}
                    handleChange={handleVoucherTotal}
                  />
                </TableCell>

                <TableCell>Advance</TableCell>

                <TableCell>
                  <CustomTextField
                    name="advance"
                    label=""
                    value={values.advance}
                    handleChange={handleChange}
                    checks={checks.advance}
                    errors={errorMessages.advance}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </TableContainer>

          <Button
            variant="contained"
            color="error"
            onClick={removeVoucherData}
            disabled={voucherData.length === 1}
            sx={{ m: 2 }}
          >
            <RemoveIcon />
          </Button>

          <Button variant="contained" color="success" onClick={addVoucherData}>
            <AddIcon />
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          align="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <TableContainer component={Paper} sx={{ width: "50%" }}>
            <Table>
              <TableHead>
                <StyledTableCell align="center">Payment Slots </StyledTableCell>
                <StyledTableCell align="center">Due Date </StyledTableCell>
              </TableHead>
              <TableBody>
                {paymentData.map((obj, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ width: "50%" }}>
                      <CustomTextField
                        name="minAmount"
                        label=""
                        value={obj.minAmount}
                        handleChange={(e) => handleChangePaymemt(e, i)}
                        checks={checks.minAmount}
                        errors={errorMessages.minAmount}
                        helperText=" "
                      />
                    </TableCell>
                    <TableCell sx={{ width: "50%" }}>
                      <CustomDatePicker
                        name={`dueDate${i}`}
                        label=""
                        value={obj.dueDate}
                        handleChangeAdvance={handleChangeAdvancePayment}
                        checks={checks.dueDate}
                        errors={errorMessages.dueDate}
                        disablePast
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableBody>
              <TableCell>Balance</TableCell>
              <TableCell>
                <CustomTextField
                  name="totalAmt"
                  label=""
                  value={lastRow.totalAmount - lastRowData.totalAmt}
                />
              </TableCell>
            </TableBody>
          </TableContainer>

          <Button
            variant="contained"
            color="error"
            onClick={removePaymentData}
            disabled={paymentData.length === 1}
            sx={{ m: 2 }}
          >
            <RemoveIcon />
          </Button>

          <Button variant="contained" color="success" onClick={addPaymentData}>
            <AddIcon />
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            textAlign="right"
            margin=" 30px 0px"
          >
            <Grid item xs={4} md={2}>
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={isNew ? handleCreate : handleUpdate}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  <strong>{isNew ? "Create" : "Update"}</strong>
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}
export default HostelFeeForm;
