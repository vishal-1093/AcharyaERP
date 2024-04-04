import React, {
  Fragment,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Box,
  Grid,
  Button,
  TableContainer,
  Paper,
} from "@mui/material";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import axios from "../../../../services/Api";
import { convertUTCtoTimeZone } from "../../../../utils/DateTimeUtils";
import { convertDateFormat, convertDateYYYYMMDD } from "../../../../utils/Utils";
const CustomDatePicker = lazy(() => import("../../../../components/Inputs/CustomDatePicker"));
const ModalWrapper = lazy(() => import("../../../../components/ModalWrapper"));

const initialValues = {
  month: convertUTCtoTimeZone(new Date()),

};
const mLocalizer = momentLocalizer(moment);

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "lightblue",
    },
  });

export default function RefreshmentCalenderView({
  localizer = mLocalizer,
  showDemoLink = true,
  selectedEmpId,
  ...props
}) {
  const roleName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;
  const [values, setValues] = useState(initialValues);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { components, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      views: ["month", "week", "day"],
    }),
    []
  );
  const [events, setEvents] = useState([]);
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getEventData();
    setCrumbs([{ name: "Refreshment Calender View" }]);
  }, [selectedEmpId]);

  const handleSelectEvent = useCallback((selectedEvent) => {
    setSelectedEvent(selectedEvent);
    setIsModalOpen(true)
  }, []);
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getEventData = async () => {
    const selectedDate = new Date(values.month);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    await axios
      .get(`/api/messDataForCalendarView/${convertDateYYYYMMDD(firstDayOfMonth)}`)
      .then(async (res) => {

        const tempEvents = res.data.data.map((obj) => ({
          id: obj?.id,
          title: obj?.mess_meal_type,
          start: new Date(obj?.date),
          end: new Date(obj?.date),
          resource: obj?.menu_contents,
          description: obj?.menu_contents,
          mealType: obj?.mess_meal_type,
        }));

        setEvents([
          ...tempEvents,
        ]);
      })
      .catch((err) => console.error(err));
  };
  const modalData = () => {

    return (
      <>
        <Grid container justifyContent="flex-start" alignItems="center">
          <Grid item xs={12} md={12} mt={1}>
            <TableContainer component={Paper} elevation={3}>
              <Table >
                <TableHead>
                  <TableRow >
                    <TableCell sx={{ color: "black" }}>Mess Type</TableCell>
                    <TableCell sx={{ color: "black" }}>Menu Content</TableCell>
                    <TableCell sx={{ color: "black" }}> DATE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  <TableRow >
                    <TableCell>{selectedEvent?.title}</TableCell>
                    <TableCell style={{ paddingLeft: 30 }}>{selectedEvent?.description ? selectedEvent?.description : "--"}</TableCell>
                    <TableCell style={{ paddingLeft: 10 }}>{selectedEvent?.start ? convertDateFormat(selectedEvent?.start) : "--"}</TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </>
    );
  };


  return (
    <>

      <ModalWrapper
        maxWidth={900}
        title='Meal Details'
        open={isModalOpen}
        setOpen={setIsModalOpen}
      >
        {modalData()}
      </ModalWrapper>
      <Box
        container

        sx={{ padding: 3 }}  >
        <Grid container columnSpacing={4} mt={1} rowSpacing={2}>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="month"
              label="Month"
              value={values.month}
              handleChangeAdvance={handleChangeAdvance}
              views={["month", "year"]}
              openTo="month"
              inputFormat="MM/YYYY"
              required

            />
          </Grid>

          <Grid item xs={12} md={8} align="right">
            <Button
              variant="contained"
              onClick={getEventData}
              disabled={
                values.month === null || values.month === "Invalid Date"
              }
            >
              GO
            </Button>
          </Grid>

        </Grid>
        <Fragment>
          <div style={{ height: "80vh", marginBottom: 40, marginTop: 20 }} className="height600" {...props}>
            <Calendar
              components={components}
              events={events}
              localizer={localizer}
              showMultiDayTimes
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              step={60}
              views={views}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={(event, start, end, isSelected) => {
                const style = {

                  backgroundColor: "lightblue",
                };

                // Customize styles based on meal type
                if (event.mealType === "Breakfast") {
                  style.border = "1px solid #000";
                  style.backgroundColor = "#1C2B7C"
                  // Add borders or any specific style
                } else if (event.mealType === "Lunch") {
                  style.border = "1px solid #00F";
                  style.backgroundColor = "green"
                } else if (event.mealType === "Snacks") {
                  style.border = "1px solid #0F0";
                } else if (event.mealType === "Dinner") {
                  style.backgroundColor = "red"
                }

                return {
                  className: isSelected ? "selected-event" : "",
                  style,
                };
              }}
            />
          </div>
        </Fragment>
      </Box>
    </>
  );
}
