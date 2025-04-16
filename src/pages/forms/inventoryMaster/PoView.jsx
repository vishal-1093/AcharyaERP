import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import numberToWords from "number-to-words";
import moment from "moment";

function PoView({ temporaryPurchaseOrderId }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [qtyTotal, setQtyTotal] = useState();
  const [costValue, setCostValue] = useState();
  const [gstValue, setGstValue] = useState();
  const [discValue, setDiscValue] = useState();
  const [schoolName, setSchoolName] = useState("");

  const { id } = useParams();

  useEffect(() => {
    getData();
    getSchoolData();
  }, []);

  useEffect(() => {
    const val = data[0]?.purchaseOrder?.purchaseItems?.reduce(
      (a, b) => a + b.totalAmount,
      0
    );
    setTotal(val);

    const costTotal = data[0]?.purchaseOrder?.purchaseItems?.reduce(
      (a, b) => Number(a) + Number(b.costTotal),
      0
    );

    setCostValue(costTotal);

    const gstTotal = data[0]?.purchaseOrder?.purchaseItems?.reduce(
      (a, b) => Number(a) + Number(b.gstTotal),
      0
    );

    setGstValue(gstTotal);

    const discTotal = data[0]?.purchaseOrder?.purchaseItems?.reduce(
      (a, b) => Number(a) + Number(b.discountTotal),
      0
    );

    setDiscValue(discTotal);

    const quantityTotal = data[0]?.purchaseOrder?.purchaseItems?.reduce(
      (a, b) => a + b.quantity,
      0
    );
    setQtyTotal(quantityTotal);
  }, [data]);

  const getData = async () => {
    await axios
      .get(
        `/api/purchase/getPurchaseOrderById?id=${
          id ?? temporaryPurchaseOrderId
        }`
      )
      .then((res) => {
        console.log("res", res);

        const temp = [];
        getSchoolData(res.data.data.purchaseOrder.instituteId);
        temp.push(res.data.data);
        setData(temp);
      })
      .catch((error) => console.error(error));
  };

  console.log(data);

  const getSchoolData = async (instituteId) => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        res.data.data.filter((obj) => {
          if (obj.school_id === instituteId) {
            setSchoolName(obj.school_name);
          }
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box>
      <div style={{ border: "1px solid black", width: "100%" }}>
        <div style={{ textAlign: "center", borderBottom: "1px solid black" }}>
          <h4>PURCHASE ORDER - {data[0]?.purchaseOrder?.requestType}</h4>
        </div>
        <div style={{ flexDirection: "row", display: "flex" }}>
          <div
            style={{
              width: "50%",
              borderRight: "1px solid black",
              padding: "12px",
            }}
          >
            <p style={{ fontWeight: "bold" }}>Invoice To:</p>
            <p>{schoolName}</p>
            <p>No.89/90, Soladevanahalli,</p>
            <p>Hesaraghatta Main Road, Chikbanavara,</p>
            <p>Bangalore - 560090</p>
            <p>Email-Id: purchase@acharya.ac.in</p>
            <p>State Name: Karnataka Code: 29</p>
          </div>
          <div style={{ width: "50%" }}>
            <div style={{ flexDirection: "row", display: "flex" }}>
              <div
                style={{
                  width: "50%",
                  borderRight: "1px solid black",
                  borderBottom: "1px solid black",
                  padding: "25px",
                }}
              >
                <p style={{ fontWeight: "bold" }}>Purchase No. :</p>
                <p>{data?.[0]?.purchaseOrder?.poReferenceNo}</p>
              </div>
              <div
                style={{
                  width: "50%",
                  borderBottom: "1px solid black",
                  padding: "25px",
                }}
              >
                <p style={{ fontWeight: "bold" }}>Date :</p>
                <p>
                  {moment(data[0]?.purchaseOrder?.quotationDate).format(
                    "DD-MM-YYYY"
                  )}
                </p>
              </div>
            </div>
            <div style={{ flexDirection: "row", display: "flex" }}>
              <div
                style={{
                  width: "50%",
                  borderRight: "1px solid black",
                  padding: "25px",
                }}
              >
                <p style={{ fontWeight: "bold" }}>Quotation No. : </p>
                <p> {data[0]?.purchaseOrder?.quotationNo}</p>
              </div>
              <div
                style={{
                  width: "50%",

                  padding: "25px",
                }}
              >
                <p style={{ fontWeight: "bold" }}>Destination : </p>
                <p>{data[0]?.purchaseOrder?.destination}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ flexDirection: "row", display: "flex" }}>
        <div
          style={{
            width: "50%",
            borderRight: "1px solid black",
            borderBottom: "1px solid black",
            borderLeft: "1px solid black",
            padding: "5px",
          }}
        >
          <p style={{ fontWeight: "bold" }}>Supplier :</p>
          <p>{data[0]?.vendor?.vendor_name}</p>
          <p> {data[0]?.vendor?.street_name}</p>
          <p> {data[0]?.vendor?.area}</p>
          <p>
            {data[0]?.vendor?.city_name} , {data[0]?.vendor?.state_name} -{" "}
            {data[0]?.pin_code}
          </p>
          <p>GST No. : {data[0]?.vendor?.vendor_gst_no} </p>
          <p>Email Id : {data[0]?.vendor?.vendor_email}</p>
          <p>Ph No. : {data[0]?.vendor?.vendor_contact_no}</p>
          <p>PAN No. : {data[0]?.vendor?.pan_number}</p>

          <p style={{ marginTop: "10px" }}>
            Kind Attention :{" "}
            {data[0]?.vendor?.vendor_address
              ? `Mr/Mrs. ${data[0]?.vendor?.vendor_address}`
              : ""}
          </p>
        </div>
        <div
          style={{
            width: "50%",
            borderRight: "1px solid black",
            borderBottom: "1px solid black",
          }}
        >
          <div style={{ flexDirection: "row", display: "flex" }}>
            <div
              style={{
                width: "50%",
                borderRight: "1px solid black",
                borderBottom: "1px solid black",
                padding: "25px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>Other References : </p>
              <p>{data[0]?.purchaseOrder?.otherReference}</p>
            </div>
            <div
              style={{
                width: "50%",
                borderBottom: "1px solid black",
                padding: "25px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>Payment Type : </p>
              <p> {data[0]?.purchaseOrder?.accountPaymentType}</p>
            </div>
          </div>
          <div style={{ padding: "20px" }}>
            <p style={{ fontWeight: "bold" }}>Terms and Conditions :</p>
            <div
              dangerouslySetInnerHTML={{
                __html: `<p> ${data[0]?.purchaseOrder?.termsAndConditions?.replaceAll(
                  "\n",
                  "<br>"
                )}</p>`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div
        style={{
          borderCollapse: "collapse",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tr>
            <th
              style={{
                border: "1px solid black",
                width: "10%",
              }}
            >
              Sl No.
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "30%",
              }}
            >
              Goods Description / Service
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "8%",
              }}
            >
              Qty
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "10%",
              }}
            >
              Rate
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "10%",
              }}
            >
              Cost
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "10%",
              }}
            >
              UOM
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "7%",
              }}
            >
              GST %
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "7%",
              }}
            >
              DISC %
            </th>
            <th
              style={{
                border: "1px solid black",
                width: "10%",
              }}
            >
              Amount
            </th>
          </tr>

          {data[0]?.purchaseOrder?.purchaseItems?.map((obj, i) => {
            return (
              <>
                <tr key={i}>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      width: "10%",
                    }}
                  >
                    {i + 1}
                  </td>
                  <td
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "5px",
                      border: "1px solid black",
                      width: "30%",
                    }}
                  >
                    {obj?.itemName}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      width: "8%",
                      textAlign: "right",
                      padding: "10px",
                    }}
                  >
                    {obj?.quantity}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      width: "10%",
                      textAlign: "right",
                      padding: "10px",
                    }}
                  >
                    {obj?.rate}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      width: "10%",
                      textAlign: "right",
                      padding: "10px",
                    }}
                  >
                    {obj?.rate * obj?.quantity}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid black",
                      width: "10%",
                    }}
                  >
                    {obj?.measureShortName}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      width: "7%",
                      textAlign: "right",
                      padding: "10px",
                    }}
                  >
                    {obj?.gst ?? 0}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      width: "7%",
                      textAlign: "right",
                      padding: "10px",
                    }}
                  >
                    {obj?.discount ?? 0}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      width: "10%",
                      textAlign: "right",
                      padding: "10px",
                    }}
                  >
                    {Math.round(obj?.totalAmount)}
                  </td>
                </tr>
              </>
            );
          })}

          <tr>
            <td
              style={{
                textAlign: "left",
                border: "1px solid black",
                width: "10%",
              }}
            ></td>
            <td
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: "5px",
                width: "30%",
                textAlign: "center",
              }}
            >
              Total
            </td>
            <td
              style={{
                border: "1px solid black",
                width: "8%",
                textAlign: "right",
                padding: "10px",
              }}
            >
              {qtyTotal}
            </td>

            <td
              style={{
                width: "10%",
                textAlign: "right",
                padding: "10px",
                border: "1px solid black",
              }}
            ></td>
            <td
              style={{
                border: "1px solid black",
                width: "10%",
                textAlign: "right",
                padding: "10px",
              }}
            >
              {Math.round(costValue)}
            </td>
            <td
              style={{
                textAlign: "center",
                width: "10%",
              }}
            ></td>
            <td
              style={{
                width: "7%",
                textAlign: "right",
                padding: "10px",
                border: "1px solid black",
              }}
            ></td>
            <td
              style={{
                width: "7%",
                textAlign: "right",
                padding: "10px",
              }}
            ></td>
            <td
              style={{
                border: "1px solid black",
                width: "10%",
                textAlign: "right",
                padding: "10px",
              }}
            >
              {Math.round(total)}
            </td>
          </tr>

          <tr>
            <td
              style={{
                textAlign: "left",
                border: "1px solid black",
                width: "10%",
              }}
            ></td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
                fontWeight: "bold",
              }}
              colspan="7"
            >
              Cost Total
            </td>
            <td
              style={{
                border: "1px solid black",
                textAlign: "right",
                padding: "5px",
              }}
            >
              {Math.round(costValue)}
            </td>
          </tr>
          <tr>
            <td
              style={{
                textAlign: "left",
                border: "1px solid black",
                width: "10%",
              }}
            ></td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
                fontWeight: "bold",
              }}
              colspan="7"
            >
              Gst Total
            </td>
            <td
              style={{
                border: "1px solid black",
                textAlign: "right",
                padding: "5px",
              }}
            >
              {Math.round(gstValue)}
            </td>
          </tr>

          <tr>
            <td
              style={{
                textAlign: "left",
                border: "1px solid black",
                width: "10%",
              }}
            ></td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
                fontWeight: "bold",
              }}
              colspan="7"
            >
              Disc Total
            </td>
            <td
              style={{
                border: "1px solid black",
                textAlign: "right",
                padding: "5px",
              }}
            >
              {Math.round(discValue)}
            </td>
          </tr>

          <tr>
            <td
              style={{
                textAlign: "left",
                border: "1px solid black",
                width: "10%",
              }}
            ></td>
            <td
              style={{
                textAlign: "center",
                border: "1px solid black",
                fontWeight: "bold",
              }}
              colspan="7"
            >
              Grand Total
            </td>
            <td
              style={{
                border: "1px solid black",
                textAlign: "right",
                padding: "5px",
              }}
            >
              {Math.round(total)}
            </td>
          </tr>
        </table>

        <div
          style={{
            width: "100%",
            borderRight: "1px solid black",
            borderBottom: "1px solid black",
            borderLeft: "1px solid black",
            padding: "5px",
          }}
        >
          <div style={{ flexDirection: "row", display: "flex" }}>
            <div
              style={{
                width: "50%",
              }}
            >
              <p>
                <b> Amount in Words </b>
              </p>
              <p>
                {total !== undefined && total !== null
                  ? numberToWords.toWords(Number(total)).toUpperCase()
                  : ""}{" "}
                {"Rupees"}
              </p>
              <br></br>
              <p style={{ fontWeight: "bold" }}>Bank Details :</p>
              <p>
                Account Holder Name :{" "}
                {data[0]?.vendor?.vendor_bank_account_holder_name}{" "}
              </p>
              <p>Bank Name : {data[0]?.vendor?.vendor_bank_name}</p>
              <p>Account No. : {data[0]?.vendor?.account_no}</p>
              <p>Bank branch : {data[0]?.vendor?.bank_branch}</p>
              <p>Bank IFSC No. : {data[0]?.vendor?.vendor_bank_ifsc_code}</p>
              <br />
            </div>
            <div style={{ width: "50%" }}>
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <br />
                <br />
                <br />

                <p style={{ fontWeight: "bold" }}>
                  For {schoolName.toUpperCase() ?? ""}{" "}
                </p>
                <br />
                <br />
                <br />
                <br />
                <p style={{ fontWeight: "bold" }}>Authorized Signatory </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default PoView;
