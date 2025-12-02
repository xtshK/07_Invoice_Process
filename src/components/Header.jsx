import { Search, Bell, ChevronDown } from 'lucide-react';

const Header = () => {
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
                <button style={{ position: 'relative', color: '#64748B' }}>
                    <Bell size={20} />
                    <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=2C5CC5&color=fff" alt="User" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Admin User</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Administrator</span>
                    </div>
                    <ChevronDown size={16} color="#64748B" />
                </div>
            </div>
        </header>
    );
};

export default Header;
