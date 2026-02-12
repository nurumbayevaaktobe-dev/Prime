import { Avatar, Box } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import ReactPlayer from "react-player";
interface StreamPlayerProps {
  stream: MediaStream;
  name: string;
  isEnabled: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}
export const StreamPlayer = (props: StreamPlayerProps) => {
  const { stream, name, isEnabled, videoRef } = props;
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const activeVideoRef = videoRef || internalVideoRef;

  // Set up the video stream when using native video element
  useEffect(() => {
    if (isEnabled && activeVideoRef.current && stream) {
      activeVideoRef.current.srcObject = stream;
      activeVideoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [stream, isEnabled, activeVideoRef]);

  return isEnabled ? (
    <Box
      position="relative"
      width="100%"
      style={{
        paddingTop: "75%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Use native video element for better control */}
      <video
        ref={activeVideoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  ) : (
    <Avatar name={name} size="2xl" />
  );
};
