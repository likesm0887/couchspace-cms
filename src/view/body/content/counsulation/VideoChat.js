import React, { useState, useEffect, useRef } from "react";
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
import { getMediaDeviceError } from "./mediaSupport";
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
const IsSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
// iPadOS 13+ reports a desktop Mac user agent, so fall back to touch points for it.
const IsMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
  || (/Macintosh/.test(window.navigator.userAgent) && window.navigator.maxTouchPoints > 1);
console.log("IsSafari", IsSafari, "IsMobile", IsMobile);
// client.init downloads several MB of wasm from Zoom's CDN, which takes far longer
// on a mobile network, so phones get a larger budget before we give up.
const JOIN_TIMEOUT_MS = IsMobile ? 60000 : 30000;
// Phones cannot decode 1080p tiles; asking for it makes attachVideo fail there.
const RENDER_QUALITY = IsMobile ? VideoQuality.Video_360P : VideoQuality.Video_1080P;
const getViewport = () => ({
  width: window.innerWidth,
  height: (window.visualViewport && window.visualViewport.height) || window.innerHeight,
});
const VideoChat = (props) => {
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
  const clientRef = useRef(null);
  if (clientRef.current === null) {
    clientRef.current = ZoomVideo.createClient();
  }
  const client = clientRef.current;
  // Kept in refs so they survive re-renders; as plain locals they were reset to
  // undefined on every render, so every later startVideo silently lost HD.
  const streamRef = useRef(null);
  const supportHDRef = useRef(false);
  const joinedRef = useRef(false);
  const audioStartedRef = useRef(false);
  const audioGestureRef = useRef(null);
  const audioStartPromiseRef = useRef(null);
  const countDownRef = useRef(null);
  const listenersRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [needAudioGesture, setNeedAudioGesture] = useState(false);
  const [showCamera, setShowCamera] = useState(props.initialCameraOn ?? true);
  const [showMic, setShowMic] = useState(props.initialMicOn ?? false);
  const [showBlur, setShowBlur] = useState(false);
  const [showBG, setShowBG] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [testUsers, setTestUsers] = useState(0);
  const [activeSpeakerId, setActiveSpeakerId] = useState("");
  const [isSupportVirtualBG, setIsSupportVirtualBG] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewport, setViewport] = useState(getViewport);
  const screenHeight = viewport.height;
  const screenWidth = viewport.width;
  const counterHeight = 60;
  const counterPadding = Math.max(screenWidth - 150, 0);
  const footerHeight = 100;
  const videoHeight = Math.max(screenHeight - counterHeight - footerHeight - 20, 200);
  const [participants, setParticipants] = useState(() => client.getAllUser());
  const captureVideoOption = (extra) => {
    const hd = supportHDRef.current;
    // fullHd asks the camera for 1080p, which phones cannot deliver.
    return Object.assign({ hd: hd, fullHd: hd && !IsMobile }, extra || {});
  }
  const handleJoin = async () => {
    setLoading(true);
    let timeoutId;
    try {
      const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("連線逾時，請確認網路連線後重試。"));
        }, JOIN_TIMEOUT_MS);
      });
      await Promise.race([joinSession(), timeout]);
      if (!isMountedRef.current) {
        return;
      }
      // Entering the room is the only fatal step. Camera and microphone are set
      // up afterwards, so a media failure no longer throws the user back out.
      setLoading(false);
      setJoined(true);
    } catch (err) {
      console.warn("join failed", err);
      if (isMountedRef.current) {
        setErrorMessage(err?.reason || err?.message || "");
        setLoading(false);
        showVideoErrorDialog();
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }
  const joinSession = async () => {
    // Must come first: checkSystemRequirements reads navigator.mediaDevices without
    // guarding it, so on a page without media access it throws a TypeError rather
    // than reporting the feature as unsupported.
    const deviceError = getMediaDeviceError();
    if (deviceError) {
      throw new Error(deviceError);
    }
    let requirements;
    try {
      requirements = ZoomVideo.checkSystemRequirements();
    } catch (error) {
      console.warn("checkSystemRequirements failed", error);
      throw new Error("目前瀏覽器不支援視訊功能，請更換其他瀏覽器以確保順暢使用。");
    }
    if (!requirements.video || !requirements.audio) {
      throw new Error("目前瀏覽器不支援視訊功能，請更換其他瀏覽器以確保順暢使用。");
    }
    const tempAppointment = await appointmentService.getAppointment(props.appointmentID);
    const token = await appointmentService.getAppointmentRoomToken(props.appointmentID, "zoom");
    console.log("roomToken", token);

    try {
      await client.init('en-US', 'Global', { patchJsMedia: true, stayAwake: true, enforceMultipleVideos: true });
    } catch (error) {
      console.warn("init failed", error);
      throw new Error("目前瀏覽器不支援視訊功能，請更換其他瀏覽器以確保順暢使用。");
    }
    await client.join(tempAppointment.RoomID, token, props.nickname, "");
    joinedRef.current = true;
    streamRef.current = client.getMediaStream();
    console.log("session info", client.getSessionInfo());
    setParticipants(client.getAllUser());
    // calculate elapsed time
    startDateTime = tempAppointment.Time.Date;
    startTime = tempAppointment.Time.StartTime;
    updateCountDown();
  }
  // A tap fires both click and touchend, and it can land on the mic button too,
  // so every caller shares one in-flight startAudio instead of racing others.
  const startAudioSafely = () => {
    if (audioStartedRef.current) {
      return Promise.resolve();
    }
    if (audioStartPromiseRef.current) {
      return audioStartPromiseRef.current;
    }
    const stream = streamRef.current;
    if (!stream) {
      return Promise.resolve();
    }
    const pending = Promise.resolve(stream.startAudio(IsSafari ? { autoStartAudioInSafari: true } : {}))
      .then(() => {
        audioStartedRef.current = true;
        if (isMountedRef.current) {
          setNeedAudioGesture(false);
        }
      })
      .finally(() => {
        audioStartPromiseRef.current = null;
      });
    audioStartPromiseRef.current = pending;
    return pending;
  }
  const applyInitialMicState = async () => {
    const stream = streamRef.current;
    const userId = client.getCurrentUserInfo()?.userId;
    if (!stream || userId === undefined) {
      return;
    }
    if (props.initialMicOn === true) {
      await stream.unmuteAudio(userId);
      if (isMountedRef.current) {
        setShowMic(true);
      }
    }
    else {
      await stream.muteAudio(userId);
      if (isMountedRef.current) {
        setShowMic(false);
      }
    }
  }
  // Mobile browsers refuse to start audio outside a user gesture, and the join
  // runs on mount after a navigation, so there is no gesture left in the stack.
  // Retry on the first tap anywhere instead of failing the whole session.
  const armAudioGestureRetry = () => {
    if (audioGestureRef.current) {
      return;
    }
    const retry = () => {
      if (audioStartedRef.current) {
        disarmAudioGestureRetry();
        return;
      }
      startAudioSafely()
        .then(applyInitialMicState)
        .then(disarmAudioGestureRetry)
        .catch((err) => console.warn("audio retry failed", err));
    };
    audioGestureRef.current = retry;
    document.addEventListener("click", retry);
    document.addEventListener("touchend", retry);
  }
  const disarmAudioGestureRetry = () => {
    if (!audioGestureRef.current) {
      return;
    }
    document.removeEventListener("click", audioGestureRef.current);
    document.removeEventListener("touchend", audioGestureRef.current);
    audioGestureRef.current = null;
  }
  const setupMedia = async () => {
    const stream = streamRef.current;
    if (!stream) {
      return;
    }
    // subscribe events, keeping the exact handler identities so they can be removed
    const listeners = [
      ['user-added', handleUserAdd],
      ['user-removed', handleUserRemoved],
      ['user-updated', handleUserUpdated],
      ['active-speaker', handleActiveSpeaker],
      ['auto-play-audio-failed', handleAutoPlayAudioFailed],
    ];
    listenersRef.current.forEach(([event, handler]) => client.off(event, handler));
    listeners.forEach(([event, handler]) => client.on(event, handler));
    listenersRef.current = listeners;

    try {
      const isVirtualBG = stream.isSupportVirtualBackground();
      console.log("isVirtualBG", isVirtualBG);
      setIsSupportVirtualBG(isVirtualBG);
    } catch (error) {
      console.warn("virtual background check failed", error);
      setIsSupportVirtualBG(false);
    }
    try {
      supportHDRef.current = !IsMobile && await stream.isSupportHDVideo();
    } catch (error) {
      console.warn("isSupportHDVideo failed", error);
      supportHDRef.current = false;
    }
    console.log("supportHD", supportHDRef.current);

    if (props.initialCameraOn === true) {
      try {
        await stream.startVideo(captureVideoOption());
        if (isMountedRef.current) {
          setShowCamera(true);
        }
      } catch (error) {
        console.warn("startVideo failed", error);
        if (isMountedRef.current) {
          setShowCamera(false);
        }
        showToast(toastType.warning, "無法開啟鏡頭，請點選下方鏡頭按鈕重試。");
      }
    }
    else if (isMountedRef.current) {
      setShowCamera(false);
    }

    try {
      await startAudioSafely();
      await applyInitialMicState();
    } catch (error) {
      console.warn("startAudio failed", error);
      if (isMountedRef.current) {
        setShowMic(false);
        setNeedAudioGesture(true);
      }
      armAudioGestureRetry();
    }

    // attachVideo rejects with STREAM_MISMATCH_USER for anyone not sending video
    client.getAllUser().forEach((user) => {
      if (!user.bVideoOn) {
        return;
      }
      stream.attachVideo(user.userId, RENDER_QUALITY).catch((error) => {
        console.warn("attachVideo failed", user.userId, error);
      });
    })
    if (isMountedRef.current) {
      setParticipants(client.getAllUser());
    }
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
  const handleAutoPlayAudioFailed = () => {
    console.log("handleAutoPlayAudioFailed");
    // The browser blocked playback; the next tap can start it.
    if (isMountedRef.current) {
      setNeedAudioGesture(true);
    }
    armAudioGestureRetry();
  }
  const attachOrDetachRemoteUser = (user) => {
    console.log("user", user);
    if ((user === null) || (user === undefined) || (!client.getCurrentUserInfo())) return;
    console.log("all users", client.getAllUser());
    setParticipants(client.getAllUser());
    const stream = streamRef.current ?? client.getMediaStream();
    if (!stream) return;
    if (user.bVideoOn) {
      stream.attachVideo(user.userId, RENDER_QUALITY).then((userVideo) => {
        console.log("userVideo", userVideo);
      }).catch((error) => {
        console.warn("attachVideo failed", user.userId, error);
      });
    }
    else if (user.bVideoOn === false) {
      Promise.resolve(stream.detachVideo(user.userId)).catch((error) => {
        console.warn("detachVideo failed", user.userId, error);
      });
    }
    else if (user.audio && client.getCurrentUserInfo()?.userId === user.userId) {
      setShowMic(true);
    }
  }
  const handleLeave = () => {
    console.log("leave");
    disarmAudioGestureRetry();
    if (joinedRef.current) {
      joinedRef.current = false;
      Promise.resolve(client.leave()).catch((error) => console.warn("leave failed", error));
    }
    navigate("/couchspace-cms/home/consultation");
  };

  const handleMediaActionError = (err) => {
    console.warn("media action failed", err);
    showToast(toastType.error, "操作失敗，請重試一次。");
  }
  const onClickCamera = async () => {
    const stream = streamRef.current ?? client.getMediaStream();
    const currentUser = client.getCurrentUserInfo();
    if (!stream || !currentUser) {
      return;
    }
    let localUser;
    try {
      localUser = await client.getUser(currentUser.userId);
    } catch (err) {
      handleMediaActionError(err);
      return;
    }
    const isVideoOn = localUser?.bVideoOn;
    if (isVideoOn) {
      stream.stopVideo().then(() => {
        setShowCamera(false);
      }).catch(handleMediaActionError)
    }
    else {
      const option = bgImgUrl
        ? captureVideoOption({ virtualBackground: { imageUrl: bgImgUrl } })
        : captureVideoOption();
      stream.startVideo(option).then(() => {
        setShowCamera(true);
      }).catch(handleMediaActionError)
    }
  }
  const onClickMic = async () => {
    const stream = streamRef.current ?? client.getMediaStream();
    const currentUser = client.getCurrentUserInfo();
    if (!stream || !currentUser) {
      return;
    }
    // This click is a user gesture, which is exactly what a mobile browser wants
    // before it will let the session open the microphone.
    if (!audioStartedRef.current) {
      try {
        await startAudioSafely();
        disarmAudioGestureRetry();
      } catch (error) {
        handleMediaActionError(error);
        return;
      }
    }
    const isAudioMuted = await stream.isAudioMuted();
    console.log("isAudioMuted", isAudioMuted);
    if (isAudioMuted) {
      stream.unmuteAudio(currentUser.userId).then(() => {
        setShowMic(true);
      }).catch(handleMediaActionError);
    }
    else {
      stream.muteAudio(currentUser.userId).then(() => {
        setShowMic(false);
      }).catch(handleMediaActionError);
    }

  }
  const onClickBlur = async () => {
    const stream = streamRef.current ?? client.getMediaStream();
    const currentUser = client.getCurrentUserInfo();
    if (!stream || !currentUser) {
      return;
    }
    const localUser = await client.getUser(currentUser.userId);
    const isVideoOn = localUser?.bVideoOn;
    if (isVideoOn) {
      await stream.stopVideo();
    }

    if (showBlur) {
      bgImgUrl = "";
      stream.startVideo(captureVideoOption({ virtualBackground: { imageUrl: bgImgUrl } })).then(() => {
        setShowBlur(false);
      }).catch(handleMediaActionError)
    }
    else {
      bgImgUrl = "blur";
      stream.startVideo(captureVideoOption({ virtualBackground: { imageUrl: bgImgUrl } })).then(() => {
        setShowBlur(true);
      }).catch(handleMediaActionError)
    }
    setShowCamera(true);
    setShowBG(false);
  }
  const onClickChangeBG = async () => {
    const stream = streamRef.current ?? client.getMediaStream();
    const currentUser = client.getCurrentUserInfo();
    if (!stream || !currentUser) {
      return;
    }
    const localUser = await client.getUser(currentUser.userId);
    const isVideoOn = localUser?.bVideoOn;
    if (isVideoOn) {
      await stream.stopVideo();
    }

    if (showBG) {
      bgImgUrl = "";
      stream.startVideo(captureVideoOption({ virtualBackground: { imageUrl: bgImgUrl } })).then(() => {
        setShowBG(false);
      }).catch(handleMediaActionError)
    }
    else {
      bgImgUrl = "https://couchspace.blob.core.windows.net/dev/profile/20241002-98bc6a7a-5e17-4e55-b980-305bef5de2d5.jpg";
      stream.startVideo(captureVideoOption({ virtualBackground: { imageUrl: bgImgUrl } })).then(() => {
        setShowBG(true);
      }).catch(handleMediaActionError)
    }
    setShowCamera(true);
    setShowBlur(false);
  }
  const onClickMirror = async () => {
    const stream = client.getMediaStream();
    stream.mirrorVideo(!mirror).then(() => setMirror(!mirror)).catch(handleMediaActionError);
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
    clearTimeout(countDownRef.current);
    countDownRef.current = setTimeout(() => {
      if (!isMountedRef.current || startDateTime === null || startTime === null) {
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
    if (testUsers > 0) {
      return (
        output.map((user, index) => {
          return user;
        })
      )
    }
    else {
      return null;
    }
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
            {errorMessage ?
              <div style={{ marginTop: 20, fontSize: 14, fontWeight: "normal", color: "#8A8A8A" }}>{errorMessage}</div>
              : null}
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
    isMountedRef.current = true;
    // A phone changes size when it rotates or when the URL bar slides away, and
    // the layout below is measured in pixels, so it has to be re-measured.
    const onResize = () => setViewport(getViewport());
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize);
    }
    handleJoin();
    return () => {
      isMountedRef.current = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onResize);
      }
      clearTimeout(countDownRef.current);
      disarmAudioGestureRetry();
      listenersRef.current.forEach(([event, handler]) => client.off(event, handler));
      listenersRef.current = [];
      if (joinedRef.current) {
        joinedRef.current = false;
        Promise.resolve(client.leave()).catch((error) => console.warn("leave failed", error));
      }
      ZoomVideo.destroyClient();
    }
  }, []);

  useEffect(() => {
    if (!joined) {
      return;
    }
    // Runs after the video-player-container elements have been committed to the
    // DOM, which is what attachVideo needs in order to find them.
    setupMedia();
  }, [joined]);

  const currentUserId = client.getCurrentUserInfo()?.userId;

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
          {needAudioGesture ?
            <div onClick={onClickMic} style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: "#89A2D0", color: "#FFFFFF", textAlign: "center", padding: "10px 16px", fontSize: 14, cursor: "pointer" }}>
              {"點一下畫面以開啟聲音"}
            </div>
            : null}
          <div class="col" style={{ height: counterHeight }}>
            <div style={{ margin: 5, marginLeft: counterPadding, textAlign: "center", width: 120, backgroundColor: "#FFFFFF", borderRadius: 4 }}>
              <img style={{ verticalAlign: 'middle', width: 24 }} src={img_time} alt="time" />
              <span style={{ verticalAlign: 'middle', marginRight: 5 }}>{num2HourTime(elapsedTime)}</span>
            </div>
          </div>
          {screenWidth > 500 ?
            <div class="room" style={{ height: videoHeight }}>
              {participants.map((user) => { // Counselor Video
                if (showCamera && user.userId === currentUserId) {
                  return (
                    <Draggable>
                      <video-player-container key={user.useId} className='dragdiv' style={{ zIndex: "999", position: "absolute", right: 40, bottom: 132, height: 183, width: 245 }}>
                        <div style={{ width: "100%" }}>
                          <div className="screen-mic">
                            <img style={{ height: 24, width: 24 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                          </div>
                        </div>
                        <video-player class="video-player align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }} node-id={user.userId}></video-player>
                        <div style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.55)", color: "#FFFFFF", fontSize: 12, padding: "2px 8px", borderRadius: 4, pointerEvents: "none", zIndex: 1, maxWidth: "calc(100% - 16px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.displayName}</div>
                      </video-player-container>
                    </Draggable>
                  )
                }
                else if (!showCamera && user.userId === currentUserId) {
                  return (
                    <Draggable>
                      <div key={user.useId} className='dragdiv' class="empty-screen-container" style={{ zIndex: "999", position: "absolute", right: 40, bottom: 132, height: 183, width: 245 }} >
                        <div style={{ width: "100%" }}>
                          <div className="screen-mic">
                            <img style={{ height: 24, width: 24 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                          </div>
                        </div>
                        <div class="empty-screen justify-content-center align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }}>
                          <div style={{ textAlign: 'center' }}>
                            <img style={{ height: 50, width: 50 }} src={img_screen_off} alt="Camera"></img>
                            <div style={{ fontSize: 16, color: "#D8D8D8" }}> 已關閉鏡頭</div>
                          </div>
                        </div>
                        <div style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.55)", color: "#FFFFFF", fontSize: 12, padding: "2px 8px", borderRadius: 4, pointerEvents: "none", zIndex: 1, maxWidth: "calc(100% - 16px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.displayName}</div>
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
                if (user.bVideoOn && user.userId !== currentUserId) {
                  return (
                    <video-player-container key={user.useId} style={{ maxHeight: getMaxHeightWidthByParticipants(), width: getWidthByParticipants(), position: "relative" }}>
                      <div style={{ width: "100%" }}>
                        <div className="screen-mic">
                          <img style={{ height: 24, width: 24 }} src={user.muted ? img_mic_off : img_mic_on} alt="Mic" />
                        </div>
                      </div>
                      <video-player class="video-player align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }} node-id={user.userId}></video-player>
                      <div style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.55)", color: "#FFFFFF", fontSize: 12, padding: "2px 8px", borderRadius: 4, pointerEvents: "none", zIndex: 1, maxWidth: "calc(100% - 16px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.displayName}</div>
                    </video-player-container>
                  )
                }
                else if (!user.bVideoOn && user.userId !== currentUserId) {
                  return (
                    <div key={user.useId} class="empty-screen-container" style={{ maxHeight: getMaxHeightWidthByParticipants(), width: getWidthByParticipants(), position: "relative" }}>
                      <div style={{ width: "100%" }}>
                        <div className="screen-mic">
                          <img style={{ height: 24, width: 24 }} src={user.muted ? img_mic_off : img_mic_on} alt="Mic" />
                        </div>
                      </div>
                      <div class="empty-screen justify-content-center align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }}>
                        <div style={{ textAlign: 'center' }}>
                          <img style={{ height: 50, width: 50 }} src={img_screen_off} alt="Camera"></img>
                          <div style={{ fontSize: 16, color: "#D8D8D8" }}> 對方已關閉鏡頭</div>
                        </div>
                      </div>
                      <div style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.55)", color: "#FFFFFF", fontSize: 12, padding: "2px 8px", borderRadius: 4, pointerEvents: "none", zIndex: 1, maxWidth: "calc(100% - 16px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.displayName}</div>
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
                if (showCamera && user.userId === currentUserId) {
                  return (
                    <Draggable>
                      <video-player-container key={user.useId} className='dragdiv' style={{ zIndex: "999", position: "absolute", right: 18, bottom: 137, height: 150, width: 112 }}>
                        <div style={{ width: "100%" }}>
                          <div className="screen-mic">
                            <img style={{ height: 24, width: 24 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                          </div>
                        </div>
                        <video-player class="video-player align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }} node-id={user.userId}></video-player>
                        <div style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.55)", color: "#FFFFFF", fontSize: 10, padding: "2px 6px", borderRadius: 4, pointerEvents: "none", zIndex: 1, maxWidth: "calc(100% - 12px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.displayName}</div>
                      </video-player-container>
                    </Draggable>
                  )
                }
                else if (!showCamera && user.userId === currentUserId) {
                  return (
                    <Draggable>
                      <div key={user.useId} className='dragdiv' class="empty-screen-container" style={{ zIndex: "999", position: "absolute", right: 18, bottom: 137, height: 150, width: 112 }} >
                        <div style={{ width: "100%" }}>
                          <div className="screen-mic">
                            <img style={{ height: 24, width: 24 }} src={showMic ? img_mic_on : img_mic_off} alt="Mic" />
                          </div>
                        </div>
                        <div class="empty-screen justify-content-center align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }}>
                          <div style={{ textAlign: 'center' }}>
                            <img style={{ height: 50, width: 50 }} src={img_screen_off} alt="Camera"></img>
                            <div style={{ fontSize: 16, color: "#D8D8D8" }}> 已關閉鏡頭</div>
                          </div>
                        </div>
                        <div style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.55)", color: "#FFFFFF", fontSize: 10, padding: "2px 6px", borderRadius: 4, pointerEvents: "none", zIndex: 1, maxWidth: "calc(100% - 12px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.displayName}</div>
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
                if (user.bVideoOn && user.userId !== currentUserId) {
                  return (
                    <video-player-container key={user.useId} style={{ maxHeight: getMaxHeightWidthByParticipants(), width: getWidthByParticipants(), position: "relative" }}>
                      <div style={{ width: "100%" }}>
                        <div class="screen-mic">
                          <img style={{ height: 24, width: 24 }} src={user.muted ? img_mic_off : img_mic_on} alt="Mic" />
                        </div>
                      </div>
                      <video-player class="video-player align-items-center" style={{ borderColor: activeSpeakerId === user.userId ? "#89A2D0" : "#000000" }} node-id={user.userId}></video-player>
                      <div style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.55)", color: "#FFFFFF", fontSize: 10, padding: "2px 6px", borderRadius: 4, pointerEvents: "none", zIndex: 1, maxWidth: "calc(100% - 12px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.displayName}</div>
                    </video-player-container>
                  )
                }
                else if (!user.bVideoOn && user.userId !== currentUserId) {
                  return (
                    <div key={user.useId} class="empty-screen-container" style={{ maxHeight: getMaxHeightWidthByParticipants(), width: getWidthByParticipants(), position: "relative" }}>
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
                      <div style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.55)", color: "#FFFFFF", fontSize: 10, padding: "2px 6px", borderRadius: 4, pointerEvents: "none", zIndex: 1, maxWidth: "calc(100% - 12px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.displayName}</div>
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