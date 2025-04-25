import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SettingsIcon from "@mui/icons-material/Settings";

// ...props are any other props for MUI DataGrid component

const gridStyle = {
  mb: 7,

  // ".MuiDataGrid-columnSeparator": {
  //   display: "none",
  // },
  // "& .MuiDataGrid-columnHeaders": {
  //   background: "rgba(74, 87, 169, 0.1)",
  //   color: "#46464E",
  // },
  '& .MuiDataGrid-main': {
    paddingBottom: '20px',
  },
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
    alignItems: "center !important",
   // justifyContent: "center !important",
  },
};

function GridIndex({
  rows,
  columns,
  rowCount = 0,
  page,
  pageSize,
  handleOnPageChange,
  handleOnPageSizeChange,
  loading,
  getRowClassName,
  handleOnFilterChange,
  columnVisibilityModel={},
  setColumnVisibilityModel=()=>{},
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
      autoHeight
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) =>
        setColumnVisibilityModel(newModel)
      }
      // components={{
      //   Toolbar: GridToolbar,
      //   MoreActionsIcon: CustomButton,
      // }}
      // componentsProps={{
      //   toolbar: {
      //     showQuickFilter: true,
      //     quickFilterProps: { debounceMs: 500 },
      //   },
      // }}
      slots={{
        toolbar: GridToolbar,
        moreActionsIcon: CustomButton, // This slot doesn't exist in MUI, kept for reference
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      sx={gridStyle}
      // pageSize={updatePageSize ? updatePageSize : 100}
      // rowsPerPageOptions={[50, 100]}
      pageSizeOptions={[50, 100]} 
      pageSize={updatePageSize || 100}
      scrollbarSize={0}
      density="compact"
      loading={loading}
      getRowClassName={getRowClassName}
      {...props}
    />
  );
}

export default GridIndex;
