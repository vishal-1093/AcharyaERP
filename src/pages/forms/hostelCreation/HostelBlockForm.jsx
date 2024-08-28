import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  blockName: "",
  blockShortName: "",
  doctorsName: "",
  hostelType: "",
  wardensId: "",
  totalFloors: "",
  address: "",
  // active: true,
};

const requiredFields = [
  "blockName",
  "blockShortName",
  "doctorsName",
  "hostelType",
  "wardensId",
  "totalFloors",
  "address",
];

function HostelBlockForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [wardensName, setWardensName] = useState([]);
  const [blockDetails, setBlockDetails] = useState();


  const checks = {
    blockName: [values.blockName !== "", /^[A-Za-z ]+$/.test(values.blockName)],
    blockShortName: [
      values.blockShortName !== "",
      /^[A-Za-z ]{3,3}$/.test(values.blockShortName),
    ],
    doctorsName: [
      values.doctorsName !== "",
      /^[A-Za-z ]+$/.test(values.doctorsName),
    ],
    hostelType: [values.hostelType !== ""],
    wardensId: [values.wardensId !== null],
    totalFloors: [values.totalFloors !== ""],
    address: [values.address !== ""],
  };

  const errorMessages = {
    blockName: ["This field is required", "Enter only characters"],
    blockShortName: [
      "This field is required",
      "Enter characters and its length should be three",
    ],
    doctorsName: ["This field is required", "Enter only characters"],
    hostelType: ["This field is required"],
    wardensId: ["This field is required"],
    totalFloors: ["This field is required"],
    address: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/hostelcreationmaster/hostelblock/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Hostel Master", link: "/HostelCreationMaster/HostelBlock" },
        { name: "Hostel Block" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getHostelBlockData();
    }
    getUserDetails();
  }, [pathname]);

  const getUserDetails = async () => {
    await axios
      .get(`/api/staffUserDetails`)
      .then((res) => {
        const userData = res.data.data.map((obj) => ({
          value: obj.id,
          label: obj.username,
        }));
        setWardensName(userData);
      })
      .catch((err) => console.error(err));
  };

  const getHostelBlockData = async () => {
    await axios
      .get(`/api/hostel/HostelBlocks/${id}`)
      .then((res) => {
        const data = res.data.data;
        setBlockDetails(data);
        setValues({
          blockName: data.blockName,
          blockShortName: data.blockShortName,
          doctorsName: data.doctorsName,
          hostelType: data.hostelType,
          wardensId: data.wardensId,
          totalFloors: data.totalFloors,
          address: data.address,
          active: data.active,
        });
        setCrumbs([
          { name: "Hostel Master", link: "/HostelCreationMaster/HostelBlock" },
          { name: "Hostel Block" },
          { name: "Update" },
          { name: data.blockName },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === "totalFloors" && blockDetails?.totalFloors > value) {
      setAlertMessage({
        severity: "error",
        message:
          "The value of TotalFloors must be greater than the previous TotalFloors value.",
      });
      setAlertOpen(true);
    }
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {
        blockName: values.blockName,
        blockShortName: values.blockShortName.toUpperCase(),
        doctorsName: values.doctorsName,
        hostelType: values.hostelType,
        wardensId: values.wardensId,
        totalFloors: values.totalFloors,
        address: values.address,
        active: true,
      };

      await axios
        .post(`/api/hostel/HostelBlocks`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HostelCreationMaster/HostelBlock", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Hostel Block created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occurred",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occurred",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (blockDetails?.totalFloors > Number(values?.totalFloors)) {
      setAlertMessage({
        severity: "error",
        message:
          "The value of TotalFloors must be greater than the previous TotalFloors value.",
      });
      setAlertOpen(true);
      return;
    }
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {
        hostelBlockId: id,
        blockName: values.blockName,
        blockShortName: values.blockShortName.toUpperCase(),
        doctorsName: values.doctorsName,
        hostelType: values.hostelType,
        wardensId: values.wardensId,
        totalFloors: values.totalFloors,
        address: values.address,
        active: values.active,
      };

      await axios
        .put(`/api/hostel/HostelBlocks/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HostelCreationMaster/HostelBlock", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Hostel Block Updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occurred",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occurred",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="blockName"
              label="Block Name"
              value={values.blockName}
              handleChange={handleChange}
              checks={checks.blockName}
              errors={errorMessages.blockName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="blockShortName"
              label="Block Short Name"
              value={values.blockShortName.toUpperCase()}
              handleChange={handleChange}
              inputProps={{
                minLength: 3,
                maxLength: 3,
              }}
              checks={checks.blockShortName}
              errors={errorMessages.blockShortName}
              required
              disabled={!isNew}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="doctorsName"
              label="Doctors Name"
              value={values.doctorsName}
              handleChange={handleChange}
              checks={checks.doctorsName}
              errors={errorMessages.doctorsName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              name="hostelType"
              label="Hostel Type"
              value={values.hostelType}
              items={[
                {
                  value: "Male",
                  label: "Male",
                },
                {
                  value: "Female",
                  label: "Female",
                },
                {
                  value: "Common",
                  label: "Common",
                },
              ]}
              handleChange={handleChange}
              checks={checks.hostelType}
              errors={errorMessages.hostelType}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="wardensId"
              label="Warden Name"
              value={values.wardensId}
              options={wardensName}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.wardensId}
              errors={errorMessages.wardensId}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="totalFloors"
              label="Total Floors"
              value={values.totalFloors}
              handleChange={handleChange}
              checks={checks.totalFloors}
              errors={errorMessages.totalFloors}
              required
              inputProps={{
                type: "number",
                min: 0,
              }}
              // disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="address"
              label="Address"
              value={values.address}
              handleChange={handleChange}
              checks={checks.address}
              errors={errorMessages.address}
              required
            />
          </Grid>
          {/* <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.active}
                  onChange={handleChange}
                  name="active"
                  color="primary"
                />
              }
              label="Active"
            />
          </Grid> */}

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
                  color="inherit"
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

export default HostelBlockForm;
