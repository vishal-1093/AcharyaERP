import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";

const initialValues = {
  admSubcategoryName: "",
  shortName: "",
  admissionCategoryId: [],
  boardId: "",
  approvedStatus: "No",
};
const requiredFields = [
  "admSubcategoryName",
  "shortName",
  "admissionCategoryId",
];

function AdmSubcategoryForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [admSubcategoryId, setAdmSubcategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [admCategoryOptions, setAdmCategoryOptions] = useState([]);
  const [boardOptions, setBoardOptions] = useState([]);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    admSubcategoryName: [
      values.admSubcategoryName !== "",
      /^[A-Za-z ]+$/.test(values.admSubcategoryName),
    ],
    shortName: [
      values.admSubcategoryName !== "",
      /^[A-Za-z ]{3}$/.test(values.shortName),
    ],
  };
  const errorMessages = {
    admSubcategoryName: ["This field required", "Enter Only Characters"],
    shortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
  };

  useEffect(() => {
    getFeeAdmissionCategory();
    getBoardData();
    if (
      pathname.toLowerCase() === "/admissionmaster/admissionsubcategory/new"
    ) {
      setIsNew(true);
      setCrumbs([
        { name: "AdmissionMaster", link: "/AdmissionMaster/Sub" },
        { name: "AdmissionSubCategory" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getAdmSubcategoryData();
    }
  }, [pathname]);

  const getAdmSubcategoryData = async () => {
    await axios
      .get(`/api/student/FeeAdmissionSubCategory/${id}`)
      .then((res) => {
        setValues({
          admSubcategoryName: res.data.data.fee_admission_sub_category_name,
          shortName: res.data.data.fee_admission_sub_category_short_name,
          admissionCategoryId: res.data.data.fee_admission_category_id,
          boardId: res.data.data.board_unique_id,
          approvedStatus: res.data.data.approve_intake ? "Yes" : "No",
        });
        setAdmSubcategoryId(res.data.data.fee_admission_sub_category_id);
        setCrumbs([
          { name: "AdmissionMaster", link: "/AdmissionMaster/Sub" },
          { name: "AdmissionSubCategory" },
          { name: "Update" },
          { name: res.data.data.fee_admission_sub_category_name },
        ]);
      })
      .catch((err) => console.error(err));
  };
  const getFeeAdmissionCategory = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        setAdmCategoryOptions(
          res.data.data.map((obj) => ({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getBoardData = async () => {
    await axios
      .get(`/api/student/Board`)
      .then((res) => {
        setBoardOptions(
          res.data.data.map((obj) => ({
            value: obj.board_unique_id,
            label: obj.board_unique_name,
          }))
        );
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
      temp.fee_admission_sub_category_name = values.admSubcategoryName;
      temp.fee_admission_sub_category_short_name =
        values.shortName.toUpperCase();
      temp.fee_admission_category_id = values.admissionCategoryId;
      temp.board_unique_id = values.boardId;
      temp.approve_intake = values.approvedStatus === "Yes" ? true : false;

      await axios
        .post(`/api/student/FeeAdmissionSubCategory`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AdmissionMaster/Sub", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Admission Subcategory Category Created",
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
      const temp = {};
      temp.active = true;
      temp.fee_admission_sub_category_id = admSubcategoryId;
      temp.fee_admission_sub_category_name = values.admSubcategoryName;
      temp.fee_admission_sub_category_short_name =
        values.shortName.toUpperCase();
      temp.fee_admission_category_id = values.admissionCategoryId;
      temp.board_unique_id = values.boardId;
      temp.approve_intake = values.approvedStatus === "Yes" ? true : false;

      await axios
        .put(`/api/student/FeeAdmissionSubCategory/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AdmissionMaster/Sub", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Admission Subcategory Category Updated",
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

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="admSubcategoryName"
              label="Admission Sub Category "
              value={values.admSubcategoryName}
              handleChange={handleChange}
              errors={errorMessages.admSubcategoryName}
              checks={checks.admSubcategoryName}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
                minLength: 3,
                maxLength: 3,
              }}
              errors={errorMessages.shortName}
              checks={checks.shortName}
              required
              disabled={!isNew}
            />
          </Grid>
          {isNew ? (
            <Grid item xs={12} md={6}>
              <CustomMultipleAutocomplete
                name="admissionCategoryId"
                label="Admission Category"
                value={values.admissionCategoryId}
                options={admCategoryOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="admissionCategoryId"
                label="Admission Category"
                value={values.admissionCategoryId}
                options={admCategoryOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="boardId"
              label="Board"
              value={values.boardId}
              options={boardOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="approvedStatus"
              label="Approved Intake"
              value={values.approvedStatus}
              items={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              handleChange={handleChange}
              required
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

export default AdmSubcategoryForm;
