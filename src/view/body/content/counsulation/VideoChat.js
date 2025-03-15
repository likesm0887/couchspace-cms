import React, { useState, useEffect } from "react";
import "./VideoChat.css";
import { appointmentService } from "../../../../service/ServicePool";
import { useNavigate } from "react-router-dom";
import ZoomVideo, { VideoQuality } from '@zoom/videosdk'
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
import { showToast, toastType } from "../../../../common/method";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Draggable from 'react-draggable';
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
  const [testUsers, setTestUsers] = useState(0);
  const [activeSpeakerId, setActiveSpeakerId] = useState("");
  const [isSupportVirtualBG, setIsSupportVirtualBG] = useState(false);
  const [open, setOpen] = useState(false);
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  const counterHeight = 60;
  const counterPadding = screenWidth - 150;
  const footerHeight = 100;
  const videoHeight = screenHeight - counterHeight - footerHeight - 20;
  let client = ZoomVideo.createClient();
  let stream;
  let supportHD;
  let errorMsg = "";
  const [participants, setParticipants] = useState(client.getAllUser());
  const handleJoin = async () => {
    setLoading(true);
    try {
      const tempAppointment = await appointmentService.getAppointment(props.appointmentID);
      const token = await appointmentService.getAppointmentRoomToken(props.appointmentID, "zoom");
      console.log("roomToken", token);

      // start join session
      if (ZoomVideo.checkSystemRequirements().video && ZoomVideo.checkSystemRequirements().audio) {
        await client.init('en-US', 'Global', { patchJsMedia: true, stayAwake: true, enforceMultipleVideos: true }).then(async () => {
          await client.join(tempAppointment.RoomID, token, tempAppointment.CounselorName, "").then(() => {
            stream = client.getMediaStream();
            var isVirtualBG = stream.isSupportVirtualBackground();
            console.log("isVirtualBG", isVirtualBG);
            setIsSupportVirtualBG(isVirtualBG);
          }).catch((error) => {
            console.warn(error);
            errorMsg = "目前瀏覽器不支援視訊功能，請更換其他瀏覽器以確保順暢使用。";
            throw new Error(errorMsg);
          })
        }).catch((error) => {
          console.warn(error);
          errorMsg = "目前瀏覽器不支援視訊功能，請更換其他瀏覽器以確保順暢使用。";
          throw new Error(errorMsg);
        })
      }
      else {
        errorMsg = "請授權存取鏡頭與麥克風，以提供完整功能的體驗。";
        throw new Error(errorMsg);
      }

      // subscribe events
      client.on('user-added', handleUserAdd);
      client.on('user-removed', handleUserRemoved);
      client.on('user-updated', handleUserUpdated);
      client.on('active-speaker', handleActiveSpeaker);
      supportHD = await stream.isSupportHDVideo();
      console.log("supportHD", supportHD);
      // start video streaming & audio
      stream.startVideo({ hd: supportHD, fullHd: supportHD });
      stream.startAudio();

      stream.mirrorVideo(true);
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
        stream.attachVideo(user.userId, VideoQuality.Video_1080P);
      })
    } catch (err) {
      console.warn("err", err);
      console.warn("errorMsg", errorMsg);
      showVideoErrorDialog();
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
  const handleActiveSpeaker = (payload) => {
    console.log("handleActiveSpeaker", payload);
    if (payload[0]?.userId) {
      setActiveSpeakerId(payload[0].userId);
      setTimeout(() => {
        setActiveSpeakerId("");
      }, 1000);
    }
  }
  const attachOrDetachRemoteUser = (user) => {
    console.log("user", user);
    if ((user === null) || (user === undefined) || (client.getCurrentUserInfo() === null)) return;
    console.log("all users", client.getAllUser());
    setParticipants(client.getAllUser());
    if (user.bVideoOn) {
      const stream = client.getMediaStream();
      stream.attachVideo(user.userId, VideoQuality.Video_1080P).then((userVideo) => {
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
      if (bgImgUrl) {
        stream.startVideo({ hd: supportHD, fullHd: supportHD, virtualBackground: bgImgUrl }).then(() => {
          // stream.attachVideo(client.getCurrentUserInfo().userId, 3, document.querySelector('#my-self-view'));
          setShowCamera(true);
        })
      }
      else {
        stream.startVideo({ hd: supportHD, fullHd: supportHD }).then(() => {
          // stream.attachVideo(client.getCurrentUserInfo().userId, 3, document.querySelector('#my-self-view'));
          setShowCamera(true);
        })
      }

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
      stream.startVideo({ hd: supportHD, fullHd: supportHD, virtualBackground: { imageUrl: bgImgUrl } }).then(() => {
        setShowBlur(false);
      })
    }
    else {
      bgImgUrl = "blur";
      stream.startVideo({ hd: supportHD, fullHd: supportHD, virtualBackground: { imageUrl: bgImgUrl } }).then(() => {
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
      stream.startVideo({ hd: supportHD, fullHd: supportHD, virtualBackground: { imageUrl: bgImgUrl } }).then(() => {
        setShowBG(false);
      })
    }
    else {
      bgImgUrl = "https://couchspace.blob.core.windows.net/dev/profile/20241002-98bc6a7a-5e17-4e55-b980-305bef5de2d5.jpg";
      stream.startVideo({ hd: supportHD, fullHd: supportHD, virtualBackground: { imageUrl: bgImgUrl } }).then(() => {
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
  const getWidthByParticipants = () => {
    let length = participants.length + testUsers - 1; // minus Counselor
    let output = "100%";
    if (screenWidth > 500) {
      switch (length) {
        case 0:
        case 1:
          output = "100%";
          break;

        case 2:
        case 4:
          output = "45%";
          break;

        case 3:
        case 5:
        case 6:
          output = "32%";
          break;

        default:
          output = "45%";
          break;
      }
    }
    else {
      switch (length) {
        case 0:
        case 1:
          output = "100%";
          break;

        case 2:
        case 4:
          output = "45%";
          break;

        case 3:
        case 5:
        case 6:
          output = "32%";
          break;

        default:
          output = "45%";
          break;
      }
    }
    return output;
  }
  const getMaxHeightWidthByParticipants = () => {
    let length = participants.length + testUsers - 1; // minus Counselor
    let output = "100%";
    if (screenWidth > 500) {
      switch (length) {
        case 0:
        case 1:
        case 2:
        case 3:
          output = "100%";
          break;

        case 4:
        case 5:
        case 6:
          output = "50%";
          break;

        default:
          output = "50%";
          break;
      }
    }
    else {
      switch (length) {
        case 0:
        case 1:
        case 2:
        case 3:
          output = "90%";
          break;

        case 4:
        case 5:
        case 6:
          output = "45%";
          break;

        default:
          output = "45%";
          break;
      }
    }
    return output;
  }
  const renderTestUsers = () => {
    let output = [];
    for (let i = 0; i < testUsers; i++) {
      output.push(
        <div key={i} class="empty-screen-container" style={{ maxHeight: getMaxHeightWidthByParticipants(), width: getWidthByParticipants(), borderColor: "#000000" }}>
          <div style={{ width: "100%" }}>
            <div class="screen-mic">
              <img style={{ height: 24, width: 24 }} src={img_mic_off} alt="Mic" />
            </div>
          </div>
          <div class="empty-screen justify-content-center align-items-center">
            <div style={{ textAlign: 'center' }}>
              <img style={{ height: 50, width: 50 }} src={img_screen_off} alt="Camera"></img>
              <div style={{ fontSize: 16, color: "#D8D8D8" }}> 對方已關閉鏡頭</div>
            </div>
          </div>
        </div>
      )
    }
    return (
      output.map((user, index) => {
        return user;
      })
    )
  }
  const VideoErrorDialog = () => {
    return <Dialog
      open={open}
      fullWidth={true}
      onClose={handleClose}
      value={"sm"}>
      <DialogTitle style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }} id="alert-dialog-title">{"目前無法連線"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "#000000", margin: 0 }}>{"請確認授權\n"}</p>
              <span style={{ color: "#565656" }}>{"請確保您的裝置已授權開啟麥克風和鏡頭。"}</span>
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "#000000", margin: 0 }}>{"請嘗試其他瀏覽器\n"}</p>
              <span style={{ color: "#565656" }}>{"若仍無法正常連線，建議嘗試更換瀏覽器。"}</span>
            </div>
            <div>
              <p style={{ color: "#000000", margin: 0 }}>{"重新啟動設備\n"}</p>
              <span style={{ color: "#565656" }}>{"若連線問題仍未解決，請嘗試重新開機您的裝置後再次連線。"}</span>
            </div>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <div className={"button-content"}>
          <button className={"acceptButton"} onClick={handleClose} color="primary">
            關閉
          </button>
        </div>
      </DialogActions>
    </Dialog>
  }
  const showVideoErrorDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    handleLeave();
  }
  useEffect(() => {
    client.off('user-added', handleUserAdd);
    client.off('user-removed', handleUserRemoved);
    client.off('user-updated', handleUserUpdated);
    client.off('active-speaker', handleActiveSpeaker);
    handleJoin();
    return () => {
      client.off('user-added', handleUserAdd);
      client.off('user-removed', handleUserRemoved);
      client.off('user-updated', handleUserUpdated);
      client.off('active-speaker', handleActiveSpeaker);
      ZoomVideo.destroyClient();
    }
  }, []);

  return (
    <div class="row align-items-center main-wrapper" style={{ backgroundColor: "#2A2B2E" }}>
      {loading ?
        <div className="video-loader-container">
          <div className="spinner"></div>
          <div style={{ font: 'caption', fontSize: 24, color: '#000000', fontWeight: "bold", marginTop: 46 }}>
            {"連線中，請稍候片刻"}
          </div>
          <div style={{ font: 'caption', fontSize: 16, color: '#565656', marginTop: 27 }}>
            {"為確保順利連線，請確認您的裝置已授權開啟麥克風和鏡頭"}
          </div>
          <div style={{ font: 'caption', fontSize: 16, color: '#565656' }}>
            {"如無法順利開啟，請嘗試更換瀏覽器或重啟裝置。"}
          </div>
        </div> :
        <div class="container" style={{ width: "100%", height: "100%" }}>
          <div class="col" style={{ height: counterHeight }}>
            <div style={{ margin: 5, marginLeft: counterPadding, textAlign: "center", width: 120, backgroundColor: "#FFFFFF", borderRadius: 4 }}>
              <img style={{ verticalAlign: 'middle', width: 24 }} src={img_time} alt="time" />
              <span style={{ verticalAlign: 'middle', marginRight: 5 }}>{num2HourTime(elapsedTime)}</span>
            </div>
          </div>
          {screenWidth > 500 ?
            <div class="room" style={{ height: videoHeight }}>
              {participants.map((user) => { // Counselor Video
                if (user.bVideoOn && user.userId === client.getCurrentUserInfo().userId) {
                  return (
                    <Draggable className='dragdiv' key={user.useId} >
                      <video-player-container style={{ zIndex: "999", position: "absolute", right: 40, bottom: 132, height: 183, width: 245 }}>
                        <div style={{ width: "100%" }}>
                          <div class="screen-mic">
                            <img style={{ height: 24, width: 24 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                          </div>
                        </div>
                        <video-player class="video-player align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }} node-id={user.userId}></video-player>
                      </video-player-container>
                    </Draggable>
                  )
                }
                else if (!user.bVideoOn && user.userId === client.getCurrentUserInfo().userId) {
                  return (
                    <Draggable className='dragdiv' key={user.useId} >
                      <div class="empty-screen-container" style={{ zIndex: "999", position: "absolute", right: 40, bottom: 132, height: 183, width: 245 }} >
                        <div style={{ width: "100%" }}>
                          <div class="screen-mic">
                            <img style={{ height: 24, width: 24 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                          </div>
                        </div>
                        <div class="empty-screen justify-content-center align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }}>
                          <div style={{ textAlign: 'center' }}>
                            <img style={{ height: 50, width: 50 }} src={img_screen_off} alt="Camera"></img>
                            <div style={{ fontSize: 16, color: "#D8D8D8" }}> 已關閉鏡頭</div>
                          </div>
                        </div>
                      </div>
                    </Draggable>
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
                    <video-player-container key={user.useId} style={{ maxHeight: getMaxHeightWidthByParticipants(), width: getWidthByParticipants() }}>
                      <div style={{ width: "100%" }}>
                        <div class="screen-mic">
                          <img style={{ height: 24, width: 24 }} src={user.muted ? img_mic_off : img_mic_on} alt="Mic" />
                        </div>
                      </div>
                      <video-player class="video-player align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }} node-id={user.userId}></video-player>
                    </video-player-container>
                  )
                }
                else if (!user.bVideoOn && user.userId !== client.getCurrentUserInfo().userId) {
                  return (
                    <div key={user.useId} class="empty-screen-container" style={{ maxHeight: getMaxHeightWidthByParticipants(), width: getWidthByParticipants() }}>
                      <div style={{ width: "100%" }}>
                        <div class="screen-mic">
                          <img style={{ height: 24, width: 24 }} src={user.muted ? img_mic_off : img_mic_on} alt="Mic" />
                        </div>
                      </div>
                      <div class="empty-screen justify-content-center align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }}>
                        <div style={{ textAlign: 'center' }}>
                          <img style={{ height: 50, width: 50 }} src={img_screen_off} alt="Camera"></img>
                          <div style={{ fontSize: 16, color: "#D8D8D8" }}> 對方已關閉鏡頭</div>
                        </div>
                      </div>
                    </div>
                  )
                }
                else {
                  return null;
                }
              })
              }
              {renderTestUsers()}
            </div>
            : // Phone View
            <div class="room" style={{ height: videoHeight }}>
              {participants.map((user) => { // Counselor Video
                if (user.bVideoOn && user.userId === client.getCurrentUserInfo().userId) {
                  return (
                    <Draggable className='dragdiv' key={user.useId} >
                      <video-player-container style={{ zIndex: "999", position: "absolute", right: 18, bottom: 137, height: 150, width: 112 }}>
                        <div style={{ width: "100%" }}>
                          <div class="screen-mic">
                            <img style={{ height: 24, width: 24 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                          </div>
                        </div>
                        <video-player class="video-player align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }} node-id={user.userId}></video-player>
                      </video-player-container>
                    </Draggable>
                  )
                }
                else if (!user.bVideoOn && user.userId === client.getCurrentUserInfo().userId) {
                  return (
                    <Draggable className='dragdiv' key={user.useId} >
                      <div class="empty-screen-container" style={{ zIndex: "999", position: "absolute", right: 18, bottom: 137, height: 150, width: 112 }} >
                        <div style={{ width: "100%" }}>
                          <div class="screen-mic">
                            <img style={{ height: 24, width: 24 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                          </div>
                        </div>
                        <div class="empty-screen justify-content-center align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }}>
                          <div style={{ textAlign: 'center' }}>
                            <img style={{ height: 50, width: 50 }} src={img_screen_off} alt="Camera"></img>
                            <div style={{ fontSize: 16, color: "#D8D8D8" }}> 已關閉鏡頭</div>
                          </div>
                        </div>
                      </div>
                    </Draggable>
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
                    <video-player-container key={user.useId} style={{ maxHeight: getMaxHeightWidthByParticipants(), width: getWidthByParticipants() }}>
                      <div style={{ width: "100%" }}>
                        <div class="screen-mic">
                          <img style={{ height: 24, width: 24 }} src={user.muted ? img_mic_off : img_mic_on} alt="Mic" />
                        </div>
                      </div>
                      <video-player class="video-player align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }} node-id={user.userId}></video-player>
                    </video-player-container>
                  )
                }
                else if (!user.bVideoOn && user.userId !== client.getCurrentUserInfo().userId) {
                  return (
                    <div key={user.useId} class="empty-screen-container" style={{ maxHeight: getMaxHeightWidthByParticipants(), width: getWidthByParticipants() }}>
                      <div style={{ width: "100%" }}>
                        <div class="screen-mic">
                          <img style={{ height: 24, width: 24 }} src={user.muted ? img_mic_off : img_mic_on} alt="Mic" />
                        </div>
                      </div>
                      <div class="empty-screen justify-content-center align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }}>
                        <div style={{ textAlign: 'center' }}>
                          <img style={{ height: 50, width: 50 }} src={img_screen_off} alt="Camera"></img>
                          <div style={{ fontSize: 16, color: "#D8D8D8" }}> 對方已關閉鏡頭</div>
                        </div>
                      </div>
                    </div>
                  )
                }
                else {
                  return null;
                }
              })
              }
              {renderTestUsers()}
            </div>
          }
          {screenWidth > 500 ?
            <div class="row justify-content-center align-items-center" style={{ height: footerHeight }}>
              <div class="col-auto p-0" style={{ marginRight: 29 }}>
                <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                  <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickMic}>
                    <img style={{ verticalAlign: 'middle', height: 60, width: 60 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                  </button>
                  <div style={{ color: "#D8D8D8" }}>{showMic ? "麥克風已開啟" : "麥克風已關閉"}</div>
                </div>
              </div>
              <div class="col-auto p-0" style={{ marginRight: 41 }}>
                <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                  <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickCamera}>
                    <img style={{ verticalAlign: 'middle', height: 60, width: 60 }} src={showCamera ? img_camera_on : img_camera_off} alt="Camera" />
                  </button>
                  <div style={{ color: "#D8D8D8" }}>{showCamera ? "鏡頭已開啟" : "鏡頭已關閉"}</div>
                </div>
              </div>
              {/* <div class="col-auto p-0">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickMirror}>
                <img style={{ verticalAlign: 'middle' }} src={require("../../../img/content/mirror.png")} alt="mirror" />
              </button>
              <div>鏡像</div>
            </div>
          </div> */}
              {isSupportVirtualBG ?
                <div class="col-auto p-0" style={{ marginRight: 92 }}>
                  <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                    <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickBlur}>
                      <img style={{ verticalAlign: 'middle', height: 60, width: 60 }} src={showBlur ? img_blur_on : img_blur_off} alt="Blur" />
                    </button>
                    <div style={{ color: "#D8D8D8" }}>{"背景模糊"}</div>
                  </div>
                </div> : null}
              {/* {isSupportVirtualBG ?
              <div class="col-auto">
                <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                  <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickChangeBG}>
                    <img style={{ verticalAlign: 'middle', height: 60, width: 60 }} src={showBG ? img_bg_photo_on : img_bg_photo_off} alt="Blur" />
                  </button>
                  <div style={{ color: "#D8D8D8" }}>{"更換背景"}</div>
                </div>
              </div> : null} */}
              <div class="col-auto p-0">
                <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                  <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickExit}>
                    <img style={{ verticalAlign: 'middle', height: 60, width: 60 }} src={img_leave} alt="Leave" />
                  </button>
                  <div style={{ color: "#D8D8D8" }}>{"離開房間"}</div>
                </div>
              </div>
              {/* <div class="col-auto">
                <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                  <label style={{ color: "white", fontSize: 18 }}>
                    Test Users:
                    <input name="TestUsers" type="number"
                      value={testUsers}
                      onChange={(e) => {
                        if (parseInt(e?.target?.value) > 5) {
                          setTestUsers(5);
                        }
                        else if (parseInt(e?.target?.value) >= 0 && parseInt(e?.target?.value) <= 5) {
                          setTestUsers(parseInt(e.target.value));
                        }
                        else {
                          setTestUsers(0);
                        }
                      }}
                    />
                  </label>
                </div>
              </div> */}
            </div>
            :
            <div class="row justify-content-center align-items-center" style={{ height: footerHeight }}>
              <div class="col-auto p-0" style={{ marginRight: 30 }}>
                <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                  <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickMic}>
                    <img style={{ verticalAlign: 'middle', height: 40, width: 40 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                  </button>
                  <div style={{ color: "#D8D8D8", fontSize: 10 }}>{showMic ? "麥克風已開啟" : "麥克風已關閉"}</div>
                </div>
              </div>
              <div class="col-auto p-0" style={{ marginRight: 30 }}>
                <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                  <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickCamera}>
                    <img style={{ verticalAlign: 'middle', height: 40, width: 40 }} src={showCamera ? img_camera_on : img_camera_off} alt="Camera" />
                  </button>
                  <div style={{ color: "#D8D8D8", fontSize: 10 }}>{showCamera ? "鏡頭已開啟" : "鏡頭已關閉"}</div>
                </div>
              </div>
              {/* <div class="col-auto p-0">
            <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickMirror}>
                <img style={{ verticalAlign: 'middle' }} src={require("../../../img/content/mirror.png")} alt="mirror" />
              </button>
              <div>鏡像</div>
            </div>
          </div> */}
              {isSupportVirtualBG ?
                <div class="col-auto p-0" style={{ marginRight: 30 }}>
                  <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                    <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickBlur}>
                      <img style={{ verticalAlign: 'middle', height: 40, width: 40 }} src={showBlur ? img_blur_on : img_blur_off} alt="Blur" />
                    </button>
                    <div style={{ color: "#D8D8D8", fontSize: 10 }}>{"背景模糊"}</div>
                  </div>
                </div> : null}
              {/* {isSupportVirtualBG ?
              <div class="col-auto">
                <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                  <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickChangeBG}>
                    <img style={{ verticalAlign: 'middle', height: 40, width: 40 }} src={showBG ? img_bg_photo_on : img_bg_photo_off} alt="Blur" />
                  </button>
                  <div style={{ color: "#D8D8D8" }}>{"更換背景"}</div>
                </div>
              </div> : null} */}
              <div class="col-auto p-0">
                <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                  <button style={{ borderColor: 'transparent', backgroundColor: 'transparent' }} onClick={onClickExit}>
                    <img style={{ verticalAlign: 'middle', height: 40, width: 40 }} src={img_leave} alt="Leave" />
                  </button>
                  <div style={{ color: "#D8D8D8", fontSize: 10 }}>{"離開房間"}</div>
                </div>
              </div>
              {/* <div class="col-auto">
                <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
                  <label style={{ color: "white", fontSize: 18 }}>
                    Test Users:
                    <input name="TestUsers" type="number"
                      value={testUsers}
                      onChange={(e) => {
                        if (parseInt(e?.target?.value) > 5) {
                          setTestUsers(5);
                        }
                        else if (parseInt(e?.target?.value) >= 0 && parseInt(e?.target?.value) <= 5) {
                          setTestUsers(parseInt(e.target.value));
                        }
                        else {
                          setTestUsers(0);
                        }
                      }}
                    />
                  </label>
                </div>
              </div> */}
            </div>
          }
        </div>}
      {VideoErrorDialog()}
    </div>
  )
};

export default VideoChat;