import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const initialVales = {
  salaryStructure: "",
  printName: "",
  remarks: "",
};
const requiredFields = ["salaryStructure", "printName"];
function SalaryStructureForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialVales);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [salaryStructureId, setSalaryStructureId] = useState(null);
  const checks = {
    salaryStructure: [values.salaryStructure !== ""],
    printName: [values.printName !== ""],
  };
  const errorMessages = {
    salaryStructure: ["This field is required"],
    printName: ["This field is required"],
  };

  const getSalaryStructure = async () => {
    await axios.get(`${ApiUrl}/finance/SalaryStructure/${id}`).then((res) => {
      setValues({
        salaryStructure: res.data.data.salary_structure,
        printName: res.data.data.print_name,
        remarks: res.data.data.remarks,
      });
      setSalaryStructureId(res.data.data.salary_structure_id);
      setCrumbs([
        { name: "Salary Master", link: "/SalaryMaster/SalaryStructure" },
        { name: "Salary Strcuture" },
        { name: "Update" },
        { name: res.data.data.salary_structure },
      ]);
    });
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/salarymaster/salarystructure/new") {
      setIsNew(true);

      setCrumbs([
        { name: "Salary Master", link: "/SalaryMaster" },
        { name: "Salary Strcuture" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getSalaryStructure();
    }
  }, []);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      temp.salary_structure = values.salaryStructure;
      temp.print_name = values.printName;
      temp.remarks = values.remarks;

      await axios
        .post(`${ApiUrl}/finance/SalaryStructure`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Salary Strcuture created",
            });
            navigate("/SalaryMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
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
      console.log("failed");
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.salary_structure_id = salaryStructureId;
      temp.salary_structure = values.salaryStructure;
      temp.print_name = values.printName;
      temp.remarks = values.remarks;

      await axios
        .put(`${ApiUrl}/finance/SalaryStructure/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setLoading(true);
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/SalaryMaster", { replace: true });
          } else {
            setLoading(false);
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
          justifyContent="flex-start"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="salaryStructure"
              label="Salary Structure"
              value={values.salaryStructure}
              handleChange={handleChange}
              errors={errorMessages.salaryStructure}
              checks={checks.salaryStructure}
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
  );
}
export default SalaryStructureForm;
