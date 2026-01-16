'use client';

import React, { useState, useEffect } from 'react';
import {
    Image,
    Table,
    Button,
    Modal,
    Input,
    Form,
    Select,
    message,
    Space,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { api } from '@/trpc/react';
import dayjs from 'dayjs';
import ImageUpload from '../_components/ImageUpload'; // 导入ImageUpload组件

export default function MyPrizeManagementPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPrize, setEditingPrize] = useState(null);
    const [form] = Form.useForm();

    const {
        data: prizesData,
        isLoading: prizesLoading,
        refetch,
    } = api.myPrize.getAllPrizes.useQuery(); // 修改为正确的API路径

    const createPrizeMutation = api.myPrize.createPrize.useMutation(); // 修改为正确的API路径
    const updatePrizeMutation = api.myPrize.updatePrize.useMutation(); // 修改为正确的API路径
    const deletePrizeMutation = api.myPrize.deletePrize.useMutation(); // 修改为正确的API路径

    // 获取所有活动用于选择
    const { data: activitiesData } = api.activity.getAllActivities.useQuery();

    const prizes = prizesData?.data || [];
    const activities = activitiesData?.data || [];

    const showModal = () => {
        setEditingPrize(null);
        form.resetFields();
        setIsModalVisible(true);

        // 使用setTimeout确保模态框完全渲染后再聚焦到第一个输入框
        setTimeout(() => {
            const firstInput = document.querySelector('.ant-modal input');
            if (firstInput && firstInput instanceof HTMLElement) {
                firstInput.focus();
            }
        }, 0);
    };

    const handleEdit = (prize) => {
        setEditingPrize(prize);
        form.setFieldsValue({
            ...prize,
        });

        setIsModalVisible(true);

        // 使用setTimeout确保模态框完全渲染后再聚焦到第一个输入框
        setTimeout(() => {
            const firstInput = document.querySelector('.ant-modal input');
            if (firstInput && firstInput instanceof HTMLElement) {
                firstInput.focus();
            }
        }, 0);
    };

    const handleDelete = async (id) => {
        try {
            await deletePrizeMutation.mutateAsync({ id });
            message.success('奖品删除成功');
            refetch();
        } catch (error) {
            console.error('删除奖品错误:', error);
            message.error('奖品删除失败');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // 构建提交数据
            const submitData = {
                ...values,
            };

            if (editingPrize) {
                // 更新现有奖品
                await updatePrizeMutation.mutateAsync({
                    id: editingPrize.id,
                    ...submitData,
                });
                message.success('奖品更新成功');
            } else {
                // 创建新奖品
                await createPrizeMutation.mutateAsync(submitData);
                message.success('奖品创建成功');
            }

            setIsModalVisible(false);
            form.resetFields();
            refetch(); // 刷新数据
        } catch (error) {
            console.error('表单验证失败或API调用错误:', error);
            if (error instanceof Error) {
                message.error(`操作失败: ${error.message}`);
            } else {
                message.error('操作失败，请检查输入数据');
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    // 定义表格列配置
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '奖品名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '奖品图片',
            dataIndex: 'image',
            key: 'image',
            render: (image) => {
                return (
                    <div style={{ width: '60px', height: '60px' }}>
                        {image ? (
                            <Image
                                src={image}
                                alt={image}
                                style={{ width: '100%', height: '100%' }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                无图片
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: '奖品描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '所属活动',
            dataIndex: ['activity', 'name'], // 显示关联活动的名称
            key: 'activityName',
        },
        {
            title: '活动ID',
            dataIndex: 'activityId',
            key: 'activityId',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) =>
                createdAt
                    ? dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
                    : '-',
        },
        {
            title: '操作',
            key: 'operation',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div
            style={{
                padding: '20px',
                border: '1px solid #e8e8e8',
                borderRadius: '10px',
            }}
        >
            <div
                style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                }}
            >
                奖品管理
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                >
                    添加奖品
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={prizes}
                rowKey="id"
                loading={prizesLoading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                }}
            />

            <Modal
                title={editingPrize ? '编辑奖品' : '添加奖品'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="确定"
                cancelText="取消"
                forceRender={true} // 强制渲染内容
                confirmLoading={
                    editingPrize
                        ? updatePrizeMutation.isPending
                        : createPrizeMutation.isPending
                }
                destroyOnHidden={true}
            >
                {isModalVisible && (
                    <Form
                        form={form} // 确保连接到useForm实例
                        layout="vertical"
                        initialValues={{
                            name: '',
                            description: '',
                            activityId: '',
                        }}
                    >
                        <Form.Item
                            label="奖品名称"
                            name="name"
                            rules={[
                                { required: true, message: '请输入奖品名称' },
                            ]}
                        >
                            <Input placeholder="请输入奖品名称" />
                        </Form.Item>

                        <Form.Item label="奖品描述" name="description">
                            <Input.TextArea
                                rows={4}
                                placeholder="请输入奖品描述"
                            />
                        </Form.Item>

                        <Form.Item
                            label="所属活动"
                            name="activityId"
                            rules={[{ required: true, message: '请选择活动' }]}
                        >
                            <Select placeholder="请选择活动" allowClear>
                                {activities.map((activity) => (
                                    <Select.Option
                                        key={activity.id}
                                        value={activity.id}
                                    >
                                        {activity.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="奖品图片" name="image">
                            <ImageUpload
                                value={form.getFieldValue('image')}
                                onChange={(value) =>
                                    form.setFieldsValue({ image: value })
                                }
                                folder="prizes"
                                placeholder="点击上传奖品图片"
                                disabled={
                                    editingPrize
                                        ? updatePrizeMutation.isPending
                                        : createPrizeMutation.isPending
                                }
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
}
