import React from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  statusBox: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    marginRight: theme.spacing(0.5),
  },
  free: {
    backgroundColor: '#32CD32', // green
  },
  assigned: {
    backgroundColor: '#87CEEB', // blue
  },
  occupied: {
    backgroundColor: '#F08080', // red
  },
  blocked: {
    backgroundColor: '#FFA07A', // orange
  },
  
}));

const BedStatus = () => {
  const classes = useStyles();
  return (
    <Box className={classes.legendContainer}>
      <Box className={classes.statusBox}>
        <Box className={`${classes.statusIndicator} ${classes.free}`} />
        <Typography variant="body2">Free</Typography>
      </Box>
      <Box className={classes.statusBox}>
        <Box className={`${classes.statusIndicator} ${classes.assigned}`} />
        <Typography variant="body2">Assigned</Typography>
      </Box>
      <Box className={classes.statusBox}>
        <Box className={`${classes.statusIndicator} ${classes.occupied}`} />
        <Typography variant="body2">Occupied</Typography>
      </Box>
      <Box className={classes.statusBox}>
        <Box className={`${classes.statusIndicator} ${classes.blocked}`} />
        <Typography variant="body2">Blocked</Typography>
      </Box>
    </Box>
  );
};

export default BedStatus;
