import { useState } from "react";
import StudentIntakeForm from "./StudentIntakeForm";
import StudentIntakeAssignmentForm from "./StudentIntakeAssignmentForm";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  acYearId: null,
  schoolId: null,
  programId: null,
  admSubCategoryId: [],
};

const requiredFields = ["acYearId", "schoolId", "programId"];

function StudentIntakeSelection() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const handleChangeAdvance = async (name, newValue) => {
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

  return (
    <>
      {open ? (
        <StudentIntakeAssignmentForm data={values} />
      ) : (
        <StudentIntakeForm
          values={values}
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
