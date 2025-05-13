import { useEffect, useState } from "react";
import axios from "../services/Api";

function StudentRefundDetails({ id }) {
  useEffect(() => {
    getRefundData();
  }, []);

  const getRefundData = async () => {
    try {
      const response = await axios.get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForRefund/${id}`
      );
      console.log(response);
    } catch {}
  };
  return <>hai</>;
}
export default StudentRefundDetails;
