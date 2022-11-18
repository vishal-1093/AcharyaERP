import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  reason: "",
  type: "",
};

const requiredFields = ["reason", "type"];

const FeeExcemptionForm = () => {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const checks = {
    reason: [values.reason !== ""],
    type: [values.type !== ""],
  };

  const errorMessages = {
    reason: ["This field required"],
    type: ["This field required"],
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

  useEffect(() => {
    if (
      pathname.toLowerCase() === "/candidatewalkinmaster/feeexcemptionform/new"
    ) {
      setIsNew(true);
      setCrumbs([
        { name: "CandidateWalkin Master", link: "/CandidateWalkinMaster" },
        { name: "Fee Excemption" },
      ]);
    } else {
      setIsNew(false);
      getData();
    }
  }, [pathname]);

  const getData = async () => {
    await axios
      .get(`${ApiUrl}/academic/ReasonFeeExcemption/${id}`)
      .then((res) => {
        console.log(res);
        setValues({
          reason: res.data.data.reasion_for_fee_exemption,
          type: res.data.data.exemption_status,
        });

        setCrumbs([
          { name: "CandidateWalkin Master ", link: "/CandidateWalkinMaster" },
          { name: "Fee Excemption" },
          { name: "Update" },
          { name: res.data.data.exemption_status },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.reasion_for_fee_exemption = values.reason;
      temp.exemption_status = values.type;
      await axios
        .post(`${ApiUrl}/academic/ReasonFeeExcemption`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form created successfully",
            });
            navigate("/CandidateWalkinMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.res ? err.res.data.message : "An error occured",
          });
          setAlertOpen(true);
        });
      console.log(temp);
    }
  };

  const handleUpdate = async () => {
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
      temp.reasion_for_fee_exemption = values.reason;
      temp.exemption_status = values.type;
      temp.fee_exemption_id = id;
      await axios
        .put(`${ApiUrl}/academic/ReasonFeeExcemption/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Data updated successfully",
            });
            navigate("/CandidateWalkinMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.res ? err.res.data.message : "An error occured",
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
            <Grid item xs={12} md={4}>
              <CustomRadioButtons
                name="type"
                label="Type"
                value={values.type}
                items={[
                  {
                    value: "reason",
                    label: "Exemption reason",
                  },
                  {
                    value: "exemption",
                    label: "Exemption Type",
                  },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="reason"
                label="Description"
                value={values.reason}
                handleChange={handleChange}
                checks={checks.reason}
                errors={errorMessages.reason}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} textAlign="right">
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
    </>
  );
};

export default FeeExcemptionForm;
