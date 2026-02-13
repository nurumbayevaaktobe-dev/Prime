/**
 * Screenshot Analyzer Utility
 *
 * Captures video frames and sends them to AI backend for comprehensive analysis
 * including violation detection and code review
 */

export interface SyntaxError {
  line: number | null;
  type: string;
  description: string;
  suggestion: string;
}

export interface CodeReview {
  hasCode: boolean;
  language: string | null;
  editor: string | null;
  syntaxErrors: SyntaxError[];
  warnings: string[];
}

export interface Violation {
  type: string;
  description: string;
  evidence: string;
}

export interface AnalysisResult {
  violations: Violation[];
  codeReview: CodeReview;
  overallStatus: string;
  severity: 'success' | 'info' | 'warning' | 'critical';
  confidence: number;
  recommendations: string[];
  timestamp: string;
  studentName: string;
  analysisTimeMs: number;
  icon: string;
}

/**
 * Captures a high-quality frame from video and sends to AI for analysis
 */
export const captureAndAnalyzeScreen = async (
  videoRef: React.RefObject<HTMLVideoElement>,
  studentName: string,
  apiUrl: string = 'http://localhost:5000/api/analyze-screenshot'
): Promise<AnalysisResult> => {
  try {
    // Validate video element
    if (!videoRef?.current) {
      throw new Error('Video reference not available');
    }

    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight) {
      throw new Error('Video not ready - no dimensions');
    }

    // 1. Capture high-quality frame (higher resolution for code review)
    const canvas = document.createElement('canvas');
    canvas.width = 1280;  // Higher resolution than activity detection
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 2. Convert to base64 (medium quality for balance between size and clarity)
    const imageData = canvas.toDataURL('image/jpeg', 0.7);
    const base64Image = imageData.split(',')[1];

    console.log(`Capturing screenshot for ${studentName}...`);

    // 3. Send to backend for AI analysis
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 sec timeout

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: base64Image,
        studentName: studentName,
        timestamp: new Date().toISOString()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const analysis: AnalysisResult = await response.json();

    console.log(`Analysis complete for ${studentName}:`, analysis.overallStatus);

    return analysis;

  } catch (error: any) {
    console.error('Screenshot analysis failed:', error);

    // Provide helpful error messages
    if (error.name === 'AbortError') {
      throw new Error('Analysis timed out. Please try again.');
    } else if (error.message.includes('API error')) {
      throw error;
    } else {
      throw new Error(`Failed to analyze screenshot: ${error.message}`);
    }
  }
};

/**
 * Helper to format analysis time for display
 */
export const formatAnalysisTime = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  } else {
    return `${(ms / 1000).toFixed(1)}s`;
  }
};

/**
 * Helper to get severity color classes
 */
export const getSeverityColorClasses = (severity: AnalysisResult['severity']) => {
  const colorMap = {
    critical: {
      bg: 'bg-red-600',
      text: 'text-red-700',
      border: 'border-red-300',
      bgLight: 'bg-red-50'
    },
    warning: {
      bg: 'bg-yellow-600',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      bgLight: 'bg-yellow-50'
    },
    info: {
      bg: 'bg-blue-600',
      text: 'text-blue-700',
      border: 'border-blue-300',
      bgLight: 'bg-blue-50'
    },
    success: {
      bg: 'bg-green-600',
      text: 'text-green-700',
      border: 'border-green-300',
      bgLight: 'bg-green-50'
    }
  };

  return colorMap[severity] || colorMap.info;
};
