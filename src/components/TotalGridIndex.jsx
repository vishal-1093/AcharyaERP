import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SettingsIcon from "@mui/icons-material/Settings";

// ...props are any other props for MUI DataGrid component

const gridStyle = {
  mb:2,

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
  "& .rightAlignedCell": {
    textAlign: "right",
    justifyContent: "flex-end",
    display: "flex",
  },
};

function TotalGridIndex({
  rows,
  columns,
  TotalCustomFooter,
  rowCount = 0,
  loading,
  getRowClassName,
  handleOnFilterChange,
  ...props
}) {
  const CustomButton = () => <SettingsIcon />;

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      components={{
        Toolbar: GridToolbar,
        MoreActionsIcon: CustomButton,
        Footer: () => TotalCustomFooter()
      }}
      componentsProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      sx={gridStyle}
      scrollbarSize={0}
      density="compact"
      loading={loading}
      getRowClassName={getRowClassName}
      {...props}
    />
  );
}

export default TotalGridIndex;
