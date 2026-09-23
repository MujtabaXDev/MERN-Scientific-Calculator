# QUICKSTART.md

## 🚀 Quick Start Guide

### Option 1: Local Development (Recommended for Beginners)

#### Step 1: Ensure MongoDB is Running
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows (if installed)
mongod

# or use Docker:
docker run -d -p 27017:27017 --name mongo mongo:7.0-alpine
```

#### Step 2: Install Dependencies
```bash
make install
# or manually:
cd server && npm install && cd ../client && npm install && cd ..
```

#### Step 3: Start Development Servers
```bash
make dev
# This starts:
#   - Backend on http://localhost:5000
#   - Frontend on http://localhost:5173
```

#### Step 4: Open in Browser
Open http://localhost:5173 in your browser.

---

### Option 2: Docker (One Command)

```bash
make docker-up
```

Access:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **MongoDB**: Already running in container

Stop with:
```bash
make docker-down
```

---

### Option 3: Manual Steps

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

---

## ✅ Verify It's Working

1. **Open the calculator** at http://localhost:5173
2. **Try a calculation**: `2 + 2` → should show `4`
3. **Check history**: Click "Show History" (right panel)
4. **Test API**: 
   ```bash
   curl http://localhost:5000/api/health
   # Should return: { "status": "ok" }
   ```

---

## 📚 Next Steps

- **Explore modes**: Click `MENU` to switch between COMP, STAT, BASE-N, MATRIX, etc.
- **Use SHIFT**: For secondary (yellow) functions
- **Check history**: Calculations auto-save to MongoDB (if running)
- **Read DEPLOYMENT.md**: For production setup instructions

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running (see Step 1)
- The app still works without DB, but history won't persist

### "Port 5000 or 5173 is in use"
```bash
# Kill the process using the port
# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Frontend can't reach backend"
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check browser DevTools Console (F12) for API errors
- Ensure Vite proxy config is correct in `client/vite.config.js`

---

## 📁 Project Structure

```
mern-calculator/
├── server/          # Express backend + MongoDB
│   ├── server.js    # Main entry point
│   ├── routes/      # API routes (/api/history)
│   └── models/      # MongoDB schema (History)
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx  # Main app component
│   │   ├── components/  # Calculator UI
│   │   └── engine/  # Math engine (mathjs)
│   └── vite.config.js
├── docker-compose.yml  # Docker setup
└── README.md        # Full documentation
```

---

## 🎯 Common Tasks

| Task | Command |
|------|---------|
| Start dev servers | `make dev` |
| Build for production | `make build` |
| Start with Docker | `make docker-up` |
| Stop services | `make stop` or `make docker-down` |
| Install deps | `make install` |
| View logs | `make docker-logs` |
| Clean everything | `make clean` |

---

## 📖 Documentation

- **README.md**: Full feature list & project info
- **DEPLOYMENT.md**: Production & hosting guide
- **TESTING.md**: Testing procedures & verification
- **.env.example**: Environment variable template

---

## 🆘 Need Help?

1. Check TESTING.md for test procedures
2. Review DEPLOYMENT.md for setup issues
3. Check browser Console (F12) for errors
4. Verify MongoDB is running
5. See README.md for feature details

---

**Happy calculating! 🧮**
