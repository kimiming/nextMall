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
        .input(z.object({ phone: z.string() }))
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
            const data = await ctx.db.lottery.findMany({
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
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

    // 3. 修改表格数据
    update: superAdminProcedure
        .input(
            z.object({
                id: z.string(),
                phone: z.string().min(11).max(11).optional(),
                status: z.number().optional(),
                isWinner: z.boolean().optional(),
                prize: z.string().optional(),
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
                    ...(input.prize && { prize: input.prize }),
                },
            });
            return data;
        }),

    // 4. 删除某条数据
    delete: superAdminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.lottery.delete({ where: { id: input.id } });
        }),

    // 5. 输入口令参与抽奖
    draw: publicProcedure
        .input(z.object({ secret: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const record = await ctx.db.lottery.findFirst({
                where: { secret: input.secret },
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
            // 这里可以加中奖逻辑，比如随机
            const isWinner = Math.random() < 0.1; // 10%概率中奖
            const updated = await ctx.db.lottery.update({
                where: { id: record.id },
                data: {
                    status: 1,
                    isWinner,
                },
            });
            return updated;
        }),

    // 6. 根据手机号码查询我的奖品
    myPrize: publicProcedure
        .input(z.object({ phone: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const record = await ctx.db.lottery.findFirst({
                where: { phone: input.phone },
            });
            if (!record) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'no prize',
                });
            }
            return record;
        }),
});
