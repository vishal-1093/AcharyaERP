import { Page, Document, StyleSheet, View, Text } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    size: 'A4',
    orientation: 'landscape'
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  headerContainer: {
    backgroundColor: '#376a7d',
    color: 'white',
    padding: 15,
    // marginBottom: 10,
    textAlign: 'center'
  },
  headerText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitleContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  subtitleText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#376a7d',
    textAlign: 'left'
  },
  balanceText: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  tableContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tableHeaderCell: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0'
  },
  tableHeaderCellRight: {
    paddingVertical: 4, 
    paddingHorizontal: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    minHeight: 16
  },
  tableCell: {
    paddingVertical: 2, 
    paddingHorizontal: 8,
    fontSize: 9,
    color: '#333',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0'
  },
  tableCellRight: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 9,
    color: '#333',
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0'
  },
  linkText: {
    color: '#1976d2'
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  noDataContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataText: {
    fontSize: 12,
    color: '#666'
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
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: '7px' }}>
                      {rows?.schoolName}
                    </Text>
                    <Text style={{ fontSize: 12, marginBottom: '7px' }}>
                      {`${queryValues?.voucherHeadName} Ledger for Financial Year ${queryValues?.fcYear}`}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      {`As on ${moment().format('DD-MM-YYYY')}`}
                    </Text>
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
                  <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 'bold', fontSize: 9 }]}>Total</Text>
                  <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold', fontSize: 9 }]}>
                    {formatCurrency(rows?.totalDebit)}
                  </Text>
                  <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold', fontSize: 9 }]}>
                    {formatCurrency(rows?.totalCredit)}
                  </Text>
                  <Text style={[styles.tableCellRight, { flex: 1, fontWeight: 'bold', fontSize: 9 }]}>
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
