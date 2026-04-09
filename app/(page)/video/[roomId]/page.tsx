"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

const VideoCall = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  
  const [user, setUser] = useState<any>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  
  // Admin/Interviewer emotional analytics states
  const [emotionData, setEmotionData] = useState<any>(null);
  const [eyeContactData, setEyeContactData] = useState<any>(null);
  const [confidenceData, setConfidenceData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [interviewScore, setInterviewScore] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to home if no user data
      router.push('/');
    }
  }, [router]);

  // Mock emotion detection simulation for admin users
  const startEmotionDetection = useCallback(() => {
    if (!user || user.role !== 'host') return;
    
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
  }, [user]);

  // Stop emotion detection
  const stopEmotionDetection = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnalyzing(false);
    setEmotionData(null);
    setEyeContactData(null);
    setConfidenceData(null);
    setInterviewScore(0);
  }, []);

  // Get emotion color
  const getEmotionColor = (value: number, type: string) => {
    if (type === 'positive') {
      return value > 0.7 ? 'text-green-400' : value > 0.4 ? 'text-yellow-400' : 'text-red-400';
    } else {
      return value > 0.7 ? 'text-red-400' : value > 0.4 ? 'text-yellow-400' : 'text-green-400';
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Initialize media stream
  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Failed to access camera and microphone');
    }
  };

  useEffect(() => {
    if (!user) return;

    initializeMedia();

    // Start emotion detection for admin users
    if (user.role === 'host') {
      startEmotionDetection();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      stopEmotionDetection();
    };
  }, [user, startEmotionDetection, stopEmotionDetection]);

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track with screen share track
        if (localStream && localVideoRef.current) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
            localStream.removeTrack(videoTrack);
            localStream.addTrack(screenStream.getVideoTracks()[0]);
            localVideoRef.current.srcObject = localStream;
          }
        }
        
        setIsScreenSharing(true);
        
        // Stop screen sharing when user stops it
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          // Restore camera
          initializeMedia();
        };
      } else {
        // Stop screen sharing and restore camera
        setIsScreenSharing(false);
        initializeMedia();
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
      alert('Failed to share screen');
    }
  };

  // Leave call
  const leaveCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    localStorage.removeItem('user');
    router.push('/');
  };

  // Copy meeting link
  const copyMeetingLink = () => {
    const meetingLink = `${window.location.origin}/video/${roomId}`;
    navigator.clipboard.writeText(meetingLink);
    alert('Meeting link copied to clipboard!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {/* Remote Video (Main) */}
          <div className="h-full relative bg-gray-800">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Room Info */}
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm font-medium">Room: {roomId}</p>
              <p className="text-xs text-gray-300">
                {user.name} ({user.role === 'host' ? 'Interviewer' : 'Candidate'})
              </p>
              <p className="text-xs text-gray-300">
                {isConnected ? 'Connected' : 'Waiting for others...'}
              </p>
              {user.role === 'host' && (
                <p className="text-xs text-emerald-400 font-medium">
                  {isAnalyzing ? 'Analytics Active' : 'Analytics Inactive'}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-center gap-2">
                {/* Video Toggle */}
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full text-sm font-medium transition ${
                    isVideoOn 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                  title={isVideoOn ? 'Turn off video' : 'Turn on video'}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isVideoOn ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    )}
                  </svg>
                </button>
                
                {/* Audio Toggle */}
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full text-sm font-medium transition ${
                    isAudioOn 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                  title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isAudioOn ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    )}
                  </svg>
                </button>
                
                {/* Screen Share Toggle */}
                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full text-sm font-medium transition ${
                    isScreenSharing 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  title={isScreenSharing ? 'Stop screen sharing' : 'Share screen'}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                
                {/* Copy Link */}
                <button
                  onClick={copyMeetingLink}
                  className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition"
                  title="Copy meeting link"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                
                {/* Analytics Toggle - Admin Only */}
                {user.role === 'host' && (
                  <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className={`p-3 rounded-full text-sm font-medium transition ${
                      showAnalytics 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    title={showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                )}
                
                {/* End Call */}
                <button
                  onClick={leaveCall}
                  className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                  title="End call"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-1c0-8.284-6.716-15-15-15H5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="flex">
          {/* Participants Sidebar */}
          <div className="w-80 bg-gray-800 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Participants ({participants.length + 1})</h3>
            
            {/* Current User */}
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">You ({user.role === 'host' ? 'Interviewer' : 'Candidate'})</p>
              </div>
              <div className="flex gap-1">
                {isVideoOn && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
                {isAudioOn && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>
            
            {/* Other Participants */}
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg mb-2">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {participant.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{participant.name}</p>
                  <p className="text-xs text-gray-400">{participant.role}</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))}
            
            {participants.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-sm">Waiting for others to join...</p>
                <p className="text-xs mt-2">Share this link to invite participants</p>
              </div>
            )}
          </div>

          {/* Emotional Analytics Panel - Admin Only */}
          {user.role === 'host' && showAnalytics && (
            <div className="w-96 bg-gray-800 p-4 overflow-y-auto border-l border-gray-700">
              <div className="space-y-4">
                {/* Analytics Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Emotional Analytics</h3>
                  <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                </div>

                {/* Interview Score */}
                {interviewScore > 0 && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-2 text-purple-400">Interview Score</h4>
                    <div className={`text-2xl font-bold ${getScoreColor(interviewScore)}`}>
                      {interviewScore}/100
                    </div>
                    <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-purple-400 transition-all duration-300"
                        style={{ width: `${interviewScore}%` }}
                      />
                    </div>
                  </div>
                )}

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
                      {isAnalyzing ? 'Tracking facial expressions, eye contact, and confidence levels...' : 'Waiting for participant...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
