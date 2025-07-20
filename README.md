# 🔍 Real-Time Visitor Analytics System

A comprehensive real-time visitor analytics system built with Node.js, Express.js, and WebSocket technology. This system tracks website visitors and displays live updates on a dashboard using bidirectional WebSocket communication.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Dashboard Features](#dashboard-features)
- [File Structure](#file-structure)

## 🎯 Overview

This system consists of three main components:

- **API Server** - Receives visitor data from websites via REST endpoints
- **WebSocket Server** - Handles real-time bidirectional communication
- **Analytics Dashboard** - Shows live visitor information and interactive features

## ✨ Features

### Real-Time Analytics

- Live visitor tracking with instant updates
- Session journey visualization
- Active visitor count monitoring
- Page popularity statistics
- Country-based visitor distribution

### Interactive Dashboard

- Real-time connection status indicator
- Live event feed (newest events first)
- Active sessions with current page tracking
- Mini activity chart (last 10 minutes)
- Filter events by country and page
- Multi-dashboard support with connection count
- Auto-reconnection on connection loss

### WebSocket Communication

- Bidirectional real-time communication
- Event-driven architecture
- Connection management and monitoring
- Alert system for visitor spikes
- Dashboard action tracking

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Website(s)    │───▶│   API Server     │◄──▶│  Dashboard(s)   │
│                 │    │                  │    │                 │
│ Sends Events    │    │ • REST API       │    │ • WebSocket     │
│ via POST        │    │ • WebSocket      │    │ • Live Updates  │
│                 │    │ • Data Storage   │    │ • Interactions  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌──────────────────┐
                       │  In-Memory Store │
                       │                  │
                       │ • Active Sessions│
                       │ • Daily Stats    │
                       │ • Event History  │
                       └──────────────────┘
```

## 📋 Requirements

- Node.js (v14.0 or higher)
- npm (v6.0 or higher)
- Modern web browser with WebSocket support
- Postman (for testing API endpoints)

## 🚀 Installation

1. **Clone or create the project directory:**

   ```bash
   mkdir visitor-analytics-system
   cd visitor-analytics-system
   ```

2. **Create the project files:**

   - Copy the provided `server.js`, `package.json`, and create a `public` folder
   - Place `dashboard.html` in the `public` folder

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the server:**

   ```bash
   npm start
   ```

5. **Access the dashboard:**
   Open your browser and navigate to: `http://localhost:3000/dashboard.html`

## 📖 Usage

### Starting the System

1. **Start the server:**

   ```bash
   npm start
   ```

   You should see:

   ```
   Server running on http://localhost:3000
   WebSocket server is ready for connections
   ```

2. **Open the dashboard:**

   - Navigate to `http://localhost:3000/dashboard.html`
   - You should see "Connected" status in the top-right corner

3. **Test with sample events:**
   Use Postman or curl to send visitor events to the API

### Sending Visitor Events

**Example pageview event:**

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pageview",
    "page": "/home",
    "sessionId": "visitor-001",
    "timestamp": "2025-07-19T10:30:00Z",
    "country": "India",
    "metadata": {
      "device": "mobile",
      "referrer": "google.com"
    }
  }'
```

**Example click event:**

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "click",
    "page": "/products",
    "sessionId": "visitor-001",
    "timestamp": "2025-07-19T10:31:00Z",
    "country": "India",
    "metadata": {
      "element": "button",
      "device": "mobile"
    }
  }'
```

## 📚 API Documentation

### REST Endpoints

#### POST /api/events

Receives visitor events from websites.

**Request Body:**

```json
{
  "type": "pageview|click|session_end",
  "page": "/path/to/page",
  "sessionId": "unique-session-id",
  "timestamp": "2025-07-19T10:30:00Z",
  "country": "CountryName",
  "metadata": {
    "device": "desktop|mobile|tablet",
    "referrer": "example.com",
    "element": "button|link|image"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Event recorded"
}
```

#### GET /api/analytics/summary

Returns current analytics summary.

**Response:**

```json
{
  "totalActive": 5,
  "totalToday": 150,
  "pagesVisited": {
    "/home": 45,
    "/products": 30
  },
  "countries": {
    "India": 80,
    "USA": 70
  },
  "recentEvents": [...]
}
```

#### GET /api/analytics/sessions

Returns active sessions with their journey.

**Response:**

```json
[
  {
    "sessionId": "visitor-001",
    "startTime": "2025-07-19T10:30:00Z",
    "currentPage": "/products",
    "journey": ["/home", "/products"],
    "country": "India",
    "metadata": {...}
  }
]
```

## 🔌 WebSocket Events

### Server → Client Events

#### visitor_update

Sent when a new visitor event is received:

```json
{
  "type": "visitor_update",
  "data": {
    "event": {...},
    "stats": {
      "totalActive": 5,
      "totalToday": 150,
      "pagesVisited": {...}
    }
  }
}
```

#### user_connected

Sent when a new dashboard connects:

```json
{
  "type": "user_connected",
  "data": {
    "totalDashboards": 3,
    "connectedAt": "2025-07-19T10:30:00Z"
  }
}
```

#### session_activity

Real-time session tracking updates:

```json
{
  "type": "session_activity",
  "data": {
    "sessionId": "visitor-001",
    "currentPage": "/products",
    "journey": ["/home", "/products"],
    "duration": 45
  }
}
```

#### alert

Server-initiated alerts:

```json
{
  "type": "alert",
  "data": {
    "level": "info|warning|milestone",
    "message": "Alert message",
    "details": {...}
  }
}
```

### Client → Server Events

#### request_detailed_stats

Request filtered analytics:

```json
{
  "type": "request_detailed_stats",
  "filter": {
    "country": "India",
    "page": "/products"
  }
}
```

#### track_dashboard_action

Track dashboard user actions:

```json
{
  "type": "track_dashboard_action",
  "action": "filter_applied",
  "details": {
    "filterType": "country",
    "value": "India"
  }
}
```

## 📊 Dashboard Features

### Real-Time Displays

- **Connection Status**: Visual indicator showing WebSocket connection status
- **Active Visitors**: Live count of currently browsing visitors
- **Total Today**: Unique visitors count for the current day
- **Activity Chart**: Visual representation of visitor activity over the last 10 minutes
- **Live Event Feed**: Real-time stream of visitor events (newest first)
- **Active Sessions**: List of current sessions with their journey paths

### Interactive Features

- **Country Filter**: Filter events by visitor country
- **Page Filter**: Filter events by specific pages
- **Session Details**: Click on any session to view detailed information
- **Clear Statistics**: Reset all analytics data
- **Multi-Dashboard Support**: Shows count of connected dashboards

### Visual Elements

- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Animations**: Smooth transitions and live updates
- **Status Indicators**: Color-coded connection status
- **Alert System**: Pop-up notifications for important events
- **Auto-reconnection**: Automatically reconnects if connection is lost

## 🧪 Testing

### Manual Testing with Postman

1. **Test basic pageview:**

   ```json
   POST http://localhost:3000/api/events
   {
     "type": "pageview",
     "page": "/home",
     "sessionId": "test-001",
     "timestamp": "2025-07-19T10:30:00Z",
     "country": "India"
   }
   ```

2. **Test session navigation:**

   ```json
   POST http://localhost:3000/api/events
   {
     "type": "pageview",
     "page": "/products",
     "sessionId": "test-001",
     "timestamp": "2025-07-19T10:30:30Z",
     "country": "India"
   }
   ```

3. **Test multiple dashboards:**
   - Open multiple browser tabs to `http://localhost:3000/dashboard.html`
   - Observe the dashboard count increase
   - Send events and watch all dashboards update simultaneously

### Testing Multi-Dashboard Functionality

**Setup:**

- Tab 1: Dashboard (`http://localhost:3000/dashboard.html`)
- Tab 2: Another Dashboard (same URL)
- Tab 3: Postman for sending events

**Verification:**

- Check dashboard count shows "2" in both tabs
- Send an event via Postman
- Verify both dashboards receive updates instantly
- Apply filters in one dashboard
- Check WebSocket messages in browser DevTools (Network → WS tab)

1. **Install nodemon for auto-restart:**

   ```bash
   npm install -g nodemon
   ```

2. **Start in development mode:**
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file for configuration:

```env
PORT=3000
NODE_ENV=development
MAX_RECONNECT_ATTEMPTS=5
SESSION_TIMEOUT=1800000
```

### Adding Database Support

To persist data across server restarts, consider integrating:

- **MongoDB** for document-based storage
- **Redis** for fast session storage
- **PostgreSQL** for structured analytics data

### Scaling Considerations

For production deployment:

- **Load Balancing**: Use sticky sessions for WebSocket connections
- **Message Queue**: Implement Redis pub/sub for multi-server setups
- **Database**: Replace in-memory storage with persistent database
- **Monitoring**: Add health checks and performance monitoring
- **Security**: Implement rate limiting and input validation

## 🐛 Troubleshooting

### Common Issues

#### WebSocket Connection Failed

**Error:** `WebSocket connection failed`

**Solution:**

- Ensure server is running on correct port
- Check firewall settings
- Verify WebSocket support in browser

#### Events Not Appearing

**Issue:** Events sent but dashboard not updating

**Solution:**

- Check WebSocket connection status
- Verify event format matches API specification
- Check browser console for JavaScript errors

### Scalability Features

- In-memory storage with optional database integration
- Modular architecture for easy extension
- Configurable limits and timeouts

**Built with ❤️ for real-time analytics**
