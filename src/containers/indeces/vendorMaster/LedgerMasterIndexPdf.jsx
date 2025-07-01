import { Page, Document, StyleSheet, View, Text } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica'
    },
    headerContainer: {
        backgroundColor: '#376a7d',
        color: 'white',
        padding: 15,
        textAlign: 'center'
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
        fontSize: 10,
        textAlign: 'right',
        padding: '0 10px 0 0px',
        overflow: 'hidden'
    },
    headerRow: {
        backgroundColor: '#f5f5f5',
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: 'bold',
        fontSize: '0.8125rem'
    },
    headerCell: {
        flex: 1,
        fontSize: 10,
        color: 'rgba(0, 0, 0, 0.87)',
        textAlign: 'right',
         padding: '0 10px 0 0px',
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
        fontWeight: 'bold'
    }
});

const LedgerMasterIndexPdf = ({ data, filters }) => {
    const columns = data.columns
    const rows = data.rows;
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: '7px' }}>
                        {filters.voucherHeadName}
                    </Text>
                    <Text style={{ fontSize: 12, marginBottom: '7px' }}>
                        {`Financial Year ${filters?.fcYear}`}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                        {`As on ${moment().format('DD-MM-YYYY')}`}
                    </Text>
                </View>
                <View style={[styles.row, styles.headerRow]}>
                    {columns.map((column) => (
                        <Text
                            key={column.field}
                            //  style={styles.headerCell}
                            style={[
                                styles.headerCell,
                                column.field === 'school_name_short' && { textAlign: 'center' }
                            ]}
                        >
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
                            <Text
                                key={column.field}
                                //  style={styles.cell}
                                style={[
                                    styles.cell,
                                    column.field === 'school_name_short' && { textAlign: 'center' }
                                ]}
                            >
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