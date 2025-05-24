import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/TotalGridIndex.jsx";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography
} from "@mui/material";
import useAlert from "../../../hooks/useAlert.js";
import axios from "../../../services/Api.js";
import file from "../../../assets/laptopIssueCsvSample.csv";
import CSVPNG from "../../../assets/csvPng.png";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useNavigate } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper.jsx"));
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput.jsx")
);

const initialValues = {
  acYearId: null,
  academicYearOptions: [],
  attachment: null,
  rows: [],
  loading: false,
  isUploadModalOpen: false
};
const requiredAttachment = ["attachment"];

function LaptopIssueIndex() {
  const [{ acYearId, academicYearOptions, attachment, rows, isUploadModalOpen, loading }, setValues] = useState(initialValues);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getAcYear();
    getData();
  }, []);

  const columns = [
    {
      field: "grn_ref_no", headerName: "GRN Ref No.", flex: 1
    },
    {
      field: "po_ref_no",
      headerName: "PO Ref No.",
      flex: 1,
    },
    {
      field: "serialNo",
      headerName: "Serial No.",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "issue",
      headerName: "Issue",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => navigate("/laptop-issue-form", { state: params.row })}>
          <AddBoxIcon fontSize="small" color="primary" />
        </IconButton>
      ]
    }
  ];

   const getAcYear = async () => {
    try {
      const res = await axios.get(`/api/academic/academic_year`);
      if (res.status == 200 || res.status == 200) {
        setValues((prevState) => ({
          ...prevState,
          academicYearOptions: res.data.data.map((li) => ({ "value": li.ac_year_id, "label": li.ac_year }))
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const getData = async (acyearId=null) => {
    try {
      setLoading(true);
      const apiUrl= `/api/student/fetchAllLaptopIssue?page=0&page_size=100000000&sort=created_date`;
      const acYearUrl = `/api/student/fetchAllLaptopIssue?page=0&page_size=100000000&sort=created_date&ac_year_id=${acyearId}`
      const res = await axios.get(acyearId ? acYearUrl : apiUrl);
      if (res.status == 200 || res.status == 200) {
        setValues((prevState) => ({
          ...prevState,
          rows: res.data.data.Paginated_data.content,
          attachment: null
        }));
        setLoading(false)
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false)
    }
  };

  const setLoading = (val) => {
    setValues((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const handleFileDrop = (name, newFile) => {
    setValues((prev) => ({
      ...prev,
      [name]: newFile,
    }));
  };

  const errorAttachmentMessages = {
    attachment: [
      "This field is required",
      "Please upload csv file",
    ],
  };

  const checkAttachment = {
    attachment: [
      attachment !== "",
      attachment?.name?.endsWith(".csv")
    ],
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    getData(newValue)
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      attachment: null,
    }));
  };

  const handleUpload = () => {
    setValues((prevState) => ({
      ...prevState,
      isUploadModalOpen: !isUploadModalOpen
    }))
  };

  const isAttachmentValid = () => {
    for (let i = 0; i < requiredAttachment.length; i++) {
      const field = requiredAttachment[i];
      if (Object.keys(checkAttachment).includes(field)) {
        const ch = checkAttachment[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const onSubmit = async (fileAttachment) => {
    try {
      const formData = new FormData();
      formData.append("file", fileAttachment);
      const res = await axios.post(`api/student/laptopIssueCsvUpload`, formData);
      if (res.status == 200 || res.status == 201) {
        setAlertMessage({
          severity: "success",
          message: `Attachment uploaded successfully !!`,
        });
        setAlertOpen(true);
        handleUpload();
        getData()
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

    const generateCSV = () => {
      const link = document.createElement("a");
      link.href = file;
      link.download = "laptopIssuesamplecsv.csv";
      link.click();
    };

  return (
    <Box>
      <Grid container sx={{marginTop: { xs: 1, md: -6 }, display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="acYearId"
            label="Ac Year"
            options={academicYearOptions}
            value={acYearId}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            startIcon={<DriveFolderUploadIcon />}
            onClick={handleUpload}
            variant="contained"
            disableElevation
          >
            Upload
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ position: "relative", marginTop: { xs: 8, md: 2 } }}>
        <Box sx={{ position: "absolute", width: "100%" }}>
          <GridIndex rows={rows} columns={columns} loading={loading} />
        </Box>
      </Box>

      <ModalWrapper
        title="Laptop Issue File"
        maxWidth={500}
        open={isUploadModalOpen}
        setOpen={() => handleUpload()}
      >
        <Grid container sx={{display:"flex",justifyContent:"space-between"}}>
          <Grid item xs={7}>
            <CustomFileInput
              name="attachment"
              label="CSV File"
              helperText="CSV File"
              file={attachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checkAttachment.attachment}
              errors={errorAttachmentMessages.attachment}
              required
            />
          </Grid>
          <Grid item xs={5} align="right">
            <IconButton onClick={generateCSV}>
              <img src={CSVPNG} alt="sample" width="30px" height="30px"/>
              <Typography>Sample Download</Typography>
            </IconButton>
          </Grid>
          <Grid item mt={1} xs={12} textAlign="right">
            <Button
              onClick={() => onSubmit(attachment)}
              variant="contained"
              disableElevation
              disabled={!isAttachmentValid()}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
    </Box>
  );
}

export default LaptopIssueIndex;
