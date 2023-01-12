import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initValues = {
  name: "",
  email: "",
  type: "",
  mobileNumber: "",
  address: "",
  blockId: null,
  floorId: null,
};

const requiredFields = [
  "name",
  "email",
  "type",
  "mobileNumber",
  "address",
  "blockId",
];

function DoctorWardenForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [Names, setNames] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [wardenBlockOptions, setWardenBlockOptions] = useState([]);
  const [doctorBlockOptions, setDoctorBlockOptions] = useState([]);
  const [types, setTypes] = useState("");
  const [floorName, setFloorName] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    name: [values.name !== null],
    email: [
      values.email !== "",
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      ),
    ],
    type: [values.type !== ""],
    mobileNumber: [
      values.mobileNumber != "",
      /^[0-9]{10}$/.test(values.mobileNumber),
    ],
    address: [values.address !== ""],
    blockId: [values.blockId !== null],
    floorId: [values.floorId !== null],
  };

  const errorMessages = {
    name: ["This field required"],
    email: ["This field required", "Invalid email"],
    type: ["This field is required"],
    mobileNumber: ["This field is required", "Invalid phone"],
    address: ["This field is required"],
    blockId: ["This field is required"],
    floorId: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/hostelmaster/wardens/new") {
      setIsNew(true);
      setCrumbs([
        { name: "HostelMaster", link: "/HostelMaster/Wardens" },
        { name: "DoctorWarden" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getDoctorWardenData();
    }
  }, [pathname]);

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "blockId") {
      await axios
        .get(`/api/hostel/allUnassignedFloorsWithWarden/${newValue}`)
        .then((res) => {
          setFloorName(
            res.data.data.map((object) => ({
              value: object.hostel_floor_id,
              label: object.floor_name,
            }))
          );
        })
        .catch((err) => console.error(err));

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
    if (newValue === "Doctor") {
      setTypes(newValue);
      await axios
        .get(`/api/hostel/allUnassignedBlocksWithDoctor`)
        .then((res) => {
          setDoctorBlockOptions(
            res.data.data.map((obj) => ({
              value: obj.hostel_block_id,
              label: obj.block_name,
            }))
          );
        })
        .catch((err) => console.error(err));

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else if (newValue === "Warden") {
      await axios
        .get(`/api/hostel/allUnassignedBlocksWithWarden`)
        .then((res) => {
          setWardenBlockOptions(
            res.data.data.map((val) => ({
              value: val.hostel_block_id,
              label: val.block_name,
            }))
          );
        })
        .catch((err) => console.error(err));

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
      await axios
        .get(`/api/hostel/floorsAssignedToWarden/${values.name}`)
        .then((res) => {
          setTableData(res.data.data);
        })
        .catch((err) => console.error(err));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };
  useEffect(() => {
    getNames();
  }, []);

  const getNames = async () => {
    await axios.get(`/api/UserAuthentication`).then((res) => {
      setNames(
        res.data.data.map((obj) => ({
          value: obj.id,
          label: obj.username,
        }))
      ).catch((err) => console.error(err));
    });
  };

  const getDoctorWardenData = async () => {
    await axios
      .get(`/api/hostel/Doctor/${id}`)
      .then((res) => {
        setValues({
          name: res.data.data.username,
          email: res.data.data.email,
          type: res.data.data.doctorWardenType,
          mobileNumber: res.data.data.mobile,
          address: res.data.data.address,
          blockId: res.data.data.block_id,
          floorId: res.data.data.floor_id,
        });
        axios.get(`/api/getFloors/${res.data.data.block_id}`).then((res) => {
          setFloorName(
            res.data.data.map((object) => ({
              value: object.floor_id,
              label: object.floor_name,
            }))
          );
        });

        setCrumbs([
          { name: "HostelMaster", link: "/HostelMaster/Wardens" },
          { name: "DoctorWarden" },
          { name: "Update" },
          { name: res.data.data.name },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
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
      temp.user_id = values.name;
      temp.email = values.email;
      temp.doctorWardenType = values.type;
      temp.mobile = values.mobileNumber;
      temp.address = values.address;
      temp.hostel_block_id = values.blockId;
      temp.hostel_floor_id = values.floorId;

      await axios
        .post(`/api/hostel/Doctor`, temp)
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
          navigate("/HostelMaster/Wardens", { replace: true });
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
              <CustomAutocomplete
                name="name"
                label="Name"
                handleChangeAdvance={handleChangeAdvance}
                options={Names}
                value={values.name}
                checks={checks.name}
                errors={errorMessages.name}
                required
                disabled={!isNew}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                name="email"
                label="Email"
                value={values.email}
                handleChange={handleChange}
                checks={checks.email}
                errors={errorMessages.email}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="type"
                label="Type"
                value={values.type}
                options={[
                  { value: "Doctor", label: "Doctor" },
                  { value: "Warden", label: "Warden" },
                ]}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="mobileNumber"
                label="Phone Number"
                value={values.mobileNumber}
                handleChange={handleChange}
                checks={checks.mobileNumber}
                errors={errorMessages.mobileNumber}
                required
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
              <CustomAutocomplete
                name="blockId"
                label="Block Name"
                options={
                  types === "Doctor" ? doctorBlockOptions : wardenBlockOptions
                }
                handleChangeAdvance={handleChangeAdvance}
                value={values.blockId}
                checks={checks.blockId}
                errors={errorMessages.blockId}
                required
              />
            </Grid>
            {values.type === "Warden" ? (
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="floorId"
                  label="Floor Name"
                  options={floorName}
                  handleChangeAdvance={handleChangeAdvance}
                  value={values.floorId}
                  checks={checks.floorId}
                  errors={errorMessages.floorId}
                  required
                />
              </Grid>
            ) : (
              <></>
            )}

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
                    onClick={handleCreate}
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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Block Name</TableCell>
                <TableCell>Floor Name</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((val, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{val.username}</TableCell>
                    <TableCell>{val.doctorWardenType}</TableCell>
                    <TableCell>{val.block_name}</TableCell>
                    <TableCell>{val.floor_name}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default DoctorWardenForm;
