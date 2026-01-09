'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button, Modal, message } from 'antd';
import {
    InfoCircleOutlined,
    ShareAltOutlined,
    GiftOutlined,
} from '@ant-design/icons';

const END_TIME = new Date().getTime() + 1000 * 60 * 60 * 24; // 活动结束时间，示例为24小时后
const PARTICIPANT_COUNT = 1098; // 示例参与人数

const PrizeActivity: React.FC = () => {
    const [code, setCode] = useState('');
    const [prizeVisible, setPrizeVisible] = useState(false);
    const [prize, setPrize] = useState('');
    const [ruleVisible, setRuleVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [myPrizeVisible, setMyPrizeVisible] = useState(false);
    const [countdown, setCountdown] = useState('');

    // 倒计时逻辑
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = END_TIME - now;
            if (diff <= 0) {
                setCountdown('活动已结束');
                clearInterval(timer);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor(
                    (diff % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setCountdown(`${hours}小时${minutes}分${seconds}秒`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = () => {
        if (!code) {
            message.warning('请输入口令');
            return;
        }
        // 这里可以加接口请求逻辑
        setPrize('iPhone12');
        setPrizeVisible(true);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'rgb(228, 244, 239)',
                padding: '0',
                position: 'relative',
                fontFamily: 'PingFang SC, Arial, sans-serif',
            }}
        >
            {/* 右上角规则和分享 */}
            <div
                style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    gap: 12,
                    zIndex: 2,
                }}
            >
                <Button
                    shape="circle"
                    icon={<InfoCircleOutlined />}
                    onClick={() => setRuleVisible(true)}
                    style={{ background: 'rgba(255,255,255,0.8)' }}
                />
            </div>

            {/* 活动标题 */}
            <div
                style={{
                    textAlign: 'center',
                }}
            >
                <h2
                    style={{
                        paddingTop: 60,
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '28px',
                        marginBottom: 12,
                        letterSpacing: 2,
                    }}
                >
                    找口令赢礼品
                </h2>
                <div
                    style={{
                        color: '#000',
                        fontSize: '18px',
                        marginBottom: 32,
                    }}
                >
                    输入口令 赢取大奖
                </div>
            </div>

            {/* 输入框和确认按钮 */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 250,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Input
                    placeholder="请输入口令"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{
                        maxWidth: 300,
                        marginBottom: 16,
                        borderRadius: 24,
                        height: 44,
                        fontSize: 16,
                        textAlign: 'center',
                    }}
                />
                <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    style={{
                        width: 300,
                        borderRadius: 24,
                        fontSize: 18,
                        height: 44,
                        background:
                            'linear-gradient(90deg, #ff8c2f 0%, #ffb86c 100%)',
                        border: 'none',
                    }}
                >
                    确认
                </Button>
                <Button
                    type="link"
                    icon={<GiftOutlined />}
                    style={{
                        color: '#fff',
                        marginTop: 16,
                        fontSize: 16,
                    }}
                    onClick={() => setMyPrizeVisible(true)}
                >
                    查看我的奖品
                </Button>
            </div>

            {/* 活动结束倒计时 */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 180,
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 16,
                }}
            >
                活动结束时间倒计时：
                <span style={{ fontWeight: 'bold' }}>{countdown}</span>
            </div>

            {/* 参与人数 */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 142,
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 16,
                }}
            >
                已有{' '}
                <span style={{ fontWeight: 'bold' }}>{PARTICIPANT_COUNT}</span>{' '}
                人参与
            </div>

            {/* 中奖弹窗 */}
            <Modal
                open={prizeVisible}
                onCancel={() => setPrizeVisible(false)}
                footer={null}
                centered
            >
                <div style={{ textAlign: 'center' }}>
                    <h3>恭喜你中奖啦！</h3>
                    <div style={{ fontSize: 20, margin: '16px 0' }}>
                        {prize}
                    </div>
                    <img
                        src="/images/iphone12.png"
                        alt="iPhone12"
                        style={{ width: 120 }}
                    />
                    <Button type="primary" style={{ marginTop: 24 }}>
                        去个人中心查看
                    </Button>
                </div>
            </Modal>

            {/* 规则弹窗 */}
            <Modal
                open={ruleVisible}
                onCancel={() => setRuleVisible(false)}
                footer={null}
                centered
            >
                <div>
                    <h3>活动规则</h3>
                    <div style={{ marginTop: 12, fontSize: 16 }}>
                        1. 输入正确口令即可参与抽奖
                        <br />
                        2. 每个用户仅限参与一次
                        <br />
                        3. 奖品以实际发放为准
                        <br />
                        4. 活动最终解释权归主办方所有
                    </div>
                </div>
            </Modal>

            {/* 分享弹窗 */}
            <Modal
                open={shareVisible}
                onCancel={() => setShareVisible(false)}
                footer={null}
                centered
            >
                <div style={{ textAlign: 'center' }}>
                    <h3>分享活动</h3>
                    <div style={{ marginTop: 12, fontSize: 16 }}>
                        可以将活动页面分享给好友，邀请他们一起来参与抽奖！
                    </div>
                </div>
            </Modal>

            {/* 我的奖品弹窗 */}
            <Modal
                open={myPrizeVisible}
                onCancel={() => setMyPrizeVisible(false)}
                footer={null}
                centered
            >
                <div style={{ textAlign: 'center' }}>
                    <h3>我的奖品</h3>
                    <div style={{ fontSize: 20, margin: '16px 0' }}>
                        {prize ? prize : '暂未中奖'}
                    </div>
                    {prize && (
                        <img
                            src="/images/iphone12.png"
                            alt="iPhone12"
                            style={{ width: 120 }}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default PrizeActivity;
