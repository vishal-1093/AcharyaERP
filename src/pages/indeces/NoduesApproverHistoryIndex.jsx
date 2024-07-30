import { useEffect, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

import moment from "moment";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function NoduesApproverHistoryIndex() {
  const [rows, setRows] = useState([]);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([
      { name: "No Due Approval", link: "/nodue-approver" },
      { name: "History" },
    ]);
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllNoDuesDetailsBasedOnUserId?page=0&page_size=10000&sort=created_date&UserId=${userId}`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hideable: false },
    {
      field: "employee_name",
      headerName: "Emp Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "designation_name",
      headerName: "Designation",
      flex: 1,
      hideable: false,
    },
    { field: "dept_name", headerName: "Department", flex: 1, hideable: false },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      flex: 1,
      hideable: false,
    },
    {
      field: "employee_reason",
      headerName: "Reason",
      flex: 1,
      hideable: false,
    },
    {
      field: "additional_reason",
      headerName: "Additional Reason",
      flex: 1,
      hideable: false,
    },
    {
      field: "created_date",
      headerName: "Initiated Date",
      flex: 1,
      hideable: false,
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "requested_relieving_date",
      headerName: "Requested Date",
      flex: 1,
      hideable: false,
      valueGetter: (params) =>
        moment(params.row.requested_relieving_date).format("DD-MM-YYYY"),
    },
    {
      field: "noDueComments",
      headerName: "Approver Comments",
      flex: 1,
      hideable: false,
    },
    {
      field: "noDueCreatedDate",
      headerName: "Approve Date",
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        moment(params.row.noDueCreatedDate).format("DD-MM-YYYY"),
    },
  ];

  return <GridIndex rows={rows} columns={columns} />;
}

export default NoduesApproverHistoryIndex;
