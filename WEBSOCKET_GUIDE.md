# 🔌 WebSocket Testing Guide

Complete guide for testing WebSocket connections with the Quiz Platform.

## ⚠️ Important: Check Your Port!

Your server is running on **port 4000** (check `.env` file).

**Correct WebSocket URL:** `ws://localhost:4000`  
**Wrong:** ~~`ws://localhost:3000`~~

## 🛠️ Testing Methods

### Method 1: Using Postman (Recommended)

Postman has built-in WebSocket support!

#### Step 1: Create WebSocket Request

1. Open Postman
2. Click **New** → **WebSocket Request**
3. Enter URL: `ws://localhost:4000`
4. Click **Connect**

You should see: `Connected to ws://localhost:4000`

#### Step 2: Test Connection

Once connected, you can send and receive messages.

### 📋 WebSocket Events Reference

## 1️⃣ Join Quiz

**Send:**
```json
{
  "event": "joinQuiz",
  "data": {
    "quizId": "your-quiz-id-here",
    "userId": "your-user-id-here",
    "userName": "John Doe"
  }
}
```

**You'll Receive:**
```json
{
  "success": true,
  "quiz": {
    "id": "quiz-id",
    "title": "JavaScript Quiz",
    "status": "DRAFT",
    ...
  },
  "leaderboard": {
    "quizId": "quiz-id",
    "participants": [...]
  }
}
```

**Everyone in the room receives:**
```json
{
  "event": "participantJoined",
  "data": {
    "userId": "user-id",
    "userName": "John Doe",
    "timestamp": "2024-11-07T..."
  }
}
```

## 2️⃣ Start Quiz (Teacher Only)

**Send:**
```json
{
  "event": "startQuiz",
  "data": {
    "quizId": "your-quiz-id-here"
  }
}
```

**Everyone receives:**
```json
{
  "event": "quizStarted",
  "data": {
    "quizId": "quiz-id",
    "startedAt": "2024-11-07T...",
    "firstQuestion": {
      "id": "question-id",
      "text": "What is JavaScript?",
      "order": 1,
      "timeLimit": 15,
      "options": [
        {
          "id": "option-1",
          "text": "Programming language",
          "label": "A"
        },
        ...
      ]
    }
  }
}
```

Then automatically broadcasts each question:
```json
{
  "event": "newQuestion",
  "data": {
    "question": {...},
    "questionNumber": 1,
    "totalQuestions": 5,
    "timeLimit": 15
  }
}
```

## 3️⃣ Submit Answer

**Send:**
```json
{
  "event": "submitAnswer",
  "data": {
    "questionId": "question-id",
    "userId": "your-user-id",
    "optionId": "selected-option-id",
    "quizId": "quiz-id"
  }
}
```

**You receive:**
```json
{
  "success": true,
  "answer": {
    "id": "answer-id",
    "isCorrect": true,
    "points": 10
  },
  "isCorrect": true
}
```

**Everyone receives:**
```json
{
  "event": "leaderboardUpdate",
  "data": {
    "quizId": "quiz-id",
    "participants": [
      {
        "userId": "user-1",
        "userName": "John",
        "score": 10,
        "rank": 1
      },
      ...
    ]
  }
}
```

**After all answers or time expires:**
```json
{
  "event": "questionResults",
  "data": {
    "questionId": "question-id",
    "correctOptionId": "option-2",
    "statistics": {
      "totalAnswers": 5,
      "correctAnswers": 3,
      "optionCounts": {
        "option-1": 2,
        "option-2": 3
      }
    }
  }
}
```

## 4️⃣ Get Leaderboard

**Send:**
```json
{
  "event": "getLeaderboard",
  "data": {
    "quizId": "quiz-id"
  }
}
```

**You receive:**
```json
{
  "quizId": "quiz-id",
  "quizTitle": "JavaScript Quiz",
  "participants": [
    {
      "userId": "user-1",
      "score": 30,
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    ...
  ]
}
```

## 5️⃣ Complete Quiz (Teacher Only)

**Send:**
```json
{
  "event": "completeQuiz",
  "data": {
    "quizId": "quiz-id"
  }
}
```

**Everyone receives:**
```json
{
  "event": "quizCompleted",
  "data": {
    "quizId": "quiz-id",
    "completedAt": "2024-11-07T...",
    "leaderboard": {
      "quizId": "quiz-id",
      "participants": [...]
    }
  }
}
```

## 🎯 Complete Testing Scenario

### Preparation (Using REST API)

```bash
# 1. Login as teacher
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+998901234567", "password": "password123"}'

# Save the access_token from response

# 2. Create a quiz
curl -X POST http://localhost:4000/quizzes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Quiz",
    "type": "INDIVIDUAL",
    "defaultQuestionTime": 15
  }'

# Save the quiz ID and code from response

# 3. Add questions
curl -X POST http://localhost:4000/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quizId": "YOUR_QUIZ_ID",
    "text": "What is 2+2?",
    "order": 1,
    "timeLimit": 15,
    "options": [
      {"text": "3", "label": "A", "isCorrect": false},
      {"text": "4", "label": "B", "isCorrect": true},
      {"text": "5", "label": "C", "isCorrect": false}
    ]
  }'

# Save question and option IDs

# 4. Student joins (no auth needed!)
curl -X POST http://localhost:4000/quizzes/join \
  -H "Content-Type: application/json" \
  -d '{
    "code": "YOUR_QUIZ_CODE",
    "name": "Student 1"
  }'

# Save the userId from response
```

### WebSocket Testing (In Postman)

#### Tab 1: Teacher Connection

1. **Connect:** `ws://localhost:4000`

2. **Join as Teacher:**
```json
{
  "event": "joinQuiz",
  "data": {
    "quizId": "paste-quiz-id",
    "userId": "paste-teacher-user-id",
    "userName": "Teacher"
  }
}
```

3. **Start Quiz:**
```json
{
  "event": "startQuiz",
  "data": {
    "quizId": "paste-quiz-id"
  }
}
```

Watch for broadcasts: `quizStarted`, `newQuestion`

4. **Complete Quiz (after students answer):**
```json
{
  "event": "completeQuiz",
  "data": {
    "quizId": "paste-quiz-id"
  }
}
```

#### Tab 2: Student Connection

1. **Connect:** `ws://localhost:4000`

2. **Join as Student:**
```json
{
  "event": "joinQuiz",
  "data": {
    "quizId": "paste-quiz-id",
    "userId": "paste-student-user-id",
    "userName": "Student 1"
  }
}
```

3. **Wait for question broadcast** (after teacher starts)

4. **Submit Answer:**
```json
{
  "event": "submitAnswer",
  "data": {
    "questionId": "paste-question-id",
    "userId": "paste-student-user-id",
    "optionId": "paste-option-id",
    "quizId": "paste-quiz-id"
  }
}
```

Watch for: `leaderboardUpdate`, `questionResults`

## 🌐 Method 2: Using Browser Console

Open browser console (F12) and paste:

```javascript
// Connect to WebSocket
const socket = io('http://localhost:4000');

// Listen for connection
socket.on('connect', () => {
  console.log('✅ Connected!', socket.id);
});

// Listen for all events
socket.onAny((event, data) => {
  console.log('📨 Event:', event, data);
});

// Join quiz
socket.emit('joinQuiz', {
  quizId: 'paste-quiz-id',
  userId: 'paste-user-id',
  userName: 'Test User'
});

// Submit answer
socket.emit('submitAnswer', {
  questionId: 'paste-question-id',
  userId: 'paste-user-id',
  optionId: 'paste-option-id',
  quizId: 'paste-quiz-id'
});

// Get leaderboard
socket.emit('getLeaderboard', {
  quizId: 'paste-quiz-id'
});
```

**Note:** You need to include Socket.IO client library first:
```html
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
```

## 🧪 Method 3: Using HTML Test Page

Save this as `test-websocket.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Tester</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <style>
        body { font-family: Arial; padding: 20px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ccc; }
        input, button { margin: 5px; padding: 8px; }
        #log { 
            background: #f5f5f5; 
            padding: 10px; 
            height: 300px; 
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
        }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
    </style>
</head>
<body>
    <h1>🔌 Quiz WebSocket Tester</h1>
    
    <div class="section">
        <h3>Connection</h3>
        <button onclick="connect()">Connect to ws://localhost:4000</button>
        <button onclick="disconnect()">Disconnect</button>
        <span id="status">Not connected</span>
    </div>

    <div class="section">
        <h3>Join Quiz</h3>
        <input id="quizId" placeholder="Quiz ID" />
        <input id="userId" placeholder="User ID" />
        <input id="userName" placeholder="User Name" value="Test User" />
        <button onclick="joinQuiz()">Join Quiz</button>
    </div>

    <div class="section">
        <h3>Quiz Actions</h3>
        <button onclick="startQuiz()">Start Quiz (Teacher)</button>
        <button onclick="getLeaderboard()">Get Leaderboard</button>
        <button onclick="completeQuiz()">Complete Quiz (Teacher)</button>
    </div>

    <div class="section">
        <h3>Submit Answer</h3>
        <input id="questionId" placeholder="Question ID" />
        <input id="optionId" placeholder="Option ID" />
        <button onclick="submitAnswer()">Submit Answer</button>
    </div>

    <div class="section">
        <h3>Event Log</h3>
        <button onclick="clearLog()">Clear Log</button>
        <div id="log"></div>
    </div>

    <script>
        let socket = null;

        function log(message, type = 'info') {
            const logDiv = document.getElementById('log');
            const time = new Date().toLocaleTimeString();
            logDiv.innerHTML += `<div class="${type}">[${time}] ${message}</div>`;
            logDiv.scrollTop = logDiv.scrollHeight;
        }

        function clearLog() {
            document.getElementById('log').innerHTML = '';
        }

        function connect() {
            if (socket) {
                log('Already connected', 'error');
                return;
            }

            socket = io('http://localhost:4000');

            socket.on('connect', () => {
                log('✅ Connected! Socket ID: ' + socket.id, 'success');
                document.getElementById('status').textContent = '✅ Connected';
                document.getElementById('status').style.color = 'green';
            });

            socket.on('disconnect', () => {
                log('❌ Disconnected', 'error');
                document.getElementById('status').textContent = '❌ Disconnected';
                document.getElementById('status').style.color = 'red';
            });

            socket.on('connect_error', (error) => {
                log('Connection error: ' + error.message, 'error');
            });

            // Listen to all events
            socket.onAny((event, data) => {
                log(`📨 Event: ${event}`, 'info');
                log(JSON.stringify(data, null, 2), 'info');
            });
        }

        function disconnect() {
            if (socket) {
                socket.disconnect();
                socket = null;
                document.getElementById('status').textContent = 'Not connected';
                document.getElementById('status').style.color = 'gray';
            }
        }

        function joinQuiz() {
            if (!socket) {
                log('Not connected! Click Connect first.', 'error');
                return;
            }

            const quizId = document.getElementById('quizId').value;
            const userId = document.getElementById('userId').value;
            const userName = document.getElementById('userName').value;

            if (!quizId || !userId) {
                log('Please enter Quiz ID and User ID', 'error');
                return;
            }

            log('Sending joinQuiz event...', 'info');
            socket.emit('joinQuiz', { quizId, userId, userName });
        }

        function startQuiz() {
            if (!socket) {
                log('Not connected!', 'error');
                return;
            }

            const quizId = document.getElementById('quizId').value;
            if (!quizId) {
                log('Please enter Quiz ID', 'error');
                return;
            }

            log('Sending startQuiz event...', 'info');
            socket.emit('startQuiz', { quizId });
        }

        function submitAnswer() {
            if (!socket) {
                log('Not connected!', 'error');
                return;
            }

            const questionId = document.getElementById('questionId').value;
            const userId = document.getElementById('userId').value;
            const optionId = document.getElementById('optionId').value;
            const quizId = document.getElementById('quizId').value;

            if (!questionId || !userId || !optionId || !quizId) {
                log('Please fill all fields', 'error');
                return;
            }

            log('Sending submitAnswer event...', 'info');
            socket.emit('submitAnswer', { questionId, userId, optionId, quizId });
        }

        function getLeaderboard() {
            if (!socket) {
                log('Not connected!', 'error');
                return;
            }

            const quizId = document.getElementById('quizId').value;
            if (!quizId) {
                log('Please enter Quiz ID', 'error');
                return;
            }

            log('Sending getLeaderboard event...', 'info');
            socket.emit('getLeaderboard', { quizId });
        }

        function completeQuiz() {
            if (!socket) {
                log('Not connected!', 'error');
                return;
            }

            const quizId = document.getElementById('quizId').value;
            if (!quizId) {
                log('Please enter Quiz ID', 'error');
                return;
            }

            log('Sending completeQuiz event...', 'info');
            socket.emit('completeQuiz', { quizId });
        }
    </script>
</body>
</html>
```

**How to use:**
1. Save the file
2. Open in browser
3. Click "Connect"
4. Fill in Quiz ID and User ID (from REST API responses)
5. Click buttons to test events

## 🐛 Troubleshooting

### Issue: "Connection failed"

**Check:**
1. ✅ Server is running: `npm run start:dev`
2. ✅ Correct port: `ws://localhost:4000` (not 3000!)
3. ✅ No firewall blocking port 4000

**Test server:**
```bash
curl http://localhost:4000
# Should return: Cannot GET /
```

### Issue: "Event not working"

**Check:**
1. ✅ Connected first (see "Connected!" message)
2. ✅ Correct event name (case-sensitive!)
3. ✅ All required fields in data object
4. ✅ Valid UUIDs for IDs

### Issue: "No response"

**Check:**
1. ✅ Quiz exists (create via REST API first)
2. ✅ User exists (join quiz via REST API first)
3. ✅ Quiz is in correct status (DRAFT/ACTIVE)

## 📊 Event Flow Diagram

```
Teacher                          Student
  |                                |
  |--[joinQuiz]---------------->  |
  |<-[participantJoined]----------|
  |                                |
  |--[startQuiz]----------------->|
  |<-[quizStarted]----------------|
  |<-[newQuestion]----------------|
  |                                |
  |                                |--[submitAnswer]-->
  |<-[leaderboardUpdate]----------|
  |                                |
  |--[completeQuiz]-------------->|
  |<-[quizCompleted]--------------|
```

## ✅ Quick Test Checklist

- [ ] Server running on port 4000
- [ ] WebSocket connects successfully
- [ ] Can join quiz room
- [ ] Receives participantJoined event
- [ ] Teacher can start quiz
- [ ] Receives quizStarted event
- [ ] Receives newQuestion event
- [ ] Can submit answer
- [ ] Receives leaderboardUpdate
- [ ] Teacher can complete quiz
- [ ] Receives quizCompleted event

## 🎉 Success Indicators

When everything works, you should see:

1. **On Connect:** `Connected! Socket ID: xyz123`
2. **On Join:** `{ success: true, quiz: {...} }`
3. **On Start:** `quizStarted` event with first question
4. **On Answer:** `{ success: true, isCorrect: true }`
5. **On Complete:** `quizCompleted` event with final leaderboard

---

**Need help? Check the server logs for errors!**

```bash
# View server logs
npm run start:dev

# Look for WebSocket connection logs
# Should see: "User joined quiz..." messages
```
