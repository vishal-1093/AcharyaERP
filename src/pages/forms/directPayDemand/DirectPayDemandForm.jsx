import { useState, lazy, useEffect } from "react";
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import FormWrapper from "../../../components/FormWrapper.jsx";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput.jsx")
);

const initialState = {
  category: "",
  amount: "",
  payDate: "",
  remarks: "",
  attachment: "",
  categoryList: [],
  loading: false,
};

const maxLength = 150;
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const requiredFields = [
  "category",
  "amount",
  "payDate",
  "attachment",
  "remarks",
];

const requiredFieldsWithoutAttachment = [
  "category",
  "amount",
  "payDate",
  "remarks",
];

const DirectPayDemandForm = () => {
  const [
    { category, amount, payDate, remarks, attachment, categoryList, loading },
    setState,
  ] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      {
        name: "Direct Pay Demand",
        link:
          location.state.path == "direct-demand-user"
            ? "/direct-demand-user"
            : "/journalmaster/demand",
      },
      { name: location.state.value ? "Update" : "Create" },
    ]);
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    try {
      const res = await axios.get(`/api/getCategoriesForPaymentType`);
      if (res.status === 200 || res.status === 201) {
        setState((prevState) => ({
          ...prevState,
          categoryList: res.data.data.map((ele) => ({
            label: ele.category_detail,
            value: ele.category_details_id,
          })),
        }));
        location.state.value && setFormField(location.state.value);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const setFormField = (formValue) => {
    setState((prevState) => ({
      ...prevState,
      category: formValue.category_details_id,
      amount: formValue.requested_amount,
      payDate: formValue.date,
      remarks: formValue.remarks,
    }));
  };

  const getRemainingCharacters = () => maxLength - remarks.length;

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "remarks" && value.length > maxLength) return;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileDrop = (name, newFile) => {
    setState((prev) => ({
      ...prev,
      [name]: newFile,
    }));
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const check = {
    category: [category !== ""],
    amount: [amount !== ""],
    payDate: [payDate !== ""],
    remarks: [remarks !== ""],
    attachment: [
      attachment !== "",
      attachment?.name?.endsWith(".pdf"),
      attachment?.size < 2000000,
    ],
  };

  const checkWithoutAttachment = {
    category: [category !== ""],
    amount: [amount !== ""],
    payDate: [payDate !== ""],
    remarks: [remarks !== ""],
  };

  const error = {
    attachment: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const isFormValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(check).includes(field)) {
        const ch = check[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const isFormValidWithoutAttachment = () => {
    for (let i = 0; i < requiredFieldsWithoutAttachment.length; i++) {
      const field = requiredFieldsWithoutAttachment[i];
      if (Object.keys(checkWithoutAttachment).includes(field)) {
        const ch = checkWithoutAttachment[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      let payload = {
        category_details_id: category,
        date: payDate,
        remarks: remarks,
        requested_amount: amount,
        attachment_path: null,
        attachment_name: attachment.name,
        journal_voucher_id: null,
        aprover1_id: null,
        aprover1_date: null,
        aprover1_remarks: null,
        aprover1_status: null,
        aprover2_id: null,
        aprover2_remarks: null,
        aprover2_status: null,
        aprover2_date: null,
        payment_voucher_id: null,
        cancel_epayment_grn: null,
        epayment_cancel_remark: null,
        env_cancelled_by: null,
        env_cancelled_date: null,
        active: true,
      };
      if (!location.state.value) {
        const res = await axios.post(
          `/api/finance/saveEnvBillDetails`,
          payload
        );
        if (res.status == 200 || res.status == 201) {
          uploadAttachment(res.data.data.env_bill_details_id);
        }
      } else {
        const res = await axios.put(
          `api/finance/updateEnvBillDetails/${location.state.value.id}`,
          payload
        );
        if ((res.status == 200 || res.status == 201) && attachment) {
          uploadAttachment(res.data.data.env_bill_details_id);
        } else if (res.status == 200 || res.status == 201) {
          actionAfterResponse();
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const uploadAttachment = async (detailId) => {
    try {
      const formData = new FormData();
      formData.append("multipartFile", attachment);
      formData.append("env_bill_details_id", detailId);
      const res = await axios.post(
        `/api/finance/EnvBillDetailsUploadFile`,
        formData
      );
      if (res.status == 200 || res.status == 201) {
        actionAfterResponse();
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const actionAfterResponse = () => {
    setLoading(false);
    navigate(
      location.state.path == "direct-demand-index"
        ? "/direct-demand-index"
        : "/journalmaster/demand"
    );
    setAlertMessage({
      severity: "success",
      message: `Direct Pay demand ${
        location.state.value ? "updated" : "created"
      } successfully!!`,
    });
    setAlertOpen(true);
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="category"
              label="Category"
              value={category || ""}
              options={categoryList || []}
              handleChangeAdvance={handleChangeAdvance}
              disabled={location.state.value}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="amount"
              label="Requested Amount"
              value={amount || ""}
              handleChange={handleChange}
              type="number"
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="payDate"
              label="Pay By Date"
              value={payDate || ""}
              handleChangeAdvance={handleChangeAdvance}
              minDate={
                !location.state.value ? tomorrow : location.state.value.date
              }
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={remarks || ""}
              handleChange={handleChange}
              required
              multiline
              helperText={`Remaining characters : ${getRemainingCharacters()}`}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomFileInput
              name="attachment"
              label="Pdf File Attachment"
              helperText="PDF - smaller than 2 MB"
              file={attachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={check.attachment}
              errors={error.attachment}
              required
            />
          </Grid>
          <Grid
            item
            align="right"
            md={4}
            xs={12}
            sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={
                location.state.value
                  ? !isFormValidWithoutAttachment()
                  : !isFormValid()
              }
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{location.state.value ? "Update" : "Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default DirectPayDemandForm;
