"use client";

import { useState } from "react";
import { DummyVideo } from "@/app/components/DummyVideo";
import { EmotionDetector } from "@/app/components/EmotionDetector";
import { EmotionOverlay } from "@/app/components/EmotionOverlay";
import { SmartAnalysisPanel } from "@/app/components/SmartAnalysisPanel";
import { ControlPanel } from "@/app/components/ControlPanel";
import { useRouter } from "next/navigation";

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

export default function TestVideoPage() {
  const router = useRouter();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVolumeOn, setIsVolumeOn] = useState(true);
  const [emotion, setEmotion] = useState<EmotionData | null>(null);
  const [showEmotionOverlay, setShowEmotionOverlay] = useState(true);
  const [showFaceRecognition, setShowFaceRecognition] = useState(true);
  const [isInterviewer, setIsInterviewer] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Mock video element for emotion detector
  const mockVideoElement = document.createElement('video');

  const handleEmotionUpdate = (emotionData: EmotionData) => {
    setEmotion(emotionData);
  };

  const handleEndCall = () => {
    // Navigate back to homepage
    router.push('/');
  };

  const handleShowSettings = () => {
    setShowSettings(!showSettings);
    // In a real app, this would open a settings modal
    alert('Settings panel would open here. For now, this is just a demo.');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          <div className="h-full relative">
            <DummyVideo isVideoOn={isVideoOn} />
              
            {/* AI Emotion Detection Overlay */}
            {isInterviewer && (
              <>
                <EmotionDetector 
                  videoElement={mockVideoElement}
                  onEmotionUpdate={handleEmotionUpdate}
                />
                <EmotionOverlay emotion={emotion} isVisible={showEmotionOverlay} />
                <SmartAnalysisPanel 
                  isVisible={showFaceRecognition}
                  onMetricsUpdate={(metricsData: any) => {
                    console.log('Smart analysis:', metricsData);
                  }}
                />
              </>
            )}

            {/* Room Info */}
            <div className="absolute top-4 left-4 bg-black/60 px-3 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm font-medium">Test Room</p>
              <p className="text-xs text-gray-300">Mode: {isInterviewer ? 'Interviewer' : 'Candidate'}</p>
            </div>

            {/* AI Toggle */}
            {isInterviewer && (
              <div className="absolute top-4 right-4 space-y-2">
                <button
                  onClick={() => setShowEmotionOverlay(!showEmotionOverlay)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition block w-full ${
                    showEmotionOverlay 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {showEmotionOverlay ? 'Hide' : 'Show'} AI
                </button>
                <button
                  onClick={() => setShowFaceRecognition(!showFaceRecognition)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition block w-full ${
                    showFaceRecognition 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {showFaceRecognition ? 'Hide' : 'Show'} Face
                </button>
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <ControlPanel
              isVideoOn={isVideoOn}
              isMicOn={isMicOn}
              isVolumeOn={isVolumeOn}
              onToggleVideo={() => setIsVideoOn(!isVideoOn)}
              onToggleMic={() => setIsMicOn(!isMicOn)}
              onToggleVolume={() => setIsVolumeOn(!isVolumeOn)}
              onEndCall={handleEndCall}
              onShowSettings={handleShowSettings}
            />

            {/* Mode Toggle */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsInterviewer(!isInterviewer)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isInterviewer 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {isInterviewer ? 'Interviewer' : 'Candidate'} Mode
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel - Participants */}
        <div className="w-80 bg-gray-800 p-4 border-l border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Participants</h3>
          
          <div className="space-y-3">
            {/* Self */}
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">You</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Test User</p>
                  <p className="text-xs text-gray-400">
                    {isVideoOn ? 'Camera on' : 'Camera off'} • {isMicOn ? 'Mic on' : 'Mic off'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mock Participants */}
            <div className="bg-gray-700 rounded-lg p-3 opacity-75">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">AI</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">AI Assistant</p>
                  <p className="text-xs text-gray-400">Camera on • Mic on</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Info */}
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Test Features</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Real camera or animated dummy</li>
              <li>• Mock emotion detection</li>
              <li>• Interviewer/Candidate modes</li>
              <li>• AI overlay toggle</li>
              <li>• Smart face detection analysis</li>
              <li>• Audio/Video controls</li>
              <li>• Settings and end call</li>
            </ul>
          </div>

          {/* Status Info */}
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Status</h4>
            <div className="text-xs text-gray-300 space-y-1">
              <p>• Camera: {isVideoOn ? 'Active' : 'Off'}</p>
              <p>• Microphone: {isMicOn ? 'Unmuted' : 'Muted'}</p>
              <p>• Speakers: {isVolumeOn ? 'Unmuted' : 'Muted'}</p>
              <p>• AI Analysis: {showEmotionOverlay ? 'Active' : 'Hidden'}</p>
              <p>• Face Recognition: {showFaceRecognition ? 'Active' : 'Hidden'}</p>
              <p>• Analysis Type: Smart face detection with quality metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
