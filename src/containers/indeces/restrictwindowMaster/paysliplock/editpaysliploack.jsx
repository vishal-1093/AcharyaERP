import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material"
import React, { useEffect, useState } from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import axios from "../../../../services/Api";
import CheckboxAutocomplete from "../../../../components/Inputs/CheckboxAutocomplete";
import CustomDatePicker from "../../../../components/Inputs/CustomDatePicker";
import { convertUTCtoTimeZone } from "../../../../utils/DateTimeUtils";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

const PaysliplockEdit = () => {
    const navigate = useNavigate()
    const params = useParams()
    const today = new Date();
    const selectedMonthYear_ = convertUTCtoTimeZone(new Date(today.getFullYear(), today.getMonth()))
    const setCrumbs = useBreadcrumbs();
    const [employeesList, setEmployeesList] = useState([])
    const [selectedEmployees, setSelectedEmployees] = useState([])
    const [schoolList, setSchoolList] = useState([])
    const [selectedSchool, setSelectedSchool] = useState("")
    const [displayDate, setDisplayDate] = useState(null)
    const [selectedMonthYear, setSelectedMonthYear] = useState(selectedMonthYear_)
    const [startDisplayDate, setstartDisplayDate] = useState(null)

    useEffect(() => {
        setCrumbs([
            {
                name: "Restrict window",
                link: "/restrictwindow/paysliplock",
            },
            { name: "Edit paysliplock" },
        ]);

        getEmployeeList()
        getSchoolsList()
        getPayslipData()
    }, [])

    useEffect(() => {
        if(displayDate !== null){
            const selectedMonth = new Date(selectedMonthYear).getMonth() + 1
            const currentMonth = new Date().getMonth() + 1
            const selectedYear = new Date(selectedMonthYear).getFullYear()
            const currentYear = new Date().getFullYear()
    
            if(selectedMonth <= currentMonth && selectedYear <= currentYear){
                setstartDisplayDate(new Date())
            }else{
                const selectedMonth = new Date(selectedMonthYear).getMonth() + 1
                let d = new Date()
                d.setDate(1)
                d.setMonth(selectedMonth)
                if(selectedMonth === 12) d.setFullYear(selectedYear + 1)
                else d.setFullYear(selectedYear)
                const nextMonth = new Date(d)
                setstartDisplayDate(nextMonth)
                setDisplayDate(nextMonth)
            }
        }
    }, [selectedMonthYear])

    const getEmployeeList = () => {
        axios.get("/api/employee/getEmployeeNameConcateWithEmployeeCode")
            .then(response => {
                const empList = response.data.data.map(obj => {
                    return { value: obj.emp_id, label: obj.EmpolyeeName }
                })

                setEmployeesList(empList)
            })
    }

    const getSchoolsList = () => {
        axios.get("/api/institute/school")
            .then(response => {
                setSchoolList(response.data.data)
                setSelectedSchool(response.data.data[0].school_id)
            })
    }

    const getPayslipData = () => {
        const id = params.id
        axios.get(`/api/employee/paySlipLockDate/${id}`)
        .then(response => {
            const data = response.data.data
            if(!data){
                alert("No Data foound!!!")
                navigate("/restrictwindow/paysliplock")
            } 
            const { display_date, emp_id, month, year } = data[0]
           
            let selectedPayMonthAndYear = new Date()
            selectedPayMonthAndYear.setDate(today.getDate())
            selectedPayMonthAndYear.setMonth(parseInt(month) - 1)
            selectedPayMonthAndYear.setFullYear(parseInt(year))
            setSelectedMonthYear(selectedPayMonthAndYear)
            const selectedEmps = emp_id ? emp_id.split(",").map(empid => parseInt(empid)) : []
            setSelectedEmployees([...selectedEmps])
            const dd = display_date.split("-")
            let selectedDisplay_date = new Date()
            selectedDisplay_date.setDate(parseInt(dd[0]))
            selectedDisplay_date.setMonth(parseInt(dd[1]) - 1)
            selectedDisplay_date.setFullYear(parseInt(dd[2]))
            setTimeout(() => {
                setDisplayDate(selectedDisplay_date)
            }, 1200);
        })
    }

    const handleChangeAdvance = (name, value) => {
        setSelectedEmployees([...value])
    }

    const handleSelectAll = (name, options) => {
        setSelectedEmployees(options.map((obj) => obj.value))
    }

    const handleSelectNone = (name) => setSelectedEmployees([])

    const handleCreate = () => {
        if(displayDate == null) return alert("Please provide display date")

        const payload = {
            "pay_slip_lock_date_id": params.id,
            "school_id": selectedSchool,
            "month": new Date(selectedMonthYear).getMonth() + 1,
            "year": new Date(selectedMonthYear).getFullYear(),
            "display_date": moment(displayDate).format("DD-MM-YYYY"),
            "active": true,
            "emp_id": selectedEmployees.length > 0 ? selectedEmployees.toString() : null
        }

        axios.put(`/api/employee/paySlipLockDate/${params.id}`, [payload])
        .then(res => {
            navigate("/restrictwindow/paysliplock")
        })
        .catch(err => {
            const msg = err ? err.response ? err.response.data.message : "Failed to update data!!!" : "Failed to update data!!!"
            alert(msg)
        })
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }} rowGap={4} pt={4}>
            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                <Grid item xs={12} md={12} lg={5}>
                    <Grid container rowGap={4}>
                        <Grid item xs={12}>
                            <FormControl size="medium" fullWidth>
                                <InputLabel>School</InputLabel>
                                <Select size="small" name="School" value={selectedSchool} label="School"
                                    onChange={(e) => setSelectedSchool(e.target.value)}>
                                    {schoolList.map((obj, index) => (
                                        <MenuItem key={index} value={obj.school_id}>
                                            {obj.display_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <CustomDatePicker
                            name="month"
                            label="Pay Month"
                            value={selectedMonthYear}
                            handleChangeAdvance={(name, newValue) => setSelectedMonthYear(newValue)}
                            views={["month", "year"]}
                            openTo="month"
                            inputFormat="MM/YYYY"
                            required
                            disabled
                        />
                        <Grid item xs={12}>
                            <CustomDatePicker
                                name="displayDate"
                                label="Display Date"
                                value={displayDate}
                                handleChangeAdvance={(name, newValue) => setDisplayDate(newValue)}
                                minDate={startDisplayDate}
                                required
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12} lg={5}>
                    <CheckboxAutocomplete
                        name="Restrict Employees"
                        label="Restrict Employees"
                        value={selectedEmployees}
                        options={employeesList}
                        handleChangeAdvance={handleChangeAdvance}
                        handleSelectAll={handleSelectAll}
                        handleSelectNone={handleSelectNone}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                <Grid item>
                    <Button variant="contained" size="medium" onClick={handleCreate}>Update</Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PaysliplockEdit