import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

const Dashboard = ({ stats }) => {
    const [apkInfo, setApkInfo] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState('');

    useEffect(() => {
        loadApkInfo();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('admin_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        };
    };

    const loadApkInfo = async () => {
        try {
            const res = await fetch('/api/admin/apk-info', {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (data.success) {
                setApkInfo(data);
            }
        } catch (err) {
            console.error('Failed to load APK info:', err);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadSuccess(false);
        setUploadError('');

        const formData = new FormData();
        formData.append('apk', file);

        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch('/api/admin/upload-apk', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setUploadSuccess(true);
                loadApkInfo();
                setTimeout(() => setUploadSuccess(false), 3000);
            } else {
                setUploadError(data.message || 'Upload failed');
            }
        } catch (err) {
            setUploadError('Upload failed. Please try again.');
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Monitor your ecosystem, users, and economy</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary">👤</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.totalUsers || 0}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>⬇️</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.totalDownloads || 0}</div>
                        <div className="stat-label">Website Downloads</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon success">💰</div>
                    <div className="stat-content">
                        <div className="stat-value">${(stats?.totalEarned || 0).toFixed(2)}</div>
                        <div className="stat-label">Total Earned (All Users)</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon warning">⏳</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.pendingWithdrawals || 0}</div>
                        <div className="stat-label">Pending Withdrawals</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon danger">💸</div>
                    <div className="stat-content">
                        <div className="stat-value">${(stats?.pendingAmount || 0).toFixed(2)}</div>
                        <div className="stat-label">Pending Amount</div>
                    </div>
                </div>
            </div>

            {/* APK Upload Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header">
                    <h3 className="card-title">📱 APK Management</h3>
                </div>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    {/* Current APK Info */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <h4 style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                            Current APK
                        </h4>
                        {apkInfo?.exists ? (
                            <div className="info-list">
                                <div className="info-item">
                                    <span className="info-label">Filename</span>
                                    <span className="info-value">{apkInfo.filename}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Size</span>
                                    <span className="info-value">{formatBytes(apkInfo.size)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Status</span>
                                    <span className="badge badge-approved">● Ready</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: 'var(--color-warning)', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                                ⚠️ No APK uploaded yet
                            </div>
                        )}
                    </div>

                    {/* Upload Section */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <h4 style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                            Upload New APK
                        </h4>

                        {uploadError && (
                            <div style={{ color: 'var(--color-danger)', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                                ⚠️ {uploadError}
                            </div>
                        )}

                        <label
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '2rem',
                                border: '2px dashed var(--color-border)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: uploading ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                            }}
                        >
                            <input
                                type="file"
                                accept=".apk"
                                onChange={handleUpload}
                                disabled={uploading}
                                style={{ display: 'none' }}
                            />
                            {uploading ? (
                                <>
                                    <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</span>
                                    <span style={{ color: 'var(--color-primary)' }}>Uploading...</span>
                                </>
                            ) : uploadSuccess ? (
                                <>
                                    <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</span>
                                    <span style={{ color: 'var(--color-success)' }}>Upload Successful!</span>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</span>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>Click to upload APK</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Max 200MB</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Quick Actions</h3>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a href="/admin/withdrawals" className="btn btn-primary">
                        💸 View Pending Withdrawals
                    </a>
                    <a href="/admin/users" className="btn btn-ghost">
                        👤 Manage Users
                    </a>
                </div>
            </div>

            {/* System Status */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <div className="card-header">
                    <h3 className="card-title">System Status</h3>
                </div>
                <div className="info-list">
                    <div className="info-item">
                        <span className="info-label">API Status</span>
                        <span className="badge badge-approved">● Online</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Blockchain Connection</span>
                        <span className="badge badge-approved">● Connected</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Last Sync</span>
                        <span className="info-value">Just now</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
