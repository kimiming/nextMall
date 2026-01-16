import { z } from 'zod';
import {
    createTRPCRouter,
    protectedProcedure,
    superAdminProcedure,
    publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

// 生成唯一秘钥函数
function generateSecretKey(phone: string) {
    return Buffer.from(phone + Date.now())
        .toString('base64')
        .slice(0, 16);
}

export const lotteryRouter = createTRPCRouter({
    // 1. 创建口令（输入手机号生成秘钥并保存）
    create: protectedProcedure
        .input(
            z.object({
                phone: z.string(),
                activityId: z.string(), // 新增活动ID参数
            })
        )
        .mutation(async ({ ctx, input }) => {
            // 检查手机号是否已存在
            const exists = await ctx.db.lottery.findFirst({
                where: { phone: input.phone },
            });
            if (exists) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'This phone number has already generated a key.',
                });
            }
            const secret = generateSecretKey(input.phone);
            const data = await ctx.db.lottery.create({
                data: {
                    phone: input.phone,
                    secret,
                    status: 0, // 未抽奖
                    isWinner: false,
                    activityId: input.activityId, // 添加活动ID
                },
                include: {
                    activity: true, // 包含活动信息
                    prize: true, // 包含奖品信息
                },
            });
            return data;
        }),

    // 2. 获取所有数据（列表）
    list: publicProcedure
        .input(
            z
                .object({
                    page: z.number().min(1).optional().default(1),
                    pageSize: z.number().min(1).max(100).optional().default(10),
                })
                .optional()
        )
        .query(async ({ ctx, input }) => {
            const page = input?.page ?? 1;
            const pageSize = input?.pageSize ?? 10;
            const skip = (page - 1) * pageSize;
            const total = await ctx.db.lottery.count();

            // 包含关联关系的查询
            const data = await ctx.db.lottery.findMany({
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    activity: true, // 包含活动信息
                    prize: true, // 包含奖品信息
                },
            });
            return {
                data,
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize),
                },
            };
        }),
    // 3. 获取所有数据（不分页）
    listAll: publicProcedure.query(async ({ ctx }) => {
        const data = await ctx.db.lottery.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                activity: true, // 包含活动信息
                prize: true, // 包含奖品信息
            },
        });
        return {
            data,
            total: data.length,
        };
    }),

    // 3. 修改表格数据
    update: superAdminProcedure
        .input(
            z.object({
                id: z.string(),
                phone: z.string().min(11).max(11).optional(),
                status: z.number().optional(),
                isWinner: z.boolean().optional(),
                prizeId: z.string().optional(), // 奖品ID（修正：使用ID而不是字符串）
                activityId: z.string().optional(), // 活动ID
                drawAt: z.date().optional(), // 抽奖时间
                winAt: z.date().optional(), // 中奖时间
            })
        )
        .mutation(async ({ ctx, input }) => {
            const data = await ctx.db.lottery.update({
                where: { id: input.id },
                data: {
                    ...(input.phone && { phone: input.phone }),
                    ...(input.status !== undefined && { status: input.status }),
                    ...(input.isWinner !== undefined && {
                        isWinner: input.isWinner,
                    }),
                    ...(input.prizeId && { prizeId: input.prizeId }), // 修正：使用prizeId
                    ...(input.activityId && { activityId: input.activityId }),
                    ...(input.drawAt && { drawAt: input.drawAt }),
                    ...(input.winAt && { winAt: input.winAt }),
                },
                include: {
                    activity: true, // 包含活动信息
                    prize: true, // 包含奖品信息
                },
            });
            return data;
        }),

    // 4. 删除某条数据
    delete: superAdminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // 先查询要删除的记录以获取关联信息
            const recordToDelete = await ctx.db.lottery.findUnique({
                where: { id: input.id },
                include: {
                    activity: true,
                    prize: true,
                },
            });

            if (!recordToDelete) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Record not found',
                });
            }

            // 删除记录
            await ctx.db.lottery.delete({
                where: { id: input.id },
            });

            // 返回删除前的记录信息
            return recordToDelete;
        }),

    // 5. 输入口令参与抽奖
    draw: publicProcedure
        .input(z.object({ secret: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const record = await ctx.db.lottery.findFirst({
                where: { secret: input.secret },
                include: {
                    activity: true, // 包含活动信息
                    prize: true, // 包含奖品信息
                },
            });
            if (!record) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Invalid secret key.',
                });
            }
            if (record.status === 1) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message:
                        'This secret key has already participated in the lottery.',
                });
            }

            // 获取可用奖品 - 从相关活动中获取
            const availablePrizes = await ctx.db.prize.findMany({
                where: {
                    activityId: record.activityId, // 使用抽奖记录中的活动ID
                },
            });

            // 这里可以加中奖逻辑，比如随机
            let isWinner = false;
            let selectedPrizeId: string | null = null;

            if (availablePrizes.length > 0) {
                // 假设10%中奖率
                isWinner = Math.random() < 0.1;

                // 如果中奖，随机选择一个奖品
                if (isWinner) {
                    const randomIndex = Math.floor(
                        Math.random() * availablePrizes.length
                    );
                    selectedPrizeId = availablePrizes[randomIndex].id;
                }
            }

            const updated = await ctx.db.lottery.update({
                where: { id: record.id },
                data: {
                    status: 1,
                    isWinner,
                    drawAt: new Date(), // 设置抽奖时间
                    ...(isWinner &&
                        selectedPrizeId && {
                            winAt: new Date(), // 如果中奖则设置中奖时间
                            prizeId: selectedPrizeId, // 设置中奖奖品ID
                        }),
                },
                include: {
                    activity: true, // 包含活动信息
                    prize: true, // 包含奖品信息
                },
            });
            return updated;
        }),

    // 6. 根据手机号码查询我的奖品
    myPrize: publicProcedure
        .input(z.object({ phone: z.string() }))
        .query(async ({ ctx, input }) => {
            // 修正：使用query而不是mutation
            const record = await ctx.db.lottery.findFirst({
                where: { phone: input.phone },
                include: {
                    activity: true, // 包含活动信息
                    prize: true, // 包含奖品信息
                },
            });
            if (!record || !record.isWinner) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'no prize',
                });
            }
            return record;
        }),
});
