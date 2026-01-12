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
} from 'antd';
import { api } from '@/trpc/react';

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

    //删除用户接口
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

    const prizeSeries = [
        { value: '', label: '' },
        { value: 'ticket', label: '20% Off Coupon as a Prize' },
    ];

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
                    {isWinner === true ? '已抽' : '未抽'}
                </Tag>
            ),
        },
        {
            title: '奖品',
            dataIndex: 'prize',
            key: 'prize',
            render: (_, data) => (
                <div>
                    <Select
                        style={{ width: '100px' }}
                        defaultValue={data.prize}
                        options={prizeSeries}
                        placeholder="请选择奖品"
                        onChange={(value) => handleChangePrize(data, value)}
                    />
                </div>
            ),
        },
        {
            title: '参与时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => new Date(createdAt).toLocaleString(),
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
                        onClick={() => handleUserEdit()}
                    >
                        编辑
                    </Button>
                    <Modal
                        title="编辑用户"
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        mask={{ enabled: false, blur: true }}
                        open={isEditModalOpen}
                        okText="确认"
                        cancelText="取消"
                        onOk={handleEditOk}
                        onCancel={handleEditCancel}
                    ></Modal>
                    <Button danger onClick={() => handleUserDelete(data)}>
                        删除
                    </Button>
                    <Modal
                        title="确认删除吗？"
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        mask={{ enabled: false, blur: true }}
                        open={isModalOpen}
                        okText="确认删除"
                        cancelText="取消"
                        onOk={handleDeleteOk}
                        onCancel={handleCancel}
                    ></Modal>
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

    //更新用户信息接口
    const updateUser = api.prize.update.useMutation({
        onSuccess: () => {
            message.success('更新成功');
            refetch();
        },
    });

    // 奖品选择处理
    const handleChangePrize = (data, value) => {
        let idUser = data.id;
        setUserPrize(value);
        setUserId(idUser);
        console.log(data);
    };

    // 提交报名
    const handleSubmit = async () => {
        if (!phone) {
            message.warning('请输入手机号');
            return;
        }
        const mutation = await createPrize.mutateAsync({ phone });
    };
    // 分页处理
    const handleTableChange = (pagination) => {
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    //确定删除用户
    const handleDeleteOk = async () => {
        let res = await deletePrize.mutateAsync({ id: userId });
        if (res) {
            setIsModalOpen(false);
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    //删除按钮
    const handleUserDelete = (value) => {
        setUserId(value?.id);
        showModal();
    };

    //编辑用户
    const handleUserEdit = async () => {
        console.log('value:', userPrize);
        console.log('id:', userId);

        await updateUser.mutateAsync({
            id: userId,
            prize: userPrize,
            isWinner: true,
        });
    };

    // 编辑用户确认
    const handleEditOk = async () => {
        // let res = await editPrize.mutateAsync({ id: userId, phone });
        // if (res) {
        //     setIsModalOpen(false);
        // }
    };
    // 编辑用户取消
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
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
        </div>
    );
}
