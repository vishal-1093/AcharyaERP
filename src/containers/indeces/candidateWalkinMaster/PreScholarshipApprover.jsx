import { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import { Link } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const PreScholarshipApprover = () => {
  const [rows, setRows] = useState([]);

  const columns = [{ field: "id", headerName: "Candidate Id", flex: 1 }];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `${ApiUrl}/student/Scholarship?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };
  return <>dd</>;
};

export default PreScholarshipApprover;
