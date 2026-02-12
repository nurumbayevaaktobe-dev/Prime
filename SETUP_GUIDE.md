# 🚀 Setup Guide - AI-Powered WebRTC Classroom

Complete setup instructions for running the application with all AI features.

---

## 📋 Prerequisites

### Required Software
- **Node.js** v16+ and npm
- **Python** 3.9+
- **Git**
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### Required API Keys
- **Google Gemini API Key** (free tier available)
  - Get it from: https://makersuite.google.com/app/apikey
  - Free tier includes: 60 requests/minute

---

## 🏗️ Project Structure

```
Prime/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # NEW: AI feature components
│   │   │   ├── ActivityBadge.tsx
│   │   │   ├── SummaryButton.tsx
│   │   │   ├── SummaryModal.tsx
│   │   │   └── QuickActionsPanel.tsx
│   │   ├── hooks/               # NEW: Custom hooks
│   │   │   └── useActivityDetection.ts
│   │   └── module/              # Existing WebRTC components
│   └── package.json
│
├── server/                      # Node.js WebRTC signaling server
│   ├── src/
│   └── package.json
│
└── ai-backend/                  # NEW: Python AI backend
    ├── server.py
    ├── requirements.txt
    ├── .env.example
    └── README.md
```

---

## ⚡ Quick Start (5 minutes)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/abrajByte/React-WebRTC-MultiCamScreenShare.git
cd React-WebRTC-MultiCamScreenShare

# Or if already cloned
cd /path/to/Prime

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..

# Install AI backend dependencies
cd ai-backend
pip install -r requirements.txt
cd ..
```

### Step 2: Configure AI Backend

```bash
cd ai-backend

# Copy environment template
cp .env.example .env

# Edit .env and add your Gemini API key
# For demo mode (no API key required), skip this step
nano .env  # or use your preferred editor
```

Add to `.env`:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Step 3: Start All Services

You'll need **3 terminal windows**:

#### Terminal 1: WebRTC Signaling Server
```bash
cd server
npm run dev
```
Expected output: `Server running on port 8080`

#### Terminal 2: AI Backend
```bash
cd ai-backend
python server.py
```
Expected output:
```
╔══════════════════════════════════════════════════════════╗
║  AI-Powered WebRTC Classroom Backend                    ║
║  Running on http://localhost:5000                        ║
╚══════════════════════════════════════════════════════════╝
✓ Gemini API configured successfully
```

#### Terminal 3: React Client
```bash
cd client
npm start
```
Expected output: `Compiled successfully! App running on http://localhost:3000`

### Step 4: Open in Browser

1. Open **two browser windows** (or different browsers)
2. Navigate to `http://localhost:3000` in both
3. In each window:
   - Enter a name (e.g., "Teacher", "Student 1")
   - Click "Join Room"
   - Allow camera/microphone permissions
   - Click "Share Screen" to enable activity detection

---

## 🧪 Testing the Features

### Test Feature 1: Activity Detection

1. **Setup**:
   - Have at least one user sharing their screen
   - Open a coding editor (VS Code) or YouTube on the shared screen

2. **Expected behavior**:
   - Within 2-5 seconds, an activity badge appears on screen share
   - Badge shows: "Coding [language]" (green) or "Watching YouTube" (red)
   - Badge updates every 5 seconds

3. **Try different activities**:
   - Open VS Code → Should show "Coding Python/JavaScript" (green)
   - Open YouTube → Should show "Watching YouTube" (red)
   - Open documentation → Should show "Reading Documentation" (yellow)

### Test Feature 2: Summary Generation

1. **Setup**:
   - Have session running with at least 1-2 users
   - Let it run for a few minutes to gather activity data

2. **Generate summary**:
   - Click the "Generate AI Summary" button (bottom-right)
   - Wait 5-10 seconds
   - Modal should appear with report

3. **Expected report sections**:
   - Overall Performance
   - Top Performers
   - Students Needing Support
   - Recommendations
   - Stats cards showing engagement percentage

4. **Test clipboard**:
   - Click "Copy to Clipboard"
   - Paste in a text editor
   - Should paste the full markdown report

### Test Feature 3: Quick Actions Panel

1. **Open panel** (top-left corner)
2. **Test grid layouts**:
   - Click 2×2, 3×3, 4×4, 5×5 buttons
   - Grid should resize accordingly

3. **Test filter**:
   - Click "Off-Task Only"
   - Should show only red-badged students (or all if none are red)
   - Click again to show all

4. **Test snapshot**:
   - Click "Take Snapshot"
   - Should show alert with timestamp

5. **Check stats**:
   - Verify live statistics update
   - On-task, neutral, off-task counts

---

## 🔧 Troubleshooting

### AI Backend Issues

#### "GEMINI_API_KEY not set"
- **Solution**: AI backend runs in demo mode
- **Impact**: Activity detection returns "Demo Mode", summary uses template
- **Fix**: Add API key to `ai-backend/.env`

#### "Rate limited" in activity detection
- **Cause**: More than 15 requests/minute
- **Solution**: Reduce number of screen shares or increase interval
- **Edit**: `useActivityDetection.ts` → change `interval` from 5000 to 10000

#### "Failed to generate report"
- **Check**: Is AI backend running on port 5000?
- **Test**: Visit `http://localhost:5000/api/health`
- **Expected**: `{"status": "healthy", "service": "AI Backend"}`

### Frontend Issues

#### Activity badges not appearing
1. **Check console** for errors
2. **Verify** AI backend is running
3. **Ensure** you're sharing screen (not camera)
4. **Wait** 5-7 seconds for first detection

#### "Module not found" errors
```bash
cd client
npm install
```

#### Chakra UI styling issues
- Clear browser cache
- Restart dev server
- Check that `@chakra-ui/react` is installed

### WebRTC Issues

#### Cannot see other participants
- **Check**: Both users in same room
- **Verify**: WebRTC server running on port 8080
- **Network**: Try same WiFi network first

#### Screen share not working
- **Browser**: Use Chrome or Edge (best support)
- **Permissions**: Allow screen share when prompted
- **Restart**: Refresh page and rejoin room

---

## 🌐 Network Configuration

### Development (Local Network)

All services run on localhost:
- **Client**: http://localhost:3000
- **WebRTC Server**: http://localhost:8080
- **AI Backend**: http://localhost:5000

### Production Deployment

For real deployment, you'll need:

1. **HTTPS** (required for WebRTC)
2. **Domain names** or public IPs
3. **CORS configuration** in AI backend
4. **Environment variables** for production URLs

Example production setup:
```bash
# Client .env
REACT_APP_WEBSOCKET_URL=wss://your-domain.com:8080
REACT_APP_AI_BACKEND_URL=https://your-domain.com:5000

# AI Backend server.py
CORS(app, origins=["https://your-domain.com"])
```

---

## 🔐 Security Notes

### API Key Protection
- **Never commit** `.env` files to git
- **Use** environment variables in production
- **Rotate** API keys periodically

### Rate Limiting
- Default: 15 requests/minute
- Adjust in `server.py` as needed
- Monitor usage in Gemini console

### Privacy Considerations
- Screen captures are **not stored**
- Images sent to Gemini API (Google's privacy policy applies)
- For production, consider:
  - User consent forms
  - Data retention policies
  - Compliance with FERPA (US), GDPR (EU)

---

## 📊 Demo Mode vs Production Mode

### Demo Mode (No API Key)
**Pros**:
- ✅ Works immediately, no setup
- ✅ Perfect for UI/UX testing
- ✅ No costs

**Cons**:
- ❌ Activity detection returns "Demo Mode"
- ❌ Summary uses template report
- ❌ Can't showcase real AI

**Use for**: Development, UI testing, demo without internet

### Production Mode (With API Key)
**Pros**:
- ✅ Real AI analysis
- ✅ Accurate activity detection
- ✅ Custom summaries
- ✅ Full feature showcase

**Cons**:
- ❌ Requires API key
- ❌ Rate limits apply
- ❌ Internet required

**Use for**: Hackathon demo, pilot testing, real usage

---

## 🎯 Optimal Demo Setup

### Hardware
- **Computer**: 8GB+ RAM recommended
- **Screen**: 1920×1080 or higher
- **Connection**: Stable WiFi or ethernet

### Browser Setup
1. **Use Chrome** (best WebRTC support)
2. **Disable** browser extensions that might interfere
3. **Close** unnecessary tabs
4. **Allow** all permissions when prompted

### Pre-Demo Checklist
- [ ] All 3 servers running (WebRTC, AI, Client)
- [ ] Gemini API key configured
- [ ] Test with 2 browser windows
- [ ] Screen share enabled
- [ ] Activity badges appearing
- [ ] Grid layout controls working
- [ ] Summary generation tested
- [ ] No console errors

### Demo Script
1. **Start**: Show empty room
2. **Join**: Add "Student 1" and share screen with coding
3. **Detection**: Point out green badge appearing
4. **Join**: Add "Student 2" with YouTube
5. **Comparison**: Show green vs red badges
6. **Panel**: Demonstrate grid layout and filter
7. **Summary**: Click button and show report
8. **Finish**: Explain impact and scalability

---

## 📝 Environment Variables Reference

### Client (.env in client/)
```bash
# Optional - defaults to localhost
REACT_APP_WEBSOCKET_URL=http://localhost:8080
REACT_APP_AI_BACKEND_URL=http://localhost:5000
```

### AI Backend (.env in ai-backend/)
```bash
# Required for production mode
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
FLASK_ENV=development
FLASK_DEBUG=1
PORT=5000
```

---

## 🆘 Getting Help

### Common Commands

```bash
# Check if ports are in use
lsof -i :3000  # Client
lsof -i :5000  # AI Backend
lsof -i :8080  # WebRTC Server

# Kill processes on ports
kill -9 $(lsof -ti:3000)

# Clean install
rm -rf node_modules package-lock.json
npm install

# Python virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Still Having Issues?

1. **Check logs** in all 3 terminal windows
2. **Browser console** (F12) for frontend errors
3. **Network tab** to see API calls
4. **Verify** all dependencies installed
5. **Try** demo mode first (no API key)

---

## 🎓 Learning Resources

### Technologies Used
- **React**: https://react.dev/
- **Chakra UI**: https://chakra-ui.com/
- **WebRTC**: https://webrtc.org/
- **Flask**: https://flask.palletsprojects.com/
- **Google Gemini**: https://ai.google.dev/

### Recommended Reading
- WebRTC Tutorial: https://webrtc.org/getting-started/overview
- Gemini API Docs: https://ai.google.dev/docs
- React Hooks: https://react.dev/reference/react

---

Ready to transform classroom monitoring with AI! 🚀

For issues or questions, check the troubleshooting section or review the code comments.
