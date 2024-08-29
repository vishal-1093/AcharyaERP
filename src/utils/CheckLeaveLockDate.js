import axios from "../services/Api";
import moment from "moment";

export const CheckLeaveLockDate = async (month, year) => {
  if (!month || !year) {
    return;
  }

  try {
    const response = await axios.get(
      `/api/lockScreen/getLockDateDetailsData/${month}/${year}`
    );
    let lockDate = moment(`${year}-${month}-05`, "YYYY-MM-DD");

    if (response.data.data.length > 0) {
      const leaveLockDate = response.data.data[0]?.leave_lock_date;
      if (leaveLockDate) {
        lockDate = moment(leaveLockDate, "YYYY-MM-DD");
      }
    }
    const currentDate = moment();

    return currentDate.isAfter(lockDate);
  } catch (err) {}
};
