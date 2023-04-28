import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initValues = {
  blockName: "",
  shortName: "",
  totalNoOfFloors: "",
  remarks: "",
  type: "",
  address: "",
};

const requiredFields = [
  "blockName",
  "shortName",
  "totalNoOfFloors",
  "remarks",
  "type",
  "address",
];

function HostelBlockForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [blockId, setBlockId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    blockName: [values.blockName !== ""],
    shortName: [values.shortName !== ""],
    totalNoOfFloors: [
      values.totalNoOfFloors !== "",
      values.totalNoOfFloors <= 9,
      /^[0-9]*$/.test(values.totalNoOfFloors),
    ],
    address: [values.address !== ""],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    blockName: ["This field required"],
    shortName: ["This field required"],
    totalNoOfFloors: [
      "This field required",
      "total floors less than or equals to 9",
      "Allow Only Number",
    ],
    type: [values.type !== ""],
    address: [values.address !== ""],
    remarks: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/hostelmaster/blocks/new") {
      setIsNew(true);
      setCrumbs([
        { name: "HostelMaster", link: "/HostelMaster/Blocks" },
        { name: "Block" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getBlockData();
    }
  }, [pathname]);

  const getBlockData = async () => {
    await axios
      .get(`/api/hostel/HostelBlocks/${id}`)
      .then((res) => {
        setValues({
          blockName: res.data.data.blockName,
          shortName: res.data.data.blockShortName,
          totalNoOfFloors: res.data.data.totalFloors,
          remarks: res.data.data.remarks,
          address: res.data.data.address,
          type: res.data.data.hostelType,
        });
        setBlockId(res.data.data.hostelBlockId);
        setCrumbs([
          { name: "HostelMaster", link: "/HostelMaster/Blocks" },
          { name: "Block" },
          { name: "Update" },
          { name: res.data.data.blockName },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
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
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.blockName = values.blockName;
      temp.blockShortName = values.shortName;
      temp.hostelType = values.type;
      temp.totalFloors = values.totalNoOfFloors;
      temp.address = values.address;
      temp.remarks = values.remarks;

      await axios
        .post(`/api/hostel/HostelBlocks`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/HostelMaster/Blocks", { replace: true });
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.hostelBlockId = blockId;
      temp.blockName = values.blockName;
      temp.blockShortName = values.shortName;
      temp.address = values.address;
      temp.remarks = values.remarks;
      temp.totalFloors = values.totalNoOfFloors;
      temp.hostelType = values.type;

      await axios
        .put(`/api/hostel/HostelBlocks/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/HostelMaster/Blocks", { replace: true });
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
  return (
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
              name="blockName"
              label="Block Name"
              value={values.blockName}
              handleChange={handleChange}
              checks={checks.blockName}
              errors={errorMessages.blockName}
              required
              fullWidth
              disabled={!isNew}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              inputProps={{
                style: { textTransform: "uppercase" },
                minLength: 1,
                maxLength: 3,
              }}
              value={values.shortName}
              handleChange={handleChange}
              checks={checks.shortName}
              errors={errorMessages.shortName}
              required
              disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="type"
              options={[
                { value: "Boys", label: "Boys" },
                { value: "Girls", label: "Girls" },
              ]}
              handleChangeAdvance={handleChangeAdvance}
              label="Hostel Type"
              value={values.type}
              checks={checks.type}
              errors={errorMessages.type}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="totalNoOfFloors"
              label="Total no of Floors"
              value={values.totalNoOfFloors}
              handleChange={handleChange}
              checks={checks.totalNoOfFloors}
              errors={errorMessages.totalNoOfFloors}
              required
              disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              rows={2}
              multiline
              name="address"
              label="Address"
              value={values.address}
              handleChange={handleChange}
              checks={checks.address}
              errors={errorMessages.address}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              rows={2}
              multiline
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              checks={checks.remarks}
              errors={errorMessages.remarks}
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
  );
}

export default HostelBlockForm;
