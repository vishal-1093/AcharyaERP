import React, { useState, useEffect } from 'react';
import {
    Box, MenuItem, Select, Checkbox, TextField, Button, FormControl, InputLabel, ListItemText
} from '@mui/material';
import CustomTextField from './CustomTextField';

const CustomFilter = ({ onApply = () => { }, filterableColumns = [], handleChange, selectedFilters }) => {
   // const [selectedFilters, setSelectedFilters] = useState([]);
    const [filterValues, setFilterValues] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    // const handleChange = (event) => {
    //     console.log("event.target.value", event.target.value)
    //     setSelectedFilters(event.target.value);
    // };

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 2,
            }}
        >
            <Box sx={{ width: "300px" }}>
                <FormControl fullWidth size="small">
                    {/* <InputLabel shrink={focused}>Select Columns</InputLabel> */}
                    <InputLabel shrink={isOpen}>Select Columns</InputLabel>
                    <Select
                        multiple
                        value={selectedFilters}
                        onChange={handleChange}
                        onOpen={() => setIsOpen(true)}
                        onClose={() => setIsOpen(false)}
                        displayEmpty
                        renderValue={() =>
                            isOpen ? "" : <em style={{ color: "#aaa" }}>Select Columns</em>
                        }
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    '& .MuiMenuItem-root': {
                                        minHeight: '30px', 
                                        paddingTop: '4px',
                                        paddingBottom: '4px',
                                    },
                                    '& .MuiCheckbox-root': {
                                        padding: '4px',
                                    },
                                    '& .MuiListItemText-root': {
                                        margin: 0,
                                    },
                                },
                            },
                        }}
                    >
                        {filterableColumns.map((col) => (
                            <MenuItem key={col.field} value={col.field}>
                                <Checkbox checked={selectedFilters.includes(col.field)} />
                                <ListItemText primary={col.headerName} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Box>
            {selectedFilters.map(field => {
                const col = filterableColumns.find(c => c.field === field);
                return (
                    <Box sx={{ width: 300 }}>
                        <CustomTextField
                            name={col?.field}
                            label={col?.headerName}
                            value={""}
                            handleChange={() => { }}
                        //  required
                        />
                    </Box>
                );
            })}

            <Button variant="contained" onClick={() => onApply(filterValues)}>
          Apply Filters
        </Button>
        </Box>
    );
}

export default CustomFilter
