"use client";

import { useEffect, useRef, useState } from "react";

interface FacePoint {
  x: number;
  y: number;
}

interface FaceData {
  keypoints: FacePoint[];
  confidence: number;
}

interface FaceRecognitionOverlayProps {
  isVisible: boolean;
  onFaceDetected?: (face: FaceData) => void;
}

export const FaceRecognitionOverlay: React.FC<FaceRecognitionOverlayProps> = ({ 
  isVisible, 
  onFaceDetected 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [faceData, setFaceData] = useState<FaceData | null>(null);

  useEffect(() => {
    if (!isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = 320;
    canvas.height = 240;

    let frame = 0;
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Generate mock face landmarks that move slightly
      const mockKeypoints: FacePoint[] = Array.from({ length: 468 }, (_, i) => {
        const baseX = canvas.width / 2;
        const baseY = canvas.height / 2;
        const radius = 50;
        const angle = (i / 468) * Math.PI * 2;
        
        // Add some movement
        const wobble = Math.sin(frame * 0.02 + i * 0.1) * 3;
        
        return {
          x: baseX + Math.cos(angle) * radius + wobble + (Math.random() - 0.5) * 10,
          y: baseY + Math.sin(angle) * radius * 0.8 + wobble + (Math.random() - 0.5) * 10
        };
      });

      // Draw face landmarks
      ctx.fillStyle = '#00ff00';
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 1;

      mockKeypoints.forEach((point, index) => {
        // Draw points
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
        ctx.fill();

        // Draw connections between nearby points (simplified face mesh)
        if (index % 3 === 0 && index < mockKeypoints.length - 1) {
          const nextPoint = mockKeypoints[index + 1];
          const distance = Math.sqrt(
            Math.pow(nextPoint.x - point.x, 2) + 
            Math.pow(nextPoint.y - point.y, 2)
          );
          
          if (distance < 25) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
          }
        }
      });

      // Draw face bounding box
      const minX = Math.min(...mockKeypoints.map(p => p.x));
      const maxX = Math.max(...mockKeypoints.map(p => p.x));
      const minY = Math.min(...mockKeypoints.map(p => p.y));
      const maxY = Math.max(...mockKeypoints.map(p => p.y));

      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 1;
      ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);

      // Update face data
      const confidence = 0.85 + Math.sin(frame * 0.01) * 0.1;
      const newFaceData: FaceData = {
        keypoints: mockKeypoints,
        confidence
      };
      
      setFaceData(newFaceData);
      onFaceDetected?.(newFaceData);

      frame++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, onFaceDetected]);

  if (!isVisible) return null;

  return (
    <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm max-w-xs">
      <h3 className="text-sm font-semibold mb-2">Face Recognition</h3>
      
      <div className="space-y-2">
        {/* Mini face recognition canvas */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ width: '320px', height: '240px' }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
            style={{ mixBlendMode: 'screen' }}
          />
          
          {/* Confidence indicator */}
          <div className="absolute top-2 left-2 bg-green-500/20 border border-green-500 px-2 py-1 rounded backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">
                {faceData ? `${Math.round(faceData.confidence * 100)}%` : '...'}
              </span>
            </div>
          </div>
        </div>

        {/* Face detection info */}
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-300">Status:</span>
            <span className="text-green-400 font-medium">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Landmarks:</span>
            <span className="text-white">468 points</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Quality:</span>
            <span className={faceData?.confidence && faceData.confidence > 0.8 ? 'text-green-400' : faceData?.confidence && faceData.confidence > 0.6 ? 'text-yellow-400' : 'text-red-400'}>
              {faceData?.confidence && faceData.confidence > 0.8 ? 'High' : faceData?.confidence && faceData.confidence > 0.6 ? 'Medium' : 'Low'}
            </span>
          </div>
        </div>

        {/* Feature indicators */}
        <div className="pt-2 border-t border-gray-600">
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Face Detected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Tracking Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
