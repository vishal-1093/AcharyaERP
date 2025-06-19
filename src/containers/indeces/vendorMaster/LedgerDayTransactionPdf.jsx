import { Page, Document, StyleSheet, View, Text } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica'
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
//   headerContainer: {
//     backgroundColor: '#376a7d',
//     padding: '8px 10px',
//     marginBottom: 10,
//     width: '70%',
//     textAlign: 'center',
//     borderRadius: 2
//   },
//   headerText: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold'
//   },
//   infoBox: {
//     width: '70%',
//     display: 'flex',
//     justifyContent: 'space-between',
//     flexWrap: 'wrap',
//     gap: 10,
//     marginBottom: 10,
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#e0e0e0'
//   },
//   subtitleText: {
//     fontSize: 13,
//     fontWeight: 'bold'
//   },
headerContainer: {
    backgroundColor: '#376a7d',
    padding: 5,
    marginBottom: 5,
    // borderRadius: 2,
    fontWeight: 'bold', 
    width: '70%',
  },
  headerText: {
    fontSize: 14,   
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold', 
  },
//   subtitleContainer: {
//     backgroundColor: '#f9f9f9',
//     padding: 5,
//     marginBottom: 5,
//     width: '70%',
//   },
//   subtitleText: {
//     fontSize: 13,
//     fontStyle: 'italic',
//     color: '#376a7d',
//     textAlign: 'left'
//   },
//   balanceContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     gap: 10
//   },
//   balanceText: {
//     fontSize: 13,
//     fontWeight: 'bold'
//   },
//   balanceValue: {
//     fontSize: 13,
//     fontWeight: 'bold'
//   },
  subtitleContainer: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',  // Changed to row layout
    justifyContent: 'space-between',  // Space between elements
    alignItems: 'center',  // Center vertically
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  subtitleText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#376a7d'
  },
  balanceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#376a7d'
  },

  tableContainer: {
    width: '70%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 20
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center'
  },
  tableHeaderCellRight: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    flex: 1,
    textAlign: 'center'
  },
  tableCellRight: {
    padding: 8,
    fontSize: 10,
    flex: 1,
    textAlign: 'right'
  },
  linkText: {
    color: '#1976d2',
    textDecoration: 'underline'
  },
  totalRow: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row'
  },
  noDataContainer: {
    padding: 30,
    alignItems: 'center'
  },
  noDataText: {
    fontSize: 12,
    color: '#757575'
  }
});

const LedgerDayTransactionPdf = ({ rows, queryValues, currMonth }) => {
  const formatCurrency = (value) => {
    if (!value) return '0.00';
    return parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.container}>
           <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{rows?.schoolName}</Text>
                  </View>
                  <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>
            {`${queryValues?.voucherHeadName} for Financial Year ${queryValues?.fcYear} as on ${moment().format('DD-MM-YYYY')}`}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
            <Text style={styles.balanceText}>Opening Balance:</Text>
            <Text style={styles.balanceText}>{formatCurrency(rows?.openingBalance)}</Text>
          </View>
        </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Date</Text>
              <Text style={[styles.tableHeaderCellRight, { flex: 1 }]}>Debit</Text>
              <Text style={[styles.tableHeaderCellRight, { flex: 1 }]}>Credit</Text>
              <Text style={[styles.tableHeaderCellRight, { flex: 1 }]}>Closing Balance</Text>
            </View>
            {rows?.vendorDetails?.length > 0 ? (
              <>
                {rows.vendorDetails.map((row, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>
                      {moment(row?.created_date).format('DD-MM-YYYY')}
                    </Text>
                    <Text style={[styles.tableCellRight, { flex: 1 }, row?.debit > 0 && styles.linkText]}>
                      {formatCurrency(row.debit)}
                    </Text>
                    <Text style={[styles.tableCellRight, { flex: 1 }, row?.credit > 0 && styles.linkText]}>
                      {formatCurrency(row.credit)}
                    </Text>
                    <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold' }]}>
                      {formatCurrency(row?.cumulativeBalance || 0)}
                    </Text>
                  </View>
                ))}

                <View style={styles.totalRow}>
                  <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 'bold', fontSize: 10 }]}>Total</Text>
                  <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold', fontSize: 10 }]}>
                    {formatCurrency(rows?.totalDebit)}
                  </Text>
                  <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold', fontSize: 10 }]}>
                    {formatCurrency(rows?.totalCredit)}
                  </Text>
                  <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold', fontSize: 10 }]}>
                    {formatCurrency(rows?.totalCumulativeBalance)}
                  </Text>
                </View>
              </>
            ) : (
              <View style={[styles.noDataContainer, { width: '100%' }]}>
                <Text style={styles.noDataText}>No transactions this month</Text>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default LedgerDayTransactionPdf;