import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation, useNavigate, useParams } from "react-router";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  bankName: null,
  school: null,
  branch: "",
  accountName: "",
  accountNumber: "",
  ifscCode: "",
  swiftCode: "",
  ob: "",
  internalStatus: "No",
};

const requiredFields = [
  "bankName",
  "school",
  "branch",
  "accountName",
  "accountNumber",
  "ifscCode",
];

function BankForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [bankOptions, setBankOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schoolOption, setSchoolOption] = useState([]);
  const [data, setData] = useState([]);

  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();

  const checks = {
    branch: [values.branch !== ""],
    accountName: [values.accountName !== ""],
    accountNumber: [values.accountNumber !== ""],
    ifscCode: [values.ifscCode !== ""],
  };

  const errorMessages = {
    branch: ["This field required"],
    accountName: ["This field required"],
    accountNumber: ["This field required"],
    ifscCode: ["This field required"],
  };

  useEffect(() => {
    getBankData();
    getSchoolData();
    setCrumbs([{ name: "Bank Index", link: "/BankIndex" }, { name: "Create" }]);

    if (pathname.toLowerCase() === "/bankform/new") {
      setIsNew(true);
    } else {
      setIsNew(false);
      getData();
    }
  }, []);

  const getBankData = async () => {
    await axios
      .get("/api/finance/fetchVoucherHeadNewDetailsBasedOnCashOrBank")
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            label: obj.voucher_head,
            value: obj.voucher_head_new_id,
          });
        });

        setBankOptions(data);
      })
      .catch((error) => console.error(error));
  };

  const getSchoolData = async () => {
    await axios
      .get("/api/institute/school")
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            label: obj.school_name_short,
            value: obj.school_id,
          });
        });

        setSchoolOption(data);
      })
      .catch((error) => console.error(error));
  };

  const getData = async () => {
    await axios
      .get(`/api/finance/BankAssignment/${id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          bankName: res.data.data.bank_id,
          branch: res.data.data.bank_branch_name,
          accountName: res.data.data.acc_name,
          accountNumber: res.data.data.acc_number,
          ifscCode: res.data.data.ifsc_code,
          swiftCode: res.data.data.swift_code,
          school: res.data.data.school_id,
          ob: res.data.data.opening_balance ?? "",
          internalStatus: res.data.data.internal_status === true ? "Yes" : "No",
        }));

        setData(res.data.data);

        setCrumbs([
          { name: "Bank Index", link: "/BankIndex" },
          { name: "Bank" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
    setLoading(true);

    const postData = {};
    postData.active = true;
    postData.bank_id = values.bankName;
    postData.bank_branch_name = values.branch;
    postData.acc_name = values.accountName;
    postData.acc_number = values.accountNumber;
    postData.ifsc_code = values.ifscCode;
    postData.swift_code = values.swiftCode;
    postData.school_id = values.school;
    postData.opening_balance = values.ob;
    postData.internal_status = values.internalStatus === "Yes" ? true : false;

    await axios
      .post("/api/finance/BankAssignment", postData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Bank Created",
          });
          setAlertOpen(true);
          navigate("/BankIndex", { replace: true });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
          setAlertOpen(true);
        }

        setLoading(false);
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message
            ? err.response.data.message
            : "Error",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const handleUpdate = async () => {
    setLoading(true);

    const putData = { ...data };
    putData.active = true;
    putData.bank_id = values.bankName;
    putData.bank_branch_name = values.branch;
    putData.acc_name = values.accountName;
    putData.acc_number = values.accountNumber;
    putData.ifsc_code = values.ifscCode;
    putData.swift_code = values.swiftCode;
    putData.school_id = values.school;
    putData.opening_balance = values.ob;
    putData.internal_status = values.internalStatus === "Yes" ? true : false;

    await axios
      .put(`/api/finance/BankAssignment/${id}`, putData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Updated successfully !!",
          });
          setAlertOpen(true);
          navigate("/BankIndex", { replace: true });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "An error occured",
          });
          setAlertOpen(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message
            ? err.response.data.message
            : "Error",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  return (
    <Box>
      <FormWrapper>
        <Grid container rowSpacing={3} columnSpacing={3}>
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
              name="branch"
              label="Branch"
              value={values.branch}
              handleChange={handleChange}
              errors={errorMessages.branch}
              checks={checks.branch}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="accountName"
              label="Account Name"
              value={values.accountName}
              handleChange={handleChange}
              errors={errorMessages.accountName}
              checks={checks.accountName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="accountNumber"
              label="Account No."
              value={values.accountNumber}
              handleChange={handleChange}
              errors={errorMessages.accountNumber}
              checks={checks.accountNumber}
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
            <CustomTextField
              name="ob"
              label="Opening Balance"
              value={values.ob}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="internalStatus"
              label="Internal Status"
              value={values.internalStatus}
              items={[
                {
                  value: "Yes",
                  label: "Yes",
                },
                {
                  value: "No",
                  label: "No",
                },
              ]}
              handleChange={handleChange}
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

export default BankForm;
