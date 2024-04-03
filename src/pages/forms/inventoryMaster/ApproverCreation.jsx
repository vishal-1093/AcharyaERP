import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomRadioButtons = lazy(() => import("../../../components/Inputs/CustomRadioButtons"));
const CustomAutocomplete = lazy(() => import("../../../components/Inputs/CustomAutocomplete"));

const initialValues = {
  userId: "",
  foodApprover: false,
  billApprover: false,
  travelIndent: false,
  purchaseApprover: false,
};
const requiredFields = ["userId"];

function ApproverCreation() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [approverId, setApproverId] = useState(null);
  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {};

  useEffect(() => {
    getUserDetails();
    if (pathname.toLowerCase() === "/approvercreation") {
      setIsNew(true);

      setCrumbs([{ name: "Approver Creation", link: "/ApproverIndex" }]);
    } else {
      setIsNew(false);
      getApproverData();
    }
  }, [pathname]);

  const getApproverData = async () => {
    await axios
      .get(`/api/getApproverCreationById/${id}`)
      .then((res) => {
        setValues({
          userId: res.data.data.user_id,
          foodApprover: res.data.data.food_approver,
          billApprover: res.data.data.bill_approver,
          travelIndent: res.data.data.travel_approver,
          purchaseApprover: res.data.data.purchase_approver,
        });
        setApproverId(res.data.data.approver_creation_id);
        setCrumbs([{ name: "Approver Update", link: "/ApproverIndex" }]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getUserDetails = async () => {
    await axios(`/api/UserAuthentication`)
      .then((res) => {
        const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.id, 
              label: obj.username
            })
          })

        setUserOptions(data);
      })
      .catch((err) => console.error(err));
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.user_id = values.userId;
      temp.active = true;
      temp.food_approver = values.foodApprover;
      temp.travel_approver = values.travelIndent;
      temp.bill_approver = values.billApprover;
      temp.purchase_approver = values.purchaseApprover;

      await axios
        .post(`/api/approverCreation`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/ApproverIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Created Successfully",
            });
          } else {
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.approver_creation_id = approverId;
      temp.user_id = values.userId;
      temp.active = true;
      temp.food_approver = values.foodApprover;
      temp.travel_approver = values.travelIndent;
      temp.bill_approver = values.billApprover;
      temp.purchase_approver = values.purchaseApprover;

      await axios
        .put(`/api/updateApproverCreation/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Updated Successfully",
            });
            navigate("/ApproverIndex", { replace: true });
          } else {
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
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="userId"
              label="Approvers"
              value={values.userId}
              options={userOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomRadioButtons
              name="foodApprover"
              label="Food Approver"
              value={values.foodApprover}
              items={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <CustomRadioButtons
              name="travelIndent"
              label="Travel Indent Approver"
              value={values.travelIndent}
              items={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomRadioButtons
              name="billApprover"
              label="Bill Approver"
              value={values.billApprover}
              items={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomRadioButtons
              name="purchaseApprover"
              label="Purchase Approver"
              value={values.purchaseApprover}
              items={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} align="right">
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

export default ApproverCreation;
