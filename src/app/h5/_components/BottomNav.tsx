'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiGrid,
    FiVideo,
    FiShoppingCart,
    FiUser,
} from 'react-icons/fi';
import { AiFillShopping, AiFillMessage } from 'react-icons/ai';
import { FaWhatsapp } from 'react-icons/fa';

const navs = [
    { href: '/h5', label: 'home', icon: FiHome },
    { href: '/h5/category', label: 'category', icon: FiGrid },
    { href: '/h5/luxify', label: 'luxify', icon: AiFillShopping },
    { href: '/h5/about', label: 'about', icon: AiFillMessage },
    { href: '/h5/me', label: 'contact', icon: FaWhatsapp },
];

export default function BottomNav() {
    const pathname = usePathname();
    return (
        <nav
            style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                height: 64,
                background: '#fff',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 100,
            }}
        >
            {navs.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return label !== 'luxify' && label !== 'category' ? (
                    <Link
                        key={href}
                        href={href}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: active ? '#2da884' : '#333',
                            textDecoration: 'none',
                            fontSize: 12,
                        }}
                    >
                        <Icon size={28} color={active ? '#2da884' : '#333'} />
                        <span style={{ marginTop: 4 }}>{label}</span>
                    </Link>
                ) : label === 'luxify' ? (
                    <a
                        href="https://luxify.cn/en/product-category/all-products/trendy-bags/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: active ? '#2da884' : '#333',
                            textDecoration: 'none',
                            fontSize: 12,
                        }}
                    >
                        <Icon size={28} color={active ? '#2da884' : '#333'} />
                        <span style={{ marginTop: 4 }}>{label}</span>
                    </a>
                ) : (
                    <a
                        href="https://luxify.cn/en/product-category/all-products/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: active ? '#2da884' : '#333',
                            textDecoration: 'none',
                            fontSize: 12,
                        }}
                    >
                        <Icon size={28} color={active ? '#2da884' : '#333'} />
                        <span style={{ marginTop: 4 }}>{label}</span>
                    </a>
                );
            })}
        </nav>
    );
}
