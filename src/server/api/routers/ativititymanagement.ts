import { z } from 'zod';
import {
    createTRPCRouter,
    protectedProcedure,
    superAdminProcedure,
    publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const activityManagementRouter = createTRPCRouter({
    // 获取所有活动
    getAllActivities: publicProcedure.query(async ({ ctx }) => {
        try {
            const data = await ctx.db.activity.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return {
                data,
                total: data.length,
            };
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取活动列表失败',
                cause: error,
            });
        }
    }),

    // 获取单个活动
    getActivityById: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            try {
                const activity = await ctx.db.activity.findUnique({
                    where: { id: input.id },
                });

                if (!activity) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '活动不存在',
                    });
                }

                return activity;
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '获取活动详情失败',
                    cause: error,
                });
            }
        }),

    // 创建新活动
    createActivity: superAdminProcedure
        .input(
            z.object({
                name: z
                    .string()
                    .min(1, '活动名称不能为空')
                    .max(200, '活动名称不能超过200字符'),
                text: z.string().optional(),
                rule: z.string().optional(), // 添加了rule字段
                startAt: z.date(),
                endAt: z.date(),
                image: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            console.log('input:', input);
            try {
                // 验证时间范围
                if (input.startAt >= input.endAt) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: '结束时间必须晚于开始时间',
                    });
                }

                const data = await ctx.db.activity.create({
                    data: {
                        name: input.name,
                        text: input.text || null,
                        rule: input.rule || null, // 使用rule字段
                        startAt: input.startAt,
                        endAt: input.endAt,
                        image: input.image || null,
                    },
                });
                return data;
            } catch (error) {
                console.error('创建活动错误:', error);
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '创建活动失败',
                    cause: error,
                });
            }
        }),

    // 更新活动
    updateActivity: superAdminProcedure
        .input(
            z.object({
                id: z.string(),
                name: z
                    .string()
                    .min(1, '活动名称不能为空')
                    .max(200, '活动名称不能超过200字符'),
                text: z.string().optional(),
                rule: z.string().optional(), // 添加了rule字段
                startAt: z.date(),
                endAt: z.date(),
                image: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                // 验证活动是否存在
                const existingActivity = await ctx.db.activity.findUnique({
                    where: { id: input.id },
                });

                if (!existingActivity) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '活动不存在',
                    });
                }

                // 验证时间范围
                if (input.startAt >= input.endAt) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: '结束时间必须晚于开始时间',
                    });
                }

                const data = await ctx.db.activity.update({
                    where: { id: input.id },
                    data: {
                        name: input.name,
                        text: input.text || null,
                        rule: input.rule || null, // 使用rule字段
                        startAt: input.startAt,
                        endAt: input.endAt,
                        image: input.image || null,
                    },
                });
                return data;
            } catch (error) {
                console.error('更新活动错误:', error);
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '更新活动失败',
                    cause: error,
                });
            }
        }),

    // 删除活动
    deleteActivity: superAdminProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                // 验证活动是否存在
                const existingActivity = await ctx.db.activity.findUnique({
                    where: { id: input.id },
                });

                if (!existingActivity) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '活动不存在',
                    });
                }

                await ctx.db.activity.delete({
                    where: { id: input.id },
                });

                return { success: true, message: '活动删除成功' };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '删除活动失败',
                    cause: error,
                });
            }
        }),
});
