import { TrendingUp, DollarSign, FileText, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { users, invoices, stats } from '../data/mockData';

const Dashboard = () => {
    const statCards = [
        {
            label: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: '#22C55E',
        },
        {
            label: 'Total Invoices',
            value: stats.totalInvoices,
            change: '+8',
            trend: 'up',
            icon: FileText,
            color: '#2C5CC5',
        },
        {
            label: 'Pending',
            value: stats.pendingInvoices,
            change: '-2',
            trend: 'down',
            icon: TrendingUp,
            color: '#F59E0B',
        },
        {
            label: 'Overdue',
            value: stats.overdueInvoices,
            change: '+1',
            trend: 'up',
            icon: AlertCircle,
            color: '#EF4444',
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's an overview of your invoices.</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {statCards.map((stat) => (
                    <div key={stat.label} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{stat.value}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight size={16} color={stat.trend === 'up' && stat.label !== 'Overdue' ? '#22C55E' : '#EF4444'} />
                                    ) : (
                                        <ArrowDownRight size={16} color="#22C55E" />
                                    )}
                                    <span style={{ color: stat.trend === 'up' && stat.label !== 'Overdue' ? '#22C55E' : stat.trend === 'down' ? '#22C55E' : '#EF4444' }}>
                                        {stat.change}
                                    </span>
                                    <span style={{ color: 'var(--text-secondary)' }}>this month</span>
                                </div>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `${stat.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <stat.icon size={24} color={stat.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Invoices and User Portfolio */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Invoices */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Invoices</h2>
                    </div>
                    <div style={{ padding: '0' }}>
                        {invoices.slice(0, 5).map((invoice) => (
                            <div
                                key={invoice.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem 1.5rem',
                                    borderBottom: '1px solid var(--border-color)',
                                    transition: 'background-color 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div>
                                    <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{invoice.id}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{invoice.userName}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>${invoice.amount.toLocaleString()}</p>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        background: invoice.status === 'Paid' ? '#22C55E15' : invoice.status === 'Pending' ? '#F59E0B15' : '#EF444415',
                                        color: invoice.status === 'Paid' ? '#22C55E' : invoice.status === 'Pending' ? '#F59E0B' : '#EF4444',
                                        fontWeight: '500'
                                    }}>
                                        {invoice.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Portfolio */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>User Portfolio</h2>
                    </div>
                    <div style={{ padding: '0' }}>
                        {users.slice(0, 5).map((user) => {
                            const userInvoices = invoices.filter(inv => inv.userId === user.id);
                            const totalAmount = userInvoices.reduce((sum, inv) => sum + inv.amount, 0);

                            return (
                                <Link
                                    to={`/portfolio/${user.id}`}
                                    key={user.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem 1.5rem',
                                        borderBottom: '1px solid var(--border-color)',
                                        transition: 'background-color 0.2s',
                                        textDecoration: 'none',
                                        color: 'inherit'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={user.avatar} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                        <div>
                                            <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{user.name}</p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{user.role}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>${totalAmount.toLocaleString()}</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{userInvoices.length} invoices</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
