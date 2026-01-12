import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
    superAdminProcedure,
} from '@/server/api/trpc';
import { z } from 'zod';

// 增删改查接口
export const visitLogRouter = createTRPCRouter({
    // 创建访问记录
    create: publicProcedure
        .input(
            z.object({
                url: z.string(),
                referrer: z.string().optional(),
                userAgent: z.string().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            // 获取IP（通过ctx.headers）
            const ip =
                ctx.headers['x-forwarded-for']?.toString().split(',')[0] || '';
            return ctx.db.visitLog.create({
                data: {
                    userId: ctx.session?.user?.id,
                    ipAddress: ip,
                    url: input.url,
                    referrer: input.referrer,
                    userAgent: input.userAgent,
                },
            });
        }),

    // 查询单条
    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            return ctx.db.visitLog.findUnique({
                where: { id: input.id },
            });
        }),

    // 查询列表（分页）
    list: protectedProcedure
        .input(
            z.object({
                page: z.number().default(1),
                pageSize: z.number().default(20),
            })
        )
        .query(async ({ input, ctx }) => {
            const { page, pageSize } = input;
            const logs = await ctx.db.visitLog.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            });
            const total = await ctx.db.visitLog.count();
            return { logs, total };
        }),

    // 更新
    update: superAdminProcedure
        .input(
            z.object({
                id: z.string(),
                url: z.string().optional(),
                referrer: z.string().optional(),
                userAgent: z.string().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            return ctx.db.visitLog.update({
                where: { id: input.id },
                data: {
                    url: input.url,
                    referrer: input.referrer,
                    userAgent: input.userAgent,
                },
            });
        }),

    // 删除
    delete: superAdminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            return ctx.db.visitLog.delete({
                where: { id: input.id },
            });
        }),
});
