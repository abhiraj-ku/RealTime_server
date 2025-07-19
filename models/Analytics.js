// We are storing everything in-Memory (can be replacaed with actual db )
module.exports = {
  analytics: {
    activeSessions: new Map(), // maintains active session map
    todayStats: {
      // maintains the required figures as mentioned in the assignment docs
      totalVisitors: 0,
      pagesVisited: {},
      countries: {},
    },
    events: [],
  },
  connectedClients: new Set(),
};
