import { Page, Document, StyleSheet, View, Text } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica'
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
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 'bold',
    fontSize: '0.8125rem',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.87)',
    flex: 1,
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tableCell: {
    padding: 6,
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
  },
  tableCellRight: {
    padding: 6,
    fontSize: 10,
    flex: 1,
    textAlign: 'right'
  },
  blueText: {
    // color: '#4A57A9',
    fontWeight: 'bold'
  },
  totalRow: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row'
  },
  boldText: {
    fontWeight: 'bold'
  }
});

const LedgerMonthlyInstTransactionPdf = ({ rows, queryValues, month }) => {
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
        <View style={styles.headerContainer}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: '7px' }}>
            {queryValues?.voucherHeadName}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: '7px' }}>
            {month}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {`As on ${moment().format('DD-MM-YYYY')}`}
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '35%' }]}>School</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Opening Balance</Text>
            <Text  style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Debit</Text>
            <Text  style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Credit</Text>
            <Text  style={[styles.tableHeaderCell, { width: '20%', textAlign: 'right' }]}>Closing Balance</Text>
          </View>
          {rows?.vendorDetails?.length > 0 ? (
            <>
              {rows.vendorDetails.map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.blueText, { width: '35%' }]}>
                  {row.school_name}
                  </Text>
                  <Text style={[styles.tableCellRight, { width: '15%' }]}>{formatCurrency(row.openingBalance)}</Text>
                  <Text style={[styles.tableCellRight, { width: '15%' }]}>{formatCurrency(row.debit)}</Text>
                  <Text style={[styles.tableCellRight, { width: '15%' }]}>{formatCurrency(row.credit)}</Text>
                  <Text style={[styles.tableCellRight, styles.boldText, { width: '20%' }]}>
                    {formatCurrency(row.closingBalance)}
                  </Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={[styles.tableCell, styles.boldText, { width: '20%' }]}>Total</Text>
                <Text style={[styles.tableCellRight, { width: '20%' }]}></Text>
                <Text style={[styles.tableCellRight, styles.boldText, { width: '20%' }]}>
                  {formatCurrency(rows?.totalDebit)}
                </Text>
                <Text style={[styles.tableCellRight, styles.boldText, { width: '20%' }]}>
                  {formatCurrency(rows?.totalCredit)}
                </Text>
                <Text style={[styles.tableCellRight, { width: '20%' }]}></Text>
              </View>
            </>
          ) : (
            <View style={[styles.tableRow, { padding: 20 }]}>
              <Text style={{ flex: 1, textAlign: 'center' }}>No records found</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default LedgerMonthlyInstTransactionPdf;