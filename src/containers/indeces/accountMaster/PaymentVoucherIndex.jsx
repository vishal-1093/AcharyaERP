import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Button, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  },
  th: {
    border: "1px solid black",
    padding: "10px",
    textAlign: "center",
  },
  td: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
  },
  yearTd: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "right",
  },
}));

function PaymentVoucherIndex() {
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [jvWrapperOpen, setJvWrapperOpen] = useState(false);
  const [voucherData, setVoucherData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Payment Voucher Index" }]);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`/api/finance/fetchAllPaymentVoucher`, {
        params: { page: 0, page_size: 10000, sort: "created_date" },
      });

      setRows(response.data.data.Paginated_data.content);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleVerify = async (data) => {
    setRowData(data);
    setJvWrapperOpen(true);

    try {
      const response = await axios.get(
        `/api/finance/getDraftPaymentVoucherData/${data.voucher_no}/${data.school_id}/${data.financial_year_id}`
      );
      setVoucherData(response.data.data);
      console.log(response);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const updateVerify = async () => {
    const Ids = [];

    voucherData.map((obj) => {
      Ids.push(obj.id);
    });

    const putData = voucherData.map((obj) => ({
      ...obj,
      draft_payment_voucher_id: obj.id,
      approver_id: userID,
      approved_status: 1,
      approved_date: new Date(),
    }));

    const postData = voucherData.map((obj) => {
      const { financial_year_id, financial_year, id, voucher_no, ...rest } =
        obj;
      return rest;
    });

    const mainData = postData.map((obj) => ({
      ...obj,
      approver_id: userID,
      approved_status: 1,
      approved_date: new Date(),
    }));

    try {
      const response = await axios.put(
        `/api/finance/updateDraftPaymentVoucher/${Ids?.toString()}`,
        putData
      );

      try {
        const response = await axios.post(
          `/api/finance/PaymentVoucher`,
          mainData
        );

        if (response.status === 200 || response.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Approved Successfully",
          });
          getData();
          setAlertOpen(true);
          setJvWrapperOpen(false);
        }
      } catch (error) {
        console.log(error);
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
        setAlertOpen(true);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    // {
    //   field: "id",
    //   headerName: "Approve",
    //   flex: 1,
    //   renderCell: (params) =>
    //     params.row.created_by === userID ? (
    //       <Typography variant="subtitle2" color="green">
    //         Verified
    //       </Typography>
    //     ) : params.row.verifier_id === userID ? (
    //       <Typography variant="subtitle2" color="green">
    //         Verified
    //       </Typography>
    //     ) : (
    //       <IconButton onClick={() => handleVerify(params.row)}>
    //         <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
    //       </IconButton>
    //     ),
    // },
    { field: "debit_total", headerName: "Amount", flex: 1 },
    { field: "pay_to", headerName: "Vendor", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "dept_name", headerName: "Dept", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (params) => moment(params.value).format("DD-MM-YYYY LT"),
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
  ];

  return (
    <>
      <ModalWrapper
        open={jvWrapperOpen}
        setOpen={setJvWrapperOpen}
        maxWidth={1000}
      >
        <div
          style={{
            border: "1px solid black",
            justifyContent: "flex-start",
            alignItems: "center",
            rowGap: 2,
            columnGap: 2,
          }}
        >
          <div style={{ textAlign: "center", borderBottom: "1px solid black" }}>
            <h4>PAYMENT VOUCHER</h4>
          </div>

          <div style={{ flexDirection: "row", display: "flex" }}>
            <div
              style={{
                width: "50%",
                padding: "4px",
              }}
            >
              <p>
                <b> School : </b> {`${voucherData?.[0]?.school_name_short}`}
              </p>
            </div>

            <div
              style={{
                width: "25%",
                padding: "4px",
              }}
            ></div>

            <div
              style={{
                width: "25%",
                padding: "4px",
              }}
            >
              <p>
                <b> Cheque No. : </b> {`${voucherData?.[0]?.cheque_dd_no}`}
              </p>
            </div>
          </div>

          <div style={{ flexDirection: "row", display: "flex" }}>
            <div
              style={{
                width: "50%",
                padding: "4px",
              }}
            >
              <p>
                <b> Pay To : </b> {`${voucherData?.[0]?.pay_to}`}
              </p>
            </div>

            <div
              style={{
                width: "25%",
                padding: "4px",
              }}
            ></div>

            <div
              style={{
                width: "25%",
                padding: "4px",
              }}
            >
              <p>
                <b> Dept : </b> {`${voucherData?.[0]?.dept_name}`}
              </p>
            </div>
          </div>

          {/*table container */}

          <div class="table-container" style={{ padding: 10 }}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.th}>Inter School</th>
                  <th className={classes.th}>Vendor</th>
                  <th className={classes.th}>JV School</th>
                  <th className={classes.th}>JV FC Year</th>
                  <th className={classes.th}>Debit</th>
                </tr>
              </thead>
              <tbody>
                {voucherData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className={classes.td}>{item.school_name_short}</td>
                      <td className={classes.td}>{item.vendor_name}</td>
                      <td className={classes.td}>{item.school_name_short}</td>
                      <td className={classes.td}>{item.financial_year}</td>
                      <td className={classes.yearTd}>{item.debit}</td>
                    </tr>
                  );
                })}
                <tr>
                  <th className={classes.th} colSpan={4}>
                    Total
                  </th>
                  <td className={classes.yearTd} colSpan={4}>
                    {voucherData?.[0]?.debit_total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 8, textAlign: "right" }}>
          <Button variant="contained" sx={{ marginRight: 2 }} color="error">
            REJECT
          </Button>
          <Button onClick={updateVerify} variant="contained" color="success">
            APPROVE
          </Button>
        </div>
      </ModalWrapper>

      <GridIndex rows={rows} columns={columns} />
    </>
  );
}

export default PaymentVoucherIndex;
