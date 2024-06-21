import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";

const initialVales = {
  voucherHeadId: "",
  categoryNameType: "",
  printName: "",
  priority: "",
};

const requiredFields = [
  "voucherHeadId",
  "categoryNameType",
  "printName",
  "priority",
];

function SalaryStructureHeadForm() {
  const [values, setValues] = useState(initialVales);
  const [isNew, setIsNew] = useState(false);
  const [salaryHeadeOptions, setSalaryHeadeOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();

  const checks = {
    printName: [values.printName !== ""],
    priority: [values.priority !== "", /^[0-9]{1,100}$/.test(values.priority)],
  };

  const errorMessages = {
    printName: ["This field is required"],
    priority: ["This field is required", "Enter only numbers"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/salarymaster/salarystructurehead/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Salary Master", link: "/SalaryMaster/SalaryHead" },
        { name: "Salary Structure Head" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getData();
    }
  }, []);

  useEffect(() => {
    getSalaryStructureHead();
  }, [isNew]);

  const getSalaryStructureHead = async () => {
    const createdData = await axios
      .get(`/api/finance/SalaryStructureHead1`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    await axios
      .get(`/api/finance/VoucherHeadNewDetailsOnIsSalaries`)
      .then((res) => {
        if (isNew) {
          const Ids = [];
          createdData.forEach((obj) => {
            Ids.push(obj.voucher_head_new_id);
          });
          const removeDuplicates = res.data.data.filter(
            (obj) => Ids.includes(obj.voucher_head_new_id) === false
          );

          setSalaryHeadeOptions(
            removeDuplicates.map((obj) => ({
              value: obj.voucher_head_new_id,
              label: obj.voucher_head,
            }))
          );
        } else {
          setSalaryHeadeOptions(
            res.data.data.map((obj) => ({
              value: obj.voucher_head_new_id,
              label: obj.voucher_head,
            }))
          );
        }
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    await axios
      .get(`/api/finance/SalaryStructureHead/${id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          voucherHeadId: res.data.data.voucher_head_new_id,
          categoryNameType: res.data.data.category_name_type,
          printName: res.data.data.print_name,
          priority: res.data.data.priority,
        }));

        setCrumbs([
          { name: "Salary Structure", link: "/SalaryMaster/SalaryHead" },
          { name: "Salary Structure Head" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
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

  const handleCreate = async (e) => {
    const temp = {};
    temp.active = true;
    temp.voucher_head_new_id = values.voucherHeadId;
    temp.category_name_type = values.categoryNameType;
    temp.print_name = values.printName.toLowerCase().trim();
    temp.priority = values.priority;

    await axios
      .post(`/api/finance/SalaryStructureHead`, temp)
      .then((res) => {
        if (res.data.success) {
          setAlertMessage({
            severity: "success",
            message: "Salay Head created successfully !!",
          });
          setAlertOpen(true);
        } else {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong!!",
          });
          setAlertOpen(true);
        }
        navigate("/SalaryMaster/SalaryHead", { replace: true });
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };

  const handleUpdate = async (e) => {
    const temp = {};
    temp.active = true;
    temp.salary_structure_head_id = id;
    temp.voucher_head_new_id = values.voucherHeadId;
    temp.category_name_type = values.categoryNameType;
    temp.print_name = values.printName;
    temp.priority = values.priority;

    await axios
      .put(`/api/finance/SalaryStructureHead/${id}`, temp)
      .then((res) => {
        if (res.data.success) {
          setLoading(true);
          setAlertMessage({
            severity: "success",
            message: "Salay Head updated successfully !!",
          });
          setAlertOpen(true);
        } else {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: res.data.message,
          });
          setAlertOpen(true);
        }
        navigate("/SalaryMaster/SalaryHead", { replace: true });
      })
      .catch((error) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
      });
    setAlertOpen(true);
  };

  return (
    <Box m={2}>
      <FormWrapper>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="voucherHeadId"
              label="Salary Structure Head"
              value={values.voucherHeadId}
              options={salaryHeadeOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomSelect
              name="categoryNameType"
              label="Type"
              value={values.categoryNameType}
              handleChange={handleChange}
              items={[
                { value: "Earning", label: "Earning" },
                { value: "Deduction", label: "Deduction" },
                { value: "Management", label: "Management" },
              ]}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="printName"
              label="Print Name"
              value={values.printName}
              handleChange={handleChange}
              errors={errorMessages.printName}
              checks={checks.printName}
              disabled={!isNew}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="priority"
              label="Priority"
              value={values.priority}
              handleChange={handleChange}
              errors={errorMessages.priority}
              checks={checks.priority}
              fullWidth
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

export default SalaryStructureHeadForm;
