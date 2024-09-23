import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import { makeStyles } from "@mui/styles";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import BedDetails from "./HostelBedDetails";
import BedStatus from "./BedStatus";

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
  acYearId: "",
  blockName: "",
  schoolId: "",
  feeTemplate: "",
  hostelFloorName: "",
};

const requiredFields = ["acYearId", "blockName", "schoolId", "feeTemplate"];
const occupancy = [
  { value: 1, label: "SINGLE OCCUPANCY" },
  { value: 2, label: "DOUBLE OCCUPANCY" },
  { value: 3, label: "TRIPLE OCCUPANCY" },
  { value: 4, label: "QUADRUPLE OCCUPANCY" },
  { value: 6, label: "SIXTAPLE OCCUPANCY" },
  { value: 7, label: "SEVEN OCCUPANCY" },
  { value: 8, label: "EIGHT OCCUPANCY" },
];
function HostelBedViewForm() {
  const classes = useStyles();
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [feeTemplate, setFeeTemplate] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [hostelFloors, setHostelFloors] = useState([]);
  const [bedDetails, setBedDetails] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const checks = {
    acYearId: [values.acYearId != ""],
    blockName: [values.blockName != ""],
    schoolId: [values.schoolId != ""],
  };

  const errorMessages = {
    acYearId: ["This field is required"],
    blockName: ["This field is required"],
    schoolId: ["This field is required"],
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
    } else {
      setIsNew(false);
    }
    getAcademicyear();
    getSchoolName();
  }, [id]);

  useEffect(() => {
    if (values?.schoolId) {
      getFeeTemplate();
    }
  }, [values?.schoolId]);

  useEffect(() => {
    if (values?.feeTemplate) {
      getHostelBlocks();
    }
  }, [values?.feeTemplate]);

  useEffect(() => {
    if (values?.blockName) {
      getHostelFloors();
    }
  }, [values?.blockName]);

  const getHostelFloors = async () => {
    try {
      const res = await axios.get(
        `/api/hostel/fetchFloorDetailsByBlockid/${values?.blockName}`
      );
      const floorData = res?.data?.data;
      const hostelFloors = Object.values(floorData)
        ?.flat()
        ?.map((floor) => ({
          value: floor.hostelFloorId,
          label: floor.floorName,
        }));

      setHostelFloors(hostelFloors);
    } catch (err) {
      console.error(err);
    }
  };

  const getSchoolName = async () => {
    await axios
      .get("/api/institute/school")
      .then((res) => {
        setSchoolOptions(
          res?.data?.data?.map((object) => ({
            value: object.school_id,
            label: object.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getAcademicyear = async () => {
    await axios
      .get("/api/academic/academic_year")
      .then((res) => {
        setAcademicYearOptions(
          res?.data?.data?.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getHostelBlocks = async () => {
    await axios
      .get(
        `/api/hostel/getHostelBlockDetailsByHostelFeeTemplate/${values?.feeTemplate}`
      )
      .then((res) => {
        const hostelBlocks = res?.data?.data?.map((obj) => ({
          value: obj.hostelBlockId,
          label: obj.blockName,
        }));
        setHostelBlocks(hostelBlocks);
      })
      .catch((err) => console.error(err));
  };

  const getFeeTemplate = async () => {
    try {
      const response = await axios.get(
        `/api/finance/hostelFeeTemplateByAcademicYearAndSchool/${values?.acYearId}/${values?.schoolId}`
      );
  
      const feeTemplate = response?.data?.data?.map((obj) => ({
        value: obj.hostel_fee_template_id,
        label: `${obj.template_name} - ${obj?.hostel_room_type_id} - ${obj?.total_amount}`,
        hostel_room_type_id: obj?.hostel_room_type_id,
      }));
  
      setFeeTemplate(feeTemplate);
    } catch (error) {
      console.error("Error fetching fee template:", error);
    }
  };
  

  const getBedDetials = async () => {
    const occupancyType = feeTemplate.find(
      (occupancy) => occupancy.value === values?.feeTemplate
    );
    await axios
      .get(
        `api/hostel/hostelBedsByHostelBlockAndFloor?${
          values?.blockName ? `hostelBlockId=${values?.blockName}` : ""
        }${
          values?.hostelFloorName
            ? `&hostelFloorId=${values?.hostelFloorName}`
            : ""
        }${
          occupancyType?.hostel_room_type_id
            ? `&roomTypeId=${occupancyType?.hostel_room_type_id}`
            : ""
        }`
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
        setCrumbs([
          {
            name: "Hostel Bed View",
            link: "/HostelBedViewMaster/HostelBedView",
          },
          { name: "Active Bed" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "acYearId" && {
        schoolId:"",
        feeTemplate: "",
        blockName: "",
        hostelFloorName: "",
      }),
      ...(name === "schoolId" && {
        feeTemplate: "",
        blockName: "",
        hostelFloorName: "",
      }),
      ...(name === "feeTemplate" && {
        blockName: "",
        hostelFloorName: "",
      }),
      ...(name === "blockName" && {
        hostelFloorName: "",
      }),
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
          <BedDetails
            bedDetails={bedDetails}
            selectedValues={values}
            getBedDetials={getBedDetials}
          />
        </>
      ) : (
        <Box component="form" onSubmit={(e) => handleSubmit(e)} noValidate>
          <FormWrapper>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
              {/* <Grid item xs={12} md={4}>
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
             ]}
             handleChange={handleChange}
             checks={checks.hostelType}
             errors={errorMessages.hostelType}
             required
           />
         </Grid> */}
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="acYearId"
                  label="Academic Year"
                  value={values.acYearId}
                  options={academicYearOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                  checks={checks.acYearId}
                  errors={errorMessages.acYearId}
                  // disabled={!isNew}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="schoolId"
                  label="School"
                  value={values.schoolId}
                  options={schoolOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  //   handleSelectAll={handleSelectAll}
                  //   handleSelectNone={handleSelectNone}
                  checks={checks.schoolId}
                  errors={errorMessages.schoolId}
                  disabled={!values?.acYearId}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="feeTemplate"
                  label="Fee Template"
                  value={values?.feeTemplate}
                  options={feeTemplate}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.feeTemplate}
                  errors={errorMessages.feeTemplate}
                  disabled={!values?.schoolId}
                  required
                />
              </Grid>
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
                  disabled={!values?.feeTemplate}
                  required
                  // disabled={!isNew}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="hostelFloorName"
                  label="Hostel Floor"
                  value={values.hostelFloorName}
                  options={hostelFloors}
                  handleChangeAdvance={handleChangeAdvance}
                  //   checks={checks.hostelFloorName}
                  //   errors={errorMessages.hostelFloorName}
                  //   required
                  disabled={!values?.blockName}
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

export default HostelBedViewForm;
