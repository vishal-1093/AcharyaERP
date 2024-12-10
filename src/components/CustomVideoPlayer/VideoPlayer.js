import ReactPlayer from "react-player";
import { Box } from "@mui/material";
import Control from "./Control";
import { useState, useRef } from "react";
import { formatTime } from "./Format";
import "./Control.css";

let count = 0;
function VideoPlayer({ videoPath }) {
    const videoPlayerRef = useRef(null);
    const controlRef = useRef(null);

    const [videoState, setVideoState] = useState({
        playing: true,
        muted: false,
        volume: 0.5,
        playbackRate: 1.0,
        played: 0,
        seeking: false,
        buffer: true,
        fullScreen: false
    });
    const [mediaReady, setMediaReady] = useState(false)

    //Destructuring the properties from the videoState
    const { playing, muted, volume, playbackRate, played, seeking, buffer, fullScreen } = videoState;

    const currentTime = videoPlayerRef.current
        ? videoPlayerRef.current.getCurrentTime()
        : "00:00";
    const duration = videoPlayerRef.current
        ? videoPlayerRef.current.getDuration()
        : "00:00";

    const formatCurrentTime = formatTime(currentTime);
    const formatDuration = formatTime(duration);

    const playPauseHandler = () => {
        //plays and pause the video (toggling)
        setVideoState({ ...videoState, playing: !videoState.playing });
    };

    const rewindHandler = () => {
        //Rewinds the video player reducing 10
        videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() - 10);
    };

    const handleFastFoward = () => {
        //FastFowards the video player by adding 10
        videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() + 10);
    };

    //console.log("========", (controlRef.current.style.visibility = "false"));
    const progressHandler = (state) => {
        if (count > 3) {
            console.log("close");
            controlRef.current.style.visibility = "hidden"; // toggling player control container
        } else if (controlRef.current.style.visibility === "visible") {
            count += 1;
        }

        if (!seeking) {
            setVideoState({ ...videoState, ...state });
        }
    };

    const seekHandler = (e, value) => {
        setVideoState({ ...videoState, played: parseFloat(value / 100) });
        videoPlayerRef.current.seekTo(parseFloat(value / 100));
    };

    const seekMouseUpHandler = (e, value) => {
        setVideoState({ ...videoState, seeking: false });
        videoPlayerRef.current.seekTo(value / 100);
    };

    const volumeChangeHandler = (e, value) => {
        const newVolume = parseFloat(value) / 100;

        setVideoState({
            ...videoState,
            volume: newVolume,
            muted: Number(newVolume) === 0 ? true : false, // volume === 0 then muted
        });
    };

    const volumeSeekUpHandler = (e, value) => {
        const newVolume = parseFloat(value) / 100;

        setVideoState({
            ...videoState,
            volume: newVolume,
            muted: newVolume === 0 ? true : false,
        });
    };

    const muteHandler = () => {
        //Mutes the video player
        setVideoState({ ...videoState, muted: !videoState.muted });
    };

    const onSeekMouseDownHandler = (e) => {
        setVideoState({ ...videoState, seeking: true });
    };

    const mouseMoveHandler = () => {
        controlRef.current.style.visibility = "visible";
        count = 0;
    };

    const bufferStartHandler = () => {
        setVideoState({ ...videoState, buffer: true });
    };

    const bufferEndHandler = () => {
        setVideoState({ ...videoState, buffer: false });
    };

    const toggleFullScreen = () => {
        var helpVideoContainer = document.getElementById("help__video");
        if (document.fullscreenEnabled) {
            if (helpVideoContainer.requestFullScreen) {
                helpVideoContainer.requestFullScreen();
            } else if (helpVideoContainer.mozRequestFullScreen) {
                helpVideoContainer.mozRequestFullScreen();
            } else if (helpVideoContainer.webkitRequestFullScreen) {
                helpVideoContainer.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            setVideoState({ ...videoState, fullScreen: true })
        } else {
            helpVideoContainer.exitFullscreen();
            setVideoState({ ...videoState, fullScreen: false })
        }
    }

    const onMediaReady = () => setMediaReady(true)

    return (
        <div className="video_container">
            <Box sx={{ padding: 0 }} padding={0}>
                <div className="player__wrapper" onMouseMove={mouseMoveHandler} id="help__video">
                    {mediaReady ? <ReactPlayer
                        ref={videoPlayerRef}
                        className="player"
                        url={videoPath}
                        width="100%"
                        height="100%"
                        playing={playing}
                        volume={volume}
                        muted={muted}
                        onProgress={progressHandler}
                        onBuffer={bufferStartHandler}
                        onBufferEnd={bufferEndHandler}
                        onReady={onMediaReady}
                    /> : <ReactPlayer
                        ref={videoPlayerRef}
                        className="player"
                        url={videoPath}
                        width="100%"
                        height="540px"
                        playing={playing}
                        volume={volume}
                        muted={muted}
                        onProgress={progressHandler}
                        onBuffer={bufferStartHandler}
                        onBufferEnd={bufferEndHandler}
                        onReady={onMediaReady}
                    />}

                    <Control
                        controlRef={controlRef}
                        onPlayPause={playPauseHandler}
                        playing={playing}
                        onRewind={rewindHandler}
                        onForward={handleFastFoward}
                        played={played}
                        onSeek={seekHandler}
                        onSeekMouseUp={seekMouseUpHandler}
                        volume={volume}
                        onVolumeChangeHandler={volumeChangeHandler}
                        onVolumeSeekUp={volumeSeekUpHandler}
                        mute={muted}
                        onMute={muteHandler}
                        playRate={playbackRate}
                        duration={formatDuration}
                        currentTime={formatCurrentTime}
                        onMouseSeekDown={onSeekMouseDownHandler}
                        toggleFullScreen={toggleFullScreen}
                        fullScreen={fullScreen}
                        buffer={buffer}
                    />
                </div>
            </Box>
        </div>
    );
}

export default VideoPlayer;