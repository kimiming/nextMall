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

    return null;
}
