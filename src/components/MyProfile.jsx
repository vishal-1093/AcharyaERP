import { Box } from "@mui/material";
import EmployeeDetailsView from "./EmployeeDetailsView";
import StudentDetailsView from "./StudentDetailsView";

function MyProfile() {
  const userType = sessionStorage.getItem("usertype");
  return (
    <>
      <Box m={2}>
        {userType?.toLowerCase() === "staff" ? (
          <EmployeeDetailsView />
        ) : (
          <StudentDetailsView />
        )}
      </Box>
    </>
  );
}

export default MyProfile;
