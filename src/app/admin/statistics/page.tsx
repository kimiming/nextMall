'use client';

import React, { useState, useEffect } from 'react';
import {
    Input,
    Button,
    message,
    Table,
    Tag,
    Flex,
    Typography,
    Modal,
    Select,
    DatePicker,
} from 'antd';
import { api } from '@/trpc/react';
import dayjs from 'dayjs';

export default function Statistics() {
    const [phone, setPhone] = useState('');
    const [secret, setSecret] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [userPrize, setUserPrize] = useState('');
    const [selectedActivityId, setSelectedActivityId] = useState('');

    // 删除用户接口
    const deletePrize = api.prize.delete.useMutation({
        onSuccess: () => {
            message.success('删除成功');
            refetch();
        },
    });

    // 报名列表接口
    const {
        data: prizeList,
        refetch,
        isFetching,
    } = api.prize.list.useQuery({
        page,
        pageSize,
    });

    // 获取所有活动列表
    const { data: activitiesData } = api.activity.getAllActivities.useQuery();

    // 获取所有奖品列表
    const { data: prizesData } = api.myPrize.getAllPrizes.useQuery();

    useEffect(() => {
        if (prizeList) {
            setDataSource(
                prizeList.data.map((item, index) => ({
                    ...item,
                    key: index + 1,
                }))
            );
        }
    }, [prizeList, page, pageSize]);

    // 表格参数
    const columns = [
        {
            title: 'No',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: '手机号码',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '秘钥',
            dataIndex: 'secret',
            key: 'secret',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, { status }) => (
                <Tag color={status === 1 ? 'red' : 'green'}>
                    {status === 1 ? '已参与' : '未参与'}
                </Tag>
            ),
        },
        {
            title: '抽奖',
            dataIndex: 'isWinner',
            key: 'isWinner',
            render: (_, { isWinner }) => (
                <Tag
                    variant="solid"
                    color={isWinner === true ? 'volcano' : 'blue'}
                >
                    {isWinner === true ? '已中奖' : '未中奖'}
                </Tag>
            ),
        },
        {
            title: '奖品',
            dataIndex: ['prize', 'name'],
            key: 'prizeName',
            render: (prizeName, record) => (
                <div>{record.prize ? record.prize.name : '-'}</div>
            ),
        },
        {
            title: '活动',
            dataIndex: ['activity', 'name'],
            key: 'activityName',
            render: (activityName, record) => (
                <div>{record.activity ? record.activity.name : '-'}</div>
            ),
        },
        {
            title: '抽奖时间',
            dataIndex: 'drawAt',
            key: 'drawAt',
            render: (drawAt) => (
                <div>
                    {drawAt ? dayjs(drawAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </div>
            ),
        },
        {
            title: '中奖时间',
            dataIndex: 'winAt',
            key: 'winAt',
            render: (winAt) => (
                <div>
                    {winAt ? dayjs(winAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </div>
            ),
        },
        {
            title: '参与时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => (
                <div>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (_, data) => (
                <div>
                    <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        onClick={() => handleUserEdit(data)}
                    >
                        编辑
                    </Button>
                    <Button danger onClick={() => handleUserDelete(data)}>
                        删除
                    </Button>
                </div>
            ),
        },
    ];

    // 报名接口
    const createPrize = api.prize.create.useMutation({
        onSuccess: () => {
            message.success('报名成功');
            refetch();
            setPhone('');
        },
    });

    // 更新用户信息接口
    const updateUser = api.prize.update.useMutation({
        onSuccess: () => {
            message.success('更新成功');
            refetch();
        },
    });

    // 提交报名
    const handleSubmit = async () => {
        if (!phone) {
            message.warning('请输入手机号');
            return;
        }

        // 默认选择第一个活动，如果没有活动则提示
        if (!activitiesData || activitiesData.data.length === 0) {
            message.error('没有可用的活动，请先创建活动');
            return;
        }

        const defaultActivityId = activitiesData.data[0].id;

        try {
            await createPrize.mutateAsync({
                phone,
                activityId: defaultActivityId,
            });
        } catch (error) {
            console.error('报名失败:', error);
            message.error('报名失败');
        }
    };

    // 分页处理
    const handleTableChange = (pagination) => {
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    // 确定删除用户
    const handleDeleteOk = async () => {
        try {
            await deletePrize.mutateAsync({ id: userId });
            setIsModalOpen(false);
        } catch (error) {
            console.error('删除失败:', error);
            message.error('删除失败');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 删除按钮
    const handleUserDelete = (value) => {
        setUserId(value?.id);
        showModal();
    };

    // 编辑用户
    const handleUserEdit = async (value) => {
        setUserId(value?.id);
        setEditRecord(value);
        setIsEditModalOpen(true);
    };

    // 编辑记录
    const [editRecord, setEditRecord] = useState<any>(null);

    // 处理编辑表单提交
    const handleEditSubmit = async () => {
        try {
            await updateUser.mutateAsync({
                id: editRecord.id,
                isWinner: editRecord.isWinner,
                prizeId: editRecord.prizeId || null,
                activityId: editRecord.activityId,
                drawAt: editRecord.drawAt || null,
                winAt: editRecord.winAt || null,
            });

            setIsEditModalOpen(false);
            setEditRecord(null);
        } catch (error) {
            console.error('更新失败:', error);
            message.error('更新失败');
        }
    };

    // 编辑用户确认
    const handleEditOk = async () => {
        handleEditSubmit();
    };

    // 编辑用户取消
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setEditRecord(null);
    };

    // 处理编辑记录字段更改
    const handleFieldChange = (field, value) => {
        setEditRecord((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div
            style={{
                border: '1px solid #e8e8e8',
                borderRadius: '10px',
                padding: '10px',
            }}
        >
            <div style={{ paddingLeft: '10px' }}>
                <Typography.Title level={5}>报名用户</Typography.Title>
                <Input
                    style={{ width: '20%', marginRight: 10 }}
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <Button type="primary" onClick={handleSubmit}>
                    报名
                </Button>
            </div>

            <div
                style={{
                    border: '2px solid #e8e8e8',
                    marginTop: '20px',
                    padding: '10px',
                    borderRadius: '10px',
                }}
            >
                <Typography.Title level={5}>报名情况</Typography.Title>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{
                        current: prizeList?.pagination.page || page,
                        pageSize: prizeList?.pagination.pageSize || pageSize,
                        total: prizeList?.pagination.total || 0,
                        showSizeChanger: true,
                    }}
                    loading={isFetching}
                    onChange={handleTableChange}
                />
            </div>

            {/* 编辑用户弹窗 */}
            <Modal
                title="编辑用户"
                open={isEditModalOpen}
                okText="确认"
                cancelText="取消"
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                {editRecord && (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{ display: 'inline-block', width: 80 }}
                            >
                                手机号:
                            </label>
                            <span>{editRecord.phone}</span>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{ display: 'inline-block', width: 80 }}
                            >
                                秘钥:
                            </label>
                            <span>{editRecord.secret}</span>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{ display: 'inline-block', width: 80 }}
                            >
                                状态:
                            </label>
                            <Select
                                style={{ width: 120 }}
                                value={editRecord.status}
                                onChange={(value) =>
                                    handleFieldChange('status', value)
                                }
                            >
                                <Select.Option value={0}>未抽奖</Select.Option>
                                <Select.Option value={1}>已抽奖</Select.Option>
                            </Select>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{ display: 'inline-block', width: 80 }}
                            >
                                是否中奖:
                            </label>
                            <Select
                                style={{ width: 120 }}
                                value={editRecord.isWinner}
                                onChange={(value) =>
                                    handleFieldChange('isWinner', value)
                                }
                            >
                                <Select.Option value={false}>
                                    未中奖
                                </Select.Option>
                                <Select.Option value={true}>中奖</Select.Option>
                            </Select>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{ display: 'inline-block', width: 80 }}
                            >
                                奖品:
                            </label>
                            <Select
                                style={{ width: 200 }}
                                value={editRecord.prizeId || undefined}
                                onChange={(value) =>
                                    handleFieldChange('prizeId', value)
                                }
                                placeholder="选择奖品"
                                allowClear
                            >
                                {prizesData?.data.map((prize) => (
                                    <Select.Option
                                        key={prize.id}
                                        value={prize.id}
                                    >
                                        {prize.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{ display: 'inline-block', width: 80 }}
                            >
                                活动:
                            </label>
                            <Select
                                style={{ width: 200 }}
                                value={editRecord.activityId}
                                onChange={(value) =>
                                    handleFieldChange('activityId', value)
                                }
                                placeholder="选择活动"
                            >
                                {activitiesData?.data.map((activity) => (
                                    <Select.Option
                                        key={activity.id}
                                        value={activity.id}
                                    >
                                        {activity.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{ display: 'inline-block', width: 80 }}
                            >
                                抽奖时间:
                            </label>
                            <DatePicker
                                showTime
                                value={
                                    editRecord.drawAt
                                        ? dayjs(editRecord.drawAt)
                                        : null
                                }
                                onChange={(date) =>
                                    handleFieldChange(
                                        'drawAt',
                                        date?.toDate() || null
                                    )
                                }
                                style={{ width: 200 }}
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{ display: 'inline-block', width: 80 }}
                            >
                                中奖时间:
                            </label>
                            <DatePicker
                                showTime
                                value={
                                    editRecord.winAt
                                        ? dayjs(editRecord.winAt)
                                        : null
                                }
                                onChange={(date) =>
                                    handleFieldChange(
                                        'winAt',
                                        date?.toDate() || null
                                    )
                                }
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* 删除确认弹窗 */}
            <Modal
                title="确认删除吗？"
                open={isModalOpen}
                okText="确认删除"
                cancelText="取消"
                onOk={handleDeleteOk}
                onCancel={handleCancel}
            >
                <p>此操作不可撤销，确定要删除这条记录吗？</p>
            </Modal>
        </div>
    );
}
