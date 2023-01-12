import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initialValues = {
  roomType: "",
  noOfBeds: "",
  nomenclature: "",
};

const requiredFields = ["roomType", "noOfBeds", "nomenclature"];

function RoomTypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [RoomTypeId, setRoomTypeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    roomType: [values.roomType !== ""],
    nomenclature: [values.nomenclature !== ""],
    noOfBeds: [values.noOfBeds !== "", /^[0-9]*$/.test(values.noOfBeds)],
  };

  const errorMessages = {
    roomType: ["This field required"],
    nomenclature: ["This field required"],
    noOfBeds: ["This field is required", "Allow only Number"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/hostelmaster/roomtypes/new") {
      setIsNew(true);
      setCrumbs([
        { name: "HostelMaster", link: "/HostelMaster/RoomTypes" },
        { name: "RoomType" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getData();
    }
  }, [pathname]);

  const getData = async () => {
    await axios
      .get(`/api/hostel/HostelRoomType/${id}`)
      .then((res) => {
        setValues({
          roomType: res.data.data.roomType,
          nomenclature: res.data.data.nomenclature,
          noOfBeds: res.data.data.numberOfBeds,
        });
        setRoomTypeId(res.data.data.roomTypeId);
        setCrumbs([
          { name: "HostelMaster", link: "/HostelMaster/RoomTypes" },
          { name: "RoomType" },
          { name: "Update" },
          { name: res.data.data.roomType },
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
      temp.roomType = values.roomType;
      temp.nomenclature = values.nomenclature;
      temp.numberOfBeds = values.noOfBeds;

      await axios
        .post(`/api/hostel/HostelRoomType`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HostelMaster/RoomTypes", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
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
            message: err.response
              ? err.response.data.message
              : "An error occured",
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
      temp.roomTypeId = RoomTypeId;
      temp.roomType = values.roomType;
      temp.nomenclature = values.nomenclature;
      temp.numberOfBeds = values.noOfBeds;

      await axios
        .put(`/api/hostel/HostelRoomType/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HostelMaster/RoomTypes", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
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
            message: err.response
              ? err.response.data.message
              : "An error occured",
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
              name="roomType"
              label="Room Type"
              value={values.roomType}
              handleChange={handleChange}
              checks={checks.roomType}
              errors={errorMessages.roomType}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="noOfBeds"
              label="Number Of Beds"
              value={values.noOfBeds}
              handleChange={handleChange}
              checks={checks.noOfBeds}
              errors={errorMessages.noOfBeds}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="nomenclature"
              label="Nomenclature"
              value={values.nomenclature}
              handleChange={handleChange}
              checks={checks.nomenclature}
              errors={errorMessages.nomenclature}
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

export default RoomTypeForm;
