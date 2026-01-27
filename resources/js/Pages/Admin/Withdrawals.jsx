import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

const Withdrawals = ({ withdrawals = [] }) => {
    const [filter, setFilter] = useState('pending');
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateAddress = (address) => {
        if (!address) return 'N/A';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleApprove = async (id) => {
        if (!confirm('Are you sure you want to approve this withdrawal?')) return;
        // API call would go here
        console.log('Approving:', id);
    };

    const handleReject = async (id) => {
        if (!confirm('Are you sure you want to reject this withdrawal?')) return;
        // API call would go here
        console.log('Rejecting:', id);
    };

    // Mock data for demonstration
    const mockWithdrawals = withdrawals.length > 0 ? withdrawals : [];

    return (
        <AdminLayout>
            <Head title="Withdrawals" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Withdrawals</h1>
                    <p className="page-subtitle">Manage user withdrawal requests</p>
                </div>
            </div>

            <div className="filter-bar">
                <select
                    className="form-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Wallet Address</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockWithdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan="6">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">📭</div>
                                            <div className="empty-state-text">No withdrawals found</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                mockWithdrawals.map((w) => (
                                    <tr key={w.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar">
                                                    {w.user?.device_id?.slice(-2).toUpperCase() || 'XX'}
                                                </div>
                                                <div>
                                                    <div className="user-name">{w.user?.device_id || 'Unknown'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                                            ${w.amount?.toFixed(2) || '0.00'}
                                        </td>
                                        <td>
                                            <span className="wallet-address" title={w.wallet_address}>
                                                {truncateAddress(w.wallet_address)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge badge-${w.status}`}>
                                                {w.status?.charAt(0).toUpperCase() + w.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>
                                            {formatDate(w.created_at)}
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => setSelectedWithdrawal(w)}
                                                >
                                                    View
                                                </button>
                                                {w.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleApprove(w.id)}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleReject(w.id)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {mockWithdrawals.length > 0 && (
                    <div className="pagination">
                        <div className="pagination-info">
                            Showing {mockWithdrawals.length} results
                        </div>
                        <div className="pagination-buttons">
                            <button className="btn btn-ghost btn-sm" disabled>Previous</button>
                            <button className="btn btn-ghost btn-sm" disabled>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Withdrawals;
