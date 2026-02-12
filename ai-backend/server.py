"""
AI-Powered Backend for WebRTC Classroom App
Provides real-time activity detection and lesson summary generation using Google Gemini
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from PIL import Image
import io
import base64
import os
from functools import lru_cache
import time
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

# Configure Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not set. Please set it in .env file")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')

# Rate limiting: max 15 requests per minute
request_times = []

def check_rate_limit():
    """Simple rate limiter to prevent API quota exhaustion"""
    global request_times
    now = time.time()
    # Remove requests older than 60 seconds
    request_times = [t for t in request_times if now - t < 60]

    if len(request_times) >= 15:
        return False

    request_times.append(now)
    return True


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Backend',
        'timestamp': time.time()
    })


@app.route('/api/analyze-activity', methods=['POST'])
def analyze_activity():
    """
    Analyze student screen activity using Gemini Vision API

    Request body:
    {
        "image": "base64_encoded_image",
        "studentId": "student_identifier"
    }

    Response:
    {
        "activity": "Coding Python",
        "studentId": "student_123",
        "timestamp": 1234567890.123
    }
    """
    try:
        # Rate limit check
        if not check_rate_limit():
            return jsonify({
                'activity': 'Rate limited',
                'studentId': '',
                'error': 'Too many requests'
            }), 429

        data = request.json
        image_b64 = data.get('image')
        student_id = data.get('studentId', 'unknown')

        if not image_b64:
            return jsonify({'error': 'No image provided'}), 400

        if not GEMINI_API_KEY:
            return jsonify({
                'activity': 'Demo Mode',
                'studentId': student_id,
                'timestamp': time.time()
            })

        # Decode image
        image_bytes = base64.b64decode(image_b64)
        img = Image.open(io.BytesIO(image_bytes))

        # AI prompt (optimized for speed and accuracy)
        prompt = """Analyze this student's computer screen.

Output EXACTLY ONE of these labels (nothing else):
- "Coding Python"
- "Coding JavaScript"
- "Coding Java"
- "Reading Documentation"
- "Watching YouTube"
- "Playing Game"
- "Social Media"
- "Working on Task"
- "Idle Screen"

Rules:
- If you see code editor (VS Code, PyCharm, etc): "Coding [language]"
- If you see YouTube player: "Watching YouTube"
- If you see game graphics/Steam: "Playing Game"
- If you see Facebook/Instagram/Discord: "Social Media"
- If you see browser with technical content: "Reading Documentation"
- If working on assignment/project: "Working on Task"
- If screen is mostly blank/desktop: "Idle Screen"

Output ONLY the label, no explanation."""

        # Call Gemini Vision API
        response = model.generate_content([prompt, img])
        activity_label = response.text.strip()

        # Ensure clean response
        activity_label = activity_label.replace('"', '').replace("'", '').strip()

        print(f"[{datetime.now()}] Student {student_id}: {activity_label}")

        return jsonify({
            'activity': activity_label,
            'studentId': student_id,
            'timestamp': time.time()
        })

    except Exception as e:
        print(f"Error in analyze_activity: {str(e)}")
        return jsonify({
            'activity': 'Error',
            'studentId': student_id if 'student_id' in locals() else 'unknown',
            'error': str(e)
        }), 500


@app.route('/api/generate-summary', methods=['POST'])
def generate_summary():
    """
    Generate AI-powered lesson summary report

    Request body:
    {
        "duration": 45,
        "totalStudents": 25,
        "date": "2024-02-12",
        "students": [
            {
                "name": "John Doe",
                "activities": ["Coding Python", "Reading Docs", ...],
                "engagementScore": 85
            }
        ]
    }

    Response:
    {
        "report": "Markdown formatted report...",
        "stats": {
            "avgEngagement": 82.5,
            "totalStudents": 25,
            "duration": 45
        }
    }
    """
    try:
        session_data = request.json

        if not GEMINI_API_KEY:
            # Demo response
            return jsonify({
                'report': demo_report(),
                'stats': {
                    'avgEngagement': 75,
                    'totalStudents': session_data.get('totalStudents', 0),
                    'duration': session_data.get('duration', 0)
                },
                'timestamp': time.time()
            })

        # Build summary for AI
        summary_text = f"""Generate a professional lesson summary report.

SESSION INFORMATION:
- Duration: {session_data.get('duration', 'N/A')} minutes
- Total Students: {session_data.get('totalStudents', 0)}
- Date: {session_data.get('date', datetime.now().strftime('%Y-%m-%d'))}

STUDENT ACTIVITIES:
{format_student_activities(session_data.get('students', []))}

Create a report with these sections:

## 📊 Overall Performance
Write 2-3 sentences about overall class engagement and productivity.

## 🌟 Top Performers (Top 3)
List the 3 most engaged students and why they did well.

## ⚠️ Students Needing Support
List students who were off-task or struggling, with specific recommendations.

## 💡 Recommendations for Next Lesson
Provide 2-3 actionable suggestions for the teacher.

Keep it professional, specific, and under 400 words."""

        response = model.generate_content(summary_text)
        report_content = response.text

        # Calculate stats
        students = session_data.get('students', [])
        total_engagement = sum(s.get('engagementScore', 0) for s in students)
        avg_engagement = total_engagement / len(students) if students else 0

        return jsonify({
            'report': report_content,
            'stats': {
                'avgEngagement': round(avg_engagement, 1),
                'totalStudents': len(students),
                'duration': session_data.get('duration', 0)
            },
            'timestamp': time.time()
        })

    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return jsonify({'error': str(e)}), 500


def format_student_activities(students):
    """Helper to format student data for AI"""
    if not students:
        return "No student data available"

    formatted = []
    for student in students:
        activities = student.get('activities', [])
        on_task = sum(1 for a in activities if 'Coding' in a or 'Working' in a or 'Reading' in a)
        off_task = sum(1 for a in activities if 'YouTube' in a or 'Game' in a or 'Social' in a)

        formatted.append(f"""
Student: {student.get('name', 'Unknown')}
- On-task activities: {on_task}/{len(activities)} ({round(on_task/len(activities)*100) if activities else 0}%)
- Off-task activities: {off_task}/{len(activities)}
- Most common activity: {max(set(activities), key=activities.count) if activities else 'None'}
""")

    return "\n".join(formatted)


def demo_report():
    """Demo report for when API key is not set"""
    return """## 📊 Overall Performance

The class showed strong engagement with 75% of students staying on-task throughout the lesson. Most students worked productively on their coding assignments with minimal distractions.

## 🌟 Top Performers (Top 3)

1. **Sarah Johnson** - Maintained focus on Python coding for 90% of the session
2. **Mike Chen** - Consistently reading documentation and implementing features
3. **Emily Davis** - Strong engagement with minimal off-task behavior

## ⚠️ Students Needing Support

- **Alex Brown** - Frequently distracted by YouTube videos. Recommend closer monitoring.
- **David Kim** - Spent significant time on social media. May benefit from one-on-one check-in.

## 💡 Recommendations for Next Lesson

1. Consider implementing 10-minute focused work blocks with short breaks
2. Provide more structured guidance for students struggling with task focus
3. Recognize top performers to encourage continued engagement

---
*This is a demo report. Set GEMINI_API_KEY for AI-generated summaries.*
"""


if __name__ == '__main__':
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║  AI-Powered WebRTC Classroom Backend                    ║
    ║  Running on http://localhost:5000                        ║
    ╚══════════════════════════════════════════════════════════╝
    """)

    if not GEMINI_API_KEY:
        print("⚠️  WARNING: GEMINI_API_KEY not set!")
        print("   Demo mode enabled. Set GEMINI_API_KEY in .env for full functionality.\n")
    else:
        print("✓ Gemini API configured successfully\n")

    app.run(host='0.0.0.0', port=5000, debug=True)
