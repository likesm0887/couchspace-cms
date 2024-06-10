import React, { useState, useCallback, useEffect } from "react";
import "./VideoChat.css";
import Video from "twilio-video";
import Room from "./Room";
import { appointmentService } from "../../../../service/ServicePool";
import { Appointment } from "../../../../dataContract/appointment";
import { useNavigate } from "react-router-dom";

const VideoChat = (props) => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    const tempAppointment = await appointmentService.getAppointment(props.appointmentID);
    const token = await appointmentService.getAppointmentRoomToken(props.appointmentID)
    console.log("roomToken", token);
    setAppointment(tempAppointment);
    setConnecting(true);
    Video.connect(
      token, {
      name: tempAppointment.RoomID,
      video: true,
      audio: true,
    })
      .then((room) => {
        setConnecting(false);
        setRoom(room);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setConnecting(false);
        setLoading(false);
      });
  }


  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      navigate("/couchspace-cms/home/consultation");
      return null;
    });
  }, []);

  useEffect(() => {
    handleSubmit();
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
        handleLogout();
      };
    }
  }, []);

  return (
    <div class="row h-100 align-items-center">
      {loading ?
        <div className="loader-container">
          <div className="spinner"></div>
          <div style={{ font: 'caption', fontSize: 40, color: 'black' }}>{"連接視訊中..."}</div>
        </div> :
        room ? <Room roomName={roomName} room={room} handleLogout={handleLogout} appointmentTime={appointment.Time} /> : null}
    </div>
  )
};

export default VideoChat;