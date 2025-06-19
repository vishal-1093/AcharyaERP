import { Page, Document, StyleSheet, View, Text } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica'
    },
    section: {
        marginBottom: 20,
        fontSize: '12px',
        fontStyle: 'italic'
    },
    header: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#376a7d'
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 8
    },
    cell: {
        flex: 1,
        fontSize: 10
    },
    headerRow: {
        backgroundColor: '#376a7d',
        color: 'white',
        fontWeight: 'bold'
    },
    headerCell: {
        flex: 1,
        fontSize: 10,
        color: 'white'
    },
    totalRow: {
        backgroundColor: '#376a7d',
        color: 'white',
        fontWeight: 'bold'
    },
    subtitleText: {
        fontSize: 12,
        fontStyle: 'italic !important',
        textAlign: 'left',
        color: '#376a7d',
        fontWeight:'bold'
    }
});

const LedgerMasterIndexPdf = ({ data, filters }) => {
    const columns = data.columns
    const rows = data.rows;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.subtitleText}>
                        {`${filters.voucherHeadName} for Financial Year ${filters.fcYear} as on ${moment().format('DD-MM-YYYY')}`}
                    </Text>
                </View>
                <View style={[styles.row, styles.headerRow]}>
                    {columns.map((column) => (
                        <Text key={column.field} style={styles.headerCell}>
                            {column.headerName}
                        </Text>
                    ))}
                </View>
                {rows.map((row, index) => (
                    <View
                        key={index}
                        style={row.isLastRow ? [styles.row, styles.totalRow] : styles.row}
                    >
                        {columns.map((column) => (
                            <Text key={column.field} style={styles.cell}>
                                {row[column.field]}
                            </Text>
                        ))}
                    </View>
                ))}
            </Page>
        </Document>
    );
};

export default LedgerMasterIndexPdf;