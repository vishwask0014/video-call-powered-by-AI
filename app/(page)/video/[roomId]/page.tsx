"use client";

import {
  Call,
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/app/stores/user_store";
import { EmotionDetector } from "@/app/components/EmotionDetector";
import { EmotionOverlay } from "@/app/components/EmotionOverlay";

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

const getToken = async (userId: string) => {
  const res = await fetch("/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const data = await res?.json();
  return data.token;
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const { user } = useUserStore();
  
  const [client, setClient] = useState<StreamVideoClient>();
  const [emotion, setEmotion] = useState<EmotionData | null>(null);
  const [showEmotionOverlay, setShowEmotionOverlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/setup-call");
      return;
    }

    const initializeClient = async () => {
      try {
        const token = await getToken(user.id);
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        
        if (!apiKey) {
          throw new Error("API key not found");
        }

        const myClient = new StreamVideoClient({ apiKey, token, user });
        setClient(myClient);

        return () => {
          myClient.disconnectUser();
        };
      } catch (error) {
        console.error("Failed to initialize client:", error);
        router.push("/setup-call");
      }
    };

    initializeClient();
  }, [user, router]);

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Setting up your video call...</p>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <VideoUI 
        roomId={roomId} 
        client={client}
        emotion={emotion}
        setEmotion={setEmotion}
        showEmotionOverlay={showEmotionOverlay}
        setShowEmotionOverlay={setShowEmotionOverlay}
        videoRef={videoRef}
      />
    </StreamVideo>
  );
};

const VideoUI = ({ 
  roomId, 
  client,
  emotion, 
  setEmotion, 
  showEmotionOverlay, 
  setShowEmotionOverlay,
  videoRef 
}: {
  roomId: string;
  client: StreamVideoClient;
  emotion: EmotionData | null;
  setEmotion: (emotion: EmotionData | null) => void;
  showEmotionOverlay: boolean;
  setShowEmotionOverlay: (show: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) => {
  const [call, setCall] = useState<Call | null>(null);
  const [isInterviewer, setIsInterviewer] = useState(false);

  useEffect(() => {
    const myCall = call || client.call("default", roomId);

    if (!call) {
      myCall.join({ create: true }).catch(console.error);
      setCall(myCall);
    }

    // Set interviewer mode (you might want to determine this based on user role)
    setIsInterviewer(true); // For demo purposes

    return () => {
      if (myCall) {
        myCall.leave().catch(console.error);
      }
    };
  }, [roomId, call, client]);

  useEffect(() => {
    // Find the local video element and attach emotion detector
    const interval = setInterval(() => {
      const videos = document.querySelectorAll('video');
      const localVideo = Array.from(videos).find(video => 
        video.srcObject && video.srcObject instanceof MediaStream
      );
      
      if (localVideo && localVideo !== videoRef.current) {
        videoRef.current = localVideo;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!call) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900">
      <StreamCall call={call}>
        <SpeakerLayout participantsBarPosition="left" />
        
        {/* AI Emotion Detection Overlay - only for interviewer */}
        {isInterviewer && (
          <>
            <EmotionDetector 
              videoElement={videoRef.current}
              onEmotionUpdate={setEmotion}
            />
            <EmotionOverlay emotion={emotion} isVisible={showEmotionOverlay} />
          </>
        )}

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
          <CallControls />
          
          {/* Toggle AI Analysis */}
          {isInterviewer && (
            <button
              onClick={() => setShowEmotionOverlay(!showEmotionOverlay)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                showEmotionOverlay 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {showEmotionOverlay ? 'Hide' : 'Show'} AI Analysis
            </button>
          )}
        </div>
        </div>

        {/* Room Info */}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
          <p className="text-sm font-medium">Room: {roomId}</p>
          <p className="text-xs text-gray-300">Interview Mode: {isInterviewer ? 'On' : 'Off'}</p>
        </div>
      </StreamCall>
    </div>
  );
};

export default Page;
