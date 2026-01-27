import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const PublicLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-zinc-950">
            <Navbar />
            <main className="pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
