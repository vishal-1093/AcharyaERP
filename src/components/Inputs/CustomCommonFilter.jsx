// import React, {useState, useEffect} from 'react';
// import {
//     Box, MenuItem, Select, Checkbox, TextField, Button, FormControl, InputLabel, ListItemText
//   } from '@mui/material';
// import CustomTextField from './CustomTextField';
  
//   const CustomFilter = ({ onApply=()=>{} })=> {
//     const [selectedFilters, setSelectedFilters] = useState([]);
//     const [filterValues, setFilterValues] = useState({});
//     const filterableColumns = [
//     { field: "instName", label: "School Name", type: "text" },
//     { field: "date", label: "Date", type: "date" },
//     { field: "settlementId", label: "Settlements", type: "text" },
//     { field: "totalCredit", label: "Settlement Amount", type: "number" },
//     { field: "receiptAmount", label: "Receipt Amount", type: "number" },
//     { field: "pendingAmount", label: "Pending Amount", type: "number" }
// ];
//     const handleFieldSelect = (event) => {
//       const value = event.target.value;
//       setSelectedFilters(value);
//     };
  
//     const handleInputChange = (field, value) => {
//       setFilterValues(prev => ({ ...prev, [field]: value }));
//     };
  
//     return (
//     //   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
//     <Box
//   sx={{
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 2,
//     mb: 2,
//   }}
// >
//       <Box sx={{ width: "300px" }}>
//         <FormControl fullWidth>
//           <InputLabel>Select Columns</InputLabel>
//           <Select
//             multiple
//             value={selectedFilters}
//             onChange={handleFieldSelect}
//             renderValue={(selected) => selected.join(', ')}
//           >
//             {filterableColumns.map(col => (
//               <MenuItem key={col.field} value={col.field}>
//                 <Checkbox checked={selectedFilters.includes(col.field)} />
//                 <ListItemText primary={col.label} />
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         </Box>
//         {selectedFilters.map(field => {
//           const col = filterableColumns.find(c => c.field === field);
//           return (
//             <Box sx={{ width: 300}}>
//             <CustomTextField
//                name="bankBalance"
//                label="Bank Balance"
//                value={""}
//                handleChange={()=>{}}
//               //  required
//              />
//              </Box>
//           );
//         })}
  
//         {/* <Button variant="contained" onClick={() => onApply(filterValues)}>
//           Apply Filters
//         </Button> */}
//       </Box>
//     );
//   }

//   export default CustomFilter
  