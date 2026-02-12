/**
 * SummaryModal Component
 *
 * Displays the AI-generated lesson summary in a beautiful modal
 */

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Grid,
  GridItem,
  VStack,
  HStack,
  useClipboard,
  Icon
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

export interface SummaryReport {
  report: string;
  stats: {
    avgEngagement: number;
    totalStudents: number;
    duration: number;
  };
  timestamp: number;
}

interface SummaryModalProps {
  report: SummaryReport;
  onClose: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ report, onClose }) => {
  const { hasCopied, onCopy } = useClipboard(report.report);

  return (
    <Modal isOpen={true} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
      <ModalContent maxH="90vh" borderRadius="2xl" overflow="hidden">
        {/* Header */}
        <ModalHeader
          bgGradient="linear(to-r, purple.600, blue.600)"
          color="white"
          p={6}
        >
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontSize="2xl" fontWeight="bold">
                📊 Lesson Summary Report
              </Text>
              <Text fontSize="sm" color="purple.100">
                Generated at {new Date(report.timestamp * 1000).toLocaleTimeString()}
              </Text>
            </VStack>
            <Button
              onClick={onClose}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              borderRadius="full"
              p={2}
            >
              <CloseIcon />
            </Button>
          </HStack>
        </ModalHeader>

        {/* Stats Cards */}
        <Box p={6} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <Box
                bgGradient="linear(to-br, green.50, green.100)"
                border="2px solid"
                borderColor="green.300"
                borderRadius="xl"
                p={4}
                textAlign="center"
              >
                <Text fontSize="4xl" fontWeight="bold" color="green.700">
                  {Math.round(report.stats?.avgEngagement || 0)}%
                </Text>
                <Text fontSize="sm" color="green.600" mt={1}>
                  Average Engagement
                </Text>
              </Box>
            </GridItem>
            <GridItem>
              <Box
                bgGradient="linear(to-br, purple.50, purple.100)"
                border="2px solid"
                borderColor="purple.300"
                borderRadius="xl"
                p={4}
                textAlign="center"
              >
                <Text fontSize="4xl" fontWeight="bold" color="purple.700">
                  {report.stats?.totalStudents || 0}
                </Text>
                <Text fontSize="sm" color="purple.600" mt={1}>
                  Students Monitored
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </Box>

        {/* Report Content */}
        <ModalBody p={6} overflowY="auto" maxH="50vh">
          <Box
            whiteSpace="pre-wrap"
            color="gray.700"
            lineHeight="tall"
            fontSize="md"
            sx={{
              '& h2': {
                fontSize: 'xl',
                fontWeight: 'bold',
                mt: 4,
                mb: 2,
                color: 'gray.800'
              },
              '& ul': {
                ml: 4,
                mt: 2
              },
              '& li': {
                mb: 1
              }
            }}
          >
            {report.report}
          </Box>
        </ModalBody>

        {/* Actions */}
        <ModalFooter bg="gray.50" p={4} borderTop="1px solid" borderColor="gray.200">
          <HStack spacing={3} w="full">
            <Button
              flex={1}
              colorScheme="blue"
              onClick={onCopy}
              fontWeight="semibold"
            >
              {hasCopied ? '✓ Copied!' : '📋 Copy to Clipboard'}
            </Button>
            <Button
              px={6}
              variant="outline"
              onClick={onClose}
              fontWeight="semibold"
            >
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SummaryModal;
