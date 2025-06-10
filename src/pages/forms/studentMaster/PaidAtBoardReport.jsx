import { useEffect, useState } from "react";
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "../../../services/Api";

const Fallbackcrumb = [
  { text: `Board Receivables`, action: () => {}, isParent: false },
];

function PaidAtBoardReport() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [crumbs, setCrumbs] = useState(Fallbackcrumb);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getReport();
  }, []);

  const getReport = async () => {
    setLoading(true);

    await axios
      .get(`/api/finance/paidBoardReportBasedOnBoard`)
      .then((response) => {
        if (response.data.data.length > 0) {
          const dataRows = [];
          setCrumbs(Fallbackcrumb);

          response.data.data.forEach((ele, i) => {
            dataRows.push({
              id: i + 1,
              boardName: ele.board_unique_name,
              balance: ele.balance,
              isLastRow: false,
              isClickable: true,
              boardId: ele.board_unique_id,
            });
          });

          const column = [
            {
              field: "id",
              headerName: "Sl No.",
              flex: 1,
              headerClassName: "header-bg",
            },
            {
              field: "boardName",
              headerName: "Board",
              flex: 1,
              headerClassName: "header-bg",
              renderCell: (params) => {
                if (!params.row.isClickable)
                  return (
                    <Typography fontWeight="bold">
                      {params.row.boardName}
                    </Typography>
                  );

                return (
                  <Button
                    onClick={() => getSchoolData(params.row)}
                    sx={{ padding: 0, fontWeight: "bold" }}
                  >
                    {params.row.boardName}
                  </Button>
                );
              },

              headerAlign: "center",
              align: "center",
            },
            {
              field: "balance",
              headerName: "Total",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "right",
            },
          ];

          setColumns(column);
          setRows(dataRows);
          setLoading(false);
        } else {
          setColumns([]);
          setRows([]);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const getSchoolData = async (data) => {
    setLoading(true);

    await axios
      .get(`/api/finance/paidBoardReportBasedOnSchoolByBoard/${data?.boardId}`)
      .then((response) => {
        if (response.data.data.length > 0) {
          const dataRows = [];
          setCrumbs([
            { text: `Board Receivables`, action: () => {}, isParent: false },
            {
              text: `${data?.boardName}`,
              action: () => getReport(),
              isParent: true,
            },
          ]);

          response.data.data.forEach((ele, i) => {
            dataRows.push({
              id: i + 1,
              schoolName: ele.school_name,
              balance: ele.balance ?? 0,
              isLastRow: false,
              isClickable: true,
              boardId: ele.board_unique_id,
              schoolId: ele.school_id,
              boardName: data?.boardName,
            });
          });

          const column = [
            {
              field: "id",
              headerName: "Sl No.",
              flex: 1,
              headerClassName: "header-bg",
            },
            {
              field: "schoolName",
              headerName: "School",
              flex: 1,
              headerClassName: "header-bg",
              renderCell: (params) => {
                if (!params.row.isClickable)
                  return (
                    <Typography fontWeight="bold">
                      {params.row.schoolName}
                    </Typography>
                  );

                return (
                  <Button
                    onClick={() => getAcYearData(params.row)}
                    sx={{ padding: 0, fontWeight: "bold" }}
                  >
                    {params.row.schoolName}
                  </Button>
                );
              },

              headerAlign: "center",
              align: "center",
            },
            {
              field: "balance",
              headerName: "Due Total",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "right",
            },
          ];

          setColumns(column);
          setRows(dataRows);
          setLoading(false);
        } else {
          setColumns([]);
          setRows([]);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const getAcYearData = async (data) => {
    setLoading(true);

    await axios
      .get(
        `/api/finance/paidBoardReportBasedOnAcademicYearByBoardAndSchool/${data?.boardId}/${data?.schoolId}`
      )
      .then((response) => {
        if (response.data.data.length > 0) {
          const dataRows = [];
          setCrumbs([
            { text: `Board Receivables`, action: () => {}, isParent: false },
            {
              text: `${data?.boardName}`,
              action: () => getReport(),
              isParent: true,
            },
            {
              text: `${data?.schoolName}`,
              action: () => getSchoolData(data),
              isParent: true,
            },
          ]);

          response.data.data.forEach((ele, i) => {
            dataRows.push({
              id: i + 1,
              acYear: ele.ac_year,
              balance: ele.balance ?? 0,
              isLastRow: false,
              isClickable: true,
              boardId: ele.board_unique_id,
              schoolId: ele.school_id,
              acYearId: ele.ac_year_id,
              boardName: data?.boardName,
              schoolName: data?.schoolName,
            });
          });

          const column = [
            {
              field: "id",
              headerName: "Sl No.",
              flex: 1,
              headerClassName: "header-bg",
            },
            {
              field: "acYear",
              headerName: "Ac Year",
              flex: 1,
              headerClassName: "header-bg",
              renderCell: (params) => {
                if (!params.row.isClickable)
                  return (
                    <Typography fontWeight="bold">
                      {params.row.acYear}
                    </Typography>
                  );

                return (
                  <Button
                    onClick={() => getStudentData(params.row)}
                    sx={{ padding: 0, fontWeight: "bold" }}
                  >
                    {params.row.acYear}
                  </Button>
                );
              },

              headerAlign: "center",
              align: "center",
            },
            {
              field: "balance",
              headerName: "Due Total",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "right",
            },
          ];

          setColumns(column);
          setRows(dataRows);
          setLoading(false);
        } else {
          setColumns([]);
          setRows([]);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const getStudentData = async (data) => {
    setLoading(true);

    await axios
      .get(
        `/api/finance/studentDetailsByBoardSchoolAcademicYear/${data?.boardId}/${data?.schoolId}/${data?.acYearId}`
      )
      .then((response) => {
        if (response.data.data.length > 0) {
          const dataRows = [];
          setCrumbs([
            { text: `Board Receivables`, action: () => {}, isParent: false },
            {
              text: `${data?.boardName}`,
              action: () => getReport(),
              isParent: true,
            },
            {
              text: `${data?.schoolName}`,
              action: () => getSchoolData(data),
              isParent: true,
            },
            {
              text: `${data?.acYear}`,
              action: () => getAcYearData(data),
              isParent: true,
            },
          ]);

          response.data.data.forEach((ele, i) => {
            dataRows.push({
              id: i + 1,
              auid: ele.auid,
              studentName: ele.student_name,
              fee_admission_category_short_name:
                ele.fee_admission_category_short_name,
              board_unique_short_name: ele.board_unique_short_name,
              program_type_code: ele.program_type_code,
              current_year: ele.current_year,
              current_sem: ele.current_sem,
              toPay: ele.toPay ?? 0,
              received: ele.received ?? 0,
              balance: ele.balance ?? 0,
              isLastRow: false,
              isClickable: true,
              boardId: ele.board_unique_id,
              schoolId: ele.school_id,
              acYearId: ele.ac_year_id,
            });
          });

          const column = [
            {
              field: "id",
              headerName: "Sl No.",
              flex: 1,
              headerClassName: "header-bg",
            },
            {
              field: "auid",
              headerName: "Auid",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "studentName",
              headerName: "Name",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "fee_admission_category_short_name",
              headerName: "Category",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "board_unique_short_name",
              headerName: "Board",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "program_type_code",
              headerName: "Pattern",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "current_year",
              headerName: "Year/Sem",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "center",
              renderCell: (params) => {
                return `${params.row.current_year}/${params.row.current_sem}`;
              },
            },

            {
              field: "toPay",
              headerName: "To pay",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "right",
            },
            {
              field: "received",
              headerName: "Received",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "right",
            },
            {
              field: "balance",
              headerName: "Balance",
              flex: 1,
              headerClassName: "header-bg",
              headerAlign: "center",
              align: "right",
            },
          ];

          setColumns(column);
          setRows(dataRows);
          setLoading(false);
        } else {
          setColumns([]);
          setRows([]);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <>
      <Box>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          pt={3}
          rowGap={2}
          className="main-grid"
        >
          <Grid item xs={12} md={12} lg={1}></Grid>
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              "& .last-row": {
                fontWeight: 700,
                backgroundColor: "#376a7d !important",
                color: "#fff",
                fontSize: "13px",
              },
              "& .last-column": { fontWeight: "bold" },
              "& .last-row:hover": {
                fontWeight: 700,
                backgroundColor: "#376a7d !important",
                color: "#fff",
                fontSize: "13px",
              },
              "& .header-bg": {
                fontWeight: "bold",
                backgroundColor: "#376a7d",
                color: "#fff",
                fontSize: "15px",
              },
            }}
            className="children-grid"
          >
            <CustomBreadCrumbs arr={crumbs} />

            <GridIndex
              rows={rows}
              columns={columns}
              getRowClassName={(params) => {
                return params.row.isLastRow ? "last-row" : "";
              }}
              loading={loading}
              rowSelectionModel={[]}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={1} className="empty-grid"></Grid>
        </Grid>
      </Box>
    </>
  );
}
export default PaidAtBoardReport;

const CustomBreadCrumbs = ({ arr }) => {
  if (arr.length <= 0) return null;

  return (
    <Box>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        {arr.map((obj, i) => {
          const { text, action, isParent } = obj;

          if (isParent)
            return (
              <Typography
                key={i}
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "#2F38AB",
                }}
                onClick={action}
              >
                {" "}
                {text}
              </Typography>
            );
          return (
            <Typography key={i} variant="h5" sx={{ fontWeight: "bold" }}>
              {" "}
              {text}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};
