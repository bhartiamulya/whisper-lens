import React from 'react';

const ResultDisplay = ({ result, isLoading, capturedImage, onSpeak, isSpeaking }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">Analyzing your image...</p>
        <p className="mt-2 text-sm text-gray-500">WhisperLens is interpreting what it sees</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Explore</h3>
        <p className="text-gray-500 max-w-md">
          Point your camera at any object and capture it. WhisperLens will tell you what it is, 
          how it's used, and share an interesting fact!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}

      {/* Object Name */}
      {result.name && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{result.name}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
        </div>
      )}

      {/* What It Is Section */}
      {result.description && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">What It Is</h3>
              <p className="text-blue-800 leading-relaxed">{result.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* How It's Used Section */}
      {result.usage && (
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">How It's Used</h3>
              <p className="text-green-800 leading-relaxed">{result.usage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Fun Fact Section */}
      {result.funFact && (
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Fun Fact</h3>
              <p className="text-purple-800 leading-relaxed">{result.funFact}</p>
            </div>
          </div>
        </div>
      )}

      {/* Voice Control Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onSpeak}
          className={`flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
            isSpeaking 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
          }`}
        >
          {isSpeaking ? (
            <>
              <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              <span>Stop Speaking</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span>Read Aloud</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
