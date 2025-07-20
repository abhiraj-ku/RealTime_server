const analytics = {
  activeSessions: new Map(),
  todayStats: {
    totalVisitors: 0,
    pagesVisited: {},
    countries: {},
  },
  sessionIdsForToday: new Set(), // <- track unique sessions
  events: [],
};

module.exports = { analytics, connectedClients: new Set() };
