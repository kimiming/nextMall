'use client';
//引用antd 的antd组件
import { Image, Table, Button, Modal, Input, DatePicker, message } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { trpc } from '@/app/_components/trpc';
import ImageUpload from '../_components/ImageUpload'; // 导入ImageUpload组件

export default function WhatsAppManagementPage() {
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formValues, setFormValues] = useState({
        id: '',
        phone: '',
        name: '',
        image: '',
        text: '',
    });

    // 获取WhatsApp号码列表
    const {
        data: wsNumbers,
        refetch,
        isLoading,
    } = trpc.wsNumber.list.useQuery({
        page: 1,
        pageSize: 100, // 获取所有记录
    });

    // 删除WhatsApp号码
    const deleteMutation = trpc.wsNumber.delete.useMutation({
        onSuccess: () => {
            message.success('删除成功');
            refetch();
        },
        onError: (error) => {
            message.error(`删除失败: ${error.message}`);
        },
    });

    // 创建WhatsApp号码
    const createMutation = trpc.wsNumber.create.useMutation({
        onSuccess: () => {
            message.success('创建成功');
            refetch();
            setIsModalVisible(false);
            resetForm();
        },
        onError: (error) => {
            message.error(`创建失败: ${error.message}`);
        },
    });

    // 更新WhatsApp号码
    const updateMutation = trpc.wsNumber.update.useMutation({
        onSuccess: () => {
            message.success('更新成功');
            refetch();
            setIsModalVisible(false);
            resetForm();
        },
        onError: (error) => {
            message.error(`更新失败: ${error.message}`);
        },
    });

    // 重置表单
    const resetForm = () => {
        setFormValues({
            id: '',
            phone: '',
            name: '',
            image: '',
            text: '',
        });
        setEditingRecord(null);
    };

    // 打开新增模态框
    const handleAdd = () => {
        resetForm();
        setIsModalVisible(true);
    };

    // 打开编辑模态框
    const handleEdit = (record: any) => {
        setEditingRecord(record);
        setFormValues({
            id: record.id,
            phone: record.phone,
            name: record.name || '',
            image: record.image || '',
            text: record.text || '',
        });
        setIsModalVisible(true);
    };

    // 处理表单提交
    const handleSubmit = () => {
        if (editingRecord) {
            // 更新现有记录
            updateMutation.mutate({
                id: formValues.id,
                phone: formValues.phone,
                name: formValues.name,
                image: formValues.image,
                text: formValues.text,
            });
        } else {
            // 创建新记录
            createMutation.mutate({
                phone: formValues.phone,
                name: formValues.name,
                image: formValues.image,
                text: formValues.text,
            });
        }
    };

    // 处理删除
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个WhatsApp号码吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                deleteMutation.mutate({ id });
            },
        });
    };

    // 表单布局
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    // 根据这几个字段创建columns和dataSource
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '头像',
            dataIndex: 'image',
            key: 'image',
            render(image: string) {
                if (!image) return <span>-</span>;
                return (
                    <div style={{ width: '60px', height: '60px' }}>
                        <Image
                            src={image}
                            alt={image}
                            style={{ width: '100%', height: '100%' }}
                            fallback="/uploads/images/default-avatar.png"
                        />
                    </div>
                );
            },
        },
        {
            title: '文本',
            dataIndex: 'text',
            key: 'text',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render(_: any, record: any) {
                return (
                    <div>
                        <Button
                            onClick={() => handleEdit(record)}
                            type="primary"
                            size="small"
                        >
                            编辑
                        </Button>
                        <Button
                            onClick={() => handleDelete(record.id)}
                            style={{ marginLeft: '10px' }}
                            danger
                            size="small"
                        >
                            删除
                        </Button>
                    </div>
                );
            },
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
                WhatsApp号码管理
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Button type="primary" onClick={handleAdd}>
                    添加WhatsApp号码
                </Button>
                <span style={{ marginLeft: '10px', color: 'red' }}>
                    （注意：目前只支持添加一个WhatsApp号码）
                </span>
            </div>
            <Table
                columns={columns}
                dataSource={wsNumbers?.data || []}
                rowKey="id"
                loading={isLoading}
            />

            {/* 编辑/新增模态框 */}
            <Modal
                title={editingRecord ? '编辑WhatsApp号码' : '新增WhatsApp号码'}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    resetForm();
                }}
                onOk={handleSubmit}
                okText="保存"
                cancelText="取消"
                confirmLoading={
                    createMutation.isPending || updateMutation.isPending
                }
            >
                <div style={{ marginTop: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            style={{
                                display: 'inline-block',
                                width: '100px',
                                textAlign: 'right',
                                marginRight: '10px',
                            }}
                        >
                            手机号:
                        </label>
                        <Input
                            value={formValues.phone}
                            onChange={(e) =>
                                setFormValues({
                                    ...formValues,
                                    phone: e.target.value,
                                })
                            }
                            placeholder="请输入手机号"
                            style={{ width: '250px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            style={{
                                display: 'inline-block',
                                width: '100px',
                                textAlign: 'right',
                                marginRight: '10px',
                            }}
                        >
                            名字:
                        </label>
                        <Input
                            value={formValues.name}
                            onChange={(e) =>
                                setFormValues({
                                    ...formValues,
                                    name: e.target.value,
                                })
                            }
                            placeholder="请输入名字"
                            style={{ width: '250px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            style={{
                                display: 'inline-block',
                                width: '100px',
                                textAlign: 'right',
                                marginRight: '10px',
                            }}
                        >
                            头像:
                        </label>
                        <div
                            style={{ display: 'inline-block', width: '250px' }}
                        >
                            <ImageUpload
                                value={formValues.image}
                                onChange={(value) =>
                                    setFormValues({
                                        ...formValues,
                                        image: value as string,
                                    })
                                }
                                disabled={
                                    createMutation.isPending ||
                                    updateMutation.isPending
                                }
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            style={{
                                display: 'inline-block',
                                width: '100px',
                                textAlign: 'right',
                                marginRight: '10px',
                            }}
                        >
                            文本:
                        </label>
                        <Input.TextArea
                            value={formValues.text}
                            onChange={(e) =>
                                setFormValues({
                                    ...formValues,
                                    text: e.target.value,
                                })
                            }
                            placeholder="请输入文本"
                            rows={4}
                            style={{ width: '250px' }}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
