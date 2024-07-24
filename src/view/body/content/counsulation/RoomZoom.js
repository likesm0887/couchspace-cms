import React, { useEffect, useState } from "react";
import "./counseling.css";
import { Switch } from "@mui/material";

let startDateTime = null;
let startTime = null;
const RoomZoom = ({ client, stream, handleLeave, appointmentTime }) => {
  const [showCamera, setShowCamera] = useState(true);
  const [showMic, setShowMic] = useState(true);
  const [showBlur, setShowBlur] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(appointmentTime.Total * 60);
  startDateTime = appointmentTime.Date;
  startTime = appointmentTime.StartTime;
  useEffect(() => {
    startStreaming();
    updateCountDown();
    return () => {
    };
  }, []);
  const startStreaming = async () => {
    stream.startVideo().then(() => {
      stream.renderVideo(document.querySelector('#my-self-view-canvas'), client.getCurrentUserInfo().userId, 1920, 1080, 0, 0, 2)
    })
    client.startAudio();
  }
  const onClickCamera = () => {

    setShowCamera(!showCamera);
  }
  const onClickMic = () => {

    setShowMic(!showMic);
  }
  const onClickBlur = () => {
    setShowBlur(!showBlur);
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
  return (
    <div class="container" style={{ width: "100%", height: "100%" }}>
      <div class="room">
        <div class="remote-participant">
          <video-player-container></video-player-container>
        </div>
        <div class="order-first local-participant">
          <canvas id="my-self-view-canvas" width="1920" height="1080"></canvas>
        </div>
      </div>
      <div class="row justify-content-center align-items-center" style={{ marginTop: 5 }}>
        <div class="col-auto">
          <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
            <p>{num2HourTime(elapsedTime)}</p>
            <p>諮商時間</p>
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
            <Switch onChange={onClickBlur} checked={showBlur}>
            </Switch>
            <p>模糊背景</p>
          </div>
        </div>
        <div class="col-auto">
          <div style={{ textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
            <button onClick={onClickExit}>離開房間</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomZoom;