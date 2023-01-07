import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

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
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialVales);
  const [salaryStructureHeadId, setSalaryStructureHeadId] = useState(null);
  const [salaryStructureOptions, setSalaryStructureOptions] = useState([]);

  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    printName: [values.printName !== ""],
    priority: [values.priority !== "", /^[0-9]{1,100}$/.test(values.priority)],
  };

  const errorMessages = {
    printName: ["This field is required"],
    priority: ["This field is required", "Enter only numbers"],
  };

  useEffect(() => {
    getSalaryStructureHead();
    if (pathname.toLowerCase() === "/salarymaster/salarystructurehead/new") {
      setIsNew(true);

      setCrumbs([
        { name: "Salary Master", link: "/SalaryMaster/SalaryHead" },
        { name: "Salary Structure Head" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getSalaryStructure();
    }
  }, []);

  const getSalaryStructure = async () => {
    await axios
      .get(`/api/finance/SalaryStructureHead/${id}`)
      .then((res) => {
        setValues({
          voucherHeadId: res.data.data.voucher_head_new_id,
          categoryNameType: res.data.data.category_name_type,
          printName: res.data.data.print_name,
          priority: res.data.data.priority,
        });
        setSalaryStructureHeadId(res.data.data.salary_structure_head_id);
        setCrumbs([
          { name: "Salary Structure", link: "/SalaryMaster/SalaryHead" },
          { name: "Head" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };
  const getSalaryStructureHead = async () => {
    await axios
      .get(`/api/finance/VoucherHeadNewDetailsOnIsSalaries`)
      .then((res) => {
        setSalaryStructureOptions(
          res.data.data.map((obj) => ({
            value: obj.voucher_head_new_id,
            label: obj.voucher_head,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.voucher_head_new_id = values.voucherHeadId;
      temp.category_name_type = values.categoryNameType;
      temp.print_name = values.printName;
      temp.priority = values.priority;

      await axios
        .post(`/api/finance/SalaryStructureHead`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/SalaryMaster/SalaryHead", { replace: true });
        })
        .catch((error) => {
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
        message: "Please fill required fields",
      });

      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.salary_structure_head_id = salaryStructureHeadId;
      temp.voucher_head_new_id = values.voucherHeadId;
      temp.category_name_type = values.categoryNameType;
      temp.print_name = values.printName;
      temp.priority = values.priority;

      await axios
        .put(`/api/finance/SalaryStructureHead/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setLoading(true);
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/SalaryMaster/SalaryHead", { replace: true });
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: res.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
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
            <CustomAutocomplete
              name="voucherHeadId"
              label="Salary Structure Head"
              value={values.voucherHeadId}
              options={salaryStructureOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
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

export default SalaryStructureHeadForm;
