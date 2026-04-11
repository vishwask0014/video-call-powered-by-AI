"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

const TestVideo = () => {
  const [isInterviewer, setIsInterviewer] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [emotionData, setEmotionData] = useState(null);
  const [eyeContactData, setEyeContactData] = useState(null);
  const [confidenceData, setConfidenceData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [candidateName, setCandidateName] = useState('John Doe');
  const [interviewScore, setInterviewScore] = useState(0);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Mock emotion detection simulation
  const startEmotionDetection = useCallback(() => {
    if (!isInterviewer || !isVideoOn) return;
    
    setIsAnalyzing(true);
    let frame = 0;
    
    const analyze = () => {
      // Simulate realistic emotion and behavior patterns
      const time = frame * 0.02;
      
      // Emotion analysis (realistic variations)
      const emotions = {
        confident: Math.max(0, Math.min(1, 0.6 + Math.sin(time * 0.3) * 0.3)),
        nervous: Math.max(0, Math.min(1, 0.2 + Math.sin(time * 0.8) * 0.2)),
        engaged: Math.max(0, Math.min(1, 0.7 + Math.sin(time * 0.4) * 0.2)),
        focused: Math.max(0, Math.min(1, 0.8 + Math.sin(time * 0.2) * 0.15)),
        stressed: Math.max(0, Math.min(1, 0.15 + Math.sin(time * 0.6) * 0.15))
      };
      
      // Eye contact tracking
      const eyeContact = {
        maintained: Math.sin(time * 0.5) > 0.2,
        confidence: Math.max(0, Math.min(1, 0.75 + Math.sin(time * 0.3) * 0.2)),
        duration: Math.floor(Math.abs(Math.sin(time * 0.1)) * 100),
        breaks: Math.floor(Math.abs(Math.sin(time * 0.7)) * 3)
      };
      
      // Overall confidence scoring
      const confidence = {
        overall: Math.max(0, Math.min(1, 0.7 + Math.sin(time * 0.25) * 0.25)),
        speaking: Math.random() > 0.3,
        posture: Math.max(0, Math.min(1, 0.8 + Math.sin(time * 0.15) * 0.15)),
        clarity: Math.max(0, Math.min(1, 0.75 + Math.sin(time * 0.35) * 0.2))
      };
      
      // Calculate interview score
      const score = Math.round(
        (emotions.confident * 25 + 
         emotions.engaged * 20 + 
         emotions.focused * 20 + 
         eyeContact.confidence * 20 + 
         confidence.overall * 15)
      );
      
      setEmotionData(emotions);
      setEyeContactData(eyeContact);
      setConfidenceData(confidence);
      setInterviewScore(score);
      
      frame++;
      animationRef.current = requestAnimationFrame(analyze);
    };
    
    analyze();
  }, [isInterviewer, isVideoOn]);

  // Stop analysis
  const stopEmotionDetection = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnalyzing(false);
    setEmotionData(null);
    setEyeContactData(null);
    setConfidenceData(null);
  }, []);

  // Initialize video
  useEffect(() => {
    const initVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.log('Camera access denied, using dummy video');
        // Create dummy video animation
        if (canvasRef.current && videoRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          let frame = 0;
          
          const drawDummy = () => {
            if (!ctx || !canvasRef.current) return;
            
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, 640, 480);
            
            // Draw animated face
            const centerX = 320;
            const centerY = 240;
            const radius = 80;
            
            // Face outline
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Eyes
            ctx.fillStyle = '#4ade80';
            const eyeY = centerY - 20;
            const blink = Math.sin(frame * 0.1) > 0.95;
            
            if (!blink) {
              ctx.beginPath();
              ctx.arc(centerX - 25, eyeY, 8, 0, 2 * Math.PI);
              ctx.arc(centerX + 25, eyeY, 8, 0, 2 * Math.PI);
              ctx.fill();
            }
            
            // Mouth
            ctx.beginPath();
            ctx.arc(centerX, centerY + 20, 20, 0, Math.PI);
            ctx.stroke();
            
            frame++;
            requestAnimationFrame(drawDummy);
          };
          
          drawDummy();
          
          // Convert canvas to video stream
          const stream = canvasRef.current.captureStream(30);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      }
    };
    
    if (isVideoOn) {
      initVideo();
    }
  }, [isVideoOn]);

  // Start/stop analysis based on state
  useEffect(() => {
    if (isAnalyzing) {
      stopEmotionDetection();
    }
    if (isInterviewer && isVideoOn) {
      startEmotionDetection();
    }
    
    return () => {
      stopEmotionDetection();
    };
  }, [isInterviewer, isVideoOn, startEmotionDetection, stopEmotionDetection]);

  // Get emotion color
  const getEmotionColor = (value, type) => {
    if (type === 'positive') {
      return value > 0.7 ? 'text-green-400' : value > 0.4 ? 'text-yellow-400' : 'text-red-400';
    } else {
      return value > 0.7 ? 'text-red-400' : value > 0.4 ? 'text-yellow-400' : 'text-green-400';
    }
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          <div className="h-full relative bg-gray-800">
            {/* Video */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Canvas for dummy video */}
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="hidden"
            />
            
            {/* Face tracking overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Face tracking box */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-green-400 rounded-lg">
                  {/* Corner indicators */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
                  
                  {/* Eye contact lines */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-0.5 bg-green-400 opacity-50"></div>
                  </div>
                </div>
                
                {/* Tracking status */}
                <div className="absolute top-4 left-4 bg-green-500/20 border border-green-400 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400 font-medium">Face Tracking Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {/* User Mode Toggle */}
                  <button
                    onClick={() => setIsInterviewer(!isInterviewer)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isInterviewer 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {isInterviewer ? 'Interviewer' : 'Candidate'} View
                  </button>
                  
                  {/* Video Toggle */}
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isVideoOn 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {isVideoOn ? 'Video On' : 'Video Off'}
                  </button>
                </div>
                
                {/* Interview Score */}
                {isInterviewer && interviewScore > 0 && (
                  <div className={`px-4 py-2 rounded-lg text-sm font-bold ${getScoreColor(interviewScore)}`}>
                    Score: {interviewScore}/100
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Panel - Only for Interviewer */}
        {isInterviewer && (
          <div className="w-96 bg-gray-800 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Candidate Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Candidate Assessment</h3>
                <div className="text-sm text-gray-300">
                  <p>Name: {candidateName}</p>
                  <p>Position: Software Engineer</p>
                  <p>Interview Round: Technical</p>
                </div>
              </div>

              {/* Emotion Analysis */}
              {emotionData && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-3 text-blue-400">Emotion Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Confident</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-400 transition-all duration-300"
                            style={{ width: `${emotionData.confident * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getEmotionColor(emotionData.confident, 'positive')}`}>
                          {Math.round(emotionData.confident * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Nervous</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-400 transition-all duration-300"
                            style={{ width: `${emotionData.nervous * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getEmotionColor(emotionData.nervous, 'negative')}`}>
                          {Math.round(emotionData.nervous * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Engaged</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-400 transition-all duration-300"
                            style={{ width: `${emotionData.engaged * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getEmotionColor(emotionData.engaged, 'positive')}`}>
                          {Math.round(emotionData.engaged * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Focused</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-400 transition-all duration-300"
                            style={{ width: `${emotionData.focused * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getEmotionColor(emotionData.focused, 'positive')}`}>
                          {Math.round(emotionData.focused * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Stressed</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-400 transition-all duration-300"
                            style={{ width: `${emotionData.stressed * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getEmotionColor(emotionData.stressed, 'negative')}`}>
                          {Math.round(emotionData.stressed * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Eye Contact Analysis */}
              {eyeContactData && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-3 text-green-400">Eye Contact Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Maintained</span>
                      <span className={`text-sm font-medium ${eyeContactData.maintained ? 'text-green-400' : 'text-red-400'}`}>
                        {eyeContactData.maintained ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Confidence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-400 transition-all duration-300"
                            style={{ width: `${eyeContactData.confidence * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getEmotionColor(eyeContactData.confidence, 'positive')}`}>
                          {Math.round(eyeContactData.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Duration</span>
                      <span className="text-sm font-medium text-white">
                        {eyeContactData.duration}s
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Breaks Count</span>
                      <span className={`text-sm font-medium ${eyeContactData.breaks > 2 ? 'text-red-400' : 'text-green-400'}`}>
                        {eyeContactData.breaks}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confidence Metrics */}
              {confidenceData && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-3 text-purple-400">Confidence Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Overall</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-400 transition-all duration-300"
                            style={{ width: `${confidenceData.overall * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getEmotionColor(confidenceData.overall, 'positive')}`}>
                          {Math.round(confidenceData.overall * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Speaking</span>
                      <span className={`text-sm font-medium ${confidenceData.speaking ? 'text-green-400' : 'text-gray-400'}`}>
                        {confidenceData.speaking ? 'Active' : 'Silent'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Posture</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-400 transition-all duration-300"
                            style={{ width: `${confidenceData.posture * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getEmotionColor(confidenceData.posture, 'positive')}`}>
                          {Math.round(confidenceData.posture * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Clarity</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-400 transition-all duration-300"
                            style={{ width: `${confidenceData.clarity * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getEmotionColor(confidenceData.clarity, 'positive')}`}>
                          {Math.round(confidenceData.clarity * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Status */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-2 text-yellow-400">Analysis Status</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-xs text-gray-300">
                      {isAnalyzing ? 'Real-time Analysis Active' : 'Analysis Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {isAnalyzing ? 'Tracking facial expressions, eye contact, and confidence levels...' : 'Enable video to start analysis'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestVideo;
