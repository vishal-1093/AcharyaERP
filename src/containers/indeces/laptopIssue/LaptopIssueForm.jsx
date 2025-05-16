import { useState, lazy, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import FormWrapper from "../../../components/FormWrapper.jsx";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput.jsx")
);

const yearSemLists = [
  { label: "1/1", value: "1/1" },
  { label: "1/2", value: "1/2" },
  { label: "2/3", value: "2/3" },
  { label: "2/4", value: "2/4" },
  { label: "3/5", value: "3/5" },
  { label: "3/6", value: "3/6" },
  { label: "4/7", value: "4/7" },
  { label: "4/8", value: "4/8" },
  { label: "5/9", value: "5/9" },
  { label: "5/10", value: "5/10" },
  { label: "6/11", value: "6/11" },
   { label: "6/12", value: "6/12" },
];

const initialState = {
  auid:"",
  StudentName: "",
  yearSem: "",
  yearSemList: yearSemLists,
  grnrefno: "",
  pono: "",
  sno: "",
  attachment:null,
  loading: false
};

const LaptopIssueForm = () => {
  const [
    {
      auid,
      StudentName,
      yearSem,
      yearSemList,
      grnrefno,
      sno,
      attachment,
      loading
    },
    setState,
  ] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Laptop Issue", link: "/laptop-issue" }
    ]);
  }, []);

  const handleChangeAdvance = (name, newValue) => {
      setState((prev) => ({
        ...prev,
        [name]: newValue,
      }));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: name == "auid" ? value.trim() : value,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    setState((prev) => ({
      ...prev,
      [name]: newFile,
    }));
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const errorAttachmentMessages = {
    attachment: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const checkAttachment = {
    attachment: [
      attachment !== "",
      attachment?.name?.endsWith(".pdf"),
      attachment?.size < 2000000,
    ],
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleSubmit = async () => {
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="auid"
              label="Auid"
              value={auid || ""}
              handleChange={handleChange}
              required
            />
          </Grid>

         <Grid item xs={12} md={4}>
            <CustomTextField
              name="studentName"
              label="Student Name"
              value={StudentName || ""}
              handleChange={handleChange}
              required
            />
          </Grid>
        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="yearSem"
            label="Year Sem"
            value={yearSem || ""}
            options={yearSemList || []}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
            <CustomTextField
              name="grnrefno"
              label="GRN Ref No."
              value={grnrefno || ""}
              handleChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="sno"
              label="Serial No."
              value={sno || ""}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomFileInput
              name="attachment"
              label="Pdf File Attachment"
              helperText="PDF - smaller than 2 MB"
              file={attachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checkAttachment.attachment}
              errors={errorAttachmentMessages.attachment}
              required
            />
          </Grid>
          <Grid
            item
            align="right"
            xs={12}
            md={12}
            sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{!!location.state ? "Update" : "Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
        </FormWrapper>
    </Box>
  );
};

export default LaptopIssueForm;
