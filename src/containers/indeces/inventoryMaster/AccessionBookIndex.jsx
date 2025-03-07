import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useParams } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function AccessionBookIndex() {
  const [rows, setRows] = useState([]);

  const { accessionNo } = useParams();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    { field: "bookName", headerName: "Book", flex: 1 },
    { field: "accessionNumber", headerName: "Accession No", flex: 1 },
    { field: "item_type", headerName: "Student/Staff", flex: 1 },
    {
      field: "checkOutTime",
      headerName: "Check Out",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row?.checkOutTime).format("DD-MM-YYYY HH:MM:SS"),
    },
    {
      field: "checkInTime",
      headerName: " Check In",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row?.checkInTime).format("DD-MM-YYYY HH:MM:SS"),
    },
    {
      field: "finePerDay",
      headerName: "Fine per day",
      flex: 1,
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "History", link: "/ItemMaster/Library" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/libraryInv/getLibraryBooksDetailsByAccessionNumber?accessionNumber=${accessionNo}`
      )
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
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default AccessionBookIndex;
