const WebSocket = require("ws");
const { analytics, connectedClients } = require("../models/Analytics");
const {
  updateSessionData,
  updateTodayStats,
  getFilteredStats,
} = require("../services/analyticsService");

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    connectedClients.add(ws);

    broadcast({
      type: "user_connected",
      data: {
        totalDashboards: connectedClients.size,
        connectedAt: new Date().toISOString(),
      },
    });

    wss.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === "request_detailed_stats") {
          const stats = getFilteredStats(data.filter);
          ws.send(JSON.stringify({ type: "detailed_stats", data: stats }));
        }
      } catch (error) {
        console.log("ws send error: ", error);
      }
    });

    ws.on("close", () => {
      connectedClients.delete(ws);
      broadcast({
        type: "user_disconnected",
        data: { totalDashboards: connectedClients.size },
      });
    });
    ws.send(
      JSON.stringify({
        type: "initial_data",
        data: {
          stats: {
            totalActive: analytics.activeSessions.size,
            totalToday: analytics.todayStats.totalVisitors,
            pagesVisited: analytics.todayStats.pagesVisited,
            countries: analytics.todayStats.countries,
          },
          sessions: Array.from(analytics.activeSessions.values()),
          totalDashboards: connectedClients.size,
        },
      })
    );
  });
  return wss;
};

// Broadcast function - sends the message to all connected clients
const broadcast = (message) => {
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

module.exports = {
  setupWebSocket,
  broadcast,
};
