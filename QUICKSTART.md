# NestJS Learning - Quick Start Guide

## Step 1: Install Dependencies

```bash
cd "c:\Learning Projects\nestjs-backend-learning"
npm install
```

## Step 2: Start the Server

```bash
npm run start:dev
```

Wait for the message:
```
🚀 NestJS Backend Learning Project is running!
📡 Server URL: http://localhost:3000
```

## Step 3: Test the API

### Option A: Using the HTTP file (Recommended)
1. Install VS Code extension: "REST Client"
2. Open `api-requests.http`
3. Click "Send Request" above any request

### Option B: Using curl
```bash
# Create a user
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Test1234\",\"firstName\":\"Test\",\"lastName\":\"User\",\"age\":25,\"hobbies\":[\"coding\"]}"

# Get all users
curl http://localhost:3000/users
```

### Option C: Using PowerShell
```powershell
# Create a user
$body = @{
    email = "test@example.com"
    password = "Test1234"
    firstName = "Test"
    lastName = "User"
    age = 25
    hobbies = @("coding")
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/users -Method POST -Body $body -ContentType "application/json"

# Get all users
Invoke-RestMethod -Uri http://localhost:3000/users
```

## Step 4: Explore the Code

Start with these files in order:

1. **main.ts** - Application entry point
2. **app.module.ts** - Root module configuration
3. **modules/users/users.controller.ts** - Routing examples
4. **modules/users/dto/create-user.dto.ts** - Validation examples
5. **modules/users/users.service.ts** - Dependency injection
6. **modules/users/entities/user.entity.ts** - Database entity
7. **common/filters/** - Exception handling

## Step 5: Try the Learning Exercises

See [README.md](README.md#-practice-exercises) for full exercise list.

Quick exercise: Create a new category for products!

---

**Need help?** Check the main [README.md](README.md) for detailed documentation.
