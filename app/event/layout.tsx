import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageContainer } from '@/components/layout/page-container';

export default function EventLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <PageContainer className="flex-1">
                {children}
            </PageContainer>
            <Footer />
        </div>
    );
}
