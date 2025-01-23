import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "../../services/Api";
import { Dialog, DialogTitle, DialogContent, Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import GridIndex from "../../components/GridIndex";
import CustomSelect from "../../components/Inputs/CustomSelect";
import OverlayLoader from "../../components/OverlayLoader";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { checkFullAccess } from "../../utils/DateTimeUtils";

const FacultyDetailsAttendanceReportView = () => {
  const location = useLocation();
  const { eventDetails } = location.state;
  const [Data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updateModel, setUpdateModel] = useState(false);
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getdata();
    setCrumbs([
      { name: "Calendar", link: "/SchedulerMaster" },
      { name: "Attendance" },
    ]);
  }, []);

  const getdata = async () => {
    setLoader(true);
    await axios
      .get(
        `/api/academic/getInternalAttendanceDetailsOfStudent/${eventDetails.id}`
      )

      .then((res) => {
        setLoader(false);
        const result = res.data.data?.map((_data, index) => ({
          ..._data,
          id: index,
          selected: false,
          present: _data?.present_status ? "P" : "A",
        }));
        setData(result);
      })
      .catch((err) => console.error(err));
  };

  const handleEditClick = (item, index) => {
    if (item && item.present_status) {
      setEditingStudent({ ...item, index: index });
      setNewStatus(item.present_status);
    } else {
      console.error("Invalid item or item.present_status");
    }
  };

  const updateAttendance = async () => {
    const payload = [
      {
        exam_attendance_id: editingStudent?.exam_attendance_id,
        active: true,
        course_assignment_id: editingStudent?.course_assignment_id,
        course_id: editingStudent?.course_id,
        present_status: newStatus ? "P" : "A",
        emp_id: editingStudent?.emp_id,
        exam_date: editingStudent?.exam_date,
        exam_room_id: editingStudent?.exam_room_id,
        exam_time: editingStudent?.exam_time,
        internal_id: editingStudent?.internal_id,
        internal_time_table_id: editingStudent?.internal_time_table_id,
        internal_timetable_assignment_id:
          editingStudent?.internal_timetable_assignment_id,
        remarks: editingStudent?.remarks,
        room_id: editingStudent?.room_id,
        student_id: editingStudent?.student_id,
        week_day: editingStudent?.week_day,
      },
    ];

    await axios
      .put(`/api/academic/internalAttendance/${editingStudent?.id}`, payload)
      .then((res) => {
        if (res?.data?.success) {
          setEditingStudent(null);
          getdata();
        }
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "student_name", headerName: "Name", flex: 1 },
    {
      field: "present_status",
      headerName: "Attendance",
      flex: 1,
      renderCell: (params) => (
        <>
          <p>{params.row?.present_status}</p>
          {checkFullAccess() && (
            <EditIcon
              onClick={() => handleEditClick(params.row, params.row.index)}
              sx={{ marginLeft: 3 }}
            />
          )}
        </>
      ),
    },
  ];

  const onSelectionModelChange = (ids) => {
    const selectedRow = ids.map((val) => Data.find((row) => row.id === val));
    setSelectedRows([...selectedRow]);
  };

  const updateAttendanceInBulk = async () => {
    const ids = selectedRows?.map((id) => id?.id);

    const payload = selectedRows?.map((editingStudent) => {
      return {
        exam_attendance_id: editingStudent?.exam_attendance_id,
        active: true,
        course_assignment_id: editingStudent?.course_assignment_id,
        course_id: editingStudent?.course_id,
        present_status: newStatus ? "P" : "A",
        emp_id: editingStudent?.emp_id,
        exam_date: editingStudent?.exam_date,
        exam_room_id: editingStudent?.exam_room_id,
        exam_time: editingStudent?.exam_time,
        internal_id: editingStudent?.internal_id,
        internal_time_table_id: editingStudent?.internal_time_table_id,
        internal_timetable_assignment_id:
          editingStudent?.internal_timetable_assignment_id,
        remarks: editingStudent?.remarks,
        room_id: editingStudent?.room_id,
        student_id: editingStudent?.student_id,
        week_day: editingStudent?.week_day,
      };
    });

    await axios
      .put(`/api/academic/internalAttendance/${ids?.join(",")}`, payload)
      .then((res) => {
        if (res?.data?.success) {
          setUpdateModel(false);
          setSelectedRows([]);
          getdata();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        {checkFullAccess() && (
          <Button
            variant="contained"
            color="success"
            disabled={selectedRows?.length === 0}
            onClick={() => {
              setUpdateModel(true);
              setNewStatus("P");
            }}
            sx={{ marginLeft: "4px", mb: 2 }}
          >
            Update Attendance
          </Button>
        )}
      </Box>

      {loader ? (
        <OverlayLoader />
      ) : (
        <GridIndex
          rows={Data}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
        />
      )}

      <Dialog
        open={editingStudent !== null}
        onClose={() => setEditingStudent(null)}
      >
        <DialogTitle>Update Attendance</DialogTitle>
        <DialogContent>
          <CustomSelect
            name="present_status"
            value={newStatus}
            items={[
              { label: "P", value: true },
              { label: "A", value: false },
            ]}
            handleChange={(e) => {
              setEditingStudent((prev) => ({
                ...prev,
                present_status: e.target.value,
              }));
              setNewStatus(e.target.value);
            }}
          />

          <div style={{ marginTop: 10 }}>
            <Button
              color="primary"
              style={{ marginRight: 10 }}
              onClick={() => updateAttendance()}
            >
              Save
            </Button>
            <Button onClick={() => setEditingStudent(null)} color="primary">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={updateModel} onClose={() => setUpdateModel(false)}>
        <DialogTitle>Update Attendance in bulk</DialogTitle>
        <DialogContent>
          <CustomSelect
            name="present_status"
            value={newStatus}
            items={[
              { label: "P", value: true },
              { label: "A", value: false },
            ]}
            handleChange={(e) => {
              setNewStatus(e.target.value);
            }}
          />

          <div style={{ marginTop: 10 }}>
            <Button
              color="primary"
              style={{ marginRight: 10 }}
              onClick={() => updateAttendanceInBulk()}
            >
              Save
            </Button>
            <Button onClick={() => setUpdateModel(false)} color="primary">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultyDetailsAttendanceReportView;
