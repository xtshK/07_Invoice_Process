import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Briefcase, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getUserById, getInvoicesByUser } from '../data/mockData';

const UserPortfolio = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const user = getUserById(userId);
    const userInvoices = getInvoicesByUser(parseInt(userId));

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2>User not found</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const totalInvoiced = userInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidInvoices = userInvoices.filter(inv => inv.status === 'Paid');
    const pendingInvoices = userInvoices.filter(inv => inv.status === 'Pending');
    const overdueInvoices = userInvoices.filter(inv => inv.status === 'Overdue');

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '600' }}>User Portfolio</h1>
            </div>

            {/* User Profile Card */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                    <img
                        src={user.avatar}
                        alt={user.name}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '12px',
                            border: '4px solid var(--background-color)'
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>{user.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>{user.role} • {user.department}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    background: '#2C5CC515',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Mail size={20} color="#2C5CC5" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email</p>
                                    <p style={{ fontWeight: '500' }}>{user.email}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    background: '#22C55E15',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Phone size={20} color="#22C55E" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Phone</p>
                                    <p style={{ fontWeight: '500' }}>{user.phone}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    background: '#F59E0B15',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Calendar size={20} color="#F59E0B" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Join Date</p>
                                    <p style={{ fontWeight: '500' }}>{new Date(user.joinDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Invoiced</p>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>${totalInvoiced.toLocaleString()}</h3>
                </div>
                <div className="card">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Paid</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={20} color="#22C55E" />
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{paidInvoices.length}</h3>
                    </div>
                </div>
                <div className="card">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Pending</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={20} color="#F59E0B" />
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{pendingInvoices.length}</h3>
                    </div>
                </div>
                <div className="card">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Overdue</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={20} color="#EF4444" />
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{overdueInvoices.length}</h3>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Invoice History</h2>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Invoice ID</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Issue Date</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Due Date</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Amount</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userInvoices.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    style={{
                                        borderBottom: '1px solid var(--border-color)',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{invoice.id}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                                        {new Date(invoice.issueDate).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                                        {new Date(invoice.dueDate).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>${invoice.amount.toLocaleString()}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '9999px',
                                            background: invoice.status === 'Paid' ? '#22C55E15' : invoice.status === 'Pending' ? '#F59E0B15' : '#EF444415',
                                            color: invoice.status === 'Paid' ? '#22C55E' : invoice.status === 'Pending' ? '#F59E0B' : '#EF4444',
                                            fontWeight: '500'
                                        }}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                                        {invoice.items.length} items
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserPortfolio;
