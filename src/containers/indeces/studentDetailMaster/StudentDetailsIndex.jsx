import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, IconButton, Typography } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { maskMobile } from "../../../utils/MaskData";
import ModalWrapper from "../../../components/ModalWrapper";
import AssignUsnForm from "../../../pages/forms/studentMaster/AssignUsnForm";
import moment from "moment";

const initialValues = { acyearId: null };

const breadCrumbsList = [
  { name: "Student Master" },
  { name: "Inactive Students" },
];

function StudentDetailsIndex() {
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 100,
    total: 0,
  });
  const [filterString, setFilterString] = useState("");
  const [usnModal, setUsnModal] = useState(false);
  const [rowData, setRowData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getAcademicYears();
    setCrumbs(breadCrumbsList);
  }, []);

  useEffect(() => {
    getData();
  }, [
    paginationData.page,
    paginationData.pageSize,
    filterString,
    values.acyearId,
  ]);

  const getAcademicYears = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const optionData = [];
      const ids = [];
      response.data.data.forEach((obj) => {
        optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        ids.push(obj.current_year);
      });
      const latestYear = Math.max(...ids);
      const latestYearId = response.data.data.filter(
        (obj) => obj.current_year === latestYear
      );
      setAcademicYearOptions(optionData);
      setValues((prev) => ({
        ...prev,
        acyearId: latestYearId[0].ac_year_id,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
  };

  const getData = async () => {
    const { acyearId } = values;
    const { page, pageSize } = paginationData;

    if (!acyearId) return;

    try {
      setPaginationData((prev) => ({
        ...prev,
        loading: true,
      }));
    } catch (err) {}

    if (values.acyearId) {
      try {
        setPaginationData((prev) => ({
          ...prev,
          loading: true,
        }));

        const response = await axios.get("/api/student/studentDetailsIndex", {
          params: {
            page,
            page_size: pageSize,
            sort: "created_date",
            ac_year_id: acyearId,
            ...(filterString && { keyword: filterString }),
          },
        });

        console.log(response);

        // getAllRecords(response.data.data.Paginated_data.totalElements);

        const { content, totalElements } = response.data.data.Paginated_data;

        setPaginationData((prev) => ({
          ...prev,
          rows: content,
          total: totalElements,
          loading: false,
        }));
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unknown error occurred";
        setAlertMessage({
          severity: "error",
          message: errorMessage,
        });
        setAlertOpen(true);

        setPaginationData((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleOnPageChange = (newPage) => {
    setPaginationData((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleOnPageSizeChange = (newPageSize) => {
    setPaginationData((prev) => ({
      ...prev,
      pageSize: newPageSize,
    }));
  };

  const handleOnFilterChange = (value) => {
    setFilterString(
      value.items.length > 0
        ? value.items[0].value === undefined
          ? ""
          : value.items[0].value
        : value.quickFilterValues.join(" ")
    );
  };

  const handleUpdateUsn = (data) => {
    setRowData(data);
    setUsnModal(true);
  };

  const columns = [
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params.value.toLowerCase()}
        </Typography>
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1 },
    {
      field: "usn",
      headerName: "USN",
      flex: 1,
      renderCell: (params) =>
        params.value === null ? (
          <IconButton
            color="primary"
            onClick={() => handleUpdateUsn(params.row)}
            sx={{ padding: 0 }}
          >
            <AddBoxIcon />
          </IconButton>
        ) : (
          <Typography
            variant="subtitle2"
            onClick={() => handleUpdateUsn(params.row)}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "primary.main",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {params.value}
          </Typography>
        ),
    },
    {
      field: "application_no_npf",
      headerName: "Application No.",
      flex: 1,
      hide: true,
    },
    {
      field: "acharya_email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      renderCell: (params) => (params.value ? maskMobile(params.value) : ""),
    },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.program_short_name} - ${params.row.program_specialization_short_name}`,
    },
    {
      field: "date_of_admission",
      headerName: "DOA",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.date_of_admission).format("DD-MM-YYYY"),
    },
    {
      field: "fee_admission_category_short_name",
      headerName: "Admission Category",
      flex: 1,
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    // {
    //   field: "active",
    //   headerName: "Action",
    //   flex: 1,
    //   type: "actions",
    //   getActions: (params) => {},
    // },
  ];

  return (
    <>
      {/* Assign USN  */}
      <ModalWrapper
        title="Update USN"
        maxWidth={500}
        open={usnModal}
        setOpen={setUsnModal}
      >
        <AssignUsnForm
          rowData={rowData}
          setUsnModal={setUsnModal}
          getData={getData}
        />
      </ModalWrapper>

      <Box
        sx={{
          width: { md: "20%", lg: "15%", xs: "68%" },
          position: "absolute",
          right: 30,
          marginTop: { xs: 2, md: -5 },
        }}
      >
        <CustomAutocomplete
          name="acyearId"
          options={academicYearOptions}
          value={values.acyearId}
          handleChangeAdvance={handleChangeAdvance}
          required
        />
      </Box>

      <Box sx={{ marginTop: { xs: 10, md: 3 } }}>
        <GridIndex
          rows={paginationData.rows}
          columns={columns}
          rowCount={paginationData.total}
          page={paginationData.page}
          pageSize={paginationData.pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
          loading={paginationData.loading}
          handleOnFilterChange={handleOnFilterChange}
        />
      </Box>
    </>
  );
}

export default StudentDetailsIndex;
