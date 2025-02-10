import React from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
} from "@mui/material";

export const GroupedColumnTable = ({ data }) => {
    // Group data by schoolName, then by program_short_name, then by program_specialization_short_name
    const schoolGroups = data.reduce((acc, item) => {
        if (!acc[item.schoolName]) {
            acc[item.schoolName] = {};
        }
        if (!acc[item.schoolName][item.program_short_name]) {
            acc[item.schoolName][item.program_short_name] = {};
        }
        if (!acc[item.schoolName][item.program_short_name][item.program_specialization_short_name]) {
            acc[item.schoolName][item.program_short_name][item.program_specialization_short_name] = [];
        }
        acc[item.schoolName][item.program_short_name][item.program_specialization_short_name].push(item);
        return acc;
    }, {});

    // Get unique fee categories dynamically
    const feeCategories = [
        ...new Set(data.map((item) => item.fee_admission_category_short_name)),
    ];

    return (
        <TableContainer sx={{ paddingBottom: "30px" }}>
            <Table sx={{ border: "1px solid #ddd" }}>
                {/* Table Head */}
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#376a7d" }}>
                        <TableCell
                            rowSpan={2}
                            sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                border: "1px solid #fff",
                                fontSize: "14px",
                            }}
                        >
                            School Name
                        </TableCell>
                        <TableCell
                            rowSpan={2}
                            sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                border: "1px solid #fff",
                                fontSize: "14px",
                            }}
                        >
                            Program
                        </TableCell>
                        <TableCell
                            rowSpan={2}
                            sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                border: "1px solid #fff",
                                fontSize: "14px",
                            }}
                        >
                            Specialization
                        </TableCell>
                        {feeCategories.map((category) => (
                            <TableCell
                                key={category}
                                colSpan={3}
                                align="center"
                                sx={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                    border: "1px solid #fff",
                                    fontSize: "15px",
                                }}
                            >
                                {category === "MGT" ? "Management" : category}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow sx={{ backgroundColor: "#376a7d", fontSize: "14px" }}>
                        {feeCategories.map((category) => (
                            <React.Fragment key={category}>
                                <TableCell
                                    sx={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        border: "1px solid #fff",
                                        fontSize: "14px",
                                    }}
                                >
                                    Intake
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        border: "1px solid #fff",
                                        fontSize: "14px",
                                    }}
                                >
                                    Vacant
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        border: "1px solid #fff",
                                        fontSize: "14px",
                                    }}
                                >
                                    Admitted
                                </TableCell>
                            </React.Fragment>
                        ))}
                    </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                    {Object.entries(schoolGroups).map(([schoolName, programs]) => (
                        <React.Fragment key={schoolName}>
                            {Object.entries(programs).map(([programName, specializations]) => (
                                <React.Fragment key={programName}>
                                    {Object.entries(specializations).map(([specializationName, rows]) => {
                                        // Combine data for different fee categories into a single row
                                        const combinedData = feeCategories.reduce((acc, category) => {
                                            const row = rows.find(
                                                (r) => r.fee_admission_category_short_name === category
                                            );
                                            acc[category] = row
                                                ? {
                                                    intake: row.intake,
                                                    vacant: row.vacant,
                                                    admitted: row.admitted,
                                                }
                                                : { intake: "-", vacant: "-", admitted: "-" };
                                            return acc;
                                        }, {});

                                        return (
                                            <TableRow
                                                key={`${schoolName}-${programName}-${specializationName}`}
                                                sx={{ borderBottom: "1px solid #ddd" }}
                                            >
                                                {/* School Name */}
                                                <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>
                                                    {schoolName}
                                                </TableCell>

                                                {/* Program Name */}
                                                <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>
                                                    {programName}
                                                </TableCell>

                                                {/* Specialization Name */}
                                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                                    {specializationName}
                                                </TableCell>

                                                {/* Fee Category Data */}
                                                {feeCategories.map((category) => (
                                                    <React.Fragment key={category}>
                                                        <TableCell
                                                            align="center"
                                                            sx={{ border: "1px solid #ddd" }}
                                                        >
                                                            {combinedData[category].intake}
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            sx={{ border: "1px solid #ddd" }}
                                                        >
                                                            {combinedData[category].vacant}
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            sx={{ border: "1px solid #ddd" }}
                                                        >
                                                            {combinedData[category].admitted}
                                                        </TableCell>
                                                    </React.Fragment>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
