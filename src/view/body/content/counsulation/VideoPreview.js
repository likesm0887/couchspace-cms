import React, { useState, useEffect, useRef } from "react";
import "./VideoPreview.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import img_camera_on from "../../../img/content/btn_camera_turn_on.svg";
import img_camera_off from "../../../img/content/btn_camera_turn_off.svg";
import img_mic_on from "../../../img/content/btn_mic_turn_on.svg";
import img_mic_off from "../../../img/content/btn_mic_turn_off.svg";
import img_screen_off from "../../../img/content/ic_screen_camera_turn_off.svg";

const VideoPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [nickname, setNickname] = useState(state?.counselorName || "");
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    startCamera();
    startMic();
    return () => cleanup();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera error:", err);
      setCameraOn(false);
    }
  };

  const startMic = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = audioStream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(audioStream);
      source.connect(analyser);
      measureAudioLevel();
    } catch (err) {
      console.warn("Mic error:", err);
      setMicOn(false);
    }
  };

  const measureAudioLevel = () => {
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    const update = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      setAudioLevel(avg);
      animFrameRef.current = requestAnimationFrame(update);
    };
    animFrameRef.current = requestAnimationFrame(update);
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const newState = !cameraOn;
      streamRef.current.getVideoTracks().forEach((t) => (t.enabled = newState));
      setCameraOn(newState);
    }
  };

  const toggleMic = () => {
    if (micStreamRef.current) {
      const newState = !micOn;
      micStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = newState));
      setMicOn(newState);
    }
  };

  const handleJoin = () => {
    cleanup();
    navigate(`/couchspace-cms/home/consultation/counseling/${id}`, {
      state: { appointmentID: id, nickname: nickname.trim() || "Guest", cameraOn, micOn },
    });
  };

  const activeSegments = Math.round((audioLevel / 255) * 10);

  const handleBack = () => {
    cleanup();
    navigate(-1);
  };

  return (
    <div className="vp-wrapper">
      <button className="vp-back-btn" onClick={handleBack}>&#8592; 返回</button>
      <div className="vp-video-section">
        <div className="vp-video-container">
          <video
            ref={videoRef}
            className="vp-video"
            autoPlay
            muted
            playsInline
            style={{ display: cameraOn ? "block" : "none" }}
          />
          {!cameraOn && (
            <div className="vp-video-off">
              <img src={img_screen_off} alt="Camera off" className="vp-video-off-icon" />
              <div className="vp-video-off-text">已關閉鏡頭</div>
            </div>
          )}
        </div>

        <div className="vp-controls">
          <div className="vp-ctrl-item">
            <button className="vp-ctrl-btn" onClick={toggleMic}>
              <img src={micOn ? img_mic_on : img_mic_off} alt="Mic" className="vp-ctrl-icon" />
            </button>
            <div className="vp-ctrl-label">{micOn ? "麥克風已開啟" : "麥克風已關閉"}</div>
          </div>
          <div className="vp-ctrl-item">
            <button className="vp-ctrl-btn" onClick={toggleCamera}>
              <img src={cameraOn ? img_camera_on : img_camera_off} alt="Camera" className="vp-ctrl-icon" />
            </button>
            <div className="vp-ctrl-label">{cameraOn ? "鏡頭已開啟" : "鏡頭已關閉"}</div>
          </div>
        </div>
      </div>

      <div className="vp-settings-section">
        <div className="vp-card">
          <h2 className="vp-title">準備進入會議</h2>

          <div className="vp-field">
            <label className="vp-label">顯示名稱</label>
            <input
              className="vp-input"
              type="text"
              placeholder="請輸入暱稱"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="vp-field">
            <label className="vp-label">麥克風測試</label>
            <div className="vp-mic-row">
              <img src={micOn ? img_mic_on : img_mic_off} alt="Mic" className="vp-mic-icon" />
              <div className="vp-audio-bars">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="vp-audio-bar"
                    style={{
                      backgroundColor: micOn && activeSegments > i ? "#89A2D0" : "#3A3B3E",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="vp-hint">
              {micOn
                ? micStreamRef.current
                  ? "正在偵測麥克風輸入…"
                  : "無法存取麥克風"
                : "麥克風已關閉"}
            </div>
          </div>

          <div className="vp-field">
            <label className="vp-label">鏡頭測試</label>
            <div className="vp-camera-row">
              <img
                src={cameraOn ? img_camera_on : img_camera_off}
                alt="Camera"
                className="vp-camera-icon"
              />
              <span className="vp-camera-status-text" style={{ color: cameraOn ? "#89A2D0" : "#888" }}>
                {cameraOn ? "鏡頭正常運作" : "鏡頭已關閉"}
              </span>
            </div>
          </div>

          <button
            className="vp-join-btn"
            onClick={handleJoin}
            disabled={nickname.trim().length === 0}
          >
            進入房間
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
