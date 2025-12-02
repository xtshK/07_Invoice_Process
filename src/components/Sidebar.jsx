import { LayoutDashboard, Users, FileText, Settings, HelpCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Portfolios', path: '/portfolios' }, // Placeholder path
        { icon: FileText, label: 'Invoices', path: '/invoices' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="sidebar">
            <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', background: '#47C1BF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    IS
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.025em' }}>InvoiceSys</span>
            </div>

            <nav style={{ flex: 1, padding: '1rem 0' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1.5rem',
                            color: isActive ? '#47C1BF' : '#9BA7B6',
                            textDecoration: 'none',
                            borderLeft: isActive ? '3px solid #47C1BF' : '3px solid transparent',
                            background: isActive ? 'rgba(71, 193, 191, 0.1)' : 'transparent',
                        })}
                    >
                        <item.icon size={20} />
                        <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#9BA7B6' }}>
                    <HelpCircle size={20} />
                    <span>Support</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
