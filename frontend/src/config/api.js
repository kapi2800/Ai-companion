/**
 * API Configuration
 *
 * Centralized configuration for all API endpoints
 */

// Deployed Gemini AI API
export const API_CONFIG = {
  CHAT_URL: "https://cyphers101.onrender.com/api/chat",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 2,
};

/**
 * Make a chat API request with retry logic
 * @param {string} message - User message
 * @param {boolean} generateAudio - Whether to generate audio response
 * @returns {Promise<string>} AI response text
 */
export const sendChatMessage = async (message, generateAudio = false) => {
  let attempts = 0;
  const maxAttempts = API_CONFIG.RETRY_ATTEMPTS;

  while (attempts < maxAttempts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.TIMEOUT
      );

      const response = await fetch(API_CONFIG.CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          generateAudio,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Parse response (handles both JSON wrapped and plain text)
      try {
        const clean = data.messages[0].text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        const messages = Array.isArray(parsed) ? parsed : [parsed];
        return messages.map((m) => m.text).join("\n\n");
      } catch (parseError) {
        // Fallback to plain text
        return data.messages.map((m) => m.text).join("\n\n");
      }
    } catch (error) {
      attempts++;
      console.warn(`Attempt ${attempts}/${maxAttempts} failed:`, error.message);

      if (attempts >= maxAttempts) {
        if (error.name === "AbortError") {
          throw new Error("Request timed out. Please try again.");
        }
        throw new Error(
          "Failed to connect to AI service. Please check your connection."
        );
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    }
  }
};

export default API_CONFIG;
