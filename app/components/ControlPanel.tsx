"use client";

import { useState } from "react";
import { Video, Mic, MicOff, VideoOff, Phone, Settings, Volume2, VolumeX } from "lucide-react";

interface ControlPanelProps {
  isVideoOn: boolean;
  isMicOn: boolean;
  isVolumeOn: boolean;
  onToggleVideo: () => void;
  onToggleMic: () => void;
  onToggleVolume: () => void;
  onEndCall: () => void;
  onShowSettings: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isVideoOn,
  isMicOn,
  isVolumeOn,
  onToggleVideo,
  onToggleMic,
  onToggleVolume,
  onEndCall,
  onShowSettings,
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Mic Toggle */}
      <button
        onClick={onToggleMic}
        className={`p-4 rounded-full transition-all transform hover:scale-110 ${
          isMicOn 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        title={isMicOn ? "Turn off microphone" : "Turn on microphone"}
      >
        {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </button>

      {/* Volume Toggle */}
      <button
        onClick={onToggleVolume}
        className={`p-4 rounded-full transition-all transform hover:scale-110 ${
          isVolumeOn 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        title={isVolumeOn ? "Mute speakers" : "Unmute speakers"}
      >
        {isVolumeOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>

      {/* Video Toggle */}
      <button
        onClick={onToggleVideo}
        className={`p-4 rounded-full transition-all transform hover:scale-110 ${
          isVideoOn 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        title={isVideoOn ? "Turn off camera" : "Turn on camera"}
      >
        {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </button>

      {/* End Call */}
      <button
        onClick={onEndCall}
        className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all transform hover:scale-110 hover:shadow-lg"
        title="End call"
      >
        <Phone className="h-5 w-5 transform rotate-135" />
      </button>

      {/* Settings */}
      <button
        onClick={onShowSettings}
        className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all transform hover:scale-110"
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
};
