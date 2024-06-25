import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";

function PrintIndex(){
    const [rows, setRows] = useState([]);

    const columns = [
        { field: "Auid", headerName: "AUID", flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
    
        { field: "program", headerName: "Programme", flex: 1},
        { field: "email", headerName: "Email", flex: 1},
        { field: "phone", headerName: "Phone", flex: 1},
        { field: "photo", headerName: "Photo", flex: 1 },
        { field: "createdUsername", headerName: "Created By", flex: 1, hide: true },
        {
          field: "createdDate",
          headerName: "Created Date",
          flex: 1,
          hide: true,
          type: "date"
        },
      ];

    return (
        <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        >
          View
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
        </>
    )
}

export default PrintIndex;