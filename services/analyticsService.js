const { analytics } = require("../models/Analytics");
/**
 * Handles the Real Time Business logics like Update,filters and alerting
 */

// updateSessionData() - updtaes the latest changes
const updateSessionData = (event) => {
  const { sessionId, type, page, country } = event;

  // if typeof event== 'session_end' ; delete the current session data
  if (type === "session_end") {
    analytics.activeSessions.delete(sessionId);
    return;
  }

  /*
   * If no session id found,
   *  means we have found a new session ,
   *  add this sessionId to our inMemory schema
   */
  if (!analytics.activeSessions.has(sessionId)) {
    analytics.activeSessions.set(sessionId, {
      sessionId,
      startTime: event.timestamp,
      currentaPage: page,
      journey: [page],
      country,
      lastAcitivity: event.timestamp,
      metaData: event.metaData || {},
    });
  } else {
    // we have an active session, so we will update the details
    const session = analytics.activeSessions.get(sessionId);
    session.currentaPage = page;
    session.lastAcitivity = event.timestamp;

    if (!session.journey.includes(page)) {
      session.journey.push(page);
    }
  }
};

// updateTodayStats() - updates the page count for a visitor and
const updateTodayStats = (event) => {
  const { page, country, sessionId } = event;

  // if existing user comes , we will update his page count ,pageVisited and set country
  const existingSession = Array.from(analytics.activeSessions.keys());

  if (!existingSession.includes(sessionId)) {
    analytics.todayStats.totalVisitors++;
  }

  analytics.todayStats.pagesVisited[page] =
    (analytics.todayStats.pagesVisited[page] || 0) + 1;

  if (country) {
    analytics.todayStats.countries[country] =
      (analytics.todayStats.countries[country] || 0) + 1;
  }
};

// getFilteredStats filter out stats based on country and page for frontend
const getFilteredStats = (filter) => {
  let filteredEvents = analytics.events;

  if (filter) {
    if (filter.country) {
      filteredEvents = filteredEvents.filter(
        (e) => e.country === filter.country
      );
    }
    if (filter.page) {
      filteredEvents = filteredEvents.filter((e) => e.page === filter.page);
    }
  }
  return {
    events: filteredEvents.slice(-50),
    totalFiltered: filteredEvents.length,
  };
};

// cleanInactiveSessions deleted in-active session for more than 20 minutes ago
const cleanInactiveSessions = () => {
  const twentyMinutesAgo = new Date(Date.now(20 * 60 * 1000));
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
