// Authentication Service
// Handles user registration, login, and session management
// Uses localStorage for demo purposes - in production, use a backend API

const USERS_STORAGE_KEY = 'invoicesys_users';
const CURRENT_USER_KEY = 'invoicesys_current_user';
const SESSION_KEY = 'invoicesys_session';

// Helper: Hash password (simple hash for demo - use bcrypt in production)
const hashPassword = (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
};

// Get all users from storage
export const getUsers = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
};

// Save users to storage
const saveUsers = (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Register a new user
export const register = ({ name, email, password, department = '', role = 'User' }) => {
    const users = getUsers();

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return {
            success: false,
            error: 'Email already registered',
        };
    }

    // Validate inputs
    if (!name || name.trim().length < 2) {
        return {
            success: false,
            error: 'Name must be at least 2 characters',
        };
    }

    if (!email || !email.includes('@')) {
        return {
            success: false,
            error: 'Please enter a valid email',
        };
    }

    if (!password || password.length < 6) {
        return {
            success: false,
            error: 'Password must be at least 6 characters',
        };
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashPassword(password),
        department,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2C5CC5&color=fff`,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        status: 'Active',
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after registration
    const session = createSession(newUser);

    return {
        success: true,
        user: sanitizeUser(newUser),
        session,
    };
};

// Login user
export const login = (email, password) => {
    const users = getUsers();

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return {
            success: false,
            error: 'Email not found. Please register first.',
        };
    }

    if (user.passwordHash !== hashPassword(password)) {
        return {
            success: false,
            error: 'Incorrect password',
        };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    saveUsers(users);

    // Create session
    const session = createSession(user);

    return {
        success: true,
        user: sanitizeUser(user),
        session,
    };
};

// Create session
const createSession = (user) => {
    const session = {
        userId: user.id,
        email: user.email,
        token: `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sanitizeUser(user)));

    // For backwards compatibility
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', user.email);

    return session;
};

// Remove sensitive data from user object
const sanitizeUser = (user) => {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};

// Get current user
export const getCurrentUser = () => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    if (!userJson) return null;

    const session = getSession();
    if (!session || new Date(session.expiresAt) < new Date()) {
        logout();
        return null;
    }

    return JSON.parse(userJson);
};

// Get current session
export const getSession = () => {
    const sessionJson = localStorage.getItem(SESSION_KEY);
    return sessionJson ? JSON.parse(sessionJson) : null;
};

// Check if user is logged in
export const isLoggedIn = () => {
    const session = getSession();
    if (!session) return false;

    if (new Date(session.expiresAt) < new Date()) {
        logout();
        return false;
    }

    return true;
};

// Logout user
export const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
};

// Update user profile
export const updateProfile = (userId, updates) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return {
            success: false,
            error: 'User not found',
        };
    }

    // Don't allow updating sensitive fields directly
    const { passwordHash, id, createdAt, ...allowedUpdates } = updates;

    users[userIndex] = {
        ...users[userIndex],
        ...allowedUpdates,
        avatar: updates.name
            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(updates.name)}&background=2C5CC5&color=fff`
            : users[userIndex].avatar,
    };

    saveUsers(users);

    // Update current user in session if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sanitizeUser(users[userIndex])));
    }

    return {
        success: true,
        user: sanitizeUser(users[userIndex]),
    };
};

// Change password
export const changePassword = (userId, currentPassword, newPassword) => {
    const users = getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
        return {
            success: false,
            error: 'User not found',
        };
    }

    if (user.passwordHash !== hashPassword(currentPassword)) {
        return {
            success: false,
            error: 'Current password is incorrect',
        };
    }

    if (newPassword.length < 6) {
        return {
            success: false,
            error: 'New password must be at least 6 characters',
        };
    }

    user.passwordHash = hashPassword(newPassword);
    saveUsers(users);

    return {
        success: true,
        message: 'Password changed successfully',
    };
};

// Delete account
export const deleteAccount = (userId, password) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return {
            success: false,
            error: 'User not found',
        };
    }

    if (users[userIndex].passwordHash !== hashPassword(password)) {
        return {
            success: false,
            error: 'Incorrect password',
        };
    }

    users.splice(userIndex, 1);
    saveUsers(users);
    logout();

    return {
        success: true,
        message: 'Account deleted successfully',
    };
};

// Initialize with demo accounts (optional)
export const initializeDemoAccounts = () => {
    const users = getUsers();
    if (users.length === 0) {
        // Create a demo admin account
        register({
            name: 'Admin User',
            email: 'admin@invoicesys.com',
            password: 'admin123',
            department: 'IT',
            role: 'Admin',
        });

        // Create a demo user account
        register({
            name: 'Demo User',
            email: 'demo@invoicesys.com',
            password: 'demo123',
            department: 'Sales',
            role: 'User',
        });

        // Clear auto-login from initialization
        logout();
    }
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
    getSession,
    isLoggedIn,
    updateProfile,
    changePassword,
    deleteAccount,
    getUsers,
    initializeDemoAccounts,
};
