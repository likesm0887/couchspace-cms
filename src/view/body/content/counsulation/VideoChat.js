import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Room from "./Room";
import { appointmentService } from "../../../../service/ServicePool";
import { Appointment } from "../../../../dataContract/appointment";

const VideoChat = (props) => {

  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [buttonName, setButtonName] = useState("開始視訊");
  const handleUsernameChange = useCallback((event) => {
    setUsername("我是誰");
  }, []);



  const handleSubmit = async () => {

    const appointment = await appointmentService.getAppointment(props.appointmentID)
    const token = await appointmentService.getAppointmentRoomToken(props.appointmentID)
    console.log("roomToken", token);
    setConnecting(true);

    Video.connect(
      token, {
      name: appointment.RoomID,
    })
      .then((room) => {
        setConnecting(false);
        setRoom(room);
      })
      .catch((err) => {
        console.error(err);
        setConnecting(false);
      });

    navigator.mediaDevices.getUserMedia()
      .then(function (stream) {

        // 取得所有串流的裝置，並全部關閉
        stream.getTracks().forEach(function (track) {
          track.stop()
        })

      })
    // setButtonName("連線中....")
  }


  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, []);

  useEffect(() => {
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
  }, [room, handleLogout]);

  let render;
  if (room) {
    render = (
      <Room roomName={roomName} room={room} handleLogout={handleLogout} />

    );
  } else {
    render = (
      <button onClick={() => handleSubmit()}>{buttonName}</button>
    );
  }

  return render;
};

export default VideoChat;