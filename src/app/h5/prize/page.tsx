'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button, Modal, message } from 'antd';
import {
    InfoCircleOutlined,
    ShareAltOutlined,
    GiftOutlined,
    UserOutlined,
    HistoryOutlined,
} from '@ant-design/icons';
import { api } from '@/trpc/react';

// const END_TIME = new Date().getTime() + 1000 * 60 * 60 * 24 * 7; // 活动结束时间，示例为7天con
const END_TIME = 1768816609533; // 活动结束时间，示例为7天con

export default function PrizeActivity() {
    const [secret, setSecret] = useState('');
    const [phone, setPhone] = useState();
    const [prizeVisible, setPrizeVisible] = useState(false);
    const [prize, setPrize] = useState('');
    const [ruleVisible, setRuleVisible] = useState(false);
    const [myPrizeVisible, setMyPrizeVisible] = useState(false);
    const [countdown, setCountdown] = useState('');
    const [PARTICIPANT_COUNT, setPARTICIPANT_COUNT] = useState(0);
    const [winnerPhones, setWinnerPhones] = useState([]);
    const [viewCountVisible, setViewCountVisible] = useState(false);
    const [prizeDetailsVisible, setPrizeDetailsVisible] = useState(false);

    const { data: prizeList } = api.prize.list.useQuery();
    // console.log('END_TIME', END_TIME);
    // 倒计时逻辑
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = END_TIME - now;
            if (diff <= 0) {
                setCountdown('ending');
                clearInterval(timer);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (diff % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setCountdown(`${days}day ${hours}: ${minutes}: ${seconds}`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        if (prizeList?.data?.length) {
            setWinnerPhones(prizeList?.data?.map((item) => item.phone));
        }
        setPARTICIPANT_COUNT(prizeList?.data?.length || 0);
    }, [prizeList]);

    const getMyPrize = api.prize.myPrize.useMutation({
        onSuccess: (data) => {
            setPrize(data.prize || '');
            setMyPrizeVisible(true);
        },
    });
    const drawPrize = api.prize.draw.useMutation({
        onSuccess: () => {
            message.success('Participation successful');
        },
        onError: (error) => {
            // 兼容 tRPC 的各种错误结构
            const errMsg =
                error?.shape?.message ||
                error?.message ||
                'Participation failed';
            message.error(errMsg);
        },
    });
    const handleSubmit = async () => {
        await drawPrize.mutateAsync({ secret });
    };

    const handleMyPrizeClick = async () => {
        if (!secret) {
            message.warning('Please enter the your phone number first');
            return;
        }
        const mutation = await getMyPrize.mutateAsync({ phone: secret || '' });
        if (mutation) {
            setPrize(mutation.prize);
            setMyPrizeVisible(true);
        }
    };
    const handleViewCount = () => {
        setViewCountVisible(true);
    };
    function maskPhone(phone: string) {
        if (!phone || phone.length < 7) {
            // 长度不足7位，保留首位和末位
            if (phone.length <= 2) return phone;
            return (
                phone[0] +
                '*'.repeat(phone.length - 2) +
                phone[phone.length - 1]
            );
        }
        // 保留前3位和后4位
        return (
            phone.slice(0, 3) + '*'.repeat(phone.length - 7) + phone.slice(-4)
        );
    }
    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundImage: 'url(/drawH5.jpg)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                padding: '0',
                position: 'relative',
                fontFamily: 'PingFang SC, Arial, sans-serif',
            }}
        >
            {/* 右上角规则*/}
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
            {/* 右上角奖品详情*/}
            <div
                style={{
                    position: 'absolute',
                    top: 56,
                    right: 16,
                    display: 'flex',
                    gap: 12,
                    zIndex: 2,
                }}
            >
                <Button
                    shape="circle"
                    icon={<GiftOutlined />}
                    onClick={() => setPrizeDetailsVisible(true)}
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
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '28px',
                        marginBottom: 12,
                        letterSpacing: 2,
                    }}
                >
                    {/* Enter your license key to win prizes. */}
                </h2>
                <div
                    style={{
                        color: '#fff',
                        fontSize: '18px',
                        marginBottom: 32,
                    }}
                >
                    {/* 输入口令 赢取大奖 */}
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
                    placeholder="please enter the license key"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
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
                            'linear-gradient(90deg, #249e42ff 0%, #6cffaeff 100%)',
                        border: 'none',
                    }}
                >
                    confirm
                </Button>
                <Button
                    type="link"
                    icon={<GiftOutlined />}
                    style={{
                        color: '#2da884',
                        marginTop: 16,
                        fontSize: 16,
                        fontWeight: 'bold',
                    }}
                    onClick={() => handleMyPrizeClick()}
                >
                    View My Prizes
                </Button>
            </div>

            {/* 活动结束倒计时和参与人数 */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 62,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    margin: '0 auto',
                    height: '120px',
                    justifyContent: 'between',
                }}
            >
                {/* 活动结束倒计时 */}
                <div
                    style={{
                        background: '#fff',
                        height: '60px',
                        lineHeight: '60px',

                        color: '#000',
                        fontSize: 16,
                        padding: '0 10px',
                    }}
                >
                    <span style={{ paddingRight: '10px' }}>
                        <HistoryOutlined />
                    </span>
                    Ending in :
                    <span
                        style={{
                            fontWeight: 'bold',
                            backgroundColor: '#2da884',
                            color: '#fff',
                            padding: '5px 10px',
                            borderRadius: 8,
                            marginLeft: '10px',
                        }}
                    >
                        {countdown}
                    </span>
                </div>

                {/* 参与人数 */}
                <div
                    style={{
                        borderTop: '1px solid #e5e5e5',
                        height: '60px',
                        lineHeight: '60px',
                        color: '#000',
                        fontSize: 16,
                        padding: '0 10px',
                    }}
                >
                    <span style={{ paddingRight: '10px' }}>
                        <UserOutlined />
                    </span>
                    Already
                    <span
                        style={{
                            fontWeight: 'bold',
                            padding: '0 5px',
                            color: '#2da884',
                            textDecoration: 'underline',
                            margin: '0 5px',
                        }}
                        onClick={() => handleViewCount()}
                    >
                        {PARTICIPANT_COUNT}
                    </span>
                    people have participated
                </div>
            </div>

            {/* 中奖弹窗 */}
            <Modal
                open={prizeVisible}
                onCancel={() => setPrizeVisible(false)}
                footer={null}
                centered
            >
                <div style={{ textAlign: 'center' }}>
                    <h3>Congratulations!</h3>
                    <div style={{ fontSize: 20, margin: '16px 0' }}>
                        {prize}
                    </div>
                    <img
                        src="/images/iphone12.png"
                        alt="iPhone12"
                        style={{ width: 120 }}
                    />
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
                    <h3>Activity Rules</h3>
                    <div style={{ marginTop: 12, fontSize: 16 }}>
                        1. Enter the correct code to join the lottery.
                        <br />
                        2. Each user is limited to one participation.
                        <br />
                        3. Prizes are subject to actual delivery.
                        <br />
                        4. The organizer reserves the final right of
                        interpretation for this event.
                    </div>
                </div>
            </Modal>
            {/* 奖品弹窗 */}
            <Modal
                open={prizeDetailsVisible}
                onCancel={() => setPrizeDetailsVisible(false)}
                footer={null}
                centered
            >
                <div>
                    <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Prize Details
                    </h3>
                    <div style={{ marginTop: 12, fontSize: 14 }}>
                        <div style={{ marginBottom: 12 }}>
                            1. First : Choose three products,free of charge *1
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            2. Second : Choose one products,free of charge *5
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            3. Third : 50% off coupon *50
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            4. Lucky Prize : 20% off coupon *200
                        </div>
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
                    <h3>My Prizes</h3>
                    <div style={{ fontSize: 20, margin: '16px 0' }}>
                        {prize ? prize : 'No prizes yet'}
                    </div>
                    {/* {prize && (
                        <img
                            src="/images/iphone12.png"
                            alt="iPhone12"
                            style={{ width: 120 }}
                        />
                    )} */}
                </div>
            </Modal>
            {/* 中奖人数弹窗 */}
            <Modal
                open={viewCountVisible}
                onCancel={() => setViewCountVisible(false)}
                footer={null}
                centered
            >
                <div style={{ textAlign: 'center' }}>
                    <h3>Participant List</h3>
                    <div
                        style={{
                            maxHeight: '160px', // 5条，每条约32px
                            overflowY: 'auto',
                            margin: '0 auto',
                            width: '80%', // 可根据实际需求调整宽度
                        }}
                    >
                        {winnerPhones.length > 0 ? (
                            winnerPhones.map((phone, index) => (
                                <div key={index} style={{ margin: '8px 0' }}>
                                    {maskPhone(phone)}
                                </div>
                            ))
                        ) : (
                            <div>No winners yet</div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
