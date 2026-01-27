import { Link, usePage } from '@inertiajs/react';

const Navbar = () => {
    const { url } = usePage();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold">
                            <span className="gradient-text">Revenge</span>
                            <span className="text-white"> Browser</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className={`transition-colors font-medium ${url === '/' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className={`transition-colors font-medium ${url.startsWith('/about') ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                        >
                            About
                        </Link>
                        <Link
                            href="/download"
                            className={`px-6 py-2 font-semibold rounded-lg transition-all ${
                                url.startsWith('/download')
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-400/50'
                                    : 'bg-red-600 hover:bg-red-500 text-white hover:shadow-lg hover:shadow-red-500/20'
                            }`}
                        >
                            Download
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-zinc-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
