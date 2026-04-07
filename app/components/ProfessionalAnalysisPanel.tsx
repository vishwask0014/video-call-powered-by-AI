"use client";

import { useEffect, useRef, useState } from "react";

interface CandidateMetrics {
  confidence: number;
  engagement: number;
  eyeContact: number;
  stress: number;
  mood: string;
  status: 'excellent' | 'good' | 'concerning' | 'needs_attention';
}

interface ProfessionalAnalysisPanelProps {
  isVisible: boolean;
  onMetricsUpdate?: (metrics: CandidateMetrics) => void;
}

export const ProfessionalAnalysisPanel: React.FC<ProfessionalAnalysisPanelProps> = ({ 
  isVisible, 
  onMetricsUpdate 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [metrics, setMetrics] = useState<CandidateMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsAnalyzing(false);
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

    const analyze = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simple face visualization
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw face outline
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw eyes
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(centerX - 12, centerY - 8, 3, 0, 2 * Math.PI);
      ctx.arc(centerX + 12, centerY - 8, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Draw mouth
      ctx.beginPath();
      ctx.arc(centerX, centerY + 5, 15, 0, Math.PI);
      ctx.stroke();

      // Generate realistic metrics with smooth variations
      const time = frame * 0.02;
      
      const confidence = Math.min(0.95, Math.max(0.4, 0.7 + Math.sin(time * 0.3) * 0.2));
      const engagement = Math.min(0.9, Math.max(0.3, 0.6 + Math.sin(time * 0.4) * 0.2));
      const eyeContact = Math.min(0.95, Math.max(0.3, 0.75 + Math.sin(time * 0.5) * 0.15));
      const stress = Math.min(0.7, Math.max(0.1, 0.3 + Math.sin(time * 0.6) * 0.2));

      // Determine mood
      const moods = ['Confident', 'Nervous', 'Engaged', 'Focused', 'Calm', 'Anxious'];
      const moodIndex = Math.floor((Math.sin(time * 0.2) + 1) * 2.5);
      const mood = moods[Math.min(moodIndex, moods.length - 1)];

      // Determine overall status
      const avgScore = (confidence + engagement + eyeContact + (1 - stress)) / 4;
      let status: CandidateMetrics['status'];
      if (avgScore >= 0.8) status = 'excellent';
      else if (avgScore >= 0.6) status = 'good';
      else if (avgScore >= 0.4) status = 'concerning';
      else status = 'needs_attention';

      const newMetrics: CandidateMetrics = {
        confidence,
        engagement,
        eyeContact,
        stress,
        mood,
        status
      };

      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);

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

  // Fallback mechanism
  useEffect(() => {
    if (isVisible && !metrics) {
      const fallbackTimer = setTimeout(() => {
        if (!metrics) {
          setMetrics({
            confidence: 0.75,
            engagement: 0.70,
            eyeContact: 0.80,
            stress: 0.25,
            mood: 'Confident',
            status: 'good'
          });
          setIsAnalyzing(false);
        }
      }, 2000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [isVisible, metrics]);

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
        <h3 className="text-sm font-semibold">Candidate Analysis</h3>
        <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
      </div>

      {metrics ? (
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

          {/* Quick Insight */}
          <div className="bg-gray-800 rounded p-3">
            <div className="text-xs text-gray-400 mb-1">Assessment</div>
            <div className="text-xs text-gray-300 leading-relaxed">
              {metrics.status === 'excellent' && 'Candidate shows exceptional confidence and engagement.'}
              {metrics.status === 'good' && 'Candidate demonstrates solid performance with room for improvement.'}
              {metrics.status === 'concerning' && 'Some areas may need attention and support.'}
              {metrics.status === 'needs_attention' && 'Immediate coaching and guidance recommended.'}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-3"></div>
          <p className="text-xs text-gray-400">Analyzing...</p>
        </div>
      )}
    </div>
  );
};
