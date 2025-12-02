export const users = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@acmecorp.com',
        role: 'Senior Manager',
        department: 'Operations',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=2C5CC5&color=fff',
        phone: '+1 (555) 123-4567',
        joinDate: '2022-03-15',
        status: 'Active',
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@techstart.io',
        role: 'Product Manager',
        department: 'Product',
        avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=22C55E&color=fff',
        phone: '+1 (555) 234-5678',
        joinDate: '2021-08-20',
        status: 'Active',
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@innovate.com',
        role: 'Finance Director',
        department: 'Finance',
        avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F59E0B&color=fff',
        phone: '+1 (555) 345-6789',
        joinDate: '2020-11-10',
        status: 'Active',
    },
    {
        id: 4,
        name: 'David Kim',
        email: 'david.kim@globalventures.com',
        role: 'Account Executive',
        department: 'Sales',
        avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=8B5CF6&color=fff',
        phone: '+1 (555) 456-7890',
        joinDate: '2023-01-05',
        status: 'Active',
    },
    {
        id: 5,
        name: 'Jessica Taylor',
        email: 'jessica.taylor@enterprise.net',
        role: 'VP Engineering',
        department: 'Engineering',
        avatar: 'https://ui-avatars.com/api/?name=Jessica+Taylor&background=EF4444&color=fff',
        phone: '+1 (555) 567-8901',
        joinDate: '2019-07-12',
        status: 'Active',
    },
];

export const invoices = [
    {
        id: 'INV-2024-001',
        userId: 1,
        userName: 'Sarah Johnson',
        amount: 4250.00,
        status: 'Paid',
        dueDate: '2024-11-15',
        issueDate: '2024-10-15',
        items: [
            { description: 'Professional Services - Q4', quantity: 1, unitPrice: 3500.00 },
            { description: 'Software License', quantity: 1, unitPrice: 750.00 },
        ],
    },
    {
        id: 'INV-2024-002',
        userId: 2,
        userName: 'Michael Chen',
        amount: 8900.00,
        status: 'Pending',
        dueDate: '2024-12-10',
        issueDate: '2024-11-10',
        items: [
            { description: 'Consulting Services', quantity: 40, unitPrice: 200.00 },
            { description: 'Platform Access Fee', quantity: 1, unitPrice: 900.00 },
        ],
    },
    {
        id: 'INV-2024-003',
        userId: 3,
        userName: 'Emily Rodriguez',
        amount: 12500.00,
        status: 'Paid',
        dueDate: '2024-11-20',
        issueDate: '2024-10-20',
        items: [
            { description: 'Annual Subscription', quantity: 1, unitPrice: 12500.00 },
        ],
    },
    {
        id: 'INV-2024-004',
        userId: 1,
        userName: 'Sarah Johnson',
        amount: 3200.00,
        status: 'Overdue',
        dueDate: '2024-10-30',
        issueDate: '2024-09-30',
        items: [
            { description: 'Support Services', quantity: 1, unitPrice: 3200.00 },
        ],
    },
    {
        id: 'INV-2024-005',
        userId: 4,
        userName: 'David Kim',
        amount: 6700.00,
        status: 'Pending',
        dueDate: '2024-12-15',
        issueDate: '2024-11-15',
        items: [
            { description: 'Marketing Campaign', quantity: 1, unitPrice: 5000.00 },
            { description: 'Analytics Tools', quantity: 1, unitPrice: 1700.00 },
        ],
    },
    {
        id: 'INV-2024-006',
        userId: 5,
        userName: 'Jessica Taylor',
        amount: 15800.00,
        status: 'Paid',
        dueDate: '2024-11-25',
        issueDate: '2024-10-25',
        items: [
            { description: 'Enterprise License', quantity: 1, unitPrice: 15800.00 },
        ],
    },
    {
        id: 'INV-2024-007',
        userId: 2,
        userName: 'Michael Chen',
        amount: 4500.00,
        status: 'Pending',
        dueDate: '2024-12-20',
        issueDate: '2024-11-20',
        items: [
            { description: 'Training Program', quantity: 1, unitPrice: 4500.00 },
        ],
    },
];

export const getInvoicesByUser = (userId) => {
    return invoices.filter(invoice => invoice.userId === userId);
};

export const getUserById = (userId) => {
    return users.find(user => user.id === parseInt(userId));
};

export const stats = {
    totalInvoices: invoices.length,
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidInvoices: invoices.filter(inv => inv.status === 'Paid').length,
    pendingInvoices: invoices.filter(inv => inv.status === 'Pending').length,
    overdueInvoices: invoices.filter(inv => inv.status === 'Overdue').length,
};
