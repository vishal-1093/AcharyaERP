import { Page, Document, StyleSheet, View, Text } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica'
  },
 headerContainer: {
    backgroundColor: '#376a7d',
    padding: 5,
    marginBottom: 5,
    borderRadius: 2,
    fontWeight: 'bold', 
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
    backgroundColor: '#376a7d',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center'
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
  blueText: {
    color: '#4A57A9',
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

const LedgerMonthlyTransactionPdf = ({ rows, currFcYear, queryValues }) => {
  const formatCurrency = (value) => {
    if (!value) return '0.00';
    return parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getFormattedMonthYear = (month, year) => {
    if (!month) return '';
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return `${monthNames[month - 1]} ${year}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* School Name Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{rows?.schoolName}</Text>
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>
            {`${queryValues?.voucherHeadName} for Financial Year ${currFcYear?.fcYear} as on ${moment().format('DD-MM-YYYY')}`}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Month</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Opening Balance</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Debit</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Credit</Text>
            <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Closing Balance</Text>
          </View>

          {/* Table Rows */}
          {rows?.vendorDetails?.length > 0 ? (
            <>
              {rows.vendorDetails.map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.blueText, { width: '20%' }]}>
                    {getFormattedMonthYear(row?.month, currFcYear?.fcYear)}
                  </Text>
                  <Text style={[styles.tableCellRight, { width: '20%' }]}>{formatCurrency(row.openingBalance)}</Text>
                  <Text style={[styles.tableCellRight, { width: '20%' }]}>{formatCurrency(row.debit)}</Text>
                  <Text style={[styles.tableCellRight, { width: '20%' }]}>{formatCurrency(row.credit)}</Text>
                  <Text style={[styles.tableCellRight, styles.boldText, { width: '20%' }]}>
                    {formatCurrency(row.closingBalance)}
                  </Text>
                </View>
              ))}

              {/* Total Row */}
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

export default LedgerMonthlyTransactionPdf;