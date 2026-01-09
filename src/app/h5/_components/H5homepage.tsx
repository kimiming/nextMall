'use client';
import React, { useState } from 'react';
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

// 多语言内容配置
const translations = {
    en_US: {
        name: 'English',
        factory_title: 'Factory Introduction',
        hero_badge: 'HIGH-END LUXURY FACTORY',
        hero_subtitle:
            'Focused on 1:1 replicas and bespoke pieces, delivering enterprise-grade luxury with meticulous craftsmanship.',
        metric_bespoke: 'Bespoke',
        metric_bespoke_desc: 'One-to-one personalization',
        metric_patented: 'Patented',
        metric_patented_desc: 'Multiple core techniques certified',
        metric_qc: 'QC',
        metric_qc_desc: 'Rigorous outbound inspection',
        accent_tag: 'ENTERPRISE-GRADE MANUFACTURING',
        accent_main:
            'Enterprise-grade standards, data-driven control and a global vision deliver scalable, luxury-grade solutions for discerning clients worldwide.',
        accent_chip1: 'Lean Production',
        accent_chip2: 'Smart Manufacturing',
        accent_chip3: 'Sustainability',
        info_block1_tag: 'Factory Introduction · Bespoke',
        info_block1_text: `Factory Introduction: Welcome to our production site for high-end luxury goods. We are a manufacturer of 1:1 replicas of leading luxury brands, following the core philosophy of "precise craftsmanship, outstanding quality, and bespoke customization". Through careful selection of top-quality raw materials and the perfect combination of craftsmanship and advanced technology, our products are created. Our bespoke designs are crafted by designers with great artistic competence and extensive intercultural experience, enabling them to create unique masterpieces tailored to the tastes and requirements of our clients. With perfected manufacturing processes and strict quality control, we combine innovation and environmental awareness, so that luxury and responsibility go hand in hand.`,
        info_block2_tag: 'Worldwide Patents · Product Introduction',
        info_block2_text: `Our self-developed technologies and production processes are patented worldwide and set us apart from competitors. We are committed to providing discerning customers around the world with unparalleled luxury products. Our factory employs some of the best designers and craftsmen in the world, supported by state-of-the-art production facilities to perfect every single luxury product. Global vision, international certifications.
Product Introduction: Our factory specializes in 1:1 replicas of various high-end luxury goods as well as private customizations, offering a unique luxury experience that perfectly reinterprets classic designs.
Finest craftsmanship, distinctive masterpieces. We combine traditional handwork with modern, intelligent manufacturing technology.
The highest quality materials for a luxurious tactile experience. We select top-quality leather, metal fittings, and natural gemstones worldwide to ensure that each product is of impeccable quality—and you experience the same luxury as with the original brands.`,
        gallery_title: 'Factory & Craftsmanship Presentation',
        image_alts: [
            'Panoramic view of the high-end luxury goods production line',
            'Craftsman at precise handwork',
            'Selection and inspection of top-quality raw materials',
            'Designer working on a bespoke piece',
            'Modern intelligent manufacturing and automated facilities',
            'Quality inspection and presentation of finished luxury products',
        ],
        contact_title: 'Contact',
        contact_desc: 'Contact us for bespoke consultation and offers.',
        contact_links: [
            { label: 'WeChat', url: 'weixin://', icon: 'ri-wechat-fill' },
            {
                label: 'WhatsApp',
                url: 'https://wa.me/123456789',
                icon: 'ri-whatsapp-fill',
            },
            {
                label: 'E-Mail',
                url: 'mailto:info@luxfactory.com',
                icon: 'ri-mail-fill',
            },
        ],
    },
    de_DE: {
        name: 'Deutsch',
        factory_title: 'Fabrikvorstellung',
        hero_badge: 'High-end Luxusfabrik',
        hero_subtitle:
            'Fokus auf 1:1 Repliken und Maßanfertigungen, mit höchster Handwerkskunst.',
        metric_bespoke: 'Bespoke',
        metric_bespoke_desc: 'Individuelle Maßanfertigung',
        metric_patented: 'Patented',
        metric_patented_desc: 'Weltweite Patente',
        metric_qc: 'QC',
        metric_qc_desc: 'Strenge Qualitätskontrolle',
        accent_tag: 'ENTERPRISE-GRADE MANUFACTURING',
        accent_main:
            'Enterprise-grade Standards, datengetriebene Kontrolle und globale Vision für skalierbare Luxuslösungen.',
        accent_chip1: 'Lean Production',
        accent_chip2: 'Smart Manufacturing',
        accent_chip3: 'Nachhaltigkeit',
        info_block1_tag: 'Fabrikvorstellung · Maßanfertigung',
        info_block1_text: `Vorstellung der Fabrik: Willkommen in unserer Produktionsstätte für hochwertige Luxusgüter. Wir sind ein Hersteller von 1:1-Repliken führender Luxusmarken und folgen der Kernphilosophie „präzise Handwerkskunst, herausragende Qualität und individuelle Maßanfertigung“. Durch die sorgfältige Auswahl erstklassiger Rohmaterialien und die perfekte Verbindung von Handwerk und modernster Technologie entstehen unsere Produkte. Unsere maßgeschneiderten Designs werden von Designern mit großer künstlerischer Kompetenz und umfangreicher interkultureller Erfahrung geschaffen, sodass sie einzigartige Meisterstücke ganz nach dem Geschmack und den Anforderungen der Kunden gestalten können. Mit perfektionierten Fertigungsprozessen und strenger Qualitätskontrolle verbinden wir Innovation und Umweltbewusstsein, sodass Luxus und Verantwortung Hand in Hand gehen.`,
        info_block2_tag: 'Weltweite Patente · Produktvorstellung',
        info_block2_text: `Unsere eigens entwickelten Technologien und Produktionsverfahren sind weltweit patentiert und heben uns deutlich von Mitbewerbern ab. Wir haben es uns zur Aufgabe gemacht, anspruchsvollen Kunden auf der ganzen Welt unvergleichliche Luxusprodukte zu bieten. In unserer Fabrik arbeiten einige der besten Designer und Handwerker der Welt, unterstützt von hochmodernen Produktionsanlagen, um jedes einzelne Luxusprodukt bis zur Perfektion zu fertigen. Globaler Weitblick, internationale Zertifizierungen.
Produktvorstellung: Unsere Fabrik ist auf 1:1-Repliken verschiedenster hochwertiger Luxusgüter sowie auf private Sonderanfertigungen spezialisiert und bietet ein einzigartiges Luxuserlebnis, das klassische Designs perfekt neu interpretiert.
Feinste Handwerkskunst, unverwechselbare Meisterwerke. Wir verbinden traditionelle Handarbeit mit moderner, intelligenter Fertigungstechnologie.
Hochwertigste Materialien für ein luxuriöses haptisches Erlebnis. Wir wählen weltweit erstklassige Leder, Metallbeschläge und natürliche Edelsteine aus, um sicherzustellen, dass jedes einzelne Produkt von makelloser Qualität ist – und Sie denselben luxuriösen Anspruch erleben wie bei den Originalmarken.`,
        gallery_title: 'Fabrik- und Handwerkspräsentation',
        image_alts: [
            'Panoramablick auf die Produktionslinie für hochwertige Luxusgüter',
            'Handwerker bei präziser Handarbeit',
            'Auswahl und Prüfung erstklassiger Rohmaterialien',
            'Designer bei der Arbeit an einer individuellen Maßanfertigung',
            'Moderne intelligente Fertigung und automatisierte Anlagen',
            'Qualitätsprüfung und Präsentation der fertigen Luxusprodukte',
        ],
        contact_title: 'Kontakt',
        contact_desc:
            'Kontaktieren Sie uns für individuelle Beratung und Angebote.',
        contact_links: [
            { label: 'WeChat', url: 'weixin://', icon: 'ri-wechat-fill' },
            {
                label: 'WhatsApp',
                url: 'https://wa.me/123456789',
                icon: 'ri-whatsapp-fill',
            },
            {
                label: 'E-Mail',
                url: 'mailto:info@luxfactory.com',
                icon: 'ri-mail-fill',
            },
        ],
    },
    // 你可以继续添加 zh_CN、fr_FR 等其它语言
};

const supportedLocales = [
    { code: 'en_US', label: 'English' },
    { code: 'de_DE', label: 'Deutsch' },
    // { code: 'zh_CN', label: '中文' },
    // ...
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
    const [contactOpen, setContactOpen] = useState(false);

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
            {/* <div className="wechat">
                <WhatsApp />
            </div> */}
        </div>
    );
}
