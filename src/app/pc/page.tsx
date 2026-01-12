'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ContactMe from './_components/ContanctMe';
import translations from './utils/translations.js';
import { LuCrown } from 'react-icons/lu'; //皇冠
import { FaRegBuilding, FaLeaf } from 'react-icons/fa'; //工厂图标 // leaf图标
import { FaRegStar } from 'react-icons/fa6'; //星星图标
import { TbCertificate } from 'react-icons/tb'; //权威证书图标
import {
    AiOutlineSafetyCertificate,
    AiOutlineGlobal,
    AiOutlinePicture,
} from 'react-icons/ai'; //安全证书图标 // 全球图标 // 图片图标
import { IoSettingsOutline, IoBookOutline } from 'react-icons/io5'; //设置图标 // 书籍图标
import { HiMiniCpuChip } from 'react-icons/hi2'; //CPU图标

import './FactoryPage.css';

const supportedLocales = [
    { code: 'en_US', label: 'English' },
    { code: 'de_DE', label: 'Deutsch' },
    { code: 'zh_CN', label: '中文' },
];

const imagePaths = [
    '/factory_1.jpg',
    '/factory_2.jpg',
    '/factory_3.jpg',
    '/factory_4.jpg',
    '/factory_5.jpg',
    '/factory_6.jpg',
];

export default function H5homepage() {
    const [locale, setLocale] = useState('en_US');

    const t = translations[locale];

    return (
        <div className="page">
            <header className="top-bar">
                <div className="top-bar-inner">
                    <div>
                        <div className="logo">
                            <div className="logo-pill"></div>
                            <div>
                                Luxify FACTORY
                                <span className="logo-text-sub">
                                    CRAFT · QUALITY · BESPOKE
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="nav">
                        <div className="nav-item">
                            {' '}
                            <a href="https://luxify.cn/en/product-category/all-products/trendy-bags/">
                                PRODUCTS
                            </a>
                        </div>
                    </div>
                    <div className="lang-switch">
                        {supportedLocales.map((loc) => (
                            <a
                                key={loc.code}
                                className={loc.code === locale ? 'active' : ''}
                                onClick={() => setLocale(loc.code)}
                                style={{ cursor: 'pointer' }}
                            >
                                {loc.label}
                            </a>
                        ))}
                    </div>
                </div>
            </header>
            <section className="hero">
                <div className="hero-main" data-animate="fade-up">
                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        <span>{t.hero_badge}</span>
                        <LuCrown className="hero-badge-icon"></LuCrown>
                    </div>
                    <div className="hero-subtitle">{t.hero_subtitle}</div>
                    <div className="hero-metrics" data-animate-stagger>
                        <div className="metric-pill">
                            <FaRegStar className="metric-icon1"></FaRegStar>
                            <strong>{t.metric_bespoke}</strong>
                            {t.metric_bespoke_desc}
                        </div>
                        <div className="metric-pill">
                            <TbCertificate className="metric-icon2"></TbCertificate>
                            <strong>{t.metric_patented}</strong>
                            {t.metric_patented_desc}
                        </div>
                        <div className="metric-pill">
                            <AiOutlineSafetyCertificate className="metric-icon3"></AiOutlineSafetyCertificate>
                            <strong>{t.metric_qc}</strong>
                            {t.metric_qc_desc}
                        </div>
                    </div>
                </div>
                <aside
                    className="hero-accent-card"
                    aria-hidden="true"
                    data-animate="fade-up-slow"
                >
                    <div className="hero-accent-tag">
                        <FaRegBuilding className="hero-accent-tag-icon"></FaRegBuilding>
                        {t.accent_tag}
                    </div>
                    <div className="hero-accent-main">{t.accent_main}</div>
                    <div className="hero-accent-chip-row">
                        <div className="hero-accent-chip">
                            <IoSettingsOutline />
                            {t.accent_chip1}
                        </div>
                        <div className="hero-accent-chip">
                            <HiMiniCpuChip />
                            {t.accent_chip2}
                        </div>
                        <div className="hero-accent-chip">
                            <FaLeaf />

                            {t.accent_chip3}
                        </div>
                    </div>
                    <div className="hero-accent-orb"></div>
                </aside>
            </section>
            <div className="container">
                <section className="info-block">
                    <span className="info-tag">
                        <IoBookOutline className="info-tag-icon"></IoBookOutline>
                        {t.info_block1_tag}
                    </span>
                    <div className="info-card">
                        <div className="gallery-item">
                            <img src="/factory_2.jpg" alt="" />
                            <div className="gallery-caption">
                                <span>
                                    Panoramic view of high-end luxury production
                                    line
                                </span>
                            </div>
                        </div>
                        <div className="info-card-text">
                            {t.info_block1_text}
                        </div>
                    </div>
                </section>

                <section className="info-block">
                    <span className="info-tag">
                        <AiOutlineGlobal className="info-tag-icon"></AiOutlineGlobal>
                        {t.info_block2_tag}
                    </span>
                    <div className="info-card">
                        <div className="gallery-item">
                            <img src="/factory_4.jpg" alt="" />
                            <div className="gallery-caption">
                                <span>
                                    Panoramic view of high-end luxury production
                                    line
                                </span>
                            </div>
                        </div>
                        <div className="info-card-text">
                            {t.info_block2_text}
                        </div>
                    </div>
                </section>

                <div className="divider"></div>

                <section className="gallery">
                    <div className="gallery-header">
                        <span className="gallery-title">
                            <AiOutlinePicture className="gallery-title-icon"></AiOutlinePicture>
                            {t.gallery_title}
                        </span>
                    </div>
                    <div className="gallery-grid">
                        {imagePaths.map((src, idx) => (
                            <div className="gallery-item" key={src}>
                                <img src={src} alt={t.image_alts[idx] || ''} />
                                <div className="gallery-caption">
                                    <span>{t.image_alts[idx]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            {/* 联系方式悬浮按钮 */}
            <div className="wechat">
                <ContactMe />
            </div>
        </div>
    );
}
