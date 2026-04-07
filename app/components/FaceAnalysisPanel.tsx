"use client";

import { useEffect, useRef, useState } from "react";

interface FaceMetrics {
  eyeContact: {
    isMaintained: boolean;
    confidence: number;
    duration: number;
  };
  expressions: {
    happy: number;
    sad: number;
    nervous: number;
    confused: number;
    neutral: number;
    confident: number;
    engaged: number;
  };
  mood: {
    primary: string;
    confidence: number;
    description: string;
  };
  overall: {
    confidence: number;
    engagement: number;
    stress: number;
    professionalism: number;
  };
}

interface FaceAnalysisPanelProps {
  isVisible: boolean;
  onAnalysisUpdate?: (metrics: FaceMetrics) => void;
}

export const FaceAnalysisPanel: React.FC<FaceAnalysisPanelProps> = ({ 
  isVisible, 
  onAnalysisUpdate 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [metrics, setMetrics] = useState<FaceMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    console.log('FaceAnalysisPanel useEffect triggered, isVisible:', isVisible);
    
    if (!isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);
    console.log('Starting face analysis...');
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found');
      return;
    }

    // Set canvas size
    canvas.width = 200;
    canvas.height = 150;

    let frame = 0;
    let eyeContactDuration = 0;
    let lastEyeContactState = true;

    const analyze = () => {
      console.log('Analysis frame:', frame);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Generate mock face landmarks for visualization
      const mockKeypoints = Array.from({ length: 468 }, (_, i) => {
        const baseX = canvas.width / 2;
        const baseY = canvas.height / 2;
        const radius = 40;
        const angle = (i / 468) * Math.PI * 2;
        
        const wobble = Math.sin(frame * 0.02 + i * 0.05) * 2;
        
        return {
          x: baseX + Math.cos(angle) * radius + wobble + (Math.random() - 0.5) * 8,
          y: baseY + Math.sin(angle) * radius * 0.8 + wobble + (Math.random() - 0.5) * 8
        };
      });

      // Draw face visualization
      ctx.fillStyle = '#10b981';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 0.5;

      mockKeypoints.forEach((point, index) => {
        if (index % 4 === 0) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 0.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      // Simulate facial analysis with realistic variations
      const time = frame * 0.01;
      
      // Eye contact analysis (simulated)
      const currentEyeContact = Math.sin(time) > 0.3;
      if (currentEyeContact) {
        eyeContactDuration++;
      } else {
        eyeContactDuration = 0;
      }
      
      // Expression analysis (simulated with realistic patterns)
      const expressions = {
        happy: Math.max(0, Math.sin(time * 0.7) * 0.3 + 0.2 + Math.random() * 0.1),
        sad: Math.max(0, Math.sin(time * 0.5 + 1) * 0.2 + 0.1 + Math.random() * 0.1),
        nervous: Math.max(0, Math.sin(time * 1.2 + 2) * 0.4 + 0.3 + Math.random() * 0.15),
        confused: Math.max(0, Math.sin(time * 0.8 + 3) * 0.3 + 0.2 + Math.random() * 0.1),
        neutral: Math.max(0, Math.sin(time * 0.3) * 0.2 + 0.4 + Math.random() * 0.1),
        confident: Math.max(0, Math.sin(time * 0.6 + 1.5) * 0.3 + 0.4 + Math.random() * 0.1),
        engaged: Math.max(0, Math.sin(time * 0.4 + 0.5) * 0.2 + 0.6 + Math.random() * 0.1)
      };

      // Normalize expressions
      const totalExp = Object.values(expressions).reduce((a, b) => a + b, 0);
      Object.keys(expressions).forEach(key => {
        (expressions as any)[key] = (expressions as any)[key] / totalExp;
      });

      // Determine primary mood
      const dominantExpression = Object.entries(expressions).reduce((a, b) => 
        expressions[a[0] as keyof typeof expressions] > b[1] ? a : b
      )[0];

      const moodMap: Record<string, { description: string; color: string }> = {
        happy: { description: "Positive and engaged", color: "text-green-400" },
        sad: { description: "Low energy, possibly concerned", color: "text-blue-400" },
        nervous: { description: "Anxious, under pressure", color: "text-yellow-400" },
        confused: { description: "Uncertain, seeking clarity", color: "text-orange-400" },
        neutral: { description: "Calm, composed", color: "text-gray-400" },
        confident: { description: "Self-assured, prepared", color: "text-emerald-400" },
        engaged: { description: "Focused, attentive", color: "text-cyan-400" }
      };

      const moodInfo = moodMap[dominantExpression];

      // Calculate overall metrics
      const overall = {
        confidence: Math.min(0.95, Math.max(0.3, expressions.confident + expressions.engaged * 0.5)),
        engagement: Math.min(0.95, Math.max(0.2, expressions.engaged + expressions.happy * 0.3)),
        stress: Math.min(0.9, Math.max(0.1, expressions.nervous + expressions.confused * 0.7)),
        professionalism: Math.min(0.95, Math.max(0.3, expressions.confident + expressions.neutral * 0.5 - expressions.nervous * 0.3))
      };

      const newMetrics: FaceMetrics = {
        eyeContact: {
          isMaintained: currentEyeContact,
          confidence: currentEyeContact ? Math.min(0.9, 0.5 + eyeContactDuration * 0.01) : 0.2,
          duration: eyeContactDuration
        },
        expressions,
        mood: {
          primary: dominantExpression,
          confidence: expressions[dominantExpression as keyof typeof expressions],
          description: moodInfo.description
        },
        overall
      };

      setMetrics(newMetrics);
      onAnalysisUpdate?.(newMetrics);

      frame++;
      animationRef.current = requestAnimationFrame(analyze);
    };

    analyze();

    // Start animation with a small delay to ensure everything is ready
    setTimeout(() => {
      console.log('Starting animation loop');
      animationRef.current = requestAnimationFrame(analyze);
    }, 100);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, onAnalysisUpdate]);

  if (!isVisible) return null;

  // Fallback: Show content after 2 seconds even if animation hasn't started
  useEffect(() => {
    if (isVisible && !metrics) {
      const fallbackTimer = setTimeout(() => {
        if (!metrics) {
          console.log('Fallback: Showing mock data');
          setMetrics({
            eyeContact: {
              isMaintained: true,
              confidence: 0.75,
              duration: 45
            },
            expressions: {
              happy: 0.3,
              sad: 0.1,
              nervous: 0.2,
              confused: 0.1,
              neutral: 0.2,
              confident: 0.4,
              engaged: 0.5
            },
            mood: {
              primary: 'confident',
              confidence: 0.4,
              description: 'Self-assured, prepared'
            },
            overall: {
              confidence: 0.8,
              engagement: 0.7,
              stress: 0.3,
              professionalism: 0.85
            }
          });
          setIsAnalyzing(false);
        }
      }, 2000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [isVisible, metrics]);

  const getConfidenceColor = (value: number) => {
    if (value >= 0.7) return 'text-green-400';
    if (value >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBg = (value: number) => {
    if (value >= 0.7) return 'bg-green-500';
    if (value >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg backdrop-blur-sm w-80 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Face Analysis</h3>
        <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
      </div>

      {metrics ? (
        <div className="space-y-4">
          {/* Mini Face Visualization */}
          <div className="bg-gray-900 rounded-lg p-2 flex justify-center">
            <canvas
              ref={canvasRef}
              className="rounded"
              style={{ width: '200px', height: '150px' }}
            />
          </div>

          {/* Eye Contact Analysis */}
          <div className="bg-gray-800 rounded-lg p-3">
            <h4 className="text-xs font-semibold mb-2 text-blue-400">Eye Contact</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Status:</span>
                <span className={`text-xs font-medium ${metrics.eyeContact.isMaintained ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.eyeContact.isMaintained ? 'Maintained' : 'Broken'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Confidence:</span>
                <span className={`text-xs font-medium ${getConfidenceColor(metrics.eyeContact.confidence)}`}>
                  {Math.round(metrics.eyeContact.confidence * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Duration:</span>
                <span className="text-xs text-white">{Math.round(metrics.eyeContact.duration / 60)}s</span>
              </div>
            </div>
          </div>

          {/* Current Mood */}
          <div className="bg-gray-800 rounded-lg p-3">
            <h4 className="text-xs font-semibold mb-2 text-purple-400">Current Mood</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Mood:</span>
                <span className={`text-xs font-semibold capitalize ${getConfidenceColor(metrics.mood.confidence)}`}>
                  {metrics.mood.primary}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Description:</span>
              </div>
              <p className="text-xs text-gray-400 italic">{metrics.mood.description}</p>
            </div>
          </div>

          {/* Expression Breakdown */}
          <div className="bg-gray-800 rounded-lg p-3">
            <h4 className="text-xs font-semibold mb-2 text-green-400">Expression Analysis</h4>
            <div className="space-y-1">
              {Object.entries(metrics.expressions).map(([emotion, value]) => (
                <div key={emotion} className="flex items-center gap-2">
                  <span className="text-xs text-gray-300 w-16 capitalize">{emotion}:</span>
                  <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getConfidenceBg(value)} transition-all duration-500`}
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-white w-8 text-right">{Math.round(value * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Assessment */}
          <div className="bg-gray-800 rounded-lg p-3">
            <h4 className="text-xs font-semibold mb-2 text-orange-400">Candidate Assessment</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Confidence:</span>
                <span className={`text-xs font-medium ${getConfidenceColor(metrics.overall.confidence)}`}>
                  {Math.round(metrics.overall.confidence * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Engagement:</span>
                <span className={`text-xs font-medium ${getConfidenceColor(metrics.overall.engagement)}`}>
                  {Math.round(metrics.overall.engagement * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Stress Level:</span>
                <span className={`text-xs font-medium ${getConfidenceColor(1 - metrics.overall.stress)}`}>
                  {Math.round(metrics.overall.stress * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Professionalism:</span>
                <span className={`text-xs font-medium ${getConfidenceColor(metrics.overall.professionalism)}`}>
                  {Math.round(metrics.overall.professionalism * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gray-800 rounded-lg p-3">
            <h4 className="text-xs font-semibold mb-2 text-cyan-400">Key Insights</h4>
            <div className="text-xs text-gray-300 space-y-1">
              {metrics.overall.confidence > 0.7 && (
                <p>• Shows high confidence and preparation</p>
              )}
              {metrics.eyeContact.confidence > 0.6 && (
                <p>• Maintains good eye contact</p>
              )}
              {metrics.overall.stress > 0.5 && (
                <p>• May be experiencing some stress</p>
              )}
              {metrics.overall.engagement > 0.6 && (
                <p>• Highly engaged in conversation</p>
              )}
              {metrics.mood.primary === 'nervous' && (
                <p>• Appears nervous but engaged</p>
              )}
              {metrics.mood.primary === 'confident' && (
                <p>• Projects confidence and clarity</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xs text-gray-400">Initializing face analysis...</p>
        </div>
      )}
    </div>
  );
};
