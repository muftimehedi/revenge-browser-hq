import { Link } from '@inertiajs/react';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">Revenge Browser</span>
                        </div>
                        <p className="text-zinc-500 max-w-sm">
                            Privacy-focused, gaming-optimized Android browser. Take back control of your browsing experience.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-zinc-500 hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/about" className="text-zinc-500 hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/download" className="text-zinc-500 hover:text-white transition-colors">Download</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-zinc-500 hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-zinc-500 hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-600">
                    <p>&copy; {new Date().getFullYear()} Revenge Browser. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
