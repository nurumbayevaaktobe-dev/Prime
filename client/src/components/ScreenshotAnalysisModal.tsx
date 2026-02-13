/**
 * Screenshot Analysis Modal
 *
 * Displays comprehensive AI analysis results including:
 * - Violation detection (games, ChatGPT, YouTube, etc.)
 * - Code review with syntax error detection
 * - Recommendations for teacher actions
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
  VStack,
  HStack,
  Divider,
  Badge,
  useClipboard
} from '@chakra-ui/react';
import { CloseIcon, CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { AnalysisResult, getSeverityColorClasses, formatAnalysisTime } from '../utils/screenshotAnalyzer';

interface ScreenshotAnalysisModalProps {
  analysis: AnalysisResult | null;
  studentName: string;
  onClose: () => void;
}

const ScreenshotAnalysisModal: React.FC<ScreenshotAnalysisModalProps> = ({
  analysis,
  studentName,
  onClose
}) => {
  const reportText = analysis ? JSON.stringify(analysis, null, 2) : '';
  const { hasCopied, onCopy } = useClipboard(reportText);

  if (!analysis) return null;

  const severityColors = getSeverityColorClasses(analysis.severity);
  const hasViolations = analysis.violations && analysis.violations.length > 0;
  const hasCode = analysis.codeReview?.hasCode;
  const hasSyntaxErrors = analysis.codeReview?.syntaxErrors && analysis.codeReview.syntaxErrors.length > 0;
  const hasWarnings = analysis.codeReview?.warnings && analysis.codeReview.warnings.length > 0;

  return (
    <Modal isOpen={true} onClose={onClose} size="4xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
      <ModalContent maxH="90vh" borderRadius="2xl" overflow="hidden">

        {/* Header */}
        <ModalHeader
          bgGradient={
            analysis.severity === 'critical' ? 'linear(to-r, red.600, red.700)' :
            analysis.severity === 'warning' ? 'linear(to-r, yellow.600, yellow.700)' :
            analysis.severity === 'success' ? 'linear(to-r, green.600, green.700)' :
            'linear(to-r, blue.600, blue.700)'
          }
          color="white"
          p={6}
        >
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <HStack>
                <Text fontSize="3xl">{analysis.icon}</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  Screen Analysis Results
                </Text>
              </HStack>
              <Text fontSize="sm" opacity={0.9}>
                Student: {studentName}
              </Text>
              <Text fontSize="xs" opacity={0.8}>
                {new Date(analysis.timestamp).toLocaleString()} •
                Analysis time: {formatAnalysisTime(analysis.analysisTimeMs)}
              </Text>
            </VStack>
            <Button
              onClick={onClose}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              borderRadius="full"
            >
              <CloseIcon />
            </Button>
          </HStack>
        </ModalHeader>

        {/* Body */}
        <ModalBody p={6}>
          <VStack spacing={4} align="stretch">

            {/* Overall Status */}
            <Box
              border="2px solid"
              borderColor={
                analysis.severity === 'critical' ? 'red.300' :
                analysis.severity === 'warning' ? 'yellow.300' :
                analysis.severity === 'success' ? 'green.300' :
                'blue.300'
              }
              bg={
                analysis.severity === 'critical' ? 'red.50' :
                analysis.severity === 'warning' ? 'yellow.50' :
                analysis.severity === 'success' ? 'green.50' :
                'blue.50'
              }
              borderRadius="xl"
              p={4}
            >
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                    📊 Overall Status
                  </Text>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={
                      analysis.severity === 'critical' ? 'red.700' :
                      analysis.severity === 'warning' ? 'yellow.700' :
                      analysis.severity === 'success' ? 'green.700' :
                      'blue.700'
                    }
                  >
                    {analysis.overallStatus}
                  </Text>
                </VStack>
                <Badge
                  colorScheme={
                    analysis.severity === 'critical' ? 'red' :
                    analysis.severity === 'warning' ? 'yellow' :
                    analysis.severity === 'success' ? 'green' :
                    'blue'
                  }
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  Confidence: {analysis.confidence}%
                </Badge>
              </HStack>
            </Box>

            {/* Violations Section */}
            {hasViolations && (
              <Box
                border="2px solid"
                borderColor="red.300"
                bg="red.50"
                borderRadius="xl"
                p={4}
              >
                <VStack align="stretch" spacing={3}>
                  <HStack>
                    <Text fontSize="lg" fontWeight="bold" color="red.900">
                      ⚠️ Violations Detected ({analysis.violations.length})
                    </Text>
                  </HStack>

                  {analysis.violations.map((violation, idx) => (
                    <Box
                      key={idx}
                      bg="white"
                      border="1px solid"
                      borderColor="red.200"
                      borderRadius="lg"
                      p={3}
                    >
                      <VStack align="start" spacing={2}>
                        <Badge colorScheme="red" fontSize="sm">
                          {violation.type}
                        </Badge>
                        <Text fontSize="sm" color="red.900" fontWeight="medium">
                          {violation.description}
                        </Text>
                        {violation.evidence && (
                          <Text fontSize="xs" color="red.700" fontStyle="italic">
                            Evidence: {violation.evidence}
                          </Text>
                        )}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Code Review Section */}
            {hasCode && (
              <Box
                border="2px solid"
                borderColor="blue.300"
                bg="blue.50"
                borderRadius="xl"
                p={4}
              >
                <VStack align="stretch" spacing={3}>
                  <Text fontSize="lg" fontWeight="bold" color="blue.900">
                    💻 Code Review
                  </Text>

                  {/* Code Info */}
                  <Box bg="white" borderRadius="lg" p={3}>
                    <HStack spacing={6} fontSize="sm">
                      <Box>
                        <Text color="gray.600" display="inline">Language: </Text>
                        <Text fontWeight="semibold" color="gray.900" display="inline">
                          {analysis.codeReview.language || 'Unknown'}
                        </Text>
                      </Box>
                      <Box>
                        <Text color="gray.600" display="inline">Editor: </Text>
                        <Text fontWeight="semibold" color="gray.900" display="inline">
                          {analysis.codeReview.editor || 'Unknown'}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  {/* Syntax Errors */}
                  {hasSyntaxErrors ? (
                    <VStack align="stretch" spacing={2}>
                      <Text color="red.700" fontWeight="semibold" fontSize="sm">
                        ❌ {analysis.codeReview.syntaxErrors.length} Syntax Error(s) Found:
                      </Text>
                      {analysis.codeReview.syntaxErrors.map((error, idx) => (
                        <Box
                          key={idx}
                          bg="red.50"
                          border="1px solid"
                          borderColor="red.200"
                          borderRadius="lg"
                          p={3}
                        >
                          <VStack align="start" spacing={2}>
                            <HStack>
                              {error.line && (
                                <Badge colorScheme="red" fontFamily="mono" fontSize="xs">
                                  Line {error.line}
                                </Badge>
                              )}
                              <Text fontWeight="semibold" color="red.900" fontSize="sm">
                                {error.type}
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color="red.700">
                              {error.description}
                            </Text>
                            {error.suggestion && (
                              <Box
                                bg="green.50"
                                border="1px solid"
                                borderColor="green.200"
                                borderRadius="md"
                                p={2}
                                w="full"
                              >
                                <Text fontSize="xs" color="green.700">
                                  💡 Suggestion: {error.suggestion}
                                </Text>
                              </Box>
                            )}
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Box
                      bg="green.50"
                      border="1px solid"
                      borderColor="green.200"
                      borderRadius="lg"
                      p={3}
                    >
                      <Text color="green.700" fontSize="sm">
                        ✅ No syntax errors detected
                      </Text>
                    </Box>
                  )}

                  {/* Warnings */}
                  {hasWarnings && (
                    <VStack align="stretch" spacing={1}>
                      <Text color="yellow.700" fontWeight="semibold" fontSize="sm">
                        ⚠️ Warnings:
                      </Text>
                      {analysis.codeReview.warnings.map((warning, idx) => (
                        <HStack key={idx} spacing={2} align="start">
                          <Text color="yellow.700" fontSize="sm">•</Text>
                          <Text color="yellow.700" fontSize="sm">{warning}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  )}
                </VStack>
              </Box>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <Box
                border="2px solid"
                borderColor="purple.300"
                bg="purple.50"
                borderRadius="xl"
                p={4}
              >
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="lg" fontWeight="bold" color="purple.900">
                    💡 Recommendations for Teacher
                  </Text>
                  {analysis.recommendations.map((rec, idx) => (
                    <HStack key={idx} spacing={2} align="start">
                      <Text color="purple.500" fontWeight="bold">→</Text>
                      <Text fontSize="sm" color="purple.700">{rec}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            <Divider />

            {/* Metadata */}
            <HStack justify="center" fontSize="xs" color="gray.500">
              <Text>AI Confidence: {analysis.confidence}%</Text>
              <Text>•</Text>
              <Text>Analysis Time: {formatAnalysisTime(analysis.analysisTimeMs)}</Text>
            </HStack>
          </VStack>
        </ModalBody>

        {/* Footer */}
        <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.200" p={4}>
          <HStack spacing={3} w="full">
            <Button
              flex={1}
              colorScheme="blue"
              onClick={onCopy}
              leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
              fontWeight="semibold"
            >
              {hasCopied ? '✓ Copied!' : '📋 Copy Report'}
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

export default ScreenshotAnalysisModal;
