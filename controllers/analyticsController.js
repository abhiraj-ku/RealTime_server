const { analytics } = require("../models/Analytics");

const getSummary = (req, res) => {
  res.status(200).json({
    totalActive: analytics.activeSessions.size,
    totalToday: analytics.todayStats.totalVisitors,
    pagesVisited: analytics.todayStats.pagesVisited,
    countries: analytics.todayStats.countries,
    recentEvents: analytics.events.slice(-10),
  });
};

const getSessions = (req, res) => {
  res.status(200).json(Array.from(analytics.activeSessions.values()));
};

module.exports = {
  getSummary,
  getSessions,
};
