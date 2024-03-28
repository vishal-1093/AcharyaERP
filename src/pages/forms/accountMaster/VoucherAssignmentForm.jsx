import { useState, useEffect, lazy } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomRadioButtons = lazy(() =>
  import("../../../components/Inputs/CustomRadioButtons")
);
const CustomSelect = lazy(() =>
  import("../../../components/Inputs/CustomSelect")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const CustomMultipleAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomMultipleAutocomplete")
);

const initialValues = {
  voucherId: "",
  ledgerId: "",
  voucherType: "",
  budgetHead: "",
  cashBank: "",
  voucherPriority: "",
  school: "",
};

const requiredFields = ["voucherPriority"];

function VoucherAssignmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [voucherOptions, setVoucherOptions] = useState([]);
  const [legderOptions, setLegderOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [voucherHeadId, setVoucherHeadId] = useState(null);
  const [ob, setOb] = useState();

  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    voucherPriority: [
      values.voucherPriority !== "",
      /^[0-9]*$/.test(values.voucherPriority),
    ],
  };
  const errorMessages = {
    voucherPriority: ["This field is required", "Please enter a number"],
  };

  useEffect(() => {
    getVoucherOptions();
    getLedgerOptions();
    if (pathname.toLowerCase() === "/accountmaster/voucherassignment/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster/Assignment" },
        { name: "Voucher Assignment" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getData();
      getSchoolOptions();
    }
  }, [pathname]);

  useEffect(() => {
    getVoucherBasedSchool();
  }, [values.voucherId]);

  const getData = async () => {
    await axios
      .get(`/api/finance/VoucherHead/${id}`)
      .then((res) => {
        const data = res.data.data;
        setValues({
          voucherId: data.voucher_head_new_id,
          ledgerId: data.ledger_id,
          voucherType: data.voucher_type,
          budgetHead: data.budget_head,
          cashBank: data.cash_or_bank,
          voucherPriority: data.voucher_priority,
          school: data.school_id,
          id: data.voucher_head_new_id,
          voucherHeadId: data.voucher_head_id,
        });
        setOb(data.opening_balance);
        setVoucherHeadId(data.voucher_head_id);
        setCrumbs([
          { name: "AccountMaster", link: "/AccountMaster/Assignment" },
          { name: "Voucher Assignment" },
          { name: "Update" },
          { name: data.voucher_type },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const getVoucherOptions = async () => {
    await axios
      .get(`/api/finance/VoucherHeadNew`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.voucher_head_new_id,
            label: obj.voucher_head,
          });
        });
        setVoucherOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getLedgerOptions = async () => {
    await axios
      .get(`/api/finance/Ledger`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.ledger_id,
            label: obj.ledger_name,
          });
        });
        setLegderOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.school_id,
            label: obj.school_name_short,
          });
        });
        setSchoolOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getVoucherBasedSchool = async () => {
    if (values.voucherId && isNew) {
      await axios
        .get(`/api/finance/allUnassignedSchoolDetails/${values.voucherId}`)
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.school_id,
              label: obj.school_name_short,
            });
          });
          setSchoolOptions(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
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
      const temp = {};
      temp.active = true;
      temp.voucher_head_new_id = values.voucherId;
      temp.ledger_id = values.ledgerId;
      temp.voucher_type = values.voucherType;
      temp.budget_head = values.budgetHead;
      temp.cash_or_bank = values.cashBank;
      temp.salaries = values.salaries;
      temp.voucher_priority = values.voucherPriority;
      temp.school_id = values.school;

      setLoading(true);
      await axios
        .post(`/api/finance/VoucherHead`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster/Assignment", { replace: true });
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
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message
              ? error.response.data.message
              : "Error",
          });
          setAlertOpen(true);
        });
    }
  };
  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.voucher_head_new_id = values.voucherId;
      temp.ledger_id = values.ledgerId;
      temp.voucher_type = values.voucherType;
      temp.budget_head = values.budgetHead;
      temp.cash_or_bank = values.cashBank;
      temp.salaries = values.salaries;
      temp.voucher_priority = values.voucherPriority;
      temp.school_id = values.school;
      temp.voucher_head_id = voucherHeadId;
      temp.opening_balance = ob;

      await axios
        .put(`/api/finance/VoucherHead/${voucherHeadId}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster/Assignment", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.res ? error.res.data.message : "Error",
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
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              label="Voucher Head"
              name="voucherId"
              value={values.voucherId}
              options={voucherOptions}
              disabled={!isNew}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              label="Ledger"
              name="ledgerId"
              value={values.ledgerId}
              options={legderOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomSelect
              label="Voucher Type"
              name="voucherType"
              value={values.voucherType}
              items={[
                { value: "inflow", label: "Inflow" },
                { value: "outflow", label: "OutFlow" },
                { value: "journal", label: "Journal" },
                { value: "all", label: "All" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="voucherPriority"
              label="Priority"
              value={values.voucherPriority}
              handleChange={handleChange}
              errors={errorMessages.voucherPriority}
              checks={checks.voucherPriority}
              required
            />
          </Grid>
          {isNew ? (
            <Grid item xs={12} md={4}>
              <CustomMultipleAutocomplete
                name="school"
                label="School"
                value={values.school}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="school"
                label="School"
                value={values.school}
                items={schoolOptions}
                disabled
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              textAlign="right"
            >
              <Grid item xs={6} sm={4} md={2}>
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
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default VoucherAssignmentForm;
