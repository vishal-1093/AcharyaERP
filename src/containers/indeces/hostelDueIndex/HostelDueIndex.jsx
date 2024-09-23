import React, { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Grid,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import useAlert from "../../../hooks/useAlert";
import GridIndex from "../../../components/GridIndex";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import { useNavigate } from "react-router-dom";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 270,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const initialValues = {
  acYearId: "",
};

function HostelDueIndex() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getData();
    getAcademicYearData();
  }, []);

  useEffect(() => {
    getData();
  }, [values?.acYearId]);

  const getAcademicYearData = async () => {
    try {
      const res = await axios.get("/api/academic/academic_year");
      const data = res.data.data.map((obj) => ({
        value: obj.ac_year_id,
        label: obj.ac_year,
      }));
      setAcademicYearOptions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/finance/getHostelDueReportByAcademicYearGroupedByBlock${
          values?.acYearId ? `?acYearId=${values?.acYearId}` : ""
        }`
      );
      const data = response.data.data;

      // Transform the data into an array format for the DataGrid
      const transformedRows = Object.keys(data).map((block, index) => ({
        id: data[block].hostelBedId,
        block: block,
        fixed: data[block].totalAmount,
        paid: data[block].totalPaidAmount,
        due: data[block].totalDueAmount,
      }));

      setRows(transformedRows);
    } catch (error) {
      setAlertMessage("Error fetching data");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const columns = [
    {
      field: "block",
      headerName: "Block",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip title={params?.row?.block?.toLowerCase() || ""}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "primary.main",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
            onClick={() =>
              navigate(`/HostelDueMaster/HostelDue/${params.row.id}`)
            }
          >
            {params?.row?.block?.toLowerCase() || "N/A"}
          </Typography>
        </HtmlTooltip>
      ),
    },
    { field: "fixed", headerName: "Fixed", flex: 1 },
    { field: "paid", headerName: "Paid", flex: 1 },
    {
      field: "due",
      headerName: "Due",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.due}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "primary.main",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
            onClick={() =>
              navigate(`/HostelDueMaster/HostelDue/${params.row.id}`)
            }
          >
            {params.row.due}
          </Typography>
        </HtmlTooltip>
      ),
    },
  ];

  const calculateTotal = (key) => {
    return rows.reduce((acc, row) => acc + row[key], 0);
  };

  const totalRow =
    rows.length > 0
      ? {
          id: rows.length + 1,
          block: "Total",
          fixed: calculateTotal("fixed"),
          paid: calculateTotal("paid"),
          due: calculateTotal("due"),
        }
      : null;

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Grid container rowSpacing={2} gap={2} justifyContent="flex-end">
        <Grid item xs={6} md={3} mb={3}>
          <CustomAutocomplete
            name="acYearId"
            label="Ac Year"
            value={values.acYearId}
            options={academicYearOptions}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid>
      </Grid>
      <Box>
        <GridIndex
          rows={totalRow ? [...rows, totalRow] : rows}
          columns={columns}
          totalRowStyle={
            totalRow
              ? {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                }
              : {}
          }
        />
      </Box>
    </>
  );
}

export default HostelDueIndex;
