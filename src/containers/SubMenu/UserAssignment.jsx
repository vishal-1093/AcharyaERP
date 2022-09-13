import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomTextField from "../../components/Inputs/CustomTextField";
import FormLayout from "../../components/FormLayout";
import Form from "../../components/Form";
import CustomSelect from "../../components/Inputs/CustomSelect";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import ApiUrl from "../../services/Api";
import CustomButton from "../../components/Inputs/CustomButton";
import { useParams } from "react-router-dom";
import GridIndex from "../../components/GridIndex";
import Checkbox from "@mui/material/Checkbox";
function UserAssignment() {
  useEffect(() => {
    fetchSubmenuDetails();
    fetchUserDetails();
  }, []);

  const [Storedata, setStoredata] = useState([]);
  const [open, setOpen] = useState(true);
  const [SubmenuDetails, setSubmenuDetails] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { id } = useParams();

  const fetchSubmenuDetails = async () => {
    axios
      .get(`${ApiUrl}/SubMenu/${id}`)
      .then((response) => {
        console.log(response);

        setSubmenuDetails(response.data.data);
      })
      .catch((err) => console.log(err));
  };
  const fetchUserDetails = async () => {
    axios.get(`${ApiUrl}/UserAuthentication`).then((response) => {
      setAllUsers(response.data.data);
    });
  };

  return (
    <>
      <Dialog open={open}>
        <DialogContent>
          {allUsers.map((user) => {
            return (
              <>
                <option>
                  {user.username}
                  <br />
                </option>
              </>
            );
          })}
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
}
export default UserAssignment;
