"use client";

import { useEffect, useRef, useState } from "react";

interface CandidateMetrics {
  confidence: number;
  engagement: number;
  eyeContact: number;
  stress: number;
  mood: string;
  status: 'excellent' | 'good' | 'concerning' | 'needs_attention';
  faceDetected: boolean;
  detectionQuality: number;
}

interface SmartAnalysisPanelProps {
  isVisible: boolean;
  onMetricsUpdate?: (metrics: CandidateMetrics) => void;
}

export const SmartAnalysisPanel: React.FC<SmartAnalysisPanelProps> = ({ 
  isVisible, 
  onMetricsUpdate 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [metrics, setMetrics] = useState<CandidateMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [faceDetectionState, setFaceDetectionState] = useState<'searching' | 'found' | 'lost'>('searching');

  useEffect(() => {
    if (!isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsAnalyzing(false);
      setFaceDetectionState('searching');
      return;
    }

    setIsAnalyzing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 180;
    canvas.height = 120;

    let frame = 0;
    let faceDetectedFrames = 0;
    let lastFaceDetected = false;
    let currentMetrics: CandidateMetrics | null = null;

    const analyze = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simulate face detection with more realistic patterns
      const time = frame * 0.02;
      
      // Face detection quality varies over time (simulating real detection)
      const detectionQuality = Math.max(0, 0.6 + Math.sin(time * 0.3) * 0.4);
      const faceDetected = detectionQuality > 0.3; // Threshold for detection
      
      // Update face detection state
      if (faceDetected && !lastFaceDetected) {
        setFaceDetectionState('found');
        faceDetectedFrames = 0;
      } else if (!faceDetected && lastFaceDetected) {
        setFaceDetectionState('lost');
      } else if (faceDetected && faceDetectedFrames === 0) {
        setFaceDetectionState('found');
      }

      lastFaceDetected = faceDetected;

      // Only update metrics when face is detected and stable for a few frames
      if (faceDetected) {
        faceDetectedFrames++;
        
        // Only update metrics after face has been detected for at least 30 frames (1 second)
        if (faceDetectedFrames > 30) {
          // Generate realistic metrics based on detection quality
          const baseQuality = detectionQuality;
          
          // Metrics should correlate with detection quality
          const confidence = Math.min(0.95, Math.max(0.3, baseQuality * 0.9 + Math.random() * 0.1));
          const engagement = Math.min(0.9, Math.max(0.2, baseQuality * 0.8 + Math.random() * 0.15));
          const eyeContact = Math.min(0.95, Math.max(0.3, baseQuality * 0.85 + Math.random() * 0.1));
          const stress = Math.min(0.7, Math.max(0.1, (1 - baseQuality) * 0.6 + Math.random() * 0.2));

          // Mood should be consistent with stress and confidence levels
          let mood: string;
          if (stress < 0.3 && confidence > 0.7) {
            mood = 'Confident';
          } else if (stress > 0.5 && confidence < 0.5) {
            mood = 'Nervous';
          } else if (engagement > 0.7) {
            mood = 'Engaged';
          } else if (stress < 0.4) {
            mood = 'Calm';
          } else {
            mood = 'Focused';
          }

          // Determine overall status based on combined metrics
          const avgScore = (confidence + engagement + eyeContact + (1 - stress)) / 4;
          let status: CandidateMetrics['status'];
          if (avgScore >= 0.8) status = 'excellent';
          else if (avgScore >= 0.6) status = 'good';
          else if (avgScore >= 0.4) status = 'concerning';
          else status = 'needs_attention';

          currentMetrics = {
            confidence,
            engagement,
            eyeContact,
            stress,
            mood,
            status,
            faceDetected: true,
            detectionQuality
          };

          setMetrics(currentMetrics);
          onMetricsUpdate?.(currentMetrics);
        }
      } else {
        // No face detected - clear metrics after a delay
        if (faceDetectedFrames > 0) {
          faceDetectedFrames = Math.max(0, faceDetectedFrames - 2);
          if (faceDetectedFrames === 0) {
            setMetrics(null);
            currentMetrics = null;
          }
        }
      }

      // Draw face visualization based on detection state
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      if (faceDetected && faceDetectedFrames > 10) {
        // Draw detected face
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(centerX - 12, centerY - 8, 3, 0, 2 * Math.PI);
        ctx.arc(centerX + 12, centerY - 8, 3, 0, 2 * Math.PI);
        ctx.fill();

        // Mouth
        ctx.beginPath();
        ctx.arc(centerX, centerY + 5, 15, 0, Math.PI);
        ctx.stroke();

        // Detection quality indicator
        ctx.fillStyle = `rgba(16, 185, 129, ${detectionQuality})`;
        ctx.fillRect(10, 10, detectionQuality * 160, 3);
      } else {
        // Draw searching state
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);

        // Searching text
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Scanning...', centerX, centerY + 50);
      }

      frame++;
      animationRef.current = requestAnimationFrame(analyze);
    };

    // Start with delay
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(analyze);
    }, 100);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, onMetricsUpdate]);

  if (!isVisible) return null;

  const getStatusColor = (status: CandidateMetrics['status']) => {
    switch (status) {
      case 'excellent': return 'text-green-400 border-green-400';
      case 'good': return 'text-blue-400 border-blue-400';
      case 'concerning': return 'text-yellow-400 border-yellow-400';
      case 'needs_attention': return 'text-red-400 border-red-400';
    }
  };

  const getStatusText = (status: CandidateMetrics['status']) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'concerning': return 'Concerning';
      case 'needs_attention': return 'Needs Attention';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 0.7) return 'text-green-400';
    if (value >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="absolute top-4 right-4 bg-black/95 text-white p-4 rounded-lg backdrop-blur-sm w-72 shadow-2xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Smart Analysis</h3>
        <div className={`w-2 h-2 rounded-full ${
          faceDetectionState === 'found' ? 'bg-green-500' : 
          faceDetectionState === 'lost' ? 'bg-yellow-500 animate-pulse' : 
          'bg-gray-500 animate-pulse'
        }`}></div>
      </div>

      {/* Face Detection Status */}
      <div className="mb-4">
        <div className={`px-3 py-2 rounded-lg border text-center text-xs font-medium ${
          faceDetectionState === 'found' ? 'bg-green-500/20 text-green-400 border-green-400' :
          faceDetectionState === 'lost' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400' :
          'bg-gray-500/20 text-gray-400 border-gray-400'
        }`}>
          {faceDetectionState === 'found' ? 'Face Detected' :
           faceDetectionState === 'lost' ? 'Face Lost' :
           'Scanning for Face...'}
        </div>
      </div>

      {metrics && faceDetectionState === 'found' ? (
        <>
          {/* Status Badge */}
          <div className={`mb-4 px-3 py-1 rounded-full border text-center text-xs font-semibold ${getStatusColor(metrics.status)}`}>
            {getStatusText(metrics.status)}
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-800 rounded p-3">
              <div className="text-xs text-gray-400 mb-1">Confidence</div>
              <div className={`text-lg font-bold ${getMetricColor(metrics.confidence)}`}>
                {Math.round(metrics.confidence * 100)}%
              </div>
            </div>
            
            <div className="bg-gray-800 rounded p-3">
              <div className="text-xs text-gray-400 mb-1">Engagement</div>
              <div className={`text-lg font-bold ${getMetricColor(metrics.engagement)}`}>
                {Math.round(metrics.engagement * 100)}%
              </div>
            </div>
            
            <div className="bg-gray-800 rounded p-3">
              <div className="text-xs text-gray-400 mb-1">Eye Contact</div>
              <div className={`text-lg font-bold ${getMetricColor(metrics.eyeContact)}`}>
                {Math.round(metrics.eyeContact * 100)}%
              </div>
            </div>
            
            <div className="bg-gray-800 rounded p-3">
              <div className="text-xs text-gray-400 mb-1">Stress Level</div>
              <div className={`text-lg font-bold ${getMetricColor(1 - metrics.stress)}`}>
                {Math.round(metrics.stress * 100)}%
              </div>
            </div>
          </div>

          {/* Current Mood */}
          <div className="bg-gray-800 rounded p-3 mb-4">
            <div className="text-xs text-gray-400 mb-1">Current Mood</div>
            <div className="text-sm font-medium text-white capitalize">{metrics.mood}</div>
          </div>

          {/* Mini Visualization */}
          <div className="bg-gray-900 rounded p-2 flex justify-center mb-3">
            <canvas
              ref={canvasRef}
              className="rounded"
              style={{ width: '180px', height: '120px' }}
            />
          </div>

          {/* Detection Quality */}
          <div className="bg-gray-800 rounded p-3">
            <div className="text-xs text-gray-400 mb-1">Detection Quality</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${metrics.detectionQuality * 100}%` }}
                />
              </div>
              <span className="text-xs text-white">{Math.round(metrics.detectionQuality * 100)}%</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Mini Visualization */}
          <div className="bg-gray-900 rounded p-2 flex justify-center mb-4">
            <canvas
              ref={canvasRef}
              className="rounded"
              style={{ width: '180px', height: '120px' }}
            />
          </div>

          {/* Waiting Message */}
          <div className="text-center py-4">
            <div className="text-xs text-gray-400">
              {faceDetectionState === 'lost' ? 
                'Waiting for face to reappear...' : 
                'Position face in camera view'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
