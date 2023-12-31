import "./counseling.css";
import ChatRoom from "./chatRoom/chatRoom";
import VideoChat from "./VideoChat";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
function Counseling() {
  const { state } = useLocation();
  console.log(state.appointmentID)
  return (
    <div className={"VideoCall"}>
      <VideoChat appointmentID={state.appointmentID} />
    </div>
  );
}

export default Counseling;
