import React, { useState, useEffect, useRef } from "react";
import "./participant.css";
import { Pipeline, GaussianBlurBackgroundProcessor, isSupported } from "@twilio/video-processors";
const Participant = ({ participant, blur, isLocalTrack }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();
  const bg = isSupported ? new GaussianBlurBackgroundProcessor({
    assetsPath: '/',
    maskBlurRadius: 20,
    blurFilterRadius: 10,
    pipeline: Pipeline.WebGL2,
    debounce: true,
  }) : null;
  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant, blur]);

  useEffect(() => {
    blurBackground(videoTracks[0]).then((value) => {
      const videoTrack = value;
      if (videoTrack) {
        videoTrack.attach(videoRef.current);
        return () => {
          videoTrack.detach();
        };
      }
    })
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);
  const blurBackground = async (videoTrack) => {
    if (isLocalTrack && isSupported) {
      if (blur) {
        await bg.loadModel();
        videoTrack.addProcessor(bg, {
          inputFrameBufferType: 'video',
          outputFrameBufferContextType: 'webgl2',
        });
        console.log("blur video track", videoTrack);
      }
      else {
        if (videoTrack.processor) {
          console.log("unblur video track", videoTrack);
          videoTrack.removeProcessor(videoTrack.processor);
        }
      }
    }
    return videoTrack;
  }

  return (
    <div className="Participant" style={{ flex: 1, alignItems: 'center', justifyItems: 'center', height: isLocalTrack ? 300 : 500, marginTop: isLocalTrack ? 200 : 0 }}>
      <video style={{ flex: 1, height: "100%" }} ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={false} />
    </div>
  );
};

export default Participant;