import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import FormWrapper from "../../components/FormWrapper";
import axios from "../../services/Api";

const voucherList = [
  {
    label: "Journal Voucher",
    value: "Journal Voucher",
    link: "/journal-voucher",
  },
  {
    label: "Payment Voucher",
    value: "Payment Voucher",
    link: "/draft-payment-voucher",
  },
  { label: "Fund Transfer", value: "Fund Transfer", link: "/fund-transfer" },
  {
    label: "Contra Voucher",
    value: "Contra Voucher",
    link: "/contra-voucher",
  },
  { label: "Salary JV", value: "Salary Voucher", link: "/salary-voucher" },
  { label: "Consultant JV", value: "Consultant JV", link: "/consultant-voucher" },
];

const initialValues = { schoolId: null, voucher: "" };

function AccountVoucherMaster() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs([]);

  useEffect(() => {
    setCrumbs([]);
    getSchoolData();
  }, []);

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });

        setSchoolOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreate = () => {
    const selectedList = voucherList.find(
      (obj) => obj.value === values.voucher
    );

    navigate(`${selectedList.link}`, { state: { school_id: values.schoolId } });
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="voucher"
              label="Voucher"
              value={values.voucher}
              options={voucherList}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !values.schoolId || !values.voucher}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"SUBMIT"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default AccountVoucherMaster;
