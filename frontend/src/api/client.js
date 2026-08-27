/**
 * CashFlow OS - Centralized API Service Client
 * Interfaces directly with the Spring Boot Backend on /api
 */

// Get API base URL from environment variable (production) or use relative paths (development)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Store CSRF token in memory (cross-origin safe approach)
let storedCsrfToken = null;

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson && (errorJson.message || errorJson.error)) {
        errorMessage = errorJson.message || errorJson.error;
      }
    } catch {
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {
        // Fallback to HTTP status
      }
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  // Handle plain text responses (like upload transaction success message, collection message string, or AI test)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

function csrfToken() {
  return document.cookie.split('; ').find((cookie) => cookie.startsWith('XSRF-TOKEN='))?.split('=')[1];
}

// Fetch CSRF token from backend endpoint and store it in memory
async function fetchAndStoreCsrfToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      storedCsrfToken = data.token;
      return storedCsrfToken;
    }
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
  }
  return null;
}

async function apiFetch(url, options = {}) {
  const method = options.method || 'GET';
  const headers = new Headers(options.headers || {});
  
  // For state-changing requests, ensure we have a CSRF token
  if (method !== 'GET' && method !== 'HEAD') {
    // Fetch token if not already stored
    if (!storedCsrfToken) {
      await fetchAndStoreCsrfToken();
    }
    // Send token as header if available
    if (storedCsrfToken) {
      headers.set('X-XSRF-TOKEN', storedCsrfToken);
    }
  }
  return fetch(`${API_BASE_URL}${url}`, { ...options, headers, credentials: 'include' });
}

export const api = {
  signup: async (data) => handleResponse(await apiFetch('/api/auth/signup', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })),
  login: async (data) => handleResponse(await apiFetch('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })),
  logout: async () => handleResponse(await apiFetch('/api/auth/logout', { method: 'POST' })),
  getCurrentUser: async () => handleResponse(await apiFetch('/api/auth/me')),
  // 🏢 1. Business Management
  getBusinesses: async () => {
    const res = await apiFetch('/api/business');
    return handleResponse(res);
  },

  getBusinessById: async (id) => {
    const res = await apiFetch(`/api/business/${id}`);
    return handleResponse(res);
  },

  createBusiness: async (businessData) => {
    const res = await apiFetch('/api/business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(businessData),
    });
    return handleResponse(res);
  },

  // 💳 2. Transactions & CSV Import
  getTransactions: async (businessId) => {
    const res = await apiFetch(`/api/transactions/${businessId}`);
    return handleResponse(res);
  },

  createTransaction: async (transactionData) => {
    const res = await apiFetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactionData),
    });
    return handleResponse(res);
  },

  uploadTransactionsCsv: async (file, businessId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('businessId', businessId);

    const res = await apiFetch('/api/transactions/upload', {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },

  // 🧾 3. Invoices
  getInvoices: async (businessId) => {
    const res = await apiFetch(`/api/invoices/${businessId}`);
    return handleResponse(res);
  },

  getOverdueInvoices: async (businessId) => {
    const res = await apiFetch(`/api/invoices/overdue/${businessId}`);
    return handleResponse(res);
  },

  createInvoice: async (invoiceData) => {
    const res = await apiFetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });
    return handleResponse(res);
  },

  // 📈 4. Cash-Flow Forecast
  getForecast: async (businessId, days = 30) => {
    const res = await apiFetch(`/api/forecast/${businessId}?days=${days}`);
    return handleResponse(res);
  },

  // ⚠️ 5. Customer Risk & Payment Prediction
  getCustomerRisk: async (businessId) => {
    const res = await apiFetch(`/api/risk/${businessId}`);
    return handleResponse(res);
  },

  getPaymentPredictions: async (businessId) => {
    const res = await apiFetch(`/api/payment-prediction/${businessId}`);
    return handleResponse(res);
  },

  // 🏦 6. Financial Health & Recommendations
  getFinancialHealth: async (businessId) => {
    const res = await apiFetch(`/api/financial-health/${businessId}`);
    return handleResponse(res);
  },

  getRecommendation: async (businessId) => {
    const res = await apiFetch(`/api/recommendation/${businessId}`);
    return handleResponse(res);
  },

  // 🤖 7. AI Intelligence & Reminders
  getAIInsight: async (businessId) => {
    const res = await apiFetch(`/api/ai/insight/${businessId}`);
    return handleResponse(res);
  },

  generateCollectionMessage: async (requestData) => {
    const res = await apiFetch('/api/collection-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    return handleResponse(res);
  },

  testAI: async () => {
    const res = await apiFetch('/api/ai/test');
    return handleResponse(res);
  },

  // 🔮 8. Scenario Simulator
  applyScenario: async (businessId, scenarioData) => {
    const res = await apiFetch(`/api/scenario/${businessId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenarioData),
    });
    return handleResponse(res);
  },
};
