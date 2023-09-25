import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import "./counseling.css"
const Room = ({ roomName, room, handleLogout, appointmentTime }) => {
  const [participants, setParticipants] = useState([]);
  const [showCamera, setShowCamera] = useState(true);
  const [showMic, setShowMic] = useState(true);
  const [startDateTime, setStartDateTime] = useState(appointmentTime.Date);
  const [remainTime, setRemainTime] = useState(appointmentTime.Total * 60);
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

  const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-");
    const [hours, minutes] = timePart.split(":");
    return new Date(year, month - 1, day, hours, minutes);
  }
  const num2Time = (number) => {
    var minute = parseInt(number / 60)
      .toString()
      .padStart(2, "0");
    var second = parseInt(number % 60)
      .toString()
      .padStart(2, "0");
    return minute + ":" + second;
  }
  function updateCountDown() {
    setTimeout(() => {
      console.log("startDateTime", startDateTime);
      if (startDateTime === null) {
        updateCountDown();
        return;
      }
      var startTimeStamp = parseInt(parseDate(startDateTime).valueOf() / 1000); // ms to second
      var currentTimeStamp = parseInt(new Date().valueOf() / 1000); // ms to second
      var diff = currentTimeStamp - startTimeStamp;
      console.log("startTimeStamp, currentTimeStamp, diff", startTimeStamp, currentTimeStamp, diff);
      if (diff < remainTime && diff > 0) {
        setRemainTime(diff);
        updateCountDown();
      }
      else {
        setRemainTime(0);
      }
    }, 500);
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
        <div className={"stopWatch"}>{num2Time(remainTime)}</div>
        <button style={{ marginLeft: 20 }} onClick={onClickCamera}> <img style={{ height: 30, width: 40, verticalAlign: 'middle' }} src={showCamera ? require("../../../img/content/camera_enabled.png") : require("../../../img/content/camera_disabled.png")} alt="myCamera" />{"鏡頭"} </button>
        <button style={{ marginLeft: 20 }} onClick={onClickMic}> <img style={{ height: 40, width: 25, verticalAlign: 'middle' }} src={showMic ? require("../../../img/content/mic_enabled.png") : require("../../../img/content/mic_disabled.png")} alt="myMic" /> {"麥克風"}</button>
        <button onClick={handleLogout} className={"stop"}>結束諮商</button>
      </div>
    </div>
  );
};

export default Room;