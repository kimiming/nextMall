// 指南页面
'use client';
//引入antd的button组件
import { Button } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
//引进Link组件用于页面跳转
import Link from 'next/link';
export default function GuidePage() {
    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                backgroundColor: '#f0f2f5',
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <p
                        style={{
                            fontWeight: 'bold',
                            fontSize: '24px',
                            padding: '10px 10px',
                        }}
                    >
                        📞 For more infomation, please contact us on WhatsApp.
                    </p>
                    <p style={{ fontSize: '38px', padding: '0 10px' }}>
                        👇👇👇
                    </p>
                </div>
                <div style={{ padding: '10px' }}>
                    <p style={{ color: '#6e7174ff', marginBottom: '10px' }}>
                        you'll be redirected to an external sites 🔗 .
                    </p>
                    <div
                        style={{
                            background: '#25d366',
                            height: '50px',
                            fontSize: '16px',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 20px',
                        }}
                    >
                        <Link
                            href="https://wa.me/+8618933999929"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <WhatsAppOutlined /> Contact us with WhatsApp
                        </Link>
                    </div>
                    <div
                        style={{
                            background: '#25d366',
                            marginTop: '20px',
                            padding: '10px',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        <Link href="/">go to site</Link>
                    </div>
                </div>
            </div>
        </div>
    );
} // 按钮组件示例
