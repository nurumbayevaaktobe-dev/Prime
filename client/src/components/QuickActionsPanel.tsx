/**
 * QuickActionsPanel Component
 *
 * Floating toolbar for teacher controls:
 * - Grid layout adjustment
 * - Filter controls
 * - Snapshot feature
 * - Real-time statistics
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  Grid,
  GridItem,
  Collapse,
  Divider
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

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
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  showOnlyOffTask: boolean;
  onToggleFilter: () => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  students,
  gridSize,
  onGridSizeChange,
  showOnlyOffTask,
  onToggleFilter
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const takeSnapshot = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    alert(`Snapshot saved: classroom_${timestamp}.png\n(Demo feature - actual implementation would capture the view)`);
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

            {/* Snapshot Button */}
            <Button
              onClick={takeSnapshot}
              colorScheme="green"
              size="md"
              fontWeight="semibold"
            >
              📸 Take Snapshot
            </Button>

            <Divider />

            {/* Stats */}
            <Box pt={1}>
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
  );
};

export default QuickActionsPanel;
