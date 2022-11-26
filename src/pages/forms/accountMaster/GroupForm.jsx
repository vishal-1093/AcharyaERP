import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import FormWrapper from "../../../components/FormWrapper";
import axios from "../../../services/Api";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  groupName: "",
  groupShortName: "",
  priority: "",
  remarks: "",
  financials: "",
  balanceSheet: "",
};
const requiredFields = [
  "groupName",
  "groupShortName",
  "remarks",
  "financials",
  "balanceSheet",
];

function GroupForm() {
  const [isNew, setIsNew] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [groupId, setGroupId] = useState(null);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();

  const checks = {
    groupName: [values.groupName !== "", /^[A-Za-z ]+$/.test(values.groupName)],
    groupShortName: [
      values.groupShortName !== "",
      /^[A-Za-z ]{3}$/.test(values.groupShortName),
    ],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    groupName: ["This field required", "Enter Only Characters"],
    groupShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
    remarks: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/accountmaster/group/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster" },
        { name: "Group" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getGroupData();
    }
  }, [pathname]);

  const getGroupData = async () => {
    await axios
      .get(`/api/group/${id}`)
      .then((res) => {
        setValues({
          groupName: res.data.data.group_name,
          groupShortName: res.data.data.group_short_name,
          priority: res.data.data.group_priority,
          remarks: res.data.data.remarks,
          financials: res.data.data.financials,
          balanceSheet: res.data.data.balance_sheet_group,
        });
        setGroupId(res.data.data.group_id);
        setCrumbs([
          { name: "AccountMaster", link: "/AccountMaster" },
          { name: "School" },
          { name: "Update" },
          { name: res.data.data.group_name },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    if (e.target.name === "groupShortName") {
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
      temp.group_name = values.groupName;
      temp.group_short_name = values.groupShortName;
      temp.group_priority = values.priority;
      temp.remarks = values.remarks;
      temp.financials = values.financials;
      temp.balance_sheet_group = values.balanceSheet;
      await axios
        .post(`/api/group`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Group Created",
            });
            navigate("/AccountMaster", { replace: true });
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
        message: "Please fill all fields",
      });

      setAlertOpen(true);
    } else {
      const temp = {};
      temp.group_id = groupId;
      temp.active = true;
      temp.group_name = values.groupName;
      temp.group_short_name = values.groupShortName;
      temp.group_priority = values.priority;
      temp.remarks = values.remarks;
      temp.financials = values.financials;
      temp.balance_sheet_group = values.balanceSheet;
      await axios
        .put(`/api/group/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Group updated",
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

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="groupName"
              label="Group"
              value={values.groupName}
              handleChange={handleChange}
              errors={errorMessages.groupName}
              checks={checks.groupName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="groupShortName"
              label="Short Name"
              value={values.groupShortName}
              handleChange={handleChange}
              inputProps={{
                minLength: 3,
                maxLength: 3,
              }}
              errors={errorMessages.groupShortName}
              checks={checks.groupShortName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              type="number"
              name="priority"
              label="Priority"
              value={values.priority}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomSelect
              label="Balance sheet group"
              name="balanceSheet"
              value={values.balanceSheet}
              items={[
                {
                  value: "Applications Of Funds",
                  label: "Applications Of Funds",
                },
                {
                  value: "Source Of Funds",
                  label: "Source Of Funds",
                },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomRadioButtons
              label="Financial Status"
              name="financials"
              value={values.financials}
              items={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={4}
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              errors={errorMessages.remarks}
              checks={checks.remarks}
              required
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
export default GroupForm;
