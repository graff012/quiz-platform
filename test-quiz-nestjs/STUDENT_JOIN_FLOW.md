# 🎓 Student Join Flow - No Registration Required!

## ✨ Overview

Students can join quizzes **without any registration or login**. They only need:
1. Quiz code (6 digits)
2. Their name
3. Optional: Phone number

## 🚀 How It Works

### Step 1: Student Joins Quiz

**Endpoint:** `POST /quizzes/join`

**Request Body:**
```json
{
  "code": "123456",
  "name": "John"
}
```

**Required Fields:**
- ✅ `code` - The 6-digit quiz code
- ✅ `name` - Student's name

**Optional Fields:**
- ⭕ `phoneNumber` - Phone number (if provided, student can rejoin with same identity)
- ⭕ `teamId` - For team-based quizzes

**Example with phone number:**
```json
{
  "code": "123456",
  "name": "John",
  "phoneNumber": "+998901234567"
}
```

### Step 2: System Creates Guest User

Behind the scenes, the system:
1. Checks if a user with that phone number exists
2. If not, creates a "guest" user automatically
3. Adds the user to the quiz participants
4. Returns the `userId` for WebSocket connection

**Response:**
```json
{
  "message": "Successfully joined",
  "participant": {
    "id": "participant-uuid",
    "quizId": "quiz-uuid",
    "userId": "user-uuid",
    "score": 0,
    "user": {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Doe"
    },
    "quiz": {
      "id": "quiz-uuid",
      "title": "JavaScript Quiz",
      "code": "123456",
      "status": "DRAFT"
    }
  },
  "userId": "user-uuid"
}
```

### Step 3: Student Connects to WebSocket

Use the `userId` from the join response:

```javascript
socket.emit('joinQuiz', {
  quizId: 'quiz-uuid',
  userId: 'user-uuid',  // From join response
  userName: 'John Doe'
});
```

## 🔄 Rejoining Logic

### With Phone Number
If a student provides a phone number:
- They can close the browser and rejoin later
- System recognizes them by phone number
- Previous progress is maintained

**Example:**
```json
{
  "code": "123456",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+998901234567"
}
```

### Without Phone Number
If no phone number is provided:
- System generates a unique guest identifier
- Student gets a new identity each time
- Cannot rejoin with same identity

**Example:**
```json
{
  "code": "123456",
  "firstName": "John",
  "lastName": "Doe"
}
```
System creates user with phoneNumber: `guest_1699345678901`

## 📱 Complete Student Flow Example

### Using cURL

```bash
# 1. Join quiz (minimal - just code and name!)
curl -X POST http://localhost:4000/quizzes/join \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456",
    "name": "John"
  }'

# Response includes userId
# {
#   "message": "Successfully joined",
#   "userId": "abc-123-def-456",
#   ...
# }

# 2. Connect to WebSocket using the userId
# (See WebSocket examples in POSTMAN_GUIDE.md)
```

### Using Postman

1. **Create Request:**
   - Method: `POST`
   - URL: `http://localhost:4000/quizzes/join`
   - Body (raw JSON):
     ```json
     {
       "code": "123456",
       "name": "John"
     }
     ```

2. **Add Test Script** (to save userId):
   ```javascript
   if (pm.response.code === 201) {
       const response = pm.response.json();
       pm.environment.set("student_user_id", response.userId);
       console.log("Student joined! User ID:", response.userId);
   }
   ```

3. **Use userId for WebSocket:**
   - Open WebSocket connection
   - Send `joinQuiz` event with saved `student_user_id`

## 🎯 Benefits

### For Students
- ✅ No registration hassle
- ✅ Join instantly with just name and code
- ✅ Optional phone number for persistent identity
- ✅ No password to remember

### For Teachers
- ✅ Lower barrier to entry
- ✅ More students can participate
- ✅ Faster quiz start times
- ✅ No user management overhead

### For System
- ✅ Automatic guest user creation
- ✅ Clean database (guest users linked to quizzes)
- ✅ Optional persistent identity with phone numbers
- ✅ Prevents duplicate joins

## 🔒 Security Considerations

### Guest Users
- Created automatically on join
- Password is `null` (cannot login via auth endpoints)
- Role is always `STUDENT`
- Can only participate in quizzes they joined

### Phone Number Validation
- Optional field
- If provided, must be unique
- Allows rejoining with same identity
- Format: `+[country code][number]`

### Quiz Code
- 6-digit numeric code
- Generated randomly on quiz creation
- Public (no authentication needed to join)
- One-time use per student (cannot join twice)

## 🐛 Edge Cases Handled

### 1. Student Already Joined
**Request:**
```json
{
  "code": "123456",
  "name": "John",
  "phoneNumber": "+998901234567"
}
```

**Response:**
```json
{
  "message": "Already joined",
  "participant": { ... },
  "userId": "existing-user-uuid"
}
```

### 2. Quiz Already Completed
**Response:** `400 Bad Request`
```json
{
  "statusCode": 400,
  "message": "Quiz is already completed"
}
```

### 3. Invalid Quiz Code
**Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Quiz with code 123456 not found"
}
```

### 4. Duplicate Phone Number
If phone number already exists:
- System finds existing user
- Uses that user to join quiz
- Updates name if different

## 📊 Database Schema

### User Table (Guest Users)
```prisma
model User {
  id          String   @id @default(uuid())
  firstName   String?
  lastName    String?
  phoneNumber String   @unique
  password    String?  // null for guest users
  role        Role     @default(STUDENT)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### QuizParticipants Table
```prisma
model QuizParticipants {
  id        String   @id @default(uuid())
  quizId    String
  userId    String
  teamId    String?
  score     Int      @default(0)
  joinedAt  DateTime @default(now())
  
  @@unique([quizId, userId]) // Prevents duplicate joins
}
```

## 🎨 Frontend Integration Example

### React Example

```jsx
import { useState } from 'react';
import io from 'socket.io-client';

function JoinQuiz() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phoneNumber: ''
  });
  const [userId, setUserId] = useState(null);

  const handleJoin = async () => {
    const response = await fetch('http://localhost:4000/quizzes/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    setUserId(data.userId);
    
    // Connect to WebSocket
    const socket = io('http://localhost:4000');
    socket.emit('joinQuiz', {
      quizId: data.participant.quizId,
      userId: data.userId,
      userName: formData.name
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleJoin(); }}>
      <input
        placeholder="Quiz Code"
        value={formData.code}
        onChange={(e) => setFormData({...formData, code: e.target.value})}
        required
      />
      <input
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        placeholder="Phone (optional)"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
      />
      <button type="submit">Join Quiz</button>
    </form>
  );
}
```

## ✅ Testing Checklist

- [ ] Student can join with code + name only
- [ ] Student can join with code + name + phone
- [ ] System creates guest user automatically
- [ ] Response includes userId
- [ ] Student cannot join same quiz twice
- [ ] Student cannot join completed quiz
- [ ] Invalid code returns 404
- [ ] Phone number allows rejoining with same identity
- [ ] Guest users without phone get unique identifier
- [ ] WebSocket connection works with returned userId

---

**🎉 That's it! Students can now join quizzes instantly without any registration!**
