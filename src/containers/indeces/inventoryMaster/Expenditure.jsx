import { useState, useEffect } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import Consumables from "../../../pages/masters/Consumables";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function Expenditure() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [legderOptions, setLegderOptions] = useState([]);
  const [values, setValues] = useState({ ledgerId: null });

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { groupName, groupId } = useParams();

  useEffect(() => {
    getLedgerOptions();
  }, []);

  const getLedgerOptions = async () => {
    await axios
      .get(`/api/purchase/getLegderbyGroupId?groupId=${groupId}`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.ledger_id,
            label: obj.ledger_name,
          });
        });
        setLegderOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "item_names", headerName: "Name", flex: 1 },
    { field: "item_short_name", headerName: " Short Name", flex: 1 },
    { field: "item_type", headerName: "Item Type", flex: 1 },
    { field: "ledger_name", headerName: "Ledger", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.created_date
          ? params.row.created_date.slice(0, 10).split("-").reverse().join("-")
          : "Na",
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/InventoryMaster/Item/Update/${params.row.id}`)
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },

    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Consumables" }, { name: `${groupName}` }]);
  }, [groupName]);

  const getData = async () => {
    await axios
      .get(
        `/api/inventory/fetchAllItemsCreationDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/inventory/itemsCreation/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/inventory/activateItemsCreation/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };

    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Grid
          container
          justifycontents="flex-start"
          alignItems="center"
          rowSpacing={2}
        >
          <Grid item xs={12}>
            <Consumables groupName={groupName} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              label="Ledger"
              name="ledgerId"
              value={values.ledgerId}
              options={legderOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <GridIndex rows={rows} columns={columns} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Expenditure;
