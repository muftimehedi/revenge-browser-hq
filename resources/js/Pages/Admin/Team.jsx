import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '../../Layouts/AdminLayout';
import axios from 'axios';

// Modal Component
const Modal = ({ children, onClose }) => {
    return (
        <div className="fixed top-0 right-0 bottom-0 left-[280px] z-40 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            {/* Modal Content */}
            <div className="relative w-full max-w-lg z-50 animate-in fade-in zoom-in-95 duration-200">
                {children}
            </div>
        </div>
    );
};

const Team = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Setup form
    const { data, setData, reset, errors, setError, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'moderator',
    });
    const [submitting, setSubmitting] = useState(false);

    // Initial Load
    useEffect(() => {
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        fetchTeam();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('admin_token');
        return {
            'Authorization': `Bearer ${token}`
        };
    };

    const fetchTeam = async () => {
        try {
            const res = await axios.get('/api/admin/team', { headers: getAuthHeaders() });
            setTeam(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch team', err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        clearErrors();

        try {
            await axios.post('/api/admin/team', data, { headers: getAuthHeaders() });
            setShowModal(false);
            reset();
            fetchTeam(); // Refresh list
            alert('Team member created successfully.');
        } catch (err) {
            console.error('Create error', err);
            if (err.response && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert('Failed to create team member.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this team member?')) return;

        try {
            await axios.delete(`/api/admin/team/${id}`, { headers: getAuthHeaders() });
            fetchTeam();
            alert('Team member removed.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete member.');
        }
    };

    const getRoleBadge = (role) => {
        switch(role) {
            case 'admin': return <span className="badge badge-primary">Admin</span>;
            case 'lead_moderator': return <span className="badge badge-warning">Lead Mod</span>;
            case 'moderator': return <span className="badge badge-approved">Mod</span>;
            default: return <span className="badge">{role}</span>;
        }
    };

    const canCreate = currentUser && ['admin', 'lead_moderator'].includes(currentUser.role);

    // Calculate addable roles based on current user
    const getAddableRoles = () => {
        if (!currentUser) return [];
        if (currentUser.role === 'admin') {
            return [
                { value: 'admin', label: 'Admin (Full Access)' },
                { value: 'lead_moderator', label: 'Lead Moderator' },
                { value: 'moderator', label: 'Moderator' },
            ];
        } else if (currentUser.role === 'lead_moderator') {
            return [
                { value: 'moderator', label: 'Moderator' },
            ];
        }
        return [];
    };

    return (
        <AdminLayout>
            <Head title="Team Management" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Team Management</h1>
                    <p className="page-subtitle">Manage admins, lead moderators, and moderators</p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary"
                    >
                        + Add Member
                    </button>
                )}
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center p-4">Loading team...</td></tr>
                            ) : team.length === 0 ? (
                                <tr><td colSpan="5" className="text-center p-4">No team members found.</td></tr>
                            ) : (
                                team.map((user) => (
                                    <tr key={user.id}>
                                        <td className="font-medium text-white">{user.name}</td>
                                        <td className="text-zinc-400">{user.email}</td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td className="text-zinc-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            {/* Permission Check for Delete Button */}
                                            {currentUser && (
                                                (currentUser.role === 'admin') ||
                                                (currentUser.role === 'lead_moderator' && user.role === 'moderator')
                                            ) && (
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal - Portal Implementation */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    {/* Modal Container */}
                    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg">

                        {/* Decorative Header */}
                        <div className="h-1 bg-gradient-to-r from-red-600 via-purple-600 to-red-600"></div>

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Add Team Member</h3>
                                    <p className="text-gray-400 text-sm mt-1">Grant access to the admin dashboard.</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-zinc-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder-zinc-600"
                                        placeholder="e.g. Alex Chen"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder-zinc-600"
                                        placeholder="alex@revenge.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder-zinc-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Role Assignment</label>
                                    <div className="relative">
                                        <select
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            {getAddableRoles().map(role => (
                                                <option key={role.value} value={role.value}>
                                                    {role.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2.5 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : 'Create Member'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
};

export default Team;
