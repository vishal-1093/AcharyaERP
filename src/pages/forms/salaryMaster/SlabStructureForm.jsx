import { React, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { makeStyles } from "@mui/styles";

const styles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 40,
    maxWidth: 880,
    marginLeft: "120px",
  },
}));

const initialValues = {
  slabDefinationId: null,
  minimumAmount: "",
  maximumAmount: "",
  amount: "",
};

const requiredFields = ["slabDefinationId", "maximumAmount", "amount"];

function SlabStructureForm() {
  const { id } = useParams();
  const classes = styles();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [isNew, setIsNew] = useState(true);
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const [slabId, setSlabId] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [slabStructureId, setSlabStructureId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slabDefinationOptions, setSlabDefinationOptions] = useState([]);

  const checks = {
    maximumAmount: [values.maximumAmount !== ""],
    amount: [values.amount !== ""],
  };
  const errorMessages = {
    maximumAmount: ["This field is required"],
    amount: ["This field is required"],
  };

  useEffect(() => {
    getSlabDetails();

    if (pathname.toLowerCase() === "/slabstructureform") {
      setIsNew(true);

      setCrumbs([
        { name: "Salary Master", link: "/SalaryMaster/SlabStructure" },
        { name: "Slab Structure" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getSlabStructureDetails();
    }
  }, []);
  const getSlabDetails = async () => {
    await axios
      .get(`${ApiUrl}/finance/SlabDetails`)
      .then((res) => {
        setSlabDefinationOptions(
          res.data.data.map((obj) => ({
            value: obj.slab_details_id,
            label: obj.slab_details_name,
          }))
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getSlabStructureDetails = async () => {
    await axios
      .get(`${ApiUrl}/SlabStructure/${id}`)
      .then((res) => {
        setValues({
          slabDefinationId: res.data.data.slab_details_id,
          minimumAmount: res.data.data.min_value,
          maximumAmount: res.data.data.max_value,
          amount: res.data.data.head_value,
        });
        setSlabStructureId(res.data.data.slab_structure_id);
        setCrumbs([
          { name: "Salary Master", link: "/SalaryMaster" },
          { name: "Slab Structure" },
          { name: "Update" },
        ]);
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
    if (name === "slabDefinationId") {
      await axios
        .get(`${ApiUrl}/getAllValues`)
        .then((res) => {
          const Ids = res.data.data.filter(
            (id) => id.slab_details_id === newValue
          );
          setSlabId(Ids);
          Ids.length > 0
            ? setValues({
                ...values,
                minimumAmount: Math.max(...Ids.map((fe) => fe.max_value)) + 1,
              })
            : setValues({
                ...values,
                minimumAmount: 0,
              });
        })
        .catch((err) => {
          console.error(err);
        });
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
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
    if (!requiredFieldsValid()) {
      console.log(checks);
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      console.log(checks);
      const temp = {};
      temp.active = true;
      temp.slab_details_id = values.slabDefinationId;
      temp.min_value = values.minimumAmount;
      temp.max_value = values.maximumAmount;
      temp.head_value = values.amount;

      await axios
        .post(`${ApiUrl}/SlabStructure`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Created Successfully",
            });
            navigate("/SalaryMaster", { replace: true });
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
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.slab_structure_id = slabStructureId;
      temp.slab_details_id = values.slabDefinationId;
      temp.min_value = values.minimumAmount;
      temp.max_value = values.maximumAmount;
      temp.head_value = values.amount;

      await axios
        .put(`${ApiUrl}/SlabStructure/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/SalaryMaster", { replace: true });
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
                <CustomAutocomplete
                  name="slabDefinationId"
                  label="Slab"
                  value={values.slabDefinationId}
                  options={slabDefinationOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  label="Minimum"
                  name="minimumAmount"
                  value={values.minimumAmount}
                  handleChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  label="Maximum"
                  name="maximumAmount"
                  value={values.maximumAmount}
                  handleChange={handleChange}
                  errors={errorMessages.maximumAmount}
                  checks={checks.maximumAmount}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  label="Amount"
                  name="amount"
                  value={values.amount}
                  handleChange={handleChange}
                  errors={errorMessages.amount}
                  checks={checks.amount}
                  required
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

              <Grid item xs={12} md={12}>
                <TableContainer
                  component={Paper}
                  className={classes.tableContainer}
                >
                  <Table>
                    <TableHead
                      sx={{
                        backgroundColor: (theme) => theme.palette.primary.main,
                      }}
                    >
                      <TableRow>
                        <TableCell>SL.No</TableCell>
                        <TableCell>Minimum</TableCell>
                        <TableCell>Maximum</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {slabId.map((val, i) => (
                        <>
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{val.min_value}</TableCell>
                            <TableCell>{val.max_value}</TableCell>
                            <TableCell>{val.head_value}</TableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default SlabStructureForm;
