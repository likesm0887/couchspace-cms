import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import "./counseling.css"

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const [showCamera, setShowCamera] = useState(true);
  const [showMic, setShowMic] = useState(true);

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
        <div className={"stopWatch"}>00:00:10</div>
        <button style={{ marginLeft: 20 }} onClick={onClickCamera}> <img style={{ height: 30, width: 40, verticalAlign: 'middle' }} src={showCamera ? require("../../../img/content/camera_enabled.png") : require("../../../img/content/camera_disabled.png")} alt="myCamera" />{"鏡頭"} </button>
        <button style={{ marginLeft: 20 }} onClick={onClickMic}> <img style={{ height: 40, width: 25, verticalAlign: 'middle' }} src={showMic ? require("../../../img/content/mic_enabled.png") : require("../../../img/content/mic_disabled.png")} alt="myMic" /> {"麥克風"}</button>
        <button onClick={handleLogout} className={"stop"}>結束諮商</button>
      </div>
    </div>
  );
};

export default Room;