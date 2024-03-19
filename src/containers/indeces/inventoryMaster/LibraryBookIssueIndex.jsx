import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import {
  Button,
  Box,
  IconButton,
  Typography,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
}));

function LibraryBookIssueIndex() {
  const [Data, setData] = useState([]);
  const [ids, setIds] = useState([]);
  const classes = useStyles();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const [StockData, setStockData] = useState([]);
  const [bookDataOpen, setBookDataOpen] = useState(false);
  const [bookData, setBookData] = useState([]);

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => Data.find((row) => row.id === id));
    setIds(selectedRowsData.map((val) => val.accessionNo));
  };

  const columns = [
    {
      field: "accessionNo",
      headerName: "Accession No.",
      flex: 1,
      hideable: false,
    },
    {
      field: "barcode",
      headerName: "Barcode",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              component="span"
              color="primary.main"
              sx={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/AccessionBookIndex/${params.row.accessionNo}`)
              }
            >
              {params.row.title}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "author",
      headerName: "Author",
      flex: 1,
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setCrumbs([{ name: "Stock Issues" }]);
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/libraryInv/getAllLibraryAccessionIndex?page_no=0&page_size=${10000}`
      )
      .then((res) => {
        const rowId = res.data.data.content.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setData(rowId);
      })
      .catch((err) => console.error(err));
  };

  const handlePrint = async () => {
    navigate("/LibraryBarCode", { state: { ids } });
  };

  const handleDetails = async () => {
    setBookDataOpen(true);
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 4 }}>
        <Button
          onClick={() => handlePrint()}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<PrintIcon />}
          disabled={!ids.length > 0}
        >
          Print
        </Button>
        <GridIndex
          rows={Data}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
        />
      </Box>

      <ModalWrapper
        open={bookDataOpen}
        setOpen={setBookDataOpen}
        maxWidth={900}
        title={"Book History"}
      >
        <Box mt={2} p={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead className={classes.bg}>
                <TableRow>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Sl. No.
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Book
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Accession No.
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Student
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Check Out
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Check In
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Fine Paid
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.table}>
                {bookData?.map((dataItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{dataItem.itemName}</TableCell>
                    <TableCell>{dataItem.availableQuantity}</TableCell>
                    <TableCell>{dataItem.uom}</TableCell>
                    <TableCell>{dataItem.issueQuantity}</TableCell>
                    <TableCell>
                      {dataItem.createdDate
                        ? moment(dataItem.createdDate).format("DD-MM-YYYY")
                        : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </ModalWrapper>
    </>
  );
}

export default LibraryBookIssueIndex;
