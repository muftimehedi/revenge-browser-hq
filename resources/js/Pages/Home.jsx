import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';

const Home = ({ downloadCount }) => {
    return (
        <PublicLayout>
            <Head title="Home" />

            {/* Background Animations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-animated">
                <div className="blob blob-purple w-[500px] h-[500px] top-[-100px] left-[-100px] animate-float"></div>
                <div className="blob blob-red w-[600px] h-[600px] bottom-[-100px] right-[-100px] animate-float-delayed"></div>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-20 overflow-hidden">
                {/* Floating 3D Elements (Decorative) */}
                <div className="absolute top-1/4 left-10 w-16 h-16 bg-red-500/20 rounded-xl backdrop-blur-sm border border-red-500/30 rotate-12 animate-float hidden lg:block"></div>
                <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-500/30 animate-float-delayed hidden lg:block"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    {/* Logo/Badge */}
                    <div className="mb-8 inline-block animate-float">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
                                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
                        <span className="block text-white mb-2">Dominate The</span>
                        <span className="gradient-text">Digital Realm</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                        The ultimate gaming browser. Zero lag. Maximum privacy.
                        <span className="block mt-2 text-white font-medium">Your setup isn't complete without it.</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        <Link
                            href="/download"
                            className="group relative px-8 py-5 bg-transparent overflow-hidden rounded-2xl transition-all hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 transition-all group-hover:scale-110"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative flex items-center gap-3 text-white font-bold text-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Install Now
                            </span>
                        </Link>

                        <Link
                            href="/about"
                            className="group px-8 py-5 bg-zinc-900/50 backdrop-blur-md border border-zinc-700 hover:border-zinc-500 rounded-2xl transition-all hover:bg-zinc-800/50"
                        >
                            <span className="flex items-center gap-2 text-zinc-300 group-hover:text-white font-semibold text-lg">
                                Explore Features
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </Link>
                    </div>

                    {/* Stats Pill */}
                    {downloadCount !== undefined && (
                        <div className="inline-flex items-center gap-4 px-6 py-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-xl animate-float-delayed">
                            <div className="flex -space-x-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-xs font-bold text-white`}>
                                        {['👾', '🎮', '🚀'][i]}
                                    </div>
                                ))}
                            </div>
                            <div className="h-4 w-px bg-white/10"></div>
                            <span className="text-zinc-400 text-sm">
                                Trusted by <strong className="text-white text-base">{(downloadCount || 0).toLocaleString()}+</strong> gamers
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative py-40 px-4 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Next-Gen Performance
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Engineered for those who refuse to compromise on speed or security.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="glass-panel p-10 group cursor-default h-full flex flex-col">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border border-red-500/20">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">Ghost Mode</h3>
                            <p className="text-zinc-400 leading-relaxed flex-grow">
                                Advanced tracking protection that makes you invisible to data brokers. Browse without a trace.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-panel p-10 group cursor-default h-full flex flex-col">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">FPS Boost</h3>
                            <p className="text-zinc-400 leading-relaxed flex-grow">
                                Resource-efficient engine that frees up RAM and CPU for your games. Zero browser lag.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-panel p-10 group cursor-default h-full flex flex-col">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Ironclad Core</h3>
                            <p className="text-zinc-400 leading-relaxed flex-grow">
                                Built on the latest secure technologies. Malicious scripts don't stand a chance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="relative py-32 px-4 overflow-hidden z-20">
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 to-transparent pointer-events-none"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="glass-panel p-12 md:p-20 relative overflow-hidden backdrop-blur-xl bg-zinc-900/60 shadow-2xl border border-white/5">
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-red-500/10 to-transparent z-0 pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                                Join the <span className="gradient-text">Revolution</span>
                            </h2>
                            <p className="text-zinc-300 text-xl mb-12 max-w-2xl mx-auto">
                                Stop letting browsers slow you down. Upgrade to Revenge today.
                            </p>
                            <Link
                                href="/download"
                                className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black hover:bg-zinc-200 font-bold text-xl rounded-2xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Get Revenge Browser
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};

export default Home;
