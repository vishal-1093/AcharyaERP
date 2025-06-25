import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, Grid, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Visibility } from "@mui/icons-material";
import moment from "moment";
import useAlert from "../../hooks/useAlert";
import { Print } from "@mui/icons-material";
import { GenerateScholarshipApplication } from "../forms/candidateWalkin/GenerateScholarshipApplication";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";

const OverlayLoader = lazy(() => import("../../components/OverlayLoader"));

const breadCrumbsList = [{ name: "Approve Scholarship" }];
const initialValues = {
  schoolId: null,
  programId: null,
  programSpeId: null,
};
function ScholarshipApproverIndex() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(initialValues);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState();

  useEffect(() => {
    getData();
    getSchoolDetails()
    setCrumbs(breadCrumbsList);
  }, []);

  useEffect(() => {
    getProgram();
    getData();
  }, [values.schoolId]);

  useEffect(() => {
    getData();
  }, [values.programId]);

  const getData = async () => {
    const { schoolId, programId } = values;
    try {
      setIsLoading(true)
      const response = await axios.get(
        "/api/student/getIsVerifiedDataForIndex",
        {
          params: {
            page: 0, page_size: 10000, sort: "created_date",
            ...(schoolId && { school_id: schoolId }),
            ...(programId && {
              program_id: programData[values?.programId]?.program_id,
            }),
            ...(programId && { program_specialization_id: programId }),
          },
        }
      );
      setRows(response.data.data);
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false)
    }
  };
  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };
  const getProgram = async () => {
    const { schoolId } = values;
    if (!schoolId) return null;

    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
      );
      const optionData = [];
      const responseData = response.data;
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
        });
      });
      const programObject = responseData.reduce((acc, next) => {
        acc[next.program_specialization_id] = next;
        return acc;
      }, {});
      setProgramOptions(optionData);
      setProgramData(programObject);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the programs data",
      });
      setAlertOpen(true);
    }
  };
  const handleDownload = async (obj) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/ScholarshipAttachmentFileviews?fileName=${obj}`,
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      window.open(url);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to download the document !!",
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePrint = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "/api/student/getStudentDetailsBasedOnAuidAndStrudentId",
        { params: { auid: data.auid } }
      );
      const studentData = response.data.data[0];

      const schResponse = await axios.get(
        `/api/student/fetchScholarship2/${data.scholarship_id}`
      );
      const schData = schResponse.data.data[0];

      const blobFile = await GenerateScholarshipApplication(
        studentData,
        schData
      );

      if (blobFile) {
        window.open(URL.createObjectURL(blobFile));
      } else {
        setAlertMessage({
          severity: "error",
          message: "Failed to generate scholarship application print !!",
        });
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to generate scholarship application print !!",
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      hideable: false,
    },
    {
      field: "requested_by",
      headerName: "Requested By",
      flex: 1,
      hide: true,
    },
    {
      field: "requested_date",
      headerName: "Requested Date",
      flex: 1,
      hide: true,
      renderCell: (params) =>
        moment(params.row.requested_date).format("DD-MM-YYYY LT"),
    },
    {
      field: "requested_scholarship",
      headerName: "Requested Amount",
      flex: 1,
    },
    {
      field: "verified_name",
      headerName: "Verified By",
      flex: 1,
      hide: true,
    },
    {
      field: "verified_date",
      headerName: "Verified Date",
      flex: 1,
      hide: true,
      renderCell: (params) =>
        moment(params.row.verified_date).format("DD-MM-YYYY LT"),
    },
    {
      field: "verified_amount",
      headerName: "Verified Amount",
      flex: 1,
    },
    {
      field: "verifier_remarks",
      headerName: "Verifier Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "scholarship_attachment_path",
      headerName: "Document",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDownload(params.row.scholarship_attachment_path)}
          sx={{ padding: 0 }}
        >
          <Visibility color="primary" sx={{ fontSize: 20 }} />
        </IconButton>
      ),
    },
    {
      field: "id",
      headerName: "Application Print",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleGeneratePrint(params.row)}
          sx={{ padding: 0 }}
        >
          <Print color="primary" />
        </IconButton>
      ),
    },
    {
      field: "is_approved",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          label="Result"
          color="primary"
          onClick={() =>
            navigate(
              `/ScholarshipApproverForm/${params.row.auid}/${params.row.scholarship_id}`
            )
          }
          sx={{ padding: 0 }}
        >
          <AddBoxIcon />
        </IconButton>
      ),
    },
  ];
  const handleChangeAdvance = async (name, newValue, rowValues) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "schoolId" && { programId: "", categoryId: "" }),
      ...(name === "programId" && { categoryId: "" }),
    }));
  };
  return isLoading ? (
    <OverlayLoader />
  ) : (
    <>
      <Box>
        <Grid container alignItems="center" justifyContent="flex-start" mb={2} sx={{ display: "flex", gap: "20px" }}>

          <Grid item xs={12} md={2.5}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={12} md={2.5}>
            <CustomAutocomplete
              name="programId"
              label="Program"
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
              value={values.programId}
              disabled={!values.schoolId}
            />
          </Grid>


        </Grid>
      </Box>
      <GridIndex rows={rows} columns={columns} />
    </>
  );
}

export default ScholarshipApproverIndex;
