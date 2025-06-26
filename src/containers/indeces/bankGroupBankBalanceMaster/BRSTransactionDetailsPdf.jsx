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
                                        <TableCell>{item?.voucher_no || ''}</TableCell>
                                        <TableCell>{item?.created_date ? moment(item?.created_date).format("DD-MM-YYYY") : ""}</TableCell>
                                        <TableCell>{item?.pay_to || ''}</TableCell>
                                        <TableCell align="right">{formatCurrency(item?.credit)}</TableCell>
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
                                        <TableCell align="center">{item?.created_date ? moment(item?.created_date).format("DD-MM-YYYY") : ""}</TableCell>
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
                                        <TableCell align="right">{formatCurrency(item?.balance)}</TableCell>
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
                                <TableCell>{item?.voucher_no || ''}</TableCell>
                                <TableCell>{item?.created_date ? moment(item?.created_date).format("DD-MM-YYYY") : ''}</TableCell>
                                <TableCell>{item?.pay_to || ''}</TableCell>
                                <TableCell align="right">{formatCurrency(item?.credit)}</TableCell>
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
                                <TableCell align='center'>{item?.created_date ? moment(item?.created_date).format("DD-MM-YYYY") : ''}</TableCell>
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
                                <TableCell align="right">{formatCurrency(item?.balance)}</TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </Page>
            )}
        </Document>
    );
};

export default BRSTransactionDetailsPdf;
