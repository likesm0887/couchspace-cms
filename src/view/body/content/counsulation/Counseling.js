import "./counseling.css";
import ChatRoom from "./chatRoom/chatRoom";
import VideoChat from "./VideoChat";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
function Counseling() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  console.log(state)
  // useLocation().state is lost on a hard refresh or a direct link, so fall
  // back to the appointmentID in the URL instead of crashing on state.appointmentID.
  const appointmentID = state?.appointmentID ?? id;
  useEffect(() => {
    if (!appointmentID) {
      navigate("/couchspace-cms/home/consultation", { replace: true });
    }
  }, [appointmentID]);
  if (!appointmentID) {
    return null;
  }
  return (
    <div class="container-fluid" style={{ width: "100%", height: "100%" }}>
      <VideoChat appointmentID={appointmentID} nickname={state?.nickname} initialCameraOn={state?.cameraOn} initialMicOn={state?.micOn} />
    </div>
  );
}

export default Counseling;
