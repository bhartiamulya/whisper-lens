import React, { useState, useEffect } from 'react';
import Camera from './components/Camera';
import ResultDisplay from './components/ResultDisplay';
import ApiKeyModal from './components/ApiKeyModal';
import HistoryPanel from './components/HistoryPanel';
import geminiService from './services/geminiService';
import speechService from './services/speechService';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    
    const envApiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const savedApiKey = localStorage.getItem('gemini_api_key');
    const savedHistory = localStorage.getItem('whisperlens_history');
    
    
    const keyToUse = envApiKey || savedApiKey;
    
    if (keyToUse) {
      setApiKey(keyToUse);
      try {
        geminiService.initialize(keyToUse);
        
        if (envApiKey && !savedApiKey) {
          localStorage.setItem('gemini_api_key', envApiKey);
        }
      } catch (err) {
        console.error('Error initializing Gemini service:', err);
        setShowApiKeyModal(true);
      }
    } else {
      setShowApiKeyModal(true);
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Error loading history:', err);
      }
    }
  }, []);

  
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('whisperlens_history', JSON.stringify(history));
    }
  }, [history]);

  const handleApiKeySubmit = (key) => {
    try {
      geminiService.initialize(key);
      setApiKey(key);
      localStorage.setItem('gemini_api_key', key);
      setShowApiKeyModal(false);
      setIsCameraActive(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCapture = async (imageData) => {
    setCapturedImage(imageData);
    setIsLoading(true);
    setError(null);
    speechService.stop();
    setIsSpeaking(false);

    try {
      const analysisResult = await geminiService.analyzeImage(imageData);
      setResult(analysisResult);
      
      
      const historyItem = {
        image: imageData,
        result: analysisResult,
        timestamp: Date.now()
      };
      setHistory(prev => [historyItem, ...prev].slice(0, 20)); 
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else if (result) {
      const textToSpeak = `${result.name}. ${result.description} ${result.usage} ${result.funFact}`;
      speechService.speak(textToSpeak, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  const handleHistorySelect = (item) => {
    setCapturedImage(item.image);
    setResult(item.result);
    speechService.stop();
    setIsSpeaking(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('whisperlens_history');
    setShowHistory(false);
  };

  const handleResetApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setShowApiKeyModal(true);
    setShowSettings(false);
    setIsCameraActive(false);
  };

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    if (isCameraActive) {
      speechService.stop();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{
      backgroundImage: 'url(/background.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      filter: 'contrast(1.1) brightness(1.1)'
    }}>
      {/* Header */}
      <header className="w-full max-w-4xl mb-6">
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white text-shadow">WhisperLens</h1>
                <p className="text-xs text-white/80">The Object Interpreter</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHistory(true)}
                className="p-2 glass-effect hover:bg-white/20 rounded-xl transition-all"
                title="View History"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <button
                onClick={toggleCamera}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg ${
                  isCameraActive
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-orange-800 to-red-900 hover:from-orange-900 hover:to-red-950 text-white'
                }`}
              >
                {isCameraActive ? 'Stop Camera' : 'Start Camera'}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Section */}
          <div className="h-[500px] lg:h-[600px]">
            {isCameraActive ? (
              <Camera onCapture={handleCapture} isActive={isCameraActive} />
            ) : (
              <div className="h-full bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center justify-center p-8 border border-orange-300/30">
                <div className="text-center">
                  <svg className="w-24 h-24 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">Camera Inactive</h3>
                  <p className="text-gray-200 mb-6">Click "Start Camera" to begin exploring</p>
                  <button
                    onClick={toggleCamera}
                    className="px-6 py-3 bg-gradient-to-r from-orange-800 to-red-900 hover:from-orange-900 hover:to-red-950 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Activate Camera
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="h-[500px] lg:h-[600px] bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-orange-300/30">
            {error ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Oops! Something went wrong</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <ResultDisplay
                result={result}
                isLoading={isLoading}
                capturedImage={capturedImage}
                onSpeak={handleSpeak}
                isSpeaking={isSpeaking}
              />
            )}
          </div>
        </div>

      </main>

      {/* Modals */}
      {showApiKeyModal && (
        <ApiKeyModal
          onSubmit={handleApiKeySubmit}
          onClose={() => setShowApiKeyModal(false)}
        />
      )}

      {showHistory && (
        <HistoryPanel
          history={history}
          onSelect={handleHistorySelect}
          onClear={handleClearHistory}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default App;
