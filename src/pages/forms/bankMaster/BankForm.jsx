import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomRadioButtons = lazy(() =>
  import("../../../components/Inputs/CustomRadioButtons")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initialValues = {
  bankName: null,
  bankShortName: "",
  internalStatus: false,
  school: null,
  accName: "",
  accNumber: "",
  bankBranchName: "",
  ifscCode: "",
  bankGroup: null,
  swiftCode: "",
};

const requiredFields = [
  "bankName",
  "bankShortName",
  "school",
  "accName",
  "accNumber",
];

function BankForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [bankId, setBankId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schoolOption, setSchoolOption] = useState([]);
  const [bankGroupOptions, setBankGroupOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    bankName: [values.bankName !== ""],
    bankShortName: [values.bankShortName !== ""],
    accName: [values.accName !== ""],
    accNumber: [values.accNumber !== ""],
  };
  const errorMessages = {
    bankName: ["This field is required"],
    bankShortName: ["This field required", ""],
    accName: ["This field required", ""],
    accNumber: ["This field required", "Enter only number"],
  };

  useEffect(() => {
    schoolData();
    getBankData();
    getBankGroupData();
    if (pathname.toLowerCase() === "/bankmaster/bank/new") {
      setIsNew(true);
      setCrumbs([
        { name: "BankMaster", link: "/BankIndex" },
        { name: "Bank" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramData();
    }
  }, []);

  const schoolData = async () => {
    await axios
      .get(`api/institute/school`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            label: obj.school_name,
            value: obj.school_id,
          });
        });

        setSchoolOption(data);
      })
      .catch((error) => console.error(error));
  };

  const getBankData = async () => {
    await axios
      .get(`/api/finance/fetchVoucherHeadNewDetailsBasedOnCashOrBank`)
      .then((res) => {
        const voucherData = [];
        res.data.data.forEach((obj) => {
          voucherData.push({
            label: obj.voucher_head,
            value: obj.voucher_head_new_id,
          });
        });
        setBankOptions(voucherData);
      })
      .catch((err) => console.error(err));
  };

  const getBankGroupData = async () => {
    await axios
      .get(`/api/finance/getAllActiveCreateBankGroup`)
      .then((res) => {
        const bankGroupData = [];
        res.data.data.forEach((obj) => {
          bankGroupData.push({
            label: obj.bank_group_name,
            value: obj.bank_group_id,
          });
        });
        setBankGroupOptions(bankGroupData);
      })
      .catch((err) => console.error(err));
  };

  const getProgramData = async () => {
    await axios
      .get(`/api/finance/Bank/${id}`)
      .then((res) => {
        setValues({
          bankName: res.data.data.voucher_head_new_id,
          bankShortName: res.data.data.bank_short_name,
          bankBranchName: res.data.data.bank_branch_name,
          internalStatus: res.data.data.internal_status,
          ifscCode: res.data.data.ifsc_code,
          school: res.data.data.school_id,
          accName: res.data.data.account_name,
          accNumber: res.data.data.account_number,
          bankGroup: res.data.data.bank_group_id,
          swiftCode: res.data.data.swift_code,
        });

        setBankId(res.data.data.bank_id);
        setCrumbs([
          { name: "BankMaster", link: "/BankIndex" },
          { name: "Bank" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "bankShortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
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
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.bank_short_name = values.bankShortName;
      temp.internal_status = values.internalStatus;
      temp.ifsc_code = values.ifscCode;
      temp.school_id = values.school;
      temp.account_name = values.accName;
      temp.account_number = values.accNumber;
      temp.bank_group_id = values.bankGroup;
      temp.bank_branch_name = values.bankBranchName;
      temp.voucher_head_new_id = values.bankName;
      temp.swift_code = values.swiftCode;

      await axios
        .post(`/api/finance/Bank`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Bank Created",
            });
            navigate("/BankIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
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

  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.voucher_head_new_id = values.bankName;
      temp.bank_id = bankId;
      temp.bank_short_name = values.bankShortName;
      temp.internal_status = values.internalStatus;
      temp.ifsc_code = values.ifscCode;
      temp.school_id = values.school;
      temp.account_name = values.accName;
      temp.account_number = values.accNumber;
      temp.bank_branch_name = values.bankBranchName;
      temp.bank_group_id = values.bankGroup;
      temp.swift_code = values.swiftCode;

      await axios
        .put(`/api/finance/Bank/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Bank Updated",
            });
            navigate("/BankIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="bankGroup"
              label="Group Name"
              value={values.bankGroup}
              options={bankGroupOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="bankName"
              label="Bank"
              value={values.bankName}
              options={bankOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="bankShortName"
              label="Short Name"
              value={values.bankShortName}
              handleChange={handleChange}
              errors={errorMessages.bankShortName}
              checks={checks.bankShortName}
              inputProps={{
                minLength: 1,
                maxLength: 5,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="bankBranchName"
              label="Branch Name"
              value={values.bankBranchName}
              handleChange={handleChange}
              errors={errorMessages.bankBranchName}
              checks={checks.bankBranchName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="accName"
              label="Account Name"
              value={values.accName}
              handleChange={handleChange}
              errors={errorMessages.accName}
              checks={checks.accName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="accNumber"
              label="Account Number"
              value={values.accNumber}
              handleChange={handleChange}
              errors={errorMessages.accNumber}
              checks={checks.accNumber}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="ifscCode"
              label="IFSC Code"
              value={values.ifscCode}
              handleChange={handleChange}
              errors={errorMessages.ifscCode}
              checks={checks.ifscCode}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="swiftCode"
              label="Swift Code"
              value={values.swiftCode}
              handleChange={handleChange}
              errors={errorMessages.swiftCode}
              checks={checks.swiftCode}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="school"
              label="School"
              value={values.school}
              options={schoolOption}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="internalStatus"
              label="Internal Status"
              value={values.internalStatus}
              handleChange={handleChange}
              items={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} align="right">
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
      </FormWrapper>
    </Box>
  );
}

export default BankForm;
