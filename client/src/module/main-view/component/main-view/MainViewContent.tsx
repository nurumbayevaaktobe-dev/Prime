import { Flex, Box } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useMember } from "../../../members/MemberServiceContext";
import { PinnedStreamType } from "../../../members/types";
import AudioPlayers from "../audio-element/AudioPlayer";
import { PinnedContainer } from "./PinnedContainer";
import { NormalGridView } from "./NormalGridView";
import QuickActionsPanel from "../../../../components/QuickActionsPanel";
import SummaryButton from "../../../../components/SummaryButton";

export const MainViewContent: React.FC = () => {
  const { remoteStreams, members } = useMember();
  const [pinnedStream, setPinnedStream] = useState<PinnedStreamType | null>();
  const [gridSize, setGridSize] = useState(3);
  const [showOnlyOffTask, setShowOnlyOffTask] = useState(false);

  const handlePin = useCallback(
    (pinStream: PinnedStreamType) => {
      if (pinStream.id === pinnedStream?.id) {
        setPinnedStream(null);
      } else {
        setPinnedStream(pinStream);
      }
    },
    [pinnedStream?.id]
  );

  const totalStreams =
    remoteStreams.video.length +
    remoteStreams.display.filter((d) => d.isEnabled).length;

  const isPinned =
    pinnedStream &&
    totalStreams > 1 &&
    (remoteStreams.video.find(
      (video) => video.stream && pinnedStream.id === video.stream.id
    )?.isEnabled ||
      remoteStreams.display.find(
        (display) => display.stream && pinnedStream.id === display.stream.id
      )?.isEnabled);

  // Prepare student data for Quick Actions Panel
  const studentsData = members.map(member => ({
    id: member.id,
    name: member.name || 'Unknown',
    activity: {
      label: 'Active',
      color: 'green' as const
    }
  }));

  // Prepare session data for Summary
  const sessionData = {
    duration: 45, // Demo value - would be calculated from session start time
    totalStudents: members.length,
    date: new Date().toISOString().split('T')[0],
    students: members.map(member => ({
      name: member.name || 'Unknown',
      activities: ['Coding Python', 'Reading Documentation'], // Demo - would be tracked from activity detection
      engagementScore: 75 // Demo - would be calculated
    }))
  };

  return (
    <Box position="relative" height="86%" width="100%" mb={4} px={2}>
      {/* Quick Actions Panel */}
      <QuickActionsPanel
        students={studentsData}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        showOnlyOffTask={showOnlyOffTask}
        onToggleFilter={() => setShowOnlyOffTask(!showOnlyOffTask)}
      />

      {/* Main Content */}
      <Flex height="100%" width="100%">
        <AudioPlayers audioStreams={remoteStreams.audio} />
        {isPinned && pinnedStream ? (
          <PinnedContainer pinnedStream={pinnedStream} handlePin={handlePin} />
        ) : (
          <NormalGridView handlePin={handlePin} />
        )}
      </Flex>

      {/* AI Summary Button */}
      <SummaryButton sessionData={sessionData} />
    </Box>
  );
};
