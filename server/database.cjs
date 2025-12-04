const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// Create database file in server folder
const dbPath = path.join(__dirname, 'invoicesys.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables immediately
function initTables() {
    // Create users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            department TEXT,
            role TEXT DEFAULT 'User',
            avatar TEXT,
            status TEXT DEFAULT 'Active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        )
    `);

    // Create sessions table
    db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Create invoices table
    db.exec(`
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_number TEXT UNIQUE NOT NULL,
            user_id INTEGER,
            user_name TEXT,
            amount REAL NOT NULL,
            status TEXT DEFAULT 'Pending',
            due_date DATE,
            issue_date DATE,
            source TEXT DEFAULT 'manual',
            freshservice_id TEXT,
            raw_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
    `);

    // Create invoice_items table
    db.exec(`
        CREATE TABLE IF NOT EXISTS invoice_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id INTEGER NOT NULL,
            description TEXT NOT NULL,
            quantity INTEGER DEFAULT 1,
            unit_price REAL NOT NULL,
            FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
        )
    `);
}

// Initialize tables first before creating prepared statements
initTables();

// Initialize database (create demo accounts if needed)
function initializeDatabase() {
    console.log('Database initialized successfully');

    // Create demo accounts if no users exist
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount.count === 0) {
        createDemoAccounts();
    }
}

// Create demo accounts
function createDemoAccounts() {
    const adminHash = bcrypt.hashSync('admin123', 10);
    const demoHash = bcrypt.hashSync('demo123', 10);

    const insertUser = db.prepare(`
        INSERT INTO users (name, email, password_hash, department, role, avatar)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
        'Admin User',
        'admin@invoicesys.com',
        adminHash,
        'IT',
        'Admin',
        'https://ui-avatars.com/api/?name=Admin+User&background=2C5CC5&color=fff'
    );

    insertUser.run(
        'Demo User',
        'demo@invoicesys.com',
        demoHash,
        'Sales',
        'User',
        'https://ui-avatars.com/api/?name=Demo+User&background=22C55E&color=fff'
    );

    console.log('Demo accounts created');
}

// User operations - prepared statements created after tables exist
const userOperations = {
    findByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
    findById: db.prepare('SELECT * FROM users WHERE id = ?'),
    getAll: db.prepare('SELECT id, name, email, department, role, avatar, status, created_at, last_login FROM users ORDER BY created_at DESC'),

    create: db.prepare(`
        INSERT INTO users (name, email, password_hash, department, role, avatar)
        VALUES (?, ?, ?, ?, ?, ?)
    `),

    updateLastLogin: db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?'),

    update: db.prepare(`
        UPDATE users SET name = ?, department = ?, role = ?, avatar = ?
        WHERE id = ?
    `),

    delete: db.prepare('DELETE FROM users WHERE id = ?'),

    changePassword: db.prepare('UPDATE users SET password_hash = ? WHERE id = ?'),
};

// Session operations
const sessionOperations = {
    create: db.prepare(`
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES (?, ?, ?)
    `),

    findByToken: db.prepare(`
        SELECT s.*, u.id as user_id, u.name, u.email, u.department, u.role, u.avatar, u.status
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
    `),

    deleteByToken: db.prepare('DELETE FROM sessions WHERE token = ?'),
    deleteByUserId: db.prepare('DELETE FROM sessions WHERE user_id = ?'),
    deleteExpired: db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')"),
};

// Invoice operations
const invoiceOperations = {
    getAll: db.prepare('SELECT * FROM invoices ORDER BY created_at DESC'),
    findById: db.prepare('SELECT * FROM invoices WHERE id = ?'),
    findByNumber: db.prepare('SELECT * FROM invoices WHERE invoice_number = ?'),

    create: db.prepare(`
        INSERT INTO invoices (invoice_number, user_id, user_name, amount, status, due_date, issue_date, source, freshservice_id, raw_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),

    update: db.prepare(`
        UPDATE invoices SET user_id = ?, user_name = ?, amount = ?, status = ?, due_date = ?, issue_date = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `),

    delete: db.prepare('DELETE FROM invoices WHERE id = ?'),

    getStats: db.prepare(`
        SELECT
            COUNT(*) as total,
            SUM(amount) as total_amount,
            SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) as paid,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) as overdue
        FROM invoices
    `),
};

// Invoice items operations
const invoiceItemOperations = {
    getByInvoiceId: db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ?'),

    create: db.prepare(`
        INSERT INTO invoice_items (invoice_id, description, quantity, unit_price)
        VALUES (?, ?, ?, ?)
    `),

    deleteByInvoiceId: db.prepare('DELETE FROM invoice_items WHERE invoice_id = ?'),
};

module.exports = {
    db,
    initializeDatabase,
    userOperations,
    sessionOperations,
    invoiceOperations,
    invoiceItemOperations,
};
