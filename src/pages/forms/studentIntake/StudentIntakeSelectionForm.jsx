import { useEffect, useState } from "react";
import StudentIntakeForm from "./StudentIntakeForm";
import StudentIntakeAssignmentForm from "./StudentIntakeAssignmentForm";
import useAlert from "../../../hooks/useAlert";
import axios from "../../../services/Api";

const initialValues = {
  acYearId: null,
  schoolId: null,
  programAssignmentId: null,
  admCategoryId: [],
};

const requiredFields = ["acYearId", "schoolId", "programAssignmentId"];

function StudentIntakeSelection() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [admSubCategoryOptions, setAdmSubCategoryOptions] = useState([]);
  const [programId, setProgramId] = useState(null);
  const [programAssigmentId, setProgramAssignmentId] = useState(null);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programAssignmentId") {
      await axios
        .get(`/api/academic/fetchAllProgramsWithProgramType/${values.schoolId}`)
        .then((res) => {
          res.data.data.filter((val) => {
            if (val.program_assignment_id === newValue) {
              setProgramId(val.program_id);
              setProgramAssignmentId(val.program_assignment_id);
            }
          });
        })
        .catch((err) => console.error(err));
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const checks = {};

  const handleSelectAll = (name, options) => {
    setValues((prev) => ({
      ...prev,
      [name]: options.map((obj) => obj.value),
    }));
  };
  const handleSelectNone = (name) => {
    setValues((prev) => ({ ...prev, [name]: [] }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleClick = () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please all the required fields",
      });
      setAlertOpen(true);
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    getAcademicYearOptions();
    getSchoolNameOptions();
    getAdmSubCategoryData();
  }, []);

  useEffect(() => {
    getProgramData();
  }, [values.schoolId]);

  const getAcademicYearOptions = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getSchoolNameOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolNameOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramData = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/academic/fetchAllProgramsWithProgramType/${values.schoolId}`)
        .then((res) => {
          setProgramOptions(
            res.data.data.map((obj) => ({
              value: obj.program_assignment_id,
              label: obj.program_name,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getAdmSubCategoryData = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        setAdmSubCategoryOptions(
          res.data.data.map((obj) => ({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_short_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      {open ? (
        <StudentIntakeAssignmentForm
          data={values}
          programId={programId}
          programAssigmentId={programAssigmentId}
        />
      ) : (
        <StudentIntakeForm
          values={values}
          academicYearOptions={academicYearOptions}
          SchoolNameOptions={SchoolNameOptions}
          programOptions={programOptions}
          admSubCategoryOptions={admSubCategoryOptions}
          programId={programId}
          handleChangeAdvance={handleChangeAdvance}
          handleSelectAll={handleSelectAll}
          handleSelectNone={handleSelectNone}
          requiredFields={requiredFields}
          handleClick={handleClick}
        />
      )}
    </>
  );
}
export default StudentIntakeSelection;
