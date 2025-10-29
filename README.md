# 🔍 WhisperLens - The Object Interpreter for the Visually Curious

An AI-powered web application that goes beyond object recognition - it **interprets** what you see. Point your camera at any object, and WhisperLens will explain what it is, how it's used, and share an interesting fact about it.

##  Features

###  Core Capabilities
- **Visual Understanding**: Powered by Google Gemini 1.5 Flash for accurate object recognition
- **Educational Narration**: Get detailed explanations about objects, not just labels
- **Voice Output**: Natural text-to-speech narration using Web Speech API
- **Live Camera Feed**: Real-time camera access with front/back camera switching
- **History Tracking**: Review previously analyzed objects

## 🎯 How to Use

1. **Start the Camera**: Click the "Start Camera" button in the header
2. **Position Your Object**: Point your camera at any object you're curious about
3. **Capture**: Click the large white capture button at the bottom of the camera view
4. **Learn**: Read or listen to the AI-generated explanation
5. **Explore More**: Check your history or capture more objects!

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0**: Modern UI library
- **Tailwind CSS 3.4.0**: Utility-first CSS framework
- **Custom Components**: Modular, reusable architecture

### AI & APIs
- **Google Gemini 1.5 Flash**: Visual understanding and text generation
- **Web Speech API**: Text-to-speech narration
- **getUserMedia API**: Camera access

### State Management
- React Hooks (useState, useEffect)
- LocalStorage for persistence

##  Project Structure

```
WhisperLens/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Camera.jsx          # Camera capture component
│   │   ├── ResultDisplay.jsx   # Results display component
│   │   ├── ApiKeyModal.jsx     # API key input modal
│   │   └── HistoryPanel.jsx    # History viewer component
│   ├── services/
│   │   ├── geminiService.js    # Gemini API integration
│   │   └── speechService.js    # Text-to-speech service
│   ├── App.js                  # Main application component
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                   
```
