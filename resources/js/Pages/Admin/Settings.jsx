import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

const Settings = () => {
    const [settings, setSettings] = useState({
        minWithdrawal: 10,
        maxWithdrawal: 1000,
        pointsPerMinute: 0.5,
        autoApproveThreshold: 50,
        enableAutoApprove: false
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : parseFloat(value) || value
        }));
        setSaved(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log('Saving settings:', settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <AdminLayout>
            <Head title="Settings" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Configure P2E system parameters</p>
                </div>
            </div>

            <form onSubmit={handleSave}>
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div className="card-header">
                        <h3 className="card-title">💸 Withdrawal Settings</h3>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                        <div className="form-group">
                            <label className="form-label">Minimum Withdrawal Amount ($)</label>
                            <input
                                type="number"
                                name="minWithdrawal"
                                className="form-input"
                                value={settings.minWithdrawal}
                                onChange={handleChange}
                                min="1"
                                step="1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Maximum Withdrawal Amount ($)</label>
                            <input
                                type="number"
                                name="maxWithdrawal"
                                className="form-input"
                                value={settings.maxWithdrawal}
                                onChange={handleChange}
                                min="1"
                                step="1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Auto-Approve Threshold ($)</label>
                            <input
                                type="number"
                                name="autoApproveThreshold"
                                className="form-input"
                                value={settings.autoApproveThreshold}
                                onChange={handleChange}
                                min="0"
                                step="1"
                            />
                            <small style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                                Withdrawals below this amount will be auto-approved (if enabled)
                            </small>
                        </div>

                        <div className="form-group">
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    name="enableAutoApprove"
                                    checked={settings.enableAutoApprove}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span>Enable Auto-Approve for small withdrawals</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div className="card-header">
                        <h3 className="card-title">🎮 Earnings Settings</h3>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                        <div className="form-group">
                            <label className="form-label">Points Per Minute of Gameplay</label>
                            <input
                                type="number"
                                name="pointsPerMinute"
                                className="form-input"
                                value={settings.pointsPerMinute}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                            <small style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                                How many points/tokens users earn per minute of active gameplay
                            </small>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary">
                        Save Settings
                    </button>
                    {saved && (
                        <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>
                            ✓ Settings saved successfully
                        </span>
                    )}
                </div>
            </form>

            <div className="card" style={{ marginTop: '2rem' }}>
                <div className="card-header">
                    <h3 className="card-title">🔗 API Configuration</h3>
                </div>
                <div className="info-list">
                    <div className="info-item">
                        <span className="info-label">API Base URL</span>
                        <span className="wallet-address" style={{ maxWidth: 'none' }}>
                            https://api.revenger-browser.com/admin
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Blockchain Network</span>
                        <span className="info-value">Ethereum Mainnet</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Smart Contract</span>
                        <span className="wallet-address" style={{ maxWidth: 'none' }}>
                            0x1234...5678 (P2E Token)
                        </span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;
