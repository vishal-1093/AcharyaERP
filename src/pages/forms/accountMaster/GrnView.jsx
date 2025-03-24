import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import numberToWords from "number-to-words";

function GrnView({ grnNo }) {
  const [data, setData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, [grnNo]);

  const getData = async () => {
    try {
      const response = await axios.get(
        `/api/purchase/getListofGRNForPdf?grnNo=${grnNo}`
      );
      setData(response.data.data);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the data",
      });
      setAlertOpen(true);
    }
  };

  const DisplayBoldText = ({ label }) => (
    <Typography variant="subtitle2">{label}</Typography>
  );

  const DisplayText = ({ label }) => (
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
  );

  const DisplayHeader = ({ label, value, align = "left" }) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        justifyContent: align,
      }}
    >
      <DisplayBoldText label={label} />
      <Typography variant="subtitle2" color="textSecondary">
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ border: "2px solid grey", padding: 2 }}>
      <Grid container rowSpacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
            Goods Receipt Note
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container>
            <Grid item xs={12} md={2}>
              <DisplayBoldText label="GRN No." />
            </Grid>
            <Grid item xs={12} md={2}>
              <DisplayText label={data?.grnListDTO?.[0]?.grnNumber} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container justifyContent="right">
            <Grid item xs={12} md={2}>
              <DisplayBoldText label="Invoice No." />
            </Grid>
            <Grid item xs={12} md={4}>
              <DisplayText label={data?.grnListDTO?.[0]?.invoiceNo} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container>
            <Grid item xs={12} md={2}>
              <DisplayBoldText label="GRN Date" />
            </Grid>
            <Grid item xs={12} md={4}>
              <DisplayText
                label={moment(data[0]?.createdDate).format("DD-MM-YYYY")}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container justifyContent="right">
            <Grid item xs={12} md={2}>
              <DisplayBoldText label="Invoice Date" />
            </Grid>
            <Grid item xs={12} md={4}>
              <DisplayText
                label={moment(data?.grnListDTO?.[0]?.invoiceDate).format(
                  "DD-MM-YYYY"
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", border: "1px solid black" }}>
            <Box sx={{ flex: 1, borderRight: "1px solid black", padding: 1 }}>
              <Grid container>
                <Grid item xs={12}>
                  <DisplayBoldText label="Supplier : " />
                </Grid>
                <Grid item xs={12}>
                  <DisplayText label={data?.vendor?.vendor_name} />
                </Grid>
                <Grid item xs={12}>
                  <DisplayText label={data?.vendor?.street_name} />
                </Grid>
                <Grid item xs={12}>
                  <DisplayText
                    label={`${data?.vendor?.city_name} ${data?.vendor?.state_name}`}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} md={1.5}>
                      <DisplayBoldText label="GST No." />
                    </Grid>
                    <Grid item xs={12} md={10.5}>
                      <DisplayText label={data?.vendor?.vendor_gst_no} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} md={1.5}>
                      <DisplayBoldText label="M-Id" />
                    </Grid>
                    <Grid item xs={12} md={10.5}>
                      <DisplayText label={data?.vendor?.vendor_email} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} md={1.5}>
                      <DisplayBoldText label="PH No." />
                    </Grid>
                    <Grid item xs={12} md={10.5}>
                      <DisplayText label={data?.vendor?.vendor_contact_no} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} md={1.5}>
                      <DisplayBoldText label="PAN No." />
                    </Grid>
                    <Grid item xs={12} md={10.5}>
                      <DisplayText label={data?.vendor?.pan_number} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ flex: 1, padding: 1 }}>
              <Grid container>
                <Grid item xs={12}>
                  <DisplayBoldText label="Invoice To : " />
                </Grid>
                <Grid item xs={12}>
                  <DisplayText label="ACHARYA INSTITUTE OF TECHNOLOGY" />
                </Grid>
                <Grid item xs={12}>
                  <DisplayText label="No.89/90, Soladevanahalli," />
                </Grid>
                <Grid item xs={12}>
                  <DisplayText label="Hesaraghatta Main Road, Chikbanavara," />
                </Grid>
                <Grid item xs={12}>
                  <DisplayText label="Bangalore - 560090" />
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} md={2}>
                      <DisplayBoldText label="Email-Id" />
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <DisplayText label="purchase@acharya.ac.in" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} md={2}>
                      <DisplayBoldText label="State Name" />
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <DisplayText label="Karnataka Code: 29" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} mt={1}>
          <TableContainer>
            <Table
              size="small"
              sx={{
                border: "1px solid black",
                "& td, & th": { border: "1px solid black" },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Sl No.</TableCell>
                  <TableCell>Description of Goods</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>UOM</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>GST(%)</TableCell>
                  <TableCell>DISC(%)</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.grnListDTO?.map((obj, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{obj.itemName}</TableCell>
                    <TableCell>{obj.enterQuantity}</TableCell>
                    <TableCell>{obj.uomShortName}</TableCell>
                    <TableCell sx={{ textAlign: "right !important" }}>
                      {obj.rate}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right !important" }}>
                      {obj.gst}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right !important" }}>
                      {obj.discount}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right !important" }}>
                      {Math.round(obj?.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{ textAlign: "center !important" }}
                  >
                    <DisplayBoldText label="Total" />
                  </TableCell>
                  <TableCell colSpan={5} />
                  <TableCell colSpan={2} sx={{ textAlign: "right !important" }}>
                    <DisplayBoldText
                      label={data?.grnListDTO?.reduce(
                        (a, b) => Number(a) + Number(b.costTotal),
                        0
                      )}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{ textAlign: "center !important" }}
                  >
                    <DisplayBoldText label="Disc Total" />
                  </TableCell>
                  <TableCell colSpan={5} />
                  <TableCell colSpan={2} sx={{ textAlign: "right !important" }}>
                    <DisplayBoldText
                      label={Math.round(
                        data?.grnListDTO?.reduce(
                          (a, b) => Number(a) + Number(b.discountTotal),
                          0
                        )
                      )}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{ textAlign: "center !important" }}
                  >
                    <DisplayBoldText label="Gst Total" />
                  </TableCell>
                  <TableCell colSpan={5} />
                  <TableCell colSpan={2} sx={{ textAlign: "right !important" }}>
                    <DisplayBoldText
                      label={Math.round(
                        data?.grnListDTO?.reduce(
                          (a, b) => Number(a) + Number(b.gstTotal),
                          0
                        )
                      )}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{ textAlign: "center !important" }}
                  >
                    <DisplayBoldText label="Grand Total " />
                  </TableCell>
                  <TableCell colSpan={5} />
                  <TableCell colSpan={2} sx={{ textAlign: "right !important" }}>
                    <DisplayBoldText
                      label={Math.round(
                        data?.grnListDTO?.reduce((a, b) => a + b.totalAmount, 0)
                      )}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <DisplayBoldText label="Amount in Words :" />
            <DisplayText
              label={numberToWords.toWords(
                data?.grnListDTO?.reduce((a, b) => a + b.totalAmount, 0) || 0
              )}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} align="right">
          <DisplayBoldText label="E & O.E" />
        </Grid>
        <Grid item xs={12} md={6} align="">
          <Box sx={{ display: "flex", gap: 1 }}>
            <DisplayBoldText label="Remarks" />
            <DisplayText label={data?.grnListDTO?.[0].remarks} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "right" }}>
            <DisplayBoldText label="Created By" />
            <DisplayText label={data?.grnListDTO?.[0].createdByUserName} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GrnView;
