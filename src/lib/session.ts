/**
 * Anonymous session management for tracking likes, views, and comments
 * without user authentication
 */

const SESSION_KEY = 'anon_session_id';

/**
 * Gets or creates an anonymous session ID for the current browser
 * @returns {string} The anonymous session ID (UUID v4)
 */
export function getAnonSessionId(): string {
  // Try to get from localStorage first
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    // Generate a new UUID
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}
