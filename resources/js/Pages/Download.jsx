import { Head } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';

const Download = ({ downloadCount }) => {
    const handleDownload = () => {
        window.location.href = '/api/download';
    };

    return (
        <PublicLayout>
            <Head title="Download" />

            <section className="min-h-screen flex items-center justify-center px-4 py-20">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-red-500 to-red-700 shadow-2xl shadow-red-500/30 mb-6">
                            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                        <span className="gradient-text">Download</span>
                        <span className="text-white"> Now</span>
                    </h1>

                    <p className="text-xl text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed">
                        Get the latest version of Revenge Browser for Android.
                        <span className="text-red-400 font-medium"> 100% Free, No Ads.</span>
                    </p>

                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        className="pulse-glow inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-2xl rounded-2xl transition-all transform hover:scale-105 mb-8"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download APK
                    </button>

                    {/* Download Stats */}
                    <div className="flex flex-col items-center gap-4 mb-12">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="text-zinc-300">
                                Total Downloads:
                                <strong className="text-white ml-2 text-lg">{(downloadCount || 0).toLocaleString()}</strong>
                            </span>
                        </div>
                        <p className="text-zinc-600 text-sm">
                            Join thousands of privacy-conscious users
                        </p>
                    </div>

                    {/* Requirements */}
                    <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-left">
                        <h3 className="text-lg font-semibold text-white mb-4">System Requirements</h3>
                        <ul className="space-y-3 text-zinc-400">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Android 7.0 (Nougat) or higher
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Minimum 50 MB free storage
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                2 GB RAM recommended
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};

export default Download;
