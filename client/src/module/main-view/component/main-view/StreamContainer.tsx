import { GridItem, Stack, Text } from "@chakra-ui/react";
import React, { useRef } from "react";
import {
  MediaVideoStreamType,
  DisplayVideoStreamType,
  PinnedStreamType,
} from "../../../members/types";
import { StreamPlayer } from "../stream-player/StreamPlayer";
import { useMember } from "../../../members/MemberServiceContext";
import { useActivityDetection } from "../../../../hooks/useActivityDetection";
import ActivityBadge from "../../../../components/ActivityBadge";

interface StreamContainerProps {
  stream: MediaVideoStreamType | DisplayVideoStreamType;
  index?: number;
  isWebCamStream: boolean;
  canPinned: boolean;
  onPinned: (pinnedStream: PinnedStreamType) => void;
}

export const StreamContainer = (props: StreamContainerProps) => {
  const { stream, index, isWebCamStream, canPinned, onPinned } = props;
  const { getMember } = useMember();
  const member = getMember(stream.memberId);
  const isLocal = member?.isLocal;
  const aspectRatio = 16 / 9;

  // Video ref for activity detection
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only enable activity detection for non-local screen shares (display streams)
  const shouldDetectActivity = !isWebCamStream && !isLocal && stream.isEnabled;
  const activity = useActivityDetection(
    videoRef,
    stream.memberId,
    { enabled: shouldDetectActivity }
  );

  return (
    <GridItem
      key={`${stream.stream.id}-${stream.memberId}-${index}`}
      textAlign="center"
      border="1px solid gray"
      borderRadius="10px"
      mx="4px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      background="grey.800"
      position="relative"
      overflow="hidden"
      onClick={() =>
        stream.isEnabled &&
        canPinned &&
        onPinned({
          videoType: isWebCamStream ? "video" : "display",
          memberId: stream.memberId,
          id: stream.stream.id,
        })
      }
      cursor={stream.isEnabled && canPinned ? "pointer" : ""}
      maxWidth={"100%"}
      maxHeight={"100%"}
      aspectRatio={aspectRatio}
    >
      {/* Activity Badge - only for screen shares */}
      {shouldDetectActivity && <ActivityBadge activity={activity} />}

      <StreamPlayer
        stream={stream.stream}
        name={member?.name!}
        isEnabled={stream.isEnabled}
        videoRef={videoRef}
      />

      <Stack
        direction="column"
        spacing={0}
        position="absolute"
        bottom={0}
        left={0}
        background="rgba(0, 0, 0, 0.5)"
        py="2"
        px="3"
        borderTopRightRadius="md"
        borderBottomLeftRadius="md"
      >
        <Text fontSize="md" color="white" textAlign={"left"}>
          {isLocal
            ? isWebCamStream
              ? "You"
              : "You are sharing"
            : `${member?.name} ${isWebCamStream ? "" : " - Sharing"}`}
        </Text>
      </Stack>
    </GridItem>
  );
};
