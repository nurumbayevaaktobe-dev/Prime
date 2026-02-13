import { GridItem, Stack, Text, Box, Badge } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
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
  isSelected?: boolean;
  onSelect?: (student: { id: string; name: string }) => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export const StreamContainer = (props: StreamContainerProps) => {
  const { stream, index, isWebCamStream, canPinned, onPinned, isSelected, onSelect, videoRef: externalVideoRef } = props;
  const { getMember } = useMember();
  const member = getMember(stream.memberId);
  const isLocal = member?.isLocal;
  const aspectRatio = 16 / 9;

  // Video ref for activity detection - use external ref if provided, otherwise create internal
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;

  // Only enable activity detection for non-local screen shares (display streams)
  const shouldDetectActivity = !isWebCamStream && !isLocal && stream.isEnabled;
  const activity = useActivityDetection(
    videoRef,
    stream.memberId,
    { enabled: shouldDetectActivity }
  );

  // Handle click - priority to selection over pinning
  const handleClick = (e: React.MouseEvent) => {
    if (!stream.isEnabled) return;

    // If selection is enabled and this is a screen share, select it
    if (onSelect && !isWebCamStream && !isLocal) {
      onSelect({
        id: stream.memberId,
        name: member?.name || 'Unknown'
      });
    }
    // Otherwise, handle pinning
    else if (canPinned) {
      onPinned({
        videoType: isWebCamStream ? "video" : "display",
        memberId: stream.memberId,
        id: stream.stream.id,
      });
    }
  };

  return (
    <GridItem
      key={`${stream.stream.id}-${stream.memberId}-${index}`}
      textAlign="center"
      border={isSelected ? "3px solid" : "1px solid"}
      borderColor={isSelected ? "blue.500" : "gray"}
      borderRadius="10px"
      mx="4px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      background="grey.800"
      position="relative"
      overflow="hidden"
      onClick={handleClick}
      cursor={stream.isEnabled ? "pointer" : ""}
      maxWidth={"100%"}
      maxHeight={"100%"}
      aspectRatio={aspectRatio}
      transition="all 0.2s"
      transform={isSelected ? "scale(1.02)" : "scale(1)"}
      boxShadow={isSelected ? "0 0 20px rgba(66, 153, 225, 0.6)" : "none"}
      _hover={stream.isEnabled ? {
        transform: "scale(1.02)",
        boxShadow: "lg"
      } : {}}
    >
      {/* Activity Badge - only for screen shares */}
      {shouldDetectActivity && <ActivityBadge activity={activity} />}

      {/* Selection Badge */}
      {isSelected && (
        <Box
          position="absolute"
          top={2}
          right={2}
          zIndex={10}
        >
          <Badge
            colorScheme="blue"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="full"
            fontWeight="bold"
          >
            SELECTED
          </Badge>
        </Box>
      )}

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
