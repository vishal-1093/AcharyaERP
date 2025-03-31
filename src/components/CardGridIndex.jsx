import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SettingsIcon from "@mui/icons-material/Settings";
// ...props are any other props for MUI DataGrid component

const gridStyle = {
  mb: 7,
  ".MuiDataGrid-row": {
    background: "#FEFBFF",
    borderbottom: "1px solid #767680",
  },
  "& .rightAlignedCell": {
    textAlign: "right",
    justifyContent: "flex-end",
    display: "flex",
  },
  "& .MuiDataGrid-cell": {
    display: "flex !important",
    alignItems: "center !important"
  },
};

function CardGridIndex({
  rows,
  columns,
  columnVisibilityModel,
  rowCount = 0,
  handlePageChange,
  page,
  pageSize,
  handleOnPageChange,
  handleOnPageSizeChange,
  loading,
  getRowClassName,
  handleOnFilterChange,
  ...props
}) {
  const [updatePageSize, setUpdatePageSize] = useState(pageSize);

  useEffect(() => {
    setUpdatePageSize(pageSize);
  }, [pageSize]);

  const CustomButton = () => <SettingsIcon />;

  if (pageSize) {
    props.rowCount = rowCount;
    props.page = page;
    props.paginationMode = "server";
    // props.onPageChange = handleOnPageChange;
    props.onPaginationModelChange = (model) => handleOnPageChange(model.page);
    props.onPageSizeChange = handleOnPageSizeChange;
    props.filterMode = "server";
    props.onFilterModelChange = handleOnFilterChange;
  } else {
    props.onPageSizeChange = (newPageSize) => setUpdatePageSize(newPageSize);
  }

  return (
    <DataGrid
      rowHeight={70}
      rows={rows}
      columns={columns}
      initialState={{
        columns: {columnVisibilityModel}
      }}
      getRowId={(row) => row.id}
      slots={{
        toolbar: GridToolbar,
        moreActionsIcon: CustomButton,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      sx={gridStyle}
      pageSizeOptions={[9, 27, 54]}
      pageSize={updatePageSize || 54}
      // paginationModel={paginationModel}
      onPaginationModelChange={(e) => handlePageChange(e)}
      scrollbarSize={0}
      density="compact"
      loading={loading}
      getRowClassName={getRowClassName}
      {...props}
    />
  );
}

export default CardGridIndex;

