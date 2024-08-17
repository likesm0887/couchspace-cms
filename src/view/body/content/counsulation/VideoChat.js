import React, { useState, useEffect } from "react";
import "./VideoChat.css";
import { appointmentService } from "../../../../service/ServicePool";
import { useNavigate } from "react-router-dom";
import ZoomVideo from '@zoom/videosdk'
import { Switch } from "@mui/material";
let startDateTime = null;
let startTime = null;

const VideoChat = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [showMic, setShowMic] = useState(true);
  const [showBlur, setShowBlur] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  let isShowRemoteUser = false;
  let client = ZoomVideo.createClient();
  let stream;
  const handleJoin = async () => {
    setLoading(true);
    try {
      const tempAppointment = await appointmentService.getAppointment(props.appointmentID);
      const token = await appointmentService.getAppointmentRoomToken(props.appointmentID, "zoom");
      console.log("roomToken", token);
      client.on('user-added', handleUserAdd);
      client.on('user-removed', handleUserRemoved);
      client.on('user-updated', handleUserUpdated);

      await client.init('en-US', 'Global', { patchJsMedia: true });
      await client.join(tempAppointment.RoomID, token, tempAppointment.UserName, "");
      stream = client.getMediaStream();
      stream.startVideo().then(() => {
        stream.renderVideo(document.querySelector('#my-self-view'), client.getCurrentUserInfo().userId, "100%", "100%", 0, 3, 2)
      })
      stream.startAudio();
      console.log("stream", stream);
      console.log("client", client);

      startDateTime = tempAppointment.Time.Date;
      startTime = tempAppointment.Time.StartTime;
      updateCountDown();
      client.getAllUser().forEach((user) => {
        attachOrDetachRemoteUser(user);
      })
    } catch (err) {
      console.log("err", err);
      handleLeave();
    }
    setLoading(false);
  }
  const handleUserAdd = (payload) => {
    console.log("handleUserAdd", payload);
    if (payload) {
      if (payload[0]) {
        payload[0].bVideoOn = true;
      }
      attachOrDetachRemoteUser(payload[0]);
    }
  }
  const handleUserRemoved = (payload) => {
    console.log("handleUserRemoved", payload);
    if (payload) {
      if (payload[0]) {
        payload[0].bVideoOn = false;
      }
      attachOrDetachRemoteUser(payload[0]);
    }
  }
  const handleUserUpdated = (payload) => {
    console.log("handleUserUpdated", payload);
    if (payload) {
      attachOrDetachRemoteUser(payload[0]);
    }
  }
  const attachOrDetachRemoteUser = (user) => {
    if ((user === null) || (user === undefined) || (client.getCurrentUserInfo() === null) || (user.userId === client.getCurrentUserInfo().userId)) return;

    if (user.bVideoOn && isShowRemoteUser === false) {
      const stream = client.getMediaStream();
      isShowRemoteUser = true;
      stream.attachVideo(user.userId, 3).then((userVideo) => {
        console.log("userVideo", userVideo);
        document.querySelector('video-player-container').appendChild(userVideo);
        document.querySelectorAll('video-player').forEach((element) => element.setAttribute("id", user.userId));
      });
    }
    else if (user.bVideoOn === false && isShowRemoteUser === true) {
      const stream = client.getMediaStream();
      isShowRemoteUser = false;
      stream.detachVideo(user.userId);
      let removedElement = document.getElementById(user.userId);
      while (removedElement) {
        document.querySelector('video-player-container').removeChild(removedElement);
        removedElement = document.getElementById(user.userId);
      }
    }
  }
  const handleLeave = () => {
    console.log("leave");
    client.leave();
    navigate("/couchspace-cms/home/consultation");
  };

  const onClickCamera = async () => {
    const stream = client.getMediaStream();
    const localUser = await client.getUser(client.getCurrentUserInfo().userId);
    const isVideoOn = localUser.bVideoOn;
    if (isVideoOn) {
      stream.stopVideo().then(() => {
        // stream.detachVideo(client.getCurrentUserInfo().userId)
        setShowCamera(false);
      })
    }
    else {
      stream.startVideo().then(() => {
        // stream.attachVideo(client.getCurrentUserInfo().userId, 3, document.querySelector('#my-self-view'));
        setShowCamera(true);
      })
    }
  }
  const onClickMic = async () => {
    const stream = client.getMediaStream();
    const isAudioMuted = await stream.isAudioMuted();
    console.log("isAudioMuted", isAudioMuted);
    if (isAudioMuted) {
      stream.unmuteAudio(client.getCurrentUserInfo().userId).then(() => {
        setShowMic(true);
      });
    }
    else {
      stream.muteAudio(client.getCurrentUserInfo().userId).then(() => {
        setShowMic(false);
      });
    }

  }
  const onClickBlur = async () => {
    const stream = client.getMediaStream();
    const localUser = await client.getUser(client.getCurrentUserInfo().userId);
    const isVideoOn = localUser.bVideoOn;
    if (isVideoOn) {
      await stream.stopVideo();
    }

    if (showBlur) {
      stream.startVideo({ virtualBackground: { imageUrl: undefined } }).then(() => {
        setShowBlur(false);
      })
    }
    else {
      stream.startVideo({ virtualBackground: { imageUrl: 'blur' } }).then(() => {
        setShowBlur(true);
      })
    }
  }

  const onClickMirror = async () => {
    const stream = client.getMediaStream();
    stream.mirrorVideo(!mirror).then(() => setMirror(!mirror));
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
    handleLeave();
  }

  useEffect(() => {
    client.off('user-added', handleUserAdd);
    client.off('user-removed', handleUserRemoved);
    client.off('user-updated', handleUserUpdated);
    handleJoin();
    return () => {
      client.off('user-added', handleUserAdd);
      client.off('user-removed', handleUserRemoved);
      client.off('user-updated', handleUserUpdated);
      ZoomVideo.destroyClient();
    }
  }, []);

  return (
    <div class="row h-100 align-items-center">
      {loading ?
        <div className="video-loader-container">
          <div className="spinner"></div>
          <div style={{ font: 'caption', fontSize: 40, color: 'black' }}>{"連接視訊中..."}</div>
        </div> : null}
      <div class="container" style={{ width: "100%", height: "100%" }}>
        <div class="room">
          <div class="remote-participant">
            <video-player-container></video-player-container>
          </div>
          <div class="order-first local-participant">
            <video id="my-self-view" style={{ height: "100%", width: "100%" }}></video>
          </div>
        </div>
        <div class="row justify-content-center align-items-center" style={{ marginTop: 5 }}>
          <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <p>{num2HourTime(elapsedTime)}</p>
              <p>諮詢時間</p>
            </div>
          </div>
          <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickCamera}>
                <img style={{ verticalAlign: 'middle' }} src={showCamera ? require("../../../img/content/camera_enabled.png") : require("../../../img/content/camera_disabled.png")} alt="myCamera" />
              </button>
              <p>鏡頭</p>
            </div>
          </div>
          <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickMic}>
                <img style={{ verticalAlign: 'middle' }} src={showMic ? require("../../../img/content/mic_enabled.png") : require("../../../img/content/mic_disabled.png")} alt="myMic" />
              </button>
              <p>麥克風</p>
            </div>
          </div>
          <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickMirror}>
                <img style={{ verticalAlign: 'middle' }} src={require("../../../img/content/mirror.jpg")} alt="mirror" />
              </button>
              <p>鏡像</p>
            </div>
          </div>
          {/* <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <Switch onChange={onClickBlur} checked={showBlur}>
              </Switch>
              <p>模糊背景</p>
            </div>
          </div> */}
          <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button onClick={() => onClickExit()}>離開房間</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default VideoChat;