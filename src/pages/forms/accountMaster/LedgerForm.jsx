import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  ledgerName: "",
  ledgerShortName: "",
  groupId: "",
  priority: "",
  remarks: "",
};

const requiredFields = ["ledgerName", "ledgerShortName", "groupId"];

function LedgerForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [ledgerId, setLedgerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState([]);

  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    ledgerName: [
      values.ledgerName !== "",
      /^[A-Za-z ]+$/.test(values.ledgerName),
    ],
    ledgerShortName: [
      values.ledgerShortName !== "",
      /^[A-Za-z ]{3}$/.test(values.ledgerShortName),
    ],
  };
  const errorMessages = {
    ledgerName: ["This field required", "Enter Only Characters"],
    ledgerShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
  };

  useEffect(() => {
    getGroup();
    if (pathname.toLowerCase() === "/accountmaster/ledger/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster" },
        { name: "Ledger" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getLedgerData();
    }
  }, []);

  const getGroup = async () => {
    await axios
      .get(`${ApiUrl}/group`)
      .then((res) => {
        setGroup(
          res.data.data.map((obj) => ({
            value: obj.group_id,
            label: obj.group_name,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getLedgerData = async () => {
    await axios
      .get(`${ApiUrl}/finance/Ledger/${id}`)
      .then((res) => {
        setValues({
          ledgerName: res.data.data.ledger_name,
          ledgerShortName: res.data.data.ledger_short_name,
          groupId: res.data.data.group_id,
          priority: res.data.data.priority,
          remarks: res.data.data.remarks,
        });
        setLedgerId(res.data.data.ledger_id);
        setCrumbs([
          { name: "AccountMaster", link: "AccountMaster" },
          { name: "Ledger" },
          { name: "Update" },
          { name: res.data.data.ledger_name },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
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
      temp.ledger_name = values.ledgerName;
      temp.ledger_short_name = values.ledgerShortName;
      temp.group_id = values.groupId;
      temp.priority = values.priority;
      temp.remarks = values.remarks;
      await axios
        .post(`${ApiUrl}/finance/Ledger`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Ledger Created",
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
    }
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
      temp.group_id = values.groupId;
      temp.priority = values.priority;
      temp.remarks = values.remarks;
      await axios
        .put(`${ApiUrl}/finance/Ledger/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Ledger updated",
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
          justifyContent="flex-end"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="groupId"
              label="Group"
              value={values.groupId}
              options={group}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              type="number"
              label="Priority"
              name="priority"
              value={values.priority}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={4}
              label="Remarks"
              name="remarks"
              handleChange={handleChange}
              value={values.remarks}
            />
          </Grid>

          <Grid item textAlign="right">
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
export default LedgerForm;
