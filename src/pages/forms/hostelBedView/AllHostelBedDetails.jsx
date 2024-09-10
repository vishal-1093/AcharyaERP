import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Card,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
    textAlign: "center",
  },
  blockContainer: {
    // border: "3px solid #ccc",
    // borderRadius: 5,
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  blockName: {
    // padding: theme.spacing(1),
    // borderBottom: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
  },
  roomContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
  roomBox: {
    border: "2px solid #ccc",
    borderRadius: 4,
    padding: theme.spacing(1),
    flex: "1 0 100px",
  },
  bedIcon: {
    fontSize: "1.5rem",
    marginRight: theme.spacing(0.5),
  },
  iconsContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  numbersContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  bedNumber: {
    marginRight: theme.spacing(0.5),
  },
  bedCount: {
    textAlign: "center",
    marginTop: theme.spacing(0.5),
  },
  floorBox: {
    border: "2px solid #ccc",
    borderRadius: 3,
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
}));
const getStatusColor = (status) => {
  switch (status) {
    case "Vacant":
      return "#32CD32";
    case "Occupied":
      return "#F08080";
    case "Assigned":
      return "#87CEEB";
    case "Blocked":
      return "#FFA07A";
    default:
      return "#32CD32";
  }
};


const AllBedDetails = ({ bedDetails, selectedValues, getBedDetials }) => {
  const classes = useStyles();
  return (
    <>
      <Grid container direction="column">
        <Grid item className={classes.blockContainer}>
          {(() => {
            // Sort the floors by name in ascending order
            const sortedFloors = Object.entries(bedDetails).sort(
              ([aFloorName], [bFloorName]) =>
                aFloorName.localeCompare(bFloorName)
            );

            // Move the last floor to the first position
            const lastFloor = sortedFloors.pop(); // Remove the last floor
            if (lastFloor) {
              sortedFloors.unshift(lastFloor); // Insert the last floor at the start
            }

            return sortedFloors.map(([floorName, rooms]) => (
              <Box key={floorName} className={classes.floorBox}>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {floorName}
                </Typography>

                {/* Iterate over each room within the floor */}
                <Grid container>
                  {Object.entries(rooms)
                    .sort(([aRoomName], [bRoomName]) =>
                      aRoomName.localeCompare(bRoomName)
                    ) // Sort rooms by name in ascending order
                    .map(([roomName, beds]) => (
                      <Grid item key={roomName} style={{ margin: "5px" }}>
                        <Card
                          className={classes.roomCard}
                          style={{
                            width: 80,
                            height: !selectedValues?.occupancyType
                              ? 110
                              : selectedValues?.occupancyType <= 2
                              ? 80
                              : selectedValues?.occupancyType <= 4
                              ? 90
                              : 110,
                            padding: 3,
                            textAlign: "center",
                            transition: "transform 0.3s ease-in-out",
                            borderRadius: 5,
                            border: "2px solid #ccc",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            color="black"
                            style={{ fontWeight: "bold", fontSize: 12 }}
                          >
                            {roomName}
                          </Typography>
                          <Grid container justifyContent="center">
                            {beds
                              .sort((a, b) =>
                                a.bedName.localeCompare(b.bedName)
                              ) // Sort beds by name in ascending order
                              .slice(0, 6) // Limit to 6 beds
                              .map((bed) => (
                                <Grid item key={bed.hostelBedId}>
                                  <Box textAlign="center">
                                    <Tooltip title={`${bed.bedName}`}>
                                      <IconButton size="small">
                                        <BedIcon
                                          style={{
                                            color: getStatusColor(
                                              bed.bedStatus
                                            ),
                                            fontSize: 16,
                                          }}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Grid>
                              ))}
                          </Grid>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            ));
          })()}
        </Grid>
      </Grid>
    </>
  );
};

export default AllBedDetails;
