import React from "react";
import {
    makeStyles,
    withStyles
} from "@mui/styles";
import Slider from "@mui/material/Slider"
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import CircularProgress from '@mui/material/CircularProgress';
import "./Control.css";

const useStyles = makeStyles({
    volumeSlider: {
        width: "15% !important",
        color: "#9556CC",
    },

    bottomIcons: {
        color: "#999",
        padding: "12px 8px",

        "&:hover": {
            color: "#fff",
        },
    },
});

const PrettoSlider = withStyles({
    root: {
        height: "20px",
        color: "#9556CC",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    thumb: {
        height: 15,
        width: 15,
        backgroundColor: "#9556CC",
        border: "2px solid currentColor",
        marginTop: 0,
        marginLeft: 3,
        "&:focus, &:hover, &:active": {
            boxShadow: "inherit",
        },
    },
    active: {},
    valueLabel: {
        left: "calc(-50% + 4px)",
    },
    track: {
        height: 5,
        borderRadius: 4,
        width: "100%",
    },
    rail: {
        height: 5,
        borderRadius: 4,
    },
})(Slider);

const Control = ({
    onPlayPause,
    playing,
    onRewind,
    onForward,
    played,
    onSeek,
    onSeekMouseUp,
    onVolumeChangeHandler,
    onVolumeSeekUp,
    volume,
    mute,
    onMute,
    duration,
    currentTime,
    onMouseSeekDown,
    controlRef,
    toggleFullScreen,
    fullScreen,
    buffer
}) => {
    const classes = useStyles();

    return (
        <div className="control_Container" ref={controlRef}>
            <div className="top_container">
            </div>
            <div className="mid__container">
                <div className="icon__btn" onClick={onRewind}>
                    <Replay10Icon fontSize="large" />
                </div>

                <div className="icon__btn" onClick={onPlayPause}>
                    {buffer ? <CircularProgress color="success" /> : playing ? (
                        <PauseIcon fontSize="large" />
                    ) : (
                        <PlayArrowIcon fontSize="large" />
                    )}{" "}
                </div>

                <div className="icon__btn">
                    <Forward10Icon fontSize="large" onClick={onForward} />
                </div>
            </div>
            <div className="bottom__container">
                <div className="slider__container">
                    <span style={{paddingRight: "30px", textWrap: "nowrap"}}>{`${currentTime}`}</span>
                    <PrettoSlider
                        min={0}
                        max={100}
                        value={played * 100}
                        onChange={onSeek}
                        onChangeCommitted={onSeekMouseUp}
                        onMouseDown={onMouseSeekDown}
                    />
                    <span style={{paddingLeft: "30px", textWrap: "nowrap"}}>{`${duration}`}</span>
                </div>
                <div className="control__box">
                    <div className="inner__controls">
                        <div className="volume_controls">
                            <div className="volume_icon__btn" onClick={onMute}>
                                {mute ? (
                                    <VolumeOffIcon fontSize="large" />
                                ) : (
                                    <VolumeUpIcon fontSize="large" />
                                )}
                            </div>

                            <Slider
                                className={`${classes.volumeSlider}`}
                                onChange={onVolumeChangeHandler}
                                value={volume * 100}
                                onChangeCommitted={onVolumeSeekUp}
                            />
                        </div>
                        <div className="volume_icon__btn" onClick={toggleFullScreen}>
                            {fullScreen ? < FullscreenExitIcon fontSize="large"/> : <FullscreenIcon fontSize="large"/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Control;