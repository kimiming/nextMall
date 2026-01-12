import '@/styles/globals.css';

import { type Metadata } from 'next';
import { Provider } from './provider';
import { TRPCReactProvider } from '@/trpc/react';

const SITE_URL = process.env.NEXTAUTH_URL || 'https://luxify.cc';
const SITE_NAME = 'Luxify';
const DEFAULT_TITLE = process.env.TITLE || 'Luxify';
const DEFAULT_DESCRIPTION =
    'Luxify is a manufacturer specializing in high-end fashion handbags. ';
export async function generateMetadata(): Promise<Metadata> {
    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: DEFAULT_TITLE,
            template: `%s - ${SITE_NAME}`,
        },
        description: DEFAULT_DESCRIPTION,
        keywords: DEFAULT_DESCRIPTION,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh">
            <body>
                <Provider>
                    <TRPCReactProvider>{children}</TRPCReactProvider>
                </Provider>
            </body>
        </html>
    );
}
