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
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput.jsx")
);

const initialState = {
  loading: false,
  category: "",
  categoryList: [],
  reqAmount: null,
  payDate: "",
  remarks: "",
  attachment: "",
};

const requiredFields = [
  "category",
  "reqAmount",
  "payDate",
  "remarks",
  "attachment",
];

const DirectDemandForm = () => {
  const [
    {
      loading,
      category,
      categoryList,
      reqAmount,
      payDate,
      remarks,
      attachment,
    },
    setState,
  ] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Direct Demand", link: "/direct-demand-index" },
      { name: !!location.state ? "Update" : "Create" },
    ]);
    getCategoryData();
    !!location.state && setFormFields();
  }, []);

  const setFormFields = () => {
    setState((prevState) => ({
      ...prevState,
      category: location.state?.category_details_id,
      reqAmount: location.state?.requested_amount,
      payDate: location.state?.date,
      remarks: location.state?.remarks,
    }));
  };

  const checks = {
    category: [category !== null],
    reqAmount: [reqAmount !== ""],
    payDate: [payDate !== ""],
    remarks: [remarks !== ""],
    attachment: [
      attachment !== "",
      attachment && attachment.name.endsWith(".pdf"),
      attachment && attachment.size < 2000000,
    ],
  };

  const errorMessages = {
    category: ["This field required"],
    reqAmount: ["This field required"],
    payDate: ["This field is required"],
    remarks: ["This field is required"],
    attachment: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const getCategoryData = async () => {
    try {
      const res = await axios.get(`api/getCategoriesForPaymentType`);
      if (res.status == 200 || res.status == 201) {
        if (res?.data?.data?.length > 0) {
          setState((prevState) => ({
            ...prevState,
            categoryList: res.data.data.map((el) => ({
              label: el.category_detail,
              value: el.category_details_id,
            })),
          }));
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
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "-" || event.key === "+" || event.key === "e") {
      event.preventDefault();
    }
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      requiredFieldsValid();
      setLoading(true);
      let payload = {
        category_details_id: category || "",
        date: payDate || "",
        remarks: remarks || "",
        requested_amount: reqAmount || "",
        attachment_path: location.state ? location.state.attachment_path : null,
        attachment_name: attachment.name || location.state.attachment_name,
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
      if (!!location.state) {
        payload["env_bill_details_id"] = location.state.id;
        const res = await axios.put(
          `/api/finance/updateEnvBillDetails/${location.state?.id}`,
          payload
        );
        if (res.status == 200 || res.status == 201) {
          if (!!attachment) {
            uploadAttachment(res.data.data[0]);
          } else {
            actionAfterResponse();
          }
        }
      } else {
        const res = await axios.post(`api/finance/saveEnvBillDetails`, [
          payload,
        ]);
        if (res.status == 200 || res.status == 201) {
          uploadAttachment(res.data.data[0]);
        }
      }
    } catch (error) {
      setLoading(false);
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

  const uploadAttachment = async (file) => {
    try {
      const attachmentFile = new FormData();
      attachmentFile.append("env_bill_details_id", file?.env_bill_details_id);
      attachmentFile.append("multipartFile", attachment);
      const res = await axios.post(
        "/api/finance/EnvBillDetailsUploadFile",
        attachmentFile
      );
      if (res.status == 200 || res.status == 201) {
        actionAfterResponse();
      }
    } catch (err) {
      setLoading(false);
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const actionAfterResponse = () => {
    setLoading(false);
    navigate("/direct-demand-index", { replace: true });
    setAlertMessage({
      severity: "success",
      message: `Direct demand ${
        !!location.state ? "updated" : "created"
      } successfully !!`,
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
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="reqAmount"
              label="Requested Amount"
              value={reqAmount || ""}
              handleChange={handleChange}
              type="number"
              onKeyDown={handleKeyDown}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="payDate"
              label="Pay By Date"
              value={payDate || ""}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={remarks || ""}
              handleChange={handleChange}
              rows={4}
              multiline
              required
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
              checks={checks.attachment}
              errors={errorMessages.attachment}
              required
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={
                loading ||
                (!location.state && !requiredFieldsValid()) ||
                (!!location.state &&
                  (!category || !reqAmount || !payDate || !remarks))
              }
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{!!location.state ? "Update" : "Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default DirectDemandForm;
