import styled from "@emotion/styled"
import CustomTextField from "../../../components/Inputs/CustomTextField"
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker"
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete"

const Table = styled.table`
    border: 1px solid black;
    border-collapse: collapse;
    margin-top: 20px;
    width: 100%;
`

const TableRow = styled.tr`
    border: 1px;
    width: 100%;
`

const TableCell = styled.td`
    padding: 10px;
    border: 1px solid black;
    border-collapse: collapse;
`

const FRROExpansionTemplate = ({ data, handleChange, handleChangeDate, handleAttendingClass,selectedBonafied }) => {
    return <>
        <p>THIS IS TO CERTIFY THAT MR./MS {data.studentName} , NATIONAL OF CONGOLESE IS A BONAFIDE STUDENT OF THIS
            INSTITUTION.HIS/ HER DETAILS ARE GIVEN BELOW</p>
        <Table>
            <tbody>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>1.</TableCell>
                    <TableCell style={{ width: "35%" }}>FSIS NUMBER</TableCell>
                    <TableCell style={{ width: "100%" }}>{data.fsisNo}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>2.</TableCell>
                    <TableCell style={{ width: "35%" }}>NAME OF THE STUDENT</TableCell>
                    <TableCell style={{ width: "100%" }}>{data.studentName}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>3.</TableCell>
                    <TableCell style={{ width: "35%", padding: 0 }}>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <tr>
                                <TableCell style={{ width: "40%" }}>DATE OF BIRTH</TableCell>
                                <TableCell style={{ width: "100%" }}>{data.dob}</TableCell>
                            </tr>
                        </table>
                    </TableCell>
                    <TableCell style={{ width: "100%", padding: 0 }}>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <tr>
                                <TableCell style={{ width: "30%" }}>SEX</TableCell>
                                <TableCell style={{ width: "100%" }}>{data.sex}</TableCell>
                            </tr>
                        </table>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>4.</TableCell>
                    <TableCell style={{ width: "35%" }}>FATHER’S/ HUSBANDS NAME</TableCell>
                    <TableCell style={{ width: "100%" }}>{data.fatherOrHusbandName}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>5.</TableCell>
                    <TableCell style={{ width: "35%", padding: 0 }}>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <tr>
                                <TableCell style={{ width: "50%" }}>PASSPORT NO</TableCell>
                                <TableCell style={{ width: "100%" }}>{data.passportNo}</TableCell>
                            </tr>
                        </table>
                    </TableCell>
                    <TableCell style={{ width: "100%", padding: 0 }}>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <tr>
                                <TableCell style={{ width: "18%" }}>VALID FROM</TableCell>
                                <TableCell style={{ width: "30%" }}>{data.passportValidFrom}</TableCell>
                                <TableCell style={{ width: "18%" }}>VALID TO</TableCell>
                                <TableCell style={{ width: "30%" }}>{data.passportValidTo}</TableCell>
                            </tr>
                        </table>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>5.</TableCell>
                    <TableCell style={{ width: "35%", padding: 0 }}>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <tr>
                                <TableCell style={{ width: "50%" }}>STUDENT VISA NO</TableCell>
                                <TableCell style={{ width: "100%" }}>{data.visaNo}</TableCell>
                            </tr>
                        </table>
                    </TableCell>
                    <TableCell style={{ width: "100%", padding: 0 }}>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <tr>
                                <TableCell style={{ width: "18%" }}>VALID FROM</TableCell>
                                <TableCell style={{ width: "30%" }}>{data.visaValidFrom}</TableCell>
                                <TableCell style={{ width: "18%" }}>VALID TO</TableCell>
                                <TableCell style={{ width: "30%" }}>{data.visaValidTo}</TableCell>
                            </tr>
                        </table>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>7.</TableCell>
                    <TableCell style={{ width: "35%" }}>PRESENT RESIDENTIAL ADDRESS IN INDIA</TableCell>
                    <TableCell style={{ width: "100%" }}>{data.address}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>8.</TableCell>
                    <TableCell style={{ width: "35%" }}>INSTITUTION REGISTRATION NUMBER OF THE STUDENT</TableCell>
                    <TableCell style={{ width: "100%" }}>{data.registrationNo}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>9.</TableCell>
                    <TableCell style={{ width: "35%" }}>WHETHER STUDENT VISA ISSUED IS FOR THIS COURSE AND INSTITUTION? IF NO, WHETHER PERMISSION OF FRRO IS OBTAINED FOR THE CHANGE OF COURSE/INSTITUTION?</TableCell>
                    <TableCell style={{ width: "100%", padding: 0 }}>
                        <textarea value={data.studentVisaIssued}
                            onChange={handleChange}
                            name="studentVisaIssued"
                            rows="6"
                            style={{ width: "100%", padding: "10px", backgroundColor: "#eee" }}>
                        </textarea>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>10.</TableCell>
                    <TableCell style={{ width: "35%" }}>NAME AND REFERENCE NO. OF THE RECOGNIZING AUTHORITY OF THE INSTITUTION</TableCell>
                    <TableCell style={{ width: "100%", padding: 0 }}>
                        <textarea value={data.nameAndReferenceNoOfInst}
                            onChange={handleChange}
                            name="nameAndReferenceNoOfInst"
                            rows="4"
                            style={{ width: "100%", padding: "10px", backgroundColor: "#eee" }}>
                        </textarea>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>11.</TableCell>
                    <TableCell style={{ width: "35%" }}>NAME OF COURSE RECOGNIZING AUTHORITY AND REFERENCE NO. OF AFFILIATION</TableCell>
                    <TableCell style={{ width: "100%", padding: 0 }}>
                        <textarea value={data.nameAndReferenceNoOfCourse}
                            onChange={handleChange}
                            name="nameAndReferenceNoOfCourse"
                            rows="4"
                            style={{ width: "100%", padding: "10px", backgroundColor: "#eee" }}>
                        </textarea>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>12.</TableCell>
                    <TableCell style={{ width: "35%" }}>NAME OF THE COURSE </TableCell>
                    <TableCell style={{ width: "100%" }}>{data.nameOfCourse}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>13.</TableCell>
                    <TableCell style={{ width: "35%" }}>COURSE PERIOD</TableCell>
                    <TableCell style={{ width: "100%", padding: 0 }}>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <tr>
                                <TableCell style={{ width: "50%" }}>
                                    <CustomDatePicker
                                        name="coursePeriodFrom"
                                        label="From"
                                        value={data.coursePeriodFrom}
                                        handleChangeAdvance={handleChangeDate}
                                    />
                                </TableCell>
                                <TableCell style={{ width: "50%" }}>
                                    <CustomDatePicker
                                        name="coursePeriodTo"
                                        label="To"
                                        value={data.coursePeriodTo}
                                        handleChangeAdvance={handleChangeDate}
                                    />
                                </TableCell>
                            </tr>
                        </table>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>14.</TableCell>
                    <TableCell style={{ width: "35%" }}>IN WHICH YEAR/ SEMESTER STUDYING NOW</TableCell>
                    <TableCell style={{ width: "100%" }}>{data.yearAndSem}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>15.</TableCell>
                    <TableCell style={{ width: "35%" }}>ATTENDING CLASSES REGULARLY OR NOT</TableCell>
                    <TableCell style={{ width: "100%" }}>
                        <CustomAutocomplete
                            name="attendingClass"
                            label="Yes / No"
                            value={data.attendingClass}
                            options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]}
                            handleChangeAdvance={handleAttendingClass}
                            required
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>16.</TableCell>
                    <TableCell style={{ width: "35%" }}>DATE UP TO WHICH EXTENSION IS RECOMMENDED</TableCell>
                    <TableCell style={{ width: "100%" }}>
                        <CustomDatePicker
                            name="extensionDate"
                            label="Extension Date"
                            value={data.extensionDate}
                            handleChangeAdvance={handleChangeDate}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>17.</TableCell>
                    <TableCell style={{ width: "35%" }}>PURPOSE OF ISSUE OF CERTIFICATE</TableCell>
                    <TableCell style={{ width: "100%" }}>{data.purpose}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ width: "6%" }}>18.</TableCell>
                    <TableCell style={{ width: "35%" }}>REMARKS IF ANY</TableCell>
                    <TableCell style={{ width: "100%", padding: 0 }}>
                        <textarea value={data.remarks}
                            onChange={handleChange}
                            name="remarks"
                            rows="4"
                            style={{ width: "100%", padding: "10px", backgroundColor: "#eee" }}>
                        </textarea>
                    </TableCell>
                </TableRow>
                {selectedBonafied != 8 && <TableRow>
                    <TableCell style={{ width: "6%" }}>19.</TableCell>
                    <TableCell style={{ width: "35%" }}>DETAILS OF EXAMINATIONS ATTENDED:</TableCell>
                    <TableCell style={{ width: "100%" }}>AS PER ANNEXURE-1</TableCell>
                </TableRow>}
            </tbody>
        </Table>
    </>
}

export default FRROExpansionTemplate