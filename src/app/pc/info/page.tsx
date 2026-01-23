import Image from 'next/image';
import styles from './page.module.css';

export default function Info() {
    return (
        <div className={styles.container}>
            {/* 标题区域 */}
            <div className={styles.titleArea}>
                <h1 className={styles.title}>[实卡成品号]实卡美国+1 API链接</h1>
                <hr className={styles.titleLine} />
            </div>

            {/* 图片区域 */}
            <div className={styles.imageArea}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="/12.jpg"
                        alt="API接口图片"
                        fill
                        priority
                        style={{
                            objectFit: 'contain',
                            borderRadius: '0.375rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        }}
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 60vw"
                    />
                </div>
            </div>

            {/* 内容区域 */}
            <div className={styles.contentArea}>
                {/* 语言包提示 */}
                <div className={styles.languageSection}>
                    <div className={styles.languageTitle}>
                        【TG简体中文语言包安装说明】
                    </div>
                    <div className={styles.languageText}>
                        点击下方链接安装简体中文语言包：
                    </div>
                    <a
                        href="https://t.me/buzhuiTG/4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        https://t.me/buzhuiTG/4
                    </a>
                    <div className={styles.note}>
                        登录后浏览器打开以上网址即可完成安装
                    </div>
                </div>

                {/* 重要提示 */}
                <div className={styles.warning}>
                    ⚠️
                    登录后请至少保持一个设备在线，千万不要退出，后面登录的验证码会发送到当前登录设备的，否则退出后无法拿到验证码登录后果自负！
                </div>

                {/* 价格和联系信息 */}
                <div className={styles.infoSection}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>单价：</span>
                        <span className={styles.value}>$2 (rmb--￥15左右)</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>发货方式：</span>
                        <span className={styles.value}>自动发货</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>联系方式：</span>
                        <span className={styles.contactValue}>
                            请输入您的任意联系方式
                        </span>
                    </div>
                </div>

                {/* 分隔线 */}
                <hr className={styles.divider} />

                {/* 付款方式 */}
                <div className={styles.paymentSection}>
                    <div className={styles.paymentTitle}>付款方式</div>
                    <div className={styles.paymentMethods}>
                        <span>支付宝</span>
                        <span>微信支付</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
