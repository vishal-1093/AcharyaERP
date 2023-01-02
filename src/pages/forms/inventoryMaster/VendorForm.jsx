import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import useAlert from "../../../hooks/useAlert";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import axios from "../../../services/Api";
import CustomModal from "../../../components/CustomModal";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
const initialValues = {
  accountHolderName: "",
  ifscCode: "",
  bankName: "",
  cityId: "",
  contactNumber: "",
  vendorEmail: "",
  gstNumber: "",
  vendorName: "",
  vendorType: "",
  accountNumber: "",
  area: "",
  bankBranch: "",
  creditPeriod: "",
  ledgerId: "",
  natureOfBusiness: "",
  panNumber: "",
  stateId: "",
  streetName: "",
  fileName: "",
};
const requiredFields = [
  "accountHolderName",
  "ifscCode",
  "bankName",
  "cityId",
  "contactNumber",
  "vendorEmail",
  "gstNumber",
  "vendorName",
  "vendorType",
  "accountNumber",
  "area",
  "bankBranch",
  "creditPeriod",
  "ledgerId",

  "panNumber",
  "stateId",
  "streetName",
];
function VendorForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [ledger, setLedger] = useState([]);
  const [vendorId, setVendorId] = useState(null);
  const navigate = useNavigate();

  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getState();
    getLedger();

    if (pathname.toLowerCase() === "/inventorymaster/vendor/new") {
      setIsNew(true);
      setCrumbs([
        { name: "InventoryMaster", link: "/InventoryMaster/Vendor" },
        { name: "Vendor" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getVendorData();
    }
  }, [pathname]);

  const handleState = async (name, newValue) => {
    await axios
      .get(`/api/City1/${newValue}/${101}`)
      .then((res) => {
        setCity(
          res.data.map((obj) => ({
            value: obj.id,
            label: obj.name,
          }))
        );
      })
      .catch((err) => console.error(err));
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    if (e.target.name === "panNumber") {
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

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const checks = {
    vendorName: [
      values.vendorName !== "",
      /^[A-Za-z ]+$/.test(values.vendorName),
    ],
    vendorEmail: [
      values.vendorEmail !== "",
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.vendorEmail
      ),
    ],
    contactNumber: [/^[0-9]{10}$/.test(values.contactNumber)],
    streetName: [values.streetName !== ""],
    area: [values.area !== ""],
    gstNumber: [
      values.gstNumber !== "",
      /^[0-9a-zA-Z]{15}$/.test(values.gstNumber),
    ],
    panNumber: [
      values.panNumber !== "",
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNumber),
    ],
    accountHolderName: [
      values.accountHolderName !== "",
      /^[A-Za-z ]+$/.test(values.accountHolderName),
    ],
    accountNumber: [
      values.accountNumber !== "",
      /^[0-9a-zA-Za-z]{8,18}$/.test(values.accountNumber),
    ],
    bankName: [values.bankName !== "", /^[A-Za-z ]+$/.test(values.bankName)],
    bankBranch: [
      values.bankBranch !== "",
      /^[A-Za-z ]+$/.test(values.bankBranch),
    ],
    ifscCode: [
      values.ifscCode !== "",
      /^[0-9a-zA-Za-z]{11}$/.test(values.ifscCode),
    ],

    creditPeriod: [/^[0-9]{1,100}$/.test(values.creditPeriod)],
    fileName: [
      values.fileName,
      values.fileName && values.fileName.name.endsWith(".pdf"),
      values.fileName && values.fileName.size < 2000000,
    ],
  };

  const errorMessages = {
    vendorName: ["This field required", "Enter Only Characters"],
    vendorEmail: ["This field is required", "Invalid email"],
    contactNumber: ["Invalid Phone"],
    streetName: ["This field is required"],
    area: ["This field is required"],
    gstNumber: ["This field required", "Invalid GST"],
    panNumber: ["This field required", "Invalid PAN"],
    accountHolderName: ["This field required", "Enter Only Characters"],
    accountNumber: ["This field is required", "Invalid acoount number"],
    bankName: ["This field required", "Enter Only Characters"],
    bankBranch: ["This field required", "Enter Only Characters"],
    ifscCode: ["This field required", "Invalid IFSC"],

    creditPeriod: ["Enter Numbers"],
    fileName: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const handleModalOpen = (action) => {
    if (action === "discard") {
      setModalContent({
        title: "",
        message: "Are you sure ? All fields will be discarded.",
        buttons: [
          {
            name: "Continue",
            color: "primary",
            func: handleDiscard,
          },
        ],
      });
      setModalOpen(true);
    }
  };

  const handleDiscard = () => {
    setValues(initialValues);
  };

  const getState = async () => {
    await axios
      .get(`/api/State1/${101}`)
      .then((res) => {
        setState(
          res.data.map((obj) => ({
            value: obj.id,
            label: obj.name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getLedger = async () => {
    await axios
      .get(`/api/finance/Ledger`)
      .then((res) => {
        setLedger(
          res.data.data.map((obj) => ({
            value: obj.ledger_id,
            label: obj.ledger_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getVendorData = async () => {
    await axios
      .get(`/api/inventory/vendorById/${id}`)
      .then((res) => {
        setValues({
          vendorAddress: res.data.data.vendor_address,
          accountHolderName: res.data.data.vendor_bank_account_holder_name,
          ifscCode: res.data.data.vendor_bank_ifsc_code,
          bankName: res.data.data.vendor_bank_name,
          cityId: res.data.data.vendor_city_id,
          contactNumber: res.data.data.vendor_contact_no,
          vendorEmail: res.data.data.vendor_email,
          gstNumber: res.data.data.vendor_gst_no,
          vendorName: res.data.data.vendor_name,
          vendorType: res.data.data.vendor_type,
          accountNumber: res.data.data.account_no,
          streetName: res.data.data.street_name,
          area: res.data.data.area,
          bankBranch: res.data.data.bank_branch,
          creditPeriod: res.data.data.credit_period,
          ledgerId: res.data.data.ledger_id,
          natureOfBusiness: res.data.data.nature_of_business,
          panNumber: res.data.data.pan_number,
          stateId: res.data.data.state_id,
        });
        setVendorId(res.data.data.vendor_id);
        setCrumbs([
          { name: "InventoryMaster", link: "/InventoryMaster/Vendor" },
          { name: "Vendor" },
          { name: "Update" },
          { name: res.data.data.vendorName },
        ]);
        axios
          .get(`/api/City1/${res.data.data.state_id}/${101}`)
          .then((res) => {
            setCity(
              res.data.map((obj) => ({
                value: obj.id,
                label: obj.name,
              }))
            );
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => console.error(error));
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
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.vendor_name = values.vendorName;
      temp.vendor_email = values.vendorEmail;
      temp.vendor_contact_no = values.contactNumber;
      temp.area = values.area;
      temp.state_id = values.stateId;
      temp.vendor_city_id = values.cityId;
      temp.vendor_gst_no = values.gstNumber;
      temp.pan_number = values.panNumber;
      temp.vendor_bank_account_holder_name = values.accountHolderName;
      temp.account_no = values.accountNumber;
      temp.vendor_bank_name = values.bankName;
      temp.bank_branch = values.bankBranch;
      temp.vendor_bank_ifsc_code = values.ifscCode;
      temp.vendor_type = values.vendorType;
      temp.ledger_id = values.ledgerId;
      temp.nature_of_business = values.natureOfBusiness;
      temp.credit_period = values.creditPeriod;
      temp.street_name = values.streetName;
      await axios
        .post(`/api/inventory/vendor`, temp)
        .then((res) => {
          const vendorId = res.data.data.vendor_id;
          const dataArray = new FormData();
          dataArray.append("file", values.fileName);
          dataArray.append("vendor_id", vendorId);

          axios
            .post(`/api/inventory/vendorUploadFile`, dataArray, {
              headers: {
                "Content-type": "multipart/form-data",
              },
            })
            .then((res) => {})
            .catch((error) => console.error(error));

          setLoading(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/InventoryMaster/Vendor", { replace: true });
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
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.vendor_id = vendorId;
      temp.vendor_name = values.vendorName;
      temp.vendor_email = values.vendorEmail;
      temp.vendor_contact_no = values.contactNumber;
      temp.vendor_address = values.vendorAddress;
      temp.area = values.area;
      temp.state_id = values.stateId;
      temp.vendor_city_id = values.cityId;
      temp.vendor_gst_no = values.gstNumber;
      temp.pan_number = values.panNumber;
      temp.vendor_bank_account_holder_name = values.accountHolderName;
      temp.account_no = values.accountNumber;
      temp.vendor_bank_name = values.bankName;
      temp.bank_branch = values.bankBranch;
      temp.vendor_bank_ifsc_code = values.ifscCode;
      temp.street_name = values.streetName;
      temp.vendor_type = values.vendorType;
      temp.ledger_id = values.ledgerId;
      temp.nature_of_business = values.natureOfBusiness;
      temp.credit_period = values.creditPeriod;

      await axios
        .put(`/api/inventory/vendor/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.data.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated successfully!",
            });
            setAlertOpen(true);
            navigate("/InventoryMaster/Vendor", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <FormWrapper>
          <Grid
            container
            justifycontents="flex-start"
            alignItems="center"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="vendorName"
                label="Name"
                value={values.vendorName}
                handleChange={handleChange}
                errors={errorMessages.vendorName}
                checks={checks.vendorName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="vendorEmail"
                label="Email ID"
                value={values.vendorEmail}
                handleChange={handleChange}
                errors={errorMessages.vendorEmail}
                checks={checks.vendorEmail}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="contactNumber"
                label="Phone"
                value={values.contactNumber}
                handleChange={handleChange}
                errors={errorMessages.contactNumber}
                checks={checks.contactNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                type="text"
                name="streetName"
                label="House no/Street"
                value={values.streetName}
                handleChange={handleChange}
                errors={errorMessages.streetName}
                checks={checks.streetName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                type="text"
                name="area"
                label="Locality"
                value={values.area}
                handleChange={handleChange}
                errors={errorMessages.area}
                checks={checks.area}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="stateId"
                label="State"
                value={values.stateId}
                options={state}
                handleChangeAdvance={handleState}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="cityId"
                label="City"
                value={values.cityId}
                options={city}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="gstNumber"
                label="GST No"
                value={values.gstNumber}
                handleChange={handleChange}
                errors={errorMessages.gstNumber}
                checks={checks.gstNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="panNumber"
                label="PAN No"
                value={values.panNumber}
                handleChange={handleChange}
                errors={errorMessages.panNumber}
                checks={checks.panNumber}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="accountHolderName"
                label="Bank account holder name"
                value={values.accountHolderName}
                handleChange={handleChange}
                errors={errorMessages.accountHolderName}
                checks={checks.accountHolderName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="accountNumber"
                label="Account Number"
                value={values.accountNumber}
                handleChange={handleChange}
                errors={errorMessages.accountNumber}
                checks={checks.accountNumber}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="bankName"
                label="Bank Name"
                value={values.bankName}
                handleChange={handleChange}
                errors={errorMessages.bankName}
                checks={checks.bankName}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="bankBranch"
                label="Bank Branch Name"
                value={values.bankBranch}
                handleChange={handleChange}
                errors={errorMessages.bankBranch}
                checks={checks.bankBranch}
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
              <CustomSelect
                name="vendorType"
                label="Vendor Type"
                value={values.vendorType}
                items={[
                  { value: "Capex", label: "Capex" },
                  { value: "Opex", label: "Opex" },
                  { value: "Both", label: "Both" },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="natureOfBusiness"
                label="Nature Of Businesses"
                value={values.natureOfBusiness}
                handleChange={handleChange}
                items={[
                  { value: "Goods", label: "Goods" },
                  { value: "Services", label: "Services" },
                  { value: "Both", label: "Both" },
                ]}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="creditPeriod"
                label="Credit Period(in days)"
                value={values.creditPeriod}
                handleChange={handleChange}
                errors={errorMessages.creditPeriod}
                checks={checks.creditPeriod}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="ledgerId"
                label="Ledger"
                value={values.ledgerId}
                options={ledger}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              {isNew ? (
                <CustomFileInput
                  name="fileName"
                  label="file"
                  helperText="PDF - smaller than 2 MB"
                  file={values.fileName}
                  handleFileDrop={handleFileDrop}
                  handleFileRemove={handleFileRemove}
                  errors={errorMessages.fileName}
                  checks={checks.fileName}
                />
              ) : (
                <></>
              )}
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
                    color="error"
                    disabled={loading}
                    onClick={() => handleModalOpen("discard")}
                  >
                    <strong>Discard</strong>
                  </Button>
                </Grid>

                <Grid item xs={2}>
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
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default VendorForm;
