import React, { useState, useEffect } from "react";
import "./VideoChat.css";
import { appointmentService } from "../../../../service/ServicePool";
import { useNavigate } from "react-router-dom";
import ZoomVideo from '@zoom/videosdk'
import { Switch } from "@mui/material";
import img_camera_on from "../../../img/content/btn_camera_turn_on.svg";
import img_camera_off from "../../../img/content/btn_camera_turn_off.svg";
import img_mic_on from "../../../img/content/btn_mic_turn_on.svg";
import img_mic_off from "../../../img/content/btn_mic_turn_off.svg";
import img_leave from "../../../img/content/btn_leave.svg";
import img_blur_on from "../../../img/content/btn_bg_blurred_turn_on.svg";
import img_blur_off from "../../../img/content/btn_bg_blurred_turn_off.svg";
import img_bg_photo_on from "../../../img/content/btn_bg_photo_on.svg";
import img_bg_photo_off from "../../../img/content/btn_bg_photo_off.svg";
import img_time from "../../../img/content/ic_time.svg";
import img_screen_off from "../../../img/content/ic_screen_camera_turn_off.svg";
let startDateTime = null;
let startTime = null;
let bgImgUrl = "";
const VideoChat = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [showMic, setShowMic] = useState(true);
  const [showBlur, setShowBlur] = useState(false);
  const [showBG, setShowBG] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  let client = ZoomVideo.createClient();
  let stream;
  const [participants, setParticipants] = useState(client.getAllUser());
  const handleJoin = async () => {
    setLoading(true);
    try {
      const tempAppointment = await appointmentService.getAppointment(props.appointmentID);
      const token = await appointmentService.getAppointmentRoomToken(props.appointmentID, "zoom");
      console.log("roomToken", token);

      // start join session
      await client.init('en-US', 'Global', { patchJsMedia: true, stayAwake: true, enforceVirtualBackground: true, enforceMultipleVideos: true });
      await client.join(tempAppointment.RoomID, token, tempAppointment.CounselorName, "");
      stream = client.getMediaStream();

      // subscribe events
      client.on('user-added', handleUserAdd);
      client.on('user-removed', handleUserRemoved);
      client.on('user-updated', handleUserUpdated);

      // start video streaming & audio
      await stream.startVideo({ virtualBackground: { imageUrl: bgImgUrl } });
      await stream.startAudio();

      console.log("stream", stream);
      console.log("client", client);
      console.log("session info", client.getSessionInfo());
      stream.unmuteAudio(client.getCurrentUserInfo().userId).then(() => {
        setShowMic(true);
      });
      // calculate elapsed time
      startDateTime = tempAppointment.Time.Date;
      startTime = tempAppointment.Time.StartTime;
      updateCountDown();

      // attach all users (local + remote)
      client.getAllUser().forEach((user) => {
        stream.attachVideo(user.userId);
      })
    } catch (err) {
      console.log("err", err);
      handleLeave();
    }
    setLoading(false);
  }
  const handleUserAdd = (payload) => {
    console.log("handleUserAdd", payload);
    attachOrDetachRemoteUser(payload[0]);
  }
  const handleUserRemoved = (payload) => {
    console.log("handleUserRemoved", payload);
    attachOrDetachRemoteUser(payload[0]);
  }
  const handleUserUpdated = (payload) => {
    console.log("handleUserUpdated", payload);
    if (payload) {
      attachOrDetachRemoteUser(payload[0]);
    }
  }

  const attachOrDetachRemoteUser = (user) => {
    console.log("user", user);
    if ((user === null) || (user === undefined) || (client.getCurrentUserInfo() === null)) return;
    console.log("all users", client.getAllUser());
    setParticipants(client.getAllUser());
    if (user.bVideoOn) {
      const stream = client.getMediaStream();
      stream.attachVideo(user.userId, 3).then((userVideo) => {
        console.log("userVideo", userVideo);
      });
    }
    else if (user.bVideoOn === false) {
      const stream = client.getMediaStream();
      stream.detachVideo(user.userId);
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
      stream.startVideo({ virtualBackground: { imageUrl: bgImgUrl } }).then(() => {
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
      bgImgUrl = "";
      stream.startVideo({ virtualBackground: { imageUrl: bgImgUrl } }).then(() => {
        setShowBlur(false);
      })
    }
    else {
      bgImgUrl = "blur";
      stream.startVideo({ virtualBackground: { imageUrl: bgImgUrl } }).then(() => {
        setShowBlur(true);
      })
    }
    setShowCamera(true);
    setShowBG(false);
  }
  const onClickChangeBG = async () => {
    const stream = client.getMediaStream();
    const localUser = await client.getUser(client.getCurrentUserInfo().userId);
    const isVideoOn = localUser.bVideoOn;
    if (isVideoOn) {
      await stream.stopVideo();
    }

    if (showBG) {
      bgImgUrl = "";
      stream.startVideo({ virtualBackground: { imageUrl: bgImgUrl } }).then(() => {
        setShowBG(false);
      })
    }
    else {
      bgImgUrl = "https://couchspace.blob.core.windows.net/dev/profile/20241002-98bc6a7a-5e17-4e55-b980-305bef5de2d5.jpg";
      stream.startVideo({ virtualBackground: { imageUrl: bgImgUrl } }).then(() => {
        setShowBG(true);
      })
    }
    setShowCamera(true);
    setShowBlur(false);
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
  const getWidthByParticipants = (length) => {
    let output = "50%";
    switch (length) {
      case 0:
      case 1:
      case 2:
      case 4:
        output = "50%";
        break;

      case 3:
      case 5:
      case 6:
        output = "33.33%";
        break;

      default:
        output = "50%";
        break;
    }
    return output;
  }
  const getMaxHeightWidthByParticipants = (length) => {
    let output = "100%";
    switch (length) {
      case 0:
      case 1:
      case 2:
        output = "100%";
        break;

      case 3:
      case 4:
      case 5:
      case 6:
        output = "50%";
        break;

      default:
        output = "50%";
        break;
    }
    return output;
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
    <div class="row h-100 align-items-center" style={{ backgroundColor: "#2A2B2E" }}>
      {loading ?
        <div className="video-loader-container">
          <div className="spinner"></div>
          <div style={{ font: 'caption', fontSize: 40, color: 'black' }}>{"連接視訊中..."}</div>
        </div> : null}
      <div class="container" style={{ width: "100%", height: "100%" }}>
        <div style={{ alignContent: "center", justifyItems: "flex-end", width: "100%", height: "10%" }}>
          <div style={{ height: 31, width: 110, marginRight: 20, backgroundColor: "#FFFFFF", borderRadius: 4 }}>
            <img style={{ verticalAlign: 'middle', height: 24, width: 24 }} src={img_time} alt="time" />
            <span style={{ verticalAlign: 'middle' }}>{num2HourTime(elapsedTime)}</span>
          </div>
        </div>
        <div class="room">
          {participants.map((user) => { // Counselor Video
            if (user.bVideoOn && user.userId === client.getCurrentUserInfo().userId) {
              return (
                <video-player-container style={{ maxHeight: getMaxHeightWidthByParticipants(participants.length), width: getWidthByParticipants(participants.length) }}>
                  <div style={{ width: "100%" }}>
                    <div style={{ justifySelf: "flex-end" }}>
                      <img class="screen-mic" src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                    </div>
                  </div>
                  <video-player class="video-player" node-id={user.userId}></video-player>
                </video-player-container>
              )
            }
            else if (!user.bVideoOn && user.userId === client.getCurrentUserInfo().userId) {
              return (
                <div class="empty-screen-container" style={{ maxHeight: getMaxHeightWidthByParticipants(participants.length), width: getWidthByParticipants(participants.length) }} >
                  <div style={{ width: "100%" }}>
                    <div style={{ justifySelf: "flex-end" }}>
                      <img class="screen-mic" src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                    </div>
                  </div>
                  <div class="empty-screen">
                    <img style={{ height: 70, width: 70 }} src={img_screen_off} alt="Camera"></img>
                    <p style={{ fontSize: 16, color: "#D8D8D8" }}> 已關閉鏡頭</p>
                  </div>
                </div>
              )
            }
            else {
              return null;
            }
          })
          }
          {participants.map((user) => { // Users Video
            if (user.bVideoOn && user.userId !== client.getCurrentUserInfo().userId) {
              return (
                <video-player-container style={{ maxHeight: getMaxHeightWidthByParticipants(participants.length), width: getWidthByParticipants(participants.length) }}>
                  <div style={{ width: "100%" }}>
                    <div style={{ justifySelf: "flex-end" }}>
                      <img class="screen-mic" src={user.muted ? img_mic_off : img_mic_on} alt="Mic" />
                    </div>
                  </div>
                  <video-player class="video-player" node-id={user.userId}></video-player>
                </video-player-container>
              )
            }
            else if (!user.bVideoOn && user.userId !== client.getCurrentUserInfo().userId) {
              return (
                <div class="empty-screen-container" style={{ maxHeight: getMaxHeightWidthByParticipants(participants.length), width: getWidthByParticipants(participants.length) }}>
                  <div style={{ width: "100%" }}>
                    <div style={{ justifySelf: "flex-end" }}>
                      <img class="screen-mic" src={user.muted ? img_mic_off : img_mic_on} alt="Mic" />
                    </div>
                  </div>
                  <div class="empty-screen">
                    <img style={{ height: 70, width: 70 }} src={img_screen_off} alt="Camera"></img>
                    <p style={{ fontSize: 16, color: "#D8D8D8" }}> 對方已關閉鏡頭</p>
                  </div>
                </div>
              )
            }
            else {
              return null;
            }
          })
          }
          {/* <div class="empty-screen-container" style={{ maxHeight: getMaxHeightWidthByParticipants(participants.length), width: getWidthByParticipants(participants.length) }}>
            <div style={{ width: "100%" }}>
              <div style={{ justifySelf: "flex-end" }}>
                <img class="screen-mic" src={img_mic_off} alt="Mic" />
              </div>
            </div>
            <div class="empty-screen">
              <img style={{ height: 70, width: 70 }} src={img_screen_off} alt="Camera"></img>
              <p style={{ fontSize: 16, color: "#D8D8D8" }}> 對方已關閉鏡頭</p>
            </div>
          </div> */}
          {/* <div class="empty-screen-container" style={{ maxHeight: getMaxHeightWidthByParticipants(participants.length), width: getWidthByParticipants(participants.length) }}>
            <div style={{ width: "100%" }}>
              <div style={{ justifySelf: "flex-end" }}>
                <img class="screen-mic" src={img_mic_off} alt="Mic" />
              </div>
            </div>
            <div class="empty-screen">
              <img style={{ height: 70, width: 70 }} src={img_screen_off} alt="Camera"></img>
              <p style={{ fontSize: 16, color: "#D8D8D8" }}> 對方已關閉鏡頭</p>
            </div>
          </div>
          <div class="empty-screen-container" style={{ maxHeight: getMaxHeightWidthByParticipants(participants.length), width: getWidthByParticipants(participants.length) }}>
            <div style={{ width: "100%" }}>
              <div style={{ justifySelf: "flex-end" }}>
                <img class="screen-mic" src={img_mic_off} alt="Mic" />
              </div>
            </div>
            <div class="empty-screen">
              <img style={{ height: 70, width: 70 }} src={img_screen_off} alt="Camera"></img>
              <p style={{ fontSize: 16, color: "#D8D8D8" }}> 對方已關閉鏡頭</p>
            </div>
          </div> */}
        </div>
        <div class="row justify-content-center align-items-center" style={{ marginTop: 5, height: 120 }}>
          <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickMic}>
                <img style={{ verticalAlign: 'middle', height: 79, width: 79 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
              </button>
              <p style={{ color: "#D8D8D8" }}>{showMic ? "麥克風已開啟" : "麥克風已關閉"}</p>
            </div>
          </div>
          <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickCamera}>
                <img style={{ verticalAlign: 'middle', height: 79, width: 79 }} src={showCamera ? img_camera_on : img_camera_off} alt="Camera" />
              </button>
              <p style={{ color: "#D8D8D8" }}>{showCamera ? "鏡頭已開啟" : "鏡頭已關閉"}</p>
            </div>
          </div>
          {/* <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickMirror}>
                <img style={{ verticalAlign: 'middle' }} src={require("../../../img/content/mirror.png")} alt="mirror" />
              </button>
              <p>鏡像</p>
            </div>
          </div> */}
          <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickBlur}>
                <img style={{ verticalAlign: 'middle', height: 79, width: 79 }} src={showBlur ? img_blur_on : img_blur_off} alt="Blur" />
              </button>
              <p style={{ color: "#D8D8D8" }}>{"背景模糊"}</p>
            </div>
          </div>
          <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickChangeBG}>
                <img style={{ verticalAlign: 'middle', height: 79, width: 79 }} src={showBG ? img_bg_photo_on : img_bg_photo_off} alt="Blur" />
              </button>
              <p style={{ color: "#D8D8D8" }}>{"更換背景"}</p>
            </div>
          </div>
          <div class="col-auto">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickExit}>
                <img style={{ verticalAlign: 'middle', height: 79, width: 79 }} src={img_leave} alt="Leave" />
              </button>
              <p style={{ color: "#D8D8D8" }}>{"離開房間"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default VideoChat;