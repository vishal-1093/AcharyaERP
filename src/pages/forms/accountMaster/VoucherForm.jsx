import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  voucherHead: "",
  shortName: "",
  isCommon: false,
  salaries: false,
};

const requiredFields = ["voucherHead", "shortName"];

function VoucherForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [voucherId, setVoucherId] = useState(null);

  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    voucherHead: [values.voucherHead !== ""],
    shortName: [values.shortName !== ""],
  };
  const errorMessages = {
    voucherHead: ["This field is required"],
    shortName: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/accountmaster/voucher/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster/Voucherhead" },
        { name: "Voucher" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getData();
    }
  }, [pathname]);

  const getData = async () => {
    await axios
      .get(`/api/finance/VoucherHeadNew/${id}`)
      .then((res) => {
        const data = res.data.data;
        setValues({
          voucherHead: data.voucher_head,
          shortName: data.voucher_head_short_name,
          id: data.voucher_head_new_id,
          isCommon: data.is_common,
          salaries: data.is_salaries,
        });
        setVoucherId(data.voucher_head_new_id);
        setCrumbs([
          { name: "AccountMaster", link: "/AccountMaster/Voucherhead" },
          { name: "Voucher" },
          { name: "Update" },
          { name: data.voucher_head },
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.voucher_head = values.voucherHead;
      temp.voucher_head_short_name = values.shortName;
      temp.is_common = values.isCommon;
      temp.is_salaries = values.salaries;

      await axios
        .post(`/api/finance/VoucherHeadNew`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster/Voucherhead", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Voucher Created",
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

  const handleUpdate = async (e) => {
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
      temp.voucher_head = values.voucherHead;
      temp.voucher_head_short_name = values.shortName;
      temp.voucher_head_new_id = voucherId;
      temp.is_common = values.isCommon;
      temp.is_salaries = values.salaries;

      await axios
        .put(`/api/finance/VoucherHeadNew/${voucherId}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster/Voucherhead", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Voucher Updated",
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
          console.error(error);
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
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="voucherHead"
                label="Voucher Head"
                value={values.voucherHead}
                handleChange={handleChange}
                errors={errorMessages.voucherHead}
                checks={checks.voucherHead}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="shortName"
                label="Short Name"
                value={values.shortName}
                handleChange={handleChange}
                errors={errorMessages.shortName}
                checks={checks.shortName}
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <CustomRadioButtons
                name="isCommon"
                label="Is Common"
                value={values.isCommon}
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
                name="salaries"
                label="Is Salaries"
                value={values.salaries}
                items={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                textAlign="right"
              >
                <Grid item xs={4} md={2}>
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
export default VoucherForm;
