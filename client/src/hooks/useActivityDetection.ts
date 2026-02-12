/**
 * useActivityDetection Hook
 *
 * Analyzes video stream frames using AI to detect student activity
 * Updates every 5 seconds with activity labels and color coding
 */

import { useState, useEffect, useRef, RefObject } from 'react';

export interface Activity {
  label: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
}

interface UseActivityDetectionOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
  apiUrl?: string;
}

export const useActivityDetection = (
  videoRef: RefObject<HTMLVideoElement>,
  studentId: string,
  options: UseActivityDetectionOptions = {}
): Activity => {
  const {
    enabled = true,
    interval = 5000,
    apiUrl = 'http://localhost:5000/api/analyze-activity'
  } = options;

  const [activity, setActivity] = useState<Activity>({
    label: 'Connecting...',
    color: 'gray'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setActivity({ label: 'Disabled', color: 'gray' });
      return;
    }

    // Safety check: wait for video to be ready
    if (!videoRef?.current || !videoRef.current.videoWidth) {
      return;
    }

    const analyzeFrame = async () => {
      // Prevent concurrent requests
      if (processingRef.current) return;

      try {
        processingRef.current = true;
        setIsProcessing(true);

        const video = videoRef.current;
        if (!video || !video.videoWidth) return;

        // 1. Extract frame from video
        const canvas = document.createElement('canvas');
        canvas.width = 640; // Smaller = faster
        canvas.height = 360;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 2. Convert to base64 (low quality for speed)
        const frameData = canvas.toDataURL('image/jpeg', 0.3);
        const base64Image = frameData.split(',')[1];

        // 3. Send to backend
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 sec timeout

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Image,
            studentId: studentId
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('API failed');

        const data = await response.json();

        // 4. Update state with color coding
        const activityColors: Record<string, Activity['color']> = {
          'Coding': 'green',
          'Working': 'green',
          'Reading': 'yellow',
          'Documentation': 'yellow',
          'YouTube': 'red',
          'Game': 'red',
          'Social': 'red',
          'Idle': 'gray',
          'Error': 'gray',
          'Demo': 'gray'
        };

        let color: Activity['color'] = 'gray';
        for (const [key, keyColor] of Object.entries(activityColors)) {
          if (data.activity.includes(key)) {
            color = keyColor;
            break;
          }
        }

        setActivity({
          label: data.activity,
          color: color
        });

      } catch (error: any) {
        console.error('Activity detection error:', error);
        if (error.name === 'AbortError') {
          setActivity({ label: 'Timeout', color: 'gray' });
        } else {
          setActivity({ label: 'Error', color: 'gray' });
        }
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
      }
    };

    // Initial analysis after 2 sec delay (let video stabilize)
    const initialTimeout = setTimeout(analyzeFrame, 2000);

    // Then every interval
    const intervalId = setInterval(analyzeFrame, interval);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
      processingRef.current = false;
    };
  }, [videoRef, studentId, enabled, interval, apiUrl]);

  return activity;
};
