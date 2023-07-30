import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import "./counseling.css"
const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);

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


        {/* <div>
        Remote participants:{' '}
        {JSON.stringify(remoteParticipants.map(v => v.identity))}
      </div>
      <h3>Remote Participants</h3> */}

      </div>
      <div className={"stopAndClose"}>
        <p className={"stopWatch"}>00:00:10</p>
        <button onClick={handleLogout} className={"stop"}>結束諮詢</button>
      </div>
    </div>
  );
};

export default Room;