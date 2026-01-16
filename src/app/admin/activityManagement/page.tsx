'use client';
//这个是活动管理页面
//用antd的组件
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Image,
    message,
} from 'antd';
import { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import ImageUpload from '../_components/ImageUpload';
import dayjs from 'dayjs';

export default function ActivityManagementPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // 区分编辑和新建
    const [selectedRecord, setSelectedRecord] = useState(null);

    // 创建表单实例
    const [form] = Form.useForm();

    // 使用TRPC查询获取所有活动
    const {
        data: getAllActivities,
        isLoading: activitiesLoading,
        refetch,
    } = api.activity.getAllActivities.useQuery();

    // TRPC mutations
    const createActivityMutation = api.activity.createActivity.useMutation();
    const updateActivityMutation = api.activity.updateActivity.useMutation();
    const deleteActivityMutation = api.activity.deleteActivity.useMutation();

    // 初始化表格数据
    useEffect(() => {
        if (getAllActivities?.data) {
            const formattedData = getAllActivities.data.map((activity) => ({
                ...activity,
                key: activity.id, // 添加key用于表格
                startAt: dayjs(activity.startAt),
                endAt: dayjs(activity.endAt),
            }));
            setDataSource(formattedData);
        }
    }, [getAllActivities]);

    // 状态管理
    const [dataSource, setDataSource] = useState([]);

    const showModal = () => {
        setIsEditing(false);
        setSelectedRecord(null);
        form.resetFields(); // 重置表单

        // 确保在下一次渲染周期后再打开模态框
        setTimeout(() => {
            setIsModalOpen(true);
        }, 0);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // 处理日期格式转换为Date对象，确保字段与后端API一致
            const processedData = {
                ...values,
                startAt: values.startAt
                    ? new Date(values.startAt.toISOString())
                    : new Date(),
                endAt: values.endAt
                    ? new Date(values.endAt.toISOString())
                    : new Date(),
            };

            if (isEditing && selectedRecord) {
                // 编辑活动
                await updateActivityMutation.mutateAsync({
                    id: selectedRecord.id,
                    ...processedData,
                });
                message.success('活动更新成功');
            } else {
                // 创建新活动

                await createActivityMutation.mutateAsync(processedData);
                message.success('活动创建成功');
            }

            // 刷新数据
            refetch();

            // 关闭模态框
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('表单验证失败或API调用错误:', error);
            message.error('操作失败，请检查输入信息');
        }
    };

    const handleEdit = (record) => {
        setIsEditing(true);
        setSelectedRecord(record);

        // 设置表单初始值
        form.setFieldsValue({
            ...record,
            startAt: record.startAt ? dayjs(record.startAt) : null,
            endAt: record.endAt ? dayjs(record.endAt) : null,
        });

        // 确保在下一次渲染周期后再打开模态框
        setTimeout(() => {
            setIsModalOpen(true);
        }, 0);
    };

    const handleDelete = async (record) => {
        try {
            await deleteActivityMutation.mutateAsync({ id: record.id });
            message.success('活动删除成功');
            refetch(); // 刷新数据
        } catch (error) {
            console.error('删除活动失败:', error);
            message.error('删除活动失败');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const columns = [
        {
            title: '活动名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '海报',
            dataIndex: 'image',
            key: 'image',
            render(image: string) {
                return (
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            overflow: 'hidden',
                        }}
                    >
                        {image ? (
                            <Image
                                src={image}
                                alt="活动海报"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                fallback="/images/default-image.png" // 替换为默认图片路径
                            />
                        ) : (
                            <span>暂无图片</span>
                        )}
                    </div>
                );
            },
        },
        {
            title: '内容',
            dataIndex: 'text',
            key: 'text',
        },
        {
            title: '规则',
            dataIndex: 'rule',
            key: 'rule',
        },
        {
            title: '开始时间',
            dataIndex: 'startAt',
            key: 'startAt',
            render: (startAt) =>
                startAt ? dayjs(startAt).format('YYYY-MM-DD HH:mm:ss') : '-',
        },
        {
            title: '结束时间',
            dataIndex: 'endAt',
            key: 'endAt',
            render: (endAt) =>
                endAt ? dayjs(endAt).format('YYYY-MM-DD HH:mm:ss') : '-',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => (
                <div>
                    <Button
                        type="primary"
                        style={{ marginRight: '10px' }}
                        onClick={() => handleEdit(record)}
                        loading={updateActivityMutation.isPending} // 修正为isPending
                    >
                        编辑
                    </Button>
                    <Button
                        danger
                        onClick={() => handleDelete(record)}
                        loading={deleteActivityMutation.isPending} // 修正为isPending
                    >
                        删除
                    </Button>
                </div>
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
                活动管理
            </div>
            <div style={{ marginBottom: '20px' }}>
                <Button
                    type="primary"
                    onClick={showModal}
                    loading={
                        createActivityMutation.isPending ||
                        updateActivityMutation.isPending
                    } // 修正为isPending
                >
                    添加活动
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={activitiesLoading}
                rowKey="id" // 使用id作为唯一标识
            />

            {/* 使用 forceRender 确保 Form 始终存在 */}
            <Modal
                title={isEditing ? '编辑活动' : '添加活动'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={isEditing ? '更新' : '创建'}
                cancelText="取消"
                confirmLoading={
                    createActivityMutation.isPending ||
                    updateActivityMutation.isPending
                } // 修正为isPending
                destroyOnHidden={true}
            >
                {isModalOpen && (
                    <Form
                        form={form} // 将form实例传递给Form组件
                        layout="vertical"
                    >
                        <Form.Item
                            label="活动名称"
                            name="name"
                            rules={[
                                { required: true, message: '请输入活动名称' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="活动海报" name="image">
                            <ImageUpload
                                value={form.getFieldValue('image') || ''}
                                onChange={(value) =>
                                    form.setFieldsValue({ image: value })
                                }
                                disabled={
                                    createActivityMutation.isPending ||
                                    updateActivityMutation.isPending
                                } // 修正为isPending
                            />
                        </Form.Item>

                        <Form.Item
                            label="活动内容"
                            name="text"
                            rules={[
                                { required: true, message: '请输入活动内容' },
                            ]}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="请输入活动详细内容"
                            />
                        </Form.Item>

                        <Form.Item
                            label="活动规则"
                            name="rule"
                            rules={[
                                { required: true, message: '请输入活动规则' },
                            ]}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="请输入活动规则"
                            />
                        </Form.Item>

                        <Form.Item
                            label="开始时间"
                            name="startAt"
                            rules={[
                                { required: true, message: '请选择开始时间' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        // 检查value是否为有效的dayjs对象
                                        if (value && dayjs.isDayjs(value)) {
                                            const endAt =
                                                getFieldValue('endAt');
                                            if (endAt && dayjs.isDayjs(endAt)) {
                                                if (
                                                    value.isBefore(endAt) ||
                                                    value.isSame(endAt)
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        '开始时间不能晚于结束时间'
                                                    )
                                                );
                                            }
                                        }
                                        // 如果任一值无效，则不进行比较
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: '100%' }}
                                placeholder="选择开始时间"
                            />
                        </Form.Item>

                        <Form.Item
                            label="结束时间"
                            name="endAt"
                            rules={[
                                { required: true, message: '请选择结束时间' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        // 检查value是否为有效的dayjs对象
                                        if (value && dayjs.isDayjs(value)) {
                                            const startAt =
                                                getFieldValue('startAt');
                                            if (
                                                startAt &&
                                                dayjs.isDayjs(startAt)
                                            ) {
                                                if (
                                                    value.isAfter(startAt) ||
                                                    value.isSame(startAt)
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        '结束时间不能早于开始时间'
                                                    )
                                                );
                                            }
                                        }
                                        // 如果任一值无效，则不进行比较
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: '100%' }}
                                placeholder="选择结束时间"
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
}
