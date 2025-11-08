# 📮 Postman Testing Guide

Complete guide for testing the Quiz Platform API using Postman, including REST API and WebSocket testing.

## 📥 Postman Collection Setup

### Method 1: Import Collection (Recommended)

Create a file `quiz-platform.postman_collection.json` with the collection below, then import it into Postman.

### Method 2: Manual Setup

Follow the steps below to manually create requests in Postman.

## 🔐 Setting Up Environment Variables

1. Click on **Environments** in Postman
2. Create a new environment called "Quiz Platform - Local"
3. Add these variables:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` |
| `access_token` | | (will be set automatically) |
| `quiz_id` | | (will be set manually) |
| `question_id` | | (will be set manually) |
| `user_id` | | (will be set manually) |
| `option_id` | | (will be set manually) |

## 📋 Complete Postman Collection

### 1️⃣ Authentication

#### Register Teacher
- **Method:** POST
- **URL:** `{{base_url}}/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "firstName": "Alice",
    "lastName": "Teacher",
    "phoneNumber": "+998901111111",
    "password": "password123",
    "role": "TEACHER",
    "telegramId": "123456789"
  }
  ```
- **Tests (to save token):**
  ```javascript
  if (pm.response.code === 201) {
      const response = pm.response.json();
      pm.environment.set("access_token", response.access_token);
      pm.environment.set("user_id", response.user.id);
      console.log("Token saved:", response.access_token);
  }
  ```

#### Register Student
- **Method:** POST
- **URL:** `{{base_url}}/auth/register`
- **Body (raw JSON):**
  ```json
  {
    "firstName": "Bob",
    "lastName": "Student",
    "phoneNumber": "+998902222222",
    "password": "password123",
    "role": "STUDENT"
  }
  ```

#### Login (Teacher)
- **Method:** POST
- **URL:** `{{base_url}}/auth/login`
- **Body (raw JSON):**
  ```json
  {
    "phoneNumber": "+998901234567",
    "password": "password123"
  }
  ```
- **Tests:**
  ```javascript
  if (pm.response.code === 200) {
      const response = pm.response.json();
      pm.environment.set("access_token", response.access_token);
      pm.environment.set("user_id", response.user.id);
      console.log("Logged in as:", response.user.firstName);
  }
  ```

#### Login (Student)
- **Method:** POST
- **URL:** `{{base_url}}/auth/login`
- **Body (raw JSON):**
  ```json
  {
    "phoneNumber": "+998900000001",
    "password": "password123"
  }
  ```

### 2️⃣ Quiz Management

#### Create Quiz
- **Method:** POST
- **URL:** `{{base_url}}/quizzes`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "JavaScript Advanced Quiz",
    "type": "INDIVIDUAL",
    "defaultQuestionTime": 20
  }
  ```
- **Tests:**
  ```javascript
  if (pm.response.code === 201) {
      const response = pm.response.json();
      pm.environment.set("quiz_id", response.id);
      console.log("Quiz created with ID:", response.id);
      console.log("Quiz code:", response.code);
  }
  ```

#### Get All Quizzes
- **Method:** GET
- **URL:** `{{base_url}}/quizzes`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

#### Get Quiz by ID
- **Method:** GET
- **URL:** `{{base_url}}/quizzes/{{quiz_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

#### Get Quiz by Code
- **Method:** GET
- **URL:** `{{base_url}}/quizzes/code/123456`
- **Headers:** None required (public endpoint)

#### Update Quiz
- **Method:** PATCH
- **URL:** `{{base_url}}/quizzes/{{quiz_id}}`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "Updated Quiz Title",
    "defaultQuestionTime": 25
  }
  ```

#### Start Quiz
- **Method:** POST
- **URL:** `{{base_url}}/quizzes/{{quiz_id}}/start`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

#### Complete Quiz
- **Method:** POST
- **URL:** `{{base_url}}/quizzes/{{quiz_id}}/complete`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

#### Join Quiz (No Registration Required!)
- **Method:** POST
- **URL:** `{{base_url}}/quizzes/join`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "code": "123456",
    "name": "John"
  }
  ```
  **Note:** Only `code` and `name` are required. `phoneNumber` is optional.
  
  **With optional phone number:**
  ```json
  {
    "code": "123456",
    "name": "John",
    "phoneNumber": "+998901234567"
  }
  ```
- **Tests (to save userId):**
  ```javascript
  if (pm.response.code === 201) {
      const response = pm.response.json();
      pm.environment.set("user_id", response.userId);
      console.log("Joined quiz! User ID:", response.userId);
  }
  ```

#### Get Leaderboard
- **Method:** GET
- **URL:** `{{base_url}}/quizzes/{{quiz_id}}/leaderboard`
- **Headers:** None required (public endpoint)

### 3️⃣ Question Management

#### Create Question with Options
- **Method:** POST
- **URL:** `{{base_url}}/questions`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- **Body (raw JSON):**
  ```json
  {
    "quizId": "{{quiz_id}}",
    "text": "What is the output of: console.log(typeof [])?",
    "order": 1,
    "timeLimit": 15,
    "options": [
      {
        "text": "array",
        "label": "A",
        "isCorrect": false
      },
      {
        "text": "object",
        "label": "B",
        "isCorrect": true
      },
      {
        "text": "undefined",
        "label": "C",
        "isCorrect": false
      },
      {
        "text": "null",
        "label": "D",
        "isCorrect": false
      }
    ]
  }
  ```
- **Tests:**
  ```javascript
  if (pm.response.code === 201) {
      const response = pm.response.json();
      pm.environment.set("question_id", response.id);
      pm.environment.set("option_id", response.options[0].id);
      console.log("Question created with ID:", response.id);
  }
  ```

#### Get All Questions
- **Method:** GET
- **URL:** `{{base_url}}/questions`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

#### Get Questions by Quiz
- **Method:** GET
- **URL:** `{{base_url}}/questions?quizId={{quiz_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

#### Update Question
- **Method:** PATCH
- **URL:** `{{base_url}}/questions/{{question_id}}`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- **Body (raw JSON):**
  ```json
  {
    "text": "Updated question text",
    "timeLimit": 20
  }
  ```

#### Delete Question
- **Method:** DELETE
- **URL:** `{{base_url}}/questions/{{question_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

### 4️⃣ Answer Submission

#### Submit Answer
- **Method:** POST
- **URL:** `{{base_url}}/answers`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "questionId": "{{question_id}}",
    "userId": "{{user_id}}",
    "optionId": "{{option_id}}"
  }
  ```

#### Get All Answers
- **Method:** GET
- **URL:** `{{base_url}}/answers`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

#### Get Question Statistics
- **Method:** GET
- **URL:** `{{base_url}}/answers/stats/{{question_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

### 5️⃣ Team Management

#### Create Team
- **Method:** POST
- **URL:** `{{base_url}}/teams`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- **Body (raw JSON):**
  ```json
  {
    "quizId": "{{quiz_id}}",
    "name": "Team Awesome"
  }
  ```
- **Tests:**
  ```javascript
  if (pm.response.code === 201) {
      const response = pm.response.json();
      pm.environment.set("team_id", response.id);
  }
  ```

#### Add Member to Team
- **Method:** POST
- **URL:** `{{base_url}}/teams/members`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer {{access_token}}
  ```
- **Body (raw JSON):**
  ```json
  {
    "teamId": "{{team_id}}",
    "userId": "{{user_id}}"
  }
  ```

### 6️⃣ User Management

#### Get All Users
- **Method:** GET
- **URL:** `{{base_url}}/users`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

#### Get User by ID
- **Method:** GET
- **URL:** `{{base_url}}/users/{{user_id}}`
- **Headers:**
  ```
  Authorization: Bearer {{access_token}}
  ```

## 🔌 WebSocket Testing in Postman

Postman supports WebSocket connections! Here's how to test them:

### Step 1: Create WebSocket Request

1. Click **New** → **WebSocket Request**
2. Enter URL: `ws://localhost:3000`
3. Click **Connect**

### Step 2: Join Quiz

Once connected, send this message:

```json
{
  "event": "joinQuiz",
  "data": {
    "quizId": "paste-quiz-id-here",
    "userId": "paste-user-id-here",
    "userName": "John Doe"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "quiz": { ... },
  "leaderboard": { ... }
}
```

### Step 3: Start Quiz (Teacher)

```json
{
  "event": "startQuiz",
  "data": {
    "quizId": "paste-quiz-id-here"
  }
}
```

**Server will broadcast:**
```json
{
  "event": "quizStarted",
  "data": {
    "quizId": "...",
    "startedAt": "...",
    "firstQuestion": { ... }
  }
}
```

### Step 4: Submit Answer

```json
{
  "event": "submitAnswer",
  "data": {
    "questionId": "paste-question-id-here",
    "userId": "paste-user-id-here",
    "optionId": "paste-option-id-here",
    "quizId": "paste-quiz-id-here"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "answer": { ... },
  "isCorrect": true
}
```

**Server will broadcast:**
```json
{
  "event": "leaderboardUpdate",
  "data": {
    "quizId": "...",
    "participants": [ ... ]
  }
}
```

### Step 5: Get Leaderboard

```json
{
  "event": "getLeaderboard",
  "data": {
    "quizId": "paste-quiz-id-here"
  }
}
```

### Step 6: Complete Quiz (Teacher)

```json
{
  "event": "completeQuiz",
  "data": {
    "quizId": "paste-quiz-id-here"
  }
}
```

**Server will broadcast:**
```json
{
  "event": "quizCompleted",
  "data": {
    "quizId": "...",
    "completedAt": "...",
    "leaderboard": { ... }
  }
}
```

## 🎯 Complete Testing Flow in Postman

### Scenario: Teacher Creates and Runs a Quiz

1. **Login as Teacher**
   - Run: `POST /auth/login` (Teacher credentials)
   - Token saved automatically

2. **Create Quiz**
   - Run: `POST /quizzes`
   - Quiz ID saved automatically
   - Note the quiz code from response

3. **Add Questions**
   - Run: `POST /questions` (repeat 3-5 times)
   - Question IDs saved automatically

4. **Student Joins Quiz** (No login required!)
   - Run: `POST /quizzes/join` with quiz code and name
   - Response includes `userId` - save this for WebSocket connection

6. **Connect WebSocket** (Teacher)
   - Create WebSocket request
   - Connect to `ws://localhost:3000`
   - Send `joinQuiz` event

7. **Connect WebSocket** (Student)
   - Open another WebSocket tab
   - Connect to `ws://localhost:3000`
   - Send `joinQuiz` event

8. **Start Quiz** (Teacher via WebSocket)
   - Send `startQuiz` event
   - Both connections receive `quizStarted` event
   - Questions broadcast automatically

9. **Submit Answers** (Student via WebSocket)
   - Send `submitAnswer` events
   - Both connections receive `leaderboardUpdate`

10. **Complete Quiz** (Teacher via WebSocket)
    - Send `completeQuiz` event
    - Both connections receive `quizCompleted`
    - Check Telegram for notification

11. **View Results** (via REST API)
    - Run: `GET /quizzes/{{quiz_id}}/leaderboard`
    - Run: `GET /answers/stats/{{question_id}}`

## 📦 Import Ready Postman Collection

Save this as `quiz-platform.postman_collection.json`:

```json
{
  "info": {
    "name": "Quiz Platform API",
    "description": "Complete API collection for Quiz Platform",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register Teacher",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    const response = pm.response.json();",
                  "    pm.environment.set('access_token', response.access_token);",
                  "    pm.environment.set('user_id', response.user.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"Alice\",\n  \"lastName\": \"Teacher\",\n  \"phoneNumber\": \"+998901111111\",\n  \"password\": \"password123\",\n  \"role\": \"TEACHER\",\n  \"telegramId\": \"123456789\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/register",
              "host": ["{{base_url}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login Teacher",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    pm.environment.set('access_token', response.access_token);",
                  "    pm.environment.set('user_id', response.user.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"phoneNumber\": \"+998901234567\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Quizzes",
      "item": [
        {
          "name": "Create Quiz",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    const response = pm.response.json();",
                  "    pm.environment.set('quiz_id', response.id);",
                  "    console.log('Quiz code:', response.code);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"JavaScript Advanced Quiz\",\n  \"type\": \"INDIVIDUAL\",\n  \"defaultQuestionTime\": 20\n}"
            },
            "url": {
              "raw": "{{base_url}}/quizzes",
              "host": ["{{base_url}}"],
              "path": ["quizzes"]
            }
          }
        },
        {
          "name": "Get All Quizzes",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/quizzes",
              "host": ["{{base_url}}"],
              "path": ["quizzes"]
            }
          }
        },
        {
          "name": "Start Quiz",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/quizzes/{{quiz_id}}/start",
              "host": ["{{base_url}}"],
              "path": ["quizzes", "{{quiz_id}}", "start"]
            }
          }
        },
        {
          "name": "Get Leaderboard",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/quizzes/{{quiz_id}}/leaderboard",
              "host": ["{{base_url}}"],
              "path": ["quizzes", "{{quiz_id}}", "leaderboard"]
            }
          }
        }
      ]
    }
  ]
}
```

## 🔧 Troubleshooting

### Issue: "Unauthorized" Error
**Solution:** Make sure you've logged in and the token is saved:
1. Run login request
2. Check Tests tab for token saving script
3. Verify `{{access_token}}` variable is set in environment

### Issue: WebSocket Won't Connect
**Solution:** 
1. Ensure server is running: `npm run start:dev`
2. Check URL is `ws://localhost:3000` (not `wss://`)
3. Verify port 3000 is not blocked

### Issue: "Quiz not found"
**Solution:** 
1. Create a quiz first
2. Check `{{quiz_id}}` variable is set
3. Copy quiz ID from response manually if needed

### Issue: WebSocket Events Not Working
**Solution:**
1. Ensure you're sending correct JSON format
2. Check event names match exactly (case-sensitive)
3. Verify all required fields are present in data object

## 📱 Alternative: Using Socket.IO Client

If you prefer a dedicated Socket.IO client, use this HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Quiz WebSocket Tester</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
    <h1>Quiz WebSocket Tester</h1>
    <button onclick="connect()">Connect</button>
    <button onclick="joinQuiz()">Join Quiz</button>
    <button onclick="startQuiz()">Start Quiz</button>
    <button onclick="submitAnswer()">Submit Answer</button>
    <div id="log"></div>

    <script>
        let socket;
        
        function log(msg) {
            document.getElementById('log').innerHTML += '<p>' + msg + '</p>';
        }
        
        function connect() {
            socket = io('http://localhost:3000');
            
            socket.on('connect', () => log('Connected!'));
            socket.on('quizStarted', (data) => log('Quiz Started: ' + JSON.stringify(data)));
            socket.on('newQuestion', (data) => log('New Question: ' + JSON.stringify(data)));
            socket.on('leaderboardUpdate', (data) => log('Leaderboard: ' + JSON.stringify(data)));
            socket.on('quizCompleted', (data) => log('Quiz Completed: ' + JSON.stringify(data)));
        }
        
        function joinQuiz() {
            socket.emit('joinQuiz', {
                quizId: 'paste-quiz-id',
                userId: 'paste-user-id',
                userName: 'Test User'
            });
        }
        
        function startQuiz() {
            socket.emit('startQuiz', {
                quizId: 'paste-quiz-id'
            });
        }
        
        function submitAnswer() {
            socket.emit('submitAnswer', {
                questionId: 'paste-question-id',
                userId: 'paste-user-id',
                optionId: 'paste-option-id',
                quizId: 'paste-quiz-id'
            });
        }
    </script>
</body>
</html>
```

## ✅ Testing Checklist

- [ ] Teacher can register and login
- [ ] Student can register and login
- [ ] Teacher can create quiz
- [ ] Teacher can add questions
- [ ] Student can join quiz by code
- [ ] WebSocket connection works
- [ ] Quiz start broadcasts to all
- [ ] Questions broadcast automatically
- [ ] Answers can be submitted
- [ ] Leaderboard updates in real-time
- [ ] Quiz completion works
- [ ] Statistics endpoint returns data
- [ ] Telegram notification sent (if configured)

---

**Happy Testing! 🚀**

For more examples, check `API_EXAMPLES.md` in the project root.
