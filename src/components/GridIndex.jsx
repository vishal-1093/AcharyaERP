import { Box, Paper, Grid } from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import React, { useState } from "react";

export default function GridIndex({ rows, columns }) {
  function QuickSearchToolbar() {
    return (
      <Box
        sx={{
          float: "right",
        }}
      >
        <GridToolbarQuickFilter />
      </Box>
    );
  }
  const [pageSize, setPageSize] = useState(20);
  const styles = {
    width: "90%",
    margin: "10px auto",
    overflow: "hidden",
  };

  const gridStyle = {
    ".MuiDataGrid-columnSeparator": {
      display: "none",
    },

    "& .MuiDataGrid-columnHeaders": {
      background:
        "linear-gradient(0deg, rgba(74, 87, 169, 0.05), rgba(74, 87, 169, 0.05)), #FEFBFF",
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
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <>
            <Grid item xs={8} md={2}></Grid>
          </>

          <>
            <Grid item xs={12} md={12}>
              <Paper elevation={0} sx={styles}>
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
                ></DataGrid>
              </Paper>
            </Grid>
          </>
        </Grid>
      </Box>
    </>
  );
}
