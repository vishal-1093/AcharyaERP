import axios from "../services/Api";
import moment from "moment";

export const CheckLeaveLockDate = async (fromDate) => {
  if (!fromDate) {
    return;
  }

  try {
    const month = moment(fromDate).format("MM");
    const year = moment(fromDate).format("YYYY");

    const response = await axios.get(
      `/api/lockScreen/getLockDateDetailsData/${month}/${year}`
    );

    let lockDate = moment(fromDate)
      .clone()
      .add(1, "months")
      .date(5)
      .format("YYYY-MM-DD");

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
