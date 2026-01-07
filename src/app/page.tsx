// import { redirect } from 'next/navigation';

// export default function Home() {
//     const homePath = process.env.NEXT_PUBLIC_DEFAULT_HOME_PATH ?? '/h5';
//     redirect(homePath);
//     return null;
// }

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // 简单判断移动端
        const isMobile =
            /Android|webOS|iPhone|iPod|BlackBerry|Mobile|Windows Phone/i.test(
                navigator.userAgent
            );
        if (isMobile) {
            router.replace('/h5');
        } else {
            router.replace('/pc');
        }
    }, [router]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                // background: '#f5f6fa',
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    border: '6px solid #eee',
                    borderTop: '6px solid  #b9ecdcff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }}
            />
            <div style={{ marginTop: 24, fontSize: '1.2em', color: '#555' }}>
                Redirecting, please wait...
            </div>
            <style jsx>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
