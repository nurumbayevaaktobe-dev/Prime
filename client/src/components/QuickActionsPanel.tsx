/**
 * QuickActionsPanel Component
 *
 * Enhanced floating toolbar for teacher controls:
 * - Grid layout adjustment
 * - Filter controls
 * - AI-powered screenshot analysis (NEW)
 * - Real-time statistics
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  Collapse,
  Divider,
  Spinner
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { captureAndAnalyzeScreen, AnalysisResult } from '../utils/screenshotAnalyzer';
import ScreenshotAnalysisModal from './ScreenshotAnalysisModal';

export interface Student {
  id: string;
  name: string;
  activity?: {
    label: string;
    color: 'green' | 'yellow' | 'red' | 'gray';
  };
}

interface QuickActionsPanelProps {
  students: Student[];
  selectedStudent: Student | null;
  videoRefs: Record<string, React.RefObject<HTMLVideoElement>>;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  showOnlyOffTask: boolean;
  onToggleFilter: () => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  students,
  selectedStudent,
  videoRefs,
  gridSize,
  onGridSizeChange,
  showOnlyOffTask,
  onToggleFilter
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const analyzeScreen = async () => {
    if (!selectedStudent) {
      alert('Please select a student first by clicking on their video tile');
      return;
    }

    const videoRef = videoRefs[selectedStudent.id];
    if (!videoRef || !videoRef.current) {
      alert('Video not available for this student. Make sure they are sharing their screen.');
      return;
    }

    setAnalyzing(true);

    try {
      const analysis = await captureAndAnalyzeScreen(
        videoRef,
        selectedStudent.name
      );
      setAnalysisResult(analysis);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      alert(`Failed to analyze screenshot: ${error.message}\n\nMake sure the AI backend is running on port 5000.`);
    } finally {
      setAnalyzing(false);
    }
  };

  const gridSizes = [
    { value: 2, label: '2×2' },
    { value: 3, label: '3×3' },
    { value: 4, label: '4×4' },
    { value: 5, label: '5×5' }
  ];

  // Calculate stats
  const onTaskCount = students.filter(s => s.activity?.color === 'green').length;
  const offTaskCount = students.filter(s => s.activity?.color === 'red').length;
  const neutralCount = students.filter(s => s.activity?.color === 'yellow').length;

  return (
    <>
      <Box position="fixed" top={4} left={4} zIndex={40}>
        {/* Toggle Button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
          _hover={{ bg: 'gray.50' }}
          mb={2}
          size="sm"
          leftIcon={isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        >
          Quick Actions
        </Button>

        {/* Actions Panel */}
        <Collapse in={isExpanded} animateOpacity>
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="2xl"
            p={4}
            w="64"
          >
            <VStack spacing={3} align="stretch">
              {/* Grid Size Selector */}
              <Box>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={2}>
                  Grid Layout
                </Text>
                <Grid templateColumns="repeat(4, 1fr)" gap={2}>
                  {gridSizes.map(size => (
                    <GridItem key={size.value}>
                      <Button
                        onClick={() => onGridSizeChange(size.value)}
                        size="sm"
                        colorScheme={gridSize === size.value ? 'blue' : 'gray'}
                        variant={gridSize === size.value ? 'solid' : 'outline'}
                        w="full"
                        fontWeight="semibold"
                      >
                        {size.label}
                      </Button>
                    </GridItem>
                  ))}
                </Grid>
              </Box>

              <Divider />

              {/* Filter Toggle */}
              <Button
                onClick={onToggleFilter}
                colorScheme={showOnlyOffTask ? 'red' : 'gray'}
                variant={showOnlyOffTask ? 'solid' : 'outline'}
                size="md"
                fontWeight="semibold"
              >
                🎯 {showOnlyOffTask ? 'Show All' : 'Off-Task Only'}
              </Button>

              <Divider />

              {/* NEW: AI Screenshot Analysis */}
              <Box>
                <Button
                  onClick={analyzeScreen}
                  isDisabled={analyzing || !selectedStudent}
                  w="full"
                  size="md"
                  bgGradient={
                    analyzing
                      ? 'none'
                      : selectedStudent
                      ? 'linear(to-r, purple.600, blue.600)'
                      : 'none'
                  }
                  bg={
                    analyzing
                      ? 'gray.300'
                      : selectedStudent
                      ? undefined
                      : 'gray.200'
                  }
                  color={selectedStudent && !analyzing ? 'white' : 'gray.500'}
                  _hover={
                    selectedStudent && !analyzing
                      ? {
                          bgGradient: 'linear(to-r, purple.700, blue.700)',
                          transform: 'scale(1.02)',
                          boxShadow: 'lg'
                        }
                      : {}
                  }
                  transition="all 0.2s"
                  fontWeight="semibold"
                  leftIcon={analyzing ? <Spinner size="sm" /> : undefined}
                >
                  {analyzing ? (
                    'Analyzing...'
                  ) : (
                    <>
                      <Text as="span" fontSize="xl" mr={2}>🔍</Text>
                      Analyze Screen
                    </>
                  )}
                </Button>

                {!selectedStudent ? (
                  <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                    Click a student's video tile first
                  </Text>
                ) : (
                  <Box
                    mt={2}
                    p={2}
                    bg="blue.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="blue.200"
                  >
                    <Text fontSize="xs" color="blue.700" fontWeight="semibold" textAlign="center">
                      ✓ Selected: {selectedStudent.name}
                    </Text>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Stats */}
              <Box>
                <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={2}>
                  Live Statistics
                </Text>
                <VStack spacing={1} align="stretch" fontSize="xs">
                  <HStack justify="space-between">
                    <Text color="gray.600">Total Students:</Text>
                    <Text fontWeight="semibold">{students.length}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">On Task:</Text>
                    <Text fontWeight="semibold" color="green.600">
                      {onTaskCount}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">Neutral:</Text>
                    <Text fontWeight="semibold" color="yellow.600">
                      {neutralCount}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">Off Task:</Text>
                    <Text fontWeight="semibold" color="red.600">
                      {offTaskCount}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Collapse>
      </Box>

      {/* Analysis Results Modal */}
      {analysisResult && (
        <ScreenshotAnalysisModal
          analysis={analysisResult}
          studentName={selectedStudent?.name || 'Unknown'}
          onClose={() => setAnalysisResult(null)}
        />
      )}
    </>
  );
};

export default QuickActionsPanel;
