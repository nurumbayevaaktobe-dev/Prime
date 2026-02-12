# AI Backend for WebRTC Classroom App

Python Flask backend providing AI-powered features using Google Gemini.

## Features

1. **Real-time Activity Detection** - Analyzes student screens every 5 seconds
2. **AI Lesson Summaries** - Generates comprehensive lesson reports

## Setup

### 1. Install Dependencies

```bash
cd ai-backend
pip install -r requirements.txt
```

### 2. Configure API Key

1. Get your Gemini API key from: https://makersuite.google.com/app/apikey
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Run the Server

```bash
python server.py
```

The server will start on `http://localhost:5000`

## Demo Mode

If `GEMINI_API_KEY` is not set, the server runs in demo mode with mock responses.

## API Endpoints

### POST /api/analyze-activity
Analyzes a screen capture and returns activity label.

**Request:**
```json
{
  "image": "base64_encoded_image",
  "studentId": "student_123"
}
```

**Response:**
```json
{
  "activity": "Coding Python",
  "studentId": "student_123",
  "timestamp": 1234567890.123
}
```

### POST /api/generate-summary
Generates a lesson summary report.

**Request:**
```json
{
  "duration": 45,
  "totalStudents": 25,
  "date": "2024-02-12",
  "students": [...]
}
```

**Response:**
```json
{
  "report": "## Overall Performance\n...",
  "stats": {
    "avgEngagement": 82.5,
    "totalStudents": 25,
    "duration": 45
  }
}
```

## Rate Limiting

- Maximum 15 requests per minute to prevent API quota exhaustion
- Automatically managed by the server
