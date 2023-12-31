import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import "./counseling.css";

let startDateTime = null;
let startTime = null;
const Room = ({ roomName, room, handleLogout, appointmentTime }) => {
  const [participants, setParticipants] = useState([]);
  const [showCamera, setShowCamera] = useState(true);
  const [showMic, setShowMic] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(appointmentTime.Total * 60);
  startDateTime = appointmentTime.Date;
  startTime = appointmentTime.StartTime;
  let totalTime = appointmentTime.Total * 60;
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
    <Participant key={participant.sid} participant={participant} />
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
        <div className={"stopWatch"}>{num2HourTime(elapsedTime)}</div>
        <button style={{ marginLeft: 20 }} onClick={onClickCamera}> <img style={{ height: 30, width: 40, verticalAlign: 'middle' }} src={showCamera ? require("../../../img/content/camera_enabled.png") : require("../../../img/content/camera_disabled.png")} alt="myCamera" />{"鏡頭"} </button>
        <button style={{ marginLeft: 20 }} onClick={onClickMic}> <img style={{ height: 40, width: 25, verticalAlign: 'middle' }} src={showMic ? require("../../../img/content/mic_enabled.png") : require("../../../img/content/mic_disabled.png")} alt="myMic" /> {"麥克風"}</button>
        <button onClick={onClickExit} className={"stop"}>離開房間</button>
      </div>
    </div>
  );
};

export default Room;