import {Pagination} from "@mui/material";
import "./counseling.css"
import ChatRoom from "./chatRoom/chatRoom";
import VideoChat from "./VideoChat";
import { useRoom } from 'use-twilio-video'
import React, { useState, useEffect, useRef } from "react";
const { connect, createLocalTracks } = require('twilio-video');
function Counseling() {
    const cameraRef = useRef(null);
    const width = 360;
const height = 350;



    const handleOpenCamera = () => {
        createLocalTracks({
            audio: true,
            video: { width: 640 }
          }).then(localTracks => {
            return connect('$TOKEN', {
              name: 'my-room-name',
              tracks: localTracks
            });
          }).then(room => {
            console.log(`Connected to Room: ${room.name}`);
          });
           
          
      };
    
    return (
        <div className={"Counseling"}>
            <div className={"VideoCall"}>
                
            
                <VideoChat  />
                

                
            </div>
            <div className={"Right"}>
                <div className={"headshotAndNameAndTime"}>
                    <div className={"Counseling-Name"}>阿豪</div>
                    <div className={"Counseling-Date"}>2202/06/18</div>
                    <div className={"Counseling-Type"}>諮商</div>
                </div>
                <div className={"ChatRoom"}>
                    <ChatRoom></ChatRoom>
                </div>
            </div>
        </div>

    );
}

export default Counseling
