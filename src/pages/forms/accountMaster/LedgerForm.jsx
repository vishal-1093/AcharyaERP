import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomSelect = lazy(() =>
  import("../../../components/Inputs/CustomSelect")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initialValues = {
  ledgerName: "",
  ledgerShortName: "",
  tallyId:"",
  groupId: "",
  priority: "",
  balanceSheetCode: "",
  remarks: "",
  reportType: "",
};

const requiredFields = [
  "tallyId",
  "ledgerName",
  "ledgerShortName",
  "groupId",
  "reportType",
];

function LedgerForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [ledgerId, setLedgerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState([]);
  const [tallyHeadList, setTallyHeadList] = useState([]);

  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    tallyId: [values.tallyId !== ""],
    ledgerName: [values.ledgerName !== ""],
    ledgerShortName: [
      values.ledgerShortName !== "",
      /^[A-Za-z ]{3}$/.test(values.ledgerShortName),
    ],
    remarks: [values.remarks.length < 150],
    reportType: [values.reportType !== ""],
  };
  const errorMessages = {
    tallyId : ["This field required"],
    ledgerName: ["This field required"],
    ledgerShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
    remarks: ["Maximum characters 150"],
    reportType: ["This field required"],
  };

  useEffect(() => {
    getTallyHead();
    getGroup();
    if (pathname.toLowerCase() === "/accountmaster/ledger/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Account Master", link: "/AccountMaster/Ledger" },
        { name: "Ledger" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getLedgerData();
    }
  }, []);

  const getTallyHead = async() => {
    try {
      const res = await axios.get('/api/finance/TallyHead');
      const data = [];
      res.data.data.forEach((obj) => {
        data.push({
          value: obj.tally_id,
          label: obj.tally_fee_head,
        });
      });
      setTallyHeadList(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getGroup = async () => {
    await axios
      .get(`/api/group`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.group_id,
            label: obj.group_name,
          });
        });
        setGroup(data);
      })
      .catch((error) => console.error(error));
  };

  const getLedgerData = async () => {
    await axios
      .get(`/api/finance/Ledger/${id}`)
      .then((res) => {
        setValues({
          ledgerName: res.data.data.ledger_name || "",
          ledgerShortName: res.data.data.ledger_short_name || "",
          groupId: res.data.data.group_id || "",
          priority: res.data.data.priority || "",
          balanceSheetCode: res.data.data.balance_sheet_row_code || "",
          remarks: res.data.data.remarks || "",
          reportType: res.data.data.financial_report_status || "",
          tallyId: res.data.data.tally_id || ""
        });
        setLedgerId(res.data.data.ledger_id);
        setCrumbs([
          { name: "Account Master", link: "AccountMaster/Ledger" },
          { name: "Ledger" },
          { name: "Update" },
          { name: res.data.data.ledger_name },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    if (e.target.name === "ledgerShortName") {
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
    setLoading(true);
    const temp = {};
    temp.active = true;
    temp.ledger_name = values.ledgerName;
    temp.ledger_short_name = values.ledgerShortName;
    temp.name_in_english = values.nameInEnglish;
    temp.name_in_russia = values.nameInRussian;
    temp.group_id = values.groupId;
    temp.priority = values.priority;
    temp.balance_sheet_row_code = values.balanceSheetCode;
    temp.remarks = values.remarks;
    temp.financial_report_status = values.reportType;
    temp.tally_id  = values.tallyId;

    await axios
      .post(`/api/finance/Ledger`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          navigate("/AccountMaster/Ledger", { replace: true });
          setAlertMessage({
            severity: "success",
            message: "Ledger created successfully",
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
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };

  const handleUpdate = async (e) => {
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
      temp.ledger_id = ledgerId;
      temp.ledger_name = values.ledgerName;
      temp.ledger_short_name = values.ledgerShortName;
      temp.name_in_english = values.nameInEnglish;
      temp.name_in_russia = values.nameInRussian;
      temp.group_short_name = values.groupShortName;
      temp.name_in_english = values.nameInEnglish;
      temp.group_id = values.groupId;
      temp.priority = values.priority;
      temp.balance_sheet_row_code = values.balanceSheetCode;
      temp.remarks = values.remarks;
      temp.financial_report_status = values.reportType;
      temp.tally_id  = values.tallyId;

      await axios
        .put(`/api/finance/Ledger/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster/Ledger", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Ledger updated successfully",
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
    <Box m={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="ledgerName"
              label="Ledger Name"
              value={values.ledgerName}
              handleChange={handleChange}
              checks={checks.ledgerName}
              errors={errorMessages.ledgerName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="ledgerShortName"
              label="Short Name"
              value={values.ledgerShortName}
              inputProps={{
                minLength: 3,
                maxLength: 3,
              }}
              handleChange={handleChange}
              checks={checks.ledgerShortName}
              errors={errorMessages.ledgerShortName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="groupId"
              label="Group"
              value={values.groupId}
              options={group}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="balanceSheetCode"
              label="Balance Sheet Row Code"
              value={values.balanceSheetCode}
              handleChange={handleChange}
              type="number"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              name="reportType"
              label="Report Type"
              value={values.reportType}
              items={[
                { value: "P & L", label: "P & L" },
                { value: "Balance Sheet", label: "Balance Sheet" },
              ]}
              handleChange={handleChange}
              checks={checks.reportType}
              errors={errorMessages.reportType}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              name="tallyId"
              label="Tally Head"
              value={values.tallyId}
              items={tallyHeadList}
              handleChange={handleChange}
              checks={checks.tallyId}
              errors={errorMessages.tallyId}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              label="Remarks"
              name="remarks"
              handleChange={handleChange}
              value={values.remarks}
              errors={errorMessages.remarks}
              checks={checks.remarks}
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !requiredFieldsValid()}
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
export default LedgerForm;
