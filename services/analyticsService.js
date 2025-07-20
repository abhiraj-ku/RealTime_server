const { analytics } = require("../models/Analytics");
/**
 * Handles the Real Time Business logics like Update,filters and alerting
 */

// updateSessionData() - updtaes the latest changes
const updateSessionData = (event) => {
  const { sessionId, type, page, country } = event;

  if (type === "session_end") {
    analytics.activeSessions.delete(sessionId);
    return;
  }

  if (!analytics.activeSessions.has(sessionId)) {
    analytics.activeSessions.set(sessionId, {
      sessionId,
      startTime: event.timestamp,
      currentPage: page,
      journey: [page],
      country,
      lastActivity: event.timestamp,
      metaData: event.metaData || {},
    });
  } else {
    const session = analytics.activeSessions.get(sessionId);
    session.currentPage = page;
    session.lastActivity = event.timestamp;
    if (!session.journey.includes(page)) session.journey.push(page);
  }

  // Store event for analytics filtering
  analytics.events.push({
    sessionId,
    timestamp: event.timestamp,
    country,
    page,
  });
};

// updateTodayStats() - updates the page count for a visitor and
const updateTodayStats = (event) => {
  const { page, country, sessionId } = event;

  // Check for new visitor
  if (!analytics.sessionIdsForToday.has(sessionId)) {
    analytics.todayStats.totalVisitors++;
    analytics.sessionIdsForToday.add(sessionId);
  }

  // Update page visited count
  analytics.todayStats.pagesVisited[page] =
    (analytics.todayStats.pagesVisited[page] || 0) + 1;

  // Country-level stats
  if (country) {
    analytics.todayStats.countries[country] =
      (analytics.todayStats.countries[country] || 0) + 1;
  }
};

// getFilteredStats - filter events by country and/or page, return latest 50
const getFilteredStats = (filter = {}) => {
  const filteredEvents = analytics.events.filter((event) => {
    if (filter.country && event.country !== filter.country) return false;
    if (filter.page && event.page !== filter.page) return false;
    return true;
  });
  return {
    events: filteredEvents.slice(-50),
    totalFiltered: filteredEvents.length,
  };
};

// cleanInactiveSessions deleted in-active session for more than 20 minutes ago
const cleanInactiveSessions = () => {
  const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

  analytics.activeSessions.forEach((session, sessionId) => {
    if (new Date(session.lastAcitivity) < twentyMinutesAgo) {
      analytics.activeSessions.delete(sessionId);
    }
  });
};

module.exports = {
  updateSessionData,
  updateTodayStats,
  getFilteredStats,
  cleanInactiveSessions,
};
