# TPX Gallery - Gaming Moments Repository

A modern gallery website for storing and sharing the best gaming moments from the Phantom Phoenix Organization Discord community. Built with React, Kotlin Spring Boot, and Tailwind CSS.

## 🌟 Features

- **Media Upload**: Authorized users can upload videos and images of epic gaming moments
- **Comment System**: Logged-in users can leave comments on media posts
- **Admin Panel**: Full admin controls for adding, editing, and deleting content
- **Shared Authentication**: Uses the same authentication system as the main TPX Discord website
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Dynamic content updates with immediate UI feedback

## 🚀 Live Demo

**Visit the gallery:** [https://phantomphoenix.org/gallery](https://phantomphoenix.org/gallery)

*Note: This is a separate application from the main TPX website [https://phantomphoenix.org](https://phantomphoenix.org), but is seamlessly integrated through nginx reverse proxy configuration.*

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Kotlin** - Programming language
- **Spring Boot** - Java/Kotlin framework
- **JWT Authentication** - Secure token-based auth
- **PostgreSQL** - Database (via Flyway migrations)
- **Docker** - Containerization

### Infrastructure
- **Nginx** - Reverse proxy for seamless integration
- **Docker Compose** - Multi-service orchestration
- **Flyway** - Database migration management

## 🔐 Authentication

This gallery uses **shared authentication** with the main TPX Discord website. Users can log in with their existing TPX Discord accounts, providing a seamless experience across both applications.

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for local backend development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Media-app
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```
   
### Local Development

1. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend Development**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=media_app
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=100MB
```

## 📦 Deployment

### Production Deployment

The application is deployed using Docker Compose with nginx reverse proxy:

```bash
# this in run inside tpx-diccord-website root where the prod docker-compose.yml is. It includes also containers for this app.
docker-compose -f docker-compose.prod.yml up -d
```

### Nginx Configuration

The gallery is accessible at `/gallery` through nginx reverse proxy configuration, allowing seamless integration with the main TPX website.

**Built with ❤️ for the Phantom Phoenix gaming community**