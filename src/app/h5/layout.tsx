import BottomNav from './_components/BottomNav';
import WhatsApp from './_components/whatsapp';

export default function H5Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <WhatsApp />
            <BottomNav />
        </>
    );
}
