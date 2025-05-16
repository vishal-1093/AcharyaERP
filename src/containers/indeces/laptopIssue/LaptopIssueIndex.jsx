import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/TotalGridIndex.jsx";
import {
  Box,
  Button,
  Grid,
  IconButton
} from "@mui/material";
import useAlert from "../../../hooks/useAlert.js";
import axios from "../../../services/Api.js";
import AddBoxIcon from '@mui/icons-material/AddBox';
import moment from "moment";
import { useNavigate } from "react-router-dom";
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper.jsx"));
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput.jsx")
);

const initialValues = {
  attachment: null,
  rows:[]
};
const requiredAttachment = ["attachment"];

function LaptopIssueIndex() {
  const [{attachment,rows}, setValues] = useState(initialValues);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(()=>{
    getData()
  },[])

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
      type:"actions",
      getActions: (params) => [
        <IconButton onClick={()=>navigate("/laptop-issue-form")}>
          <AddBoxIcon fontSize="small" color="primary" />
        </IconButton>
      ]
    }
  ];

  const setLoading = (val) => {
    setValues((prevState)=>({
      ...prevState,
      loading:val
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
      "Please upload a csv",
      "Maximum size 2 MB",
    ],
  };

  const checkAttachment = {
    attachment: [
      attachment !== "",
      attachment?.name?.endsWith(".csv"),
      attachment?.size < 2000000,
    ],
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
     attachment : null,
    }));
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
          message: `Laptop issue attachment uploaded successfully !!`,
        });
        setAlertOpen(true);
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

  const getData = async () => {
    try {
      const res = await axios.get(`/api/student/fetchAllLaptopIssue?page=0&page_size=100000000&sort=created_date`);
      if (res.status == 200 || res.status == 200) {
        setValues((prevState) => ({
          ...prevState,
          rows: res.data.data.Paginated_data.content,
          attachment: null
        }))
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

  return (
    <Box>
      <Grid container sx={{ display: "flex",alignItems:"flex-end", justifyContent: "flex-end", gap: "10px", marginTop: { xs: 2, md: -5 } }}>
        <Grid item xs={12} md={2}>
          <CustomFileInput
            name="attachment"
            label="CSV File Attachment"
            helperText="CSV - smaller than 2 MB"
            file={attachment}
            handleFileDrop={handleFileDrop}
            handleFileRemove={handleFileRemove}
            checks={checkAttachment.attachment}
            errors={errorAttachmentMessages.attachment}
            required
          />
        </Grid>
        <Grid xs={12} md={1} align="end">
          <Button
            onClick={()=>onSubmit(attachment)}
            variant="contained"
            disableElevation
            disabled={!isAttachmentValid()}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ position: "relative", marginTop: { xs: 8, md: 1 }}}>
        <Box sx={{ position: "absolute", width: "100%" }}>
          <GridIndex rows={rows} columns={columns}/>
        </Box>
      </Box>
    </Box>
  );
}

export default LaptopIssueIndex;
