"use client";

import { useState, useEffect } from "react";

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

interface EmotionOverlayProps {
  emotion: EmotionData | null;
  isVisible: boolean;
}

export const EmotionOverlay: React.FC<EmotionOverlayProps> = ({ emotion, isVisible }) => {
  const [displayEmotion, setDisplayEmotion] = useState<EmotionData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smooth transitions for emotion data
  useEffect(() => {
    if (!emotion || !isVisible) {
      setDisplayEmotion(null);
      return;
    }

    setIsTransitioning(true);
    
    // Add a small delay for smooth transition
    const timer = setTimeout(() => {
      setDisplayEmotion(emotion);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [emotion, isVisible]);

  if (!isVisible || !displayEmotion) return null;

  const getDominantEmotion = () => {
    const expressions = displayEmotion.expressions;
    const max = Math.max(...Object.values(expressions));
    return Object.keys(expressions).find(key => expressions[key as keyof typeof expressions] === max) || 'neutral';
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'bg-green-500';
      case 'sad': return 'bg-blue-500';
      case 'angry': return 'bg-red-500';
      case 'surprised': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const dominantEmotion = getDominantEmotion();
  const emotionColor = getEmotionColor(dominantEmotion);

  return (
    <div className={`absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm max-w-xs transition-all duration-500 ${
      isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      <h3 className="text-sm font-semibold mb-2">AI Analysis</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs">Confidence:</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-1000 ease-out"
                style={{ width: `${displayEmotion.confidence * 100}%` }}
              />
            </div>
            <span className="text-xs">{Math.round(displayEmotion.confidence * 100)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs">Eye Contact:</span>
          <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${
            displayEmotion.eyeContact ? 'bg-green-500' : 'bg-red-500'
          }`} />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium">Emotions:</span>
          {Object.entries(displayEmotion.expressions).map(([emotionName, value]) => (
            <div key={emotionName} className="flex items-center justify-between">
              <span className="text-xs capitalize">{emotionName}:</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${emotionColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
                <span className="text-xs">{Math.round(value * 100)}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-gray-600">
          <span className="text-xs">Dominant: </span>
          <span className={`text-xs font-semibold capitalize px-2 py-1 rounded ${emotionColor} text-white transition-colors duration-500`}>
            {dominantEmotion}
          </span>
        </div>
      </div>
    </div>
  );
};
