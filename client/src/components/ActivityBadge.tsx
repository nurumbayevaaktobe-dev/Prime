/**
 * ActivityBadge Component
 *
 * Displays the current activity status with color coding
 * Green = On-task, Yellow = Neutral, Red = Off-task, Gray = System state
 */

import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export interface Activity {
  label: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
}

interface ActivityBadgeProps {
  activity: Activity;
}

const ActivityBadge: React.FC<ActivityBadgeProps> = ({ activity }) => {
  const colorSchemes = {
    green: {
      bg: 'green.500',
      borderColor: 'green.600',
      shadow: '0 0 10px rgba(72, 187, 120, 0.5)'
    },
    yellow: {
      bg: 'yellow.500',
      borderColor: 'yellow.600',
      shadow: '0 0 10px rgba(236, 201, 75, 0.5)'
    },
    red: {
      bg: 'red.500',
      borderColor: 'red.600',
      shadow: '0 0 10px rgba(245, 101, 101, 0.5)'
    },
    gray: {
      bg: 'gray.500',
      borderColor: 'gray.600',
      shadow: '0 0 10px rgba(160, 174, 192, 0.5)'
    }
  };

  const scheme = colorSchemes[activity.color];
  const shouldPulse = activity.color === 'red';

  return (
    <Box
      position="absolute"
      top={2}
      left={2}
      zIndex={10}
      px={3}
      py={1}
      borderRadius="full"
      bg={scheme.bg}
      color="white"
      fontSize="xs"
      fontWeight="bold"
      border="2px solid"
      borderColor={scheme.borderColor}
      boxShadow={scheme.shadow}
      animation={shouldPulse ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : undefined}
      sx={shouldPulse ? {
        '@keyframes pulse': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.7,
          },
        },
      } : {}}
    >
      <Text as="span">
        {activity.label}
      </Text>
    </Box>
  );
};

export default ActivityBadge;
