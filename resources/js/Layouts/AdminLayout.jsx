import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

const AdminLayout = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { url } = usePage();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('admin_token');
        const storedUser = localStorage.getItem('admin_user');

        if (!token || !storedUser) {
            // Not logged in - redirect to login
            window.location.href = '/admin/login';
            return;
        }

        // Verify token is still valid
        try {
            const res = await fetch('/api/admin/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.data);
                setIsLoading(false);
            } else {
                // Token invalid - clear and redirect
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                window.location.href = '/admin/login';
            }
        } catch (err) {
            // Error verifying - use stored user for now
            setUser(JSON.parse(storedUser));
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('admin_token');

        if (token) {
            await fetch('/api/admin/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
        }

        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
    };

    const isActive = (path) => url.startsWith(path);
    const isAdmin = () => user?.role === 'admin';

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--color-bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    <div>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">🎮</div>
                        <span className="sidebar-logo-text">Revenge Browser</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <div className="nav-section-title">Main</div>
                        <a
                            href="/admin/dashboard"
                            className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                        >
                            <span className="nav-icon">📊</span>
                            Dashboard
                        </a>
                    </div>

                    <div className="nav-section">
                        <div className="nav-section-title">Management</div>
                        <a
                            href="/admin/withdrawals"
                            className={`nav-link ${isActive('/admin/withdrawals') ? 'active' : ''}`}
                        >
                            <span className="nav-icon">💸</span>
                            Withdrawals
                        </a>
                        <a
                            href="/admin/users"
                            className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                        >
                            <span className="nav-icon">👤</span>
                            Users
                        </a>
                    </div>

                    {['admin', 'lead_moderator'].includes(user?.role) && (
                        <div className="nav-section">
                            <div className="nav-section-title">Team</div>
                            <a
                                href="/admin/team"
                                className={`nav-link ${isActive('/admin/team') ? 'active' : ''}`}
                            >
                                <span className="nav-icon">🛡️</span>
                                Manage Team
                            </a>
                        </div>
                    )}

                    {isAdmin() && (
                        <div className="nav-section">
                            <div className="nav-section-title">System</div>
                            <a
                                href="/admin/settings"
                                className={`nav-link ${isActive('/admin/settings') ? 'active' : ''}`}
                            >
                                <span className="nav-icon">⚙️</span>
                                Settings
                            </a>
                        </div>
                    )}
                </nav>

                {/* User Footer */}
                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
                        <div className="user-details">
                            <div className="user-name">{user?.name || 'Admin'}</div>
                            <div className="user-role">{user?.role || 'admin'}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
