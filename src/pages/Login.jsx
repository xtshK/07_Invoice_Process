import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (authApi.isLoggedIn()) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);

        const result = await authApi.login(formData.email, formData.password);

        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginCard}>
                <div style={styles.logoSection}>
                    <div style={styles.logo}>
                        IS
                    </div>
                    <h1 style={styles.title}>InvoiceSystem</h1>
                    <p style={styles.subtitle}>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && (
                        <div style={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={18} style={styles.inputIcon} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.inputIcon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                style={styles.input}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div style={styles.options}>
                        <label style={styles.rememberMe}>
                            <input type="checkbox" style={styles.checkbox} />
                            <span>Remember me</span>
                        </label>
                        <a href="#" style={styles.forgotLink}>Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.submitButton,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <p style={styles.signupText}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.signupLink}>Sign up</Link>
                    </p>

                    <div style={styles.demoInfo}>
                        <p style={styles.demoTitle}>Demo Accounts:</p>
                        <p style={styles.demoAccount}>admin@invoicesys.com / admin123</p>
                        <p style={styles.demoAccount}>demo@invoicesys.com / demo123</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #12344D 0%, #2C5CC5 100%)',
        padding: '1rem',
    },
    loginCard: {
        background: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    logo: {
        width: '56px',
        height: '56px',
        background: '#2C5CC5',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.25rem',
        margin: '0 auto 1rem',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#183247',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: '#64748B',
        fontSize: '0.95rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    errorMessage: {
        background: '#FEE2E2',
        color: '#DC2626',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        fontSize: '0.875rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#183247',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: '12px',
        color: '#64748B',
        pointerEvents: 'none',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem 0.75rem 2.75rem',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    eyeButton: {
        position: 'absolute',
        right: '12px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#64748B',
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
    },
    options: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
    },
    rememberMe: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#64748B',
        cursor: 'pointer',
    },
    checkbox: {
        width: '16px',
        height: '16px',
        cursor: 'pointer',
    },
    forgotLink: {
        color: '#2C5CC5',
        textDecoration: 'none',
        fontWeight: '500',
    },
    submitButton: {
        width: '100%',
        padding: '0.875rem',
        background: '#2C5CC5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    signupText: {
        textAlign: 'center',
        color: '#64748B',
        fontSize: '0.875rem',
    },
    signupLink: {
        color: '#2C5CC5',
        textDecoration: 'none',
        fontWeight: '500',
    },
    demoInfo: {
        marginTop: '1rem',
        padding: '1rem',
        background: '#F1F5F9',
        borderRadius: '8px',
        textAlign: 'center',
    },
    demoTitle: {
        fontSize: '0.8rem',
        fontWeight: '600',
        color: '#475569',
        marginBottom: '0.5rem',
    },
    demoAccount: {
        fontSize: '0.75rem',
        color: '#64748B',
        marginBottom: '0.25rem',
        fontFamily: 'monospace',
    },
};

export default Login;
