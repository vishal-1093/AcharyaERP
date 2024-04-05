import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Grid,
  Paper,
  styled,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import GridIndex from "./GridIndex";
import axios from "../services/Api";
import moment from "moment";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "column",
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  fontSize: "14px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
    color: "orange",
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
  [theme.breakpoints.up("xs")]: {
    fontSize: "11px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "14px",
  },
}));

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  },
  bg: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
}));

const initialValues = {
  auid: "",
  libraryId: "",
};

const userName = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userName;
const usertype = localStorage.getItem("usertype");
const userId = JSON.parse(localStorage.getItem("empId"));

function StudentLibraryDetailsView() {
  const [values, setValues] = useState(initialValues);
  const [tab, setTab] = useState("");
  const [rows, setRows] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [libraryOptions, setLibraryOptions] = useState([]);
  const [subTab, setSubTab] = useState("Checkout");

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    getLibraryBooks();
    setCrumbs([{ name: "Library Book Issue" }]);
  }, []);

  useEffect(() => {
    getData();
  }, [usertype, userId, userName]);

  useEffect(() => {
    getIndexData();
  }, [values.auid]);

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };

  const columns = [
    { headerName: "Book", flex: 1, field: "bookName" },
    { headerName: "Accession No.", flex: 1, field: "accessionNumber" },

    {
      headerName: "Check Out",
      flex: 1,
      field: "checkOutTime",
      valueGetter: (params) =>
        moment(params.row.checkOutTime).format("DD-MM-YYYY HH:MM:SS"),
    },
    {
      headerName: "Return Date",
      flex: 1,
      field: "checkInTime",
      valueGetter: (params) =>
        moment(params.row.checkInTime).format("DD-MM-YYYY HH:MM:SS"),
    },
    {
      headerName: "Issued Date",
      flex: 1,
      field: "Issued Date",
      valueGetter: (params) =>
        moment(params.row.checkOutTime).format("DD-MM-YYYY"),
    },
    { headerName: "Issued By", flex: 1, field: "issuedBy" },
    { headerName: "Fine (per day)", flex: 1, field: "finePerDay" },
    {
      headerName: "Pay Fine",
      flex: 1,
      field: "issuerFine",
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              component="span"
              color="primary.main"
              sx={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/LibraryFinePayment/${params.row.issuerFine}`, {
                  state: { rows },
                })
              }
            >
              {params.row.issuerFine}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const getLibraryBooks = async () => {
    await axios
      .get(`/api/libraryInv/getAllLibraryBooksWithAccessionNumber`)
      .then((res) => {
        setLibraryOptions(
          res.data.data.map((obj) => ({
            label: obj.bookName + "-" + obj.accessionNumber,
            value: obj.accessionNumber,
            libraryAssigmentId: obj.libraryAssigmentId,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    if (usertype.toLowerCase() === "student") {
      await axios
        .get(
          `/api/getUserDetailsForLibrary?userCode=${userName}&userType=${usertype}`
        )
        .then((res) => {
          if (res.data.data !== null) {
            setStudentData(res.data.data);
            setOpen(true);
          } else {
            setOpen(false);
          }
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(`/api/getAllUserListForLibrary`)
        .then((res) => {
          res.data.data.filter(async (obj) => {
            if (obj.userId === userId) {
              await axios
                .get(
                  `/api/employee/getEmployeeDetailsForLibrary?empCode=${obj.userCode}`
                )
                .then((res) => {
                  if (res.data.data !== null) {
                    setStudentData(res.data.data);
                    setOpen(true);
                  } else {
                    setOpen(false);
                  }
                })
                .catch((err) => console.error(err));
            }
          });
        })
        .catch((err) => console.error(err));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const getIndexData = async () => {
    await axios
      .get(`/api/libraryInv/getAllLibraryBooksIssue/?issuerId=${userId}`)
      .then((res) => {
        const rowId = res.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setRows(rowId);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Grid container spacing={2} columnSpacing={4} sx={{ marginTop: "1px" }}>
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={subTab}
            onChange={handleSubTabChange}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="Checkout" label="Check Outs" />
            <CustomTab value="Admissions" label="Holds" />
            <CustomTab value="Bookissue" label="Book Issue" />
            <CustomTab value="Proctorial" label="Restrictions" />
          </CustomTabs>
        </Grid>
        <Grid item xs={8} md={10}>
          {subTab === "Checkout" && (
            <Grid item xs={11.5} ml={2}>
              <GridIndex rows={rows} columns={columns} />
            </Grid>
          )}

          {subTab === "Bookissue" && (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              rowSpacing={1}
              columnSpacing={2}
              mt={0.1}
            >
              <Grid item xs={12} md={11.5}>
                <Alert severity="error">You do not have permission!</Alert>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}
export default StudentLibraryDetailsView;
