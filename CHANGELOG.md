# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-02-12

### Added - AI-Powered Classroom Features

#### Feature 1: Real-Time AI Activity Detection
- Created `useActivityDetection` custom React hook for AI-powered screen analysis
- Added `ActivityBadge` component with color-coded activity labels
- Modified `StreamPlayer.tsx` to use native video element with ref support
- Integrated activity detection into `StreamContainer.tsx` for screen shares
- Implemented 5-second interval analysis with error handling and rate limiting

**Files Added:**
- `client/src/hooks/useActivityDetection.ts`
- `client/src/components/ActivityBadge.tsx`

**Files Modified:**
- `client/src/module/main-view/component/stream-player/StreamPlayer.tsx`
- `client/src/module/main-view/component/main-view/StreamContainer.tsx`

#### Feature 2: One-Click AI Summary Reports
- Created `SummaryButton` component as floating action button
- Added `SummaryModal` component for displaying reports
- Implemented AI-powered report generation with engagement statistics
- Added copy-to-clipboard functionality for reports

**Files Added:**
- `client/src/components/SummaryButton.tsx`
- `client/src/components/SummaryModal.tsx`

#### Feature 3: Quick Actions Panel
- Created collapsible `QuickActionsPanel` component
- Implemented grid layout controls (2×2, 3×3, 4×4, 5×5)
- Added off-task student filter
- Implemented live statistics dashboard
- Added snapshot functionality (demo mode)

**Files Added:**
- `client/src/components/QuickActionsPanel.tsx`

#### AI Backend Infrastructure
- Created Python Flask backend for AI features
- Implemented `/api/analyze-activity` endpoint using Google Gemini Vision
- Implemented `/api/generate-summary` endpoint for lesson reports
- Added rate limiting (15 requests/minute)
- Implemented demo mode for operation without API key
- Added comprehensive error handling and logging

**Files Added:**
- `ai-backend/server.py`
- `ai-backend/requirements.txt`
- `ai-backend/.env.example`
- `ai-backend/.gitignore`
- `ai-backend/README.md`

#### Integration & UI Updates
- Integrated all three features into `MainViewContent.tsx`
- Added session data collection and management
- Implemented state management for grid size and filters
- Enhanced UI with Chakra UI components

**Files Modified:**
- `client/src/module/main-view/component/main-view/MainViewContent.tsx`

#### Documentation
- Updated main `README.md` with AI features overview
- Created comprehensive `FEATURES.md` documentation
- Created detailed `SETUP_GUIDE.md` with troubleshooting
- Added API documentation in `ai-backend/README.md`

**Files Added:**
- `FEATURES.md`
- `SETUP_GUIDE.md`
- `CHANGELOG.md`

**Files Modified:**
- `README.md`

### Technical Details

#### Technology Stack Additions
- **Frontend**: Added custom React hooks, new Chakra UI components
- **Backend**: Flask, Google Generative AI SDK, PIL/Pillow, python-dotenv
- **APIs**: Google Gemini 1.5 Flash Vision API

#### Architecture Changes
- Moved from ReactPlayer to native HTML5 video element for better control
- Added separate Python backend server (port 5000)
- Implemented cross-origin resource sharing (CORS) for API communication
- Added environment variable configuration for API keys

#### Performance Optimizations
- Image compression (JPEG quality 0.3) for faster API calls
- Canvas resizing to 640×360 for reduced bandwidth
- Request rate limiting to prevent quota exhaustion
- Concurrent request prevention in activity detection

#### Security Enhancements
- Environment variable protection for API keys
- `.gitignore` entries for sensitive files
- Rate limiting on API endpoints
- Demo mode for testing without API access

### Breaking Changes
- None (all changes are additive)

### Migration Guide
No migration needed for existing installations. Simply:
1. Install Python dependencies in `ai-backend/`
2. Configure `GEMINI_API_KEY` in `ai-backend/.env` (or run in demo mode)
3. Start the AI backend server alongside existing servers
4. All existing functionality remains unchanged

### Dependencies Added

#### Frontend (client/)
- No new npm dependencies (uses existing Chakra UI)

#### Backend (ai-backend/)
- flask==3.0.0
- flask-cors==4.0.0
- google-generativeai==0.3.2
- pillow==10.2.0
- python-dotenv==1.0.0

### Known Issues
- Activity detection requires screen share (not webcam)
- Rate limiting may affect classrooms with >15 students
- Gemini API requires internet connection (no offline mode)

### Future Enhancements
- Persistent activity history storage
- Real-time alerts for off-task behavior
- Weekly/monthly engagement reports
- Multi-language support
- Mobile app for teachers
- LMS integration (Canvas, Blackboard, etc.)

### Contributors
- AI features implemented by Claude
- Original WebRTC app by Abhinay Raj

---

## [1.0.0] - Previous

### Original Features
- Multi-peer WebRTC connections
- Multi-webcam support
- Multi-screen share
- RTC DataChannel for chat
- Socket.IO signaling
- Session management (leave/end)

---

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

For feature descriptions, see [FEATURES.md](./FEATURES.md)
