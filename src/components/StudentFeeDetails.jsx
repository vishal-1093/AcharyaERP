import { useEffect, useState } from "react";
import axios from "../services/Api";

function StudentFeeDetails({ id = 20 }) {
  useEffect(() => {
    getFeeData();
  }, []);

  const getFeeData = async () => {
    try {
      const response = await axios.get(`/api/student/getStudentDues/${id}`);
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  return <div></div>;
}

export default StudentFeeDetails;
