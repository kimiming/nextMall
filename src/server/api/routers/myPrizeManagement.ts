import { z } from 'zod';
import {
    createTRPCRouter,
    protectedProcedure,
    superAdminProcedure,
    publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const myPrizeManagementRouter = createTRPCRouter({
    // 获取所有奖品
    getAllPrizes: publicProcedure.query(async ({ ctx }) => {
        try {
            const data = await ctx.db.prize.findMany({
                include: {
                    activity: true, // 包含关联的活动信息
                },
                orderBy: { createdAt: 'desc' },
            });
            return {
                data,
                total: data.length,
            };
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: '获取奖品列表失败',
                cause: error,
            });
        }
    }),

    // 获取单个奖品
    getPrizeById: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            try {
                const prize = await ctx.db.prize.findUnique({
                    where: { id: input.id },
                    include: {
                        activity: true,
                    },
                });

                if (!prize) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '奖品不存在',
                    });
                }

                return prize;
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '获取奖品详情失败',
                    cause: error,
                });
            }
        }),

    // 创建新奖品
    createPrize: superAdminProcedure
        .input(
            z.object({
                name: z
                    .string()
                    .min(1, '奖品名称不能为空')
                    .max(200, '奖品名称不能超过200字符'),
                image: z.string().optional(),
                description: z.string().optional(),
                activityId: z.string().min(1, '活动ID不能为空'),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                // 验证活动是否存在
                const activity = await ctx.db.activity.findUnique({
                    where: { id: input.activityId },
                });

                if (!activity) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '活动不存在',
                    });
                }

                const data = await ctx.db.prize.create({
                    data: {
                        name: input.name,
                        image: input.image || null,
                        description: input.description || null,
                        activityId: input.activityId,
                    },
                    include: {
                        activity: true,
                    },
                });
                return data;
            } catch (error) {
                console.error('创建奖品错误:', error);
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '创建奖品失败',
                    cause: error,
                });
            }
        }),

    // 更新奖品
    updatePrize: superAdminProcedure
        .input(
            z.object({
                id: z.string(),
                name: z
                    .string()
                    .min(1, '奖品名称不能为空')
                    .max(200, '奖品名称不能超过200字符'),
                image: z.string().optional(),
                description: z.string().optional(),
                activityId: z.string().min(1, '活动ID不能为空'),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                // 验证奖品是否存在
                const existingPrize = await ctx.db.prize.findUnique({
                    where: { id: input.id },
                });

                if (!existingPrize) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '奖品不存在',
                    });
                }

                // 验证活动是否存在
                const activity = await ctx.db.activity.findUnique({
                    where: { id: input.activityId },
                });

                if (!activity) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '活动不存在',
                    });
                }

                const data = await ctx.db.prize.update({
                    where: { id: input.id },
                    data: {
                        name: input.name,
                        image: input.image || null,
                        description: input.description || null,
                        activityId: input.activityId,
                    },
                    include: {
                        activity: true,
                    },
                });
                return data;
            } catch (error) {
                console.error('更新奖品错误:', error);
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '更新奖品失败',
                    cause: error,
                });
            }
        }),

    // 删除奖品
    deletePrize: superAdminProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                // 验证奖品是否存在
                const existingPrize = await ctx.db.prize.findUnique({
                    where: { id: input.id },
                });

                if (!existingPrize) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: '奖品不存在',
                    });
                }

                await ctx.db.prize.delete({
                    where: { id: input.id },
                });

                return { success: true, message: '奖品删除成功' };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '删除奖品失败',
                    cause: error,
                });
            }
        }),
});
