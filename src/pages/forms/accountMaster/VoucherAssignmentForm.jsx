import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import FormWrapper from "../../../components/FormWrapper";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import CustomModal from "../../../components/CustomModal";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  voucherId: "",
  ledgerId: "",
  voucherType: "",
  budgetHead: "",
  cashBank: "",
  voucherPriority: "",
  school: "",
};

const requiredFields = [
  "voucherId",
  "ledgerId",
  "voucherType",
  "budgetHead",
  "cashBank",
  "voucherPriority",
  "school",
];

function VoucherAssignmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [voucherOptions, setVoucherOptions] = useState([]);
  const [legderOptions, setLegderOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [voucherHeadId, setVoucherHeadId] = useState(null);
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    voucherPriority: [
      values.voucherPriority !== "",
      /^[0-9]*$/.test(values.voucherPriority),
    ],
  };
  const errorMessages = {
    voucherPriority: ["This field is required", "Please enter a number"],
  };

  useEffect(() => {
    getVoucherOptions();
    getLedgerOptions();
    if (pathname.toLowerCase() === "/accountmaster/voucherassignment/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster" },
        { name: "Voucher Assignment" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getData();
      getSchoolOptions();
    }
  }, [pathname]);

  const getData = async () => {
    await axios
      .get(`${ApiUrl}/finance/VoucherHead/${id}`)
      .then((res) => {
        const data = res.data.data;
        setValues({
          voucherId: data.voucher_head_new_id,
          ledgerId: data.ledger_id,
          voucherType: data.voucher_type,
          budgetHead: data.budget_head,
          cashBank: data.cash_or_bank,
          salaries: data.salaries,
          voucherPriority: data.voucher_priority,
          school: data.school_id.toString(),
          id: data.voucher_head_new_id,
          voucherHeadId: data.voucher_head_id,
        });
        setVoucherHeadId(data.voucher_head_id);
        setCrumbs([
          { name: "AccountMaster", link: "/AccountMaster" },
          { name: "Voucher Assignment" },
          { name: "Update" },
          { name: data.voucher_type },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const getVoucherOptions = async () => {
    await axios
      .get(`${ApiUrl}/finance/VoucherHeadNew`)
      .then((res) => {
        setVoucherOptions(
          res.data.data.map((obj) => ({
            value: obj.voucher_head_new_id,
            label: obj.voucher_head,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getLedgerOptions = async () => {
    await axios
      .get(`${ApiUrl}/finance/Ledger`)
      .then((res) => {
        setLegderOptions(
          res.data.data.map((obj) => ({
            value: obj.ledger_id,
            label: obj.ledger_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolOptions = async () => {
    await axios
      .get(`${ApiUrl}/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getVoucherBasedSchool = async () => {
    await axios
      .get(`${ApiUrl}/finance/allUnassignedSchoolDetails/${values.voucherId}`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "voucherId") {
      getVoucherBasedSchool();
    }
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.voucher_head_new_id = values.voucherId;
      temp.ledger_id = values.ledgerId;
      temp.voucher_type = values.voucherType;
      temp.budget_head = values.budgetHead;
      temp.cash_or_bank = values.cashBank;
      temp.salaries = values.salaries;
      temp.voucher_priority = values.voucherPriority;
      temp.school_id = values.school;

      await axios
        .post(`${ApiUrl}/finance/VoucherHead`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
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
            message: error.response.data.message
              ? error.response.data.message
              : "Error",
          });
          setAlertOpen(true);
        });
    }
  };
  const handleUpdate = async () => {
    console.log(requiredFieldsValid());
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Error",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.voucher_head_new_id = values.voucherId;
      temp.ledger_id = values.ledgerId;
      temp.voucher_type = values.voucherType;
      temp.budget_head = values.budgetHead;
      temp.cash_or_bank = values.cashBank;
      temp.salaries = values.salaries;
      temp.voucher_priority = values.voucherPriority;
      temp.school_id = values.school;
      temp.voucher_head_id = voucherHeadId;

      await axios
        .put(`${ApiUrl}/finance/VoucherHead/${voucherHeadId}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
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
            alignItems="center"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                label="Voucher Head"
                name="voucherId"
                value={values.voucherId}
                options={voucherOptions}
                disabled={!isNew}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                label="Ledger"
                name="ledgerId"
                value={values.ledgerId}
                options={legderOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelect
                label="Voucher Type"
                name="voucherType"
                value={values.voucherType}
                items={[
                  { value: "inflow", label: "Inflow" },
                  { value: "outflow", label: "OutFlow" },
                  { value: "journal", label: "Journal" },
                  { value: "all", label: "All" },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <CustomRadioButtons
                name="budgetHead"
                label="Budget Head"
                value={values.budgetHead}
                items={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <CustomRadioButtons
                name="cashBank"
                label="Cash / Bank"
                value={values.cashBank}
                items={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <CustomTextField
                name="voucherPriority"
                label="Priority"
                value={values.voucherPriority}
                handleChange={handleChange}
                errors={errorMessages.voucherPriority}
                checks={checks.voucherPriority}
                required
              />
            </Grid>
            {isNew ? (
              <Grid item xs={12} md={4}>
                <CustomMultipleAutocomplete
                  name="school"
                  label="School"
                  value={values.school}
                  options={schoolOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
            ) : (
              <Grid item xs={12} md={4}>
                <CustomSelect
                  name="school"
                  label="School"
                  value={values.school}
                  items={schoolOptions}
                  disabled
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
              >
                <Grid item xs={6} sm={4} md={2}>
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
export default VoucherAssignmentForm;
