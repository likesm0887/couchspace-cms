import "./counseling.css";
import ChatRoom from "./chatRoom/chatRoom";
import VideoChat from "./VideoChat";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate,useLocation } from "react-router-dom";
function Counseling() {
    const { state } = useLocation();
    console.log(state.appointmentID)
  return (
    <div className={"Counseling"}>
      <div className={"VideoCall"}>
        <VideoChat appointmentID ={state.appointmentID}/>
      </div>
      {/* <div className={"Right"}>
        <div className={"headshotAndNameAndTime"}>
          <div className={"Counseling-Name"}>阿豪</div>
          <div className={"Counseling-Date"}>2202/06/18</div>
          <div className={"Counseling-Type"}>諮商</div>
        </div>
        <div className={"ChatRoom"}>
          <ChatRoom></ChatRoom>
        </div>
      </div> */}
    </div>
  );
}

export default Counseling;
