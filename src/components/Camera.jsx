import React, { useRef, useEffect, useState } from 'react';

const Camera = ({ onCapture, isActive }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); 
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive, facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    if (onCapture) {
      onCapture(imageData);
    }

    return imageData;
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-3xl shadow-2xl">
      {/* Camera Body Frame */}
      <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-inner">
        
        {/* Left Side Buttons */}
        <div className="absolute left-2 top-1/4 space-y-3 z-10">
          <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400 font-mono shadow-md">MENU</div>
          <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-gray-600 transition-colors">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-gray-600 transition-colors">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </button>
          <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400 font-mono shadow-md">OK</div>
        </div>

        {/* Right Side Controls */}
        <div className="absolute right-2 top-1/4 space-y-3 z-10">
          <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400 font-mono shadow-md">L</div>
          <div className="w-14 h-14 bg-gray-800 rounded-full shadow-lg border-4 border-gray-700"></div>
          <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-gray-600 transition-colors">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </button>
          <button className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center shadow-md hover:bg-gray-600 transition-colors">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Camera Screen/Viewfinder */}
        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-gray-700">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-white text-lg font-medium mb-2">Camera Access Error</p>
                <p className="text-gray-300 text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* DSLR-style viewfinder frame overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Rounded corner brackets - top left */}
            <div className="absolute top-4 left-4 w-16 h-16">
              <svg className="w-full h-full text-cyan-400/60" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M 16 0 Q 0 0 0 16" />
              </svg>
            </div>
            {/* Rounded corner brackets - top right */}
            <div className="absolute top-4 right-4 w-16 h-16">
              <svg className="w-full h-full text-cyan-400/60" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M 0 0 Q 16 0 16 16" />
              </svg>
            </div>
            {/* Rounded corner brackets - bottom left */}
            <div className="absolute bottom-4 left-4 w-16 h-16">
              <svg className="w-full h-full text-cyan-400/60" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M 0 0 Q 0 16 16 16" />
              </svg>
            </div>
            {/* Rounded corner brackets - bottom right */}
            <div className="absolute bottom-4 right-4 w-16 h-16">
              <svg className="w-full h-full text-cyan-400/60" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M 16 0 Q 16 16 0 16" />
              </svg>
            </div>

            {/* Focus grid - rule of thirds */}
            <div className="absolute inset-8 grid grid-cols-3 grid-rows-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-indigo-300/20"></div>
              ))}
            </div>

            {/* Center focus point */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 border-2 border-cyan-400/80 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
              </div>
            </div>

            {/* Top info bar */}
            <div className="absolute top-0 left-0 right-0 px-6 py-3 bg-gradient-to-b from-black/70 via-black/40 to-transparent">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-4">
                  <span className="text-cyan-400 font-semibold">WhisperLens AI</span>
                  <span className="text-indigo-300">AUTO</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-violet-300">ISO 400</span>
                  <span className="text-indigo-300">1/125</span>
                  <span className="text-cyan-300">F4.0</span>
                </div>
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-400 font-semibold">LIVE</span>
                </div>
                <div className="text-indigo-300">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Control buttons overlay */}
          <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center space-x-8 pointer-events-auto">
            {/* Switch camera button */}
            <button
              onClick={toggleCamera}
              className="group relative p-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-600/20 backdrop-blur-md border border-indigo-400/30 hover:border-cyan-400/50 transition-all shadow-lg hover:shadow-cyan-400/20"
              title="Switch Camera"
            >
              <svg className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Capture button - DSLR style */}
            <button
              onClick={captureImage}
              className="relative group"
              title="Capture Image"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-600 p-1 shadow-2xl group-hover:scale-110 transition-transform">
                <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white to-cyan-100 shadow-inner"></div>
                </div>
              </div>
            </button>

            {/* Info button */}
            <button
              className="group relative p-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-600/20 backdrop-blur-md border border-indigo-400/30 hover:border-cyan-400/50 transition-all shadow-lg hover:shadow-cyan-400/20"
              title="Camera Info"
            >
              <svg className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Side control indicators */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-4 pointer-events-none">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-600/20 backdrop-blur-md border border-indigo-400/30">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-600/20 backdrop-blur-md border border-indigo-400/30">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
            </>
          )}

          {/* Hidden canvas for capturing images */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        {/* Bottom Camera Body Label */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm font-mono">
          Nikon
        </div>
      </div>
    </div>
  );
};

export default Camera;
