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
import dayjs from 'dayjs';

//帮我用ts定义一个接口Prize
{
    /***name?: string;
        id?: string;
        createdAt?: string;
        updatedAt?: string;
        image?: string | null;
        description?: string | null;
        activityId?: string;***/
}
interface Prize {
    id?: string;
    name?: string;
    image?: string;
    description?: string;
    activityId?: string;
    createdAt?: string;
    updatedAt?: string;
}

// const END_TIME = new Date().getTime() + 1000 * 60 * 60 * 24 * 7; // 活动结束时间，示例为7天con
const DEFAULT_END_TIME = 1768816609533; // 活动结束时间，示例为7天con

export default function PrizeActivity() {
    const [secret, setSecret] = useState('');
    const [phone, setPhone] = useState();
    const [prizeVisible, setPrizeVisible] = useState(false);
    const [prize, setPrize] = useState<Prize>({} as Prize);
    const [ruleVisible, setRuleVisible] = useState(false);
    const [myPrizeVisible, setMyPrizeVisible] = useState(false);
    const [countdown, setCountdown] = useState('');
    const [PARTICIPANT_COUNT, setPARTICIPANT_COUNT] = useState(0);
    const [winnerPhones, setWinnerPhones] = useState([]);
    const [viewCountVisible, setViewCountVisible] = useState(false);
    const [prizeDetailsVisible, setPrizeDetailsVisible] = useState(false);
    const { data: prizeList } = api.prize.listAll.useQuery();

    // 获取活动信息
    const { data: activity } = api.activity.getAllActivities.useQuery();
    const isHaveActivity = activity?.data?.length > 0;
    const activityInfo = activity?.data?.[0];
    const END_TIME = dayjs(activityInfo?.endAt).valueOf();
    const rule = activityInfo?.rule || '';
    const prizeDetails = activityInfo?.text || '';
    // 倒计时逻辑
    // 倒计时逻辑 - 修改为依赖于活动数据
    useEffect(() => {
        if (!isHaveActivity) {
            setCountdown('No active activity');
            return;
        }

        let timer: NodeJS.Timeout | null = null;

        const updateCountdown = () => {
            const now = new Date().getTime();

            const diff = END_TIME - now; // 计算距离结束还有多少时间

            if (diff <= 0) {
                setCountdown('Activity ended');
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (diff % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        };

        // 立即执行一次以显示初始倒计时
        updateCountdown();

        // 设置定时器每秒更新倒计时
        timer = setInterval(updateCountdown, 1000);

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isHaveActivity, END_TIME]); // 依赖于活动是否存在和结束时间
    useEffect(() => {
        if (prizeList?.data?.length) {
            setWinnerPhones(prizeList?.data?.map((item) => item.phone));
        }
        setPARTICIPANT_COUNT(prizeList?.data?.length || 0);
    }, [prizeList]);

    // 查询我的奖品api
    // 添加一个新的查询用于获取我的奖品
    const myPrizeQuery = api.prize.myPrize.useQuery(
        { phone: secret },
        {
            enabled: false, // 禁用自动查询，只在需要时手动触发
        }
    );

    //报名抽奖api
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
    // 提交报名表单
    const handleSubmit = async () => {
        await drawPrize.mutateAsync({ secret });
    };

    const handleMyPrizeClick = async () => {
        if (!secret) {
            message.warning('Please enter the your phone number first');
            return;
        }
        try {
            // 使用refetch手动触发查询
            const result = await myPrizeQuery.refetch();
            if (result.data) {
                setPrize(result.data.prize || {});
                setMyPrizeVisible(true);
            } else {
                message.info('No prize found for this phone number');
            }
        } catch (error) {
            message.error('Failed to fetch prize information');
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
        <>
            {isHaveActivity ? (
                <div
                    style={{
                        minHeight: '100vh',
                        backgroundImage:
                            `url(${activityInfo?.image})` || 'url(/drawH5.jpg)',
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

                            margin: '0 auto',
                            height: '180px',
                            justifyContent: 'between',
                        }}
                    >
                        {/* 活动提醒 */}
                        <div
                            style={{
                                background: 'none',
                                height: '60px',
                                lineHeight: '60px',
                                color: '#cc0929ff',
                                fontSize: 16,
                                padding: '0 10px',
                                borderBottom: '1px solid #e5e5e5',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                position: 'relative',
                            }}
                        >
                            <div
                                style={{
                                    display: 'inline-block',
                                    paddingLeft: '100%',
                                    animation: 'marquee 15s linear infinite',
                                }}
                            >
                                New users, please contact customer service to
                                receive a raffle ticket.Click the green floating
                                window .
                            </div>
                            <style jsx>{`
                                @keyframes marquee {
                                    0% {
                                        transform: translateX(0);
                                    }
                                    100% {
                                        transform: translateX(-100%);
                                    }
                                }
                            `}</style>
                        </div>
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
                                background: '#fff',
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
                                {prize?.name || 'No prize found'}
                            </div>
                            <img
                                src={prize?.image || ''}
                                alt="prize"
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
                            <div
                                style={{
                                    marginTop: 12,
                                    fontSize: 16,
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {/* 1. Enter the correct code to join the lottery.
                                <br />
                                2. Each user is limited to one participation.
                                <br />
                                3. Prizes are subject to actual delivery.
                                <br />
                                4. The organizer reserves the final right of
                                interpretation for this event. */}
                                {rule}
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
                            <h3
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                }}
                            >
                                Prize Details
                            </h3>
                            <div
                                style={{
                                    marginTop: 12,
                                    fontSize: 14,
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {prizeDetails}
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
                            <div style={{ fontWeight: 'bold', fontSize: 22 }}>
                                My Prizes
                            </div>
                            <div style={{ fontSize: 20, margin: '16px 0' }}>
                                {prize?.name || 'No prizes yet'}
                            </div>
                            {prize && (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <img
                                        src={prize?.image || ''}
                                        alt={prize?.name || 'prize'}
                                        style={{
                                            width: 120,
                                        }}
                                    />
                                    <p style={{ fontSize: 14, marginTop: 8 }}>
                                        {prize?.description ||
                                            'No prize details yet'}
                                    </p>
                                </div>
                            )}
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
                                        <div
                                            key={index}
                                            style={{ margin: '8px 0' }}
                                        >
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
            ) : (
                <div
                    style={{
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        fontSize: 18,
                        fontWeight: 'bold',
                        //背景渐变
                        background:
                            'linear-gradient(rgb(45, 168, 132), rgb(244, 244, 244) 50%, rgba(45, 168, 132) 100%)',
                    }}
                >
                    <p>The event has not started yet;</p>
                    <p>please try again later.</p>
                </div>
            )}
        </>
    );
}
