import { Head } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';

const About = () => {
    return (
        <PublicLayout>
            <Head title="About" />

            {/* Hero */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        About <span className="gradient-text">Revenge Browser</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Built by gamers, for gamers. A browser that respects your privacy and maximizes your performance.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 px-4 bg-zinc-900/50">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                            <p className="text-zinc-400 mb-4">
                                Revenge Browser was born out of frustration with existing browsers that sacrifice user privacy for profit and slow down gaming experiences with bloatware.
                            </p>
                            <p className="text-zinc-400 mb-4">
                                We set out to create a browser that puts users first – one that blocks trackers by default, loads pages instantly, and never sells your data.
                            </p>
                            <p className="text-zinc-400">
                                Today, thousands of users trust Revenge Browser for their daily browsing, gaming, and streaming needs.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl shadow-red-500/20">
                                <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8">
                            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Transparency</h3>
                            <p className="text-zinc-500">Open about what we do with your data (hint: nothing). No hidden tracking.</p>
                        </div>

                        <div className="text-center p-8">
                            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Community</h3>
                            <p className="text-zinc-500">Built with feedback from our community. Your voice matters.</p>
                        </div>

                        <div className="text-center p-8">
                            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Quality</h3>
                            <p className="text-zinc-500">Every update is tested extensively. We never compromise on performance.</p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};

export default About;
