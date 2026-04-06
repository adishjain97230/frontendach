/** Base URL for ML/chat endpoints (no trailing slash). */
export const API_BASE_URL = "https://backendach.duckdns.org";

export const CHATBOT_CHAT_PATH = "/machine-learning/chatbot/chat/";

export const CHATBOT_CHAT_URL = `${API_BASE_URL}${CHATBOT_CHAT_PATH}`;

export const WORDLE_GET_WORD_PATH = "/wordle/get-word/";

export const WORDLE_CHECK_WORD_PATH = "/wordle/check-word/";

export const WORDLE_GET_WORD_URL = `${API_BASE_URL}${WORDLE_GET_WORD_PATH}`;

export const WORDLE_CHECK_WORD_URL = `${API_BASE_URL}${WORDLE_CHECK_WORD_PATH}`;
