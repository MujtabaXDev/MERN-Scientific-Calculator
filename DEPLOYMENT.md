# DEPLOYMENT.md

## Deployment Guide for MERN Calculator

### 1. Local Development Setup

#### Prerequisites
- **Node.js** 18+ 
- **MongoDB** running locally, via Docker, or Atlas
- **npm** or **yarn**

#### Quick Start
```bash
# Install all dependencies
make install

# Start development servers
make dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

### 2. Docker Deployment (Recommended)

#### Prerequisites
- **Docker** and **Docker Compose** installed

#### Start Services
```bash
make docker-up
```

#### Stop Services
```bash
make docker-down
```

#### View Logs
```bash
make docker-logs
```

**Access Points:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: mongodb://mongodb:27017/casio_calculator

---

### 3. Production Build

Build the optimized client bundle:
```bash
make build
```

Output: `client/dist/` (ready for static hosting or CDN)

---

### 4. Environment Configuration

#### Backend (.env)
Create `.env` in the `server/` folder:
```env
# MongoDB connection string
MONGO_URI=mongodb://127.0.0.1:27017/casio_calculator

# or for Atlas:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/casio_calculator

# Server port
PORT=5000

# Environment
NODE_ENV=production
```

---

### 5. MongoDB Options

#### Option A: Local MongoDB
```bash
mongod --dbpath /path/to/data
```

#### Option B: Docker
```bash
docker run -d -p 27017:27017 --name mongo mongo:7.0-alpine
```

#### Option C: MongoDB Atlas (Cloud)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update `MONGO_URI` in `.env`

---

### 6. Running Tests / Verification

```bash
# Test backend health check
curl http://localhost:5000/api/health

# Test history API
curl http://localhost:5000/api/history
```

---

### 7. Production Hosting

#### Option A: Static Host + Separate API
1. Build: `npm run build`
2. Upload `client/dist/` to any static host (Vercel, Netlify, S3, GitHub Pages)
3. Host backend on Heroku, Railway, Render, or your own server

#### Option B: Single Docker Container (All-in-One)
Use a multi-stage Dockerfile to serve both frontend and backend:
```bash
docker build -f Dockerfile.prod -t mern-calculator .
docker run -p 3000:80 -e MONGO_URI=... mern-calculator
```

#### Option C: Kubernetes
Use the provided Dockerfiles with Helm/kubectl for orchestration.

---

### 8. Troubleshooting

**"Cannot connect to MongoDB"**
- Verify MongoDB is running: `mongosh` or `mongo` shell
- Check `MONGO_URI` in `.env`
- If using Docker, ensure the MongoDB container is running

**"Frontend cannot reach backend"**
- Verify backend is running on http://localhost:5000
- Check CORS settings in `server/server.js` (should allow `localhost:5173`)
- Open DevTools Console (F12) to see API errors

**"Port already in use"**
- Find the process: `lsof -i :5000` (macOS/Linux) or `netstat -ano | findstr :5000` (Windows)
- Kill it or use a different port: `PORT=5001 npm run dev`

---

### 9. API Reference

**Health Check**
```bash
GET /api/health
```

**Fetch History** (last 100 entries)
```bash
GET /api/history
```

**Save Calculation**
```bash
POST /api/history
Content-Type: application/json
{
  "expression": "2+2",
  "result": 4,
  "mode": "COMP",
  "angleUnit": "DEG"
}
```

**Delete Entry**
```bash
DELETE /api/history/{id}
```

**Clear All History**
```bash
DELETE /api/history
```

---

### 10. Performance Optimization

- **Client**: Enable Vite build optimizations, minification, gzip compression
- **Server**: Use production Node environment, enable caching headers
- **Database**: Create indexes on `createdAt` for faster queries
- **Hosting**: Use CDN for static assets (Cloudflare, AWS CloudFront)

---

## Support & Further Development

For issues, contributions, or feature requests, see the main README.md.
