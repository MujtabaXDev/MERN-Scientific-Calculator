# Makefile for MERN Calculator

.PHONY: help install dev build start stop docker-up docker-down docker-logs clean

help:
	@echo "MERN Calculator - Available commands:"
	@echo "  make install       - Install dependencies for both client and server"
	@echo "  make dev           - Start development servers (client & server)"
	@echo "  make build         - Build production client bundle"
	@echo "  make start         - Start services (requires: make dev)"
	@echo "  make stop          - Stop all services"
	@echo "  make docker-up     - Start services using Docker Compose"
	@echo "  make docker-down   - Stop and remove Docker containers"
	@echo "  make docker-logs   - View Docker container logs"
	@echo "  make clean         - Remove node_modules and build artifacts"

install:
	@echo "📦 Installing server dependencies..."
	@cd server && npm install
	@echo "📦 Installing client dependencies..."
	@cd client && npm install
	@echo "✅ All dependencies installed"

dev:
	@echo "🚀 Starting development servers..."
	@echo "   Backend: http://localhost:5000"
	@echo "   Frontend: http://localhost:5173"
	@cd server && npm run dev &
	@cd client && npm run dev &

build:
	@echo "🔨 Building production bundle..."
	@cd client && npm run build
	@echo "✅ Build complete: client/dist/"

start: dev

stop:
	@echo "⏹️  Stopping servers..."
	@pkill -f "npm run dev"
	@echo "✅ Servers stopped"

docker-up:
	@echo "🐳 Starting Docker services..."
	docker-compose up -d
	@echo "✅ Services running:"
	@echo "   Frontend: http://localhost:5173"
	@echo "   Backend: http://localhost:5000"
	@echo "   MongoDB: mongodb://127.0.0.1:27017"

docker-down:
	@echo "🐳 Stopping Docker services..."
	docker-compose down
	@echo "✅ Services stopped"

docker-logs:
	docker-compose logs -f

clean:
	@echo "🧹 Cleaning up..."
	rm -rf server/node_modules client/node_modules client/dist
	@echo "✅ Clean complete"

.PHONY: help install dev build start stop docker-up docker-down docker-logs clean
