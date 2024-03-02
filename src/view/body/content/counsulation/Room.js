import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import "./counseling.css";
import { Switch } from "@mui/material";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
let startDateTime = null;
let startTime = null;
const Room = ({ roomName, room, handleLogout, appointmentTime }) => {
  const [participants, setParticipants] = useState([]);
  const [showCamera, setShowCamera] = useState(true);
  const [showMic, setShowMic] = useState(true);
  const [showBlur, setShowBlur] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(appointmentTime.Total * 60);
  startDateTime = appointmentTime.Date;
  startTime = appointmentTime.StartTime;
  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };
    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    updateCountDown();
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
      setParticipants([]);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} blur={false} isLocalTrack={false} />
  ));
  const onClickCamera = () => {
    if (showCamera) {
      room.localParticipant.videoTracks.forEach(publication => {
        publication.track.disable();
      });

    }
    else {
      room.localParticipant.videoTracks.forEach(publication => {
        publication.track.enable();
      });
    }
    setShowCamera(!showCamera);
  }
  const onClickMic = () => {
    if (showMic) {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.disable();
      });
    }
    else {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.enable();
      });

    }
    setShowMic(!showMic);
  }
  const onClickBlur = () => {
    setShowBlur(!showBlur);
  }
  const parseDateTime = (dateString, timeString) => {
    [dateString,] = dateString.split(" ");
    const [year, month, day] = dateString.split("-");
    const [hours, minutes] = timeString.split(":");
    return new Date(year, month - 1, day, hours, minutes);
  }
  const num2HourTime = (number) => {
    var hour = parseInt(number / 3600)
      .toString()
      .padStart(2, "0");
    number -= hour * 3600;
    var minute = parseInt(number / 60)
      .toString()
      .padStart(2, "0");
    var second = parseInt(number % 60)
      .toString()
      .padStart(2, "0");
    return hour + ":" + minute + ":" + second;
  }
  function updateCountDown() {
    setTimeout(() => {
      if (startDateTime === null || startTime === null) {
        return;
      }
      var startTimeStamp = parseInt(parseDateTime(startDateTime, startTime).valueOf() / 1000); // ms to second
      var currentTimeStamp = parseInt(new Date().valueOf() / 1000); // ms to second
      var diff = currentTimeStamp - startTimeStamp;
      if (diff > 0) {
        setElapsedTime(diff);
        updateCountDown();
      }
      else {
        setElapsedTime(0);
      }
    }, 500);
  }
  const onClickExit = () => {
    startDateTime = null;
    startTime = null;
    handleLogout();
  }
  return (
    <div className="room">
      <div className={"Screen"}>
        <div className={"local-participant"}>
          {room ? (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              blur={showBlur}
              isLocalTrack={true}
            />
          ) : (
            ""
          )}
        </div>
        <div className={"remote-participants"}>
          {remoteParticipants}
        </div>
      </div>
      <div className={"stopAndClose"}>
        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="bottom"
              control={<div style={{width: 100, height: 50, textAlign:'center', alignSelf:'center', justifySelf:'center'}}>{num2HourTime(elapsedTime)}</div>}
              label="諮商時間"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="bottom"
              control={<button style={{ width: 50, height: 50, borderColor:'transparent', backgroundColor:'transparent' }} onClick={onClickCamera}> <img style={{ verticalAlign: 'middle' }} src={showCamera ? require("../../../img/content/camera_enabled.png") : require("../../../img/content/camera_disabled.png")} alt="myCamera" /></button>}
              label="鏡頭"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="bottom"
              control={<button style={{ width: 50, height: 50, borderColor:'transparent', backgroundColor:'transparent' }} onClick={onClickMic}> <img style={{ verticalAlign: 'middle' }} src={showMic ? require("../../../img/content/mic_enabled.png") : require("../../../img/content/mic_disabled.png")} alt="myMic" /></button>}
              label="麥克風"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="bottom"
              control={<div style={{ width: 50, height: 50}}><Switch onChange={onClickBlur} checked={showBlur}> {"模糊背景"}</Switch></div> }
              label="模糊背景"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="bottom"
              control={<button onClick={onClickExit} className={"stop"}>離開房間</button>}
              labelPlacement="bottom"
            />
          </FormGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default Room;