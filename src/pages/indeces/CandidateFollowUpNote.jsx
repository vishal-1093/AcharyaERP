import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";

function CandidateFollowUpNote({ getFollowUpData, followUpdata }) {
  useEffect(() => {
    getFollowUpData();
  }, []);

  return (
    <Timeline>
      {followUpdata.length > 0 ? (
        followUpdata.map((obj, i) => {
          return (
            <TimelineItem key={i}>
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                variant="body2"
                color="text.secondary"
              >
                <Typography>
                  {obj.created_date
                    ? obj.created_date
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")
                    : ""}
                </Typography>
                <Typography>
                  Note By - {obj.created_username ? obj.created_username : ""}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot style={{ background: "#623f8f" }}>
                  <EmailIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography>
                  Note - {obj.follow_up_remarks ? obj.follow_up_remarks : ""}
                </Typography>
                <Typography>
                  Follow Up date - &nbsp;
                  {obj.follow_up_date
                    ? obj.follow_up_date
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")
                    : "Not found"}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          );
        })
      ) : (
        <></>
      )}
    </Timeline>
  );
}

export default CandidateFollowUpNote;
