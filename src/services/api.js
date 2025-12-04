// API Service - connects to SQLite backend
const API_BASE_URL = 'http://localhost:3001/api';

// Storage keys
const TOKEN_KEY = 'invoicesys_token';
const USER_KEY = 'invoicesys_user';

// Get stored token
const getToken = () => localStorage.getItem(TOKEN_KEY);

// Get stored user
const getStoredUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

// Save auth data
const saveAuth = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Clear auth data
const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Also clear old keys for backwards compatibility
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('invoicesys_current_user');
    localStorage.removeItem('invoicesys_session');
};

// Base fetch function with auth
const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `API Error: ${response.status}`);
    }

    return data;
};

// ============ AUTH API ============

export const authApi = {
    // Register new user
    register: async ({ name, email, password, department, role }) => {
        try {
            const data = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, department, role }),
            });

            if (data.success) {
                saveAuth(data.token, data.user);
            }

            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Login
    login: async (email, password) => {
        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            if (data.success) {
                saveAuth(data.token, data.user);
            }

            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Logout
    logout: async () => {
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
        } catch (error) {
            // Ignore errors on logout
        }
        clearAuth();
    },

    // Get current user
    getCurrentUser: () => {
        return getStoredUser();
    },

    // Check if logged in
    isLoggedIn: () => {
        return !!getToken() && !!getStoredUser();
    },

    // Refresh user data from server
    refreshUser: async () => {
        try {
            const data = await apiFetch('/auth/me');
            if (data.success) {
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                return data.user;
            }
            return null;
        } catch (error) {
            clearAuth();
            return null;
        }
    },
};

// ============ USERS API ============

export const usersApi = {
    // Get all users
    getAll: async () => {
        try {
            const data = await apiFetch('/users');
            return data;
        } catch (error) {
            return { success: false, error: error.message, users: [] };
        }
    },

    // Get user by ID
    getById: async (id) => {
        try {
            const data = await apiFetch(`/users/${id}`);
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update user
    update: async (id, updates) => {
        try {
            const data = await apiFetch(`/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete user
    delete: async (id) => {
        try {
            const data = await apiFetch(`/users/${id}`, {
                method: 'DELETE',
            });
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Change password
    changePassword: async (id, currentPassword, newPassword) => {
        try {
            const data = await apiFetch(`/users/${id}/change-password`, {
                method: 'POST',
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

// ============ INVOICES API ============

export const invoicesApi = {
    // Get all invoices
    getAll: async () => {
        try {
            const data = await apiFetch('/invoices');
            return data;
        } catch (error) {
            return { success: false, error: error.message, invoices: [] };
        }
    },

    // Get invoice stats
    getStats: async () => {
        try {
            const data = await apiFetch('/invoices/stats');
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Create invoice
    create: async (invoice) => {
        try {
            const data = await apiFetch('/invoices', {
                method: 'POST',
                body: JSON.stringify(invoice),
            });
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete invoice
    delete: async (id) => {
        try {
            const data = await apiFetch(`/invoices/${id}`, {
                method: 'DELETE',
            });
            return data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

// Health check
export const checkApiHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
};

export default {
    auth: authApi,
    users: usersApi,
    invoices: invoicesApi,
    checkHealth: checkApiHealth,
};
