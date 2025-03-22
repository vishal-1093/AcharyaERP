import {
    IconButton,
    Grid,
    Button,
    Box,
    Modal,
    Typography,
    Radio,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useState } from "react";
import axios from "../services/Api";
import useAlert from "../hooks/useAlert";
import CustomRadioButtons from "./Inputs/CustomRadioButtons";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";

// open: boolean,
// setOpen: () => void,
// title?: string,
// message?: string,
// buttons?: {
//     name: string,
//     color: string,       according to theme context, refer MUI button for more info.
//     func: () => void,
// }[],

const style = {
    display: "block",
    position: "fixed",
    top: "42%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: 4,
    width: "90%",
    maxWidth: 450,
    background: "white",
    boxShadow: 24,
    padding: 3.7,
};

function FacultyCourseDetailModal({
    open,
    setOpen,
    title = "",
    message = "",
    employeeId,
    handleSubmit,
    handleCancel
}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const { setAlertMessage, setAlertOpen } = useAlert();
    const [selectedValue, setSelectedValue] = useState(null)
    useEffect(() => {
        getData()
    }, [employeeId])

    const getData = async () => {
        setLoading(true)
        await axios
          .get(
            `/api/student/getCourseDetailsDataFromFeedBack/${employeeId}`
          )
          .then((res) => {
            const {data} = res?.data
            if (data?.length) {
                const courseData = data?.map((course)=>(
                    {value: course?.course_id, label: course?.course_name}
                ))
                setData(courseData);
            }
            setLoading(false)
          })
          .catch((err) => {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: err?.response?.data?.message,
            });
          });
      };

      const handleSelectCourse = (name, value ) =>{
         setSelectedValue(value)
      }

      const handleCancelCourse = () =>{
        setSelectedValue('')
        if(handleCancel){
            handleCancel()
        }
      }

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <IconButton
                    style={{ position: "absolute", top: 3, right: 3 }}
                    onClick={() => setOpen(false)}
                >
                    <CloseRoundedIcon />
                </IconButton>
                {title.length > 0 && (
                    <Typography marginRight={3} variant="h6">
                        {title}
                    </Typography>
                )}
                {message.length > 0 && (
                    <Typography sx={{ marginTop: 1, fontSize: "15px" }} marginRight={3}>
                        {message}
                    </Typography>
                )}
                <Grid item   mt={3}>
                <CustomAutocomplete
                name="courseId"
                label="Course"
                value={selectedValue}
                options={data}
                handleChangeAdvance={handleSelectCourse}
              />
                </Grid>
                <Grid
                    container
                    mt={3}
                    alignItems="center"
                    justifyContent="flex-end"
                    rowSpacing={1}
                    columnSpacing={1}
                    gap={1}
                >
                            <Button
                                variant="outlined"
                                disableElevation
                                style={{ borderRadius: 7 }}
                                color='primary'
                                onClick={handleCancelCourse}
                            >
                                <strong>Cancel</strong>
                            </Button>
                            <Button
                                variant="contained"
                                disableElevation
                                style={{ borderRadius: 7 }}
                                color='primary'
                                onClick={() =>  handleSubmit(selectedValue)}
                                disabled={!selectedValue}
                            >
                                <strong>Submit</strong>
                            </Button>
                </Grid>
            </Box>
        </Modal>
    );
}

export default FacultyCourseDetailModal;
