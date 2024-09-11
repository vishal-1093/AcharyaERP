import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import { makeStyles } from "@mui/styles";
import BedStatus from "./BedStatus";
import AllBedDetails from "./AllHostelBedDetails";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 800,
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
    "& th": {
      color: theme.palette.common.white,
      fontWeight: "bold",
      textAlign: "center",
    },
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tableCell: {
    fontSize: "1rem",
    textAlign: "center",
  },
  actionsCell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addRowButton: {
    margin: theme.spacing(2, 0),
    display: "flex",
    justifyContent: "center",
  },
}));

const initialValues = {
  occupancyType: "",
  blockName: "",
};

const requiredFields = ["blockName"];
const occupancy = [
  { value: 1, label: "SINGLE OCCUPANCY" },
  { value: 2, label: "DOUBLE OCCUPANCY" },
  { value: 3, label: "TRIPLE OCCUPANCY" },
  { value: 4, label: "QUADRUPLE OCCUPANCY" },
  { value: 6, label: "SIXTAPLE OCCUPANCY" },
  { value: 7, label: "SEVEN OCCUPANCY" },
  { value: 8, label: "EIGHT OCCUPANCY" },
];
function HostelBedForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [bedDetails, setBedDetails] = useState({});
  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const checks = {
    blockName: [values.blockName != ""],
  };

  const errorMessages = {
    blockName: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/hostelbedviewmaster/hostelbedview/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "Hostel Bed View",
          link: "/HostelBedViewMaster/HostelBedView",
        },
        { name: "Active Bed" },
        { name: "Create" },
      ]);
    } else if (
      pathname.toLowerCase() === "/allhostelbedviewmaster/allhostelbedview/new"
    ) {
      setIsNew(true);
      setCrumbs([
        {
          name: "All Hostel Bed View",
          link: "/AllHostelBedViewMaster/AllHostelBedView",
        },
        { name: "Active Bed" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
    }
    getHostelBlocks();
  }, [id]);

  const getHostelBlocks = async () => {
    await axios
      .get(`/api/hostel/HostelBlocks`)
      .then((res) => {
        const hostelBlocks = res?.data?.data?.map((obj) => ({
          value: obj.hostelBlockId,
          label: obj.blockName,
        }));
        setHostelBlocks(hostelBlocks);
      })
      .catch((err) => console.error(err));
  };

  const getBedDetials = async () => {
    await axios
      .get(
        `/api/hostel/hostelBedsByHostelBlockId?hostelBlockId=${
          values.blockName
        }${values?.occupancyType ? `&roomTypeId=${values?.occupancyType}` : ""}`
      )
      .then((res) => {
        if (Object.keys(res.data.data).length === 0) {
          setAlertMessage({
            severity: "error",
            message: "No Data Found",
          });
          setAlertOpen(true);
        }
        setBedDetails(res?.data?.data);
        if (
          pathname.toLowerCase() ===
          "/allhostelbedviewmaster/allhostelbedview/new"
        ) {
          setCrumbs([
            {
              name: "All Hostel Bed View",
              link: "/AllHostelBedViewMaster/AllHostelBedView",
            },
            { name: "Active Bed" },
            { name: "Create" },
          ]);
        } else {
          setCrumbs([
            {
              name: "Hostel Bed View",
              link: "/HostelBedViewMaster/HostelBedView",
            },
            { name: "Active Bed" },
          ]);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "blockName" && { occupancyType: "" }),
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
      getBedDetials();
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNew) {
      handleCreate();
    } else {
      handleUpdate();
    }
  };

  return (
    <>
      {bedDetails && Object.keys(bedDetails)?.length > 0 ? (
        <>
          <BedStatus />
          <AllBedDetails
            bedDetails={bedDetails}
            selectedValues={values}
            getBedDetials={getBedDetials}
          />
        </>
      ) : (
        <Box component="form" onSubmit={(e) => handleSubmit(e)} noValidate>
          <FormWrapper>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="blockName"
                  label="Block Name"
                  value={values.blockName}
                  options={hostelBlocks}
                  handleChangeAdvance={handleChangeAdvance}
                  //   handleSelectAll={handleSelectAll}
                  //   handleSelectNone={handleSelectNone}
                  checks={checks.blockName}
                  errors={errorMessages.blockName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="occupancyType"
                  label="Occupancy Type"
                  value={values.occupancyType}
                  options={occupancy}
                  handleChangeAdvance={handleChangeAdvance}
                />
              </Grid>
            </Grid>
          </FormWrapper>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              // navigate("/payreportPdf", { state: { rowdata, values, empId } });
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isNew ? (
                "Submit"
              ) : (
                "Update"
              )}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default HostelBedForm;
