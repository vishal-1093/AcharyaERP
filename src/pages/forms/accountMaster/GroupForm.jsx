import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() => import("../../../components/Inputs/CustomTextField"));
const CustomRadioButtons = lazy(() => import("../../../components/Inputs/CustomRadioButtons"));
const CustomSelect = lazy(() => import("../../../components/Inputs/CustomSelect"));

const initialValues = {
  groupName: "",
  groupShortName: "",
  nameInEnglish: "",
  nameInRussian: "",
  priority: "",
  balanceSheetCode: "",
  remarks: "",
  financials: "",
  balanceSheet: "",
};
const requiredFields = [
  "groupName",
  "groupShortName",
  "nameInEnglish",
  "nameInRussian",
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
    nameInEnglish: [values.nameInEnglish !== ""],
    nameInRussian: [values.nameInRussian !== ""],
    remarks: [values.remarks !== "", values.remarks.length < 150],
  };

  const errorMessages = {
    groupName: ["This field required", "Enter Only Characters"],
    groupShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
    nameInEnglish: ["This field is required"],
    nameInRussian: ["This field is required"],
    remarks: ["This field is required", "Maximum characters 150"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/accountmaster/group/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Account Master", link: "/AccountMaster/Group" },
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
          nameInEnglish: res.data.data.name_in_english,
          nameInRussian: res.data.data.name_in_russia,
          priority: res.data.data.group_priority,
          balanceSheetCode: res.data.data.balance_sheet_row_code,
          remarks: res.data.data.remarks,
          financials: res.data.data.financials,
          balanceSheet: res.data.data.balance_sheet_group,
        });
        setGroupId(res.data.data.group_id);
        setCrumbs([
          { name: "Account Master", link: "/AccountMaster/Group" },
          { name: "Group" },
          { name: "Update" },
          { name: res.data.data.group_name },
        ]);
      })
      .catch((error) => console.error(error));
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
    setLoading(true);
    const temp = {};
    temp.active = true;
    temp.group_name = values.groupName;
    temp.group_short_name = values.groupShortName;
    temp.name_in_english = values.nameInEnglish;
    temp.name_in_russia = values.nameInRussian;
    temp.group_priority = values.priority;
    temp.balance_sheet_row_code = values.balanceSheetCode;
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
          navigate("/AccountMaster/Group", { replace: true });
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
      temp.name_in_english = values.nameInEnglish;
      temp.name_in_russia = values.nameInRussian;
      temp.group_priority = values.priority;
      temp.balance_sheet_row_code = values.balanceSheetCode;
      temp.remarks = values.remarks;
      temp.financials = values.financials;
      temp.balance_sheet_group = values.balanceSheet;
      await axios
        .put(`/api/group/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster/Group", { replace: true });
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
    <Box m={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="nameInEnglish"
              label="Name in English"
              value={values.nameInEnglish}
              handleChange={handleChange}
              errors={errorMessages.nameInEnglish}
              checks={checks.nameInEnglish}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="nameInRussian"
              label="Name in Russian"
              value={values.nameInRussian}
              handleChange={handleChange}
              errors={errorMessages.nameInRussian}
              checks={checks.nameInRussian}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="priority"
              label="Row Code"
              value={values.priority}
              handleChange={handleChange}
              type="number"
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

          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              errors={errorMessages.remarks}
              checks={checks.remarks}
              multiline
              rows={4}
              required
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
export default GroupForm;
