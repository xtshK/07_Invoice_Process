const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const {
    initializeDatabase,
    userOperations,
    sessionOperations,
    invoiceOperations,
    invoiceItemOperations,
} = require('./database.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// Auth middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const session = sessionOperations.findByToken.get(token);

    if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.user = {
        id: session.user_id,
        name: session.name,
        email: session.email,
        department: session.department,
        role: session.role,
        avatar: session.avatar,
        status: session.status,
    };
    req.token = token;
    next();
};

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', (req, res) => {
    try {
        const { name, email, password, department, role } = req.body;

        // Validation
        if (!name || name.trim().length < 2) {
            return res.status(400).json({ error: 'Name must be at least 2 characters' });
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Please enter a valid email' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if email exists
        const existingUser = userOperations.findByEmail.get(email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user
        const passwordHash = bcrypt.hashSync(password, 10);
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2C5CC5&color=fff`;

        const result = userOperations.create.run(
            name.trim(),
            email.toLowerCase().trim(),
            passwordHash,
            department || null,
            role || 'User',
            avatar
        );

        const userId = result.lastInsertRowid;

        // Create session
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        sessionOperations.create.run(userId, token, expiresAt);

        // Get user data
        const user = userOperations.findById.get(userId);
        const { password_hash, ...safeUser } = user;

        res.status(201).json({
            success: true,
            user: safeUser,
            token,
            expiresAt,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        const user = userOperations.findByEmail.get(email.toLowerCase());
        if (!user) {
            return res.status(400).json({ error: 'Email not found. Please register first.' });
        }

        if (!bcrypt.compareSync(password, user.password_hash)) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // Update last login
        userOperations.updateLastLogin.run(user.id);

        // Create session
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        sessionOperations.create.run(user.id, token, expiresAt);

        const { password_hash, ...safeUser } = user;

        res.json({
            success: true,
            user: safeUser,
            token,
            expiresAt,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout
app.post('/api/auth/logout', authenticate, (req, res) => {
    try {
        sessionOperations.deleteByToken.run(req.token);
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
app.get('/api/auth/me', authenticate, (req, res) => {
    res.json({ success: true, user: req.user });
});

// ============ USER ROUTES ============

// Get all users
app.get('/api/users', authenticate, (req, res) => {
    try {
        const users = userOperations.getAll.all();
        res.json({ success: true, users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user by ID
app.get('/api/users/:id', authenticate, (req, res) => {
    try {
        const user = userOperations.findById.get(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { password_hash, ...safeUser } = user;
        res.json({ success: true, user: safeUser });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user
app.put('/api/users/:id', authenticate, (req, res) => {
    try {
        const { name, department, role } = req.body;
        const userId = parseInt(req.params.id);

        const user = userOperations.findById.get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const avatar = name
            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2C5CC5&color=fff`
            : user.avatar;

        userOperations.update.run(
            name || user.name,
            department !== undefined ? department : user.department,
            role || user.role,
            avatar,
            userId
        );

        const updatedUser = userOperations.findById.get(userId);
        const { password_hash, ...safeUser } = updatedUser;
        res.json({ success: true, user: safeUser });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user
app.delete('/api/users/:id', authenticate, (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (userId === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const user = userOperations.findById.get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete user's sessions first
        sessionOperations.deleteByUserId.run(userId);
        // Delete user
        userOperations.delete.run(userId);

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Change password
app.post('/api/users/:id/change-password', authenticate, (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { currentPassword, newPassword } = req.body;

        if (userId !== req.user.id) {
            return res.status(403).json({ error: 'Can only change your own password' });
        }

        const user = userOperations.findById.get(userId);
        if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        const newHash = bcrypt.hashSync(newPassword, 10);
        userOperations.changePassword.run(newHash, userId);

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============ INVOICE ROUTES ============

// Get all invoices
app.get('/api/invoices', authenticate, (req, res) => {
    try {
        const invoices = invoiceOperations.getAll.all();

        // Get items for each invoice
        const invoicesWithItems = invoices.map(invoice => ({
            ...invoice,
            items: invoiceItemOperations.getByInvoiceId.all(invoice.id),
            raw_data: invoice.raw_data ? JSON.parse(invoice.raw_data) : null,
        }));

        res.json({ success: true, invoices: invoicesWithItems });
    } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get invoice stats
app.get('/api/invoices/stats', authenticate, (req, res) => {
    try {
        const stats = invoiceOperations.getStats.get();
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create invoice
app.post('/api/invoices', authenticate, (req, res) => {
    try {
        const { invoice_number, user_id, user_name, amount, status, due_date, issue_date, items, source, freshservice_id, raw_data } = req.body;

        // Generate invoice number if not provided
        const invNumber = invoice_number || `INV-${Date.now()}`;

        const result = invoiceOperations.create.run(
            invNumber,
            user_id || null,
            user_name || null,
            amount,
            status || 'Pending',
            due_date || null,
            issue_date || new Date().toISOString().split('T')[0],
            source || 'manual',
            freshservice_id || null,
            raw_data ? JSON.stringify(raw_data) : null
        );

        const invoiceId = result.lastInsertRowid;

        // Add invoice items
        if (items && items.length > 0) {
            items.forEach(item => {
                invoiceItemOperations.create.run(
                    invoiceId,
                    item.description,
                    item.quantity || 1,
                    item.unit_price || item.unitPrice || 0
                );
            });
        }

        const invoice = invoiceOperations.findById.get(invoiceId);
        const invoiceItems = invoiceItemOperations.getByInvoiceId.all(invoiceId);

        res.status(201).json({
            success: true,
            invoice: { ...invoice, items: invoiceItems },
        });
    } catch (error) {
        console.error('Create invoice error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete invoice
app.delete('/api/invoices/:id', authenticate, (req, res) => {
    try {
        const invoiceId = parseInt(req.params.id);

        const invoice = invoiceOperations.findById.get(invoiceId);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        invoiceItemOperations.deleteByInvoiceId.run(invoiceId);
        invoiceOperations.delete.run(invoiceId);

        res.json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Delete invoice error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
