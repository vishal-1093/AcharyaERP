import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Collapse,
    Paper,
    Breadcrumbs,
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLocation, useNavigate } from 'react-router-dom';
import useBreadcrumbs from '../../../hooks/useBreadcrumbs';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    position: "relative",
    marginBottom: 10,
    width: "fit-content",
    zIndex: theme.zIndex.drawer - 1,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": { textDecoration: "underline" },
  },
}));

const rowStyle = {
    backgroundColor: '#f5f5f5',
};
const rightAlignedCell = {
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
};

const BRSTransactionDetail = () => {
    const [open, setOpen] = useState({
        chqNotDebited: false,
        chqNotCredited: false,
        directCredits: false,
    });
    const [breadCrumbs, setBreadCrumbs] = useState()
    const navigate = useNavigate()
     const setCrumbs = useBreadcrumbs();
       const location = useLocation()
       const queryValues = location.state;

    useEffect(() => {
            setBreadCrumbs([
                { name: "Bank Balance", link: "/bank-balance" },
                 { name: "Institute Account Balances", link:"/institute-bank-balance" },
                 { name: "BRS Transaction Detail" },
                ])
    setCrumbs([])
        }, []);

    const toggle = (key) => setOpen({ ...open, [key]: !open[key] });

    const handleViewTransaction = (row, type) => {
        navigate('/brs-chq-issued-not-debited')
    }

    return (
        <Paper sx={{width:'100%', boxShadow: 'none'}}>
        <CustomBreadCrumbs crumbs={breadCrumbs} />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Box sx={{ width: '900px' }}>
                <Paper elevation={3} sx={{ backgroundColor: '#376a7d', p: 2, mb: 2 }}>
                    <Typography variant="h6" color="white" fontWeight="bold" sx={{ textAlign: "center", mb: 1 }}>
                        ACHARYA INSTITUTE OF TECHNOLOGY
                    </Typography>
                    <Typography color="white" sx={{ textAlign: "center", fontWeight: 500, mb: 1 }}>YES BANK - A/c No : 065994600000251</Typography>
                    <Typography color="white" sx={{ textAlign: "center", fontWeight: 500, }}>BANK RECONCILIATION STATEMENT as on 15-06-2025</Typography>
                </Paper>
                <Table>
                    <TableBody>
                        <TableRow sx={rowStyle}>
                            <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}>Bank Balance as per the Cash Book</TableCell>
                            <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px', paddingRight: '60px' }}>47010280.23</TableCell>
                        </TableRow>

                        {/* (+) CHQ Issued Not Debited */}
                        <TableRow sx={{
                            ...rowStyle,
                            height: '36px',
                            '& td': {
                                paddingTop: '4px',
                                paddingBottom: '4px',
                            }
                        }}>
                            <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}> (+) CHQ Issued Not Debited </TableCell>
                            <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px' }}>
                                0
                                {/* <IconButton onClick={() => toggle('chqNotDebited')}>
                                    {open.chqNotDebited ? <ArrowDropUp sx={{ fontSize: '2rem'}} /> : <ArrowDropDown sx={{ fontSize: '2rem', paddingLeft: 0, pr:0  }} />}
                                </IconButton> */}
                                <IconButton onClick={() =>handleViewTransaction('chqNotDebited')}>
                                    <VisibilityIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        {/* <TableRow>
                            <TableCell colSpan={2} sx={{ p: 0 }}>
                                <Collapse in={open.chqNotDebited}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={rowStyle}>
                                                <TableCell>Voucher Date</TableCell>
                                                <TableCell>Pay To</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>15-06-2025</TableCell>
                                                <TableCell>Constructions</TableCell>
                                                <TableCell align="right">1000000</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Collapse>
                            </TableCell>
                        </TableRow> */}

                        {/* (+) CHQ/DD Deposited Not Credited */}
                        <TableRow sx={{
                            ...rowStyle,
                            height: '36px',
                            '& td': {
                                paddingTop: '4px',
                                paddingBottom: '4px',
                            }
                        }}>
                            <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}> (+) CHQ/DD Deposited Not Credited </TableCell>
                            <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px' }}>
                                7033890.98
                                <IconButton onClick={() => toggle('chqNotCredited')}>
                                    {open.chqNotCredited ? <ArrowDropUp sx={{ fontSize: '2rem' }} /> : <ArrowDropDown sx={{ fontSize: '2rem' }} />}
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} sx={{ p: 0 }}>
                                <Collapse in={open.chqNotCredited}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={rowStyle}>
                                                <TableCell>DD No</TableCell>
                                                <TableCell>DD Date</TableCell>
                                                <TableCell>Bank</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>677098</TableCell>
                                                <TableCell>28-03-2025</TableCell>
                                                <TableCell>SBI</TableCell>
                                                <TableCell align="right">45000</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Collapse>
                            </TableCell>
                        </TableRow>

                        {/* (+) Direct Credits to Bank */}
                        <TableRow sx={{
                            ...rowStyle,
                            height: '36px',
                            '& td': {
                                paddingTop: '4px',
                                paddingBottom: '4px',
                            }
                        }}>
                            <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}> (+) Direct Credits to Bank </TableCell>
                            <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px' }}>
                                6202812
                                <IconButton onClick={() => toggle('directCredits')}>
                                    {open.directCredits ? <ArrowDropUp sx={{ fontSize: '2rem' }} /> : <ArrowDropDown sx={{ fontSize: '2rem' }} />}
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} sx={{ p: 0 }}>
                                <Collapse in={open.directCredits}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={rowStyle}>
                                                <TableCell>Transaction Date</TableCell>
                                                <TableCell>Transaction No</TableCell>
                                                <TableCell>Cheque/DD No</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>29-03-2025</TableCell>
                                                <TableCell>pay_QGVbdWBJUjR8xRkN</TableCell>
                                                <TableCell>UB127823000XXXXXXXX</TableCell>
                                                <TableCell align="right">57000</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Collapse>
                            </TableCell>
                        </TableRow>

                        <TableRow sx={{
                            ...rowStyle
                        }}>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>Total</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '13px', paddingRight: '60px' }}>27517692.1</TableCell>
                        </TableRow>
                        <TableRow sx={rowStyle}>
                            <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}>Bank Balance per the Pass Book</TableCell>
                            <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px', paddingRight: '60px' }}>67494081.35</TableCell>
                        </TableRow>
                        <TableRow sx={rowStyle}>
                            <TableCell sx={{ fontWeight: '500', fontSize: '13px' }}>Difference</TableCell>
                            <TableCell align="right" sx={{ fontWeight: '500', fontSize: '13px', paddingRight: '60px' }}>-39976389.25</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </Box>
        </Paper>
    );
};

export default BRSTransactionDetail;

const CustomBreadCrumbs = ({ crumbs = [] }) => {
  const navigate = useNavigate()
  const classes = useStyles()
  if (crumbs.length <= 0) return null

  return (
    <Box className={classes.breadcrumbsContainer}>
      <Breadcrumbs
        style={{ fontSize: "1.15rem" }}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {crumbs?.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <span key={index}>
              {!isLast ? (
                <Typography
                  onClick={() => navigate(crumb.link, { state: crumb.state })}
                  className={classes.link}
                  fontSize="inherit"
                >
                  {crumb.name}
                </Typography>
              ) : (
                <Typography color="text.primary" fontSize="inherit">
                  {crumb.name}
                </Typography>
              )}
            </span>
          );
        })}
      </Breadcrumbs>
    </Box>
  )
}


