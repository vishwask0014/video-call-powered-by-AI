"use client";

import { useEffect, useRef, useState } from "react";

// Mock face detection for now (to avoid TensorFlow import issues)
interface MockFaceDetection {
  createDetector: (model: any, config: any) => Promise<MockFaceDetector>;
  SupportedModels: {
    MediaPipeFaceDetector: any;
  };
}

interface MockFaceDetector {
  estimateFaces: (video: HTMLVideoElement) => Promise<MockFace[]>;
}

interface MockFace {
  keypoints: Array<{ x: number; y: number }>;
}

// Mock implementation to avoid import errors
const faceDetection: MockFaceDetection = {
  createDetector: async (model: any, config: any) => {
    return {
      estimateFaces: async (video: HTMLVideoElement) => {
        // Return mock face data for demonstration
        return [{
          keypoints: Array.from({ length: 468 }, () => ({
            x: Math.random() * 640, // Default video width
            y: Math.random() * 480  // Default video height
          }))
        }];
      }
    };
  },
  SupportedModels: {
    MediaPipeFaceDetector: {}
  }
};

interface EmotionData {
  confidence: number;
  expressions: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    neutral: number;
  };
  eyeContact: boolean;
}

interface EmotionDetectorProps {
  videoElement: HTMLVideoElement | null;
  onEmotionUpdate: (emotion: EmotionData) => void;
}

export const EmotionDetector: React.FC<EmotionDetectorProps> = ({
  videoElement,
  onEmotionUpdate,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detector, setDetector] = useState<MockFaceDetector | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const initializeDetector = async () => {
      try {
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig = {
          runtime: "tfjs" as const,
          maxFaces: 1,
          refineLandmarks: false,
        };
        
        const faceDetector = await faceDetection.createDetector(model, detectorConfig);
        setDetector(faceDetector);
        setIsDetecting(true);
      } catch (error) {
        console.error("Failed to initialize face detector:", error);
      }
    };

    initializeDetector();
  }, []);

  useEffect(() => {
    if (!detector || !videoElement || !isDetecting) return;

    let lastUpdateTime = 0;
    const updateInterval = 2000; // Update every 2 seconds instead of every frame

    const detectEmotions = async () => {
      const now = Date.now();
      
      // Only update emotions at specified intervals to prevent flickering
      if (now - lastUpdateTime < updateInterval) {
        animationFrameRef.current = requestAnimationFrame(detectEmotions);
        return;
      }

      try {
        const faces = await detector.estimateFaces(videoElement);
        
        if (faces.length > 0) {
          const face = faces[0];
          const emotions = analyzeEmotions(face);
          onEmotionUpdate(emotions);
          lastUpdateTime = now;
        }
      } catch (error) {
        console.error("Error detecting emotions:", error);
      }

      animationFrameRef.current = requestAnimationFrame(detectEmotions);
    };

    detectEmotions();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [detector, videoElement, isDetecting, onEmotionUpdate]);

  const analyzeEmotions = (face: MockFace): EmotionData => {
    const keypoints = face.keypoints;
    
    // Simple emotion analysis based on facial landmarks
    // This is a basic implementation - you'd want to use a more sophisticated model
    const leftEye = keypoints.find((kp: any, index: any) => index === 33); // Left eye center
    const rightEye = keypoints.find((kp: any, index: any) => index === 263); // Right eye center
    const nose = keypoints.find((kp: any, index: any) => index === 1); // Nose tip
    
    // Calculate eye contact (simplified)
    const eyeContact = leftEye && rightEye && nose ? 
      Math.abs(leftEye.y - rightEye.y) < 20 : false;

    // Mock emotion values (replace with actual ML model)
    const expressions = {
      happy: Math.random() * 0.3 + 0.1,
      sad: Math.random() * 0.2,
      angry: Math.random() * 0.1,
      surprised: Math.random() * 0.2,
      neutral: Math.random() * 0.4 + 0.3,
    };

    const confidence = Math.min(0.9, Math.max(0.3, 1 - (expressions.neutral * 0.5)));

    return {
      confidence,
      expressions,
      eyeContact,
    };
  };

  return null; // This component doesn't render anything visible
};
