import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Lobby from "./Lobby";
import Room from "./Room";

const VideoChat = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [buttonName, setButtonName] = useState("開始視訊");
  const handleUsernameChange = useCallback((event) => {
    setUsername("我是誰");
  }, []);

  const handleRoomNameChange = useCallback((event) => {
    setRoomName("9df4a50f-26bc-406d-87f1-1ae35ea67616");
  }, []);

  const handleSubmit = () => {
    console.log("test")

    setConnecting(true);

    Video.connect(
      "eyJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIiwidHdyIjoidXMxIiwidHlwIjoiSldUIn0.eyJleHAiOjE2Njg1MjQ5NDMsImdyYW50cyI6eyJpZGVudGl0eSI6IjgzZWRhODAxLWEzMzItNDhkNy04ZTliLTBjZDc3NmJjZTEzYyIsInZpZGVvIjp7InJvb20iOiI2NmUwMGIxZC1jNTJlLTQ1YmQtODAyNi1kYTkzMDVlOGUyMTEifX0sImlzcyI6IlNLYzJhMmJjNjc1YzZmMGYzNzdhMTVlYmJhNjdkNDRjMGEiLCJqdGkiOiJTS2MyYTJiYzY3NWM2ZjBmMzc3YTE1ZWJiYTY3ZDQ0YzBhLTE2Njg1MjEzNDMiLCJuYmYiOjE2Njg1MjEzNDMsInN1YiI6IkFDNDQ1NjhhZjM0NzJhZjQ5ZTkzNzE2NTI5ZGEwZDYzNjEifQ.aWqcGgS-gz12d1hgvMrIrVzLceiqK3118lPnN4Z-c58", {
      name: "efe96a3b-0d91-4897-b1f9-0bcc97dc9802",
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
    setButtonName("連線中....")
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