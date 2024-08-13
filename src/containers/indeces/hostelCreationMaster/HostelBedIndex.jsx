import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";

function HostelBedIndex() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      field: "roomName",
      headerName: "Room",
      flex: 1,
      hideable: false,
    },
    // { field: "wardensId", headerName: "wardensId", flex: 1, hideable: false },
    {
      field: "floorName",
      headerName: "Floor",
      flex: 1,
      hideable: false,
    },
    {
      field: "bedName",
      headerName: "Bed",
      flex: 1,
      hideable: false,
    },
    // {
    //   field: "blockName",
    //   headerName: "Block Name",
    //   flex: 1,
    //   hideable: false,
    // },
    // { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    // { field: "createdUsername", headerName: "Created By", flex: 1 },

  ];

  useEffect(() => {
    getData();
  }, []);



  const getData = async () => {
    await axios
      .get(
       `/api/hostel/fetchAllHostelBedsDetails?page=${0}&page_size=${10000}&sort=createdDate`
      )
      .then((Response) => {
        setRows(Response?.data?.data?.Paginated_data?.content);
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

export default HostelBedIndex;
