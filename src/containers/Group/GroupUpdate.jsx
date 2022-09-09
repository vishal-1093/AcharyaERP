import React, { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import FormWrapper from "../../components/FormWrapper";
import axios from "axios";
import ApiUrl from "../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "../../components/Inputs/CustomSelect";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import useAlert from "../../hooks/useAlert";

function GroupUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({
    groupName: "",
    groupShortName: "",
    priority: "",
    remarks: "",
    financials: "",
    balanceSheet: "",
  });
  const [formValid, setFormValid] = useState({
    groupName: true,
    groupShortName: true,
  });
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "groupShortName") {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        active: true,
      }));
    }
  };

  useEffect(() => {
    getGroup();
  }, []);

  const getGroup = () => {
    axios
      .get(`${ApiUrl}/group/${id}`)
      .then((res) => {
        setData({
          groupName: res.data.data.group_name,
          groupShortName: res.data.data.group_short_name,
          priority: res.data.data.group_priority,
          remarks: res.data.data.remarks,
          financials: res.data.data.financials,
          balanceSheet: res.data.data.balance_sheet_group,
        });
        setGroupId(res.data.data.group_id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.group_id = groupId;
      temp.active = true;
      temp.group_name = data.groupName;
      temp.group_short_name = data.ledgerShortName;
      temp.group_priority = data.priority;
      temp.remarks = data.remarks;
      temp.financials = data.financials;
      temp.balance_sheet_group = data.balanceSheet;
      await axios
        .put(`${ApiUrl}/group/${id}`, temp)
        .then((response) => {
          setLoading(true);
          console.log(response);
          setAlertMessage({
            severity: "success",
            message: response.data.data,
          });
          setAlertOpen(true);
          navigate("/GroupIndex", { replace: true });
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
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="groupName"
                  label="Group"
                  value={data.groupName}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    data.groupName !== "",
                    /^[A-Za-z ]+$/.test(data.groupName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="groupShortName"
                  label="Short Name"
                  value={data.groupShortName ?? ""}
                  handleChange={handleChange}
                  inputProps={{
                    minLength: 3,
                    maxLength: 3,
                  }}
                  fullWidth
                  errors={[
                    "This field required",
                    "Enter characters and its length should be three",
                  ]}
                  checks={[
                    data.groupShortName !== "",
                    /^[A-Za-z ]{3,3}$/.test(data.groupShortName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  type="number"
                  name="priority"
                  label="Priority"
                  value={data.priority ?? ""}
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomSelect
                  label="Balance sheet group"
                  name="balanceSheet"
                  value={data.balanceSheet}
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
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomRadioButtons
                  label="Financial Status"
                  name="financials"
                  value={data.financials}
                  items={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ]}
                  handleChange={handleChange}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  multiline
                  rows={4}
                  name="remarks"
                  label="Remarks"
                  value={data.remarks ?? ""}
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  textAlign="right"
                >
                  <Grid item xs={2}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      onClick={handleSubmit}
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        <strong>Update</strong>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default GroupUpdate;
