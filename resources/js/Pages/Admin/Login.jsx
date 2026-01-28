import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            // Verify token is valid
            fetch('/api/admin/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            }).then(res => {
                if (res.ok) {
                    window.location.href = '/admin/dashboard';
                } else {
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                }
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('admin_token', data.data.token);
                localStorage.setItem('admin_user', JSON.stringify(data.data.user));
                window.location.href = '/admin/dashboard';
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Admin Login" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 mb-6 shadow-2xl shadow-red-500/20">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Revenge Browser</h1>
                        <p className="text-zinc-400">Admin Portal</p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-8 shadow-2xl">
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-start gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Email Address
                                </label>
                                <div className={`relative transition-all duration-300 ${focusedInput === 'email' ? 'scale-[1.02]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 transition-colors duration-300 ${focusedInput === 'email' ? 'text-red-500' : 'text-zinc-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedInput('email')}
                                        onBlur={() => setFocusedInput(null)}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border rounded-xl text-white focus:outline-none transition-all duration-300 ${focusedInput === 'email' ? 'border-red-500 shadow-lg shadow-red-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Password
                                </label>
                                <div className={`relative transition-all duration-300 ${focusedInput === 'password' ? 'scale-[1.02]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className={`w-5 h-5 transition-colors duration-300 ${focusedInput === 'password' ? 'text-red-500' : 'text-zinc-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedInput('password')}
                                        onBlur={() => setFocusedInput(null)}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border rounded-xl text-white focus:outline-none transition-all duration-300 ${focusedInput === 'password' ? 'border-red-500 shadow-lg shadow-red-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-zinc-700 disabled:to-zinc-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer text */}
                    <p className="text-center text-zinc-600 text-sm mt-8">
                        Secure Admin Access
                    </p>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
