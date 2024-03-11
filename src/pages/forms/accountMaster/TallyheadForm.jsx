import { lazy, useEffect, useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const CustomTextField = lazy(() => import("../../../components/Inputs/CustomTextField"));
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));

const initialValues = {
  tallyHead: "",
  remarks: "",
};

const requiredFields = ["tallyHead", "remarks"];

function TallyheadForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [tallyId, setTallyId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    tallyHead: [values.tallyHead !== "", /^[A-Za-z ]+$/.test(values.tallyHead)],
    remarks: [values.remarks !== ""],
  };
  const errorMessages = {
    tallyHead: ["This field required", "Enter Only Characters"],
    remarks: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/accountmaster/tallyhead/new") {
      setIsNew(true);

      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster/Tallyhead" },
        { name: "Tallyhead" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getTallyheadData();
    }
  }, []);

  const getTallyheadData = async () => {
    await axios
      .get(`/api/finance/TallyHead/${id}`)
      .then((res) => {
        setValues({
          tallyHead: res.data.data.tally_fee_head,
          remarks: res.data.data.remarks,
        });
        setTallyId(res.data.data.tally_id);
        setCrumbs([
          { name: "AccountMaster", link: "AccountMaster/Tallyhead" },
          { name: "Tallyhead" },
          { name: "Update" },
          { name: res.data.data.tally_fee_head },
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
        message: "Please fill required fields",
      });

      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.tally_fee_head = values.tallyHead;
      temp.remarks = values.remarks;
      await axios
        .post(`/api/finance/TallyHead`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster/Tallyhead", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Tallyhead Created",
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
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.tally_id = tallyId;
      temp.tally_fee_head = values.tallyHead;
      temp.remarks = values.remarks;
      await axios
        .put(`/api/finance/TallyHead/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AccountMaster/Tallyhead", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Ledger updated",
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
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
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
              name="tallyHead"
              label="Tally Head"
              value={values.tallyHead}
              handleChange={handleChange}
              errors={errorMessages.tallyHead}
              checks={checks.tallyHead}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              multiline
              rows={4}
              label="Remarks"
              name="remarks"
              value={values.remarks}
              handleChange={handleChange}
              errors={errorMessages.remarks}
              checks={checks.remarks}
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

export default TallyheadForm;
