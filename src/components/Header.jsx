import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const displayName = user?.name || 'Guest User';
    const displayRole = user?.role || 'User';
    const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=Guest&background=64748B&color=fff`;

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input
                        type="text"
                        placeholder="Search invoices, users..."
                        style={{
                            width: '100%',
                            padding: '0.625rem 1rem 0.625rem 2.5rem',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            outline: 'none',
                            fontSize: '0.95rem',
                            background: '#F8FAFC'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button style={{ position: 'relative', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Bell size={20} />
                    <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span>
                </button>

                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', position: 'relative' }}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
                        <img src={avatarUrl} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{displayName}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{displayRole}</span>
                    </div>
                    <ChevronDown size={16} color="#64748B" style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '0.5rem',
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            minWidth: '200px',
                            overflow: 'hidden',
                            zIndex: 1000,
                        }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid #E2E8F0' }}>
                                <p style={{ fontWeight: '500', color: '#183247', marginBottom: '0.25rem' }}>{displayName}</p>
                                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>{user?.email || 'Not logged in'}</p>
                            </div>
                            <div style={{ padding: '0.5rem' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/settings'); setShowDropdown(false); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        color: '#475569',
                                        fontSize: '0.9rem',
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#F1F5F9'}
                                    onMouseLeave={(e) => e.target.style.background = 'none'}
                                >
                                    <User size={18} />
                                    Profile
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/settings'); setShowDropdown(false); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        color: '#475569',
                                        fontSize: '0.9rem',
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#F1F5F9'}
                                    onMouseLeave={(e) => e.target.style.background = 'none'}
                                >
                                    <Settings size={18} />
                                    Settings
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        color: '#EF4444',
                                        fontSize: '0.9rem',
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#FEF2F2'}
                                    onMouseLeave={(e) => e.target.style.background = 'none'}
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
