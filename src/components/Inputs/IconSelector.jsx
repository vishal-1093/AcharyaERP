import { useState } from "react";
import { Box, Button, Paper, Grid, InputBase } from "@mui/material";
import iconsList from "../../utils/MenuIcons";
import { Search } from "@mui/icons-material";

function IconSelector({ value, onSelectIcon }) {
  const [filterText, setFilterText] = useState("");

  return (
    <Box sx={{ background: "white", p: 2, borderRadius: 2 }}>
      <Paper sx={{ position: "sticky", top: 80, mb: 3, zIndex: 1 }}>
        <InputBase
          startAdornment={<Search sx={{ marginRight: 1.3 }} />}
          placeholder="Search icons..."
          sx={{ px: 2, py: 1 }}
          fullWidth
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Paper>
      <Box>
        <Grid
          container
          alignItems="center"
          justifyContent="space-around"
          rowSpacing={2}
          columnGap={2}
        >
          {iconsList
            .filter((item) => item.name.toLowerCase().includes(filterText))
            .map((filteredItem) => {
              return (
                <Grid key={filteredItem.name} item>
                  <Button
                    variant={filteredItem.name === value ? "contained" : "text"}
                    color="blue"
                    onClick={() => onSelectIcon(filteredItem.name)}
                    sx={{
                      display: "block",
                      minWidth: 70,
                      textTransform: "capitalize",
                      px: 0,
                    }}
                  >
                    {filteredItem.icon}
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        lineHeight: 1,
                      }}
                    >
                      {filteredItem.name}
                    </p>
                  </Button>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </Box>
  );
}

export default IconSelector;
