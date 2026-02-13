import { Grid } from "@chakra-ui/react";
import React from "react";
import { StreamContainer } from "./StreamContainer";
import {
  DisplayVideoStreamType,
  MediaVideoStreamType,
} from "../../../members/types";
import { useMember } from "../../../members/MemberServiceContext";

interface NormalGridViewProps {
  handlePin: (pinnedStream: any) => void;
  selectedStudent?: { id: string; name: string } | null;
  onSelectStudent?: (student: { id: string; name: string }) => void;
  videoRefs?: Record<string, React.RefObject<HTMLVideoElement>>;
}

export const NormalGridView = (props: NormalGridViewProps) => {
    const { handlePin, selectedStudent, onSelectStudent, videoRefs } = props;
    const { remoteStreams } = useMember();

  const totalStreams =
    remoteStreams.video.length +
    remoteStreams.display.filter(
      (display: DisplayVideoStreamType) => display.isEnabled
    ).length;
  const canPinned = totalStreams > 1;
  const columns: number = Math.ceil(Math.sqrt(totalStreams));
  const rows: number = Math.ceil(totalStreams / columns);

  return (
    <Grid
      templateColumns={`repeat(${columns}, 1fr)`}
      templateRows={`repeat(${rows}, 1fr)`}
      p={1}
      gap={2}
      height="100%"
      width="100%"
      overflow="auto"
    >
      {remoteStreams.video.map((video: MediaVideoStreamType, index: number) => (
        <StreamContainer
          key={`video-${video.memberId}-${index}`}
          stream={video}
          index={index}
          isWebCamStream={true}
          canPinned={canPinned}
          onPinned={handlePin}
          isSelected={selectedStudent?.id === video.memberId}
          onSelect={onSelectStudent}
          videoRef={videoRefs?.[video.memberId]}
        />
      ))}
      {remoteStreams.display
        .filter((display: DisplayVideoStreamType) => display.isEnabled)
        .map((display: DisplayVideoStreamType, index: number) => (
          <StreamContainer
            key={`display-${display.memberId}-${index}`}
            stream={display}
            index={index}
            isWebCamStream={false}
            canPinned={canPinned}
            onPinned={handlePin}
            isSelected={selectedStudent?.id === display.memberId}
            onSelect={onSelectStudent}
            videoRef={videoRefs?.[display.memberId]}
          />
        ))}
    </Grid>
  );
};
