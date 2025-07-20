require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const analyticsRoytes = require("./routes/analyticsRoute");
const { analytics } = require("./models/Analytics");

const {
  updateSessionData,
  updateTodayStats,
  cleanInactiveSessions,
} = require("./services/analyticsService");
const { setupWebSocket, broadcast } = require("./websockets/socketmanager");
const app = express();
const server = http.createServer(app);
setupWebSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/v1/analytics", analyticsRoytes);

app.post("/api/v1/events", (req, res) => {
  const event = req.body;

  if (!event.type || !event.sessionId || !event.timestamp) {
    return res.status(400).json({ error: "Missing fields" });
  }

  analytics.events.push({ ...event, receivedAt: new Date().toISOString() });
  updateSessionData(event);
  updateTodayStats(event);

  broadcast({
    type: "visitor_update",
    data: {
      event,
      stats: {
        totalActive: analytics.activeSessions.size,
        totalToday: analytics.todayStats.totalVisitors,
        pagesVisited: analytics.todayStats.pagesVisited,
        countries: analytics.todayStats.countries,
      },
    },
  });
  res.json({ success: true, message: "Event recorded" });
});

// Cleanup old sessions
setInterval(() => {
  cleanInactiveSessions();
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
