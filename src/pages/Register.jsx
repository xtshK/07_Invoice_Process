import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, User, Building, Briefcase } from 'lucide-react';
import { authApi } from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        role: 'User',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await authApi.register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            department: formData.department,
            role: formData.role,
        });

        setLoading(false);

        if (result.success) {
            setSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } else {
            setError(result.error);
        }
    };

    const departments = [
        'IT',
        'Finance',
        'Sales',
        'Marketing',
        'Operations',
        'HR',
        'Engineering',
        'Product',
        'Other',
    ];

    return (
        <div style={styles.container}>
            <div style={styles.registerCard}>
                <div style={styles.logoSection}>
                    <div style={styles.logo}>
                        IS
                    </div>
                    <h1 style={styles.title}>Create Account</h1>
                    <p style={styles.subtitle}>Join InvoiceSys today</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && (
                        <div style={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={styles.successMessage}>
                            {success}
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name *</label>
                        <div style={styles.inputWrapper}>
                            <User size={18} style={styles.inputIcon} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address *</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={18} style={styles.inputIcon} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Department</label>
                            <div style={styles.inputWrapper}>
                                <Building size={18} style={styles.inputIcon} />
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    style={{ ...styles.input, paddingLeft: '2.75rem' }}
                                    disabled={loading}
                                >
                                    <option value="">Select department</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Role</label>
                            <div style={styles.inputWrapper}>
                                <Briefcase size={18} style={styles.inputIcon} />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    style={{ ...styles.input, paddingLeft: '2.75rem' }}
                                    disabled={loading}
                                >
                                    <option value="User">User</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password *</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.inputIcon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password (min 6 characters)"
                                style={styles.input}
                                disabled={loading}
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

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password *</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.inputIcon} />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                style={styles.input}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeButton}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
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
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <p style={styles.loginText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.loginLink}>Sign in</Link>
                    </p>
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
    registerCard: {
        background: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '500px',
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
        gap: '1rem',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    errorMessage: {
        background: '#FEE2E2',
        color: '#DC2626',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        fontSize: '0.875rem',
    },
    successMessage: {
        background: '#DCFCE7',
        color: '#16A34A',
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
        backgroundColor: '#FFFFFF',
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
        marginTop: '0.5rem',
    },
    loginText: {
        textAlign: 'center',
        color: '#64748B',
        fontSize: '0.875rem',
    },
    loginLink: {
        color: '#2C5CC5',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default Register;
