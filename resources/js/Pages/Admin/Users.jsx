import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import axios from 'axios';

const Users = ({ users = [] }) => {
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [newName, setNewName] = useState('');
    const [saving, setSaving] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const startEdit = (user) => {
        setEditingUser(user);
        setNewName(user.name);
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setNewName('');
    };

    const saveName = async () => {
        if (!newName.trim()) return;
        setSaving(true);
        try {
            await axios.put(`/api/admin/users/${editingUser.id}`, { name: newName });
            setEditingUser(null);
            // In a real app we'd reload the page or update state locally
            window.location.reload();
        } catch (error) {
            console.error('Failed to update name', error);
            alert('Failed to update name');
        } finally {
            setSaving(false);
        }
    };

    // Filter users
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <Head title="Users" />

            {/* Edit Modal / Overlay */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel p-6 w-full max-w-md border border-zinc-700 bg-zinc-900">
                        <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>

                        <div className="mb-4">
                            <label className="block text-zinc-400 text-sm mb-2">Email (Read-only)</label>
                            <input
                                type="text"
                                value={editingUser.email}
                                disabled
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-500 cursor-not-allowed"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-zinc-400 text-sm mb-2">Display Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                                placeholder="Enter Name"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelEdit}
                                className="px-4 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveName}
                                disabled={saving}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-header">
                <div>
                    <h1 className="page-title">Users</h1>
                    <p className="page-subtitle">Manage registered users</p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="filter-bar">
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ minWidth: '300px' }}
                />
            </form>

            <div className="card">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">👤</div>
                                            <div className="empty-state-text">No users found</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                                    {user.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <span className="font-medium text-white">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-zinc-400">
                                            {user.email}
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => startEdit(user)}
                                                className="px-3 py-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors"
                                            >
                                                Edit Name
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Users;

