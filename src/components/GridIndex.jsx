import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

function GridIndex({ rows, columns }) {
  const [pageSize, setPageSize] = useState(20);

  const gridStyle = {
    mb: 7,

    ".MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-columnHeaders": {
      background: "rgba(74, 87, 169, 0.1)",
      color: "#46464E",
    },
    ".MuiDataGrid-row": {
      background: "#FEFBFF",
      borderbottom: "1px solid #767680",
    },
    ".MuiDataGrid-virtualScroller": {
      overflow: "hidden",
    },
  };

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      components={{
        Toolbar: GridToolbar,
      }}
      componentsProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      sx={gridStyle}
      pageSize={pageSize}
      rowsPerPageOptions={[20, 50, 100]}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      scrollbarSize={0}
    />
  );
}

export default GridIndex;
