/**
 * SummaryButton Component
 *
 * Floating action button that triggers AI summary generation
 */

import React, { useState } from 'react';
import { Button, Spinner, Box } from '@chakra-ui/react';
import SummaryModal from './SummaryModal';

export interface SessionData {
  duration: number;
  totalStudents: number;
  date: string;
  students: Array<{
    name: string;
    activities: string[];
    engagementScore: number;
  }>;
}

export interface SummaryReport {
  report: string;
  stats: {
    avgEngagement: number;
    totalStudents: number;
    duration: number;
  };
  timestamp: number;
}

interface SummaryButtonProps {
  sessionData: SessionData;
  apiUrl?: string;
}

const SummaryButton: React.FC<SummaryButtonProps> = ({
  sessionData,
  apiUrl = 'http://localhost:5000/api/generate-summary'
}) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SummaryReport | null>(null);

  const generateReport = async () => {
    setLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Summary generation failed:', error);
      alert('Failed to generate report. Please make sure the AI backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        position="fixed"
        bottom={6}
        right={6}
        zIndex={50}
        px={6}
        py={6}
        bgGradient="linear(to-r, purple.600, blue.600)"
        color="white"
        borderRadius="full"
        boxShadow="2xl"
        _hover={{
          bgGradient: "linear(to-r, purple.700, blue.700)",
          transform: "scale(1.05)",
          boxShadow: "0 0 20px rgba(159, 122, 234, 0.5)"
        }}
        transition="all 0.2s"
        fontWeight="semibold"
        fontSize="md"
        onClick={generateReport}
        isDisabled={loading}
        leftIcon={loading ? <Spinner size="sm" /> : undefined}
      >
        <Box as="span" mr={2}>
          {loading ? '' : '✨'}
        </Box>
        {loading ? 'Generating...' : 'Generate AI Summary'}
      </Button>

      {report && (
        <SummaryModal
          report={report}
          onClose={() => setReport(null)}
        />
      )}
    </>
  );
};

export default SummaryButton;
