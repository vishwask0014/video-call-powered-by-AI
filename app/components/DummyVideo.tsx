"use client";

import { useEffect, useRef, useState } from "react";

export const DummyVideo: React.FC<{ isVideoOn: boolean }> = ({ isVideoOn }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string>("");
  const animationRef = useRef<number | undefined>();

  useEffect(() => {
    if (!isVideoOn) {
      // Stop video when turned off
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsPlaying(false);
      return;
    }

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsPlaying(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Unable to access camera. Using placeholder video.");
        // Create a canvas-based dummy video as fallback
        createDummyVideo();
      }
    };

    startVideo();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVideoOn]);

  const createDummyVideo = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Create animated dummy video
    let frame = 0;
    const animate = () => {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw animated face placeholder
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Face circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI);
      ctx.fillStyle = '#f4d1ae';
      ctx.fill();
      
      // Eyes
      const eyeOffset = Math.sin(frame * 0.05) * 5;
      ctx.beginPath();
      ctx.arc(centerX - 30, centerY - 20 + eyeOffset, 10, 0, 2 * Math.PI);
      ctx.arc(centerX + 30, centerY - 20 + eyeOffset, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#333';
      ctx.fill();
      
      // Mouth
      ctx.beginPath();
      ctx.arc(centerX, centerY + 20, 30, 0, Math.PI);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Text
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Demo Video', centerX, canvas.height - 50);
      
      frame++;
      
      // Convert canvas to video stream
      canvas.toBlob((blob) => {
        if (blob && videoRef.current) {
          const url = URL.createObjectURL(blob);
          videoRef.current.src = url;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    setIsPlaying(true);
  };

  if (!isVideoOn) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-400">Camera is off</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Initializing video...</p>
          </div>
        </div>
      )}
      
      {/* Video overlay info */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
        <p className="text-sm font-medium">Test Video</p>
        <p className="text-xs text-gray-300">Camera Feed</p>
      </div>
    </div>
  );
};
