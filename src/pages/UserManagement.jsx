import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Users,
    Trash2,
    Shield,
    Mail,
    Building,
    Calendar,
    Clock,
    RefreshCw,
} from 'lucide-react';
import { authApi, usersApi } from '../services/api';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const loadUsers = async () => {
        const result = await usersApi.getAll();
        if (result.success) {
            setUsers(result.users);
        }
        setCurrentUser(authApi.getCurrentUser());
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDeleteUser = async (userId) => {
        if (currentUser && currentUser.id === userId) {
            alert('Cannot delete your own account from here!');
            return;
        }

        if (confirm('Are you sure you want to delete this user?')) {
            const result = await usersApi.delete(userId);
            if (result.success) {
                loadUsers();
            } else {
                alert(result.error || 'Failed to delete user');
            }
        }
    };

    const getRoleBadgeStyle = (role) => {
        switch (role) {
            case 'Admin':
                return { background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' };
            case 'Manager':
                return { background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' };
            default:
                return { background: 'rgba(71, 193, 191, 0.2)', color: '#47C1BF' };
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'none',
                            border: 'none',
                            color: '#9BA7B6',
                            cursor: 'pointer',
                            padding: '0.5rem',
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                            User Management
                        </h1>
                        <p style={{ color: '#9BA7B6', fontSize: '0.875rem' }}>
                            View and manage registered users
                        </p>
                    </div>
                </div>
                <button
                    onClick={loadUsers}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(71, 193, 191, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={24} style={{ color: '#47C1BF' }} />
                        </div>
                        <div>
                            <p style={{ color: '#9BA7B6', fontSize: '0.875rem' }}>Total Users</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{users.length}</p>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={24} style={{ color: '#EF4444' }} />
                        </div>
                        <div>
                            <p style={{ color: '#9BA7B6', fontSize: '0.875rem' }}>Admins</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{users.filter(u => u.role === 'Admin').length}</p>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={24} style={{ color: '#F59E0B' }} />
                        </div>
                        <div>
                            <p style={{ color: '#9BA7B6', fontSize: '0.875rem' }}>Managers</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{users.filter(u => u.role === 'Manager').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* User List */}
            <div className="card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Registered Users</h2>
                </div>

                {users.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#9BA7B6' }}>
                        <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No users registered yet</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            Users will appear here after registration
                        </p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>User</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Department</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Registered</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Last Login</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr
                                        key={user.id}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            background: currentUser && currentUser.id === user.id ? 'rgba(71, 193, 191, 0.1)' : 'transparent',
                                        }}
                                    >
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                                                />
                                                <div>
                                                    <p style={{ fontWeight: '500' }}>
                                                        {user.name}
                                                        {currentUser && currentUser.id === user.id && (
                                                            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#47C1BF' }}>(You)</span>
                                                        )}
                                                    </p>
                                                    <p style={{ fontSize: '0.75rem', color: '#9BA7B6' }}>ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9BA7B6' }}>
                                                <Mail size={14} />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9BA7B6' }}>
                                                <Building size={14} />
                                                {user.department || '-'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                ...getRoleBadgeStyle(user.role),
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9BA7B6', fontSize: '0.875rem' }}>
                                                <Calendar size={14} />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9BA7B6', fontSize: '0.875rem' }}>
                                                <Clock size={14} />
                                                {formatDate(user.lastLogin)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={currentUser && currentUser.id === user.id}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: currentUser && currentUser.id === user.id ? 'not-allowed' : 'pointer',
                                                    color: currentUser && currentUser.id === user.id ? '#64748B' : '#EF4444',
                                                    opacity: currentUser && currentUser.id === user.id ? 0.5 : 1,
                                                    borderRadius: '6px',
                                                }}
                                                title={currentUser && currentUser.id === user.id ? "Cannot delete your own account" : "Delete user"}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Storage Info */}
            <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Storage Information</h3>
                <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem', color: '#9BA7B6' }}>
                    <p><strong>Storage Type:</strong> SQLite Database</p>
                    <p><strong>Database File:</strong> server/invoicesys.db</p>
                    <p><strong>Note:</strong> Data is stored in SQLite database on the server.</p>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
