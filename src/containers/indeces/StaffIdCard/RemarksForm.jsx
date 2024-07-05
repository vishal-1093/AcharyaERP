import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";

const initialState = {
  receiptNo: "",
  receiptDate: "",
  remarks: "",
  loading: false,
};

const requiredFields = ["receiptNo", "receiptDate", "remarks"];

export const RemarksForm = ({
  getData,
  empId,
  remarks,
  receiptDate,
  receiptNo,
  handleRemarkFormModal,
}) => {
  const [state, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();

  useMemo(() => {
    setState((prevState) => ({
      ...prevState,
      receiptDate: receiptDate || "",
      receiptNo: receiptNo || "",
      remarks: remarks || "",
    }));
  }, []);

  const checks = {
    receiptNo: [state.receiptNo !== ""],
    receiptDate: [state.receiptDate !== ""],
    remarks: [state.remarks !== ""],
  };

  const errorMessages = {
    receiptNo: ["This field required"],
    receiptDate: ["This field required"],
    remarks: ["This field is required"],
  };

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDatePicker = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!state[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      let payload = {
        empId: empId,
        active: true,
        remarks: state.remarks,
        receiptDate: state.receiptDate,
        receiptNo: state.receiptNo,
      };
      setLoading(true);
      await axios
        .post(`/api/employee/employeeDuplicateIdCardCreationWithHistory`, [
          payload,
        ])
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
          }
          setLoading(false);
          setAlertOpen(true);
          handleRemarkFormModal();
          getData();
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

  return (
    <Box component="form" overflow="hidden" p={1}>
      <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={4}>
          <CustomTextField
            name="receiptNo"
            label="Receipt No"
            value={state.receiptNo}
            handleChange={handleChange}
            checks={checks.receiptNo}
            errors={errorMessages.receiptNo}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomDatePicker
            name="receiptDate"
            label="Receipt Date"
            value={state.receiptDate}
            handleChangeAdvance={handleDatePicker}
            checks={checks.receiptDate}
            errors={errorMessages.receiptDate}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            multiline
            rows={4}
            name="remarks"
            label="Remarks"
            value={state.remarks}
            handleChange={handleChange}
            checks={checks.remarks}
            errors={errorMessages.remarks}
            required
          />
        </Grid>

        {!remarks && (
          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={state.loading}
              onClick={handleCreate}
            >
              {state.loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Submit</strong>
              )}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
