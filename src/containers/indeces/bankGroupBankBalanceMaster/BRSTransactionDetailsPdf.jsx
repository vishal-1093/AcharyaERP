// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Font
// } from '@react-pdf/renderer';
// import moment from 'moment';

// // Styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 11,
//     fontFamily: 'Helvetica',
//   },
//   header: {
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 12,
//     marginBottom: 8,
//   },
//   sectionHeader: {
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 5,
//     fontSize: 12,
//     textDecoration: 'underline',
//   },
//   table: {
//     display: 'table',
//     width: 'auto',
//     marginVertical: 10,
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderRightWidth: 0,
//     borderBottomWidth: 0,
//   },
//   row: {
//     flexDirection: 'row',
//   },
//   cellHeader: {
//     fontWeight: 'bold',
//     backgroundColor: '#eee',
//     padding: 4,
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   cell: {
//     padding: 4,
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
// });

// const renderTable = (title, headers, data) => (
//   <>
//     <Text style={styles.sectionHeader}>{title}</Text>
//     <View style={styles.table}>
//       <View style={styles.row}>
//         {headers.map((h, i) => (
//           <Text key={i} style={styles.cellHeader}>{h}</Text>
//         ))}
//       </View>
//       {data.map((item, i) => (
//         <View key={i} style={styles.row}>
//           {Object.values(item).map((val, j) => (
//             <Text key={j} style={styles.cell}>{val}</Text>
//           ))}
//         </View>
//       ))}
//     </View>
//   </>
// );

// const BankReconciliationPDF = ({ queryValues, expanded, chqIssuedNotDebitData, chqIssuedNotCreditData, directCreditsData }) => {
//   const annexures = [];

//   if (expanded?.chqIssued) {
//     annexures.push({
//       title: 'Annexure-1: Cheque Issued not Presented',
//       headers: ['TRN Date', 'TRN No', 'Order Id', 'AUID', 'Amount'],
//       data: chqIssuedNotDebitData?.paymentVouchers?.map(trx => ({
//         date: trx.transaction_date,
//         trnNo: trx.cheque_dd_no,
//         orderId: trx.order_id,
//         auid: trx.auid,
//         amount: trx.amount
//       })) || [],
//     });
//   }

//   if (expanded?.chqDeposited) {
//     annexures.push({
//       title: 'Annexure-2: DD Deposits in Transit',
//       headers: ['TRN Date', 'DD No', 'Amount'],
//       data: chqIssuedNotCreditData?.ddDetails?.map(trx => ({
//         date: trx.transaction_date,
//         ddNo: trx.cheque_dd_no,
//         amount: trx.amount
//       })) || [],
//     });
//   }

//   if (expanded?.directCredits) {
//     annexures.push({
//       title: 'Annexure-3: Direct Electronic Credits',
//       headers: ['TRN Date', 'TRN No', 'Order Id', 'AUID', 'Amount'],
//       data: directCreditsData?.bankImportTransactions?.map(trx => ({
//         date: trx.transaction_date,
//         trnNo: trx.cheque_dd_no,
//         orderId: trx.order_id,
//         auid: trx.auid,
//         amount: trx.amount
//       })) || [],
//     });
//   }

//   return (
//     <Document>
//       <Page style={styles.page}>
//         {/* Main Page without tables */}
//         <View style={styles.header}>
//           <Text style={styles.title}>{queryValues?.schoolName}</Text>
//           <Text style={styles.subtitle}>Bank Reconciliation Statement</Text>
//           <Text>
//             {queryValues?.bankName} • A/c No: {queryValues?.accountNo} • As on{" "}
//             {moment().format("DD-MM-YYYY")}
//           </Text>
//         </View>

//         <Text>Bank Balance as per Cash Book (a): {queryValues?.closingBalance || 0}</Text>
//         <Text>(+) Cheque Issued not Presented (b): {chqIssuedNotDebitData?.totalAmount || 0}</Text>
//         <Text>(-) DD Deposits in Transit (c): {chqIssuedNotCreditData?.totalAmount || 0}</Text>
//         <Text>(+) Direct Electronic Credits (d): {directCreditsData?.totalAmount || 0}</Text>
//         <Text>Total (a + b - c + d): {(queryValues?.closingBalance + chqIssuedNotDebitData?.totalAmount - chqIssuedNotCreditData?.totalAmount + directCreditsData?.totalAmount) || 0}</Text>
//         <Text>Bank Balance as per Pass Book: {queryValues?.bankBalance || 0}</Text>
//         <Text>Difference: {
//           Math.abs(
//             (queryValues?.closingBalance + chqIssuedNotDebitData?.totalAmount -
//               chqIssuedNotCreditData?.totalAmount + directCreditsData?.totalAmount) -
//             queryValues?.bankBalance
//           ) || 0
//         }</Text>
//       </Page>

//       {/* Annexure Tables on following pages */}
//       {annexures.map((annex, i) => (
//         <Page key={i + 1} style={styles.page}>
//           {renderTable(annex.title, annex.headers, annex.data)}
//         </Page>
//       ))}
//     </Document>
//   );
// };

// export default BankReconciliationPDF;


//import { PDFDownloadLink, Page, Text, View, StyleSheet, Table, TableHeader, TableCell, TableBody, DataTableCell } from '@react-pdf/renderer';
// import { saveAs } from 'file-saver';
// import { pdf } from '@react-pdf/renderer';
// import moment from 'moment';
// import {
//     Document,
//     Page,
//     View,
//     Text,
//     StyleSheet,
//     //   Table, 
//     //   TableRow,
//     //   TableHeader, 
//     //   TableCell, 
//     //   TableBody 
// } from '@react-pdf/renderer';

// // PDF Styles
// const styles = StyleSheet.create({
//     page: {
//         padding: 20,
//         // backgroundColor: '#f5f5f5',
//         backgroundColor: '#ffffff',
//         fontFamily: 'Helvetica'
//     },
//     paper: {
//         backgroundColor: '#ffffff',
//         borderRadius: 4,
//         boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//         marginBottom: 20
//     },
//     header: {
//         // backgroundColor: '#1e40af',
//         // color: 'white',
//         padding: 15,
//         // borderTopLeftRadius: 4,
//         // borderTopRightRadius: 4
//         backgroundColor: '#376a7d',
//         color: 'white',
//     },
//     section: {
//         padding: 12,
//         borderBottom: '1px solid #e0e0e0',
//         backgroundColor: '#f5f5f5',
//         fontSize: 13,
//     },
//     sectionAlt: {
//         padding: 12,
//         borderBottom: '1px solid #e0e0e0',
//         backgroundColor: '#eeeeee',
//         fontSize: 13,
//     },
//     sectionHeader: {
//         padding: 12,
//         borderBottom: '1px solid #e0e0e0',
//         backgroundColor: '#eeeeee',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         fontSize: 13,
//     },
//     // sectionHeaderAlt: {
//     //     padding: 12,
//     //     borderBottom: '1px solid #e0e0e0',
//     //      backgroundColor: '#eeeeee',
//     //     // backgroundColor: '#f5f5f5',
//     //     flexDirection: 'row',
//     //     justifyContent: 'space-between',
//     //     fontSize: 13,
//     // },
//     tableHeader: {
//         backgroundColor: '#f1f5f9',
//         flexDirection: 'row',
//         borderBottom: '1px solid #e5e7eb',
//         alignItems: 'center',
//         padding: 5
//     },
//     tableRow: {
//         flexDirection: 'row',
//         borderBottom: '1px solid #e5e7eb',
//         alignItems: 'center',
//         padding: 5
//     },
//     tableCell: {
//         flex: 1,
//         fontSize: 10,
//         padding: 4
//     },
//     tableCellRight: {
//         flex: 1,
//         fontSize: 10,
//         padding: 4,
//         textAlign: 'right'
//     },
//     annexureHeader: {
//         backgroundColor: '#f1f5f9',
//         padding: 10,
//         textAlign: 'center',
//         marginBottom: 10,
//         fontSize: 14,
//         fontWeight: 'bold'
//     },
//     noData: {
//         padding: 15,
//         textAlign: 'center',
//         color: '#888888',
//         fontStyle: 'italic'
//     }
// });

// const Table = ({ children }) => (
//     <View style={{ width: '100%', marginTop: 10 }}>
//         {children}
//     </View>
// );

// const TableRow = ({ children }) => (
//     <View style={{ flexDirection: 'row', borderBottom: '1px solid #e0e0e0' }}>
//         {children}
//     </View>
// );

// const TableCell = ({ children, style }) => (
//     <View style={[{ padding: 5, flex: 1 }, style]}>
//         <Text style={{ fontSize: 10 }}>{children}</Text>
//     </View>
// );

// const TableHeaderCell = ({ children }) => (
//     <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f1f5f9' }}>
//         {children}
//     </TableCell>
// );

// // Main Document Component
// const BRSTransactionDetailsPdf = ({
//     queryValues,
//     chqIssuedNotDebitData,
//     chqIssuedNotCreditData,
//     directCreditsData
// }) => {
//     const MAX_ROWS_ON_MAIN_PAGE = 10;

//     const chequeData = chqIssuedNotDebitData?.paymentVouchers || [];
//     const ddData = chqIssuedNotCreditData?.ddDetails || [];
//     const directCreditData = directCreditsData?.bankImportTransactions || [];

//     const showChequeTableOnMain = chequeData.length > 0 && chequeData.length <= MAX_ROWS_ON_MAIN_PAGE;
//     const showDDTableOnMain = ddData.length > 0 && ddData.length <= MAX_ROWS_ON_MAIN_PAGE;
//     const showDirectCreditTableOnMain = directCreditData.length > 0 && directCreditData.length <= MAX_ROWS_ON_MAIN_PAGE;
//     return (
//         <Document>
//             {/* Main Summary Page */}
//             <Page size="A4" style={styles.page}>
//                 <View style={styles.paper}>
//                     {/* Header */}
//                     <View style={styles.header}>
//                         <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' }}>
//                             {queryValues?.schoolName}
//                         </Text>
//                         <Text style={{ fontSize: 14, opacity: 0.9, textAlign: 'center' }}>
//                             {queryValues?.bankName} A/c No: {queryValues?.accountNo}
//                         </Text>
//                         <Text style={{ fontSize: 14, marginBottom: 5, textAlign: 'center' }}>Bank Reconciliation Statement as on {moment().format('DD-MM-YYYY')}</Text>
//                     </View>

//                     {/* Cash Book */}
//                     <View style={styles.sectionHeader}>
//                         <Text>Bank Balance as per Cash Book (a)</Text>
//                         <Text style={{ fontWeight: 'bold' }}>{queryValues?.closingBalance?.toFixed(2) || '0.00'}</Text>
//                     </View>

//                     {/* Cheque Issued */}
//                     <View style={styles.sectionHeader}>
//                         <View style={styles.row}>
//                             <View>
//                                 <Text>(+) Cheque Issued not Presented (b)</Text>
//                                 <Text style={{ fontSize: 13, color: '#666666' }}>
//                                     {chqIssuedNotDebitData?.paymentVouchers?.length || 0} transactions
//                                 </Text>
//                             </View>
//                             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//                                 <Text style={{ fontWeight: 'bold' }}>{chqIssuedNotDebitData?.totalAmount?.toFixed(2) || '0.00'}</Text>
//                             </View>
//                         </View>
//                         {showChequeTableOnMain && (
//                             <Table>
//                                 <TableRow>
//                                     <TableHeaderCell>VCHR No</TableHeaderCell>
//                                     <TableHeaderCell>Date</TableHeaderCell>
//                                     <TableHeaderCell>Pay To</TableHeaderCell>
//                                     <TableHeaderCell>Amount</TableHeaderCell>
//                                 </TableRow>
//                                 {chequeData.map((item, index) => (
//                                     <TableRow key={index}>
//                                         <TableCell>{item?.vochar_no || ''}</TableCell>
//                                         <TableCell>{item?.vochar_date || ''}</TableCell>
//                                         <TableCell>{item?.pay_to || ''}</TableCell>
//                                         <TableCell>{item?.amount || ''}</TableCell>
//                                     </TableRow>
//                                 ))}
//                             </Table>
//                         )}
//                     </View>

//                     {/* DD Deposits */}
//                     <View style={styles.sectionHeader}>
//                         <View style={styles.row}>
//                             <View>
//                                 <Text>(-) DD Deposits in Transit (c)</Text>
//                                 <Text style={{ fontSize: 13, color: '#666666' }}>
//                                     {chqIssuedNotCreditData?.ddDetails?.length || 0} transactions
//                                 </Text>
//                             </View>
//                             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//                                 <Text style={{ fontWeight: 'bold' }}>{chqIssuedNotCreditData?.totalAmount?.toFixed(2) || '0.00'}</Text>
//                             </View>
//                         </View>
//                         {showDDTableOnMain && (
//                             <Table>
//                                 <TableRow>
//                                     <TableHeaderCell>DD No</TableHeaderCell>
//                                     <TableHeaderCell>Date</TableHeaderCell>
//                                     <TableHeaderCell>Bank</TableHeaderCell>
//                                     <TableHeaderCell>Amount</TableHeaderCell>
//                                 </TableRow>
//                                 {ddData.map((item, index) => (
//                                     <TableRow key={index}>
//                                         <TableCell>{item?.dd_no || ''}</TableCell>
//                                         <TableCell>{item?.dd_date || ''}</TableCell>
//                                         <TableCell>{item?.bank_name || ''}</TableCell>
//                                         <TableCell>{item?.amount || ''}</TableCell>
//                                     </TableRow>
//                                 ))}
//                             </Table>
//                         )}

//                     </View>


//                     {/* Direct Credits */}
//                     <View style={styles.sectionHeader}>
//                         <View style={styles.row}>
//                             <View>
//                                 <Text>(+) Direct Electronic Credits (d)</Text>
//                                 <Text style={{ fontSize: 13, color: '#666666' }}>
//                                     {directCreditsData?.bankImportTransactions?.length || 0} transactions
//                                 </Text>
//                             </View>
//                             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//                                 <Text style={{ fontWeight: 'bold' }}>{directCreditsData?.totalAmount?.toFixed(2) || '0.00'}</Text>
//                             </View>
//                         </View>
//                         {showDirectCreditTableOnMain && (
//                             <Table>
//                                 <TableRow>
//                                     <TableHeaderCell>Ref No</TableHeaderCell>
//                                     <TableHeaderCell>Date</TableHeaderCell>
//                                     <TableHeaderCell>Description</TableHeaderCell>
//                                     <TableHeaderCell>Amount</TableHeaderCell>
//                                 </TableRow>
//                                 {directCreditData.map((item, index) => (
//                                     <TableRow key={index}>
//                                         <TableCell>{item?.reference_no || ''}</TableCell>
//                                         <TableCell>{item?.transaction_date || ''}</TableCell>
//                                         <TableCell>{item?.description || ''}</TableCell>
//                                         <TableCell>{item?.amount || ''}</TableCell>
//                                     </TableRow>
//                                 ))}
//                             </Table>
//                         )}
//                     </View>

//                     {/* Totals */}
//                     {/* <View style={[styles.section, { backgroundColor: '#f5f5f5' }]}>
//                     <Text style={{ fontWeight: 'bold' }}>
//                         Total (a) + (b) - (c) + (d): {
//                             (queryValues?.closingBalance +
//                                 chqIssuedNotDebitData?.totalAmount -
//                                 chqIssuedNotCreditData?.totalAmount +
//                                 directCreditsData?.totalAmount)?.toFixed(2) || '0.00'
//                         }
//                     </Text>
//                 </View> */}
//                     <View style={styles.sectionHeader}>
//                         <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Total (a) + (b) - (c) + (d)</Text>
//                         <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
//                             {(queryValues?.closingBalance +
//                                 chqIssuedNotDebitData?.totalAmount -
//                                 chqIssuedNotCreditData?.totalAmount +
//                                 directCreditsData?.totalAmount)?.toFixed(2) || '0.00' || 0}
//                         </Text>
//                     </View>

//                     {/* Pass Book */}
//                     {/* <View style={[styles.section, { backgroundColor: '#eeeeee' }]}>
//                     <Text>Bank Balance as per Pass Book: {queryValues?.bankBalance?.toFixed(2) || '0.00'}</Text>
//                 </View> */}
//                     <View style={styles.sectionHeader}>
//                         <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Bank Balance as per Pass Book</Text>
//                         <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
//                             {queryValues?.bankBalance?.toFixed(2) || '0.00'}
//                         </Text>
//                     </View>

//                     {/* Difference */}
//                     <View style={styles.sectionHeader}>
//                         <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
//                             Difference
//                         </Text>
//                         <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
//                             {((queryValues?.closingBalance +
//                                 chqIssuedNotDebitData?.totalAmount -
//                                 chqIssuedNotCreditData?.totalAmount +
//                                 directCreditsData?.totalAmount) -
//                                 queryValues?.bankBalance
//                             )?.toFixed(2) || '0.00'}
//                         </Text>
//                     </View>
//                 </View>
//             </Page>

//             {/* Annexure 1: Cheque Issued Table */}
//             <Page size="A4" style={styles.page}>
//                 <View style={styles.annexureHeader}>
//                     <Text>Annexure-1: Cheque Issued Not Presented</Text>
//                 </View>

//                 {chqIssuedNotDebitData?.paymentVouchers?.length ? (
//                     <>
//                         <View style={styles.tableHeader}>
//                             <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>VCHR No</Text>
//                             <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Date</Text>
//                             <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Pay To</Text>
//                             <Text style={[styles.tableCellRight, { fontWeight: 'bold' }]}>Amount</Text>
//                         </View>

//                         {chqIssuedNotDebitData.paymentVouchers.map((item, index) => (
//                             <View key={index} style={styles.tableRow}>
//                                 <Text style={styles.tableCell}>{item?.vochar_no || '-'}</Text>
//                                 <Text style={styles.tableCell}>{item?.vochar_date ? moment(item.vochar_date).format("DD-MM-YYYY") : '-'}</Text>
//                                 <Text style={styles.tableCell}>{item?.pay_to || '-'}</Text>
//                                 <Text style={styles.tableCellRight}>{item?.amount || '0.00'}</Text>
//                             </View>
//                         ))}
//                     </>
//                 ) : (
//                     <View style={styles.noData}>
//                         <Text>No transactions found</Text>
//                     </View>
//                 )}
//             </Page>

//             {/* Annexure 2: DD Deposits Table */}
//             <Page size="A4" style={styles.page}>
//                 <View style={styles.annexureHeader}>
//                     <Text>Annexure-2: DD Deposits in Transit</Text>
//                 </View>

//                 {chqIssuedNotCreditData?.ddDetails?.length ? (
//                     <>
//                         <View style={styles.tableHeader}>
//                             <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>DD No</Text>
//                             <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Date</Text>
//                             <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Bank</Text>
//                             <Text style={[styles.tableCellRight, { fontWeight: 'bold' }]}>Amount</Text>
//                         </View>

//                         {chqIssuedNotCreditData.ddDetails.map((item, index) => (
//                             <View key={index} style={styles.tableRow}>
//                                 <Text style={styles.tableCell}>{item?.dd_number || '-'}</Text>
//                                 <Text style={styles.tableCell}>{item?.dd_date ? moment(item.dd_date).format("DD-MM-YYYY") : '-'}</Text>
//                                 <Text style={styles.tableCell}>{item?.bank_name || '-'}</Text>
//                                 <Text style={styles.tableCellRight}>{item?.dd_amount || '0.00'}</Text>
//                             </View>
//                         ))}
//                     </>
//                 ) : (
//                     <View style={styles.noData}>
//                         <Text>No transactions found</Text>
//                     </View>
//                 )}
//             </Page>

//             {/* Annexure 3: Direct Credits Table */}
//             <Page size="A4" style={styles.page}>
//                 <View style={styles.annexureHeader}>
//                     <Text>Annexure-3: Direct Electronic Credits</Text>
//                 </View>

//                 {directCreditsData?.bankImportTransactions?.length ? (
//                     <>
//                         <View style={styles.tableHeader}>
//                             <Text style={[styles.tableCell, { fontWeight: 'bold', flex: 0.8 }]}>TRN Date</Text>
//                             <Text style={[styles.tableCell, { fontWeight: 'bold', flex: 1 }]}>TRN No</Text>
//                             <Text style={[styles.tableCell, { fontWeight: 'bold', flex: 1 }]}>Order Id</Text>
//                             <Text style={[styles.tableCell, { fontWeight: 'bold', flex: 0.6 }]}>AUID</Text>
//                             <Text style={[styles.tableCellRight, { fontWeight: 'bold', flex: 0.8 }]}>Amount</Text>
//                         </View>

//                         {directCreditsData.bankImportTransactions.map((item, index) => (
//                             <View key={index} style={styles.tableRow}>
//                                 <Text style={[styles.tableCell, { flex: 0.8 }]}>{parseDate(item?.transaction_date) || '-'}</Text>
//                                 <Text style={[styles.tableCell, { flex: 1 }]}>{item?.cheque_dd_no || '-'}</Text>
//                                 <Text style={[styles.tableCell, { flex: 1 }]}>{item?.order_id || '-'}</Text>
//                                 <Text style={[styles.tableCell, { flex: 0.6 }]}>{item?.auid || '-'}</Text>
//                                 <Text style={[styles.tableCellRight, { flex: 0.8 }]}>{item?.amount || '0.00'}</Text>
//                             </View>
//                         ))}
//                     </>
//                 ) : (
//                     <View style={styles.noData}>
//                         <Text>No transactions found</Text>
//                     </View>
//                 )}
//             </Page>
//         </Document>
//     )
// }

// export default BRSTransactionDetailsPdf

// // Helper function to parse dates
// const parseDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//         return moment(dateString).format("DD-MM-YYYY");
//     } catch {
//         return dateString;
//     }
// };


import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const Table = ({ children }) => (
    <View style={{
        width: '100%',
        marginTop: 5,
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        overflow: 'hidden'
    }}>
        {children}
    </View>
);

const TableRow = ({ children, header = false }) => (
    <View style={{
        flexDirection: 'row',
        borderBottom: '1px solid #e0e0e0',
        // backgroundColor: header ? '#f1f5f9' : 'white',
        backgroundColor: header ? '#f1f5f9' : '#eeeeee',
        alignItems: 'center',
        //  minHeight: 25
    }}>
        {children}
    </View>
);

const TableCell = ({ children, style, align = 'left' }) => (
    <View style={[{
        padding: '4px 8px',
        flex: 1,
        // borderRight: '1px solid #e0e0e0',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
    }, style]}>
        <Text style={{
            fontSize: 9,
            textAlign: align,
            fontWeight: style?.fontWeight || 'normal',
            //  lineHeight: 1.3,
        }}
        >
            {children}
        </Text>
    </View>
);


const styles = StyleSheet.create({
    page: {
        padding: 20,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica'
    },
    header: {
        backgroundColor: '#376a7d',
        color: 'white',
        padding: 15,
        textAlign: 'center'
    },
    section: {
        borderBottom: '1px solid #e0e0e0'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#eeeeee',
        fontSize: 10
    },

    sectionContent: {
        padding: 10,
        backgroundColor: '#eeeeee',
        fontSize: 10,
        pageBreakInside: 'avoid'
    },
    annexureHeader: {
        backgroundColor: '#f1f5f9',
        padding: 10,
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 14,
        fontWeight: 'bold'
    },
    valueText: {
        fontWeight: 'bold'
    },
    differenceText: {
        fontWeight: 'bold',
        color: '#b91c1c'
    }
});

const BRSTransactionDetailsPdf = ({
    queryValues,
    chqIssuedNotDebitData = { paymentVouchers: [], totalAmount: 0 },
    chqIssuedNotCreditData = { ddDetails: [], totalAmount: 0 },
    directCreditsData = { bankImportTransactions: [], totalAmount: 0 }
}) => {
    const MAX_ROWS_ON_MAIN_PAGE = 16;

    const chequeData = chqIssuedNotDebitData.paymentVouchers || [];
    const ddData = chqIssuedNotCreditData.ddDetails || [];
    const directCreditData = directCreditsData.bankImportTransactions || [];

    const showChequeTableOnMain = chequeData.length > 0 && chequeData.length <= MAX_ROWS_ON_MAIN_PAGE;
    const showDDTableOnMain = ddData.length > 0 && ddData.length <= MAX_ROWS_ON_MAIN_PAGE;
    const showDirectCreditTableOnMain = directCreditData.length > 0 && directCreditData.length <= MAX_ROWS_ON_MAIN_PAGE;

    const formatCurrency = (value) => {
        return parseFloat(value || 0).toFixed(2);
    };

    const parseDate = (raw) => {
        if (!raw) return '';
        const f1 = moment(raw, 'YYYY-MM-DD HH:mm:ss.SSS', true);
        if (f1.isValid()) return f1.format('DD-MM-YYYY');

        const f2 = moment(raw, 'DD/MM/YYYY', true);
        if (f2.isValid()) return f2.format('DD-MM-YYYY');

        const f3 = moment(raw);
        return f3.isValid() ? f3.format('DD-MM-YYYY') : '';
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom:'7px' }}>
                        {queryValues?.schoolName || ''}
                    </Text>
                    <Text style={{ fontSize: 12, marginBottom:'7px' }}>
                        {queryValues?.bankName || ''} • A/c No: {queryValues?.accountNo || ''}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                        Bank Reconciliation Statement as on {new Date().toLocaleDateString('en-IN')}
                    </Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text>Bank Balance as per Cash Book (a)</Text>
                        <Text style={styles.valueText}>{formatCurrency(queryValues?.closingBalance)}</Text>
                    </View>
                </View>

                {/* Cheque Issued Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text>(+) Cheque Issued not Presented (b)</Text>
                            <Text style={{ fontSize: 9, color: '#666666', marginLeft:"10px" }}>
                                {chequeData.length} transactions
                            </Text>
                        </View>
                        <Text style={styles.valueText}>{formatCurrency(chqIssuedNotDebitData?.totalAmount)}</Text>
                    </View>

                    {/* Cheque Issued Table */}
                    {showChequeTableOnMain && chequeData.length > 0 && (
                        <View style={styles.sectionContent}>
                            <Table>
                                <TableRow header>
                                    <TableCell style={{ fontWeight: 'bold' }}>VCHR No</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>Pay To</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                                </TableRow>
                                {chequeData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item?.vochar_no || ''}</TableCell>
                                        <TableCell>{item?.vochar_date ? moment(item?.vochar_date).format("DD-MM-YYYY") : ""}</TableCell>
                                        <TableCell>{item?.pay_to || ''}</TableCell>
                                        <TableCell align="right">{formatCurrency(item?.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </View>
                    )}
                </View>

                {/* DD Deposits Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text>(-) DD Deposits in Transit (c)</Text>
                            <Text style={{ fontSize: 9, color: '#666666',marginLeft:"10px" }}>
                                {ddData.length} transactions
                            </Text>
                        </View>
                        <Text style={styles.valueText}>{formatCurrency(chqIssuedNotCreditData?.totalAmount)}</Text>
                    </View>

                    {/* DD Deposits Table */}
                    {showDDTableOnMain && ddData.length > 0 && (
                        <View style={styles.sectionContent}>
                            <Table>
                                <TableRow header>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>DD No</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Date</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Bank</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                                </TableRow>
                                {ddData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{item?.dd_number || ''}</TableCell>
                                        <TableCell align="center">{item?.dd_date ? moment(item?.dd_date).format("DD-MM-YYYY") : ""}</TableCell>
                                        <TableCell align="center">{item?.bank_name || ''}</TableCell>
                                        <TableCell align="right">{formatCurrency(item?.dd_amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </View>
                    )}
                </View>

                {/* Direct Credits Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text>(+) Direct Electronic Credits (d)</Text>
                            <Text style={{ fontSize: 9, color: '#666666', marginLeft:"10px" }}>
                                {directCreditData.length} transactions
                            </Text>
                        </View>
                        <Text style={styles.valueText}>{formatCurrency(directCreditsData?.totalAmount)}</Text>
                    </View>

                    {/* Direct Credits Table */}
                    {showDirectCreditTableOnMain && directCreditData.length > 0 && (
                        <View style={styles.sectionContent}>
                            <Table>
                                <TableRow header>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">TRN Date</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Order Id</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">AUID</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                                </TableRow>
                                {directCreditData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{parseDate(item?.transaction_date)}</TableCell>
                                        <TableCell align="center">{item?.order_id}</TableCell>
                                        <TableCell align="center">{item?.auid}</TableCell>
                                        <TableCell align="right">{formatCurrency(item?.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </View>
                    )}
                </View>

                {/* Totals */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.valueText}>Total (a) + (b) - (c) + (d)</Text>
                        <Text style={styles.valueText}>
                            {formatCurrency(
                                (queryValues?.closingBalance || 0) +
                                (chqIssuedNotDebitData?.totalAmount || 0) -
                                (chqIssuedNotCreditData?.totalAmount || 0) +
                                (directCreditsData?.totalAmount || 0)
                            )}
                        </Text>
                    </View>
                </View>

                {/* Pass Book */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.valueText}>Bank Balance as per Pass Book</Text>
                        <Text style={styles.valueText}>{formatCurrency(queryValues?.bankBalance)}</Text>
                    </View>
                </View>

                {/* Difference */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.valueText}>Difference</Text>
                        <Text style={styles.differenceText}>
                            {
                                formatCurrency(((queryValues?.closingBalance || 0) +
                                    (chqIssuedNotDebitData?.totalAmount || 0) -
                                    (chqIssuedNotCreditData?.totalAmount || 0) +
                                    (directCreditsData?.totalAmount || 0)) -
                                    (queryValues?.bankBalance || 0))
                            }
                        </Text>
                    </View>
                </View>
            </Page>

            {/* Annexure Pages */}
            {/* Cheque Issued Annexure */}
            {chequeData.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.annexureHeader}>
                        <Text>Annexure-1: Cheque Issued Not Presented</Text>
                    </View>
                    <Table>
                        <TableRow header>
                            <TableCell style={{ fontWeight: 'bold' }}>VCHR No</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Pay To</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                        </TableRow>
                        {chequeData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item?.vochar_no || ''}</TableCell>
                                <TableCell>{item?.vochar_date ? moment(item?.vochar_date).format("DD-MM-YYYY") : ''}</TableCell>
                                <TableCell>{item?.pay_to || ''}</TableCell>
                                <TableCell align="right">{formatCurrency(item?.amount)}</TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </Page>
            )}

            {/* DD Deposits Annexure */}
            {ddData.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.annexureHeader}>
                        <Text>Annexure-2: DD Deposits in Transit</Text>
                    </View>
                    <Table>
                        <TableRow header>
                            <TableCell align='center' style={{ fontWeight: 'bold' }}>DD No</TableCell>
                            <TableCell align='center' style={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell align='center' style={{ fontWeight: 'bold' }}>Bank</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                        </TableRow>
                        {ddData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell align='center'>{item?.dd_number || ''}</TableCell>
                                <TableCell align='center'>{item?.dd_date ? moment(item?.dd_date).format("DD-MM-YYYY") : ''}</TableCell>
                                <TableCell align='center'>{item?.bank_name || ''}</TableCell>
                                <TableCell align="right">{formatCurrency(item?.dd_amount)}</TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </Page>
            )}

            {/* Direct Credits Annexure */}
            {directCreditData.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.annexureHeader}>
                        <Text>Annexure-3: Direct Electronic Credits</Text>
                    </View>
                    <Table>
                        <TableRow header>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">TRN Date</TableCell>
                            {/* <TableCell sx={{ fontWeight: 'bold' }} align="center">TRN No</TableCell> */}
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Order Id</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">AUID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                        </TableRow>
                        {directCreditData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{parseDate(item?.transaction_date) || ''}</TableCell>
                                {/* <TableCell sx={{fontWeight: 'bold' }}>{item?.cheque_dd_no || ''}</TableCell> */}
                                <TableCell align="center">{item?.order_id || ''}</TableCell>
                                <TableCell align="center">{item?.auid || ''}</TableCell>
                                <TableCell align="right">{formatCurrency(item?.amount)}</TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </Page>
            )}
        </Document>
    );
};

export default BRSTransactionDetailsPdf;
