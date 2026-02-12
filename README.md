# 🎓 AI-Powered WebRTC Classroom App

Multi-peer connections with React WebRTC, featuring multiple webcams and screen sharing capabilities, along with chat functionalities, session leave and end options using RTC DataChannel.

## ✨ NEW: AI-Powered Features

This enhanced version adds three powerful AI features for classroom monitoring:

1. **🤖 Real-Time Activity Detection** - AI analyzes student screens every 5 seconds
2. **📊 One-Click AI Summaries** - Generate comprehensive lesson reports instantly
3. **🎛️ Quick Actions Panel** - Teacher controls for grid layout, filters, and stats

[**Original Demo Video**](https://www.youtube.com/watch?v=xUCPFq0HKDI)

[![Watch the video](https://img.youtube.com/vi/xUCPFq0HKDI/maxresdefault.jpg)](https://www.youtube.com/watch?v=xUCPFq0HKDI)

## Overview

This project is a React application built with TypeScript that utilizes WebRTC technology for establishing multi-peer connections. It includes features for multi-webcam streaming and multi-screen sharing using WebRTC for real-time communication.

### Key Features

#### Original Features
- **Multi-Peer Connection**: Establish direct peer-to-peer connections between multiple clients
- **Multi-Webcam Support**: Stream video from multiple webcams simultaneously
- **Multi-Screen Share**: Share screens from multiple clients in real-time
- **RTC-Datachannel**: Employs RTC DataChannel for messaging and real-time signaling
- **Signaling**: Socket.IO for sending offers and answers

#### NEW: AI-Powered Classroom Features
- **🤖 Real-Time Activity Detection**
  - AI analyzes student screens every 5 seconds
  - Color-coded badges: 🟢 On-task, 🟡 Neutral, 🔴 Off-task
  - Powered by Google Gemini Vision API
  - Automatic detection of: coding, YouTube, games, documentation, etc.

- **📊 AI Lesson Summary**
  - One-click comprehensive lesson reports
  - Identifies top performers and students needing support
  - Provides actionable recommendations
  - Calculates engagement statistics

- **🎛️ Quick Actions Panel**
  - Grid layout control (2×2, 3×3, 4×4, 5×5)
  - Filter by off-task students
  - Live statistics dashboard
  - Snapshot functionality

## Installation

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v16.x or higher)
- npm (v6.x or higher) or yarn (v1.x or higher)
- **Python 3.9+** (for AI features)
- **Gemini API Key** (optional - runs in demo mode without it)
- Git

### Clone the Repository

```bash
git clone https://github.com/justpingme/React-WebRTC-MultiCamScreenShare.git
cd React-WebRTC-MultiCamScreenShare
```

#### Navigate to client directory and Install client-side dependencies
```bash
cd client
npm install 
```

Open New terminal
#### Navigate to server directory and Install server-side dependencies
```bash
cd server
npm install
```

Getting Started

You'll need **3 terminal windows** to run all services:

#### Terminal 1: WebRTC Signaling Server
```bash
cd server
npm run dev
```

#### Terminal 2: AI Backend (NEW)
```bash
cd ai-backend
# Install dependencies (first time only)
pip install -r requirements.txt

# Configure API key (optional - runs in demo mode without it)
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_key_here

# Start server
python server.py
```

#### Terminal 3: React Client
```bash
cd client
npm start
```

Open `http://localhost:3000` in your browser.

## 📚 Documentation

- **[FEATURES.md](./FEATURES.md)** - Detailed feature descriptions and technical architecture
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup and troubleshooting guide
- **[ai-backend/README.md](./ai-backend/README.md)** - AI backend API documentation

## 🎯 Quick Demo

1. Open two browser windows at `http://localhost:3000`
2. Join with different names in each window
3. Share your screen in at least one window
4. Watch the AI activity badges appear on screen shares
5. Click "Generate AI Summary" button (bottom-right)
6. Use Quick Actions panel (top-left) to adjust layout


Feel free to customize this template further based on your specific project details, branding, or additional features you may want to highlight. Adjust the folder structure section to accurately reflect your project's organization.


Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests to propose improvements or additional features.

License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🛠️ Tech Stack

### Frontend
- **React** + TypeScript
- **Chakra UI** for components
- **WebRTC** for video streaming
- Custom hooks for AI integration

### Backend
- **Node.js** + Socket.IO for WebRTC signaling
- **Python** + Flask for AI features
- **Google Gemini Vision API** for activity detection

## 🎓 Use Cases

- **K-12 Classrooms**: Monitor student focus during computer labs
- **Online Education**: Track engagement in virtual classrooms
- **Corporate Training**: Measure participation in remote training sessions
- **Tutoring**: One-on-one or small group monitoring

## 🔒 Privacy & Security

- Screen captures are **not stored** on servers
- Images sent to Google Gemini API (subject to Google's privacy policy)
- For production use, implement:
  - User consent forms
  - FERPA/GDPR compliance
  - Data retention policies

## Acknowledgements

- **WebRTC**: Real-time communication protocol for peer-to-peer applications
- **React**: JavaScript library for building user interfaces
- **Socket.IO**: Real-time bidirectional event-based communication library
- **Google Gemini**: AI model for vision and text generation
- **Chakra UI**: Component library for React


## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


